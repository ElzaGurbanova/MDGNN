'use strict';
const childProcess = require('child_process');
const v31 = require('./debug');
const debug = v31.debug;
const v32 = require('shescape');
const quoteAll = v32.quoteAll;
const execute = function (command, args, options) {
    const v33 = args.join(' ');
    const v34 = `running "${ command } ${ v33 }"`;
    const v35 = debug(v34);
    v35;
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v36 = options.cwd;
    const v37 = options && v36;
    if (v37) {
        const v38 = options.cwd;
        spawnOptions.cwd = v38;
    }
    args = quoteAll(args, spawnOptions);
    const v58 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v39 = proc.stdout;
        if (v39) {
            const v40 = proc.stdout;
            const v41 = data => {
                stdout += data;
            };
            const v42 = v40.on('data', v41);
            v42;
        }
        const v43 = proc.stderr;
        if (v43) {
            const v44 = proc.stderr;
            const v45 = data => {
                stderr += data;
            };
            const v46 = v44.on('data', v45);
            v46;
        }
        const v56 = code => {
            const v47 = code !== 0;
            if (v47) {
                const v48 = args.join(' ');
                const v49 = `Error running "${ command } ${ v48 }", exit code: ${ code }`;
                const v50 = debug(v49);
                v50;
                const v51 = stdout || stderr;
                const v52 = reject(v51);
                return v52;
            }
            const v53 = debug('Sub process stderr:', stderr);
            v53;
            const v54 = stdout || stderr;
            const v55 = resolve(v54);
            v55;
        };
        const v57 = proc.on('close', v56);
        v57;
    };
    const v59 = new Promise(v58);
    return v59;
};
const v60 = {};
v60.execute = execute;
module.exports = v60;