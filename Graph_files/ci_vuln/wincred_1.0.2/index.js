'use strict';
const v13 = { value: true };
const v14 = Object.defineProperty(exports, '__esModule', v13);
v14;
const path = require('path');
const util_1 = require('util');
const v15 = require('child_process');
const v16 = v15.exec;
const exec = util_1.promisify(v16);
const appRoot = path.resolve(__dirname);
const buildCredential = function (credStr) {
    const v17 = credStr.split(':');
    const username = v17[0];
    const password = v17[1];
    const v18 = {};
    v18.username = username;
    v18.password = password;
    return v18;
};
const getCredential = function (target, pythonLancher = 'python') {
    const script = `${ pythonLancher } ${ appRoot }\\wincred.py ${ target }`;
    const v19 = exec(script);
    const v22 = result => {
        const v20 = result.stdout;
        const v21 = v20.trim();
        return v21;
    };
    const v23 = v19.then(v22);
    const v24 = v23.then(buildCredential);
    return v24;
};
exports.getCredential = getCredential;
exports.default = getCredential;