const v41 = console.time('[Airserver][Start]');
v41;
var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime');
var grunt = require('grunt');
var path = require('path');
var argvs = require('./argvs');
var logger = require('./log');
var main = function (req, res) {
    var reqUrl = req.url;
    const v42 = logger.http(req, res);
    v42;
    const v43 = url.parse(reqUrl);
    var pathName = v43.pathname;
    const v44 = path.extname(pathName);
    const v45 = v44 == '';
    if (v45) {
        const v46 = /\/$/.test(pathName);
        const v47 = !v46;
        if (v47) {
            pathName += '/';
        }
        pathName += argvs.getDefault();
    }
    const v48 = argvs.getPath();
    var filePath = path.join(v48, pathName);
    const v68 = function (exists) {
        try {
            if (exists) {
                const v49 = mime.lookup(filePath);
                const v50 = { 'Content-Type': v49 };
                const v51 = res.writeHead(200, v50);
                v51;
                const v52 = {
                    flags: 'r',
                    encoding: null
                };
                var stream = fs.createReadStream(filePath, v52);
                const v57 = function () {
                    const v53 = res.writeHead(404);
                    v53;
                    const v54 = '<h1>500 the file [path=' + filePath;
                    const v55 = v54 + '] Read Error!</h1>';
                    const v56 = res.end(v55);
                    v56;
                };
                const v58 = stream.on('error', v57);
                v58;
                const v59 = stream.pipe(res);
                v59;
            } else {
                const v60 = { 'Content-Type': 'text/html' };
                const v61 = res.writeHead(404, v60);
                v61;
                const v62 = '<h1>404 Not Found file [path=' + filePath;
                const v63 = v62 + ']</h1>';
                const v64 = res.end(v63);
                v64;
            }
        } catch (e) {
            const v65 = 'read file from [' + filePath;
            const v66 = v65 + '] error!';
            const v67 = logger.error(v66);
            v67;
        }
    };
    const v69 = fs.exists(filePath, v68);
    v69;
};
var server = http.createServer(main);
const v71 = function (error) {
    const v70 = logger.error(error);
    v70;
};
const v72 = server.on('error', v71);
v72;
const v73 = argvs.getPort();
const v79 = function () {
    const v74 = argvs.getPort();
    const v75 = '[Airserver][Start] running at http://localhost:' + v74;
    const v76 = v75 + '/';
    const v77 = console.log(v76);
    v77;
    const v78 = console.timeEnd('[Airserver][Start]');
    v78;
};
const v80 = server.listen(v73, v79);
v80;