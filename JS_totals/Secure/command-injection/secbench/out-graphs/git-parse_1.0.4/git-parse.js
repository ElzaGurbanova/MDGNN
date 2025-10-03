'use strict';
const v22 = { value: true };
const v23 = Object.defineProperty(exports, '__esModule', v22);
v23;
const v24 = void 0;
exports.default = v24;
const v25 = require('util.promisify');
var _util = _interopRequireDefault(v25);
const v26 = require('child_process');
var _child_process = _interopRequireDefault(v26);
const _interopRequireDefault = function (obj) {
    const v27 = obj.__esModule;
    const v28 = obj && v27;
    const v29 = { default: obj };
    let v30;
    if (v28) {
        v30 = obj;
    } else {
        v30 = v29;
    }
    return v30;
};
const v31 = _util.default;
const v32 = _child_process.default;
const v33 = v32.execFile;
const execFile = (0, v31)(v33);
const gitDiff = (pathToRepo, commit1, commit2 = '', file = '') => {
    const args = [
        'diff',
        commit1
    ];
    if (commit2) {
        const v34 = args.push(commit2);
        v34;
    }
    const v35 = args.push('--');
    v35;
    if (file) {
        const v36 = args.push(file);
        v36;
    }
    const v37 = 1024 * 1000;
    const v38 = {
        cwd: pathToRepo,
        encoding: 'utf8',
        maxBuffer: v37
    };
    const v39 = execFile('git', args, v38);
    const v41 = output => {
        const v40 = output.stdout;
        return v40;
    };
    const v42 = v39.then(v41);
    return v42;
};
var _default = gitDiff;
exports.default = _default;