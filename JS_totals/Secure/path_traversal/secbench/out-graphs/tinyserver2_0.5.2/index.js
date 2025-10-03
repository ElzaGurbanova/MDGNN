var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime');
var program = require('commander');
var path = require('path');
const v38 = path.join(__dirname, 'package.json');
var pkg = require(v38);
const v39 = pkg.version;
const v40 = program.version(v39);
const v41 = v40.option('-p, --port <port>', 'Port on which to listen to (defaults to 8080)', parseInt);
const v42 = process.argv;
const v43 = v41.parse(v42);
v43;
const v44 = program.port;
var port = v44 || 8080;
const v69 = function (req, resp) {
    const v45 = req.connection;
    const v46 = v45.remoteAddress;
    const v47 = req.url;
    const v48 = new Date();
    const v49 = v48.toLocaleString();
    const v50 = '[' + v49;
    const v51 = v50 + ']';
    const v52 = console.log(v46, v47, v51);
    v52;
    const v53 = req.url;
    var myurl = url.parse(v53);
    const v54 = myurl.pathname;
    const v55 = v54.replace(/\.\./g, '');
    myurl.pathname = v55;
    const v56 = myurl.pathname;
    const v57 = v56 == '/';
    if (v57) {
        myurl.pathname = '/index.html';
    }
    const v58 = process.cwd();
    const v59 = myurl.pathname;
    const v60 = path.join(v58, v59);
    const v67 = function (err, data) {
        if (err) {
            const v61 = resp.setHeader('Content-type', 'text/plain');
            v61;
            const v62 = resp.end('OK');
            v62;
        } else {
            const v63 = myurl.pathname;
            const v64 = setContentType(v63, resp);
            v64;
            const v65 = resp.setHeader('Access-Control-Allow-Origin', '*');
            v65;
            const v66 = resp.end(data);
            v66;
        }
    };
    const v68 = fs.readFile(v60, v67);
    v68;
};
var server = http.createServer(v69);
const v70 = server.listen(port);
v70;
const setContentType = function (file, resp) {
    const v71 = process.cwd();
    const v72 = path.join(v71, file);
    const v73 = mime.lookup(v72);
    const v74 = resp.setHeader('Content-type', v73);
    v74;
};