'use strict';
const http = require('http');
const url = require('url');
const safeRun = function (tool, args) {
    const v42 = console.log('[safeRun]', tool, args);
    v42;
    const v43 = {};
    v43.code = 0;
    v43.stdout = 'simulated';
    v43.stderr = '';
    return v43;
};
const isToken = function (t) {
    const v44 = String(t);
    const v45 = /^[a-zA-Z0-9_.-]{1,32}$/.test(v44);
    return v45;
};
const v46 = ['--status'];
const v47 = [
    'status',
    v46
];
const v48 = ['--disk'];
const v49 = [
    'disk',
    v48
];
const v50 = ['--version'];
const v51 = [
    'version',
    v50
];
const v52 = [
    v47,
    v49,
    v51
];
const ACTIONS = new Map(v52);
const v79 = (req, res) => {
    const v53 = req.url;
    const parsed = url.parse(v53, true);
    const v54 = parsed.pathname;
    const v55 = v54 !== '/ssh/proxy';
    if (v55) {
        res.statusCode = 404;
        const v56 = res.end('not found');
        return v56;
    }
    const q = parsed.query;
    const v57 = q.user;
    const v58 = v57 || '';
    const user = String(v58);
    const v59 = q.host;
    const v60 = v59 || '';
    const host = String(v60);
    const v61 = q.action;
    const v62 = v61 || '';
    const action = String(v62);
    const v63 = isToken(user);
    const v64 = !v63;
    const v65 = isToken(host);
    const v66 = !v65;
    const v67 = v64 || v66;
    const v68 = ACTIONS.has(action);
    const v69 = !v68;
    const v70 = v67 || v69;
    if (v70) {
        res.statusCode = 400;
        const v71 = res.end('bad request');
        return v71;
    }
    const tool = '/usr/bin/ssh-lite';
    const v72 = ACTIONS.get(action);
    const args = [
        '--user',
        user,
        '--host',
        host,
        ...v72
    ];
    const r = safeRun(tool, args);
    const v73 = res.setHeader('content-type', 'application/json');
    v73;
    const v74 = r.code;
    const v75 = v74 === 0;
    const v76 = {
        ok: v75,
        user,
        host,
        action,
        simulated: true
    };
    const v77 = JSON.stringify(v76);
    const v78 = res.end(v77);
    v78;
};
const server = http.createServer(v79);
const v81 = () => {
    const v80 = console.log('Fixed SSH proxy on 8091/ssh/proxy');
    return v80;
};
const v82 = server.listen(8091, v81);
v82;