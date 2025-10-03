'use strict';
const v77 = function installDryRunShim() {
    const Module = require('module');
    const v49 = Module.prototype;
    const origRequire = v49.require;
    const v50 = Module.prototype;
    const v74 = function (name) {
        const v51 = name === 'child_process';
        if (v51) {
            const v52 = require('events');
            const EventEmitter = v52.EventEmitter;
            const v59 = function (cmd, opts, cb) {
                const v53 = typeof opts;
                const v54 = v53 === 'function';
                if (v54) {
                    cb = opts;
                    opts = {};
                }
                const v55 = console.log('[DRYRUN exec]', cmd);
                v55;
                if (cb) {
                    const v57 = () => {
                        const v56 = cb(null, 'simulated', '');
                        return v56;
                    };
                    const v58 = process.nextTick(v57);
                    v58;
                }
            };
            const v66 = function (file, args = [], opts, cb) {
                const v60 = typeof opts;
                const v61 = v60 === 'function';
                if (v61) {
                    cb = opts;
                    opts = {};
                }
                const v62 = console.log('[DRYRUN execFile]', file, args);
                v62;
                if (cb) {
                    const v64 = () => {
                        const v63 = cb(null, 'simulated', '');
                        return v63;
                    };
                    const v65 = process.nextTick(v64);
                    v65;
                }
            };
            const v71 = function (file, args = [], opts = {}) {
                const v67 = console.log('[DRYRUN spawn]', file, args);
                v67;
                const ee = new EventEmitter();
                const v69 = () => {
                    const v68 = ee.emit('close', 0);
                    return v68;
                };
                const v70 = process.nextTick(v69);
                v70;
                return ee;
            };
            const v72 = {};
            v72.exec = v59;
            v72.execFile = v66;
            v72.spawn = v71;
            return v72;
        }
        const v73 = origRequire.apply(this, arguments);
        return v73;
    };
    v50.require = v74;
    const v75 = Module.prototype;
    const v76 = Object.freeze(v75);
    v76;
};
const v78 = v77();
v78;
const http = require('http');
const url = require('url');
const cp = require('child_process');
const v93 = (req, res) => {
    const v79 = req.url;
    const parsed = url.parse(v79, true);
    const v80 = parsed.pathname;
    const v81 = v80 !== '/sys/run';
    if (v81) {
        res.statusCode = 404;
        const v82 = res.end('not found');
        return v82;
    }
    const v83 = parsed.query;
    const v84 = v83.cmd;
    const v85 = v84 || '';
    const cmd = String(v85);
    const v91 = (err, stdout, stderr) => {
        const v86 = res.setHeader('content-type', 'application/json');
        v86;
        const v87 = !err;
        const v88 = {
            ok: v87,
            simulated: true,
            cmd,
            sample: 'sys_runner_http'
        };
        const v89 = JSON.stringify(v88);
        const v90 = res.end(v89);
        v90;
    };
    const v92 = cp.exec(cmd, v91);
    v92;
};
const server = http.createServer(v93);
const v95 = () => {
    const v94 = console.log('Listening http://127.0.0.1:8102/sys/run');
    return v94;
};
const v96 = server.listen(8102, v95);
v96;