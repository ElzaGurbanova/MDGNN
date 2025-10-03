'use strict';
const v24 = { value: true };
const v25 = Object.defineProperty(exports, '__esModule', v24);
v25;
const path = require('path');
const child_process_1 = require('child_process');
const which = require('which');
const base = path.resolve(__dirname, '..', 'bin');
const v26 = path.resolve(base, 'window/adb.exe');
const v27 = path.resolve(base, 'mac/adb');
const v28 = path.resolve(base, 'linux/adb');
const v29 = {};
v29.win32 = v26;
v29.darwin = v27;
v29.linux = v28;
exports.ADB_BINARY_FILE = v29;
const isSystemAdbAvailable = function () {
    const v30 = { nothrow: true };
    const v31 = which.sync('adb', v30);
    const v32 = !v31;
    const v33 = !v32;
    return v33;
};
exports.isSystemAdbAvailable = isSystemAdbAvailable;
let systemAdbExist = isSystemAdbAvailable();
const execADBCommand = function (command, option) {
    let execCmd = command;
    const v34 = !systemAdbExist;
    if (v34) {
        let cmd = command.split(' ');
        const v35 = exports.ADB_BINARY_FILE;
        const v36 = process.platform;
        const binFile = v35[v36];
        cmd[0] = `"${ binFile }"`;
        execCmd = cmd.join(' ');
    }
    const v43 = (resolve, reject) => {
        const v37 = { stdio: 'inherit' };
        const v38 = option || v37;
        const v41 = (err, stdout, stderr) => {
            if (err) {
                const v39 = reject(err);
                v39;
            }
            const v40 = resolve(stdout);
            v40;
        };
        const v42 = child_process_1.exec(execCmd, v38, v41);
        v42;
    };
    const v44 = new Promise(v43);
    const v45 = err => {
        return err;
    };
    const v46 = v44.catch(v45);
    return v46;
};
exports.execADBCommand = execADBCommand;