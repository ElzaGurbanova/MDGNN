// vuln-zip-extract.js (VULNERABLE)
'use strict';
const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'tmp') });
const OUT = path.join(__dirname, 'uploads');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

app.post('/upload-zip', upload.single('archive'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file');

  // Vulnerable: direct extract without checking entry paths
  try {
    const dir = await unzipper.Open.file(req.file.path);
    await Promise.all(dir.files.map(f => {
      const out = path.join(OUT, f.path);  // Zip Slip: f.path may contain ../../
      if (f.type === 'File') {
        fs.mkdirSync(path.dirname(out), { recursive: true });
        return new Promise((resolve, reject) =>
          f.stream().pipe(fs.createWriteStream(out)).on('finish', resolve).on('error', reject)
        );
      }
      return Promise.resolve();
    }));
    res.send('Extracted');
  } catch (e) {
    res.status(500).send('Extract failed');
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

app.get('/', (_req, res) => res.send('<form method=post enctype=multipart/form-data action=/upload-zip><input type=file name=archive><button>Upload</button></form>'));

app.listen(4201, () => console.log('VULN unzip on :4201'));

