'use strict';
var http = require('http');
var url = require('url');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
const v110 = function (port, root, wordy) {
    const v56 = wordy === undefined;
    if (v56) {
        wordy = false;
    }
    const v57 = port === undefined;
    if (v57) {
        port = 80;
    }
    const v106 = function (req, res) {
        const v58 = req.url;
        const v59 = url.parse(v58);
        var uri = v59.pathname;
        var filename = path.join(root, uri);
        const v60 = uri.length;
        const v61 = v60 - 1;
        const v62 = uri.charAt(v61);
        const v63 = v62 === '/';
        if (v63) {
            filename += 'index.html';
        }
        if (wordy) {
            const v64 = 'GET:' + uri;
            const v65 = v64 + ' -> ';
            const v66 = v65 + filename;
            const v67 = console.log(v66);
            v67;
        }
        const v104 = function (exists) {
            const v68 = !exists;
            if (v68) {
                if (wordy) {
                    const v69 = console.log('Error 404');
                    v69;
                }
                const v70 = { 'Content-Type': 'text/plain' };
                const v71 = res.writeHead(404, v70);
                v71;
                const v72 = res.end('Error 404');
                v72;
                return;
            }
            const v73 = fs.statSync(filename);
            const v74 = v73.isDirectory();
            const v75 = uri.length;
            const v76 = v75 - 1;
            const v77 = uri.charAt(v76);
            const v78 = v77 !== '/';
            const v79 = v74 && v78;
            if (v79) {
                if (wordy) {
                    const v80 = console.log('Redirection 303');
                    v80;
                }
                const v81 = uri + '/';
                const v82 = { 'Location': v81 };
                const v83 = res.writeHead(303, v82);
                v83;
                const v84 = 'Redirecting to: ' + uri;
                const v85 = v84 + '/';
                const v86 = res.end(v85);
                v86;
                return;
            }
            const v102 = function (err, file) {
                if (err) {
                    if (wordy) {
                        const v87 = console.log('Error 500');
                        v87;
                    }
                    const v88 = { 'Content-Type': 'text/plain' };
                    const v89 = res.writeHead(500, v88);
                    v89;
                    const v90 = res.end('Error 500');
                    v90;
                    return;
                }
                if (wordy) {
                    const v91 = console.log('Ok 200');
                    v91;
                }
                const v92 = mime.lookup(filename);
                const v93 = v92 + ';';
                const v94 = mime.charsets;
                const v95 = mime.lookup(filename);
                const v96 = v94.lookup(v95);
                const v97 = v93 + v96;
                const v98 = { 'Content-Type': v97 };
                const v99 = res.writeHead(200, v98);
                v99;
                const v100 = res.write(file, 'binary');
                v100;
                const v101 = res.end();
                v101;
            };
            const v103 = fs.readFile(filename, 'binary', v102);
            v103;
        };
        const v105 = fs.exists(filename, v104);
        v105;
    };
    var server = http.createServer(v106);
    const v107 = 'The server is now launch on: http://localhost:' + port;
    const v108 = console.log(v107);
    v108;
    const v109 = server.listen(port);
    v109;
    return server;
};
module.exports = v110;