'use strict';
const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');
const app = express();
const v47 = path.join(__dirname, 'tmp');
const v48 = { dest: v47 };
const upload = multer(v48);
const OUT = path.join(__dirname, 'uploads');
const v49 = fs.existsSync(OUT);
const v50 = !v49;
if (v50) {
    const v51 = { recursive: true };
    const v52 = fs.mkdirSync(OUT, v51);
    v52;
}
const v53 = upload.single('archive');
const v85 = async (req, res) => {
    const v54 = req.file;
    const v55 = !v54;
    if (v55) {
        const v56 = res.status(400);
        const v57 = v56.send('No file');
        return v57;
    }
    try {
        const v58 = unzipper.Open;
        const v59 = req.file;
        const v60 = v59.path;
        const dir = await v58.file(v60);
        const v61 = dir.files;
        const v76 = f => {
            const v62 = f.path;
            const out = path.join(OUT, v62);
            const v63 = f.type;
            const v64 = v63 === 'File';
            if (v64) {
                const v65 = path.dirname(out);
                const v66 = { recursive: true };
                const v67 = fs.mkdirSync(v65, v66);
                v67;
                const v73 = (resolve, reject) => {
                    const v68 = f.stream();
                    const v69 = fs.createWriteStream(out);
                    const v70 = v68.pipe(v69);
                    const v71 = v70.on('finish', resolve);
                    const v72 = v71.on('error', reject);
                    return v72;
                };
                const v74 = new Promise(v73);
                return v74;
            }
            const v75 = Promise.resolve();
            return v75;
        };
        const v77 = v61.map(v76);
        await Promise.all(v77);
        const v78 = res.send('Extracted');
        v78;
    } catch (e) {
        const v79 = res.status(500);
        const v80 = v79.send('Extract failed');
        v80;
    } finally {
        const v81 = req.file;
        const v82 = v81.path;
        const v83 = () => {
        };
        const v84 = fs.unlink(v82, v83);
        v84;
    }
};
const v86 = app.post('/upload-zip', v53, v85);
v86;
const v88 = (_req, res) => {
    const v87 = res.send('<form method=post enctype=multipart/form-data action=/upload-zip><input type=file name=archive><button>Upload</button></form>');
    return v87;
};
const v89 = app.get('/', v88);
v89;
const v91 = () => {
    const v90 = console.log('VULN unzip on :4201');
    return v90;
};
const v92 = app.listen(4201, v91);
v92;