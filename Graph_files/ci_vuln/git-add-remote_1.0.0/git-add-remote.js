'use strict';
var path = require('path');
var cp = require('child_process');
const v62 = function (dir) {
    let cwd;
    const v32 = path.resolve(dir);
    const v33 = process.cwd();
    if (dir) {
        cwd = v32;
    } else {
        cwd = v33;
    }
    const addRemote = function (name, url, cb) {
        const v34 = typeof cb;
        const v35 = v34 !== 'function';
        if (v35) {
            const v36 = new TypeError('expected callback to be a function');
            throw v36;
        }
        const v37 = typeof url;
        const v38 = v37 !== 'string';
        if (v38) {
            const v39 = new TypeError('expected url to be a string');
            const v40 = cb(v39);
            v40;
            return;
        }
        const v41 = typeof name;
        const v42 = v41 !== 'string';
        if (v42) {
            const v43 = new TypeError('expected name to be a string');
            const v44 = cb(v43);
            v44;
            return;
        }
        const v45 = 'git remote add ' + name;
        const v46 = v45 + ' ';
        const v47 = v46 + url;
        const v48 = { cwd: cwd };
        const v49 = cp.exec(v47, v48, cb);
        v49;
    };
    ;
    const v61 = function (name, url) {
        const v50 = typeof url;
        const v51 = v50 !== 'string';
        if (v51) {
            const v52 = new TypeError('expected url to be a string');
            throw v52;
        }
        const v53 = typeof name;
        const v54 = v53 !== 'string';
        if (v54) {
            const v55 = new TypeError('expected name to be a string');
            throw v55;
        }
        const v56 = 'git remote add ' + name;
        const v57 = v56 + ' ';
        const v58 = v57 + url;
        const v59 = { cwd: cwd };
        const v60 = cp.execSync(v58, v59);
        v60;
    };
    addRemote.sync = v61;
    return addRemote;
};
module.exports = v62;