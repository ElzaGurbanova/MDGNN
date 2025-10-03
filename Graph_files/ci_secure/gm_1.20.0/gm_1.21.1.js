const v71 = require('child_process');
var spawn = v71.spawn;
const v140 = function (proto) {
    const compare = function (orig, compareTo, options, cb) {
        const v72 = this._options;
        const v73 = this._options;
        const v74 = v73.imageMagick;
        var isImageMagick = v72 && v74;
        const v75 = this._options;
        const v76 = this._options;
        const v77 = v76.appPath;
        const v78 = v75 && v77;
        var appPath = v78 || '';
        let bin;
        const v79 = appPath + 'compare';
        const v80 = appPath + 'gm';
        if (isImageMagick) {
            bin = v79;
        } else {
            bin = v80;
        }
        var args = [
            '-metric',
            'mse',
            orig,
            compareTo
        ];
        const v81 = !isImageMagick;
        if (v81) {
            const v82 = args.unshift('compare');
            v82;
        }
        var tolerance = 0.4;
        const v83 = typeof options;
        const v84 = v83 === 'object';
        if (v84) {
            const v85 = options.highlightColor;
            const v86 = options.highlightColor;
            const v87 = v86.indexOf('"');
            const v88 = v87 < 0;
            const v89 = v85 && v88;
            if (v89) {
                const v90 = options.highlightColor;
                const v91 = '"' + v90;
                options.highlightColor = v91 + '"';
            }
            const v92 = options.file;
            if (v92) {
                const v93 = options.file;
                const v94 = typeof v93;
                const v95 = v94 !== 'string';
                if (v95) {
                    const v96 = new TypeError('The path for the diff output is invalid');
                    throw v96;
                }
                const v97 = options.highlightColour;
                if (v97) {
                    const v98 = args.push('-highlight-color');
                    v98;
                    const v99 = options.highlightColor;
                    const v100 = args.push(v99);
                    v100;
                }
                const v101 = options.highlightStyle;
                if (v101) {
                    const v102 = args.push('-highlight-style');
                    v102;
                    const v103 = options.highlightStyle;
                    const v104 = args.push(v103);
                    v104;
                }
                const v105 = !isImageMagick;
                if (v105) {
                    const v106 = args.push('-file');
                    v106;
                }
                const v107 = options.file;
                const v108 = args.push(v107);
                v108;
            }
            const v109 = options.tolerance;
            const v110 = typeof v109;
            const v111 = v110 != 'undefined';
            if (v111) {
                const v112 = options.tolerance;
                const v113 = typeof v112;
                const v114 = v113 !== 'number';
                if (v114) {
                    const v115 = new TypeError('The tolerance value should be a number');
                    throw v115;
                }
                tolerance = options.tolerance;
            }
        } else {
            if (isImageMagick) {
                const v116 = args.push('null:');
                v116;
            }
            const v117 = typeof options;
            const v118 = v117 == 'function';
            if (v118) {
                cb = options;
            } else {
                tolerance = options;
            }
        }
        var proc = spawn(bin, args);
        var stdout = '';
        var stderr = '';
        const v119 = proc.stdout;
        const v120 = function (data) {
            stdout += data;
        };
        const v121 = v119.on('data', v120);
        v121;
        const v122 = proc.stderr;
        const v123 = function (data) {
            stderr += data;
        };
        const v124 = v122.on('data', v123);
        v124;
        const v138 = function (code) {
            if (isImageMagick) {
                const v125 = code === 0;
                if (v125) {
                    const v126 = 0 <= tolerance;
                    const v127 = cb(null, v126, 0, stdout);
                    return v127;
                } else {
                    const v128 = code === 1;
                    if (v128) {
                        err = null;
                        stdout = stderr;
                    } else {
                        const v129 = cb(stderr);
                        return v129;
                    }
                }
            } else {
                const v130 = code !== 0;
                if (v130) {
                    const v131 = cb(stderr);
                    return v131;
                }
            }
            let regex;
            if (isImageMagick) {
                regex = /\((\d+\.?[\d\-\+e]*)\)/m;
            } else {
                regex = /Total: (\d+\.?\d*)/m;
            }
            var match = regex.exec(stdout);
            const v132 = !match;
            if (v132) {
                const v133 = 'Unable to parse output.\nGot ' + stdout;
                err = new Error(v133);
                const v134 = cb(err);
                return v134;
            }
            const v135 = match[1];
            var equality = parseFloat(v135);
            const v136 = equality <= tolerance;
            const v137 = cb(null, v136, equality, stdout, orig, compareTo);
            v137;
        };
        const v139 = proc.on('close', v138);
        v139;
    };
    if (proto) {
        proto.compare = compare;
    }
    return compare;
};
exports = v140;
module.exports = exports;