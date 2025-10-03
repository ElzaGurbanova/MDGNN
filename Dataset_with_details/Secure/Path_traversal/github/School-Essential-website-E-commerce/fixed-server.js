import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "../frontend/public");
const baseReal = fs.realpathSync(publicDir);

const mime = { ".html":"text/html", ".css":"text/css", ".js":"application/javascript", ".json":"application/json",
               ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".gif":"image/gif",
               ".ico":"image/x-icon", ".svg":"image/svg+xml", ".mp4":"video/mp4", ".webm":"video/webm", ".wav":"audio/wav" };

const server = http.createServer((req, res) => {
  try {
    const parsed = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsed.pathname || "/");

    // Force relative path: strip leading slashes/backslashes
    pathname = pathname.replace(/^[/\\]+/, "");
    if (pathname === "") pathname = "index.html";

    // Build candidate under the canonical base
    let candidate = path.resolve(baseReal, pathname);

    // If candidate exists and is a directory, append index.html
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      candidate = path.join(candidate, "index.html");
    }

    // Canonicalize what we can to defeat symlinks
    const toCheck = fs.existsSync(candidate) ? candidate : path.dirname(candidate);
    const checkReal = fs.realpathSync(toCheck);

    // Containment check
    const rel = path.relative(baseReal, checkReal);
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      return res.end("Access denied");
    }

    // Serve (stream) or 404
    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
      return serve404(res);
    }

    const ext = path.extname(candidate).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff"
    });
    fs.createReadStream(candidate).pipe(res);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error");
    console.error(e);
  }
});

function serve404(res) {
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end("<h1>404 Not Found</h1>");
}

