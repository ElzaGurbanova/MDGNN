const v58 = process.env;
const v59 = v58.PORT;
var port = v59 || 9001;
var server = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
const serverHandler = function (request, response) {
    const v60 = request.url;
    const v61 = url.parse(v60);
    var uri = v61.pathname;
    const v62 = process.cwd();
    var filename = path.join(v62, uri);
    const v104 = function (exists) {
        const v63 = !exists;
        if (v63) {
            const v64 = { 'Content-Type': 'text/plain' };
            const v65 = response.writeHead(404, v64);
            v65;
            const v66 = '404 Not Found: ' + filename;
            const v67 = v66 + '\n';
            const v68 = response.write(v67);
            v68;
            const v69 = response.end();
            v69;
            return;
        }
        const v70 = filename.indexOf('favicon.ico');
        const v71 = -1;
        const v72 = v70 !== v71;
        if (v72) {
            return;
        }
        const v73 = process.platform;
        const v74 = v73.match(/^win/);
        const v75 = !v74;
        const v76 = !v75;
        var isWin = v76;
        const v77 = fs.statSync(filename);
        const v78 = v77.isDirectory();
        const v79 = !isWin;
        const v80 = v78 && v79;
        if (v80) {
            filename += '/index.html';
        } else {
            const v81 = fs.statSync(filename);
            const v82 = v81.isDirectory();
            const v83 = !isWin;
            const v84 = !v83;
            const v85 = v82 && v84;
            if (v85) {
                filename += '\\index.html';
            }
        }
        const v102 = function (err, file) {
            if (err) {
                const v86 = { 'Content-Type': 'text/plain' };
                const v87 = response.writeHead(500, v86);
                v87;
                const v88 = err + '\n';
                const v89 = response.write(v88);
                v89;
                const v90 = response.end();
                v90;
                return;
            }
            var contentType;
            const v91 = filename.indexOf('.html');
            const v92 = -1;
            const v93 = v91 !== v92;
            if (v93) {
                contentType = 'text/html';
            }
            const v94 = filename.indexOf('.js');
            const v95 = -1;
            const v96 = v94 !== v95;
            if (v96) {
                contentType = 'application/javascript';
            }
            if (contentType) {
                const v97 = { 'Content-Type': contentType };
                const v98 = response.writeHead(200, v97);
                v98;
            } else {
                const v99 = response.writeHead(200);
                v99;
            }
            const v100 = response.write(file, 'binary');
            v100;
            const v101 = response.end();
            v101;
        };
        const v103 = fs.readFile(filename, 'binary', v102);
        v103;
    };
    const v105 = fs.exists(filename, v104);
    v105;
};
var app;
app = server.createServer(serverHandler);
const v106 = process.env;
const v107 = v106.IP;
const v108 = v107 || '0.0.0.0';
const v114 = function () {
    var addr = app.address();
    const v109 = addr.address;
    const v110 = v109 + ':';
    const v111 = addr.port;
    const v112 = v110 + v111;
    const v113 = console.log('Server listening at', v112);
    v113;
};
app = app.listen(port, v108, v114);