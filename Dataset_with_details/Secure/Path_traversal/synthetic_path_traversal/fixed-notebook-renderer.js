// notebook-renderer.fixed.js
'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

const app = express();

// Intended root for all notebook files (sandbox root)
const NOTES_ROOT = path.resolve(__dirname, 'notes');

// ---------- helpers ----------
function inside(root, target) {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function safeResolve(root, relish) {
  const t = path.resolve(root, '.' + String(relish || ''));
  if (!inside(root, t)) return null;
  const realRoot = await fsp.realpath(root);
  let real;
  try { real = await fsp.realpath(t); } catch { return null; }
  if (!inside(realRoot, real)) return null;
  return real;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));
}
// --------------------------------

app.use((req, _res, next) => {
  console.log(`[Notebook] ${req.method} ${req.url}`);
  next();
});

// List notebooks in a directory (sandboxed)
app.get('/list', async (req, res) => {
  const dir = String(req.query.dir || '/'); // allow things like "/", "project", "sub/dir"
  const real = await safeResolve(NOTES_ROOT, dir);
  if (!real) return res.status(400).json({ error: 'Invalid directory' });

  try {
    const entries = await fsp.readdir(real, { withFileTypes: true });
    const list = entries.map(e => ({
      name: e.name,
      type: e.isDirectory() ? 'dir' : 'file',
      path: path.posix.join(dir.replace(/\\/g, '/'), e.name)
    }));
    res.json({ dir, list });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

// Render a markdown-like note as HTML (sandboxed)
app.get('/render', async (req, res) => {
  const src = String(req.query.src || 'README.md'); // e.g., 'README.md', 'notes/today.md'
  const real = await safeResolve(NOTES_ROOT, src);
  if (!real) return res.status(400).send('Invalid path');

  try {
    const raw = await fsp.readFile(real, 'utf8');
    // super-minimal markdown-ish presentation
    const html = raw
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    res.type('html').send(`
      <!doctype html>
      <html><head><meta charset="utf8"/><title>${escapeHtml(path.basename(src))}</title></head>
      <body>
        <h3>Notebook: ${escapeHtml(src)}</h3>
        <div style="font-family: system-ui; line-height: 1.5">${html}</div>
        <p><a href="/download?src=${encodeURIComponent(src)}">Download</a></p>
      </body></html>
    `);
  } catch {
    res.status(404).send('Note not found');
  }
});

// Download endpoint (sandboxed)
app.get('/download', async (req, res) => {
  const src = String(req.query.src || '');
  const real = await safeResolve(NOTES_ROOT, src);
  if (!real) return res.status(400).send('Invalid path');

  try {
    const st = await fsp.stat(real);
    if (!st.isFile()) return res.status(404).send('File not found');
    res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(real));
    res.sendFile(real);
  } catch {
    res.status(404).send('File not found');
  }
});

// Tiny index page
app.get('/', (_req, res) => {
  res.type('html').send(`
    <h2>Notebook Renderer (FIXED)</h2>
    <ul>
      <li>GET /list?dir=/</li>
      <li>GET /render?src=README.md</li>
      <li>GET /download?src=README.md</li>
    </ul>
  `);
});

const port = process.env.PORT || 5090;
app.listen(port, () => {
  console.log(`Notebook Renderer (FIXED) http://localhost:${port}`);
});

