var ChildProcess = require('child_process');
var csv = require('csv');
const v54 = module.exports;
const v88 = function (callback) {
    const v55 = process.platform;
    const v56 = v55 !== 'darwin';
    if (v56) {
        const v70 = function (err, stdout, stderr) {
            const v57 = err || stderr;
            if (v57) {
                const v58 = stderr.toString();
                const v59 = err || v58;
                const v60 = callback(v59);
                return v60;
            }
            const v68 = function (err, data) {
                if (err) {
                    const v61 = callback(err);
                    return v61;
                }
                const v66 = function (row) {
                    const v62 = row[1];
                    const v63 = parseInt(v62, 10);
                    const v64 = row[0];
                    const v65 = {};
                    v65.pid = v63;
                    v65.command = v64;
                    return v65;
                };
                var results = data.map(v66);
                const v67 = callback(null, results);
                v67;
            };
            const v69 = csv.parse(stdout, v68);
            v69;
        };
        const v71 = ChildProcess.exec('tasklist /FO csv /NH', v70);
        v71;
        return;
    }
    const v86 = function (err, stdout, stderr) {
        const v72 = err || stderr;
        if (v72) {
            const v73 = stderr.toString();
            const v74 = err || v73;
            const v75 = callback(v74);
            return v75;
        }
        var results = [];
        const v76 = stdout.split('\n');
        const v83 = function (row) {
            var matches = row.match(/(\d+) (.*)/);
            const v77 = !matches;
            if (v77) {
                return;
            }
            const v78 = matches[1];
            const v79 = parseInt(v78, 10);
            const v80 = matches[2];
            const v81 = {
                pid: v79,
                command: v80
            };
            const v82 = results.push(v81);
            v82;
        };
        const v84 = v76.map(v83);
        v84;
        const v85 = callback(null, results);
        v85;
    };
    const v87 = ChildProcess.exec('ps -Ao pid,command', v86);
    v87;
};
v54.list = v88;
const v89 = module.exports;
const v106 = function (pid, next) {
    let killCommand;
    const v90 = process.platform;
    const v91 = v90 !== 'darwin';
    const v92 = 'taskkill /F /PID ' + pid;
    const v93 = 'kill ' + pid;
    if (v91) {
        killCommand = v92;
    } else {
        killCommand = v93;
    }
    const v104 = function (err, stdout, stderr) {
        const v94 = err || stderr;
        if (v94) {
            const v95 = stderr.toString();
            const v96 = err || v95;
            const v97 = next(v96);
            return v97;
        }
        stdout = stdout.toString();
        const v98 = process.platform;
        const v99 = v98 !== 'darwin';
        if (v99) {
            const v101 = function () {
                const v100 = next(null, stdout);
                v100;
            };
            const v102 = setTimeout(v101, 200);
            v102;
            return;
        }
        const v103 = next(null, stdout);
        v103;
    };
    const v105 = ChildProcess.exec(killCommand, v104);
    v105;
};
v89.kill = v106;