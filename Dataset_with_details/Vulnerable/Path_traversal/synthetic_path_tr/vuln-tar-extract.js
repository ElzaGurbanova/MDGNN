// vuln-tar-extract.js
// VULNERABLE: writes header.name directly under OUT, enabling ../../ traversal.

'use strict';
const express = require('express');
const multer = require('multer');
const tar = require('tar-stream');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'tmp') });
const OUT = path.join(__dirname, 'workspace');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

app.post('/untar', upload.single('archive'), (req, res) => {
  if (!req.file) return res.status(400).send('No archive');

  const extract = tar.extract();
  extract.on('entry', (header, stream, next) => {
    const dest = path.join(OUT, header.name); // vulnerable
    if (header.type === 'directory') {
      fs.mkdirSync(dest, { recursive: true });
      stream.resume(); next();
      return;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    stream.pipe(fs.createWriteStream(dest)).on('finish', next);
  });
  extract.on('finish', () => res.send('ok'));

  fs.createReadStream(req.file.path).pipe(extract);
});

app.get('/', (_req, res) =>
  res.send(`<form method=post enctype=multipart/form-data action=/untar>
  <input type=file name=archive /><button>Upload TAR</button></form>`));

app.listen(5015, () => console.log('TAR extractor (VULN) on :5015'));

