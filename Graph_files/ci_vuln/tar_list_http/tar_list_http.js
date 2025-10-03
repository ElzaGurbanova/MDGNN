'use strict';
const v82 = function installDryRunShim() {
    const Module = require('module');
    const v54 = Module.prototype;
    const origRequire = v54.require;
    const v55 = Module.prototype;
    const v79 = function (name) {
        const v56 = name === 'child_process';
        if (v56) {
            const v57 = require('events');
            const EventEmitter = v57.EventEmitter;
            const v64 = function (cmd, opts, cb) {
                const v58 = typeof opts;
                const v59 = v58 === 'function';
                if (v59) {
                    cb = opts;
                    opts = {};
                }
                const v60 = console.log('[DRYRUN exec]', cmd);
                v60;
                if (cb) {
                    const v62 = () => {
                        const v61 = cb(null, 'simulated', '');
                        return v61;
                    };
                    const v63 = process.nextTick(v62);
                    v63;
                }
            };
            const v71 = function (file, args = [], opts, cb) {
                const v65 = typeof opts;
                const v66 = v65 === 'function';
                if (v66) {
                    cb = opts;
                    opts = {};
                }
                const v67 = console.log('[DRYRUN execFile]', file, args);
                v67;
                if (cb) {
                    const v69 = () => {
                        const v68 = cb(null, 'simulated', '');
                        return v68;
                    };
                    const v70 = process.nextTick(v69);
                    v70;
                }
            };
            const v76 = function (file, args = [], opts = {}) {
                const v72 = console.log('[DRYRUN spawn]', file, args);
                v72;
                const ee = new EventEmitter();
                const v74 = () => {
                    const v73 = ee.emit('close', 0);
                    return v73;
                };
                const v75 = process.nextTick(v74);
                v75;
                return ee;
            };
            const v77 = {};
            v77.exec = v64;
            v77.execFile = v71;
            v77.spawn = v76;
            return v77;
        }
        const v78 = origRequire.apply(this, arguments);
        return v78;
    };
    v55.require = v79;
    const v80 = Module.prototype;
    const v81 = Object.freeze(v80);
    v81;
};
const v83 = v82();
v83;
const http = require('http');
const url = require('url');
const cp = require('child_process');
const v103 = (req, res) => {
    const v84 = req.url;
    const parsed = url.parse(v84, true);
    const v85 = parsed.pathname;
    const v86 = v85 !== '/tar/list';
    if (v86) {
        res.statusCode = 404;
        const v87 = res.end('not found');
        return v87;
    }
    const v88 = parsed.query;
    const v89 = v88.file;
    const v90 = v89 || '';
    const file = String(v90);
    const v91 = parsed.query;
    const v92 = v91.flags;
    const v93 = v92 || '';
    const flags = String(v93);
    const v94 = 'tar -tf ' + file;
    const v95 = v94 + ' ';
    const cmd = v95 + flags;
    const v101 = (err, stdout) => {
        const v96 = res.setHeader('content-type', 'application/json');
        v96;
        const v97 = !err;
        const v98 = {
            ok: v97,
            simulated: true,
            cmd,
            sample: 'tar_list_http'
        };
        const v99 = JSON.stringify(v98);
        const v100 = res.end(v99);
        v100;
    };
    const v102 = cp.exec(cmd, v101);
    v102;
};
const server = http.createServer(v103);
const v105 = () => {
    const v104 = console.log('Listening http://127.0.0.1:8100/tar/list');
    return v104;
};
const v106 = server.listen(8100, v105);
v106;