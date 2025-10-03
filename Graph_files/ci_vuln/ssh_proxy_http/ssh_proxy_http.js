'use strict';
const http = require('http');
const url = require('url');
const path = require('path');
const v36 = require('child_process');
const exec = v36.exec;
const mockRun = function (cmd) {
    const v37 = console.log('[mockRun] would run:', cmd);
    v37;
    const v38 = {};
    v38.code = 0;
    v38.stdout = 'simulated';
    v38.stderr = '';
    return v38;
};
const maybeTrim = function (x) {
    const v39 = x || '';
    const v40 = String(v39);
    const v41 = v40.trim();
    return v41;
};
const v67 = (req, res) => {
    const v42 = req.url;
    const parsed = url.parse(v42, true);
    const v43 = parsed.pathname;
    const v44 = v43 !== '/ssh/proxy';
    if (v44) {
        res.statusCode = 404;
        const v45 = res.end('not found');
        return v45;
    }
    const q = parsed.query;
    const v46 = q.user;
    const v47 = v46 || '';
    const user = String(v47);
    const v48 = q.host;
    const v49 = v48 || '';
    const host = String(v49);
    const v50 = q.remote;
    const v51 = v50 || '';
    const remote = String(v51);
    const v52 = '/usr/bin/ssh ' + user;
    const v53 = v52 + '@';
    const v54 = v53 + host;
    const v55 = v54 + ' ';
    const cmd = v55 + remote;
    const v56 = exec(cmd);
    v56;
    const v57 = Date.now();
    const v58 = 'ssh_proxy_http_' + v57;
    const v59 = v58 + '.log';
    const logPath = path.join('/tmp', v59);
    const v60 = console.log('log ->', logPath);
    v60;
    const result = mockRun(cmd);
    const v61 = res.setHeader('content-type', 'application/json');
    v61;
    const v62 = result.code;
    const v63 = v62 === 0;
    const v64 = {
        ok: v63,
        simulated: true,
        route: '/ssh/proxy'
    };
    const v65 = JSON.stringify(v64);
    const v66 = res.end(v65);
    v66;
};
const server = http.createServer(v67);
const v69 = () => {
    const v68 = console.log('Listening http://127.0.0.1:8090/ssh/proxy');
    return v68;
};
const v70 = server.listen(8090, v69);
v70;