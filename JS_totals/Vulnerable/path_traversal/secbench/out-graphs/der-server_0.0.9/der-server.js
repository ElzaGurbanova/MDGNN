var http = require('http');
var fs = require('fs');
var path = require('path');
var start = function (dir, defaultPage, port) {
    dir = dir || './';
    defaultPage = defaultPage || 'index.html';
    port = port || 80;
    const v17 = function (req, res) {
        const v1 = req.url;
        var _path = v1.replace(/\?.*$/, '');
        var pn;
        var s;
        var encode;
        const v2 = _path === '/';
        const v3 = '/' + defaultPage;
        if (v2) {
            _path = v3;
        } else {
            _path = _path;
        }
        pn = dir + _path;
        var extname = path.extname(pn);
        const v4 = {
            '.css': 'text/css',
            '.html': 'text/html',
            '.txt': 'text/plain',
            '.js': 'application/javascript',
            '.gif': 'image/gif',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.pdf': 'application/pdf',
            '.swf': 'application/x-shockwave-flash'
        };
        const v5 = v4[extname];
        var contentType = v5 || 'text-plain';
        switch (extname) {
        case '.css':
        case '.js':
        case '.html':
        case '.txt':
            encode = 'utf-8';
            break;
        }
        const v15 = function (err, data) {
            if (err) {
                const v6 = err.code;
                const v7 = v6 === 'ENOENT';
                if (v7) {
                    s = '404\uFF0C文件不存在';
                } else {
                    const v8 = err.code;
                    s = 'error: ' + v8;
                }
                const v9 = { 'Content-Type': 'text-plain' };
                const v10 = res.writeHead(404, v9);
                v10;
                const v11 = res.end(s);
                v11;
                return;
            }
            const v12 = { 'Content-Type': contentType };
            const v13 = res.writeHead(200, v12);
            v13;
            const v14 = res.end(data);
            v14;
        };
        const v16 = fs.readFile(pn, encode, v15);
        v16;
    };
    const v18 = http.createServer(v17);
    const v19 = v18.listen(port);
    v19;
    const v20 = 'Server running at http://127.0.0.1:' + port;
    const v21 = console.log(v20);
    v21;
    const v22 = 'the dir is: "' + dir;
    const v23 = v22 + '"';
    const v24 = console.log(v23);
    v24;
};
exports.start = start;