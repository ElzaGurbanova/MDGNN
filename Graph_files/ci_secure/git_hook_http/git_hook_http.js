'use strict';
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const v35 = [
    'pre-commit',
    'post-commit',
    'pre-push',
    'post-checkout'
];
const ALLOWED_HOOKS = new Set(v35);
const underRepo = function (p) {
    const v36 = p || '';
    const v37 = String(v36);
    const full = path.resolve('/srv/repos', v37);
    const v38 = path.sep;
    const v39 = '/srv/repos' + v38;
    const v40 = full.startsWith(v39);
    let v41;
    if (v40) {
        v41 = full;
    } else {
        v41 = null;
    }
    return v41;
};
const v65 = (req, res) => {
    const v42 = req.url;
    const parsed = url.parse(v42, true);
    const v43 = parsed.pathname;
    const v44 = v43 !== '/git/hook';
    if (v44) {
        res.statusCode = 404;
        const v45 = res.end('not found');
        return v45;
    }
    const v46 = parsed.query;
    const v47 = v46.repo;
    const v48 = v47 || '';
    const repo = underRepo(v48);
    const v49 = parsed.query;
    const v50 = v49.hook;
    const v51 = v50 || '';
    const hook = String(v51);
    const v52 = !repo;
    const v53 = ALLOWED_HOOKS.has(hook);
    const v54 = !v53;
    const v55 = v52 || v54;
    if (v55) {
        res.statusCode = 400;
        const v56 = res.end('bad req');
        return v56;
    }
    const v57 = Date.now();
    const record = {};
    record.repo = repo;
    record.hook = hook;
    record.ts = v57;
    const v58 = JSON.stringify(record);
    const v59 = v58 + '\n';
    const v60 = fs.appendFileSync('/tmp/git_hooks_audit.jsonl', v59);
    v60;
    const v61 = res.setHeader('content-type', 'application/json');
    v61;
    const v62 = {
        ok: true,
        simulated: true
    };
    const v63 = JSON.stringify(v62);
    const v64 = res.end(v63);
    v64;
};
const server = http.createServer(v65);
const v67 = () => {
    const v66 = console.log('Fixed git hook http://127.0.0.1:8201/git/hook');
    return v66;
};
const v68 = server.listen(8201, v67);
v68;