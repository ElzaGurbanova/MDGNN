// vuln-config-manager.js
// VULNERABLE: config viewer/editor/backup with path traversal via naive join/normalize and weak sanitization.
// Endpoints:
//  - /config/list?dir=    (lists files; absolute override via path.join + normalize)
//  - /config/view?name=   (reads file; replaces only one instance of '..')
//  - /config/save (POST)  (writes content; follows symlinks; traversal)
//  - /config/delete?name= (deletes arbitrary file)
// This file intentionally contains classic anti-patterns for dataset use.

'use strict';
const express = require('express');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'configs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// naive banner
app.get('/', (_req, res) => {
  res.type('html').send(`
    <h2>Config Manager (VULNERABLE)</h2>
    <ul>
      <li>GET /config/list?dir=/</li>
      <li>GET /config/view?name=/etc/hosts</li>
      <li>POST /config/save (name=../../evil.json)</li>
      <li>GET /config/delete?name=/etc/passwd</li>
    </ul>
  `);
});

// List directory (fragile containment)
app.get('/config/list', async (req, res) => {
  const dir = String(req.query.dir || '/');
  const normalized = path.normalize(dir);         // can still become absolute
  const target = path.join(ROOT, normalized);     // absolute override

  if (!target.startsWith(ROOT)) {                 // fragile string check
    return res.status(400).json({ error: 'Invalid path' });
  }
  try {
    const entries = await fsp.readdir(target, { withFileTypes: true });
    const list = entries.map(e => ({
      name: e.name,
      type: e.isDirectory() ? 'dir' : 'file'
    }));
    res.json({ dir: normalized, list });
  } catch (e) {
    res.status(404).json({ error: 'Not found' });
  }
});

// View a config file (single replace of ".." is bypassable)
app.get('/config/view', (req, res) => {
  let name = String(req.query.name || 'app.json');
  name = name.replace('..', '');                  // naive: only first occurrence

  const file = path.join(ROOT, name);             // traversal/absolute override remains
  if (!file.startsWith(ROOT)) return res.status(400).send('Bad path');

  try {
    const txt = fs.readFileSync(file, 'utf8');    // follows symlink targets
    res.type('application/json').send(txt);
  } catch {
    res.status(404).send('Not found');
  }
});

// Save config (follows symlinks; traversal)
app.post('/config/save', (req, res) => {
  const name = String(req.body.name || '');
  const content = String(req.body.content || '{}');

  const file = path.join(ROOT, name);             // traversal
  if (!file.startsWith(ROOT)) return res.status(400).send('Bad path');

  fs.mkdirSync(path.dirname(file), { recursive: true });
  try {
    fs.writeFileSync(file, content, 'utf8');      // may overwrite outside via symlink
    res.json({ ok: true, path: path.relative(ROOT, file) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Delete config (naive)
app.get('/config/delete', (req, res) => {
  const name = String(req.query.name || '');
  const file = path.join(ROOT, name);
  if (!file.startsWith(ROOT)) return res.status(400).send('Bad path');
  try {
    fs.unlinkSync(file);
    res.json({ ok: true });
  } catch {
    res.status(404).json({ ok: false, error: 'Not found' });
  }
});

const port = process.env.PORT || 6092;
app.listen(port, () => console.log(`Config Manager (VULN) http://localhost:${port}`));

