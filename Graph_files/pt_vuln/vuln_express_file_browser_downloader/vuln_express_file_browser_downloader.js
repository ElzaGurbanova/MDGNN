'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const ROOT = path.resolve(__dirname, 'public');
const v83 = { extended: false };
const v84 = express.urlencoded(v83);
const v85 = app.use(v84);
v85;
const v86 = express.json();
const v87 = app.use(v86);
v87;
const v95 = (req, res, next) => {
    const v88 = new Date();
    const v89 = v88.toISOString();
    const v90 = req.method;
    const v91 = req.url;
    const v92 = `[${ v89 }] ${ v90 } ${ v91 }`;
    const v93 = console.log(v92);
    v93;
    const v94 = next();
    v94;
};
const v96 = app.use(v95);
v96;
const v121 = (req, res) => {
    const v97 = req.query;
    const v98 = v97.dir;
    const dir = v98 || '/';
    const v99 = path.normalize(dir);
    const normalized = v99.replace(/^\s+/, '');
    const target = path.join(ROOT, normalized);
    const v100 = target.startsWith(ROOT);
    const v101 = !v100;
    if (v101) {
        const v102 = res.status(400);
        const v103 = { error: 'Bad path' };
        const v104 = v102.json(v103);
        return v104;
    }
    const v105 = { withFileTypes: true };
    const v119 = (err, entries) => {
        if (err) {
            const v106 = res.status(404);
            const v107 = { error: 'Not found' };
            const v108 = v106.json(v107);
            return v108;
        }
        const v116 = e => {
            const v109 = e.name;
            const v110 = e.isDirectory();
            let v111;
            if (v110) {
                v111 = 'dir';
            } else {
                v111 = 'file';
            }
            const v112 = e.name;
            const v113 = path.join(normalized, v112);
            const v114 = v113.replace(/\\/g, '/');
            const v115 = {};
            v115.name = v109;
            v115.type = v111;
            v115.path = v114;
            return v115;
        };
        const list = entries.map(v116);
        const v117 = {
            root: ROOT,
            dir: normalized,
            list
        };
        const v118 = res.json(v117);
        v118;
    };
    const v120 = fs.readdir(target, v105, v119);
    v120;
};
const v122 = app.get('/browse', v121);
v122;
const v135 = (req, res) => {
    const v123 = req.query;
    const v124 = v123.p;
    const p = v124 || '';
    const file = path.join(ROOT, p);
    const v125 = file.startsWith(ROOT);
    const v126 = !v125;
    if (v126) {
        const v127 = res.status(400);
        const v128 = v127.send('Invalid path');
        return v128;
    }
    const v133 = (err, data) => {
        if (err) {
            const v129 = res.status(404);
            const v130 = v129.send('Not found');
            return v130;
        }
        const v131 = res.type('text/plain');
        const v132 = v131.send(data);
        v132;
    };
    const v134 = fs.readFile(file, 'utf8', v133);
    v134;
};
const v136 = app.get('/preview', v135);
v136;
const v152 = (req, res) => {
    const v137 = req.query;
    const v138 = v137.name;
    const v139 = v138 || '';
    const n = String(v139);
    const fp = path.join(ROOT, n);
    const v140 = fp.startsWith(ROOT);
    const v141 = !v140;
    if (v141) {
        const v142 = res.status(400);
        const v143 = v142.send('Bad request');
        return v143;
    }
    const v144 = fs.existsSync(fp);
    const v145 = !v144;
    if (v145) {
        const v146 = res.status(404);
        const v147 = v146.end();
        return v147;
    }
    const v148 = path.basename(n);
    const v149 = 'attachment; filename=' + v148;
    const v150 = res.setHeader('Content-Disposition', v149);
    v150;
    const v151 = res.sendFile(fp);
    v151;
};
const v153 = app.get('/download', v152);
v153;
const v157 = (_req, res) => {
    const v154 = res.type('text/html');
    const v155 = `
    <h1>Vulnerable File Browser</h1>
    <p>Try /browse?dir=/etc or /download?name=/etc/passwd</p>
  `;
    const v156 = v154.send(v155);
    v156;
};
const v158 = app.get('/', v157);
v158;
const v159 = process.env;
const v160 = v159.PORT;
const port = v160 || 4001;
const v163 = () => {
    const v161 = `VULN browser on http://localhost:${ port }`;
    const v162 = console.log(v161);
    v162;
};
const v164 = app.listen(port, v163);
v164;