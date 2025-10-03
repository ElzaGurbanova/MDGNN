var http = require('http');
var fs = require('fs');
var cwd = process.cwd();
var mime = require('mime');
const v97 = function (options) {
    const v50 = {};
    options = options || v50;
    const v51 = options.port;
    options.port = v51 || 8080;
    const v89 = function (request, response) {
        const v52 = request.url;
        var match = v52.match(/(^[^\?]*).*/);
        const v53 = match[1];
        var filePath = cwd + v53;
        const v54 = filePath.match(/\.[^\/]+$/);
        const v55 = !v54;
        if (v55) {
            const v56 = request.method;
            const v57 = v56 === 'GET';
            if (v57) {
                filePath += '.json';
            } else {
                const v58 = request.method;
                const v59 = '_' + v58;
                filePath += v59 + '.json';
            }
        }
        const v60 = fs.existsSync(filePath);
        if (v60) {
            var stat = fs.statSync(filePath);
            const v61 = stat.size;
            var headers = {};
            headers['Content-Type'] = 'text/json';
            headers['Content-Length'] = v61;
            var contentType = mime.lookup(filePath);
            if (contentType) {
                headers['Content-Type'] = contentType;
            }
            const v62 = options.cors;
            if (v62) {
                headers['Access-Control-Allow-Origin'] = '*';
            }
            const v63 = filePath.match(/.*\.json/);
            if (v63) {
                var statusCode = 200;
                var _headers = {};
                const v76 = function (err, data) {
                    var content = data;
                    var match = data.match(/\*({[^}]*})\s*\n(.*)/);
                    if (match) {
                        try {
                            const v64 = match[1];
                            var meta = JSON.parse(v64);
                            const v65 = meta.code;
                            statusCode = v65 || 200;
                            const v66 = meta.headers;
                            const v67 = {};
                            headers = v66 || v67;
                        } catch (e) {
                            const v68 = 'invalid meta data for ' + filePath;
                            const v69 = v68 + ': ';
                            const v70 = v69 + e;
                            const v71 = console.log(v70);
                            v71;
                        }
                        content = match[2];
                    }
                    let name;
                    for (name in _headers) {
                        const v72 = _headers[_name];
                        headers[name] = v72;
                    }
                    const v73 = response.writeHead(statusCode, headers);
                    v73;
                    const v74 = response.write(content);
                    v74;
                    const v75 = response.end();
                    v75;
                };
                const v77 = fs.readFile(filePath, 'utf8', v76);
                v77;
            } else {
                const v78 = response.writeHead(200, headers);
                v78;
                var readStream = fs.createReadStream(filePath);
                const v80 = function (data) {
                    const v79 = response.write(data);
                    v79;
                };
                const v81 = readStream.on('data', v80);
                v81;
                const v83 = function () {
                    const v82 = response.end();
                    v82;
                };
                const v84 = readStream.on('end', v83);
                v84;
            }
        } else {
            const v85 = {};
            const v86 = response.writeHead(404, v85);
            v86;
            const v87 = response.write(filePath);
            v87;
            const v88 = response.end();
            v88;
        }
    };
    const v90 = http.createServer(v89);
    this.server = v90;
    const v91 = this.server;
    const v92 = options.port;
    const v93 = v91.listen(v92);
    v93;
    const v94 = options.port;
    const v95 = 'server started on port: ' + v94;
    const v96 = console.log(v95);
    v96;
};
const v98 = {};
v98.start = v97;
module.exports = v98;