'use strict';
const http = require('http');
const url = require('url');
const path = require('path');
const v33 = require('child_process');
const exec = v33.exec;
const mockRun = function (cmd) {
    const v34 = console.log('[mockRun] would run:', cmd);
    v34;
    const v35 = {};
    v35.code = 0;
    v35.stdout = 'simulated';
    v35.stderr = '';
    return v35;
};
const maybeTrim = function (x) {
    const v36 = x || '';
    const v37 = String(v36);
    const v38 = v37.trim();
    return v38;
};
const v61 = (req, res) => {
    const v39 = req.url;
    const parsed = url.parse(v39, true);
    const v40 = parsed.pathname;
    const v41 = v40 !== '/cron';
    if (v41) {
        res.statusCode = 404;
        const v42 = res.end('not found');
        return v42;
    }
    const q = parsed.query;
    const v43 = q.spec;
    const v44 = v43 || '';
    const spec = String(v44);
    const v45 = q.task;
    const v46 = v45 || '';
    const task = String(v46);
    const v47 = '/usr/bin/crontab -l && echo "' + spec;
    const v48 = v47 + ' ';
    const v49 = v48 + task;
    const cmd = v49 + '"';
    const v50 = exec(cmd);
    v50;
    const v51 = Date.now();
    const v52 = 'cron_manager_http_' + v51;
    const v53 = v52 + '.log';
    const logPath = path.join('/tmp', v53);
    const v54 = console.log('log ->', logPath);
    v54;
    const result = mockRun(cmd);
    const v55 = res.setHeader('content-type', 'application/json');
    v55;
    const v56 = result.code;
    const v57 = v56 === 0;
    const v58 = {
        ok: v57,
        simulated: true,
        route: '/cron'
    };
    const v59 = JSON.stringify(v58);
    const v60 = res.end(v59);
    v60;
};
const server = http.createServer(v61);
const v63 = () => {
    const v62 = console.log('Listening http://127.0.0.1:8090/cron');
    return v62;
};
const v64 = server.listen(8090, v63);
v64;