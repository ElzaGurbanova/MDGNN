var _;
var child_process;
var utils;
_ = require('lodash');
child_process = require('child_process');
utils = require('./utils');
const v69 = function (device, callback) {
    var unmountCommand;
    const v49 = device == null;
    if (v49) {
        const v50 = new Error('Missing device');
        throw v50;
    }
    const v51 = _.isString(device);
    const v52 = !v51;
    if (v52) {
        const v53 = 'Invalid device: ' + device;
        const v54 = new Error(v53);
        throw v54;
    }
    const v55 = callback == null;
    if (v55) {
        const v56 = new Error('Missing callback');
        throw v56;
    }
    const v57 = _.isFunction(callback);
    const v58 = !v57;
    if (v58) {
        const v59 = 'Invalid callback: ' + callback;
        const v60 = new Error(v59);
        throw v60;
    }
    const v61 = utils.isWin32();
    if (v61) {
        const v62 = callback(null, null, null);
        return v62;
    }
    const v63 = utils.isMacOSX();
    if (v63) {
        unmountCommand = '/usr/sbin/diskutil unmountDisk force';
    } else {
        unmountCommand = 'umount';
    }
    const v64 = '"' + device;
    device = v64 + '"';
    const v65 = utils.isLinux();
    if (v65) {
        device += '?* 2>/dev/null || /bin/true';
    }
    const v66 = unmountCommand + ' ';
    const v67 = v66 + device;
    const v68 = child_process.exec(v67, callback);
    return v68;
};
exports.umount = v69;
const v96 = function (device, callback) {
    const v70 = device == null;
    if (v70) {
        const v71 = new Error('Missing device');
        throw v71;
    }
    const v72 = _.isString(device);
    const v73 = !v72;
    if (v73) {
        const v74 = 'Invalid device: ' + device;
        const v75 = new Error(v74);
        throw v75;
    }
    const v76 = callback == null;
    if (v76) {
        const v77 = new Error('Missing callback');
        throw v77;
    }
    const v78 = _.isFunction(callback);
    const v79 = !v78;
    if (v79) {
        const v80 = 'Invalid callback: ' + callback;
        const v81 = new Error(v80);
        throw v81;
    }
    const v82 = utils.isWin32();
    if (v82) {
        const v83 = callback(null, true);
        return v83;
    }
    const v94 = function (error, stdout, stderr) {
        const v84 = error != null;
        if (v84) {
            const v85 = callback(error);
            return v85;
        }
        const v86 = _.isEmpty(stderr);
        const v87 = !v86;
        if (v87) {
            const v88 = new Error(stderr);
            const v89 = callback(v88);
            return v89;
        }
        const v90 = stdout.indexOf(device);
        const v91 = -1;
        const v92 = v90 !== v91;
        const v93 = callback(null, v92);
        return v93;
    };
    const v95 = child_process.exec('mount', v94);
    return v95;
};
exports.isMounted = v96;