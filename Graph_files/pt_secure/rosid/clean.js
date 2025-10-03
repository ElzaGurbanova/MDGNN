'use strict';
const fse = require('fs-extra');
const isPathInside = require('is-path-inside');
const log = require('./log');
const v34 = function (distPath, cwdPath, opts, next) {
    const isSafePath = isPathInside(distPath, cwdPath);
    const v18 = isSafePath === false;
    if (v18) {
        const v19 = new Error(`Specified distPath must be inside the current working directory to prevent us from deleting ourself`);
        const v20 = next(v19);
        return v20;
    }
    const v21 = opts.verbose;
    const v22 = v21 === true;
    if (v22) {
        const v23 = `{cyan:Deleting folder: {grey:${ distPath }`;
        const v24 = log(v23);
        v24;
    }
    const v32 = err => {
        const v25 = err != null;
        if (v25) {
            const v26 = next(err);
            return v26;
        }
        const v27 = opts.verbose;
        const v28 = v27 === true;
        if (v28) {
            const v29 = `{cyan:Deleted folder: {grey:${ distPath }`;
            const v30 = log(v29);
            v30;
        }
        const v31 = next();
        v31;
    };
    const v33 = fse.remove(distPath, v32);
    v33;
};
module.exports = v34;