'use strict';
const childProcess = require('child_process');
const debug = require('debug');
const v26 = require('shescape');
const quoteAll = v26.quoteAll;
const debugLogging = debug('snyk-gradle-plugin');
const execute = function (command, args, options, perLineCallback) {
    const spawnOptions = {};
    spawnOptions.shell = true;
    const v27 = options.cwd;
    const v28 = options && v27;
    if (v28) {
        const v29 = options.cwd;
        spawnOptions.cwd = v29;
    }
    args = quoteAll(args, spawnOptions);
    const v48 = (resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = childProcess.spawn(command, args, spawnOptions);
        const v30 = proc.stdout;
        const v33 = data => {
            const strData = data.toString();
            stdout += strData;
            if (perLineCallback) {
                const v31 = strData.split('\n');
                const v32 = v31.forEach(perLineCallback);
                v32;
            }
        };
        const v34 = v30.on('data', v33);
        v34;
        const v35 = proc.stderr;
        const v36 = data => {
            stderr += data;
        };
        const v37 = v35.on('data', v36);
        v37;
        const v46 = code => {
            const v38 = code !== 0;
            if (v38) {
                const v39 = command + ' ';
                const v40 = args.join(' ');
                const fullCommand = v39 + v40;
                const v41 = new Error(`
>>> command: ${ fullCommand }
>>> exit code: ${ code }
>>> stdout:
${ stdout }
>>> stderr:
${ stderr }
`);
                const v42 = reject(v41);
                return v42;
            }
            if (stderr) {
                const v43 = 'subprocess exit code = 0, but stderr was not empty: ' + stderr;
                const v44 = debugLogging(v43);
                v44;
            }
            const v45 = resolve(stdout);
            v45;
        };
        const v47 = proc.on('close', v46);
        v47;
    };
    const v49 = new Promise(v48);
    return v49;
};
const v50 = {};
v50.execute = execute;
module.exports = v50;