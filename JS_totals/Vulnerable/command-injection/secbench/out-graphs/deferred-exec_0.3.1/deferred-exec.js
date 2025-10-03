var child_process = require('child_process');
var _ = require('lodash');
const v57 = require('underscore.deferred');
const v58 = _.mixin(v57);
v58;
const v59 = require('underscore.string');
const v60 = v59.exports();
const v61 = _.mixin(v60);
v61;
var deferredChildProcess = function (type, command, args, options) {
    const v62 = {};
    options = options || v62;
    const v63 = [];
    args = args || v63;
    const v64 = type === 'exec';
    if (v64) {
        options = args;
    }
    var dfd = _.Deferred();
    var trim = _.rtrim;
    const v65 = options.trim;
    const v66 = v65 === false;
    if (v66) {
        var trim = function (a) {
            return a;
        };
    }
    var hollaback = function (error, stdout, stderr) {
        const v67 = error !== null;
        if (v67) {
            const v68 = dfd.reject(error, stdout, stderr, command);
            v68;
        } else {
            const v69 = trim(stdout);
            const v70 = trim(stderr);
            const v71 = dfd.resolve(v69, v70, command);
            v71;
        }
    };
    const v72 = type === 'file';
    if (v72) {
        const v73 = child_process.execFile(command, args, options, hollaback);
        v73;
    }
    const v74 = type === 'exec';
    if (v74) {
        const v75 = child_process.exec(command, hollaback);
        v75;
    }
    const v76 = type === 'spawn';
    if (v76) {
        var cp = child_process.spawn(command, args, options);
        const v77 = cp.stdout;
        const v78 = options.encoding;
        const v79 = v78 || 'utf8';
        const v80 = v77.setEncoding(v79);
        v80;
        const v81 = cp.stderr;
        const v82 = options.encoding;
        const v83 = v82 || 'utf8';
        const v84 = v81.setEncoding(v83);
        v84;
        var stdout = '';
        var stderr = '';
        let eventType;
        const v85 = cp.stdio;
        if (v85) {
            eventType = 'close';
        } else {
            eventType = 'exit';
        }
        const v86 = cp.stdout;
        const v88 = function (data) {
            stdout += data;
            const v87 = dfd.notify(data, '', command);
            v87;
        };
        const v89 = v86.on('data', v88);
        v89;
        const v90 = cp.stderr;
        const v92 = function (data) {
            stderr += data;
            const v91 = dfd.notify('', data, command);
            v91;
        };
        const v93 = v90.on('data', v92);
        v93;
        const v100 = function (code) {
            const v94 = code !== 0;
            if (v94) {
                const v95 = command + ' failed';
                var error = new Error(v95);
                error.code = code;
                const v96 = dfd.reject(error);
                v96;
            } else {
                const v97 = trim(stdout);
                const v98 = trim(stderr);
                const v99 = dfd.resolve(v97, v98, command);
                v99;
            }
        };
        const v101 = cp.on(eventType, v100);
        v101;
    }
    const v102 = dfd.promise();
    return v102;
};
const v104 = function (command, options) {
    const v103 = deferredChildProcess('exec', command, options);
    return v103;
};
module.exports = v104;
const v105 = module.exports;
const v107 = function (command, args, options) {
    const v106 = deferredChildProcess('file', command, args, options);
    return v106;
};
v105.file = v107;
const v108 = module.exports;
const v110 = function (command, args, options) {
    const v109 = deferredChildProcess('spawn', command, args, options);
    return v109;
};
v108.spawn = v110;
const v111 = module.exports;
const v112 = function () {
};
v111.prompt = v112;