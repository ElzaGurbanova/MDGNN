'use strict';
const cp = require('child_process');
const driveOrMountRegex = /(^[a-zA-Z]|^\/).*/;
const DRIVE_STRING_ERROR = 'driveOrMount is invalid';
const getBytesFromOutput = function (output) {
    let bytes;
    const v51 = process.platform;
    const v52 = v51 === 'win32';
    if (v52) {
        const v53 = output.toString();
        const v54 = /(quota|avail) free bytes\s*:\s*([\d,]*)/.exec(v53);
        output = v54[2];
        output = output.replace(/,/g, '');
        bytes = parseInt(output);
    } else {
        output = output.toString();
        const v55 = parseInt(output);
        bytes = v55 * 512;
    }
    return bytes;
};
const v85 = function (driveOrMount, callback) {
    const v78 = function (resolve, reject) {
        let cb = function (err, stdout, stderr) {
            const v56 = stderr.toString();
            const v57 = console.log(v56);
            v57;
            if (err) {
                if (callback) {
                    const v58 = callback(err);
                    v58;
                }
                const v59 = reject(err);
                v59;
            } else {
                if (stderr) {
                    const v60 = stderr.toString();
                    let err = new Error(v60);
                    if (callback) {
                        const v61 = callback(err);
                        v61;
                    }
                    const v62 = reject(err);
                    v62;
                } else {
                    let bytes = getBytesFromOutput(stdout);
                    if (callback) {
                        const v63 = callback(null, bytes);
                        v63;
                    }
                    const v64 = resolve(bytes);
                    v64;
                }
            }
        };
        const v65 = driveOrMountRegex.test(driveOrMount);
        const v66 = !v65;
        if (v66) {
            let err = new Error(DRIVE_STRING_ERROR);
            if (callback) {
                const v67 = callback(err);
                v67;
            }
            const v68 = reject(err);
            return v68;
        }
        const v69 = process.platform;
        const v70 = v69 === 'win32';
        if (v70) {
            const v71 = driveOrMount.charAt(0);
            driveOrMount = v71.toLowerCase();
            const v72 = `fsutil volume diskfree ${ driveOrMount }:`;
            const v73 = {};
            const v74 = cp.exec(v72, v73, cb);
            v74;
        } else {
            const v75 = `df -P ${ driveOrMount } | awk 'NR==2 {print $4}'`;
            const v76 = {};
            const v77 = cp.exec(v75, v76, cb);
            v77;
        }
    };
    const v79 = new Promise(v78);
    const v80 = function (bytes) {
        return bytes;
    };
    const v81 = v79.then(v80);
    const v83 = function (err) {
        const v82 = Promise.reject(err);
        return v82;
    };
    const v84 = v81.catch(v83);
    return v84;
};
exports.check = v85;
const v100 = function (driveOrMount) {
    let output;
    const v86 = driveOrMountRegex.test(driveOrMount);
    const v87 = !v86;
    if (v87) {
        const v88 = new Error(DRIVE_STRING_ERROR);
        throw v88;
    }
    const v89 = process.platform;
    const v90 = v89 === 'win32';
    if (v90) {
        const v91 = driveOrMount.charAt(0);
        driveOrMount = v91.toLowerCase();
        const v92 = `fsutil volume diskfree ${ driveOrMount }:`;
        const v93 = {};
        output = cp.execSync(v92, v93);
    } else {
        const v94 = `df -P ${ driveOrMount } | awk 'NR==2 {print $4}'`;
        const v95 = {};
        output = cp.execSync(v94, v95);
    }
    const v96 = output.length;
    const v97 = v96 === 0;
    if (v97) {
        const v98 = new Error('Failed to read free space');
        throw v98;
    }
    const v99 = getBytesFromOutput(output);
    return v99;
};
exports.checkSync = v100;