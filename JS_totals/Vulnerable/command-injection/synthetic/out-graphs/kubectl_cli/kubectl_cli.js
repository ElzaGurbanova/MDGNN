'use strict';
const v80 = function installDryRunShim() {
    const Module = require('module');
    const v52 = Module.prototype;
    const origRequire = v52.require;
    const v53 = Module.prototype;
    const v77 = function (name) {
        const v54 = name === 'child_process';
        if (v54) {
            const v55 = require('events');
            const EventEmitter = v55.EventEmitter;
            const v62 = function (cmd, opts, cb) {
                const v56 = typeof opts;
                const v57 = v56 === 'function';
                if (v57) {
                    cb = opts;
                    opts = {};
                }
                const v58 = console.log('[DRYRUN exec]', cmd);
                v58;
                if (cb) {
                    const v60 = () => {
                        const v59 = cb(null, 'simulated', '');
                        return v59;
                    };
                    const v61 = process.nextTick(v60);
                    v61;
                }
            };
            const v69 = function (file, args = [], opts, cb) {
                const v63 = typeof opts;
                const v64 = v63 === 'function';
                if (v64) {
                    cb = opts;
                    opts = {};
                }
                const v65 = console.log('[DRYRUN execFile]', file, args);
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
            const v74 = function (file, args = [], opts = {}) {
                const v70 = console.log('[DRYRUN spawn]', file, args);
                v70;
                const ee = new EventEmitter();
                const v72 = () => {
                    const v71 = ee.emit('close', 0);
                    return v71;
                };
                const v73 = process.nextTick(v72);
                v73;
                return ee;
            };
            const v75 = {};
            v75.exec = v62;
            v75.execFile = v69;
            v75.spawn = v74;
            return v75;
        }
        const v76 = origRequire.apply(this, arguments);
        return v76;
    };
    v53.require = v77;
    const v78 = Module.prototype;
    const v79 = Object.freeze(v78);
    v79;
};
const v81 = v80();
v81;
const cp = require('child_process');
const v82 = process.argv;
const v83 = v82[2];
const v84 = v83 || 'get';
const verb = String(v84);
const v85 = process.argv;
const v86 = v85[3];
const v87 = v86 || 'pods';
const resource = String(v87);
const v88 = process.argv;
const v89 = v88[4];
const v90 = v89 || '';
const name = String(v90);
const v91 = process.argv;
const v92 = v91.slice(5);
const flags = v92.join(' ');
const v93 = 'kubectl ' + verb;
const v94 = v93 + ' ';
const v95 = v94 + resource;
const v96 = v95 + ' ';
const v97 = v96 + name;
const v98 = v97 + ' ';
const cmd = v98 + flags;
const v101 = err => {
    const v99 = !err;
    const v100 = console.log('kubectl simulated:', v99, 'cmd=', cmd);
    v100;
};
const v102 = cp.exec(cmd, v101);
v102;