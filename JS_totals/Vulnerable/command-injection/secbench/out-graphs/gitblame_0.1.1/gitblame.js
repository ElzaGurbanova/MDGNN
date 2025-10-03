const v14 = require('child_process');
var exec = v14.exec;
var path = require('path');
const v26 = function (file, cb) {
    var dirname = path.dirname(file);
    var filename = path.basename(file);
    const v15 = 'git blame ' + filename;
    const v16 = { cwd: dirname };
    const v24 = function (error, stdout, stderr) {
        const v17 = error !== null;
        if (v17) {
            const v18 = 'exec error: ' + error;
            const v19 = console.log(v18);
            v19;
            const v20 = new Error(error);
            const v21 = cb(v20);
            return v21;
        }
        var lines = stdout.split('\n');
        const v22 = lines.unshift('');
        v22;
        const v23 = cb(null, lines);
        v23;
    };
    const v25 = exec(v15, v16, v24);
    v25;
};
module.exports = v26;