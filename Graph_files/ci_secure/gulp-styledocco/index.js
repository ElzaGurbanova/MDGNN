var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');
var defaults = require('lodash.defaults');
const v53 = require('child_process');
var exec = v53.execFile;
var PLUGIN_NAME = 'gulp-styledocco';
const v104 = function (options) {
    'use strict';
    var firstFile = null;
    const v54 = {};
    const v55 = options || v54;
    const v56 = {
        out: 'docs',
        name: 'Styledocco',
        include: null,
        preprocessor: null
    };
    var opts = defaults(v55, v56);
    var count = 0;
    const transform = function (file, encoding, cb) {
        const v57 = file.isNull();
        if (v57) {
            const v58 = this.push(file);
            v58;
            const v59 = cb();
            return v59;
        }
        const v60 = file.isStream();
        if (v60) {
            const v61 = new PluginError(PLUGIN_NAME, 'Streaming not supported');
            const v62 = this.emit('error', v61);
            v62;
            const v63 = cb();
            return v63;
        }
        const v64 = count++;
        v64;
        const v65 = !firstFile;
        if (v65) {
            firstFile = file;
        }
        const v66 = cb();
        v66;
    };
    const flush = function (cb) {
        var bin = 'styledocco ';
        var args = [];
        const v67 = opts.out;
        const v68 = args.push('--out', v67);
        v68;
        const v69 = opts.name;
        const v70 = v69 !== null;
        if (v70) {
            const v71 = opts.name;
            const v72 = '"' + v71;
            const v73 = v72 + '"';
            const v74 = args.push('--name', v73);
            v74;
        }
        const v75 = opts.preprocessor;
        const v76 = v75 !== null;
        if (v76) {
            const v77 = opts.preprocessor;
            const v78 = args.push('--preprocessor', v77);
            v78;
        }
        const v79 = opts.include;
        const v80 = v79 !== null;
        if (v80) {
            const v81 = opts.include;
            const v83 = function (value) {
                const v82 = args.push('--include', value);
                return v82;
            };
            const v84 = v81.forEach(v83);
            v84;
        }
        const v85 = opts.verbose;
        if (v85) {
            const v86 = opts.verbose;
            const v87 = args.push('--verbose', v86);
            v87;
        }
        const v88 = opts['no-minify'];
        if (v88) {
            const v89 = args.push('--no-minify');
            v89;
        }
        const v90 = count > 1;
        if (v90) {
            const v91 = firstFile.base;
            const v92 = args.push(v91);
            v92;
        } else {
            const v93 = firstFile.path;
            const v94 = args.push(v93);
            v94;
        }
        const v95 = args.join(' ');
        var cmd = bin + v95;
        cmd = cmd.split(' ');
        const v96 = cmd[0];
        const v97 = cmd.slice(1);
        const v101 = function (error, stdout, stderr) {
            if (stderr) {
                const v98 = gutil.log(stderr);
                v98;
            }
            if (stdout) {
                stdout = stdout.trim();
                const v99 = gutil.log(stdout);
                v99;
            }
            const v100 = cb(error);
            v100;
        };
        const v102 = exec(v96, v97, v101);
        v102;
    };
    const v103 = through.obj(transform, flush);
    return v103;
};
module.exports = v104;