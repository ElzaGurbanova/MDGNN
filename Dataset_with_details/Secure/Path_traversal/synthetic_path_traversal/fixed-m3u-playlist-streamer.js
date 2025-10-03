// fixed-m3u-playlist-streamer.js
'use strict';
const express = require('express');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'media'); // sandbox root

// ---------- helpers ----------
function inside(root, target) {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function safeResolve(relish) {
  const base = ROOT;
  const t = path.resolve(base, '.' + String(relish || ''));
  if (!inside(base, t)) return null;
  const realBase = await fsp.realpath(base);
  let real;
  try { real = await fsp.realpath(t); } catch { return null; }
  if (!inside(realBase, real)) return null;
  return real;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));
}
// --------------------------------

app.use((req, _res, next) => {
  console.log(`[Playlist] ${req.method} ${req.url}`);
  next();
});

// Render a playlist and link to *safe* tracks
app.get('/playlist', async (req, res) => {
  const m3u = String(req.query.m || 'default.m3u');
  const plPath = await safeResolve(m3u);
  if (!plPath) return res.status(400).send('Invalid playlist path');

  try {
    const raw = await fsp.readFile(plPath, 'utf8'); // still only reading inside ROOT
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const items = [];

    for (const line of lines) {
      if (line.startsWith('#')) continue; // comments
      // Treat each entry relative to ROOT; skip unsafe
      const real = await safeResolve(line);
      if (!real) continue;
      const rel = path.relative(ROOT, real).replace(/\\/g, '/');
      items.push({ label: line, href: `/stream?path=${encodeURIComponent(rel)}` });
    }

    const list = items
      .map(it => `<li><a href="${it.href}">${escapeHtml(it.label)}</a></li>`)
      .join('');

    res.type('html').send(`
      <h1>Playlist: ${escapeHtml(m3u)}</h1>
      <ul>${list || '<li><em>No playable entries</em></li>'}</ul>
    `);
  } catch {
    res.status(404).send('Playlist not found');
  }
});

// Stream track (sandboxed)
app.get('/stream', async (req, res) => {
  const rel = String(req.query.path || '');
  const real = await safeResolve(rel);
  if (!real) return res.status(400).send('Invalid path');

  try {
    const st = await fsp.stat(real);
    if (!st.isFile()) return res.status(404).send('Not found');
    res.setHeader('Content-Type', 'audio/mpeg'); // generic
    fs.createReadStream(real).on('error', () => res.status(500).end()).pipe(res);
  } catch {
    res.status(404).send('Not found');
  }
});

// Album cover (sandboxed)
app.get('/cover', async (req, res) => {
  const name = String(req.query.img || 'cover.jpg');
  const real = await safeResolve(name);
  if (!real) return res.status(400).send('Invalid path');
  if (!fs.existsSync(real)) return res.status(404).send('Not found');

  const ext = path.extname(real).toLowerCase();
  res.type(ext === '.png' ? 'png' : (ext === '.jpg' || ext === '.jpeg') ? 'jpeg' : 'application/octet-stream');
  fs.createReadStream(real).pipe(res);
});

// Index
app.get('/', (_req, res) => {
  res.type('html').send(`
    <h2>M3U Playlist Streamer (FIXED)</h2>
    <ul>
      <li>GET /playlist?m=default.m3u</li>
      <li>GET /stream?path=relative/track.mp3</li>
      <li>GET /cover?img=album/cover.jpg</li>
    </ul>
  `);
});

const port = process.env.PORT || 6091;
app.listen(port, () => console.log(`Playlist Streamer (FIXED) http://localhost:${port}`));

