'use strict';
const v39 = require('child_process');
var exec = v39.exec;
const v40 = require('./utils');
var isDigits = v40.isDigits;
const diskusage = function (path, cb) {
    const v41 = path.indexOf('"');
    const v42 = -1;
    const v43 = v41 !== v42;
    if (v43) {
        const v44 = new Error('Paths with double quotes are not supported yet');
        const v45 = cb(v44);
        return v45;
    }
    const v46 = 'df -k "' + path;
    const v47 = v46 + '"';
    const v52 = function (err, stdout) {
        if (err) {
            const v48 = cb(err);
            return v48;
        }
        try {
            const v49 = parse(stdout);
            const v50 = cb(null, v49);
            v50;
        } catch (e) {
            const v51 = cb(e);
            v51;
        }
    };
    const v53 = exec(v47, v52);
    v53;
};
const parse = function (dusage) {
    var lines = dusage.split('\n');
    const v54 = lines[1];
    const v55 = !v54;
    if (v55) {
        const v56 = 'Unexpected df output: [' + dusage;
        const v57 = v56 + ']';
        const v58 = new Error(v57);
        throw v58;
    }
    const v59 = lines[1];
    const v60 = v59.split(' ');
    const v62 = function (x) {
        const v61 = x !== '';
        return v61;
    };
    var parts = v60.filter(v62);
    var total = parts[1];
    var used = parts[2];
    var available = parts[3];
    const v63 = isDigits(total);
    const v64 = isDigits(used);
    const v65 = v63 && v64;
    const v66 = isDigits(available);
    const v67 = v65 && v66;
    const v68 = !v67;
    if (v68) {
        const v69 = 'Unexpected df output: [' + dusage;
        const v70 = v69 + ']';
        const v71 = new Error(v70);
        throw v71;
    }
    const v72 = total * 1024;
    const v73 = used * 1024;
    const v74 = available * 1024;
    const v75 = {};
    v75.total = v72;
    v75.used = v73;
    v75.available = v74;
    return v75;
};
const v76 = {};
v76.diskusage = diskusage;
v76.parse = parse;
module.exports = v76;