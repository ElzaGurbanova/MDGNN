// 1) Express Secure File API (resolve + relative + realpath checks)
'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const mime = require('mime-types');

const app = express();
const BASE = path.resolve(__dirname, 'safe-files'); // sandbox root

function inside(base, target) {
  const rel = path.relative(base, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function safeResolve(relish) {
  const t = path.resolve(BASE, '.' + String(relish || ''));
  if (!inside(BASE, t)) return null;                      // absolute override / ..
  try {
    const realBase = await fsp.realpath(BASE);
    const realT = await fsp.realpath(t);                  // follow symlinks safely
    if (!inside(realBase, realT)) return null;            // symlink escape
    return realT;
  } catch { return null; }
}

app.get('/download', async (req, res) => {
  const rel = String(req.query.path || '');
  const full = await safeResolve(rel);
  if (!full) return res.status(400).send('Invalid path');
  try {
    const st = await fsp.stat(full);
    if (!st.isFile()) return res.status(404).send('Not found');
    res.type(mime.lookup(full) || 'application/octet-stream');
    fs.createReadStream(full).on('error', () => res.status(500).end()).pipe(res);
  } catch { res.status(404).send('Not found'); }
});

app.get('/', (_req, res) => res.send('<a href="/download?path=readme.txt">get readme</a>'));
app.listen(7001, () => console.log('Express secure file API on :7001'));

