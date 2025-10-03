// vuln-notebook-renderer.js
// VULNERABLE: classic path traversal via path.join + fragile prefix checks.
// - Absolute path override possible (e.g., ?src=/etc/passwd)
// - Follows symlink targets under notes/ (serves arbitrary files)
// - Naive sanitization (.replace('../','')) is bypassable via encodings/doubles
// This file is intentionally vulnerable for ML/dataset/training purposes.

'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Intended root for all notebook files
const NOTES_ROOT = path.resolve(__dirname, 'notes');

// Simple logger
app.use((req, _res, next) => {
  console.log(`[Notebook] ${req.method} ${req.url}`);
  next();
});

// List notebooks in a directory (naive)
app.get('/list', (req, res) => {
  const dir = String(req.query.dir || '/'); // e.g., "/", "projects", "../../"
  const normalized = path.normalize(dir);   // still allows absolute override
  const target = path.join(NOTES_ROOT, normalized);

  // Fragile: string prefix check (doesn't stop all cases)
  if (!target.startsWith(NOTES_ROOT)) {
    return res.status(400).json({ error: 'Invalid directory' });
  }

  try {
    const items = fs.readdirSync(target, { withFileTypes: true }).map(e => ({
      name: e.name,
      type: e.isDirectory() ? 'dir' : 'file',
      path: path.join(normalized, e.name).replace(/\\/g, '/')
    }));
    res.json({ dir: normalized, items });
  } catch (e) {
    res.status(404).json({ error: 'Not found' });
  }
});

// Render a markdown-like note as HTML (naive)
// Accepts: /render?src=notes/today.md
app.get('/render', (req, res) => {
  let src = String(req.query.src || 'README.md');

  // Naive "protection": remove one "../" – trivially bypassed
  src = src.replace('../', '');
  const file = path.join(NOTES_ROOT, src); // absolute override still possible

  if (!file.startsWith(NOTES_ROOT)) {
    return res.status(400).send('Invalid path');
  }

  try {
    const raw = fs.readFileSync(file, 'utf8'); // follows symlink targets freely
    // ultra-minimal markdown-ish presentation (not important for vuln)
    const html = raw
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    res.type('html').send(`
      <!doctype html>
      <html><head><meta charset="utf8"/><title>${path.basename(src)}</title></head>
      <body>
        <h3>Notebook: ${src}</h3>
        <div style="font-family: system-ui; line-height: 1.5">${html}</div>
        <p><a href="/download?src=${encodeURIComponent(src)}">Download</a></p>
      </body></html>
    `);
  } catch {
    res.status(404).send('Note not found');
  }
});

// Download endpoint (naive)
app.get('/download', (req, res) => {
  const src = String(req.query.src || '');
  const file = path.join(NOTES_ROOT, src); // traversal & absolute override
  if (!file.startsWith(NOTES_ROOT)) return res.status(400).send('Invalid path');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return res.status(404).send('File not found');
  }
  res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(src));
  res.sendFile(file); // will follow symlink to any target
});

// Tiny index page with hints
app.get('/', (_req, res) => {
  res.type('html').send(`
    <h2>Notebook Renderer (VULNERABLE)</h2>
    <ul>
      <li>GET /list?dir=/</li>
      <li>GET /render?src=README.md</li>
      <li>GET /download?src=README.md</li>
    </ul>
    <p>Traversal examples (dangerous):</p>
    <ul>
      <li>/render?src=/etc/hosts</li>
      <li>/download?src=../../../../etc/passwd</li>
      <li>/render?src=..%2f..%2fsecret.txt</li>
    </ul>
  `);
});

const port = process.env.PORT || 5090;
app.listen(port, () => {
  console.log(`Notebook Renderer (VULN) http://localhost:${port}`);
});

