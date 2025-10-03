'use strict';
var _http = require('http');
var _http2 = _interopRequireDefault(_http);
var _path = require('path');
var _path2 = _interopRequireDefault(_path);
var _url = require('url');
var _url2 = _interopRequireDefault(_url);
var _fs = require('fs');
var _fs2 = _interopRequireDefault(_fs);
const _interopRequireDefault = function (obj) {
    const v41 = obj.__esModule;
    const v42 = obj && v41;
    const v43 = { default: obj };
    let v44;
    if (v42) {
        v44 = obj;
    } else {
        v44 = v43;
    }
    return v44;
};
const v45 = process.argv;
const v46 = v45.length;
const v47 = v46 < 3;
if (v47) {
    const v48 = console.log('\nUsage: \n\t$ node gamebutler.js path/to/index.html\n');
    v48;
    const v49 = process.exit();
    v49;
}
const v50 = _path2.default;
const v51 = process.argv;
const v52 = v51[2];
var ENTRY = v50.resolve(v52);
const v53 = _path2.default;
var BASE = v53.dirname(ENTRY);
var PORT = 8080;
const v54 = _http2.default;
const v77 = function (request, response) {
    const v55 = _url2.default;
    const v56 = request.url;
    const v57 = v55.parse(v56);
    const v58 = v57.pathname;
    var uri = v58.replace('%20', ' ');
    const v59 = _path2.default;
    var filename = v59.join(BASE, uri);
    const v60 = _fs2.default;
    const v75 = function (err, status) {
        const v61 = err != null;
        if (v61) {
            const v62 = { 'Content-Type': 'text/plain' };
            const v63 = response.writeHead(200, v62);
            v63;
            const v64 = response.write('404');
            v64;
            const v65 = response.end();
            v65;
        } else {
            const v66 = status.isDirectory();
            if (v66) {
                filename = ENTRY;
            }
            const v67 = _path2.default;
            const v68 = v67.extname(filename);
            const v69 = v68.split('.');
            var ext = v69[1];
            var mimeType = '';
            switch (ext) {
            case 'html':
                mimeType = 'text/html';
                break;
            case 'jpg':
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'js':
                mimeType = 'text/javascript';
                break;
            case 'css':
                mimeType = 'text/css';
                break;
            }
            const v70 = { 'Content-Type': mimeType };
            const v71 = response.writeHead(200, v70);
            v71;
            const v72 = _fs2.default;
            var fileStream = v72.createReadStream(filename);
            const v73 = fileStream.pipe(response);
            v73;
            const v74 = console.log('- %s', filename);
            v74;
        }
    };
    const v76 = v60.stat(filename, v75);
    v76;
};
const v78 = v54.createServer(v77);
const v80 = function () {
    const v79 = console.log('GameButler listening on: http://localhost:%s', PORT);
    v79;
};
var server = v78.listen(PORT, v80);