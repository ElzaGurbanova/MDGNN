'use strict';
const v75 = function installDryRunShim() {
    const Module = require('module');
    const v47 = Module.prototype;
    const origRequire = v47.require;
    const v48 = Module.prototype;
    const v72 = function (name) {
        const v49 = name === 'child_process';
        if (v49) {
            const v50 = require('events');
            const EventEmitter = v50.EventEmitter;
            const v57 = function (cmd, opts, cb) {
                const v51 = typeof opts;
                const v52 = v51 === 'function';
                if (v52) {
                    cb = opts;
                    opts = {};
                }
                const v53 = console.log('[DRYRUN exec]', cmd);
                v53;
                if (cb) {
                    const v55 = () => {
                        const v54 = cb(null, 'simulated', '');
                        return v54;
                    };
                    const v56 = process.nextTick(v55);
                    v56;
                }
            };
            const v64 = function (file, args = [], opts, cb) {
                const v58 = typeof opts;
                const v59 = v58 === 'function';
                if (v59) {
                    cb = opts;
                    opts = {};
                }
                const v60 = console.log('[DRYRUN execFile]', file, args);
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
            const v69 = function (file, args = [], opts = {}) {
                const v65 = console.log('[DRYRUN spawn]', file, args);
                v65;
                const ee = new EventEmitter();
                const v67 = () => {
                    const v66 = ee.emit('close', 0);
                    return v66;
                };
                const v68 = process.nextTick(v67);
                v68;
                return ee;
            };
            const v70 = {};
            v70.exec = v57;
            v70.execFile = v64;
            v70.spawn = v69;
            return v70;
        }
        const v71 = origRequire.apply(this, arguments);
        return v71;
    };
    v48.require = v72;
    const v73 = Module.prototype;
    const v74 = Object.freeze(v73);
    v74;
};
const v76 = v75();
v76;
const cp = require('child_process');
const v77 = process.argv;
const v78 = v77[2];
const v79 = v78 || '';
const src = String(v79);
const v80 = process.argv;
const v81 = v80[3];
const v82 = v81 || '';
const dest = String(v82);
const v83 = process.argv;
const v84 = v83.slice(4);
const flags = v84.join(' ');
const v85 = 'rsync ' + flags;
const v86 = v85 + ' ';
const v87 = v86 + src;
const v88 = v87 + ' ';
const cmd = v88 + dest;
const v91 = (err, stdout) => {
    const v89 = !err;
    const v90 = console.log('simulated:', v89, 'cmd=', cmd);
    v90;
};
const v92 = cp.exec(cmd, v91);
v92;