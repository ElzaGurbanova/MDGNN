var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var compile = require('./compile-caja');
const v88 = function () {
    const v85 = function (req, res) {
        const v45 = req.url;
        const v46 = url.parse(v45);
        var uri = v46.pathname;
        const v47 = process.cwd();
        var filename = path.join(v47, uri);
        const v48 = path.extname(filename);
        const v49 = v48 == '';
        if (v49) {
            filename += '/';
        }
        const v50 = filename.length;
        const v51 = v50 - 1;
        const v52 = filename.charAt(v51);
        const v53 = v52 == '/';
        if (v53) {
            filename += 'index.html';
        }
        const v83 = function (exists) {
            if (exists) {
                const v54 = path.extname(filename);
                switch (v54) {
                case '.html':
                    const v55 = { 'Content-Type': 'text/html' };
                    const v56 = res.writeHead(200, v55);
                    v56;
                    break;
                case '.js':
                    const v57 = { 'Content-Type': 'text/javascript' };
                    const v58 = res.writeHead(200, v57);
                    v58;
                    break;
                case '.css':
                    const v59 = { 'Content-Type': 'text/css' };
                    const v60 = res.writeHead(200, v59);
                    v60;
                    break;
                case '.gif':
                    const v61 = { 'Content-Type': 'image/gif' };
                    const v62 = res.writeHead(200, v61);
                    v62;
                    break;
                case '.jpg':
                    const v63 = { 'Content-Type': 'image/jpeg' };
                    const v64 = res.writeHead(200, v63);
                    v64;
                    break;
                case '.png':
                    const v65 = { 'Content-Type': 'image/png' };
                    const v66 = res.writeHead(200, v65);
                    v66;
                    break;
                default:
                    const v67 = { 'Content-Type': 'application/octet-stream' };
                    const v68 = res.writeHead(200, v67);
                    v68;
                }
                const v76 = function (err, data) {
                    const v69 = path.basename(filename);
                    const v70 = v69 === 'index-isv.js';
                    if (v70) {
                        const v71 = data.toString();
                        const v73 = function (result) {
                            const v72 = res.end(result);
                            v72;
                        };
                        const v74 = compile.getCompileCajoledCode(v71, 'UNIQUE', v73);
                        v74;
                    } else {
                        const v75 = res.end(data);
                        v75;
                    }
                };
                const v77 = fs.readFile(filename, v76);
                v77;
            } else {
                const v78 = 'file path is ' + filename;
                const v79 = console.log(v78);
                v79;
                const v80 = { 'Content-Type': 'text/html' };
                const v81 = res.writeHead(404, v80);
                v81;
                const v82 = res.end('<h1>404 Not Found</h1>');
                v82;
            }
        };
        const v84 = fs.exists(filename, v83);
        v84;
    };
    const v86 = http.createServer(v85);
    const v87 = v86.listen(9527, '127.0.0.1');
    v87;
};
exports.runserver = v88;