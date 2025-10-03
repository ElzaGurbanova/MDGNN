const v17 = require('child_process');
var exec = v17.exec;
var parse = require('./parse');
const df = function (aOptions, aCallback) {
    var options;
    var callback;
    const v18 = typeof aOptions;
    const v19 = v18 === 'function';
    if (v19) {
        options = {};
        callback = aOptions;
    } else {
        options = aOptions;
        callback = aCallback;
    }
    const v20 = typeof callback;
    const v21 = v20 !== 'function';
    if (v21) {
        const v22 = function () {
        };
        callback = v22;
    }
    const v23 = typeof options;
    const v24 = v23 !== 'object';
    if (v24) {
        options = {};
    }
    var command = 'df -kP';
    const v25 = options.file;
    if (v25) {
        const v26 = options.file;
        command += ' ' + v26;
    }
    const v31 = function (err, stdout, stderr) {
        if (err) {
            const v27 = callback(err);
            v27;
            return;
        }
        if (stderr) {
            const v28 = new Error(err);
            const v29 = callback(v28);
            v29;
            return;
        }
        var entries = parse(stdout, options);
        const v30 = callback(null, entries);
        v30;
    };
    const v32 = exec(command, v31);
    v32;
};
module.exports = df;