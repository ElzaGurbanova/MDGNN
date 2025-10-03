// vuln-multer-subdir.js
// VULNERABLE: destination uses req.body.subdir unvalidated.

'use strict';
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));

const ROOT = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(ROOT)) fs.mkdirSync(ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dest = path.join(ROOT, req.body.subdir || ''); // traversal
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename(_req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('f'), (req, res) => {
  res.json({
    name: req.file.originalname,
    path: path.relative(ROOT, req.file.path).replace(/\\/g, '/'),
    size: req.file.size
  });
});

app.get('/', (_req, res) => res.type('html').send(`
<form method=post enctype=multipart/form-data action=/upload>
<label>Subdir: <input name=subdir value=images/></label>
<input type=file name=f /><button>Upload</button></form>
`));

app.listen(5016, () => console.log('Multer subdir (VULN) on :5016'));

