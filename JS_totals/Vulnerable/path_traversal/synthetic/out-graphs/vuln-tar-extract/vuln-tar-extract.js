'use strict';
const express = require('express');
const multer = require('multer');
const tar = require('tar-stream');
const fs = require('fs');
const path = require('path');
const app = express();
const v43 = path.join(__dirname, 'tmp');
const v44 = { dest: v43 };
const upload = multer(v44);
const OUT = path.join(__dirname, 'workspace');
const v45 = fs.existsSync(OUT);
const v46 = !v45;
if (v46) {
    const v47 = { recursive: true };
    const v48 = fs.mkdirSync(OUT, v47);
    v48;
}
const v49 = upload.single('archive');
const v76 = (req, res) => {
    const v50 = req.file;
    const v51 = !v50;
    if (v51) {
        const v52 = res.status(400);
        const v53 = v52.send('No archive');
        return v53;
    }
    const extract = tar.extract();
    const v67 = (header, stream, next) => {
        const v54 = header.name;
        const dest = path.join(OUT, v54);
        const v55 = header.type;
        const v56 = v55 === 'directory';
        if (v56) {
            const v57 = { recursive: true };
            const v58 = fs.mkdirSync(dest, v57);
            v58;
            const v59 = stream.resume();
            v59;
            const v60 = next();
            v60;
            return;
        }
        const v61 = path.dirname(dest);
        const v62 = { recursive: true };
        const v63 = fs.mkdirSync(v61, v62);
        v63;
        const v64 = fs.createWriteStream(dest);
        const v65 = stream.pipe(v64);
        const v66 = v65.on('finish', next);
        v66;
    };
    const v68 = extract.on('entry', v67);
    v68;
    const v70 = () => {
        const v69 = res.send('ok');
        return v69;
    };
    const v71 = extract.on('finish', v70);
    v71;
    const v72 = req.file;
    const v73 = v72.path;
    const v74 = fs.createReadStream(v73);
    const v75 = v74.pipe(extract);
    v75;
};
const v77 = app.post('/untar', v49, v76);
v77;
const v80 = (_req, res) => {
    const v78 = `<form method=post enctype=multipart/form-data action=/untar>
  <input type=file name=archive /><button>Upload TAR</button></form>`;
    const v79 = res.send(v78);
    return v79;
};
const v81 = app.get('/', v80);
v81;
const v83 = () => {
    const v82 = console.log('TAR extractor (VULN) on :5015');
    return v82;
};
const v84 = app.listen(5015, v83);
v84;