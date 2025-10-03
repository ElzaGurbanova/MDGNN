var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var NodeStaticWebServer = function (contentPath, port, address) {
    this._contentPath = contentPath;
    this._port = port || 80;
    this._address = address;
    var self = this;
    const v2 = function (req, res) {
        const v1 = self._onCreateServer(req, res);
        v1;
    };
    const v3 = http.createServer(v2);
    const v4 = v3.listen(port, address);
    this._server = v4;
    const v5 = this._server;
    return v5;
};
const v6 = NodeStaticWebServer.prototype;
const v24 = function (request, response) {
    const v7 = request.headers;
    var host = v7.host;
    var self = this;
    const v8 = !host;
    if (v8) {
        const v9 = this._badHost(response);
        v9;
        return;
    }
    const v10 = request.url;
    const v11 = url.parse(v10);
    var uri = v11.pathname;
    const v12 = this._contentPath;
    var filename = path.join(v12, host, uri);
    const v13 = host.substr(0, 4);
    const v14 = v13.toLowerCase();
    const v15 = v14 === 'www.';
    if (v15) {
        const v16 = host.substr(4);
        const v17 = 'http://' + v16;
        const v18 = this._httpRedirect(response, v17);
        v18;
        return;
    }
    const v22 = function (filename, stats) {
        const v19 = request.headers;
        const v20 = v19['if-modified-since'];
        const v21 = self._responseFile(response, filename, stats, v20);
        v21;
    };
    const v23 = this._checkFile(filename, v22);
    v23;
};
v6._onCreateServer = v24;
const v25 = NodeStaticWebServer.prototype;
const v37 = function (filename, callback) {
    const v35 = function (err, stats) {
        const v26 = !stats;
        if (v26) {
            const v27 = callback();
            v27;
        } else {
            const v28 = stats.isDirectory();
            if (v28) {
                filename = path.join(filename, 'index.html');
                const v32 = function (err, stats) {
                    const v29 = !stats;
                    if (v29) {
                        const v30 = callback();
                        v30;
                    } else {
                        const v31 = callback(filename, stats);
                        v31;
                    }
                };
                const v33 = fs.stat(filename, v32);
                v33;
            } else {
                const v34 = callback(filename, stats);
                v34;
            }
        }
    };
    const v36 = fs.stat(filename, v35);
    v36;
};
v25._checkFile = v37;
const v38 = NodeStaticWebServer.prototype;
const v62 = function (response, filename, stats, lastModifiedSince) {
    const v39 = !filename;
    if (v39) {
        const v40 = this._httpNotFound(response);
        v40;
        return;
    }
    const v41 = stats.mtime;
    var lastModified = v41.toUTCString();
    const v42 = lastModifiedSince === lastModified;
    if (v42) {
        const v43 = { 'Last-Modified': lastModified };
        const v44 = response.writeHead(304, v43);
        v44;
        const v45 = response.end();
        v45;
        return;
    }
    var self = this;
    var readStream = fs.createReadStream(filename);
    const v53 = function () {
        const v46 = self.mime;
        const v47 = path.extname(filename);
        const v48 = v46[v47];
        const v49 = v48 || 'application/octet-stream';
        const v50 = stats.size;
        var headers = {};
        headers['Content-Type'] = v49;
        headers['Last-Modified'] = lastModified;
        headers['Content-Length'] = v50;
        const v51 = response.writeHead(200, headers);
        v51;
        const v52 = readStream.pipe(response);
        v52;
    };
    const v54 = readStream.on('open', v53);
    v54;
    const v60 = function (err) {
        const v55 = { 'Content-Type': 'text/plain' };
        const v56 = response.writeHead(500, v55);
        v56;
        const v57 = err + '\n';
        const v58 = response.write(v57);
        v58;
        const v59 = response.end();
        v59;
    };
    const v61 = readStream.on('error', v60);
    v61;
};
v38._responseFile = v62;
const v63 = NodeStaticWebServer.prototype;
const v68 = function (response) {
    const v64 = { 'Content-Type': 'text/plain' };
    const v65 = response.writeHead(434, v64);
    v65;
    const v66 = response.write('Requested host unavailable\n');
    v66;
    const v67 = response.end();
    v67;
};
v63._httpBadHost = v68;
const v69 = NodeStaticWebServer.prototype;
const v74 = function (response) {
    const v70 = { 'Content-Type': 'text/plain' };
    const v71 = response.writeHead(404, v70);
    v71;
    const v72 = response.write('Not found\n');
    v72;
    const v73 = response.end();
    v73;
};
v69._httpNotFound = v74;
const v75 = NodeStaticWebServer.prototype;
const v79 = function (response, location) {
    const v76 = { 'Location': location };
    const v77 = response.writeHead(301, v76);
    v77;
    const v78 = response.end();
    v78;
};
v75._httpRedirect = v79;
const v80 = NodeStaticWebServer.prototype;
const v81 = {};
v81['.html'] = 'text/html';
v81['.jpeg'] = 'image/jpeg';
v81['.jpg'] = 'image/jpeg';
v81['.png'] = 'image/png';
v81['.gif'] = 'image/gif';
v81['.css'] = 'text/css';
v81['.js'] = 'text/javascript';
v80.mime = v81;
module.exports = NodeStaticWebServer;