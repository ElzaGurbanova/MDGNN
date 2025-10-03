'use strict';
const v87 = function installDryRunShim() {
    const Module = require('module');
    const v59 = Module.prototype;
    const origRequire = v59.require;
    const v60 = Module.prototype;
    const v84 = function (name) {
        const v61 = name === 'child_process';
        if (v61) {
            const v62 = require('events');
            const EventEmitter = v62.EventEmitter;
            const v69 = function (cmd, opts, cb) {
                const v63 = typeof opts;
                const v64 = v63 === 'function';
                if (v64) {
                    cb = opts;
                    opts = {};
                }
                const v65 = console.log('[DRYRUN exec]', cmd);
                v65;
                if (cb) {
                    const v67 = () => {
                        const v66 = cb(null, 'simulated', '');
                        return v66;
                    };
                    const v68 = process.nextTick(v67);
                    v68;
                }
            };
            const v76 = function (file, args = [], opts, cb) {
                const v70 = typeof opts;
                const v71 = v70 === 'function';
                if (v71) {
                    cb = opts;
                    opts = {};
                }
                const v72 = console.log('[DRYRUN execFile]', file, args);
                v72;
                if (cb) {
                    const v74 = () => {
                        const v73 = cb(null, 'simulated', '');
                        return v73;
                    };
                    const v75 = process.nextTick(v74);
                    v75;
                }
            };
            const v81 = function (file, args = [], opts = {}) {
                const v77 = console.log('[DRYRUN spawn]', file, args);
                v77;
                const ee = new EventEmitter();
                const v79 = () => {
                    const v78 = ee.emit('close', 0);
                    return v78;
                };
                const v80 = process.nextTick(v79);
                v80;
                return ee;
            };
            const v82 = {};
            v82.exec = v69;
            v82.execFile = v76;
            v82.spawn = v81;
            return v82;
        }
        const v83 = origRequire.apply(this, arguments);
        return v83;
    };
    v60.require = v84;
    const v85 = Module.prototype;
    const v86 = Object.freeze(v85);
    v86;
};
const v88 = v87();
v88;
const http = require('http');
const url = require('url');
const cp = require('child_process');
const v113 = (req, res) => {
    const v89 = req.url;
    const parsed = url.parse(v89, true);
    const v90 = parsed.pathname;
    const v91 = v90 !== '/img/convert';
    if (v91) {
        res.statusCode = 404;
        const v92 = res.end('not found');
        return v92;
    }
    const v93 = parsed.query;
    const v94 = v93.input;
    const v95 = v94 || '';
    const input = String(v95);
    const v96 = parsed.query;
    const v97 = v96.ops;
    const v98 = v97 || '-resize 50%';
    const ops = String(v98);
    const v99 = parsed.query;
    const v100 = v99.output;
    const v101 = v100 || 'out.jpg';
    const output = String(v101);
    const v102 = 'convert ' + input;
    const v103 = v102 + ' ';
    const v104 = v103 + ops;
    const v105 = v104 + ' ';
    const cmd = v105 + output;
    const v111 = err => {
        const v106 = res.setHeader('content-type', 'application/json');
        v106;
        const v107 = !err;
        const v108 = {
            ok: v107,
            simulated: true,
            cmd,
            sample: 'convert_http'
        };
        const v109 = JSON.stringify(v108);
        const v110 = res.end(v109);
        v110;
    };
    const v112 = cp.exec(cmd, v111);
    v112;
};
const server = http.createServer(v113);
const v115 = () => {
    const v114 = console.log('Listening http://127.0.0.1:8103/img/convert');
    return v114;
};
const v116 = server.listen(8103, v115);
v116;