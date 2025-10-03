var fs = require('fs');
var getMime = require('./mime.js');
var path = require('path');
const v140 = function (res) {
    const v75 = function (arr) {
        const v71 = { 'Content-Type': 'application/json' };
        const v72 = res.writeHead(200, v71);
        v72;
        const v73 = JSON.stringify(arr);
        const v74 = res.end(v73);
        v74;
    };
    res.json = v75;
    const v89 = function () {
        var filepath;
        var types = [
            '.html',
            '.htm'
        ];
        var i = 0;
        var t;
        while (t = types[i]) {
            const v77 = res.config;
            const v78 = v77.basename;
            const v79 = '/index' + t;
            const v80 = path.join(v78, v79);
            const v81 = fs.existsSync(v80);
            if (v81) {
                const v82 = res.config;
                const v83 = v82.basename;
                const v84 = '/index' + t;
                filepath = path.join(v83, v84);
                break;
            }
            const v76 = i++;
        }
        const v85 = res.config;
        const v86 = v85.basename;
        const v87 = path.join(v86, '/index');
        filepath = filepath || v87;
        const v88 = res.sendfile(filepath);
        v88;
    };
    res.index = v89;
    const v132 = function (filepath) {
        const v90 = fs.existsSync(filepath);
        if (v90) {
            var stat = fs.statSync(filepath);
            const v91 = path.extname(filepath);
            var mime = getMime(v91);
            const v92 = stat['mtime'];
            const v93 = v92.toGMTString();
            const v94 = v93 + '&size:';
            const v95 = stat['size'];
            const v96 = v94 + v95;
            const v97 = [v96];
            var tag = JSON.stringify(v97);
            const v98 = res.setHeader('Etag', tag);
            v98;
            const v99 = stat['mtime'];
            const v100 = v99.toGMTString();
            const v101 = res.setHeader('Last-Modified', v100);
            v101;
            const v102 = res.config;
            const v103 = v102.cache_key;
            const v104 = console.log(v103);
            v104;
            const v105 = res.head;
            const v106 = v105['if-none-match'];
            const v107 = res.head;
            const v108 = v107['if-none-match'];
            const v109 = v108 === tag;
            const v110 = v106 && v109;
            if (v110) {
                const v111 = console.log(1);
                v111;
                const v112 = { 'Content-Type': mime };
                const v113 = res.writeHead(304, v112);
                v113;
                const v114 = res.end();
                v114;
            } else {
                const v115 = { 'Content-Type': mime };
                const v116 = res.writeHead(200, v115);
                v116;
                const v117 = res.config;
                const v118 = v117.cache_key;
                v118[filepath] = tag;
                const v119 = { encoding: 'binary' };
                var readstream = fs.createReadStream(filepath, v119);
                var file = '';
                const v121 = function (chunk) {
                    const v120 = res.write(chunk, 'binary');
                    v120;
                };
                const v122 = readstream.on('data', v121);
                v122;
                const v124 = function () {
                    const v123 = res.end();
                    v123;
                };
                const v125 = readstream.on('error', v124);
                v125;
                const v126 = function () {
                };
                const v127 = readstream.on('close', v126);
                v127;
                const v129 = function () {
                    const v128 = res.end();
                    v128;
                };
                const v130 = readstream.on('end', v129);
                v130;
            }
        } else {
            const v131 = res.notFound();
            v131;
        }
    };
    res.sendfile = v132;
    const v139 = function (message) {
        const v133 = path.extname(message);
        if (v133) {
            const v134 = res.sendfile(message);
            v134;
        } else {
            const v135 = { 'Content-Type': 'text/html,charset=utf-8' };
            const v136 = res.writeHead(404, v135);
            v136;
            const v137 = message || '<h1>404 Not Found</h1>';
            const v138 = res.end(v137);
            v138;
        }
    };
    res.notFound = v139;
};
module.exports = v140;
exports = module.exports;