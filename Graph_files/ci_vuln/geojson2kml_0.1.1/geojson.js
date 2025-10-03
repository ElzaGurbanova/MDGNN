const v8 = require('child_process');
var exec = v8.exec;
var path = require('path');
const v14 = function (inPath, outPath, done) {
    const v9 = 'ogr2ogr -f KML ' + outPath;
    const v10 = v9 + ' ';
    var ogrCommand = v10 + inPath;
    const v12 = function (err, stdout, stderr) {
        const v11 = done(err);
        v11;
    };
    const v13 = exec(ogrCommand, v12);
    v13;
};
module.exports = v14;