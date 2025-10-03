var fs = require('fs');
var http = require('http');
var mime = require('mime');
var path = require('path');
var url = require('url');
const v48 = process.argv;
var args = v48.slice(2);
const v49 = args[0];
var port = v49 || 3000;
var root = './';
const v91 = function (request, response) {
    const v50 = request.url;
    const v51 = url.parse(v50);
    var pathname = v51.pathname;
    const v52 = process.cwd();
    var filename = path.join(v52, root, pathname);
    const v53 = path.extname(filename);
    const v54 = !v53;
    if (v54) {
        filename = filename + '/index.html';
    }
    var logOutput = function (code) {
        var d = new Date();
        const v55 = d.toDateString();
        const v56 = '[' + v55;
        const v57 = v56 + ' ';
        const v58 = d.toLocaleTimeString();
        const v59 = v57 + v58;
        const v60 = v59 + '] ';
        const v61 = request.method;
        const v62 = v60 + v61;
        const v63 = v62 + ' ';
        const v64 = request.url;
        const v65 = v63 + v64;
        const v66 = v65 + ' ';
        const v67 = v66 + code;
        const v68 = v67 + ' -';
        const v69 = console.log(v68);
        v69;
    };
    const v89 = function (gotPath) {
        const v70 = !gotPath;
        if (v70) {
            const v71 = { 'Content-Type': 'text/plain' };
            const v72 = response.writeHead(404, v71);
            v72;
            const v73 = response.write('404 Not Found');
            v73;
            const v74 = response.end();
            v74;
            const v75 = logOutput(404);
            v75;
            return;
        }
        const v76 = mime.lookup(filename);
        const v77 = { 'Content-Type': v76 };
        const v78 = response.writeHead(200, v77);
        v78;
        const v79 = 4 * 1024;
        const v80 = {
            'flags': 'r',
            'encoding': 'binary',
            'mode': '0666',
            'bufferSize': v79
        };
        const v81 = fs.createReadStream(filename, v80);
        const v83 = function (chunk) {
            const v82 = response.write(chunk, 'binary');
            v82;
        };
        const v84 = v81.addListener('data', v83);
        const v87 = function () {
            const v85 = logOutput(200);
            v85;
            const v86 = response.end();
            v86;
        };
        const v88 = v84.addListener('close', v87);
        v88;
    };
    const v90 = fs.exists(filename, v89);
    v90;
};
var server = http.createServer(v91);
const v92 = 'Now start listening at port: ' + port;
const v93 = console.log(v92);
v93;
const v94 = server.listen(port);
v94;