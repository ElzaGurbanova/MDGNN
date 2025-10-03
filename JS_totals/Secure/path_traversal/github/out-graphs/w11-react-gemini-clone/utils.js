const path = require('path');
const v6 = require('./constants');
const FS_ROOT = v6.FS_ROOT;
const resolvePath = function (relativePath) {
    const fullPath = path.join(FS_ROOT, relativePath);
    const v7 = fullPath.startsWith(FS_ROOT);
    const v8 = !v7;
    if (v8) {
        const v9 = new Error('Access denied: Path is outside of the allowed root directory.');
        throw v9;
    }
    return fullPath;
};
const v10 = {};
v10.resolvePath = resolvePath;
module.exports = v10;