// vuln-m3u-playlist-streamer.js
// VULNERABLE: classic path traversal via path.join + fragile prefix checks (absolute override & symlink follow).
// This "playlist streamer" serves .m3u files and streams media tracks by paths inside the playlist.
// - /playlist?m= accepts arbitrary filesystem paths via naive join
// - /stream?path= uses raw join with ROOT
// - /cover?img= same issue
// All checks use fragile string prefix checks; symlinks are followed.

'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'media'); // intended sandbox, but not enforced correctly

app.use((req, _res, next) => {
  console.log(`[Playlist] ${req.method} ${req.url}`);
  next();
});

// Render a playlist (M3U) and link to tracks
app.get('/playlist', (req, res) => {
  const m3u = String(req.query.m || 'default.m3u');
  const m3uPath = path.join(ROOT, m3u);          // absolute override possible

  if (!m3uPath.startsWith(ROOT)) {               // fragile string prefix check
    return res.status(400).send('Invalid playlist path');
  }
  if (!fs.existsSync(m3uPath) || !fs.statSync(m3uPath).isFile()) {
    return res.status(404).send('Playlist not found');
  }

  const raw = fs.readFileSync(m3uPath, 'utf8');  // follows symlink targets
  const items = raw.split(/\r?\n/).filter(l => l && !l.startsWith('#'));

  const list = items.map(p => {
    const href = `/stream?path=${encodeURIComponent(p)}`;
    return `<li><a href="${href}">${p}</a></li>`;
  }).join('');

  res.type('html').send(`
    <h1>Playlist: ${m3u}</h1>
    <ul>${list}</ul>
    <p>Try: <code>/stream?path=/etc/passwd</code> or entries with <code>..</code></p>
  `);
});

// Stream an individual track (naive join + symlink follow)
app.get('/stream', (req, res) => {
  const p = String(req.query.path || '');
  const file = path.join(ROOT, p);               // traversal/absolute override

  if (!file.startsWith(ROOT)) {                  // still bypassable
    return res.status(400).send('Invalid path');
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return res.status(404).send('Not found');
  }

  res.setHeader('Content-Type', 'audio/mpeg');   // generic
  fs.createReadStream(file).on('error', () => res.status(500).end()).pipe(res);
});

// Album cover fetch (same anti-pattern)
app.get('/cover', (req, res) => {
  const img = String(req.query.img || 'cover.jpg');
  const file = path.join(ROOT, img);             // traversal/absolute override
  if (!file.startsWith(ROOT)) return res.status(400).send('Invalid path');
  if (!fs.existsSync(file)) return res.status(404).send('Not found');
  res.type(path.extname(file).toLowerCase() === '.png' ? 'png' : 'jpeg');
  fs.createReadStream(file).pipe(res);
});

// Index
app.get('/', (_req, res) => {
  res.type('html').send(`
    <h2>M3U Playlist Streamer (VULNERABLE)</h2>
    <ul>
      <li>GET /playlist?m=default.m3u</li>
      <li>GET /stream?path=/etc/hosts</li>
      <li>GET /cover?img=../../secret.png</li>
    </ul>
  `);
});

const port = process.env.PORT || 6091;
app.listen(port, () => console.log(`Playlist Streamer (VULN) http://localhost:${port}`));

