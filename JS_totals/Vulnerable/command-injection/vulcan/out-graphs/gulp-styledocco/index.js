var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');
var defaults = require('lodash.defaults');
const v52 = require('child_process');
var exec = v52.exec;
var PLUGIN_NAME = 'gulp-styledocco';
const v102 = function (options) {
    'use strict';
    var firstFile = null;
    const v53 = {};
    const v54 = options || v53;
    const v55 = {
        out: 'docs',
        name: 'Styledocco',
        include: null,
        preprocessor: null
    };
    var opts = defaults(v54, v55);
    var count = 0;
    const transform = function (file, encoding, cb) {
        const v56 = file.isNull();
        if (v56) {
            const v57 = this.push(file);
            v57;
            const v58 = cb();
            return v58;
        }
        const v59 = file.isStream();
        if (v59) {
            const v60 = new PluginError(PLUGIN_NAME, 'Streaming not supported');
            const v61 = this.emit('error', v60);
            v61;
            const v62 = cb();
            return v62;
        }
        const v63 = count++;
        v63;
        const v64 = !firstFile;
        if (v64) {
            firstFile = file;
        }
        const v65 = cb();
        v65;
    };
    const flush = function (cb) {
        var bin = 'styledocco ';
        var args = [];
        const v66 = opts.out;
        const v67 = args.push('--out', v66);
        v67;
        const v68 = opts.name;
        const v69 = v68 !== null;
        if (v69) {
            const v70 = opts.name;
            const v71 = '"' + v70;
            const v72 = v71 + '"';
            const v73 = args.push('--name', v72);
            v73;
        }
        const v74 = opts.preprocessor;
        const v75 = v74 !== null;
        if (v75) {
            const v76 = opts.preprocessor;
            const v77 = args.push('--preprocessor', v76);
            v77;
        }
        const v78 = opts.include;
        const v79 = v78 !== null;
        if (v79) {
            const v80 = opts.include;
            const v82 = function (value) {
                const v81 = args.push('--include', value);
                return v81;
            };
            const v83 = v80.forEach(v82);
            v83;
        }
        const v84 = opts.verbose;
        if (v84) {
            const v85 = opts.verbose;
            const v86 = args.push('--verbose', v85);
            v86;
        }
        const v87 = opts['no-minify'];
        if (v87) {
            const v88 = args.push('--no-minify');
            v88;
        }
        const v89 = count > 1;
        if (v89) {
            const v90 = firstFile.base;
            const v91 = args.push(v90);
            v91;
        } else {
            const v92 = firstFile.path;
            const v93 = args.push(v92);
            v93;
        }
        const v94 = args.join(' ');
        const v95 = bin + v94;
        const v99 = function (error, stdout, stderr) {
            if (stderr) {
                const v96 = gutil.log(stderr);
                v96;
            }
            if (stdout) {
                stdout = stdout.trim();
                const v97 = gutil.log(stdout);
                v97;
            }
            const v98 = cb(error);
            v98;
        };
        const v100 = exec(v95, v99);
        v100;
    };
    const v101 = through.obj(transform, flush);
    return v101;
};
module.exports = v102;