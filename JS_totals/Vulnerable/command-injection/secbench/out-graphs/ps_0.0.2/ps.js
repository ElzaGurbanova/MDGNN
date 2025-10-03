var cp = require('child_process');
const v46 = function (args, callback) {
    const v36 = Array.isArray(args);
    if (v36) {
        args = args.join(' ');
    }
    const v37 = 'ps ' + args;
    const v44 = function (err, stdout, stderr) {
        stdout = stdout.toString('utf8');
        stderr = stderr.toString('utf8');
        const v38 = err || stderr;
        if (v38) {
            const v39 = stderr || err;
            const v40 = callback(v39);
            return v40;
        }
        const v41 = stdout.trim();
        const v42 = v41 || false;
        const v43 = callback(null, v42);
        v43;
    };
    const v45 = cp.exec(v37, v44);
    v45;
};
exports = v46;
module.exports = exports;
const v57 = function (query, callback) {
    const v47 = query.format;
    const v48 = v47 || 'comm';
    var format = parseFormat(v48);
    const v49 = query.pid;
    if (v49) {
        var pid = query.pid;
        const v50 = Array.isArray(pid);
        if (v50) {
            pid = pid.join(',');
        }
        const v51 = [
            '-p',
            pid,
            '-o',
            format
        ];
        const v55 = function (err, output) {
            if (err) {
                const v52 = callback(err);
                return v52;
            }
            const v53 = query.parse;
            if (v53) {
                output = parseGrid(output);
            }
            const v54 = callback(null, output);
            v54;
        };
        const v56 = exports(v51, v55);
        return v56;
    }
};
exports.lookup = v57;
const parseGrid = function (output) {
    const v58 = !output;
    if (v58) {
        return output;
    }
    const v59 = output.split('\n');
    const v64 = function (line) {
        var returnedOutput = [];
        const v60 = line.split(/\s+/);
        const v62 = function (item) {
            if (item) {
                const v61 = returnedOutput.push(item);
                v61;
            }
        };
        const v63 = v60.map(v62);
        v63;
        return returnedOutput;
    };
    const v65 = v59.map(v64);
    return v65;
};
const parseFormat = function (format) {
    const v66 = typeof format;
    const v67 = v66 === 'string';
    if (v67) {
        format = format.split(' ');
    }
    const v69 = function (item) {
        const v68 = item + '=';
        return v68;
    };
    format = format.map(v69);
    const v70 = format.join(' -o ');
    return v70;
};