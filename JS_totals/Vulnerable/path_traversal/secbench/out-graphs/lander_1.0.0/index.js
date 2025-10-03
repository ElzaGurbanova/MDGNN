var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var defaultPage = 'index.html';
const v37 = function (port) {
    const v32 = Number(port);
    if (port) {
        port = v32;
    } else {
        port = 3000;
    }
    const v33 = http.createServer(print);
    const v34 = v33.listen(port);
    v34;
    const v35 = 'server start at prot: ' + port;
    const v36 = console.log(v35);
    v36;
};
module.exports = v37;
const print = function (req, res) {
    var cwd = process.cwd();
    var reqUrl = req.url;
    const v38 = url.parse(reqUrl);
    var pathName = v38.pathname;
    var extName = path.extname(pathName);
    if (extName) {
        const v39 = cwd + '/';
        var filePath = path.join(v39, pathName);
        const v52 = function (exists) {
            if (exists) {
                const v40 = getContentType(filePath);
                const v41 = { 'Content-Type': v40 };
                const v42 = res.writeHead(200, v41);
                v42;
                const v43 = {
                    flags: 'r',
                    encoding: null
                };
                var stream = fs.createReadStream(filePath, v43);
                const v46 = function () {
                    const v44 = res.writeHead(404);
                    v44;
                    const v45 = res.end('<h1>404 Read Error');
                    v45;
                };
                const v47 = stream.on('error', v46);
                v47;
                const v48 = stream.pipe(res);
                v48;
            } else {
                const v49 = { 'Content-Type': 'text/html' };
                const v50 = res.writeHead(404, v49);
                v50;
                const v51 = res.end('<h1>404 Not Found</h1>');
                v51;
            }
        };
        const v53 = fs.exists(filePath, v52);
        v53;
    } else {
        const v54 = cwd + '/';
        const v55 = v54 + defaultPage;
        const v61 = function (err, data) {
            if (err) {
                const v56 = res.writeHead(404);
                v56;
                const v57 = 'Error loading' + defaultPage;
                const v58 = res.end(v57);
                v58;
            } else {
                const v59 = res.writeHead(200);
                v59;
                const v60 = res.end(data);
                v60;
            }
        };
        const v62 = fs.readFile(v55, v61);
        v62;
    }
};
var getContentType = function (filePath) {
    var contentType = '';
    var ext = path.extname(filePath);
    switch (ext) {
    case '.html':
        contentType = 'text/html';
        break;
    case '.json':
        contentType = 'application/json';
        break;
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    case '.gif':
        contentType = 'image/gif';
        break;
    case '.jpg':
        contentType = 'image/jpeg';
        break;
    case '.png':
        contentType = 'image/png';
        break;
    case '.ico':
        contentType = 'image/icon';
        break;
    default:
        contentType = 'application/octet-stream';
    }
    return contentType;
};