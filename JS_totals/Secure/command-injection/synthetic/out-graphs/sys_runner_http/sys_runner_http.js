'use strict';
const http = require('http');
const url = require('url');
const v27 = ['--iso-8601=seconds'];
const v28 = [
    'date',
    v27
];
const v29 = ['--pretty'];
const v30 = [
    'uptime',
    v29
];
const v31 = [
    v28,
    v30
];
const ALLOWED = new Map(v31);
const v49 = (req, res) => {
    const v32 = req.url;
    const parsed = url.parse(v32, true);
    const v33 = parsed.pathname;
    const v34 = v33 !== '/sys/run';
    if (v34) {
        res.statusCode = 404;
        const v35 = res.end('not found');
        return v35;
    }
    const v36 = parsed.query;
    const v37 = v36.name;
    const v38 = v37 || '';
    const name = String(v38);
    const v39 = ALLOWED.has(name);
    const v40 = !v39;
    if (v40) {
        res.statusCode = 400;
        const v41 = res.end('not allowed');
        return v41;
    }
    let out;
    const v42 = name === 'date';
    const v43 = new Date();
    const v44 = v43.toISOString();
    if (v42) {
        out = v44;
    } else {
        out = 'up 1 day (simulated)';
    }
    const v45 = res.setHeader('content-type', 'application/json');
    v45;
    const v46 = {
        ok: true,
        out,
        simulated: true
    };
    const v47 = JSON.stringify(v46);
    const v48 = res.end(v47);
    v48;
};
const server = http.createServer(v49);
const v51 = () => {
    const v50 = console.log('Fixed sys runner http://127.0.0.1:8202/sys/run');
    return v50;
};
const v52 = server.listen(8202, v51);
v52;