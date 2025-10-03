'use strict';
var childProcess = require('child_process');
var exec = childProcess.exec;
const v14 = function (programname) {
    const v8 = process.platform;
    switch (v8) {
    case 'win32':
        const v9 = 'taskkill /F /IM ' + programname;
        const v10 = v9 + '.exe /T';
        const v11 = exec(v10);
        v11;
        break;
    default:
        const v12 = 'pkill -f ' + programname;
        const v13 = exec(v12);
        v13;
        break;
    }
};
module.exports = v14;