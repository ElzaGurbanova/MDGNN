const v61 = require('child_process');
var exec = v61.exec;
var utils = require('./utils');
const v120 = function (proto) {
    const compare = function (orig, compareTo, options, cb) {
        orig = utils.escape(orig);
        compareTo = utils.escape(compareTo);
        const v62 = this._options;
        const v63 = this._options;
        const v64 = v63.imageMagick;
        var isImageMagick = v62 && v64;
        let bin;
        if (isImageMagick) {
            bin = '';
        } else {
            bin = 'gm ';
        }
        const v65 = bin + 'compare -metric mse ';
        const v66 = v65 + orig;
        const v67 = v66 + ' ';
        var execCmd = v67 + compareTo;
        var tolerance = 0.4;
        const v68 = typeof options;
        const v69 = v68 === 'object';
        if (v69) {
            const v70 = options.highlightColor;
            const v71 = options.highlightColor;
            const v72 = v71.indexOf('"');
            const v73 = v72 < 0;
            const v74 = v70 && v73;
            if (v74) {
                const v75 = options.highlightColor;
                const v76 = '"' + v75;
                options.highlightColor = v76 + '"';
            }
            const v77 = options.file;
            if (v77) {
                const v78 = options.file;
                const v79 = typeof v78;
                const v80 = v79 !== 'string';
                if (v80) {
                    const v81 = new TypeError('The path for the diff output is invalid');
                    throw v81;
                }
                let highlightColorOption;
                const v82 = options.highlightColor;
                const v83 = options.highlightColor;
                const v84 = ' -highlight-color ' + v83;
                const v85 = v84 + ' ';
                if (v82) {
                    highlightColorOption = v85;
                } else {
                    highlightColorOption = ' ';
                }
                let highlightStyleOption;
                const v86 = options.highlightStyle;
                const v87 = options.highlightStyle;
                const v88 = ' -highlight-style ' + v87;
                const v89 = v88 + ' ';
                if (v86) {
                    highlightStyleOption = v89;
                } else {
                    highlightStyleOption = ' ';
                }
                const v90 = options.file;
                var diffFilename = utils.escape(v90);
                let diffOpt;
                const v91 = '-file ' + diffFilename;
                if (isImageMagick) {
                    diffOpt = diffFilename;
                } else {
                    diffOpt = v91;
                }
                const v92 = highlightColorOption + highlightStyleOption;
                const v93 = v92 + ' ';
                execCmd += v93 + diffOpt;
            }
            const v94 = options.tolerance;
            const v95 = typeof v94;
            const v96 = v95 != 'undefined';
            if (v96) {
                const v97 = options.tolerance;
                const v98 = typeof v97;
                const v99 = v98 !== 'number';
                if (v99) {
                    const v100 = new TypeError('The tolerance value should be a number');
                    throw v100;
                }
                tolerance = options.tolerance;
            }
        } else {
            const v101 = isImageMagick && (execCmd += ' null:');
            v101;
            const v102 = typeof options;
            const v103 = v102 == 'function';
            if (v103) {
                cb = options;
            } else {
                tolerance = options;
            }
        }
        const v118 = function (err, stdout, stderr) {
            if (isImageMagick) {
                const v104 = !err;
                if (v104) {
                    const v105 = 0 <= tolerance;
                    const v106 = cb(null, v105, 0, stdout);
                    return v106;
                }
                const v107 = err.code;
                const v108 = v107 === 1;
                if (v108) {
                    err = null;
                    stdout = stderr;
                }
            }
            if (err) {
                const v109 = cb(err);
                return v109;
            }
            let regex;
            if (isImageMagick) {
                regex = /\((\d+\.?[\d\-\+e]*)\)/m;
            } else {
                regex = /Total: (\d+\.?\d*)/m;
            }
            var match = regex.exec(stdout);
            const v110 = !match;
            if (v110) {
                const v111 = 'Unable to parse output.\nGot ' + stdout;
                err = new Error(v111);
                const v112 = cb(err);
                return v112;
            }
            const v113 = match[1];
            var equality = parseFloat(v113);
            const v114 = equality <= tolerance;
            const v115 = utils.unescape(orig);
            const v116 = utils.unescape(compareTo);
            const v117 = cb(null, v114, equality, stdout, v115, v116);
            v117;
        };
        const v119 = exec(execCmd, v118);
        v119;
    };
    if (proto) {
        proto.compare = compare;
    }
    return compare;
};
exports = v120;
module.exports = exports;