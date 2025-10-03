const v54 = require('child_process');
var execFile = v54.execFile;
const v55 = require('child_process');
var exec = v55.exec;
var escape = require('shell-escape');
var path = require('path');
const v58 = function (pattern) {
    const v56 = this._command;
    const v57 = v56.push('-name', pattern);
    v57;
    return this;
};
const v61 = function (pattern) {
    const v59 = this._command;
    const v60 = v59.unshift('-name', pattern, '-prune', '-o');
    v60;
    return this;
};
const v64 = function (filepath) {
    const v62 = this._command;
    const v63 = v62.push('-newer', filepath);
    v63;
    return this;
};
const v68 = function (filetype) {
    const v65 = this._command;
    const v66 = filetype[0];
    const v67 = v65.push('-type', v66);
    v67;
    return this;
};
const v74 = function () {
    const v69 = this.rootDir;
    const v70 = [
        'find',
        v69
    ];
    const v71 = this._command;
    const v72 = v70.concat(v71, '-print');
    const v73 = escape(v72);
    return v73;
};
const v86 = function () {
    var root = this.rootDir;
    const v75 = typeof root;
    const v76 = v75 !== 'string';
    const v77 = !root;
    const v78 = v76 || v77;
    if (v78) {
        root = '.';
    }
    const v79 = path.basename(root);
    const v80 = v79.startsWith('-');
    if (v80) {
        root = './' + root;
    }
    const v81 = [root];
    const v82 = this._command;
    const v83 = v81.concat(v82);
    const v84 = ['-print'];
    const v85 = v83.concat(v84);
    return v85;
};
const v89 = function () {
    const v87 = this._command;
    const v88 = v87.push('-follow');
    v88;
    return this;
};
const v104 = function (callback) {
    var args = this._argv();
    const v90 = this.options;
    const v91 = {};
    const v92 = v90 || v91;
    const v102 = function (err, stdout, stderr) {
        if (err) {
            const v93 = err.message;
            const v94 = stderr || v93;
            const v95 = callback(v94);
            return v95;
        }
        var files = stdout.split('\n');
        const v96 = files.length;
        const v97 = v96 - 1;
        const v98 = files[v97];
        const v99 = v98 === '';
        if (v99) {
            const v100 = files.pop();
            v100;
        }
        const v101 = callback(null, files);
        v101;
    };
    const v103 = execFile('find', args, v92, v102);
    v103;
};
var shellFind = {};
shellFind.name = v58;
shellFind.prune = v61;
shellFind.newer = v64;
shellFind.type = v68;
shellFind.command = v74;
shellFind._argv = v86;
shellFind.follow = v89;
shellFind.exec = v104;
const v106 = function (rootDir, options) {
    var finder = Object.create(shellFind);
    finder._command = [];
    finder.rootDir = '.';
    finder.options = options;
    const v105 = typeof rootDir;
    switch (v105) {
    case 'string':
        finder.rootDir = rootDir;
        break;
    case 'object':
        finder.options = rootDir;
        break;
    }
    return finder;
};
module.exports = v106;