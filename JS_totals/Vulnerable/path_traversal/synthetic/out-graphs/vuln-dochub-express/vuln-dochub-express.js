'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const ROOT = path.resolve(__dirname, 'docs');
const v109 = { extended: false };
const v110 = express.urlencoded(v109);
const v111 = app.use(v110);
v111;
const v112 = express.json();
const v113 = app.use(v112);
v113;
const v121 = (req, _res, next) => {
    const v114 = new Date();
    const v115 = v114.toISOString();
    const v116 = req.method;
    const v117 = req.url;
    const v118 = `[DocHub] ${ v115 } ${ v116 } ${ v117 }`;
    const v119 = console.log(v118);
    v119;
    const v120 = next();
    v120;
};
const v122 = app.use(v121);
v122;
const v125 = (_req, res) => {
    const v123 = { ok: true };
    const v124 = res.json(v123);
    return v124;
};
const v126 = app.get('/health', v125);
v126;
const v150 = (req, res) => {
    const v127 = req.query;
    const v128 = v127.dir;
    const dir = v128 || '/';
    const normalized = path.normalize(dir);
    const target = path.join(ROOT, normalized);
    const v129 = target.startsWith(ROOT);
    const v130 = !v129;
    if (v130) {
        const v131 = res.status(400);
        const v132 = { error: 'Invalid path' };
        const v133 = v131.json(v132);
        return v133;
    }
    const v134 = { withFileTypes: true };
    const v148 = (err, entries) => {
        if (err) {
            const v135 = res.status(404);
            const v136 = { error: 'Not found' };
            const v137 = v135.json(v136);
            return v137;
        }
        const v145 = e => {
            const v138 = e.name;
            const v139 = e.isDirectory();
            let v140;
            if (v139) {
                v140 = 'dir';
            } else {
                v140 = 'file';
            }
            const v141 = e.name;
            const v142 = path.join(normalized, v141);
            const v143 = v142.replace(/\\/g, '/');
            const v144 = {};
            v144.name = v138;
            v144.type = v140;
            v144.rel = v143;
            return v144;
        };
        const list = entries.map(v145);
        const v146 = {
            dir: normalized,
            list
        };
        const v147 = res.json(v146);
        v147;
    };
    const v149 = fs.readdir(target, v134, v148);
    v149;
};
const v151 = app.get('/browse', v150);
v151;
const v164 = (req, res) => {
    const v152 = req.query;
    const v153 = v152.p;
    const p = v153 || 'README.md';
    const file = path.join(ROOT, p);
    const v154 = file.startsWith(ROOT);
    const v155 = !v154;
    if (v155) {
        const v156 = res.status(400);
        const v157 = v156.send('Bad path');
        return v157;
    }
    const v162 = (err, data) => {
        if (err) {
            const v158 = res.status(404);
            const v159 = v158.send('Not found');
            return v159;
        }
        const v160 = res.type('text/plain');
        const v161 = v160.send(data);
        v161;
    };
    const v163 = fs.readFile(file, 'utf8', v162);
    v163;
};
const v165 = app.get('/preview', v164);
v165;
const v181 = (req, res) => {
    const v166 = req.query;
    const v167 = v166.name;
    const v168 = v167 || '';
    const n = String(v168);
    const fp = path.join(ROOT, n);
    const v169 = fp.startsWith(ROOT);
    const v170 = !v169;
    if (v170) {
        const v171 = res.status(400);
        const v172 = v171.send('Bad path');
        return v172;
    }
    const v173 = fs.existsSync(fp);
    const v174 = !v173;
    if (v174) {
        const v175 = res.status(404);
        const v176 = v175.end();
        return v176;
    }
    const v177 = path.basename(n);
    const v178 = 'attachment; filename=' + v177;
    const v179 = res.setHeader('Content-Disposition', v178);
    v179;
    const v180 = res.sendFile(fp);
    v180;
};
const v182 = app.get('/download', v181);
v182;
const v204 = (req, res) => {
    const v183 = req.query;
    const v184 = v183.files;
    const v185 = v184 || '';
    const v186 = v185.split(',');
    const files = v186.filter(Boolean);
    const hits = [];
    const v200 = f => {
        const p = path.join(ROOT, f);
        const v187 = p.startsWith(ROOT);
        const v188 = fs.existsSync(p);
        const v189 = v187 && v188;
        const v190 = fs.statSync(p);
        const v191 = v190.isFile();
        const v192 = v189 && v191;
        if (v192) {
            const txt = fs.readFileSync(p, 'utf8');
            const v193 = req.query;
            const v194 = v193.q;
            const v195 = v194 || '';
            const v196 = txt.includes(v195);
            if (v196) {
                const v197 = txt.length;
                const v198 = {
                    file: f,
                    size: v197
                };
                const v199 = hits.push(v198);
                v199;
            }
        }
    };
    const v201 = files.forEach(v200);
    v201;
    const v202 = { hits };
    const v203 = res.json(v202);
    v203;
};
const v205 = app.get('/search', v204);
v205;
const v209 = (_req, res) => {
    const v206 = res.type('text/html');
    const v207 = `
  <h1>DocHub (VULNERABLE)</h1>
  <ul>
    <li>GET /browse?dir=/</li>
    <li>GET /preview?p=/etc/hosts</li>
    <li>GET /download?name=/etc/passwd</li>
    <li>GET /search?files=README.md,notes.txt&q=TODO</li>
  </ul>
`;
    const v208 = v206.send(v207);
    return v208;
};
const v210 = app.get('/', v209);
v210;
const v211 = process.env;
const v212 = v211.PORT;
const port = v212 || 5011;
const v215 = () => {
    const v213 = `DocHub running at http://localhost:${ port }`;
    const v214 = console.log(v213);
    return v214;
};
const v216 = app.listen(port, v215);
v216;