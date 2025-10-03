// fixed-config-manager.js
'use strict';
const express = require('express');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'configs'); // sandbox

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
// --------------------------------

app.get('/', (_req, res) => {
  res.type('html').send(`
    <h2>Config Manager (FIXED)</h2>
    <ul>
      <li>GET /config/list?dir=/</li>
      <li>GET /config/view?name=app.json</li>
      <li>POST /config/save (name=app.json, content=...)</li>
      <li>GET /config/delete?name=old.json</li>
    </ul>
  `);
});

// List directory (sandboxed)
app.get('/config/list', async (req, res) => {
  const dirRel = String(req.query.dir || '/');
  const real = await safeResolve(dirRel);
  if (!real) return res.status(400).json({ error: 'Invalid path' });

  try {
    const entries = await fsp.readdir(real, { withFileTypes: true });
    const list = entries.map(e => ({ name: e.name, type: e.isDirectory() ? 'dir' : 'file' }));
    res.json({ dir: dirRel, list });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

// View config (sandboxed)
app.get('/config/view', async (req, res) => {
  const name = String(req.query.name || 'app.json');
  const real = await safeResolve(name);
  if (!real) return res.status(400).send('Bad path');

  try {
    const txt = await fsp.readFile(real, 'utf8');
    res.type('application/json').send(txt);
  } catch {
    res.status(404).send('Not found');
  }
});

// Save config (sandboxed; avoid symlink overwrite)
app.post('/config/save', async (req, res) => {
  const name = String(req.body.name || '');
  const content = String(req.body.content || '{}');
  const real = await safeResolve(name);
  if (!real) return res.status(400).send('Bad path');

  try {
    await fsp.mkdir(path.dirname(real), { recursive: true });
    // refuse writing through existing symlink
    try { if (fs.lstatSync(real).isSymbolicLink()) return res.status(400).send('Refusing to write symlink'); } catch {}
    await fsp.writeFile(real, content, 'utf8');
    res.json({ ok: true, path: path.relative(ROOT, real).replace(/\\/g, '/') });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Delete config (sandboxed)
app.get('/config/delete', async (req, res) => {
  const name = String(req.query.name || '');
  const real = await safeResolve(name);
  if (!real) return res.status(400).send('Bad path');

  try {
    await fsp.unlink(real);
    res.json({ ok: true });
  } catch {
    res.status(404).json({ ok: false, error: 'Not found' });
  }
});

const port = process.env.PORT || 6092;
app.listen(port, () => console.log(`Config Manager (FIXED) http://localhost:${port}`));

