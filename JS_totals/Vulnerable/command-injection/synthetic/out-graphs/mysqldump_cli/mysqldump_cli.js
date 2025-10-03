'use strict';
const v81 = function installDryRunShim() {
    const Module = require('module');
    const v53 = Module.prototype;
    const origRequire = v53.require;
    const v54 = Module.prototype;
    const v78 = function (name) {
        const v55 = name === 'child_process';
        if (v55) {
            const v56 = require('events');
            const EventEmitter = v56.EventEmitter;
            const v63 = function (cmd, opts, cb) {
                const v57 = typeof opts;
                const v58 = v57 === 'function';
                if (v58) {
                    cb = opts;
                    opts = {};
                }
                const v59 = console.log('[DRYRUN exec]', cmd);
                v59;
                if (cb) {
                    const v61 = () => {
                        const v60 = cb(null, 'simulated', '');
                        return v60;
                    };
                    const v62 = process.nextTick(v61);
                    v62;
                }
            };
            const v70 = function (file, args = [], opts, cb) {
                const v64 = typeof opts;
                const v65 = v64 === 'function';
                if (v65) {
                    cb = opts;
                    opts = {};
                }
                const v66 = console.log('[DRYRUN execFile]', file, args);
                v66;
                if (cb) {
                    const v68 = () => {
                        const v67 = cb(null, 'simulated', '');
                        return v67;
                    };
                    const v69 = process.nextTick(v68);
                    v69;
                }
            };
            const v75 = function (file, args = [], opts = {}) {
                const v71 = console.log('[DRYRUN spawn]', file, args);
                v71;
                const ee = new EventEmitter();
                const v73 = () => {
                    const v72 = ee.emit('close', 0);
                    return v72;
                };
                const v74 = process.nextTick(v73);
                v74;
                return ee;
            };
            const v76 = {};
            v76.exec = v63;
            v76.execFile = v70;
            v76.spawn = v75;
            return v76;
        }
        const v77 = origRequire.apply(this, arguments);
        return v77;
    };
    v54.require = v78;
    const v79 = Module.prototype;
    const v80 = Object.freeze(v79);
    v80;
};
const v82 = v81();
v82;
const cp = require('child_process');
const v83 = process.argv;
const v84 = v83[2];
const v85 = v84 || '';
const user = String(v85);
const v86 = process.argv;
const v87 = v86[3];
const v88 = v87 || '';
const pass = String(v88);
const v89 = process.argv;
const v90 = v89[4];
const v91 = v90 || '';
const db = String(v91);
const v92 = process.argv;
const v93 = v92[5];
const v94 = v93 || '';
const out = String(v94);
const v95 = 'mysqldump -u ' + user;
const v96 = v95 + ' -p';
const v97 = v96 + pass;
const v98 = v97 + ' ';
const v99 = v98 + db;
const v100 = v99 + ' > ';
const cmd = v100 + out;
const v103 = err => {
    const v101 = !err;
    const v102 = console.log('dump simulated:', v101, 'cmd=', cmd);
    v102;
};
const v104 = cp.exec(cmd, v103);
v104;