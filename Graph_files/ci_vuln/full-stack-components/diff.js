const cp = require('child_process');
const v10 = require('./scripts/utils');
const resolvePath = v10.resolvePath;
let v11 = process.argv;
let first = v11[2];
let second = v11[3];
const go = async function () {
    const v12 = !second;
    if (v12) {
        second = first;
        const v13 = Number(second);
        const v14 = v13 - 1;
        first = v14.toString();
    }
    const firstPath = resolvePath(first);
    const secondPath = resolvePath(second);
    const v15 = `git diff --no-index ${ firstPath } ${ secondPath }`;
    const v16 = {
        shell: true,
        stdio: 'inherit'
    };
    const v17 = cp.spawnSync(v15, v16);
    v17;
};
const v18 = go();
v18;