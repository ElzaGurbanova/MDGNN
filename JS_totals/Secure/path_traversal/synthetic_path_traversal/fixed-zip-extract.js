// fixed-zip-extract.js (FIXED)
'use strict';
const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'tmp') });
const OUT = path.resolve(__dirname, 'uploads');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

function inside(root, target) {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

app.post('/upload-zip', upload.single('archive'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file');

  try {
    const dir = await unzipper.Open.file(req.file.path);
    await Promise.all(dir.files.map(f => {
      // resolve against OUT with '.' to avoid absolute override
      const dest = path.resolve(OUT, '.' + f.path);
      if (!inside(OUT, dest)) return Promise.resolve(); // skip unsafe

      if (f.type === 'File') {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        // refuse to write through pre-existing symlinks
        try { if (fs.lstatSync(dest).isSymbolicLink()) return Promise.resolve(); } catch {}
        return new Promise((resolve, reject) =>
          f.stream().pipe(fs.createWriteStream(dest, { flags: 'wx' }))
            .on('finish', resolve).on('error', reject)
        );
      }
      return Promise.resolve();
    }));
    res.send('Extracted safely');
  } catch (e) {
    res.status(500).send('Extract failed');
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

app.get('/', (_req, res) => res.send('<form method=post enctype=multipart/form-data action=/upload-zip><input type=file name=archive><button>Upload</button></form>'));

app.listen(4202, () => console.log('FIXED unzip on :4202'));

