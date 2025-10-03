'use strict';
const v20 = { value: true };
const v21 = Object.defineProperty(exports, '__esModule', v20);
v21;
const v22 = void 0;
exports.default = v22;
const v23 = require('util.promisify');
var _util = _interopRequireDefault(v23);
const v24 = require('child_process');
var _child_process = _interopRequireDefault(v24);
const _interopRequireDefault = function (obj) {
    const v25 = obj.__esModule;
    const v26 = obj && v25;
    const v27 = { default: obj };
    let v28;
    if (v26) {
        v28 = obj;
    } else {
        v28 = v27;
    }
    return v28;
};
const v29 = _util.default;
const v30 = _child_process.default;
const v31 = v30.exec;
const exec = (0, v29)(v31);
const gitDiff = (pathToRepo, commit1, commit2 = '', file = '') => {
    const v32 = `git diff ${ commit1 } ${ commit2 } -- ${ file }`;
    const v33 = 1024 * 1000;
    const v34 = {
        cwd: pathToRepo,
        encoding: 'utf8',
        maxBuffer: v33
    };
    const v35 = exec(v32, v34);
    const v37 = output => {
        const v36 = output.stdout;
        return v36;
    };
    const v38 = v35.then(v37);
    return v38;
};
var _default = gitDiff;
exports.default = _default;