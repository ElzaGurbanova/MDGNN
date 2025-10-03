'use strict';
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
const v77 = function (pid, signal, callback) {
    var tree = {};
    var pidsToProcess = {};
    tree[pid] = [];
    pidsToProcess[pid] = 1;
    const v57 = typeof signal;
    const v58 = v57 === 'function';
    const v59 = callback === undefined;
    const v60 = v58 && v59;
    if (v60) {
        callback = signal;
        signal = undefined;
    }
    const v61 = process.platform;
    switch (v61) {
    case 'win32':
        const v62 = 'taskkill /pid ' + pid;
        const v63 = v62 + ' /T /F';
        const v64 = exec(v63, callback);
        v64;
        break;
    case 'darwin':
        const v67 = function (parentPid) {
            const v65 = [
                '-P',
                parentPid
            ];
            const v66 = spawn('pgrep', v65);
            return v66;
        };
        const v69 = function () {
            const v68 = killAll(tree, signal, callback);
            v68;
        };
        const v70 = buildProcessTree(pid, tree, pidsToProcess, v67, v69);
        v70;
        break;
    default:
        const v73 = function (parentPid) {
            const v71 = [
                '-o',
                'pid',
                '--no-headers',
                '--ppid',
                parentPid
            ];
            const v72 = spawn('ps', v71);
            return v72;
        };
        const v75 = function () {
            const v74 = killAll(tree, signal, callback);
            v74;
        };
        const v76 = buildProcessTree(pid, tree, pidsToProcess, v73, v75);
        v76;
        break;
    }
};
module.exports = v77;
const killAll = function (tree, signal, callback) {
    var killed = {};
    try {
        const v78 = Object.keys(tree);
        const v88 = function (pid) {
            const v79 = tree[pid];
            const v83 = function (pidpid) {
                const v80 = killed[pidpid];
                const v81 = !v80;
                if (v81) {
                    const v82 = killPid(pidpid, signal);
                    v82;
                    killed[pidpid] = 1;
                }
            };
            const v84 = v79.forEach(v83);
            v84;
            const v85 = killed[pid];
            const v86 = !v85;
            if (v86) {
                const v87 = killPid(pid, signal);
                v87;
                killed[pid] = 1;
            }
        };
        const v89 = v78.forEach(v88);
        v89;
    } catch (err) {
        if (callback) {
            const v90 = callback(err);
            return v90;
        } else {
            throw err;
        }
    }
    if (callback) {
        const v91 = callback();
        return v91;
    }
};
const killPid = function (pid, signal) {
    try {
        const v92 = parseInt(pid, 10);
        const v93 = process.kill(v92, signal);
        v93;
    } catch (err) {
        const v94 = err.code;
        const v95 = v94 !== 'ESRCH';
        if (v95) {
            throw err;
        }
    }
};
const buildProcessTree = function (parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
    var ps = spawnChildProcessesList(parentPid);
    var allData = '';
    const v96 = ps.stdout;
    const v97 = function (data) {
        var data = data.toString('ascii');
        allData += data;
    };
    const v98 = v96.on('data', v97);
    v98;
    var onClose = function (code) {
        const v99 = pidsToProcess[parentPid];
        const v100 = delete v99;
        v100;
        const v101 = code != 0;
        if (v101) {
            const v102 = Object.keys(pidsToProcess);
            const v103 = v102.length;
            const v104 = v103 == 0;
            if (v104) {
                const v105 = cb();
                v105;
            }
            return;
        }
        const v106 = allData.match(/\d+/g);
        const v110 = function (pid) {
            pid = parseInt(pid, 10);
            const v107 = tree[parentPid];
            const v108 = v107.push(pid);
            v108;
            tree[pid] = [];
            pidsToProcess[pid] = 1;
            const v109 = buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
            v109;
        };
        const v111 = v106.forEach(v110);
        v111;
    };
    const v112 = ps.on('close', onClose);
    v112;
};