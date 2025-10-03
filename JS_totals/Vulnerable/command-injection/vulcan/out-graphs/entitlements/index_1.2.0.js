'use strict';
const v9 = require('child_process');
var exec = v9.exec;
var plist = require('simple-plist');
const v16 = function (path, callback) {
    const v10 = 'codesign -d --entitlements :- ' + path;
    const v14 = function (error, output) {
        if (error) {
            const v11 = callback(error);
            return v11;
        }
        const v12 = plist.parse(output);
        const v13 = callback(null, v12);
        v13;
    };
    const v15 = exec(v10, v14);
    v15;
};
module.exports = v16;