var contra = require('contra');
var path = require('path');
var fUtils = require('./files');
var cp = require('child_process');
var gitApp = 'git';
const v57 = process.env;
var gitExtra = {};
gitExtra.env = v57;
var escapeQuotes = function (str) {
    const v58 = typeof str;
    const v59 = v58 === 'string';
    if (v59) {
        const v60 = str.replace(/(["'$`\\])/g, '\\$1');
        const v61 = '"' + v60;
        const v62 = v61 + '"';
        return v62;
    } else {
        return str;
    }
};
const v63 = module.exports;
const v90 = function (callback) {
    const v64 = gitApp + ' ';
    const v65 = [
        'ls-files',
        '-m'
    ];
    const v66 = v65.join(' ');
    const v67 = v64 + v66;
    const v88 = function (er, stdout, stderr) {
        const v68 = stdout.trim();
        const v69 = v68.split('\n');
        const v78 = function (line) {
            const v70 = line.replace(/.{1,2}\s+/, '');
            var file = path.basename(v70);
            const v71 = line.trim();
            const v72 = line.match(/^\?\? /);
            const v73 = !v72;
            const v74 = v71 && v73;
            const v75 = fUtils.isPackageFile(line);
            const v76 = !v75;
            const v77 = v74 && v76;
            return v77;
        };
        const v79 = v69.filter(v78);
        const v81 = function (line) {
            const v80 = line.trim();
            return v80;
        };
        var lines = v79.map(v81);
        const v82 = lines.length;
        if (v82) {
            const v83 = lines.join('\n');
            const v84 = 'Git working directory not clean.\n' + v83;
            const v85 = new Error(v84);
            const v86 = callback(v85);
            return v86;
        }
        const v87 = callback();
        return v87;
    };
    const v89 = cp.exec(v67, gitExtra, v88);
    v89;
};
v63.isRepositoryClean = v90;
const v91 = module.exports;
const v94 = function (callback) {
    const v92 = gitApp + ' checkout -- .';
    const v93 = cp.exec(v92, gitExtra, callback);
    v93;
};
v91.checkout = v94;
const v95 = module.exports;
const v112 = function (files, message, newVer, tagName, callback) {
    const v96 = message.replace('%s', newVer);
    message = escapeQuotes(v96);
    const v97 = files.map(escapeQuotes);
    files = v97.join(' ');
    const v101 = function (done) {
        const v98 = gitApp + ' add ';
        const v99 = v98 + files;
        const v100 = cp.exec(v99, gitExtra, done);
        v100;
    };
    const v105 = function (done) {
        const v102 = [
            gitApp,
            'commit',
            '-m',
            message
        ];
        const v103 = v102.join(' ');
        const v104 = cp.exec(v103, gitExtra, done);
        v104;
    };
    const v110 = function (done) {
        const v106 = escapeQuotes(tagName);
        const v107 = [
            gitApp,
            'tag',
            '-a',
            v106,
            '-m',
            message
        ];
        const v108 = v107.join(' ');
        const v109 = cp.exec(v108, gitExtra, done);
        v109;
    };
    var functionSeries = [
        v101,
        v105,
        v110
    ];
    const v111 = contra.series(functionSeries, callback);
    v111;
};
v95.commit = v112;