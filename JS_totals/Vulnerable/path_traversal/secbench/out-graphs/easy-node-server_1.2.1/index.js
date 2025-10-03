var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mine = require('./lib/mine.json');
const getPara = function (url, paraName) {
    const v73 = paraName + '=(\\w+)';
    var reg = new RegExp(v73);
    var matches = url.match(reg);
    if (matches) {
        const v74 = matches[1];
        return v74;
    }
};
;
const createServer = function (config) {
    const v75 = {};
    config = config || v75;
    const v76 = config.assetPath;
    const v77 = path.resolve(__dirname, 'assets');
    var assetPath = v76 || v77;
    const v131 = function (request, response) {
        const v78 = request.headers;
        const v79 = v78.origin;
        const v80 = v79 || '*';
        const v81 = `${ v80 }`;
        const v82 = response.setHeader('Access-Control-Allow-Origin', v81);
        v82;
        const v83 = response.setHeader('Access-Control-Allow-Credentials', 'true');
        v83;
        const v84 = request.method;
        const v85 = v84 === 'OPTIONS';
        if (v85) {
            const v86 = response.setHeader('Access-Control-Allow-Methods', '*');
            v86;
            const v87 = response.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-requested-with,*');
            v87;
            const v88 = response.setHeader('Access-Control-Max-Age', '86400');
            v88;
            const v89 = response.writeHead(200);
            v89;
            const v90 = response.end();
            v90;
            return;
        }
        const v91 = console.log('---------------request from-----------------');
        v91;
        const v92 = request.url;
        const v93 = console.log(v92);
        v93;
        const v94 = request.url;
        const v95 = url.parse(v94);
        const v96 = v95.pathname;
        const v97 = v96.replace(/^\//, '');
        var pathname = v97 || 'index.html';
        var realPath = path.resolve(assetPath, pathname);
        var ext = path.extname(realPath);
        const v98 = ext.slice(1);
        if (ext) {
            ext = v98;
        } else {
            ext = 'unknown';
        }
        const v129 = function (exists) {
            const v99 = !exists;
            if (v99) {
                const v100 = mine.txt;
                const v101 = { 'Content-Type': v100 };
                const v102 = response.writeHead(404, v101);
                v102;
                const v103 = realPath + ' was not found on this server.';
                const v104 = response.write(v103);
                v104;
                const v105 = response.end();
                v105;
                return;
            }
            const v127 = function (err, file) {
                if (err) {
                    const v106 = mine.txt;
                    const v107 = { 'Content-Type': v106 };
                    const v108 = response.writeHead(500, v107);
                    v108;
                    const v109 = 'Cannot open ' + realPath;
                    const v110 = response.end(v109);
                    v110;
                } else {
                    const v111 = request.url;
                    var callback = getPara(v111, 'callback');
                    const v112 = mine[ext];
                    const v113 = mine.txt;
                    var contentType = v112 || v113;
                    const v114 = ext == 'json';
                    const v115 = v114 && callback;
                    if (v115) {
                        contentType = mine.js;
                    }
                    const v116 = { 'Content-Type': contentType };
                    const v117 = response.writeHead(200, v116);
                    v117;
                    const v118 = ext == 'json';
                    const v119 = v118 && callback;
                    if (v119) {
                        const v120 = callback + '(';
                        const v121 = response.write(v120);
                        v121;
                    }
                    const v122 = response.write(file, 'binary');
                    v122;
                    const v123 = ext == 'json';
                    const v124 = v123 && callback;
                    if (v124) {
                        const v125 = response.write(')');
                        v125;
                    }
                    const v126 = response.end();
                    v126;
                }
            };
            const v128 = fs.readFile(realPath, 'binary', v127);
            v128;
        };
        const v130 = fs.exists(realPath, v129);
        v130;
    };
    const v132 = http.createServer(v131);
    return v132;
};
;
const v133 = module.exports;
const v144 = function (config) {
    const v134 = {};
    config = config || v134;
    const v135 = createServer(config);
    const v136 = config.port;
    const v137 = v136 || 4444;
    const v142 = function () {
        const v138 = config.port;
        const v139 = v138 || 4444;
        const v140 = `服务启动成功，可以用浏览器访问：http://localhost:${ v139 } 确认\n`;
        const v141 = console.log(v140);
        v141;
    };
    const v143 = v135.listen(v137, v142);
    v143;
};
v133.start = v144;