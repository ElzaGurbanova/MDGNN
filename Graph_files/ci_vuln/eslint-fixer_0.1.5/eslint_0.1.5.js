const path = require('path');
const childProcess = require('child_process');
const pWaitFor = require('p-wait-for');
let cacheIsEslintAvailable;
let eslintCheckInProgress = false;
const exec = function (cmd) {
    const v42 = (resolve, reject) => {
        const v40 = (error, stdout, stderr) => {
            if (error) {
                error.message += `\n${ stderr }\n${ stdout }`;
            }
            const v37 = reject(error);
            const v38 = resolve(stdout, stderr);
            let v39;
            if (error) {
                v39 = v37;
            } else {
                v39 = v38;
            }
            return v39;
        };
        const v41 = childProcess.exec(cmd, v40);
        v41;
    };
    const v43 = new Promise(v42);
    return v43;
};
const shouldExecute = function (options) {
    const v44 = options;
    const checkAvailable = v44.checkAvailable;
    const useEslint = v44.useEslint;
    const v45 = !useEslint;
    if (v45) {
        const v46 = Promise.resolve(false);
        return v46;
    }
    const v47 = !checkAvailable;
    if (v47) {
        const v48 = Promise.resolve(true);
        return v48;
    }
    if (eslintCheckInProgress) {
        const v50 = () => {
            const v49 = !eslintCheckInProgress;
            return v49;
        };
        const v51 = pWaitFor(v50);
        const v52 = () => {
            return cacheIsEslintAvailable;
        };
        const v53 = v51.then(v52);
        return v53;
    }
    eslintCheckInProgress = true;
    const v54 = exec('eslint -v');
    const v55 = () => {
        cacheIsEslintAvailable = true;
        eslintCheckInProgress = false;
        return cacheIsEslintAvailable;
    };
    const v56 = v54.then(v55);
    return v56;
};
const fix = function (filePath, options = {}) {
    const v57 = options;
    const checkAvailable = v57.undefined;
    const useEslint = v57.undefined;
    const v58 = {
        checkAvailable,
        useEslint
    };
    const v59 = shouldExecute(v58);
    const v68 = doExecute => {
        let files;
        const v60 = Array.isArray(filePath);
        const v61 = path.normalize;
        const v62 = filePath.map(v61);
        const v63 = v62.join(' ');
        const v64 = path.normalize(filePath);
        if (v60) {
            files = v63;
        } else {
            files = v64;
        }
        const v65 = `npx eslint --fix ${ files }`;
        const v66 = exec(v65);
        let v67;
        if (doExecute) {
            v67 = v66;
        } else {
            v67 = false;
        }
        return v67;
    };
    const v69 = v59.then(v68);
    const v71 = result => {
        const v70 = result !== false;
        return v70;
    };
    const v72 = v69.then(v71);
    return v72;
};
module.exports = fix;