'use strict';
const v37 = require('shelljs/global');
v37;
const fs = require('fs');
const os = require('os');
const path = require('path');
const platform = os.platform();
const aapt = path.join(__dirname, 'bin', platform, 'aapt');
const v38 = platform === 'linux';
if (v38) {
    const v39 = fs.chmodSync(aapt, '777');
    v39;
}
const promistify = function (cmd, callback) {
    const v40 = function () {
    };
    callback = callback || v40;
    const v48 = (resolve, reject) => {
        const v46 = (code, stdout, stderr) => {
            const v41 = code !== 0;
            if (v41) {
                const v42 = reject(stderr);
                v42;
                const v43 = callback(stderr, null);
                v43;
            } else {
                const v44 = resolve(stdout);
                v44;
                const v45 = callback(null, stdout);
                v45;
            }
        };
        const v47 = exec(cmd, v46);
        v47;
    };
    const v49 = new Promise(v48);
    return v49;
};
const list = function (apkfilePath, callback) {
    const v50 = `${ aapt } l ${ apkfilePath }`;
    const v51 = promistify(v50, callback);
    return v51;
};
const dump = function (what, apkfilePath, callback) {
    const v52 = `${ aapt } d ${ what } ${ apkfilePath }`;
    const v53 = promistify(v52, callback);
    return v53;
};
const packageCmd = function (command, callback) {
    const v54 = `${ aapt } p ${ command }`;
    const v55 = promistify(v54, callback);
    return v55;
};
const remove = function (apkfilePath, files, callback) {
    const v56 = Array.isArray(files);
    const v57 = !v56;
    if (v57) {
        files = [files];
    }
    const removeFiles = files.join(' ');
    const v58 = `${ aapt } r ${ apkfilePath } ${ removeFiles }`;
    const v59 = promistify(v58, callback);
    return v59;
};
const add = function (apkfilePath, files, callback) {
    const v60 = Array.isArray(files);
    const v61 = !v60;
    if (v61) {
        files = [files];
    }
    const addFiles = files.join(' ');
    const v62 = `${ aapt } a ${ apkfilePath } ${ addFiles }`;
    const v63 = promistify(v62, callback);
    return v63;
};
const crunch = function (resource, outputFolder, callback) {
    const v64 = Array.isArray(resource);
    const v65 = !v64;
    if (v65) {
        resource = [resource];
    }
    const resourceSources = resource.join(' ');
    const v66 = `${ aapt } c -S ${ resourceSources } -C ${ outputFolder }`;
    const v67 = promistify(v66, callback);
    return v67;
};
const singleCrunch = function (inputFile, outputfile, callback) {
    const v68 = `${ aapt } s -i ${ inputFile } -o ${ outputfile }`;
    const v69 = promistify(v68, callback);
    return v69;
};
const version = function (callback) {
    const v70 = `${ aapt } v`;
    const v71 = promistify(v70, callback);
    return v71;
};
const v72 = {};
v72.list = list;
v72.dump = dump;
v72.packageCmd = packageCmd;
v72.remove = remove;
v72.add = add;
v72.crunch = crunch;
v72.singleCrunch = singleCrunch;
v72.version = version;
module.exports = v72;