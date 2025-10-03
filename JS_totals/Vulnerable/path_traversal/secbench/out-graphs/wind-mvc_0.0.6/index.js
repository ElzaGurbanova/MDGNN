var fs = require('fs');
const v4 = function (path, callback) {
    const v3 = fs.readFile(path, 'binary', callback);
    v3;
};
exports.getHTMLBinary = v4;