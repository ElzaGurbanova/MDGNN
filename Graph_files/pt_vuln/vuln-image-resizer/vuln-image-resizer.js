'use strict';
const express = require('express');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const app = express();
const IMAGES = path.resolve(__dirname, 'images');
const v70 = async (req, res) => {
    const v40 = req.query;
    const v41 = v40.src;
    const src = v41 || 'sample.jpg';
    const v42 = req.query;
    const v43 = v42.w;
    const v44 = v43 || '0';
    const v45 = parseInt(v44, 10);
    const w = v45 || null;
    const v46 = req.query;
    const v47 = v46.h;
    const v48 = v47 || '0';
    const v49 = parseInt(v48, 10);
    const h = v49 || null;
    const filePath = path.join(IMAGES, src);
    const v50 = fs.existsSync(filePath);
    const v51 = !v50;
    if (v51) {
        const v52 = res.status(404);
        const v53 = v52.send('Not found');
        return v53;
    }
    try {
        const pipeline = sharp(filePath);
        const v54 = w || h;
        if (v54) {
            const v55 = w || null;
            const v56 = h || null;
            const v57 = pipeline.resize(v55, v56);
            v57;
        }
        let format;
        const v58 = path.extname(filePath);
        const v59 = v58.toLowerCase();
        const v60 = v59 === '.png';
        if (v60) {
            format = 'png';
        } else {
            format = 'jpeg';
        }
        const v61 = res.type(format);
        v61;
        const v62 = pipeline[format]();
        const v65 = () => {
            const v63 = res.status(500);
            const v64 = v63.end();
            return v64;
        };
        const v66 = v62.on('error', v65);
        const v67 = v66.pipe(res);
        v67;
    } catch (e) {
        const v68 = res.status(500);
        const v69 = v68.send('Error');
        v69;
    }
};
const v71 = app.get('/img', v70);
v71;
const v74 = (_req, res) => {
    const v72 = `
  <h2>Vulnerable Image Resize</h2>
  <p>Try /img?src=/etc/passwd or /img?src=../../secret.png</p>
`;
    const v73 = res.send(v72);
    return v73;
};
const v75 = app.get('/', v74);
v75;
const v77 = () => {
    const v76 = console.log('VULN image server on :4301');
    return v76;
};
const v78 = app.listen(4301, v77);
v78;