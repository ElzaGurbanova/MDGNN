const v29 = require('child_process');
const exec = v29.exec;
const v30 = require('./helpers');
const parseStdout = v30.parseStdout;
const v31 = require('./constants');
const SEPARATOR = v31.SEPARATOR;
const _command = function (cmd) {
    const v39 = (resolve, reject) => {
        const v32 = 1024 * 1000;
        const v33 = { maxBuffer: v32 };
        const v37 = function (err, stdout, stderr) {
            if (err) {
                const v34 = reject(err);
                return v34;
            }
            if (stderr) {
                const v35 = reject(stderr);
                return v35;
            }
            const v36 = resolve(stdout);
            v36;
        };
        const v38 = exec(cmd, v33, v37);
        v38;
    };
    const v40 = new Promise(v39);
    return v40;
};
const v47 = function (limit) {
    let cmd = `git log --no-color --pretty=format:'{
      "commitHash": "%H",
      "commitMessage": "%s",
      "timestamp": "%at000",
      "authorName": "%an"
    },' --abbrev-commit`;
    if (limit) {
        cmd = `${ cmd } -${ limit }`;
    }
    cmd = cmd.replace(/"/g, SEPARATOR);
    const v45 = resolve => {
        const v41 = _command(cmd);
        const v43 = stdout => {
            const json = parseStdout(stdout);
            const v42 = resolve(json);
            v42;
        };
        const v44 = v41.then(v43);
        v44;
    };
    const v46 = new Promise(v45);
    return v46;
};
const v49 = () => {
    const v48 = _command('git rev-parse --short HEAD');
    return v48;
};
const v51 = () => {
    const v50 = _command('git rev-parse HEAD');
    return v50;
};
const v53 = () => {
    const v52 = _command('git rev-parse --abbrev-ref HEAD');
    return v52;
};
const v55 = () => {
    const v54 = _command('git describe --always --tag --abbrev=0');
    return v54;
};
const v56 = {};
v56.log = v47;
v56.short = v49;
v56.long = v51;
v56.branch = v53;
v56.tag = v55;
module.exports = v56;