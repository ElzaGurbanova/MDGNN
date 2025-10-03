'use strict';
const childProcess = require('child_process');
const v38 = require('./index');
const debug = v38.debug;
const v39 = require('shescape');
const quoteAll = v39.quoteAll;
const execute = function (command, args, options) {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v40 = options.cwd;
    const v41 = options && v40;
    if (v41) {
        const v42 = options.cwd;
        spawnOptions.cwd = v42;
    }
    if (args) {
        args = quoteAll(args, spawnOptions);
    }
    const v72 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v43 = proc.stdout;
        const v44 = data => {
            stdout += data;
        };
        const v45 = v43.on('data', v44);
        v45;
        const v46 = proc.stderr;
        const v47 = data => {
            stderr += data;
        };
        const v48 = v46.on('data', v47);
        v48;
        const v52 = err => {
            const v49 = err.message;
            const v50 = `Child process errored with: ${ v49 }`;
            const v51 = debug(v50);
            v51;
        };
        const v53 = proc.on('error', v52);
        v53;
        const v56 = code => {
            const v54 = `Child process exited with code: ${ code }`;
            const v55 = debug(v54);
            v55;
        };
        const v57 = proc.on('exit', v56);
        v57;
        const v70 = code => {
            const v58 = code !== 0;
            if (v58) {
                const v59 = `Child process failed with exit code: ${ code }`;
                const v60 = debug(v59, '----------------', 'STDERR:', stderr, '----------------', 'STDOUT:', stdout, '----------------');
                v60;
                let stdErrMessage;
                if (stderr) {
                    stdErrMessage = `\nSTDERR:\n${ stderr }`;
                } else {
                    stdErrMessage = '';
                }
                let stdOutMessage;
                if (stdout) {
                    stdOutMessage = `\nSTDOUT:\n${ stdout }`;
                } else {
                    stdOutMessage = '';
                }
                let debugSuggestion;
                const v61 = process.env;
                const v62 = v61.DEBUG;
                if (v62) {
                    debugSuggestion = '';
                } else {
                    debugSuggestion = `\nRun in debug mode (-d) to see STDERR and STDOUT.`;
                }
                const v63 = `Child process failed with exit code: ${ code }.` + debugSuggestion;
                const v64 = stdErrMessage || stdOutMessage;
                const v65 = v63 + v64;
                const v66 = new Error(v65);
                const v67 = reject(v66);
                return v67;
            }
            const v68 = stdout || stderr;
            const v69 = resolve(v68);
            v69;
        };
        const v71 = proc.on('close', v70);
        v71;
    };
    const v73 = new Promise(v72);
    return v73;
};
const v74 = {};
v74.execute = execute;
module.exports = v74;