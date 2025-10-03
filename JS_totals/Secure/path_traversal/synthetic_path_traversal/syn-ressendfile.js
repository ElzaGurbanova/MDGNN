// 3) Express Assets with `res.sendFile` root + slugged images (two different safe patterns)
'use strict';
const express = require('express');
const path = require('path');
const app = express();

const ASSETS_ROOT = path.resolve(__dirname, 'assets');

// Pattern A: res.sendFile with fixed root + normalized request path
app.get('/assets/*', (req, res) => {
  const raw = (req.params[0] || '').replace(/\\/g, '/');
  if (raw.includes('..')) return res.status(400).end(); // quick reject
  // Express ensures it won’t serve outside `root`:
  res.sendFile(raw, {
    root: ASSETS_ROOT,
    dotfiles: 'deny',
    fallthrough: false
  }, err => { if (err) res.status(err.statusCode || 404).end(); });
});

// Pattern B: strictly-slugged image names (no path-handling at all)
app.get('/img/:slug', (req, res) => {
  const slug = String(req.params.slug || '');
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(slug)) return res.status(400).end();
  const safeRel = slug + '.png'; // extension is fixed
  res.sendFile(safeRel, { root: ASSETS_ROOT, dotfiles: 'deny' }, err => {
    if (err) res.status(404).end();
  });
});

app.get('/', (_req, res) => res.send('<img src="/img/logo"> or <a href="/assets/css/site.css">css</a>'));
app.listen(7003, () => console.log('Express assets (root+slug) on :7003'));

