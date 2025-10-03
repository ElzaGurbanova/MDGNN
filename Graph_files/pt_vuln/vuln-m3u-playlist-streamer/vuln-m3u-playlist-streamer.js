'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const ROOT = path.resolve(__dirname, 'media');
const v97 = (req, _res, next) => {
    const v92 = req.method;
    const v93 = req.url;
    const v94 = `[Playlist] ${ v92 } ${ v93 }`;
    const v95 = console.log(v94);
    v95;
    const v96 = next();
    v96;
};
const v98 = app.use(v97);
v98;
const v126 = (req, res) => {
    const v99 = req.query;
    const v100 = v99.m;
    const v101 = v100 || 'default.m3u';
    const m3u = String(v101);
    const m3uPath = path.join(ROOT, m3u);
    const v102 = m3uPath.startsWith(ROOT);
    const v103 = !v102;
    if (v103) {
        const v104 = res.status(400);
        const v105 = v104.send('Invalid playlist path');
        return v105;
    }
    const v106 = fs.existsSync(m3uPath);
    const v107 = !v106;
    const v108 = fs.statSync(m3uPath);
    const v109 = v108.isFile();
    const v110 = !v109;
    const v111 = v107 || v110;
    if (v111) {
        const v112 = res.status(404);
        const v113 = v112.send('Playlist not found');
        return v113;
    }
    const raw = fs.readFileSync(m3uPath, 'utf8');
    const v114 = raw.split(/\r?\n/);
    const v118 = l => {
        const v115 = l.startsWith('#');
        const v116 = !v115;
        const v117 = l && v116;
        return v117;
    };
    const items = v114.filter(v118);
    const v121 = p => {
        const v119 = encodeURIComponent(p);
        const href = `/stream?path=${ v119 }`;
        const v120 = `<li><a href="${ href }">${ p }</a></li>`;
        return v120;
    };
    const v122 = items.map(v121);
    const list = v122.join('');
    const v123 = res.type('html');
    const v124 = `
    <h1>Playlist: ${ m3u }</h1>
    <ul>${ list }</ul>
    <p>Try: <code>/stream?path=/etc/passwd</code> or entries with <code>..</code></p>
  `;
    const v125 = v123.send(v124);
    v125;
};
const v127 = app.get('/playlist', v126);
v127;
const v150 = (req, res) => {
    const v128 = req.query;
    const v129 = v128.path;
    const v130 = v129 || '';
    const p = String(v130);
    const file = path.join(ROOT, p);
    const v131 = file.startsWith(ROOT);
    const v132 = !v131;
    if (v132) {
        const v133 = res.status(400);
        const v134 = v133.send('Invalid path');
        return v134;
    }
    const v135 = fs.existsSync(file);
    const v136 = !v135;
    const v137 = fs.statSync(file);
    const v138 = v137.isFile();
    const v139 = !v138;
    const v140 = v136 || v139;
    if (v140) {
        const v141 = res.status(404);
        const v142 = v141.send('Not found');
        return v142;
    }
    const v143 = res.setHeader('Content-Type', 'audio/mpeg');
    v143;
    const v144 = fs.createReadStream(file);
    const v147 = () => {
        const v145 = res.status(500);
        const v146 = v145.end();
        return v146;
    };
    const v148 = v144.on('error', v147);
    const v149 = v148.pipe(res);
    v149;
};
const v151 = app.get('/stream', v150);
v151;
const v170 = (req, res) => {
    const v152 = req.query;
    const v153 = v152.img;
    const v154 = v153 || 'cover.jpg';
    const img = String(v154);
    const file = path.join(ROOT, img);
    const v155 = file.startsWith(ROOT);
    const v156 = !v155;
    if (v156) {
        const v157 = res.status(400);
        const v158 = v157.send('Invalid path');
        return v158;
    }
    const v159 = fs.existsSync(file);
    const v160 = !v159;
    if (v160) {
        const v161 = res.status(404);
        const v162 = v161.send('Not found');
        return v162;
    }
    const v163 = path.extname(file);
    const v164 = v163.toLowerCase();
    const v165 = v164 === '.png';
    let v166;
    if (v165) {
        v166 = 'png';
    } else {
        v166 = 'jpeg';
    }
    const v167 = res.type(v166);
    v167;
    const v168 = fs.createReadStream(file);
    const v169 = v168.pipe(res);
    v169;
};
const v171 = app.get('/cover', v170);
v171;
const v175 = (_req, res) => {
    const v172 = res.type('html');
    const v173 = `
    <h2>M3U Playlist Streamer (VULNERABLE)</h2>
    <ul>
      <li>GET /playlist?m=default.m3u</li>
      <li>GET /stream?path=/etc/hosts</li>
      <li>GET /cover?img=../../secret.png</li>
    </ul>
  `;
    const v174 = v172.send(v173);
    v174;
};
const v176 = app.get('/', v175);
v176;
const v177 = process.env;
const v178 = v177.PORT;
const port = v178 || 6091;
const v181 = () => {
    const v179 = `Playlist Streamer (VULN) http://localhost:${ port }`;
    const v180 = console.log(v179);
    return v180;
};
const v182 = app.listen(port, v181);
v182;