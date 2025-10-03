'use strict';
const childProcess = require('child_process');
const v22 = require('shescape');
const quoteAll = v22.quoteAll;
const execute = function (command, args = [], options) {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v23 = options.cwd;
    const v24 = options && v23;
    if (v24) {
        const v25 = options.cwd;
        spawnOptions.cwd = v25;
    }
    args = quoteAll(args, spawnOptions);
    const v40 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v26 = proc.stdout;
        const v27 = data => {
            stdout += data;
        };
        const v28 = v26.on('data', v27);
        v28;
        const v29 = proc.stderr;
        const v30 = data => {
            stderr += data;
        };
        const v31 = v29.on('data', v30);
        v31;
        const v38 = code => {
            const v32 = code !== 0;
            if (v32) {
                const v33 = stdout || stderr;
                const v34 = new Error(v33);
                const v35 = reject(v34);
                return v35;
            }
            const v36 = stdout || stderr;
            const v37 = resolve(v36);
            v37;
        };
        const v39 = proc.on('close', v38);
        v39;
    };
    const v41 = new Promise(v40);
    return v41;
};
const v42 = {};
v42.execute = execute;
module.exports = v42;