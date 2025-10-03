var http = require('http');
var path = require('path');
var fs = require('fs');
const v1 = process.cwd();
var config = {};
config.dir = v1;
const v2 = config.dir;
const v3 = console.log('\tAsset server using dir', v2);
v3;
const setCwd = function (dir) {
    config.dir = dir;
    const v4 = config.dir;
    const v5 = console.log('\tAsset server now using dir', v4);
    v5;
};
var loadFile = function (file, ifNoneMatch, callback) {
    const v6 = config.dir;
    file = path.join(v6, file);
    const v21 = function (err, stat) {
        if (err) {
            const v7 = callback(err, null);
            return v7;
        }
        const v8 = stat.size;
        const v9 = '"' + v8;
        const v10 = v9 + '-';
        const v11 = stat.mtime;
        const v12 = v11.getTime();
        const v13 = v10 + v12;
        var thisEtag = v13 + '"';
        const v14 = ifNoneMatch == thisEtag;
        const v15 = ifNoneMatch && v14;
        if (v15) {
            const v16 = callback(null, true, thisEtag);
            return v16;
        }
        const v19 = function (err, data) {
            let v17;
            if (err) {
                v17 = null;
            } else {
                v17 = data;
            }
            const v18 = callback(err, v17, false, thisEtag);
            v18;
        };
        const v20 = fs.readFile(file, v19);
        v20;
    };
    const v22 = fs.stat(file, v21);
    v22;
};
var server = http.createServer(handleRequest);
server.loadFile = loadFile;
server.setCwd = setCwd;
module.exports = server;
const handleRequest = function (req, res) {
    const v23 = req.url;
    const v24 = req.headers;
    const v25 = v24['if-none-match'];
    const v47 = function (err, body, notModified, etag) {
        var status;
        if (err) {
            const v26 = console.error(err);
            v26;
            if (notModified) {
                status = 304;
            } else {
                status = 404;
            }
        } else {
            if (notModified) {
                status = 304;
            } else {
                status = 200;
            }
        }
        var ct = '';
        const v27 = req.url;
        const v28 = v27.indexOf('.css');
        const v29 = -1;
        const v30 = v28 !== v29;
        if (v30) {
            ct = 'text/css';
        } else {
            const v31 = req.url;
            const v32 = v31.indexOf('.js');
            const v33 = -1;
            const v34 = v32 !== v33;
            if (v34) {
                ct = 'text/javascript';
            } else {
                const v35 = req.url;
                const v36 = v35.indexOf('.html');
                const v37 = -1;
                const v38 = v36 !== v37;
                if (v38) {
                    ct = 'text/html';
                } else {
                    const v39 = req.url;
                    const v40 = v39.indexOf('.png');
                    const v41 = -1;
                    const v42 = v40 !== v41;
                    if (v42) {
                        ct = 'image/png';
                    }
                }
            }
        }
        const v43 = {
            'content-type': ct,
            'cache-control': 'must-revalidate,private',
            'etag': etag
        };
        const v44 = res.writeHead(status, v43);
        v44;
        if (notModified) {
            const v45 = res.end();
            v45;
        } else {
            const v46 = res.end(body);
            v46;
        }
    };
    const v48 = loadFile(v23, v25, v47);
    v48;
};