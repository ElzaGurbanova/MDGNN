import { fileURLToPath } from "url";
import { stat, realpath, access } from "fs/promises";
import { createReadStream } from "fs";
import { join, resolve, relative, dirname, isAbsolute, extname } from "path";

export function createStaticHandler(staticDir) {
  // Canonical, symlink-free base
  const BASE = await realpath(resolve(staticDir));
  console.log(`Static file handler initialized for directory: ${BASE}`);

  return async function serveStatic(reqPath) {
    try {
      // If this comes from an actual Request, prefer: new URL(req.url, origin).pathname
      const decoded = decodeURIComponent(reqPath || "/");
      // make relative (strip leading / or \)
      const relReq = decoded.replace(/^[/\\]+/, "") || "index.html";

      let candidate = resolve(BASE, relReq);

      // If candidate exists and is a directory, append index.html
      try {
        const st = await stat(candidate);
        if (st.isDirectory()) {
          candidate = join(candidate, "index.html"); // NOTE: no leading slash
        }
      } catch { /* not existing yet; that's fine */ }

      // Canonicalize what we can (defeat symlinks)
      const toCheck = await accessExists(candidate) ? candidate : dirname(candidate);
      const checkReal = await realpath(toCheck);

      // Containment test
      const rel = relative(BASE, checkReal);
      if (rel.startsWith("..") || isAbsolute(rel)) {
        return new Response("Forbidden", { status: 403 });
      }

      // Stream file or SPA fallback
      if (!(await accessExists(candidate))) {
        const spa = resolve(BASE, "index.html");
        if (await accessExists(spa)) return stream(spa);
        return new Response("Not Found", { status: 404 });
      }
      return stream(candidate);
    } catch (err) {
      console.error(err);
      return new Response("Server Error", { status: 500 });
    }
  };
}

async function accessExists(p) {
  try { await access(p); return true; } catch { return false; }
}

function stream(p) {
  // Bun.file(p) is fine too; createReadStream shown for portability
  return new Response(createReadStream(p));
}

