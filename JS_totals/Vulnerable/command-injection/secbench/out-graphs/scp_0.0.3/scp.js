const v45 = require('child_process');
var exec = v45.exec;
const v46 = {};
module.exports = v46;
var scp = module.exports;
const v67 = function (options, cb) {
    const v47 = options.port;
    const v48 = v47 == undefined;
    const v49 = options.port;
    let v50;
    if (v48) {
        v50 = '22';
    } else {
        v50 = v49;
    }
    const v51 = options.file;
    const v52 = options.user;
    const v53 = v52 == undefined;
    const v54 = options.user;
    const v55 = v54 + '@';
    let v56;
    if (v53) {
        v56 = '';
    } else {
        v56 = v55;
    }
    const v57 = options.host;
    const v58 = v56 + v57;
    const v59 = v58 + ':';
    const v60 = options.path;
    const v61 = v59 + v60;
    var command = [
        'scp',
        '-r',
        '-P',
        v50,
        v51,
        v61
    ];
    const v62 = command.join(' ');
    const v65 = function (err, stdout, stderr) {
        if (cb) {
            const v63 = cb(err, stdout, stderr);
            v63;
        } else {
            if (err) {
                const v64 = new Error(err);
                throw v64;
            }
        }
    };
    const v66 = exec(v62, v65);
    v66;
};
scp.send = v67;
const v88 = function (options, cb) {
    const v68 = options.port;
    const v69 = v68 == undefined;
    const v70 = options.port;
    let v71;
    if (v69) {
        v71 = '22';
    } else {
        v71 = v70;
    }
    const v72 = options.user;
    const v73 = v72 == undefined;
    const v74 = options.user;
    const v75 = v74 + '@';
    let v76;
    if (v73) {
        v76 = '';
    } else {
        v76 = v75;
    }
    const v77 = options.host;
    const v78 = v76 + v77;
    const v79 = v78 + ':';
    const v80 = options.file;
    const v81 = v79 + v80;
    const v82 = options.path;
    var command = [
        'scp',
        '-r',
        '-P',
        v71,
        v81,
        v82
    ];
    const v83 = command.join(' ');
    const v86 = function (err, stdout, stderr) {
        if (cb) {
            const v84 = cb(err, stdout, stderr);
            v84;
        } else {
            if (err) {
                const v85 = new Error(err);
                throw v85;
            }
        }
    };
    const v87 = exec(v83, v86);
    v87;
};
scp.get = v88;