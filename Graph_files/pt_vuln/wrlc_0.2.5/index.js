var http = require('http');
var mime = require('mime');
var fs = require('fs');
var path = require('path');
var child = require('child_process');
var util = require('util');
const serve = function (options, callback) {
    const v59 = function (request, response) {
        const v43 = request.url;
        const v44 = v43 == '/';
        if (v44) {
            const v45 = response.setHeader('content-type', 'text/html');
            v45;
            const v46 = response.end('<!doctype html><head><meta charset="utf-8"></head><body><script src="index.js"></script></body></html>');
            v46;
        } else {
            const v47 = request.url;
            const v48 = v47 == '/index.js';
            if (v48) {
                var filename = options.outfile;
            } else {
                const v49 = process.cwd();
                const v50 = request.url;
                var filename = path.join(v49, v50);
            }
            const v57 = function (exists) {
                if (exists) {
                    const v51 = mime.lookup(filename);
                    const v52 = response.setHeader('content-type', v51);
                    v52;
                    const v53 = response.writeHead(200);
                    v53;
                    var file = fs.createReadStream(filename);
                    const v54 = file.pipe(response);
                    v54;
                } else {
                    const v55 = response.writeHead(404);
                    v55;
                    const v56 = response.end('404');
                    v56;
                }
            };
            const v58 = fs.exists(filename, v57);
            v58;
        }
    };
    var server = http.createServer(v59);
    const v60 = options.port;
    const v61 = options.host;
    const v62 = server.listen(v60, v61, callback);
    v62;
    return server;
};
const bundle = function (options, callback) {
    const v63 = options.bundler;
    const v64 = options.argv;
    var bundler = child.spawn(v63, v64);
    const v65 = options.outfile;
    var dirname = path.dirname(v65);
    const v66 = options.outfile;
    var basename = path.basename(v66);
    var timeout = [];
    const v73 = function (event, filename) {
        const v67 = basename == filename;
        if (v67) {
            const v68 = timeout[event];
            const v69 = !v68;
            if (v69) {
                const v70 = bundler.emit(event, filename);
                v70;
                const v71 = function () {
                    timeout[event] = null;
                };
                const v72 = setTimeout(v71, 600);
                timeout[event] = v72;
            }
        }
    };
    const v74 = fs.watch(dirname, v73);
    v74;
    return bundler;
};
const browse = function (options, callback) {
    const v75 = options.browser;
    const v76 = console.log(v75);
    v76;
    const v77 = options.browser;
    const v78 = options.host;
    const v79 = options.port;
    const v80 = util.format('http://%s:%d', v78, v79);
    const v81 = [v80];
    var browser = child.spawn(v77, v81);
    return browser;
};
const v82 = module.exports;
v82.serve = serve;
const v83 = module.exports;
v83.bundle = bundle;
const v84 = module.exports;
v84.browse = browse;