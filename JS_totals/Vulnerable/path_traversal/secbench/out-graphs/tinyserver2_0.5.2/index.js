var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime');
var program = require('commander');
var path = require('path');
const v34 = path.join(__dirname, 'package.json');
var pkg = require(v34);
const v35 = pkg.version;
const v36 = program.version(v35);
const v37 = v36.option('-p, --port <port>', 'Port on which to listen to (defaults to 8080)', parseInt);
const v38 = process.argv;
const v39 = v37.parse(v38);
v39;
const v40 = program.port;
var port = v40 || 8080;
const v61 = function (req, resp) {
    const v41 = req.connection;
    const v42 = v41.remoteAddress;
    const v43 = req.url;
    const v44 = new Date();
    const v45 = v44.toLocaleString();
    const v46 = '[' + v45;
    const v47 = v46 + ']';
    const v48 = console.log(v42, v43, v47);
    v48;
    const v49 = req.url;
    var myurl = url.parse(v49);
    const v50 = myurl.pathname;
    const v51 = v50 == '/';
    if (v51) {
        myurl.pathname = '/index.html';
    }
    const v52 = process.cwd();
    const v53 = myurl.pathname;
    const v54 = path.join(v52, v53);
    const v59 = function (err, data) {
        const v55 = myurl.pathname;
        const v56 = setContentType(v55, resp);
        v56;
        const v57 = resp.setHeader('Access-Control-Allow-Origin', '*');
        v57;
        const v58 = resp.end(data);
        v58;
    };
    const v60 = fs.readFile(v54, v59);
    v60;
};
var server = http.createServer(v61);
const v62 = server.listen(port);
v62;
const setContentType = function (file, resp) {
    const v63 = process.cwd();
    const v64 = path.join(v63, file);
    const v65 = mime.lookup(v64);
    const v66 = resp.setHeader('Content-type', v65);
    v66;
};