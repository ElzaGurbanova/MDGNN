'use strict';
var createError = require('http-errors');
const v33 = require('path');
var join = v33.join;
const v34 = require('path');
var normalize = v34.normalize;
var pathIsAbsolute = require('path-is-absolute');
const v35 = require('path');
var resolve = v35.resolve;
const v36 = require('path');
var sep = v36.sep;
module.exports = resolvePath;
var UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
const resolvePath = function (rootPath, relativePath) {
    var path = relativePath;
    var root = rootPath;
    const v37 = arguments.length;
    const v38 = v37 === 1;
    if (v38) {
        path = rootPath;
        root = process.cwd();
    }
    const v39 = root == null;
    if (v39) {
        const v40 = new TypeError('argument rootPath is required');
        throw v40;
    }
    const v41 = typeof root;
    const v42 = v41 !== 'string';
    if (v42) {
        const v43 = new TypeError('argument rootPath must be a string');
        throw v43;
    }
    const v44 = path == null;
    if (v44) {
        const v45 = new TypeError('argument relativePath is required');
        throw v45;
    }
    const v46 = typeof path;
    const v47 = v46 !== 'string';
    if (v47) {
        const v48 = new TypeError('argument relativePath must be a string');
        throw v48;
    }
    const v49 = path.indexOf('\0');
    const v50 = -1;
    const v51 = v49 !== v50;
    if (v51) {
        const v52 = createError(400, 'Malicious Path');
        throw v52;
    }
    const v53 = pathIsAbsolute.posix(path);
    const v54 = pathIsAbsolute.win32(path);
    const v55 = v53 || v54;
    if (v55) {
        const v56 = createError(400, 'Malicious Path');
        throw v56;
    }
    const v57 = '.' + sep;
    const v58 = v57 + path;
    const v59 = normalize(v58);
    const v60 = UP_PATH_REGEXP.test(v59);
    if (v60) {
        const v61 = createError(403);
        throw v61;
    }
    const v62 = resolve(root);
    const v63 = join(v62, path);
    const v64 = normalize(v63);
    return v64;
};