'use strict';
const v50 = { value: true };
const v51 = Object.defineProperty(exports, '__esModule', v50);
v51;
const tslib_1 = require('tslib');
const child_process_1 = require('child_process');
const v52 = require('tmp');
const tmp_1 = tslib_1.__importDefault(v52);
const v53 = require('debug');
const debug_1 = tslib_1.__importDefault(v53);
const v54 = require('path');
const path_1 = tslib_1.__importDefault(v54);
const v55 = require('sudo-prompt');
const sudo_prompt_1 = tslib_1.__importDefault(v55);
const constants_1 = require('./constants');
const debug = debug_1.default('devcert:util');
const openssl = function (args) {
    const v56 = path_1.default;
    const v57 = constants_1.configPath('.rnd');
    const v58 = v56.join(v57);
    const v59 = { RANDFILE: v58 };
    const v60 = process.env;
    const v61 = Object.assign(v59, v60);
    const v62 = {
        stdio: 'pipe',
        env: v61
    };
    const v63 = run('openssl', args, v62);
    return v63;
};
exports.openssl = openssl;
const run = function (cmd, args, options = {}) {
    const v64 = args.join(' ');
    const v65 = `execFileSync: \`${ cmd } ${ v64 }\``;
    const v66 = debug(v65);
    v66;
    const v67 = child_process_1.execFileSync(cmd, args, options);
    return v67;
};
exports.run = run;
const sudoAppend = function (file, input) {
    const v68 = [
        'tee',
        '-a',
        file
    ];
    const v69 = { input };
    const v70 = run('sudo', v68, v69);
    v70;
};
exports.sudoAppend = sudoAppend;
const waitForUser = function () {
    const v75 = resolve => {
        const v71 = process.stdin;
        const v72 = v71.resume();
        v72;
        const v73 = process.stdin;
        const v74 = v73.on('data', resolve);
        v74;
    };
    const v76 = new Promise(v75);
    return v76;
};
exports.waitForUser = waitForUser;
const reportableError = function (message) {
    const v77 = new Error(`${ message } | This is a bug in devcert, please report the issue at https://github.com/davewasmer/devcert/issues`);
    return v77;
};
exports.reportableError = reportableError;
const mktmp = function () {
    const v78 = tmp_1.default;
    const v79 = { discardDescriptor: true };
    const v80 = v78.fileSync(v79);
    const v81 = v80.name;
    return v81;
};
exports.mktmp = mktmp;
const sudo = function (cmd) {
    const v97 = (resolve, reject) => {
        const v82 = sudo_prompt_1.default;
        const v83 = { name: 'devcert' };
        const v95 = (err, stdout, stderr) => {
            const v84 = typeof stderr;
            const v85 = v84 === 'string';
            const v86 = stderr.trim();
            const v87 = v86.length;
            const v88 = v87 > 0;
            const v89 = v85 && v88;
            const v90 = new Error(stderr);
            const v91 = v89 && v90;
            let error = err || v91;
            const v92 = reject(error);
            const v93 = resolve(stdout);
            let v94;
            if (error) {
                v94 = v92;
            } else {
                v94 = v93;
            }
            v94;
        };
        const v96 = v82.exec(cmd, v83, v95);
        v96;
    };
    const v98 = new Promise(v97);
    return v98;
};
exports.sudo = sudo;