// fixed-image-resizer.js (FIXED)
'use strict';
const express = require('express');
const sharp = require('sharp');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
const IMAGES = path.resolve(__dirname, 'images');

function inside(root, target) {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function safeImagePath(relish) {
  const target = path.resolve(IMAGES, '.' + String(relish || ''));
  if (!inside(IMAGES, target)) return null;
  const realRoot = await fsp.realpath(IMAGES);
  let real;
  try { real = await fsp.realpath(target); } catch { return null; }
  if (!inside(realRoot, real)) return null;
  return real;
}

app.get('/img', async (req, res) => {
  const src = String(req.query.src || 'sample.jpg');
  const w = parseInt(req.query.w || '0', 10) || null;
  const h = parseInt(req.query.h || '0', 10) || null;

  const img = await safeImagePath(src);
  if (!img || !fs.existsSync(img)) return res.status(404).send('Not found');

  try {
    const pipeline = sharp(img);
    if (w || h) pipeline.resize(w || null, h || null);
    const format = path.extname(img).toLowerCase() === '.png' ? 'png' : 'jpeg';
    res.type(format);
    pipeline[format]().on('error', () => res.status(500).end()).pipe(res);
  } catch (e) {
    res.status(500).send('Error');
  }
});

app.get('/', (_req, res) => res.send(`<h2>Fixed Image Resize</h2>`));

app.listen(4302, () => console.log('FIXED image server on :4302'));

