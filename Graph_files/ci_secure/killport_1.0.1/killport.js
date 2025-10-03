const v35 = require('es6-promise');
var Promise = v35.Promise;
var async = require('async');
var cp = require('child_process');
var notEmpty = function (x) {
    return x;
};
const killport = function (port) {
    const v67 = function (resolve, reject) {
        const v36 = /^\d+$/.test(port);
        const v37 = !v36;
        if (v37) {
            const v38 = new Error('port must be a number.');
            throw v38;
        }
        var cmd = 'lsof -i:' + port;
        const v65 = function (err, stdout, stderr) {
            if (stderr) {
                const v39 = reject(stderr);
                return v39;
            }
            const v40 = String(stdout);
            const v41 = v40.split('\n');
            var lines = v41.filter(notEmpty);
            const v48 = function (line) {
                var blocks = line.split(/\s+/);
                const v42 = blocks[1];
                const v43 = blocks[1];
                const v44 = +v43;
                const v45 = v42 && v44;
                if (v45) {
                    const v46 = blocks[1];
                    const v47 = +v46;
                    return v47;
                }
                return null;
            };
            const v49 = lines.map(v48);
            var pids = v49.filter(notEmpty);
            const v50 = pids.length;
            const v51 = !v50;
            if (v51) {
                const v52 = resolve('no pids found');
                return v52;
            }
            var infs = [];
            const v61 = function (pid, next) {
                const v53 = 'kill ' + pid;
                const v54 = console.log(v53);
                v54;
                const v55 = 'kill ' + pid;
                const v59 = function (err, stdout, stderr) {
                    const v56 = {
                        pid: pid,
                        err: err,
                        stderr: stderr,
                        stdout: stdout
                    };
                    const v57 = infs.push(v56);
                    v57;
                    const v58 = next();
                    v58;
                };
                const v60 = cp.exec(v55, v59);
                v60;
            };
            const v63 = function (err) {
                const v62 = resolve(infs);
                v62;
            };
            const v64 = async.each(pids, v61, v63);
            return v64;
        };
        const v66 = cp.exec(cmd, v65);
        v66;
    };
    const v68 = new Promise(v67);
    return v68;
};
module.exports = killport;