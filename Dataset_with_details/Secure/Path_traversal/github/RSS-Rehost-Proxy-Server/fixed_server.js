const express = require("express");
const axios = require("axios");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_DIR = "./rss-cache";

// --- helpers (minimal additions) ---
function sanitizeName(name) {
  const base = path.basename(String(name || ""));
  // allow simple filenames only
  if (!/^[a-zA-Z0-9._-]+$/.test(base)) {
    throw new Error("Invalid feed name");
  }
  // forbid dot-only names explicitly
  if (base === "." || base === "..") {
    throw new Error("Invalid feed name");
  }
  return base;
}

function assertHttpUrl(u) {
  const url = new URL(u);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Unsupported URL protocol");
  }
  return url.toString();
}

// Ensure cache directory exists
async function ensureCacheDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

// Load feeds from configuration file
async function loadFeeds() {
  const data = await fs.readFile("feeds.json", "utf8");
  return JSON.parse(data).feeds;
}

// Fetch and cache a single RSS feed
async function fetchRSSFeed(feed, CACHE_ROOT) {
  try {
    const safeName = sanitizeName(feed.name);
    const url = assertHttpUrl(feed.url);

    const response = await axios.get(url, {
      responseType: "text",
      headers: { "User-Agent": "RSS-Proxy/1.0" },
      timeout: 10000,
      maxContentLength: 5 * 1024 * 1024, // 5MB cap
      validateStatus: (s) => s >= 200 && s < 400, // accept redirects
    });

    await fs.writeFile(path.join(CACHE_ROOT, `${safeName}.xml`), response.data);
    console.log(`[INFO] Cached ${safeName} RSS at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`[ERROR] Failed to update ${feed?.name}: ${error.message}`);
  }
}

// Fetch all RSS feeds in parallel
async function fetchAllRSS(feeds, CACHE_ROOT) {
  console.log(`[INFO] Starting RSS feeds update at ${new Date().toISOString()}`);
  await Promise.allSettled(feeds.map((f) => fetchRSSFeed(f, CACHE_ROOT)));
}

// Initialize and start the server
async function startServer() {
  try {
    await ensureCacheDir();
    // Canonicalize cache directory (defeats symlink tricks)
    const CACHE_ROOT = fsSync.realpathSync(path.resolve(CACHE_DIR));

    const feeds = await loadFeeds();

    // Serve cached RSS dynamically
    app.get("/rss/:feedName", async (req, res) => {
      try {
        // sanitize param (defense-in-depth)
        const safeName = sanitizeName(req.params.feedName);
        const filePath = path.join(CACHE_ROOT, `${safeName}.xml`);

        const data = await fs.readFile(filePath);
        res.set("Content-Type", "application/xml");
        res.send(data);
      } catch (err) {
        if (err.code === "ENOENT") {
          res.status(404).send("RSS Feed not found");
        } else {
          console.error(`[ERROR] Failed to serve ${req.params.feedName}: ${err.message}`);
          res.status(500).send("Internal Server Error");
        }
      }
    });

    // Run RSS fetch every 5 minutes
    cron.schedule("*/5 * * * *", () => fetchAllRSS(feeds, CACHE_ROOT));

    // Fetch RSS once on startup
    await fetchAllRSS(feeds, CACHE_ROOT);

    app.listen(PORT, () =>
      console.log(`RSS Proxy running at http://localhost:${PORT}/rss/:feedName`)
    );
  } catch (err) {
    console.error(`[FATAL] Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

startServer();

