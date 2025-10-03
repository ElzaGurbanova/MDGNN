var path = require('path');
var cp = require('child_process');
var split = require('split');
var resolve_promise_1 = require('./resolve-promise');
var caller_1 = require('./caller');
var PromiseWithEvents_1 = require('./PromiseWithEvents');
const getArgs = function (argsOrOptions) {
    const v64 = argsOrOptions instanceof Array;
    if (v64) {
        return argsOrOptions;
    }
};
const getOptions = function (argsOrOptions, options) {
    const v65 = argsOrOptions instanceof Array;
    if (v65) {
        return options;
    } else {
        return argsOrOptions;
    }
};
const readStreamAsLines = function (stream, event, eventEmitter) {
    var lastLineEmpty = false;
    const v66 = split();
    const v67 = stream.pipe(v66);
    const v72 = function (line) {
        const v68 = line === '';
        if (v68) {
            if (lastLineEmpty) {
                const v69 = eventEmitter.emit(event, '');
                v69;
            }
            lastLineEmpty = true;
        } else {
            if (lastLineEmpty) {
                const v70 = eventEmitter.emit(event, '');
                v70;
            }
            lastLineEmpty = false;
            const v71 = eventEmitter.emit(event, line);
            v71;
        }
    };
    const v73 = v67.on('data', v72);
    v73;
};
const exec = function (command, options) {
    const v83 = function (resolve, reject, eventEmitter) {
        const v79 = function (err, stdout, stderr) {
            if (err) {
                const v74 = reject(err);
                v74;
            } else {
                const v75 = stdout.toString();
                const v76 = stderr.toString();
                const v77 = {
                    stdout: v75,
                    stderr: v76
                };
                const v78 = resolve(v77);
                v78;
            }
        };
        var childProcess = cp.exec(command, options, v79);
        const v81 = function () {
            const v80 = eventEmitter.emit('process', childProcess);
            return v80;
        };
        const v82 = process.nextTick(v81);
        v82;
    };
    const v84 = new PromiseWithEvents_1.PromiseWithEvents(v83);
    return v84;
};
exports.exec = exec;
const execFile = function (file, argsOrOptions, options) {
    var args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    const v94 = function (resolve, reject, eventEmitter) {
        const v90 = function (err, stdout, stderr) {
            if (err) {
                const v85 = reject(err);
                v85;
            } else {
                const v86 = stdout.toString();
                const v87 = stderr.toString();
                const v88 = {
                    stdout: v86,
                    stderr: v87
                };
                const v89 = resolve(v88);
                v89;
            }
        };
        var childProcess = cp.execFile(file, args, options, v90);
        const v92 = function () {
            const v91 = eventEmitter.emit('process', childProcess);
            return v91;
        };
        const v93 = process.nextTick(v92);
        v93;
    };
    const v95 = new PromiseWithEvents_1.PromiseWithEvents(v94);
    return v95;
};
exports.execFile = execFile;
const spawn = function (command, argsOrOptions, options) {
    var args = getArgs(argsOrOptions);
    options = getOptions(argsOrOptions, options);
    const v110 = function (resolve, reject, eventEmitter) {
        var childProcess = cp.spawn(command, args, options);
        const v96 = childProcess.stdout;
        const v97 = readStreamAsLines(v96, 'stdout', eventEmitter);
        v97;
        const v98 = childProcess.stderr;
        const v99 = readStreamAsLines(v98, 'stderr', eventEmitter);
        v99;
        const v101 = function (err) {
            const v100 = reject(err);
            v100;
        };
        const v102 = childProcess.on('error', v101);
        v102;
        const v105 = function (exitCode) {
            const v103 = { exitCode: exitCode };
            const v104 = resolve(v103);
            v104;
        };
        const v106 = childProcess.on('close', v105);
        v106;
        const v108 = function () {
            const v107 = eventEmitter.emit('process', childProcess);
            return v107;
        };
        const v109 = process.nextTick(v108);
        v109;
    };
    const v111 = new PromiseWithEvents_1.PromiseWithEvents(v110);
    return v111;
};
exports.spawn = spawn;
const fork = function (modulePath, argsOrOptions, options) {
    const v112 = caller_1.caller();
    var basedir = path.dirname(v112);
    const v113 = getArgs(argsOrOptions);
    const v114 = [];
    var args = v113 || v114;
    options = getOptions(argsOrOptions, options);
    const v115 = /^\.{0,2}\//.test(modulePath);
    if (v115) {
        var filePath = path.resolve(basedir, modulePath);
        const v116 = process.execPath;
        const v117 = [filePath];
        const v118 = v117.concat(args);
        const v119 = spawn(v116, v118, options);
        return v119;
    }
    const v120 = { basedir: basedir };
    const v121 = resolve_promise_1.resolve(modulePath, v120);
    const v126 = function (filePath) {
        const v122 = process.execPath;
        const v123 = [filePath];
        const v124 = v123.concat(args);
        const v125 = spawn(v122, v124, options);
        return v125;
    };
    var promise = v121.then(v126);
    return promise;
};
exports.fork = fork;