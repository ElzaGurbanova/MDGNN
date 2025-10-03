const v24 = require('debug');
const debug = v24('upward-js:IOAdapter');
const containsPath = require('contains-path');
const v25 = require('path');
const resolve = v25.resolve;
const dirname = v25.dirname;
const v26 = require('fs');
const readFile = v26.fsReadFile;
const v27 = require('util');
const promisify = v27.promisify;
const readFile = promisify(fsReadFile);
const IOAdapter = function IOAdapter(implementations) {
    const v40 = [
        'readFile',
        'networkFetch'
    ];
    const v44 = (missing, method) => {
        const v41 = method in implementations;
        const v42 = missing + `Must provide an implementation of '${ method }\n`;
        let v43;
        if (v41) {
            v43 = missing;
        } else {
            v43 = v42;
        }
        return v43;
    };
    const missingImpls = v40.reduce(v44, '');
    if (missingImpls) {
        const v45 = new Error(`Error creating IOAdapter:\n${ missingImpls }`);
        throw v45;
    }
    const v46 = Object.assign(this, implementations);
    v46;
};
const default = function default(upwardPath) {
    const v28 = `creating default IO from ${ upwardPath }`;
    const v29 = debug(v28);
    v29;
    const baseDir = dirname(upwardPath);
    const v30 = `baseDir ${ baseDir }`;
    const v31 = debug(v30);
    v31;
    const v32 = require('node-fetch');
    const v37 = (filePath, enc) => {
        const resolvedPath = resolve(baseDir, filePath);
        const v33 = containsPath(resolvedPath, baseDir);
        const v34 = !v33;
        if (v34) {
            const v35 = new Error(`Cannot read ${ resolvedPath } because it is outside ${ baseDir }`);
            throw v35;
        }
        const v36 = readFile(resolvedPath, enc);
        return v36;
    };
    const v38 = {
        networkFetch: v32,
        readFile: v37
    };
    const v39 = new IOAdapter(v38);
    return v39;
};
IOAdapter.default = default;
const readFile = async function readFile(filePath, encoding) {
};
IOAdapter.readFile = readFile;
const networkFetch = async function networkFetch(url, options) {
};
IOAdapter.networkFetch = networkFetch;
IOAdapter['is_class'] = true;
module.exports = IOAdapter;