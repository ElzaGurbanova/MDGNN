import path from 'node:path'
import sirv from 'sirv'
import escapeHtml from 'escape-html'
import { FS_PREFIX } from '../../constants'
import {
  fsPathFromId,
  fsPathFromUrl,
  isFileReadable,
  isImportRequest,
  isInternalRequest,
  isParentDirectory,
  isSameFileUri,
  normalizePath,
  removeLeadingSlash,
  urlRE,
} from '../../utils'
import {
  cleanUrl,
  isWindows,
  slash,
  withTrailingSlash,
} from '../../../shared/utils'

const knownJavascriptExtensionRE = /\.(?:[tj]sx?|[cm][tj]s)$/

const sirvOptions = ({ getHeaders }) => ({
  dev: true,
  etag: true,
  extensions: [],
  setHeaders(res, pathname) {
    // Matches js, jsx, ts, tsx, mts, mjs, cjs, cts, ctx, mtx
    // .ts and .mts are reserved for video/mp2t but here we serve as JS.
    if (knownJavascriptExtensionRE.test(pathname)) {
      res.setHeader('Content-Type', 'text/javascript')
    }
    const headers = getHeaders()
    if (headers) {
      for (const name in headers) {
        res.setHeader(name, headers[name])
      }
    }
  },
})

export function servePublicMiddleware(server, publicFiles) {
  const dir = server.config.publicDir
  const serve = sirv(
    dir,
    sirvOptions({
      getHeaders: () => server.config.server.headers,
    }),
  )

  const toFilePath = (url) => {
    let filePath = cleanUrl(url)
    if (filePath.indexOf('%') !== -1) {
      try {
        filePath = decodeURI(filePath)
      } catch {
        /* malformed uri */
      }
    }
    return normalizePath(filePath)
  }

  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return function viteServePublicMiddleware(req, res, next) {
    // Skip if not in publicFiles, or internal/import requests, or ?url transforms
    if (
      (publicFiles && !publicFiles.has(toFilePath(req.url))) ||
      isImportRequest(req.url) ||
      isInternalRequest(req.url) ||
      urlRE.test(req.url)
    ) {
      return next()
    }
    serve(req, res, next)
  }
}

export function serveStaticMiddleware(server) {
  const dir = server.config.root
  const serve = sirv(
    dir,
    sirvOptions({
      getHeaders: () => server.config.server.headers,
    }),
  )

  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return function viteServeStaticMiddleware(req, res, next) {
    // Only serve non-HTML, non-directory requests; let HTML fall through
    const cleanedUrl = cleanUrl(req.url)
    if (
      cleanedUrl.endsWith('/') ||
      path.extname(cleanedUrl) === '.html' ||
      isInternalRequest(req.url) ||
      // skip URL starting with // (scheme-relative)
      req.url?.startsWith('//')
    ) {
      return next()
    }

    const url = new URL(req.url, 'http://example.com')
    const pathname = decodeURI(url.pathname)

    // apply aliases to static requests as well
    let redirectedPathname
    for (const { find, replacement } of server.config.resolve.alias) {
      const matches =
        typeof find === 'string'
          ? pathname.startsWith(find)
          : find.test(pathname)
      if (matches) {
        redirectedPathname = pathname.replace(find, replacement)
        break
      }
    }
    if (redirectedPathname) {
      // dir is pre-normalized to posix style
      if (redirectedPathname.startsWith(withTrailingSlash(dir))) {
        redirectedPathname = redirectedPathname.slice(dir.length)
      }
    }

    const resolvedPathname = redirectedPathname || pathname
    let fileUrl = path.resolve(dir, removeLeadingSlash(resolvedPathname))
    if (resolvedPathname.endsWith('/') && fileUrl[fileUrl.length - 1] !== '/') {
      fileUrl = withTrailingSlash(fileUrl)
    }
    if (!ensureServingAccess(fileUrl, server, res, next)) {
      return
    }

    if (redirectedPathname) {
      url.pathname = encodeURI(redirectedPathname)
      req.url = url.href.slice(url.origin.length)
    }

    serve(req, res, next)
  }
}

export function serveRawFsMiddleware(server) {
  const serveFromRoot = sirv(
    '/',
    sirvOptions({ getHeaders: () => server.config.server.headers }),
  )

  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return function viteServeRawFsMiddleware(req, res, next) {
    // Serve /@fs/ paths from the real FS root (with allow-list checks)
    if (req.url && req.url.startsWith(FS_PREFIX)) {
      const url = new URL(req.url, 'http://example.com')
      const pathname = decodeURI(url.pathname)
      // restrict files outside of `fs.allow`
      if (
        !ensureServingAccess(
          slash(path.resolve(fsPathFromId(pathname))),
          server,
          res,
          next,
        )
      ) {
        return
      }

      let newPathname = pathname.slice(FS_PREFIX.length)
      if (isWindows) newPathname = newPathname.replace(/^[A-Z]:/i, '')

      url.pathname = encodeURI(newPathname)
      req.url = url.href.slice(url.origin.length)
      serveFromRoot(req, res, next)
    } else {
      next()
    }
  }
}

/**
 * Check if the url is allowed to be served, via the `server.fs` config.
 * Supports both: (config, url) and (url, server)
 */
export function isFileServingAllowed(configOrUrl, urlOrServer) {
  const config =
    typeof urlOrServer === 'string' ? configOrUrl : urlOrServer.config
  const url = typeof urlOrServer === 'string' ? urlOrServer : configOrUrl

  if (!config.server.fs.strict) return true
  const filePath = fsPathFromUrl(url)
  return isFileLoadingAllowed(config, filePath)
}

function isUriInFilePath(uri, filePath) {
  return isSameFileUri(uri, filePath) || isParentDirectory(uri, filePath)
}

export function isFileLoadingAllowed(config, filePath) {
  const { fs } = config.server

  if (!fs.strict) return true

  if (config.fsDenyGlob(filePath)) return false

  if (config.safeModulePaths.has(filePath)) return true

  if (fs.allow.some((uri) => isUriInFilePath(uri, filePath))) return true

  return false
}

export function ensureServingAccess(url, server, res, next) {
  if (isFileServingAllowed(url, server)) {
    return true
  }
  if (isFileReadable(cleanUrl(url))) {
    const urlMessage = `The request url "${url}" is outside of Vite serving allow list.`
    const hintMessage = `
${server.config.server.fs.allow.map((i) => `- ${i}`).join('\n')}

Refer to docs https://vite.dev/config/server-options.html#server-fs-allow for configurations and more details.`

    server.config.logger.error(urlMessage)
    server.config.logger.warnOnce(hintMessage + '\n')
    res.statusCode = 403
    res.write(renderRestrictedErrorHTML(urlMessage + '\n' + hintMessage))
    res.end()
  } else {
    // if the file doesn't exist, we shouldn't restrict this path as it can
    // be an API call. Middlewares would issue a 404 if the file isn't handled
    next()
  }
  return false
}

function renderRestrictedErrorHTML(msg) {
  // to have syntax highlighting and autocompletion in IDE
  const html = String.raw
  return html`
    <body>
      <h1>403 Restricted</h1>
      <p>${escapeHtml(msg).replace(/\n/g, '<br/>')}</p>
      <style>
        body {
          padding: 1em 2em;
        }
      </style>
    </body>
  `
}

