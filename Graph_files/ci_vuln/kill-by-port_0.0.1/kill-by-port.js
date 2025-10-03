'use strict';
const v7 = require('child_process');
const exec = v7.execSync;
const v12 = function (port) {
    var processId = null;
    try {
        const v8 = `lsof -t -i:${ port }`;
        processId = exec(v8);
    } catch (e) {
    }
    const v9 = processId !== null;
    if (v9) {
        const v10 = `kill ${ processId }`;
        const v11 = exec(v10);
        v11;
    }
};
exports.killByPort = v12;