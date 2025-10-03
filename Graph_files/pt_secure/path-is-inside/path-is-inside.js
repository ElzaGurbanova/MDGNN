'use strict';
var path = require('path');
const v35 = function (thePath, potentialParent) {
    thePath = stripTrailingSep(thePath);
    potentialParent = stripTrailingSep(potentialParent);
    const v22 = process.platform;
    const v23 = v22 === 'win32';
    if (v23) {
        thePath = thePath.toLowerCase();
        potentialParent = potentialParent.toLowerCase();
    }
    const v24 = thePath.lastIndexOf(potentialParent, 0);
    const v25 = v24 === 0;
    const v26 = potentialParent.length;
    const v27 = thePath[v26];
    const v28 = path.sep;
    const v29 = v27 === v28;
    const v30 = potentialParent.length;
    const v31 = thePath[v30];
    const v32 = v31 === undefined;
    const v33 = v29 || v32;
    const v34 = v25 && v33;
    return v34;
};
module.exports = v35;
const stripTrailingSep = function (thePath) {
    const v36 = thePath.length;
    const v37 = v36 - 1;
    const v38 = thePath[v37];
    const v39 = path.sep;
    const v40 = v38 === v39;
    if (v40) {
        const v41 = -1;
        const v42 = thePath.slice(0, v41);
        return v42;
    }
    return thePath;
};