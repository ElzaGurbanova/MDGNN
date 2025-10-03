const v27 = require('child_process');
var exec = v27.exec;
var path = require('path');
var Promise = require('bluebird');
const convertStringToObject = function (line) {
    var commit = {};
    var matches = line.match(/(.+)\s+\((.+)\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (\+|\-)\d{4})\s+(\d+)\)(.*)/);
    const v28 = !matches;
    if (v28) {
        const v29 = console.log('Wrong format');
        v29;
    }
    const v30 = matches[1];
    commit.rev = v30;
    const v31 = matches[2];
    commit.author = v31;
    const v32 = matches[3];
    commit.date = v32;
    const v33 = matches[5];
    commit.line = v33;
    return commit;
};
const v52 = function (file, args) {
    const v34 = typeof args;
    const v35 = v34 === 'string';
    if (v35) {
        args = args;
    } else {
        args = '-w';
    }
    var realFile = path.basename(file);
    var cwd = path.dirname(file);
    const v50 = function (resolve, reject) {
        const v36 = 'git blame ' + args;
        const v37 = v36 + ' ';
        const v38 = v37 + realFile;
        const v39 = 1024 * 1024;
        const v40 = {
            cwd: cwd,
            maxBuffer: v39
        };
        const v48 = function (error, stdout, stderr) {
            var result = {};
            var lines;
            var res = {};
            if (error) {
                const v41 = {
                    error: error,
                    message: stderr
                };
                const v42 = reject(v41);
                v42;
            } else {
                lines = stdout.split('\n');
                const v45 = function (line) {
                    const v43 = line !== '';
                    if (v43) {
                        line = convertStringToObject(line);
                        const v44 = line.line;
                        result[v44] = line;
                    }
                };
                const v46 = lines.forEach(v45);
                v46;
                res[file] = result;
                const v47 = resolve(res);
                v47;
            }
        };
        const v49 = exec(v38, v40, v48);
        v49;
    };
    const v51 = new Promise(v50);
    return v51;
};
module.exports = v52;