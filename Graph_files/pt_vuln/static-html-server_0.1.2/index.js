var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var mnm = require('minimist');
const v48 = process.argv;
const v49 = v48.slice(2);
var argv = mnm(v49);
const v50 = argv.p;
var port = v50 || 7788;
const v51 = argv.r;
const v52 = process.cwd();
var root = v51 || v52;
var fallbackPath = argv.f;
const v53 = argv.h;
var help = v53 || false;
const v54 = argv.h;
if (v54) {
    const v55 = console.log('\nNODE STATIC SERVER');
    v55;
    const v56 = console.log('   Simple static web server.    \n   Author: Van-Duyet Le (me@duyetdev.com).     \n   Website: http://duyetdev.com');
    v56;
    const v57 = console.log('\nUsage:    \n    static-html-server -p [port] -r [root folder] -f [fallback path if not found]');
    v57;
    const v58 = console.log('\nArguments (all are optional):    \n    - p: [Number] port number, default to 8000    \n    - r: [String] root folder, default to working directory    \n    - f: [String] fallback path when page not found, default to not falling back and send 404\n\n');
    v58;
    const v59 = console.log('For example    \n    $ static-html-server -p 8899 -r ./ -f index.html    \n    Server running at http://localhost:8899/ [root: ./, fallback: index.html]\n');
    v59;
    const v60 = process.exit(1);
    v60;
}
if (fallbackPath) {
    fallbackPath = path.join(root, fallbackPath);
}
const v84 = function requestHandler(req, res) {
    const v61 = req.url;
    const v62 = url.parse(v61);
    var uriPath = v62.pathname;
    const v63 = unescape(uriPath);
    var filePath = path.join(root, v63);
    const v64 = 'Serving ' + uriPath;
    const v65 = console.log(v64);
    v65;
    const v66 = handle(filePath);
    v66;
    const handle = function (filePath, fallingback) {
        const v82 = function (err, stat) {
            if (err) {
                const v67 = err.code;
                const v68 = v67 == 'ENOENT';
                if (v68) {
                    const v69 = !fallingback;
                    const v70 = v69 && fallbackPath;
                    if (v70) {
                        const v71 = handle(fallbackPath, true);
                        return v71;
                    }
                    res.statusCode = 404;
                } else {
                    res.statusCode = 500;
                }
                const v72 = res.end();
                v72;
                const v73 = console.error(err);
                v73;
            } else {
                const v74 = stat.isDirectory();
                if (v74) {
                    const v75 = path.join(filePath, 'index.html');
                    const v76 = handle(v75);
                    v76;
                } else {
                    const v77 = path.extname(filePath);
                    var contentType = mime.lookup(v77);
                    const v78 = { 'Content-Type': contentType };
                    const v79 = res.writeHead(200, v78);
                    v79;
                    const v80 = fs.createReadStream(filePath);
                    const v81 = v80.pipe(res);
                    v81;
                }
            }
        };
        const v83 = fs.stat(filePath, v82);
        v83;
    };
};
const v85 = http.createServer(v84);
const v86 = v85.listen(port);
v86;
const v87 = 'Server running at http://localhost:' + port;
const v88 = v87 + '/';
const v89 = v88 + ' [root: ';
const v90 = v89 + root;
const v91 = v90 + ', fallback: ';
const v92 = v91 + fallbackPath;
const v93 = v92 + ']';
const v94 = console.log(v93);
v94;