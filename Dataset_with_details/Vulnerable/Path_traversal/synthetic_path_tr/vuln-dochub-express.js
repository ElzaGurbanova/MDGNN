// vuln-dochub-express.js
// VULNERABLE: classic path traversal via path.join + fragile prefix checks.
// Notes: absolute-path override is possible and symlinks are followed.

'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'docs'); // intended root but not enforced safely

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[DocHub] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));

// Browse directory (naive)
app.get('/browse', (req, res) => {
  const dir = req.query.dir || '/';
  const normalized = path.normalize(dir); // still allows absolute override
  const target = path.join(ROOT, normalized);

  // Fragile prefix check
  if (!target.startsWith(ROOT)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  fs.readdir(target, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(404).json({ error: 'Not found' });
    const list = entries.map(e => ({
      name: e.name,
      type: e.isDirectory() ? 'dir' : 'file',
      rel: path.join(normalized, e.name).replace(/\\/g, '/')
    }));
    res.json({ dir: normalized, list });
  });
});

// Preview text (naive)
app.get('/preview', (req, res) => {
  const p = req.query.p || 'README.md';
  const file = path.join(ROOT, p); // absolute override if p is '/etc/passwd'

  if (!file.startsWith(ROOT)) {
    return res.status(400).send('Bad path');
  }
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return res.status(404).send('Not found');
    res.type('text/plain').send(data);
  });
});

// Download (follows symlinks)
app.get('/download', (req, res) => {
  const n = String(req.query.name || '');
  const fp = path.join(ROOT, n);
  if (!fp.startsWith(ROOT)) return res.status(400).send('Bad path');
  if (!fs.existsSync(fp)) return res.status(404).end();
  res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(n));
  res.sendFile(fp); // follows symlink target freely
});

// Tiny search that reads multiple files (naive file concatenation)
app.get('/search', (req, res) => {
  const files = (req.query.files || '').split(',').filter(Boolean);
  const hits = [];
  files.forEach(f => {
    const p = path.join(ROOT, f);
    if (p.startsWith(ROOT) && fs.existsSync(p) && fs.statSync(p).isFile()) {
      const txt = fs.readFileSync(p, 'utf8');
      if (txt.includes(req.query.q || '')) {
        hits.push({ file: f, size: txt.length });
      }
    }
  });
  res.json({ hits });
});

app.get('/', (_req, res) =>
  res.type('text/html').send(`
  <h1>DocHub (VULNERABLE)</h1>
  <ul>
    <li>GET /browse?dir=/</li>
    <li>GET /preview?p=/etc/hosts</li>
    <li>GET /download?name=/etc/passwd</li>
    <li>GET /search?files=README.md,notes.txt&q=TODO</li>
  </ul>
`));

const port = process.env.PORT || 5011;
app.listen(port, () => console.log(`DocHub running at http://localhost:${port}`));

