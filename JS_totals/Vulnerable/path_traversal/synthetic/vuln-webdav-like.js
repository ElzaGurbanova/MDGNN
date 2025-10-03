// vuln-webdav-like.js
// VULNERABLE: uses client-supplied paths with join/normalize and weak checks.

'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const ROOT = path.resolve(__dirname, 'repo');

app.use(express.json());

// List directory
app.post('/propfind', (req, res) => {
  const p = req.body.path || '/';
  const dir = path.join(ROOT, path.normalize(p));
  if (!dir.startsWith(ROOT)) return res.status(400).send('bad path');
  if (!fs.existsSync(dir)) return res.status(404).end();
  const entries = fs.readdirSync(dir, { withFileTypes: true }).map(e => ({
    name: e.name, type: e.isDirectory() ? 'collection' : 'file'
  }));
  res.json(entries);
});

// GET file
app.get('/get', (req, res) => {
  const file = path.join(ROOT, req.query.path || '');
  if (!file.startsWith(ROOT)) return res.status(400).end();
  if (!fs.existsSync(file)) return res.status(404).end();
  fs.createReadStream(file).pipe(res);
});

// PUT file (creates parents)
app.put('/put', (req, res) => {
  const file = path.join(ROOT, req.query.path || '');
  if (!file.startsWith(ROOT)) return res.status(400).end();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const chunks = [];
  req.on('data', d => chunks.push(d));
  req.on('end', () => {
    fs.writeFileSync(file, Buffer.concat(chunks));
    res.end('OK');
  });
});

app.listen(5018, () => console.log('WebDAV-like API (VULN) on :5018'));

