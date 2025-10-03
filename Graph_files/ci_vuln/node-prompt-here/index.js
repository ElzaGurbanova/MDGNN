var child_process = require('child_process');
var PromtHere = function () {
    return this;
};
const v14 = PromtHere.prototype;
const v26 = function (dir) {
    var cmd = null;
    const v15 = process.platform;
    switch (v15) {
    case 'win32':
        const v16 = 'start "' + dir;
        const v17 = v16 + '" /D "';
        const v18 = v17 + dir;
        cmd = v18 + '"';
        break;
    case 'win64':
        const v19 = 'start "' + dir;
        const v20 = v19 + '" /D "';
        const v21 = v20 + dir;
        cmd = v21 + '"';
        break;
    default:
        const v22 = process.platform;
        const v23 = v22 + ' is not supported. Please CONTRIBUTE at https://github.com/s-a/node-prompt-here.';
        const v24 = new Error(v23);
        throw v24;
    }
    const v25 = child_process.exec(cmd);
    v25;
};
v14.open = v26;
module.exports = PromtHere;