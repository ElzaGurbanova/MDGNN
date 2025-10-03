const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const Greenlock = require('greenlock-express');

const app = express();
const PORT = 80;
const SSL_PORT = 443;

// Define the folders where images are stored
const imageFolders = ['img/banner', 'img/icons', 'img/img'];

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const { image, size, width, height } = req.query;
  if (!image) return res.status(404).send('404 Not Found');

  let reqPath;
  try { reqPath = decodeURIComponent(String(image)); } catch { return res.status(400).send('Bad image'); }
  // normalize separators, but DO NOT trust it yet
  reqPath = reqPath.replace(/\\/g, '/');

  const bases = imageFolders.map(f => path.resolve(__dirname, f));
  let imagePath;

  for (const base of bases) {
    // Resolve against base; the '.' prevents absolute override
    const candidate = path.resolve(base, '.' + reqPath);

    // Boundary-safe containment check
    const rel = path.relative(base, candidate);
    if (rel.startsWith('..') || path.isAbsolute(rel)) continue;

    // (Symlink hardening) Ensure parent dir's realpath is still inside base
    try {
      const parentReal = fs.realpathSync(path.dirname(candidate));
      const parentRel = path.relative(base, parentReal);
      if (parentRel.startsWith('..') || path.isAbsolute(parentRel)) continue;
    } catch { continue; }

    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      imagePath = candidate;
      break;
    }
  }

  if (!imagePath) return res.status(404).send('Image not found');

  try {
    let img = sharp(imagePath);
    if (size) img = img.resize(parseInt(size, 10));
    else if (width || height) img = img.resize(parseInt(width || 0, 10), parseInt(height || 0, 10));

    const ext = path.extname(imagePath).slice(1).toLowerCase();
    res.type(ext ? `image/${ext}` : 'application/octet-stream');

    img.toBuffer((err, buffer) => {
      if (err) return res.status(500).send('Error processing image');
      res.send(buffer);
    });
  } catch {
    res.status(500).send('Error processing image');
  }
});


// Catch-all route to handle undefined routes and return a 404 status code
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the HTTP server
http.createServer(app).listen(PORT, () => {
    console.log(`HTTP server is running on http://localhost:${PORT}`);
});

// Start the HTTPS server with Greenlock for automatic certificate management
Greenlock.init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: 'youremail@example.com',
    cluster: false
}).serve(app);


