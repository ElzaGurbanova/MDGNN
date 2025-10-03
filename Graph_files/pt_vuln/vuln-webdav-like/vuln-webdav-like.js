'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const ROOT = path.resolve(__dirname, 'repo');
const v62 = express.json();
const v63 = app.use(v62);
v63;
const v83 = (req, res) => {
    const v64 = req.body;
    const v65 = v64.path;
    const p = v65 || '/';
    const v66 = path.normalize(p);
    const dir = path.join(ROOT, v66);
    const v67 = dir.startsWith(ROOT);
    const v68 = !v67;
    if (v68) {
        const v69 = res.status(400);
        const v70 = v69.send('bad path');
        return v70;
    }
    const v71 = fs.existsSync(dir);
    const v72 = !v71;
    if (v72) {
        const v73 = res.status(404);
        const v74 = v73.end();
        return v74;
    }
    const v75 = { withFileTypes: true };
    const v76 = fs.readdirSync(dir, v75);
    const v81 = e => {
        const v77 = e.name;
        const v78 = e.isDirectory();
        let v79;
        if (v78) {
            v79 = 'collection';
        } else {
            v79 = 'file';
        }
        const v80 = {};
        v80.name = v77;
        v80.type = v79;
        return v80;
    };
    const entries = v76.map(v81);
    const v82 = res.json(entries);
    v82;
};
const v84 = app.post('/propfind', v83);
v84;
const v98 = (req, res) => {
    const v85 = req.query;
    const v86 = v85.path;
    const v87 = v86 || '';
    const file = path.join(ROOT, v87);
    const v88 = file.startsWith(ROOT);
    const v89 = !v88;
    if (v89) {
        const v90 = res.status(400);
        const v91 = v90.end();
        return v91;
    }
    const v92 = fs.existsSync(file);
    const v93 = !v92;
    if (v93) {
        const v94 = res.status(404);
        const v95 = v94.end();
        return v95;
    }
    const v96 = fs.createReadStream(file);
    const v97 = v96.pipe(res);
    v97;
};
const v99 = app.get('/get', v98);
v99;
const v118 = (req, res) => {
    const v100 = req.query;
    const v101 = v100.path;
    const v102 = v101 || '';
    const file = path.join(ROOT, v102);
    const v103 = file.startsWith(ROOT);
    const v104 = !v103;
    if (v104) {
        const v105 = res.status(400);
        const v106 = v105.end();
        return v106;
    }
    const v107 = path.dirname(file);
    const v108 = { recursive: true };
    const v109 = fs.mkdirSync(v107, v108);
    v109;
    const chunks = [];
    const v111 = d => {
        const v110 = chunks.push(d);
        return v110;
    };
    const v112 = req.on('data', v111);
    v112;
    const v116 = () => {
        const v113 = Buffer.concat(chunks);
        const v114 = fs.writeFileSync(file, v113);
        v114;
        const v115 = res.end('OK');
        v115;
    };
    const v117 = req.on('end', v116);
    v117;
};
const v119 = app.put('/put', v118);
v119;
const v121 = () => {
    const v120 = console.log('WebDAV-like API (VULN) on :5018');
    return v120;
};
const v122 = app.listen(5018, v121);
v122;