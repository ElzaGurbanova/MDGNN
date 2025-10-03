// vuln-image-resizer.js (VULNERABLE)
'use strict';
const express = require('express');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const IMAGES = path.resolve(__dirname, 'images'); // intended base, but not enforced

app.get('/img', async (req, res) => {
  const src = req.query.src || 'sample.jpg';
  const w = parseInt(req.query.w || '0', 10) || null;
  const h = parseInt(req.query.h || '0', 10) || null;

  // Direct join and stream (absolute override; symlink follow)
  const filePath = path.join(IMAGES, src);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');

  try {
    const pipeline = sharp(filePath);
    if (w || h) pipeline.resize(w || null, h || null);
    const format = path.extname(filePath).toLowerCase() === '.png' ? 'png' : 'jpeg';
    res.type(format);
    pipeline[format]().on('error', () => res.status(500).end()).pipe(res);
  } catch (e) {
    res.status(500).send('Error');
  }
});

app.get('/', (_req, res) => res.send(`
  <h2>Vulnerable Image Resize</h2>
  <p>Try /img?src=/etc/passwd or /img?src=../../secret.png</p>
`));

app.listen(4301, () => console.log('VULN image server on :4301'));

