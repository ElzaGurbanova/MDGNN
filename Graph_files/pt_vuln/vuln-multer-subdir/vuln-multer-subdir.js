'use strict';
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const v41 = { extended: true };
const v42 = express.urlencoded(v41);
const v43 = app.use(v42);
v43;
const ROOT = path.resolve(__dirname, 'uploads');
const v44 = fs.existsSync(ROOT);
const v45 = !v44;
if (v45) {
    const v46 = { recursive: true };
    const v47 = fs.mkdirSync(ROOT, v46);
    v47;
}
const v54 = function (req, file, cb) {
    const v48 = req.body;
    const v49 = v48.subdir;
    const v50 = v49 || '';
    const dest = path.join(ROOT, v50);
    const v51 = { recursive: true };
    const v52 = fs.mkdirSync(dest, v51);
    v52;
    const v53 = cb(null, dest);
    v53;
};
const v57 = function (_req, file, cb) {
    const v55 = file.originalname;
    const v56 = cb(null, v55);
    v56;
};
const v58 = {
    destination: v54,
    filename: v57
};
const storage = multer.diskStorage(v58);
const v59 = { storage };
const upload = multer(v59);
const v60 = upload.single('f');
const v71 = (req, res) => {
    const v61 = req.file;
    const v62 = v61.originalname;
    const v63 = req.file;
    const v64 = v63.path;
    const v65 = path.relative(ROOT, v64);
    const v66 = v65.replace(/\\/g, '/');
    const v67 = req.file;
    const v68 = v67.size;
    const v69 = {
        name: v62,
        path: v66,
        size: v68
    };
    const v70 = res.json(v69);
    v70;
};
const v72 = app.post('/upload', v60, v71);
v72;
const v76 = (_req, res) => {
    const v73 = res.type('html');
    const v74 = `
<form method=post enctype=multipart/form-data action=/upload>
<label>Subdir: <input name=subdir value=images/></label>
<input type=file name=f /><button>Upload</button></form>
`;
    const v75 = v73.send(v74);
    return v75;
};
const v77 = app.get('/', v76);
v77;
const v79 = () => {
    const v78 = console.log('Multer subdir (VULN) on :5016');
    return v78;
};
const v80 = app.listen(5016, v79);
v80;