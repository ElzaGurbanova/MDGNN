var contra = require('contra');
var path = require('path');
var fUtils = require('./files');
var cp = require('child_process');
var gitApp = 'git';
const v63 = process.env;
var gitExtra = {};
gitExtra.env = v63;
var escapeQuotes = function (str) {
    const v64 = typeof str;
    const v65 = v64 === 'string';
    if (v65) {
        const v66 = str.replace(/(["$`\\])/g, '\\$1');
        return v66;
    } else {
        return str;
    }
};
const v67 = module.exports;
const v94 = function (callback) {
    const v68 = gitApp + ' ';
    const v69 = [
        'ls-files',
        '-m'
    ];
    const v70 = v69.join(' ');
    const v71 = v68 + v70;
    const v92 = function (er, stdout, stderr) {
        const v72 = stdout.trim();
        const v73 = v72.split('\n');
        const v82 = function (line) {
            const v74 = line.replace(/.{1,2}\s+/, '');
            var file = path.basename(v74);
            const v75 = line.trim();
            const v76 = line.match(/^\?\? /);
            const v77 = !v76;
            const v78 = v75 && v77;
            const v79 = fUtils.isPackageFile(line);
            const v80 = !v79;
            const v81 = v78 && v80;
            return v81;
        };
        const v83 = v73.filter(v82);
        const v85 = function (line) {
            const v84 = line.trim();
            return v84;
        };
        var lines = v83.map(v85);
        const v86 = lines.length;
        if (v86) {
            const v87 = lines.join('\n');
            const v88 = 'Git working directory not clean.\n' + v87;
            const v89 = new Error(v88);
            const v90 = callback(v89);
            return v90;
        }
        const v91 = callback();
        return v91;
    };
    const v93 = cp.exec(v71, gitExtra, v92);
    v93;
};
v67.isRepositoryClean = v94;
const v95 = module.exports;
const v98 = function (callback) {
    const v96 = gitApp + ' checkout -- .';
    const v97 = cp.exec(v96, gitExtra, callback);
    v97;
};
v95.checkout = v98;
const v99 = module.exports;
const v124 = function (files, message, newVer, tagName, callback) {
    const v100 = message.replace('%s', newVer);
    const v101 = v100.replace('"', '');
    message = v101.replace('\'', '');
    const v105 = function (file) {
        const v102 = escapeQuotes(file);
        const v103 = '"' + v102;
        const v104 = v103 + '"';
        return v104;
    };
    const v106 = files.map(v105);
    files = v106.join(' ');
    const v110 = function (done) {
        const v107 = gitApp + ' add ';
        const v108 = v107 + files;
        const v109 = cp.exec(v108, gitExtra, done);
        v109;
    };
    const v116 = function (done) {
        const v111 = '"' + message;
        const v112 = v111 + '"';
        const v113 = [
            gitApp,
            'commit',
            '-m',
            v112
        ];
        const v114 = v113.join(' ');
        const v115 = cp.exec(v114, gitExtra, done);
        v115;
    };
    const v122 = function (done) {
        const v117 = '"' + message;
        const v118 = v117 + '"';
        const v119 = [
            gitApp,
            'tag',
            '-a',
            tagName,
            '-m',
            v118
        ];
        const v120 = v119.join(' ');
        const v121 = cp.exec(v120, gitExtra, done);
        v121;
    };
    var functionSeries = [
        v110,
        v116,
        v122
    ];
    const v123 = contra.series(functionSeries, callback);
    v123;
};
v99.commit = v124;