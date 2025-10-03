'use strict';
var fs = require('fs');
var url = require('url');
var crypto = require('crypto');
const v75 = require('../debug');
const v76 = process.env;
const v77 = v76.QUIET;
const v78 = v77 === 'true';
var debug = v75(v78);
const v148 = function (options) {
    const v79 = {};
    options = options || v79;
    var _seed = Math.random();
    const v80 = options.cacheExpiration;
    var _expirationTime = v80 || 60;
    var _handler = function (req, res, next) {
        const v81 = req.url;
        var resource = url.parse(v81);
        const v82 = resource.pathname;
        var resourcePathname = v82 || '/';
        const v83 = resourcePathname.replace(/\/\.\./, '');
        resourcePathname = v83.replace(/\.\.\//, '');
        const v84 = process.cwd();
        var filePath = v84 + resourcePathname;
        const v85 = filePath.length;
        const v86 = v85 - 1;
        const v87 = filePath[v86];
        const v88 = v87 === '/';
        if (v88) {
            filePath += 'index.html';
        }
        var startTime = process.hrtime();
        const v130 = function (err, stat) {
            if (err) {
                const v89 = next(err);
                return v89;
            }
            const v90 = crypto.createHash('md5');
            const v91 = stat.ctime;
            const v92 = stat.ctime;
            const v93 = v92.getTime();
            const v94 = v91 && v93;
            const v95 = [
                _seed,
                filePath,
                v94
            ];
            const v96 = v95.join('');
            const v97 = new Buffer(v96);
            const v98 = v90.update(v97);
            var uniqueHash = v98.digest('hex');
            const v99 = 'W/"' + uniqueHash;
            var eTag = v99 + '"';
            const v100 = req.headers;
            const v101 = {};
            var headers = v100 || v101;
            const v102 = headers['if-none-match'];
            var matchETag = v102 === eTag;
            const v103 = headers['if-modified-since'];
            const v104 = new Date(v103);
            const v105 = v104.getTime();
            const v106 = Date.now();
            const v107 = v105 - v106;
            var matchExpiration = v107 >= 0;
            const v108 = res.setHeader('ETag', eTag);
            v108;
            const v109 = matchExpiration && matchETag;
            if (v109) {
                const v110 = res.writeHead(304);
                v110;
                const v111 = res.end();
                v111;
                return;
            }
            const v112 = Date.now();
            const v113 = _expirationTime * 1000;
            const v114 = v112 + v113;
            const v115 = new Date(v114);
            const v116 = res.setHeader('Last-Modified', v115);
            v116;
            const v117 = 'max-age=' + _expirationTime;
            const v118 = res.setHeader('Cache-Control', v117);
            v118;
            var readStream = fs.createReadStream(filePath);
            const v120 = function () {
                const v119 = readStream.pipe(res);
                v119;
            };
            const v121 = readStream.on('open', v120);
            v121;
            const v128 = function (err) {
                const v122 = err.code;
                const v123 = v122 === 'ENOENT';
                const v124 = err && v123;
                if (v124) {
                    const v125 = next();
                    return v125;
                } else {
                    const v126 = res.writeHead(500);
                    v126;
                    const v127 = res.end();
                    v127;
                }
            };
            const v129 = readStream.on('error', v128);
            v129;
        };
        const v131 = fs.stat(filePath, v130);
        v131;
        const v145 = function () {
            var deltaTime = process.hrtime(startTime);
            const v132 = res.statusCode;
            const v133 = req.method;
            const v134 = req.url;
            const v135 = deltaTime[0];
            const v136 = v135 * 1000000000;
            const v137 = deltaTime[1];
            const v138 = v136 + v137;
            const v139 = v138 / 1000000;
            const v140 = Math.ceil(v139);
            const v141 = v140 + 'ms';
            const v142 = [
                v132,
                v133,
                v134,
                v141
            ];
            const v143 = v142.join(' ');
            const v144 = debug.log(v143);
            v144;
        };
        const v146 = res.on('finish', v145);
        v146;
    };
    const v147 = function () {
        _seed = Math.random();
    };
    _handler.reset = v147;
    return _handler;
};
module.exports = v148;