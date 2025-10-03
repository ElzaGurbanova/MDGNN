var http = require('http');
var fs = require('fs');
var path = require('path');
var files = {};
var port = 9000;
var host = '127.0.0.1';
var assets = function (req, res) {
    var sendError = function (message, code) {
        const v33 = code == undefined;
        if (v33) {
            code = 404;
        }
        const v34 = { 'Content-Type': 'text/html' };
        const v35 = res.writeHead(code, v34);
        v35;
        const v36 = res.end(message);
        v36;
    };
    var serve = function (file) {
        var contentType;
        const v37 = file.ext;
        const v38 = v37.toLowerCase();
        switch (v38) {
        case 'css':
            contentType = 'text/css';
            break;
        case 'html':
            contentType = 'text/html';
            break;
        case 'js':
            contentType = 'application/javascript';
            break;
        case 'ico':
            contentType = 'image/ico';
            break;
        case 'json':
            contentType = 'application/json';
            break;
        case 'jpg':
            contentType = 'image/jpeg';
            break;
        case 'jpeg':
            contentType = 'image/jpeg';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        default:
            contentType = 'text/plain';
        }
        const v39 = { 'Content-Type': contentType };
        const v40 = res.writeHead(200, v39);
        v40;
        const v41 = file.content;
        const v42 = res.end(v41);
        v42;
    };
    var readFile = function (filePath) {
        const v43 = files[filePath];
        if (v43) {
            const v44 = files[filePath];
            const v45 = serve(v44);
            v45;
        } else {
            const v54 = function (err, data) {
                if (err) {
                    const v46 = 'Error reading ' + filePath;
                    const v47 = v46 + '.';
                    const v48 = sendError(v47);
                    v48;
                    return;
                }
                const v49 = filePath.split('.');
                const v50 = v49.pop();
                const v51 = {};
                v51.ext = v50;
                v51.content = data;
                files[filePath] = v51;
                const v52 = files[filePath];
                const v53 = serve(v52);
                v53;
            };
            const v55 = fs.readFile(filePath, v54);
            v55;
        }
    };
    const v56 = req.url;
    const v57 = __dirname + v56;
    const v58 = path.normalize(v57);
    const v59 = readFile(v58);
    v59;
};
const v60 = http.createServer(assets);
var app = v60.listen(port, host);
const v61 = 'Listening on ' + host;
const v62 = v61 + ':';
const v63 = v62 + port;
const v64 = console.log(v63);
v64;