'use strict';
const v73 = function installDryRunShim() {
    const Module = require('module');
    const v45 = Module.prototype;
    const origRequire = v45.require;
    const v46 = Module.prototype;
    const v70 = function (name) {
        const v47 = name === 'child_process';
        if (v47) {
            const v48 = require('events');
            const EventEmitter = v48.EventEmitter;
            const v55 = function (cmd, opts, cb) {
                const v49 = typeof opts;
                const v50 = v49 === 'function';
                if (v50) {
                    cb = opts;
                    opts = {};
                }
                const v51 = console.log('[DRYRUN exec]', cmd);
                v51;
                if (cb) {
                    const v53 = () => {
                        const v52 = cb(null, 'simulated', '');
                        return v52;
                    };
                    const v54 = process.nextTick(v53);
                    v54;
                }
            };
            const v62 = function (file, args = [], opts, cb) {
                const v56 = typeof opts;
                const v57 = v56 === 'function';
                if (v57) {
                    cb = opts;
                    opts = {};
                }
                const v58 = console.log('[DRYRUN execFile]', file, args);
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
            const v67 = function (file, args = [], opts = {}) {
                const v63 = console.log('[DRYRUN spawn]', file, args);
                v63;
                const ee = new EventEmitter();
                const v65 = () => {
                    const v64 = ee.emit('close', 0);
                    return v64;
                };
                const v66 = process.nextTick(v65);
                v66;
                return ee;
            };
            const v68 = {};
            v68.exec = v55;
            v68.execFile = v62;
            v68.spawn = v67;
            return v68;
        }
        const v69 = origRequire.apply(this, arguments);
        return v69;
    };
    v46.require = v70;
    const v71 = Module.prototype;
    const v72 = Object.freeze(v71);
    v72;
};
const v74 = v73();
v74;
const cp = require('child_process');
const v75 = process.argv;
const v76 = v75[2];
const v77 = v76 || '';
const zip = String(v77);
const v78 = process.argv;
const v79 = v78[3];
const v80 = v79 || '';
const dest = String(v80);
const v81 = process.argv;
const v82 = v81.slice(4);
const flags = v82.join(' ');
const v83 = flags + ' ';
const v84 = v83 + zip;
const v85 = v84 + ' -d ';
const argString = v85 + dest;
const args = argString.split(' ');
const ch = cp.spawn('unzip', args);
const v87 = code => {
    const v86 = console.log('unzip simulated close code', code);
    return v86;
};
const v88 = ch.on('close', v87);
v88;