'use strict';
const v71 = function installDryRunShim() {
    const Module = require('module');
    const v43 = Module.prototype;
    const origRequire = v43.require;
    const v44 = Module.prototype;
    const v68 = function (name) {
        const v45 = name === 'child_process';
        if (v45) {
            const v46 = require('events');
            const EventEmitter = v46.EventEmitter;
            const v53 = function (cmd, opts, cb) {
                const v47 = typeof opts;
                const v48 = v47 === 'function';
                if (v48) {
                    cb = opts;
                    opts = {};
                }
                const v49 = console.log('[DRYRUN exec]', cmd);
                v49;
                if (cb) {
                    const v51 = () => {
                        const v50 = cb(null, 'simulated', '');
                        return v50;
                    };
                    const v52 = process.nextTick(v51);
                    v52;
                }
            };
            const v60 = function (file, args = [], opts, cb) {
                const v54 = typeof opts;
                const v55 = v54 === 'function';
                if (v55) {
                    cb = opts;
                    opts = {};
                }
                const v56 = console.log('[DRYRUN execFile]', file, args);
                v56;
                if (cb) {
                    const v58 = () => {
                        const v57 = cb(null, 'simulated', '');
                        return v57;
                    };
                    const v59 = process.nextTick(v58);
                    v59;
                }
            };
            const v65 = function (file, args = [], opts = {}) {
                const v61 = console.log('[DRYRUN spawn]', file, args);
                v61;
                const ee = new EventEmitter();
                const v63 = () => {
                    const v62 = ee.emit('close', 0);
                    return v62;
                };
                const v64 = process.nextTick(v63);
                v64;
                return ee;
            };
            const v66 = {};
            v66.exec = v53;
            v66.execFile = v60;
            v66.spawn = v65;
            return v66;
        }
        const v67 = origRequire.apply(this, arguments);
        return v67;
    };
    v44.require = v68;
    const v69 = Module.prototype;
    const v70 = Object.freeze(v69);
    v70;
};
const v72 = v71();
v72;
const cp = require('child_process');
const v73 = process.argv;
const v74 = v73[2];
const v75 = v74 || '';
const pdf = String(v75);
const v76 = process.argv;
const v77 = v76[3];
const v78 = v77 || '';
const out = String(v78);
const v79 = [
    pdf,
    out
];
const v83 = err => {
    const v80 = !err;
    const v81 = [
        pdf,
        out
    ];
    const v82 = console.log('pdftotext simulated:', v80, 'args=', v81);
    v82;
};
const v84 = cp.execFile('pdftotext', v79, v83);
v84;