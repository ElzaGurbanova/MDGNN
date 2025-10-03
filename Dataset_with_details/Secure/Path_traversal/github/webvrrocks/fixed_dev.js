var fs = require('fs');
var path = require('path');
var urllib = require('url');

var budo = require('budo');
var shell = require('shelljs');
var yonder = require('yonder');

var OPTS = {
  assets: {
    glob: {
      strict: true,
      cwd: path.resolve(__dirname, 'public'),
      include: '**/*',
      ignore: '**/*.html',
      nonull: true
    },
    inputDir: path.resolve(__dirname, 'public'),
    outputDir: path.resolve(__dirname, '_prod')
  },
  nunjucks: {
    glob: {
      include: '**/*.html',
    },
    extensionsFile: path.resolve(__dirname, 'nunjucks-helpers.js'),
    inputDir: path.resolve(__dirname, 'public'),
    outputDir: path.resolve(__dirname, '_prod')
  }
};
OPTS.routerPath = path.join(OPTS.assets.inputDir, 'ROUTER');

/**
 * Serves nice URLs (à la GitHub Pages & Surge).
 *
 * For example, `/firefox` will be served from `/firefox.html`, and
 * `/firefox/` will be served from `/firefox/index.html`,
 * preserving the URLs.
 */
function staticMiddlewareForFilesWithoutTrailingSlashes (req, res, next) {
  var parsedUrl = urllib.parse(req.url);
  var pathname = parsedUrl.pathname || '/';
  var ext = path.extname(pathname);

  // If a file extension exists or path ends with '/', leave it alone.
  if (ext || pathname.substr(-1) === '/') {
    next();
    return;
  }

  // --- Harden path handling: make strictly relative under public/ ---
  var decoded;
  try { decoded = decodeURIComponent(pathname); } catch (_) { decoded = pathname; }
  // Normalize slashes and strip leading '/' so joins don't ignore the base
  var rel = decoded.replace(/\\/g, '/').replace(/^\/+/, '');

  // Reject empty paths and dot segments
  if (!rel || rel.split('/').some(function (seg) { return seg === '' || seg === '.' || seg === '..'; })) {
    next();
    return;
  }

  // Resolve the candidate under the input dir and ensure containment
  var candidate = path.resolve(OPTS.assets.inputDir, rel + '.html');
  var relCheck = path.relative(OPTS.assets.inputDir, candidate);
  var inside = relCheck && !relCheck.startsWith('..') && !path.isAbsolute(relCheck);

  if (inside && fs.existsSync(candidate)) {
    // Rewrite to a safe site-relative URL
    req.url = '/' + rel + '.html' + (parsedUrl.search || '') + (parsedUrl.hash || '');
  }

  next();
}

var budoLiveOpts = {
  cache: false,
  debug: true,
  live: true,
  // include: require.resolve('./live-client.js')
};
var budoMiddleware = [staticMiddlewareForFilesWithoutTrailingSlashes];

// Create server-side redirects (defined in the `ROUTER` file).
// See https://github.com/sintaxi/yonder#readme for usage.
if (fs.existsSync(OPTS.routerPath)) {
  budoMiddleware.push(yonder.middleware(OPTS.routerPath));
}

function regenerateAllNunjucksTemplates () {
  return shell.exec(`node ./node_modules/.bin/nunjucks "${OPTS.nunjucks.glob.include}" --path ${OPTS.nunjucks.inputDir} --unsafe --extensions ${OPTS.nunjucks.extensionsFile} --out ${OPTS.nunjucks.outputDir}`);
}

var app = budo
  .cli(process.argv.slice(2), {
    live: budoLiveOpts,
    middleware: budoMiddleware
  })
  .on('connect', function (evt) {
    var wss = evt.webSocketServer;

    // Receiving messages from clients.
    wss.on('connection', function (socket) {
      console.log('[LiveReload] Client Connected');
      // socket.on('message', function (message) {
      //   console.log('[LiveReload] Message from client:', JSON.parse(message));
      // });
    });

    shell.rm('-rf', OPTS.assets.outputDir, OPTS.nunjucks.outputDir);
    shell.cp('-R', OPTS.assets.inputDir, OPTS.assets.outputDir);
    regenerateAllNunjucksTemplates();
  })
  .on('reload', function (file) {
    var parentDir = file.split(path.sep)[0];
    if (parentDir) {
      parentDir = path.join(__dirname, parentDir.toLowerCase());
    }
    if (!parentDir ||
        parentDir === OPTS.assets.outputDir ||
        parentDir === OPTS.nunjucks.outputDir) {
      // Do not reload files in `_prod/` directory.
      return;
    }

    console.log('File reloaded:', file);

    var ext = path.extname(file).toLowerCase();
    var fileRelative;
    if (ext === '.html') {
      fileRelative = path.relative(OPTS.nunjucks.inputDir, file);
      if (fileRelative[0] === '_') {
        regenerateAllNunjucksTemplates();
        return;
      }
      shell.exec(`node ./node_modules/.bin/nunjucks ${fileRelative} --path ${OPTS.nunjucks.inputDir} --unsafe --extensions ${OPTS.nunjucks.extensionsFile} --out ${OPTS.nunjucks.outputDir}`);
      return;
    }
    if (ext === '.json') {
      regenerateAllNunjucksTemplates();
      return;
    }
    fileRelative = path.relative(OPTS.assets.inputDir, file);
    var fileOutput = path.join(OPTS.assets.outputDir, fileRelative);
    var fileOutputDir = path.dirname(fileOutput);
    console.log('Copying: %s', fileRelative);
    shell.mkdir('-p', fileOutputDir);
    shell.cp(file, fileOutput);
  });

module.exports = app;

