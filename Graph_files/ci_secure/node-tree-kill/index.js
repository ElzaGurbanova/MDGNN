'use strict';
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
const v83 = function (pid, signal, callback) {
    const v60 = typeof pid;
    const v61 = v60 !== 'number';
    if (v61) {
        const v62 = new Error('pid must be a number');
        throw v62;
    }
    var tree = {};
    var pidsToProcess = {};
    tree[pid] = [];
    pidsToProcess[pid] = 1;
    const v63 = typeof signal;
    const v64 = v63 === 'function';
    const v65 = callback === undefined;
    const v66 = v64 && v65;
    if (v66) {
        callback = signal;
        signal = undefined;
    }
    const v67 = process.platform;
    switch (v67) {
    case 'win32':
        const v68 = 'taskkill /pid ' + pid;
        const v69 = v68 + ' /T /F';
        const v70 = exec(v69, callback);
        v70;
        break;
    case 'darwin':
        const v73 = function (parentPid) {
            const v71 = [
                '-P',
                parentPid
            ];
            const v72 = spawn('pgrep', v71);
            return v72;
        };
        const v75 = function () {
            const v74 = killAll(tree, signal, callback);
            v74;
        };
        const v76 = buildProcessTree(pid, tree, pidsToProcess, v73, v75);
        v76;
        break;
    default:
        const v79 = function (parentPid) {
            const v77 = [
                '-o',
                'pid',
                '--no-headers',
                '--ppid',
                parentPid
            ];
            const v78 = spawn('ps', v77);
            return v78;
        };
        const v81 = function () {
            const v80 = killAll(tree, signal, callback);
            v80;
        };
        const v82 = buildProcessTree(pid, tree, pidsToProcess, v79, v81);
        v82;
        break;
    }
};
module.exports = v83;
const killAll = function (tree, signal, callback) {
    var killed = {};
    try {
        const v84 = Object.keys(tree);
        const v94 = function (pid) {
            const v85 = tree[pid];
            const v89 = function (pidpid) {
                const v86 = killed[pidpid];
                const v87 = !v86;
                if (v87) {
                    const v88 = killPid(pidpid, signal);
                    v88;
                    killed[pidpid] = 1;
                }
            };
            const v90 = v85.forEach(v89);
            v90;
            const v91 = killed[pid];
            const v92 = !v91;
            if (v92) {
                const v93 = killPid(pid, signal);
                v93;
                killed[pid] = 1;
            }
        };
        const v95 = v84.forEach(v94);
        v95;
    } catch (err) {
        if (callback) {
            const v96 = callback(err);
            return v96;
        } else {
            throw err;
        }
    }
    if (callback) {
        const v97 = callback();
        return v97;
    }
};
const killPid = function (pid, signal) {
    try {
        const v98 = parseInt(pid, 10);
        const v99 = process.kill(v98, signal);
        v99;
    } catch (err) {
        const v100 = err.code;
        const v101 = v100 !== 'ESRCH';
        if (v101) {
            throw err;
        }
    }
};
const buildProcessTree = function (parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
    var ps = spawnChildProcessesList(parentPid);
    var allData = '';
    const v102 = ps.stdout;
    const v103 = function (data) {
        var data = data.toString('ascii');
        allData += data;
    };
    const v104 = v102.on('data', v103);
    v104;
    var onClose = function (code) {
        const v105 = pidsToProcess[parentPid];
        const v106 = delete v105;
        v106;
        const v107 = code != 0;
        if (v107) {
            const v108 = Object.keys(pidsToProcess);
            const v109 = v108.length;
            const v110 = v109 == 0;
            if (v110) {
                const v111 = cb();
                v111;
            }
            return;
        }
        const v112 = allData.match(/\d+/g);
        const v116 = function (pid) {
            pid = parseInt(pid, 10);
            const v113 = tree[parentPid];
            const v114 = v113.push(pid);
            v114;
            tree[pid] = [];
            pidsToProcess[pid] = 1;
            const v115 = buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
            v115;
        };
        const v117 = v112.forEach(v116);
        v117;
    };
    const v118 = ps.on('close', onClose);
    v118;
};