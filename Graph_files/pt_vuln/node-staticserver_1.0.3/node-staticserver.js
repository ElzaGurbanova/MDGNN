'use strict';
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var util = require('./util.js');
var status = require('./json/status');
var mime = require('./json/mime');
var Server = function (req, res) {
    const v1 = Server.handle(req, res);
    v1;
};
Server.server = 'Node/V8';
Server.version = '1.0.0';
const init = function (options) {
    const v2 = typeof options;
    const v3 = v2 !== 'object';
    if (v3) {
        options = {};
    }
    const v4 = this.__proto__;
    v4.status = status;
    const v6 = util.transpose(mime);
    v5.mime = v6;
    const v7 = options.root;
    const v8 = v7 || '.';
    const v9 = path.resolve(v8);
    const v10 = path.normalize(v9);
    const v11 = options.index;
    const v12 = v11 || 'index.html';
    const v13 = options.method;
    const v14 = [
        'GET',
        'HEAD'
    ];
    const v15 = v13 || v14;
    const v16 = options.charset;
    const v17 = v16 || 'utf-8';
    const v18 = options.zip;
    const v19 = v18 || false;
    const v20 = options.cache;
    const v21 = v20 || 0;
    const v22 = options.header;
    const v23 = {};
    const v24 = v22 || v23;
    const v25 = {};
    v25.root = v10;
    v25.index = v12;
    v25.method = v15;
    v25.charset = v17;
    v25.zip = v19;
    v25.cache = v21;
    v25.header = v24;
    this.config = v25;
    return this;
};
Server.init = init;
const set = function (attribute, value) {
    const v26 = arguments.length;
    const v27 = v26 === 1;
    if (v27) {
        const v28 = this.config;
        const v29 = v28[attribute];
        v29;
    } else {
        const v30 = this.config;
        v30[attribute] = value;
    }
    switch (attribute) {
    case 'root':
        const v32 = this.config;
        const v33 = v32[attribute];
        const v34 = value || v33;
        const v35 = path.resolve(v34);
        const v36 = path.normalize(v35);
        v31[attribute] = v36;
        break;
    default:
    }
    return this;
};
Server.set = set;
const handle = function (req, res) {
    var me = this;
    var request = me.request(req);
    const v37 = me.config;
    const v38 = v37.method;
    const v39 = request.method;
    const v40 = v38.indexOf(v39);
    const v41 = -1;
    const v42 = v40 === v41;
    if (v42) {
        const v43 = me.response(res, 405);
        return v43;
    }
    const v44 = request.filename;
    const v101 = function (err, stats) {
        if (err) {
            const v45 = me.response(res, 404);
            v45;
        } else {
            const v46 = stats.isFile();
            if (v46) {
                const v47 = request.filename;
                const v48 = me.getContentType(v47);
                var header = {};
                header['Content-Type'] = v48;
                var cache = me.getCache(request, stats);
                const v49 = cache.ETag;
                const v50 = cache.Date;
                const v51 = cache.Expires;
                const v52 = cache.CacheControl;
                const v53 = cache.LastModified;
                const v54 = {
                    'ETag': v49,
                    'Date': v50,
                    'Expires': v51,
                    'Cache-Control': v52,
                    'Last-Modified': v53
                };
                header = util.merge(header, v54);
                const v55 = cache.modified;
                const v56 = !v55;
                if (v56) {
                    const v57 = me.response(res, 304, header);
                    v57;
                }
                const v58 = request.range;
                if (v58) {
                    const v59 = request.range;
                    const v60 = stats.size;
                    var range = me.getRange(v59, v60);
                    const v61 = -1;
                    const v62 = range !== v61;
                    const v63 = -2;
                    const v64 = range !== v63;
                    const v65 = v62 && v64;
                    if (v65) {
                        const v66 = range.AcceptRanges;
                        const v67 = range[0];
                        const v68 = v67.ContentRange;
                        const v69 = range[0];
                        const v70 = v69.ContentLength;
                        const v71 = {
                            'Accept-Ranges': v66,
                            'Content-Range': v68,
                            'Content-Length': v70
                        };
                        header = util.merge(header, v71);
                        const v72 = request.filename;
                        const v73 = range[0];
                        const v74 = {
                            file: v72,
                            range: v73
                        };
                        const v75 = me.stream(res, v74);
                        v75;
                        const v76 = me.response(res, 206, header);
                        v76;
                    } else {
                        const v77 = request.header;
                        const v78 = v77['Content-Range'];
                        const v79 = { 'Content-Range': v78 };
                        const v80 = me.response(res, 416, v79);
                        v80;
                    }
                } else {
                    const v81 = request.acceptEncoding;
                    var gzip = me.getGzip(v81);
                    const v82 = -1;
                    const v83 = gzip !== v82;
                    const v84 = -2;
                    const v85 = gzip !== v84;
                    const v86 = v83 && v85;
                    if (v86) {
                        const v87 = stats.size;
                        const v88 = {
                            'Content-Encoding': gzip,
                            'Transfer-Encoding': 'chunked',
                            'Content-Length': v87
                        };
                        header = util.merge(header, v88);
                    }
                    const v89 = me.response(res, 200, header);
                    v89;
                    const v90 = request.filename;
                    const v91 = {
                        file: v90,
                        gzip: gzip
                    };
                    const v92 = me.stream(res, v91);
                    v92;
                }
            } else {
                const v93 = stats.isDirectory();
                if (v93) {
                    const v94 = req.url;
                    const v95 = url.parse(v94);
                    const v96 = v95.pathname;
                    const v97 = v96 + '/';
                    const v98 = { 'Location': v97 };
                    const v99 = me.response(res, 301, v98);
                    v99;
                } else {
                    const v100 = me.response(res, 400);
                    v100;
                }
            }
        }
    };
    const v102 = fs.stat(v44, v101);
    v102;
    return me;
};
Server.handle = handle;
const stream = function (res, options) {
    var file = options.file;
    var range = options.range;
    var gzip = options.gzip;
    const v103 = range.start;
    const v104 = isNaN(v103);
    const v105 = !v104;
    const v106 = range && v105;
    const v107 = range.end;
    const v108 = isNaN(v107);
    const v109 = !v108;
    const v110 = v106 && v109;
    if (v110) {
        const v111 = range.start;
        const v112 = range.end;
        const v113 = {
            start: v111,
            end: v112
        };
        const v114 = fs.createReadStream(file, v113);
        const v115 = v114.pipe(res);
        v115;
    } else {
        var stream = fs.createReadStream(file);
        const v116 = gzip === 'gzip';
        if (v116) {
            const v117 = zlib.createGzip();
            const v118 = stream.pipe(v117);
            const v119 = v118.pipe(res);
            v119;
        } else {
            const v120 = gzip === 'deflate';
            if (v120) {
                const v121 = zlib.createDeflate();
                const v122 = stream.pipe(v121);
                const v123 = v122.pipe(res);
                v123;
            } else {
                const v124 = stream.pipe(res);
                v124;
            }
        }
    }
};
Server.stream = stream;
const v166 = function (str, size) {
    let index;
    const v125 = str.indexOf('=');
    const v126 = -1;
    if (str) {
        index = v125;
    } else {
        index = v126;
    }
    const v127 = -1;
    const v128 = index === v127;
    if (v128) {
        const v129 = -2;
        return v129;
    }
    const v130 = index + 1;
    const v131 = str.slice(v130);
    var arr = v131.split(',');
    var ranges = [];
    const v132 = str.slice(0, index);
    ranges.AcceptRanges = v132;
    var i = 0;
    const v133 = arr.length;
    let v134 = i < v133;
    while (v134) {
        const v136 = arr[i];
        var range = v136.split('-');
        const v137 = range[0];
        var start = parseInt(v137, 10);
        const v138 = range[1];
        var end = parseInt(v138, 10);
        const v139 = isNaN(start);
        if (v139) {
            start = size - end;
            end = size - 1;
        } else {
            const v140 = isNaN(end);
            if (v140) {
                end = size - 1;
            }
        }
        const v141 = size - 1;
        const v142 = end > v141;
        if (v142) {
            end = size - 1;
        }
        const v143 = isNaN(start);
        const v144 = !v143;
        const v145 = isNaN(end);
        const v146 = !v145;
        const v147 = v144 && v146;
        const v148 = start >= 0;
        const v149 = v147 && v148;
        const v150 = start <= end;
        const v151 = v149 && v150;
        if (v151) {
            const v152 = ranges.AcceptRanges;
            const v153 = v152 + ' ';
            const v154 = v153 + start;
            const v155 = v154 + '-';
            const v156 = v155 + end;
            const v157 = v156 + '/';
            const v158 = v157 + size;
            const v159 = end - start;
            const v160 = v159 + 1;
            const v161 = {
                ContentRange: v158,
                ContentLength: v160,
                start: start,
                end: end
            };
            const v162 = ranges.push(v161);
            v162;
        }
        const v135 = i++;
        v134 = i < v133;
    }
    const v163 = ranges.length;
    const v164 = v163 < 1;
    if (v164) {
        const v165 = -1;
        return v165;
    }
    return ranges;
};
Server.getRange = v166;
const v180 = function (gzips) {
    const v167 = !gzips;
    if (v167) {
        const v168 = new TypeError('name argument is required');
        throw v168;
    }
    const v169 = this.config;
    const v170 = v169.zip;
    const v171 = !v170;
    if (v171) {
        const v172 = -2;
        return v172;
    }
    const v173 = gzips.indexOf('gzip');
    const v174 = -1;
    const v175 = v173 !== v174;
    if (v175) {
        return 'gzip';
    } else {
        const v176 = gzips.indexOf('deflate');
        const v177 = -1;
        const v178 = v176 !== v177;
        if (v178) {
            return 'deflate';
        } else {
            const v179 = -1;
            return v179;
        }
    }
};
Server.getGzip = v180;
const v211 = function (request, stats) {
    const v181 = this.config;
    const v182 = v181.cache;
    const v183 = !v182;
    if (v183) {
        const v184 = this.config;
        v184.cache = 0;
    }
    var date = new Date();
    var expires = new Date();
    var cache = {};
    const v185 = stats.size;
    var size = v185.toString(16);
    const v186 = stats.mtime;
    const v187 = v186.getTime();
    var mtime = v187.toString(16);
    var IfModifiedSince = request.IfModifiedSince;
    var IfNoneMatch = request.IfNoneMatch;
    const v188 = expires.getTime();
    const v189 = this.config;
    const v190 = v189.cache;
    const v191 = v190 * 1000;
    const v192 = v188 + v191;
    const v193 = expires.setTime(v192);
    v193;
    const v194 = size + '-';
    const v195 = v194 + mtime;
    const v196 = date.toUTCString();
    const v197 = expires.toUTCString();
    const v198 = stats.mtime;
    const v199 = v198.toUTCString();
    var cache = {};
    cache.ETag = v195;
    cache.Date = v196;
    cache.Expires = v197;
    cache.CacheControl = 'no-cache';
    cache.LastModified = v199;
    cache.modified = false;
    const v200 = this.config;
    const v201 = v200.cache;
    const v202 = v201 > 0;
    if (v202) {
        const v203 = this.config;
        const v204 = v203.cache;
        const v205 = v204 * 1000;
        cache.CacheControl = 'max-age=' + v205;
    }
    const v206 = cache.LastModified;
    const v207 = IfModifiedSince !== v206;
    const v208 = cache.ETag;
    const v209 = IfNoneMatch !== v208;
    const v210 = v207 || v209;
    if (v210) {
        cache.modified = true;
    }
    return cache;
};
Server.getCache = v211;
const v223 = function (filename) {
    const v212 = path.extname(filename);
    const v213 = v212.slice(1);
    var ext = v213.toLowerCase();
    let mime;
    const v214 = this.mime;
    const v215 = v214[ext];
    const v216 = this.mime;
    const v217 = v216[ext];
    if (v215) {
        mime = v217;
    } else {
        mime = 'text/plain';
    }
    var charset = '';
    const v218 = mime.indexOf('text');
    const v219 = v218 === 0;
    if (v219) {
        const v220 = this.config;
        const v221 = v220.charset;
        charset = ';charset=' + v221;
    }
    const v222 = mime + charset;
    return v222;
};
Server.getContentType = v223;
const request = function (req, callback) {
    var request = {};
    const v224 = this.request;
    v224.__proto__ = req;
    const v225 = this.request;
    const v226 = v225.getHeader('Referer');
    request.referer = v226;
    const v227 = this.request;
    const v228 = v227.getHeader('Accept-Encoding');
    request.acceptEncoding = v228;
    const v229 = request.acceptEncoding;
    if (v229) {
        const v230 = request.acceptEncoding;
        const v231 = v230.split(',');
        request.acceptEncoding = v231;
    } else {
        request.acceptEncoding = [];
    }
    const v232 = this.request;
    const v233 = v232.getHeader('Range');
    request.range = v233;
    const v234 = req.method;
    request.method = v234;
    const v235 = this.request;
    const v236 = v235.getHeader('If-Modified-Since');
    request.IfModifiedSince = v236;
    const v237 = this.request;
    const v238 = v237.getHeader('If-None-Match');
    request.IfNoneMatch = v238;
    const v239 = req.url;
    const v240 = url.parse(v239);
    var pathname = v240.pathname;
    pathname = decodeURI(pathname);
    const v241 = -1;
    const v242 = pathname.slice(v241);
    const v243 = v242 === '/';
    if (v243) {
        const v244 = this.config;
        const v245 = v244.index;
        pathname = path.join(pathname, v245);
    }
    const v246 = this.config;
    const v247 = v246.root;
    const v248 = path.join(v247, pathname);
    request.filename = v248;
    const v249 = callback(request);
    const v250 = callback && v249;
    v250;
    return request;
};
Server.request = request;
const v251 = Server.request;
const v263 = function (name) {
    const v252 = !name;
    if (v252) {
        const v253 = new TypeError('name argument is required');
        throw v253;
    }
    const v254 = typeof name;
    const v255 = v254 !== 'string';
    if (v255) {
        const v256 = new TypeError('name must be a string');
        throw v256;
    }
    var name = name.toLowerCase();
    switch (name) {
    case 'referer':
        const v257 = this.headers;
        const v258 = v257.referer;
        return v258;
        break;
    case 'referrer':
        const v259 = this.headers;
        const v260 = v259.referrer;
        return v260;
        break;
    default:
        const v261 = this.headers;
        const v262 = v261[name];
        return v262;
        break;
    }
};
v251.getHeader = v263;
const response = function (res, status, header, callback) {
    const v264 = this.response;
    v264.__proto__ = res;
    const v265 = typeof header;
    const v266 = v265 === 'object';
    const v267 = {};
    if (v266) {
        header = header;
    } else {
        header = v267;
    }
    const v268 = this.server;
    header['Server'] = v268;
    const v269 = this.config;
    const v270 = v269.header;
    header = util.merge(v270, header);
    const v271 = status === 200;
    const v272 = status === 206;
    const v273 = v271 || v272;
    if (v273) {
        const v274 = res.writeHead(status, header);
        v274;
    } else {
        const v275 = res.writeHead(status, header);
        v275;
        const v276 = this.status;
        const v277 = v276[status];
        const v278 = res.end(v277);
        v278;
    }
    const v279 = this.response;
    const v280 = callback(v279);
    const v281 = callback && v280;
    v281;
    const v282 = this.response;
    return v282;
};
Server.response = response;
const listen = function () {
    var server = http.createServer(this);
    const v283 = server.listen;
    const v284 = v283.apply(server, arguments);
    return v284;
};
Server.listen = listen;
const v286 = function (options) {
    const v285 = Server.init(options);
    v285;
    return Server;
};
module.exports = v286;
exports = module.exports;