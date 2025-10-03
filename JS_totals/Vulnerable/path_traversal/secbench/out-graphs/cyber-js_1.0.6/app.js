const v40 = function (str) {
    const v39 = console.log(str);
    v39;
};
exports.debug = v40;
const v42 = function (StrLength) {
    var StrLength = StrLength.length;
    const v41 = console.log(StrLength);
    v41;
};
exports.length = v42;
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
const v43 = process.argv;
const v44 = v43[2];
var port = v44 || 3000;
const v70 = function (request, response) {
    const v45 = request.url;
    const v46 = url.parse(v45);
    var uri = v46.pathname;
    const v47 = process.cwd();
    const v48 = '/public/' + uri;
    var filename = path.join(v47, v48);
    var contentTypesByExtension = {};
    contentTypesByExtension['.html'] = 'text/html';
    contentTypesByExtension['.css'] = 'text/css';
    contentTypesByExtension['.js'] = 'text/javascript';
    const v68 = function (exists) {
        const v49 = !exists;
        if (v49) {
            const v50 = { 'Content-Type': 'text/plain' };
            const v51 = response.writeHead(404, v50);
            v51;
            const v52 = response.write('404 - Page Not Found.\n');
            v52;
            const v53 = response.end();
            v53;
            return;
        }
        const v54 = fs.statSync(filename);
        const v55 = v54.isDirectory();
        if (v55) {
            filename += '/index.html';
        }
        const v66 = function (err, file) {
            if (err) {
                const v56 = { 'Content-Type': 'text/plain' };
                const v57 = response.writeHead(500, v56);
                v57;
                const v58 = err + '\n';
                const v59 = response.write(v58);
                v59;
                const v60 = response.end();
                v60;
                return;
            }
            var headers = {};
            const v61 = '/public/' + filename;
            const v62 = path.extname(v61);
            var contentType = contentTypesByExtension[v62];
            if (contentType) {
                headers['Content-Type'] = contentType;
            }
            const v63 = response.writeHead(200, headers);
            v63;
            const v64 = response.write(file, 'binary');
            v64;
            const v65 = response.end();
            v65;
        };
        const v67 = fs.readFile(filename, 'binary', v66);
        v67;
    };
    const v69 = fs.exists(filename, v68);
    v69;
};
const v71 = http.createServer(v70);
const v72 = parseInt(port, 10);
const v73 = v71.listen(v72);
v73;
const v74 = 'Static file server running at\n  => http://localhost:' + port;
const v75 = v74 + '/\nCTRL + C to shutdown';
const v76 = console.log(v75);
v76;