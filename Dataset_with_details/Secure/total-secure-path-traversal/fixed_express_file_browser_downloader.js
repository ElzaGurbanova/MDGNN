// fixed-file-browser.js (FIXED)
'use strict';
const express = require('express');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
const ROOT = path.resolve(__dirname, 'public');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// helpers
function inside(root, target) {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function safeResolve(relish) {
  const target = path.resolve(ROOT, '.' + String(relish || ''));
  if (!inside(ROOT, target)) return null;

  // realpath defense (avoid symlink escapes)
  const realRoot = await fsp.realpath(ROOT);
  let real;
  try { real = await fsp.realpath(target); }
  catch { return null; }
  if (!inside(realRoot, real)) return null;
  return real;
}

// sandboxed directory listing
app.get('/browse', async (req, res) => {
  const dir = String(req.query.dir || '/');
  const real = await safeResolve(dir);
  if (!real) return res.status(400).json({ error: 'Invalid path' });

  fsp.readdir(real, { withFileTypes: true })
    .then(entries => {
      const list = entries.map(e => ({
        name: e.name,
        type: e.isDirectory() ? 'dir' : 'file',
        path: path.posix.join(dir.replace(/\\/g, '/'), e.name)
      }));
      res.json({ root: ROOT, dir, list });
    })
    .catch(() => res.status(404).json({ error: 'Not found' }));
});

// preview text file (sandboxed)
app.get('/preview', async (req, res) => {
  const p = String(req.query.p || '');
  const real = await safeResolve(p);
  if (!real) return res.status(400).send('Invalid path');

  fsp.readFile(real, 'utf8')
    .then(data => res.type('text/plain').send(data))
    .catch(() => res.status(404).send('Not found'));
});

// download endpoint (sandboxed)
app.get('/download', async (req, res) => {
  const n = String(req.query.name || '');
  const real = await safeResolve(n);
  if (!real) return res.status(400).send('Invalid path');
  if (!fs.existsSync(real)) return res.status(404).end();
  res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(real));
  res.sendFile(real);
});

app.get('/', (_req, res) => {
  res.type('text/html').send(`<h1>Fixed File Browser</h1>`);
});

const port = process.env.PORT || 4002;
app.listen(port, () => {
  console.log(`FIXED browser on http://localhost:${port}`);
});

