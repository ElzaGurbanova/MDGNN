// vuln-file-browser.js (VULNERABLE)
'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'public');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// naive logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// list directory contents (vulnerable to absolute-path override)
app.get('/browse', (req, res) => {
  const dir = req.query.dir || '/';
  // normalize then join: still allows absolute override and sneaky encodings
  const normalized = path.normalize(dir).replace(/^\s+/, '');
  const target = path.join(ROOT, normalized);          // absolute drop when normalized starts with '/'

  // fragile prefix check
  if (!target.startsWith(ROOT)) {
    return res.status(400).json({ error: 'Bad path' });
  }
  fs.readdir(target, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(404).json({ error: 'Not found' });
    const list = entries.map(e => ({
      name: e.name,
      type: e.isDirectory() ? 'dir' : 'file',
      path: path.join(normalized, e.name).replace(/\\/g, '/')
    }));
    res.json({ root: ROOT, dir: normalized, list });
  });
});

// preview text file (vulnerable)
app.get('/preview', (req, res) => {
  const p = req.query.p || '';
  const file = path.join(ROOT, p);                     // absolute path drops ROOT
  if (!file.startsWith(ROOT)) {
    return res.status(400).send('Invalid path');
  }
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return res.status(404).send('Not found');
    res.type('text/plain').send(data);
  });
});

// download endpoint (vulnerable & follows symlinks)
app.get('/download', (req, res) => {
  const n = String(req.query.name || '');
  const fp = path.join(ROOT, n);                       // symlink to /etc/passwd would be followed
  if (!fp.startsWith(ROOT)) {
    return res.status(400).send('Bad request');
  }
  if (!fs.existsSync(fp)) return res.status(404).end();
  res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(n));
  res.sendFile(fp);
});

// fallback index
app.get('/', (_req, res) => {
  res.type('text/html').send(`
    <h1>Vulnerable File Browser</h1>
    <p>Try /browse?dir=/etc or /download?name=/etc/passwd</p>
  `);
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`VULN browser on http://localhost:${port}`);
});

