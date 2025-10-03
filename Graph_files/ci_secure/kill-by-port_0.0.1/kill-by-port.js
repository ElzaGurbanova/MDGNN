'use strict';
const v8 = require('child_process');
const exec = v8.execSync;
const v14 = function (port) {
    var processId = null;
    try {
        const v9 = parseInt(port, 10);
        const v10 = `lsof -t -i:${ v9 }`;
        processId = exec(v10);
    } catch (e) {
    }
    const v11 = processId !== null;
    if (v11) {
        const v12 = `kill ${ processId }`;
        const v13 = exec(v12);
        v13;
    }
};
exports.killByPort = v14;