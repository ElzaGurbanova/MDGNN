import { script_dir } from "./common.mjs";
import { createServer } from "node:http";
import { createReadStream, promises as fsPromises } from "node:fs";
import { extname, join, resolve, relative } from "node:path";
import { URL } from "node:url";

// Map file extensions to MIME types
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".txt": "text/plain"
};

// Root directory to serve (default: current working directory)
const root = resolve(script_dir, "../docs");

const port = process.env.PORT || 8001;

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    // Resolve against root; '.' prevents absolute-path override
    let filePath = resolve(root, "." + pathname);

    // Boundary-safe containment check
    let rel = relative(root, filePath);
    if (rel.startsWith("..")) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("400 Bad Request\n");
      return;
    }

    // Check if path exists
    let stat;
    try {
      stat = await fsPromises.stat(filePath);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found\n");
      return;
    }

    // If directory, serve index.html
    if (stat.isDirectory()) {
      filePath = join(filePath, "index.html");
      try {
        stat = await fsPromises.stat(filePath);
      } catch {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("403 Forbidden\n");
        return;
      }
      // Re-check containment after appending index.html
      rel = relative(root, filePath);
      if (rel.startsWith("..")) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("400 Bad Request\n");
        return;
      }
    }

    // Symlink-hardening: ensure canonical target stays under canonical root
    const realRoot = await fsPromises.realpath(root);
    const realFile = await fsPromises.realpath(filePath);
    const relReal = relative(realRoot, realFile);
    if (relReal.startsWith("..")) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("403 Forbidden\n");
      return;
    }

    // Determine content type
    const ext = extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Stream file
    res.writeHead(200, { "Content-Type": contentType });
    const stream = createReadStream(realFile);
    stream.pipe(res);
    stream.on("error", (streamErr) => {
      console.error(streamErr);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Internal Server Error\n");
    });
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Internal Server Error\n");
  }
});

server.listen(port, () => {
  console.log(`Serving rerun_js/docs at http://localhost:${port}/`);
});

