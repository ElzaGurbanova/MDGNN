'use strict';
const v33 = require('child_process');
var execFile = v33.execFile;
const v34 = require('./utils');
var isDigits = v34.isDigits;
const diskusage = function (path, cb) {
    const v35 = [
        '-k',
        path
    ];
    const v40 = function (err, stdout) {
        if (err) {
            const v36 = cb(err);
            return v36;
        }
        try {
            const v37 = parse(stdout);
            const v38 = cb(null, v37);
            v38;
        } catch (e) {
            const v39 = cb(e);
            v39;
        }
    };
    const v41 = execFile('df', v35, v40);
    v41;
};
const parse = function (dusage) {
    var lines = dusage.split('\n');
    const v42 = lines[1];
    const v43 = !v42;
    if (v43) {
        const v44 = 'Unexpected df output: [' + dusage;
        const v45 = v44 + ']';
        const v46 = new Error(v45);
        throw v46;
    }
    const v47 = lines[1];
    const v48 = v47.split(' ');
    const v50 = function (x) {
        const v49 = x !== '';
        return v49;
    };
    var parts = v48.filter(v50);
    var total = parts[1];
    var used = parts[2];
    var available = parts[3];
    const v51 = isDigits(total);
    const v52 = isDigits(used);
    const v53 = v51 && v52;
    const v54 = isDigits(available);
    const v55 = v53 && v54;
    const v56 = !v55;
    if (v56) {
        const v57 = 'Unexpected df output: [' + dusage;
        const v58 = v57 + ']';
        const v59 = new Error(v58);
        throw v59;
    }
    const v60 = total * 1024;
    const v61 = used * 1024;
    const v62 = available * 1024;
    const v63 = {};
    v63.total = v60;
    v63.used = v61;
    v63.available = v62;
    return v63;
};
const v64 = {};
v64.diskusage = diskusage;
v64.parse = parse;
module.exports = v64;