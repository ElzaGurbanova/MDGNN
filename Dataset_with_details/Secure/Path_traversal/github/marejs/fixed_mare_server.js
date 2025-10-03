// server.js
import express from "express";
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from "path";
import fs from "fs";
import net from "net";
import dotenv from 'dotenv';
import { fileURLToPath, pathToFileURL } from "url";

import { getMarecors } from "../api/__mare_serversettings/cors.js";
import { getMareSession } from "../api/__mare_serversettings/session.js";
import { Server_Startup } from "../api/__mare_serversettings/server_startup.js";
import { mareMiddleware, mareRateLimiter } from "../api/__mare_serversettings/middleware.js";

// ==== Setup ====
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());

// Global rate limiter
app.use(mareRateLimiter);

const isDev = process.env.NODE_ENV === "development";

// ==== helpers ====
const API_BASE = path.resolve(__dirname, "..", "api");

const dynamicImport = async (routePath) => {
  try {
    const route = await import(pathToFileURL(routePath).href);
    return route.default;
  } catch (err) {
    console.error(`Failed to import ${routePath}:`, err);
    return null;
  }
};

function containsTraversal(s) {
  return (
    s.includes("..") ||
    s.includes("%2e%2e") ||
    s.includes("%2e.") ||
    s.includes(".%2e")
  );
}

function resolveApiPathOrNull(reqPath) {
  try {
    const decoded = (() => { try { return decodeURIComponent(reqPath); } catch { return reqPath; } })();
    const normalizedPath = path.posix.normalize(decoded);
    if (containsTraversal(decoded) || containsTraversal(normalizedPath)) return null;

    // Make strictly relative (strip leading slashes)
    const cleanPath = normalizedPath.replace(/^\/+/, "");
    // Resolve under API base and enforce containment
    const resolvedPath = path.resolve(API_BASE, cleanPath);
    const rel = path.relative(API_BASE, resolvedPath);
    if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
    return resolvedPath;
  } catch {
    return null;
  }
}

function sanitizeSegments(segments) {
  // Basic allowlist for dynamic param folder names like [id]
  return segments.every(
    (s) => s && !s.includes("\0") && !s.includes("..")
  );
}

// ==== API Routing ====
app.use(
  "/api",
  mareRateLimiter,
  getMareSession(),
  getMarecors(),
  mareMiddleware,
  async (req, res, next) => {
    // Resolve and contain the requested path under ../api
    const resolvedBasePath = resolveApiPathOrNull(req.path);
    if (!resolvedBasePath) {
      return res
        .status(400)
        .json({ error: "Invalid API path - path traversal detected or outside allowed directory" });
    }

    // Support ".mareJS" mapping if present, then try index.js or .js
    let routePath = resolvedBasePath.replace(".mareJS", "api");
    const indexFilePath = path.join(routePath, "index.js");
    const filePath = routePath.endsWith(".js") ? routePath : `${routePath}.js`;

    let routeHandler = null;

    if (fs.existsSync(indexFilePath)) {
      routeHandler = await dynamicImport(indexFilePath);
    }

    if (!routeHandler && fs.existsSync(filePath)) {
      routeHandler = await dynamicImport(filePath);
    }

    const segments = req.path.split("/").filter(Boolean);
    if (!routeHandler && segments.length && sanitizeSegments(segments)) {
      const parentElement = segments.shift();
      let params = {};
      let parentPath = path.join(API_BASE, parentElement);

      if (fs.existsSync(parentPath)) {
        for (let i = 0; i < segments.length; i++) {
          const nextSeg = segments[i];
          const direct = path.join(parentPath, nextSeg);
          if (fs.existsSync(direct)) {
            parentPath = direct;
          } else {
            const files = fs.readdirSync(parentPath);
            for (const file of files) {
              if (file.startsWith("[")) {
                parentPath = path.join(parentPath, file);
                const paramName = file.slice(1, file.indexOf("]"));
                params[paramName] = nextSeg;
                break;
              }
            }
          }
        }
      }

      // Ensure parentPath is still within API_BASE
      const rel = path.relative(API_BASE, parentPath);
      if (!rel.startsWith("..") && !path.isAbsolute(rel) && fs.existsSync(parentPath)) {
        routeHandler = await dynamicImport(parentPath);
        if (routeHandler) req.params = params;
      }
    }

    if (routeHandler) return routeHandler(req, res, next);

    const defaultFilePath = path.resolve(API_BASE, "default.js");
    if (fs.existsSync(defaultFilePath)) {
      const handler = await dynamicImport(defaultFilePath);
      try {
        return handler(req, res, next);
      } catch (e) {
        console.error("Error in /api/default route:", e);
        return res.status(500).end("Server Error");
      }
    }

    return res.status(404).end("Not Found");
  }
);

// ==== Dev/Prod File Handling ====
if (isDev) {
  console.log("----- Development Mode Server ----------------");
  const { createServer: createViteServer } = await import("vite");

  const vite = await createViteServer({ server: { middlewareMode: true } });
  app.use(vite.middlewares);

  app.get("*", async (req, res) => {
    const url = req.originalUrl;
    try {
      const template = await vite.transformIndexHtml(url, "");
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      console.error(err);
      res.status(500).end(err.message);
    }
  });
} else {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    const indexHtml = path.join(distPath, "index.html");
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}

// ==== Port Handling ====
const checkPortAvailable = (port) =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (err) => (err.code === "EADDRINUSE" ? resolve(false) : reject(err)));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });

const findAvailablePort = async (startingPort) => {
  let port = startingPort;
  while (!(await checkPortAvailable(port))) {
    console.log(`Port ${port} is busy, trying next one...`);
    port++;
  }
  return port;
};

// ==== WebSocket Router ====================================================
const wshandlers = {};
const WSS_DIR = path.resolve(__dirname, '../api/wss');

function sanitizeWSRoute(raw) {
  try {
    const decoded = (() => { try { return decodeURIComponent(raw || ""); } catch { return raw || ""; } })();
    // normalize to POSIX-style and strip leading slashes
    const rel = decoded.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!rel) return null;
    const parts = rel.split("/").filter(Boolean);
    if (parts.some((p) => p === "." || p === "..")) return null;
    // Resolve and ensure inside WSS_DIR
    const candidate = path.resolve(WSS_DIR, rel);
    const relCheck = path.relative(WSS_DIR, candidate);
    if (relCheck.startsWith("..") || path.isAbsolute(relCheck)) return null;
    return { rel, candidate };
  } catch {
    return null;
  }
}

async function loadWSHandler(routeName) {
  const safe = sanitizeWSRoute(routeName);
  if (!safe) return null;
  const file = safe.candidate.endsWith(".js") ? safe.candidate : `${safe.candidate}.js`;
  if (!fs.existsSync(file)) return null;
  const mod = await import(pathToFileURL(file).href);
  return { key: safe.rel, handler: mod.default };
}

async function setupWSSRouting(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (req, socket, head) => {
    const fullUrl = new URL(`http://localhost${req.url}`);
    if (!fullUrl.pathname.startsWith("/api/wss/")) return socket.destroy();

    const rawRoute = fullUrl.pathname.replace("/api/wss/", "").replace(/\/+$/, "");
    const queryParams = Object.fromEntries(fullUrl.searchParams.entries());

    const loaded =
      wshandlers[rawRoute] ||
      (await loadWSHandler(rawRoute));

    if (!loaded || !loaded.handler) {
      console.warn(`❌ No WS handler for ${rawRoute}`);
      return socket.destroy();
    }

    // cache by sanitized key
    if (!wshandlers[loaded.key]) wshandlers[loaded.key] = loaded;

    wss.handleUpgrade(req, socket, head, (ws) => {
      req.query = queryParams;
      loaded.handler(ws, req);
    });
  });
}

// ==== Startup ====
(async () => {
  const startingPort = process.env.PORT || 4000;
  const PORT = await findAvailablePort(startingPort);

  const ready = await Server_Startup();
  if (!ready) {
    console.error("SERVER FAILED TO START BECAUSE OF STARTUP SCRIPT ERROR");
    return;
  }

  const server = createServer(app);
  await setupWSSRouting(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();

