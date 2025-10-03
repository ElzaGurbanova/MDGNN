var fs = require('fs');
var getMime = require('./mime.js');
var path = require('path');
const v130 = function (res) {
    const v79 = function () {
        var filepath;
        var types = [
            '.html',
            '.htm'
        ];
        var i = 0;
        var t;
        while (t = types[i]) {
            const v67 = res.config;
            const v68 = v67.basename;
            const v69 = '/index' + t;
            const v70 = path.join(v68, v69);
            const v71 = fs.existsSync(v70);
            if (v71) {
                const v72 = res.config;
                const v73 = v72.basename;
                const v74 = '/index' + t;
                filepath = path.join(v73, v74);
                break;
            }
            const v66 = i++;
        }
        const v75 = res.config;
        const v76 = v75.basename;
        const v77 = path.join(v76, '/index');
        filepath = filepath || v77;
        const v78 = res.sendfile(filepath);
        v78;
    };
    res.index = v79;
    const v122 = function (filepath) {
        const v80 = fs.existsSync(filepath);
        if (v80) {
            var stat = fs.statSync(filepath);
            const v81 = path.extname(filepath);
            var mime = getMime(v81);
            const v82 = stat['mtime'];
            const v83 = v82.toGMTString();
            const v84 = v83 + '&size:';
            const v85 = stat['size'];
            const v86 = v84 + v85;
            const v87 = [v86];
            var tag = JSON.stringify(v87);
            const v88 = res.setHeader('Etag', tag);
            v88;
            const v89 = stat['mtime'];
            const v90 = v89.toGMTString();
            const v91 = res.setHeader('Last-Modified', v90);
            v91;
            const v92 = res.config;
            const v93 = v92.cache_key;
            const v94 = console.log(v93);
            v94;
            const v95 = res.head;
            const v96 = v95['if-none-match'];
            const v97 = res.head;
            const v98 = v97['if-none-match'];
            const v99 = v98 === tag;
            const v100 = v96 && v99;
            if (v100) {
                const v101 = console.log(1);
                v101;
                const v102 = { 'Content-Type': mime };
                const v103 = res.writeHead(304, v102);
                v103;
                const v104 = res.end();
                v104;
            } else {
                const v105 = { 'Content-Type': mime };
                const v106 = res.writeHead(200, v105);
                v106;
                const v107 = res.config;
                const v108 = v107.cache_key;
                v108[filepath] = tag;
                const v109 = { encoding: 'binary' };
                var readstream = fs.createReadStream(filepath, v109);
                var file = '';
                const v111 = function (chunk) {
                    const v110 = res.write(chunk, 'binary');
                    v110;
                };
                const v112 = readstream.on('data', v111);
                v112;
                const v114 = function () {
                    const v113 = res.end();
                    v113;
                };
                const v115 = readstream.on('error', v114);
                v115;
                const v116 = function () {
                };
                const v117 = readstream.on('close', v116);
                v117;
                const v119 = function () {
                    const v118 = res.end();
                    v118;
                };
                const v120 = readstream.on('end', v119);
                v120;
            }
        } else {
            const v121 = res.notFound();
            v121;
        }
    };
    res.sendfile = v122;
    const v129 = function (message) {
        const v123 = path.extname(message);
        if (v123) {
            const v124 = res.sendfile(message);
            v124;
        } else {
            const v125 = { 'Content-Type': 'text/html,charset=utf-8' };
            const v126 = res.writeHead(404, v125);
            v126;
            const v127 = message || '<h1>404 Not Found</h1>';
            const v128 = res.end(v127);
            v128;
        }
    };
    res.notFound = v129;
};
module.exports = v130;
exports = module.exports;