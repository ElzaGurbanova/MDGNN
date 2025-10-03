const v32 = require('es6-promise');
var Promise = v32.Promise;
var async = require('async');
var cp = require('child_process');
var notEmpty = function (x) {
    return x;
};
const killport = function (port) {
    const v61 = function (resolve, reject) {
        var cmd = 'lsof -i:' + port;
        const v59 = function (err, stdout, stderr) {
            if (stderr) {
                const v33 = reject(stderr);
                return v33;
            }
            const v34 = String(stdout);
            const v35 = v34.split('\n');
            var lines = v35.filter(notEmpty);
            const v42 = function (line) {
                var blocks = line.split(/\s+/);
                const v36 = blocks[1];
                const v37 = blocks[1];
                const v38 = +v37;
                const v39 = v36 && v38;
                if (v39) {
                    const v40 = blocks[1];
                    const v41 = +v40;
                    return v41;
                }
                return null;
            };
            const v43 = lines.map(v42);
            var pids = v43.filter(notEmpty);
            const v44 = pids.length;
            const v45 = !v44;
            if (v45) {
                const v46 = resolve('no pids found');
                return v46;
            }
            var infs = [];
            const v55 = function (pid, next) {
                const v47 = 'kill ' + pid;
                const v48 = console.log(v47);
                v48;
                const v49 = 'kill ' + pid;
                const v53 = function (err, stdout, stderr) {
                    const v50 = {
                        pid: pid,
                        err: err,
                        stderr: stderr,
                        stdout: stdout
                    };
                    const v51 = infs.push(v50);
                    v51;
                    const v52 = next();
                    v52;
                };
                const v54 = cp.exec(v49, v53);
                v54;
            };
            const v57 = function (err) {
                const v56 = resolve(infs);
                v56;
            };
            const v58 = async.each(pids, v55, v57);
            return v58;
        };
        const v60 = cp.exec(cmd, v59);
        v60;
    };
    const v62 = new Promise(v61);
    return v62;
};
module.exports = killport;