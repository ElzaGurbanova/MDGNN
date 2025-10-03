var cmd = function (command, callback, log) {
    const v61 = function () {
        return arguments;
    };
    var _callback = callback || v61;
    let _log;
    const v62 = typeof log;
    const v63 = v62 == 'function';
    const v66 = function msg(msg) {
        const v64 = console.log;
        const v65 = v64.apply(console, arguments);
        v65;
    };
    const v67 = new Function();
    let v68;
    if (log) {
        v68 = v66;
    } else {
        v68 = v67;
    }
    if (v63) {
        _log = log;
    } else {
        _log = v68;
    }
    const v69 = !command;
    if (v69) {
        const v70 = {
            state: 'error',
            txt: 'The command is not found!'
        };
        const v71 = _log(v70);
        v71;
        const v72 = Promise.reject('The command is not found!');
        return v72;
    }
    const v73 = Array.isArray(command);
    if (v73) {
        const v78 = function (prefCommand, currentCommand) {
            const v74 = cmd(prefCommand, null, _log);
            const v76 = function () {
                const v75 = cmd(currentCommand, null, _log);
                return v75;
            };
            const v77 = v74.then(v76);
            return v77;
        };
        const v79 = command.reduce(v78);
        return v79;
    } else {
        const v80 = typeof command;
        const v81 = v80 == 'object';
        if (v81) {
            var allPromis = [];
            let k;
            for (k in command) {
                const v82 = command[k];
                const v83 = cmd(v82, null, _log);
                const v84 = allPromis.push(v83);
                v84;
            }
            const v85 = Promise.all(allPromis);
            return v85;
        } else {
            const v86 = 'command start: ' + command;
            const v87 = {
                state: 'start',
                txt: v86
            };
            const v88 = _log(v87);
            v88;
            const v120 = function (resolve, reject) {
                const v89 = require('child_process');
                var exec = v89.exec;
                const v90 = { encoding: 'utf-8' };
                var child = exec(command, v90);
                var _data = [];
                var _error = [];
                const v91 = 'executing: ' + command;
                const v92 = {
                    state: 'run',
                    txt: v91
                };
                const v93 = _log(v92);
                v93;
                const v94 = child.stdout;
                const v101 = function (data) {
                    const v95 = _data.push(data);
                    v95;
                    const v96 = data.code;
                    var code = v96 || data;
                    const v97 = data.code;
                    const v98 = 'data code:' + v97;
                    const v99 = {
                        state: 'run',
                        type: v98,
                        txt: data
                    };
                    const v100 = _log(v99);
                    v100;
                };
                const v102 = v94.on('data', v101);
                v102;
                const v103 = child.stderr;
                const v107 = function (data) {
                    const v104 = _error.push(data);
                    v104;
                    const v105 = {
                        state: 'run',
                        type: 'error',
                        txt: data
                    };
                    const v106 = _log(v105);
                    v106;
                };
                const v108 = v103.on('data', v107);
                v108;
                const v109 = child.stdout;
                const v112 = function (data) {
                    const v110 = {
                        state: 'run',
                        type: 'end',
                        txt: 'command complete'
                    };
                    const v111 = _log(v110);
                    v111;
                };
                const v113 = v109.on('end', v112);
                v113;
                const v118 = function (code) {
                    const v114 = _callback();
                    v114;
                    const v115 = {
                        state: 'stop',
                        type: 'close',
                        txt: 'close cmd process'
                    };
                    const v116 = _log(v115);
                    v116;
                    const v117 = resolve(_data, _error);
                    v117;
                };
                const v119 = child.on('close', v118);
                v119;
            };
            var _promise = new Promise(v120);
            return _promise;
        }
    }
};
module.exports = cmd;