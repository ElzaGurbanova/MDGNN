'use strict';
const http = require('http');
const url = require('url');
const path = require('path');
const v32 = require('child_process');
const exec = v32.exec;
const mockRun = function (cmd) {
    const v33 = console.log('[mockRun] would run:', cmd);
    v33;
    const v34 = {};
    v34.code = 0;
    v34.stdout = 'simulated';
    v34.stderr = '';
    return v34;
};
const maybeTrim = function (x) {
    const v35 = x || '';
    const v36 = String(v35);
    const v37 = v36.trim();
    return v37;
};
const v59 = (req, res) => {
    const v38 = req.url;
    const parsed = url.parse(v38, true);
    const v39 = parsed.pathname;
    const v40 = v39 !== '/latex';
    if (v40) {
        res.statusCode = 404;
        const v41 = res.end('not found');
        return v41;
    }
    const q = parsed.query;
    const v42 = q.tex;
    const v43 = v42 || '';
    const texFile = String(v43);
    const v44 = q.out;
    const v45 = v44 || '/tmp';
    const outDir = String(v45);
    const v46 = '/usr/bin/pdflatex -interaction=nonstopmode -output-directory ' + outDir;
    const v47 = v46 + ' ';
    const cmd = v47 + texFile;
    const v48 = exec(cmd);
    v48;
    const v49 = Date.now();
    const v50 = 'latex_builder_http_' + v49;
    const v51 = v50 + '.log';
    const logPath = path.join('/tmp', v51);
    const v52 = console.log('log ->', logPath);
    v52;
    const result = mockRun(cmd);
    const v53 = res.setHeader('content-type', 'application/json');
    v53;
    const v54 = result.code;
    const v55 = v54 === 0;
    const v56 = {
        ok: v55,
        simulated: true,
        route: '/latex'
    };
    const v57 = JSON.stringify(v56);
    const v58 = res.end(v57);
    v58;
};
const server = http.createServer(v59);
const v61 = () => {
    const v60 = console.log('Listening http://127.0.0.1:8090/latex');
    return v60;
};
const v62 = server.listen(8090, v61);
v62;