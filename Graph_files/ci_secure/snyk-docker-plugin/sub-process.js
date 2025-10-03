'use strict';
const childProcess = require('child_process');
const v19 = require('shescape');
const quoteAll = v19.quoteAll;
const execute = function (command, args, options) {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v20 = options.cwd;
    const v21 = options && v20;
    if (v21) {
        const v22 = options.cwd;
        spawnOptions.cwd = v22;
    }
    args = quoteAll(args, spawnOptions);
    const v34 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v23 = proc.stdout;
        const v24 = data => {
            stdout += data;
        };
        const v25 = v23.on('data', v24);
        v25;
        const v26 = proc.stderr;
        const v27 = data => {
            stderr += data;
        };
        const v28 = v26.on('data', v27);
        v28;
        const v32 = code => {
            const output = {};
            output.stdout = stdout;
            output.stderr = stderr;
            const v29 = code !== 0;
            if (v29) {
                const v30 = reject(output);
                return v30;
            }
            const v31 = resolve(output);
            v31;
        };
        const v33 = proc.on('close', v32);
        v33;
    };
    const v35 = new Promise(v34);
    return v35;
};
const v36 = {};
v36.execute = execute;
module.exports = v36;