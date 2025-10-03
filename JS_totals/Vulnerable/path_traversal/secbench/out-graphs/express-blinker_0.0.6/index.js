var fs = require('fs');
var path = require('path');
var MD5 = require('md5-file');
var async = require('async');
var mime = require('mime');
const v137 = require('debug');
var debug = v137('express-blinker');
const getTimedDateString = function (target) {
    let now;
    const v138 = typeof target;
    const v139 = v138 != 'undefined';
    const v140 = Date.now();
    const v141 = target + v140;
    const v142 = Date.now();
    if (v139) {
        now = v141;
    } else {
        now = v142;
    }
    var inst = new Date(now);
    var str = inst.toUTCString();
    return str;
};
const checkLastModified = function (data, cb) {
    const v143 = data._changed;
    if (v143) {
        const v144 = cb(null, data);
        return v144;
    }
    const v145 = data.req;
    const v146 = v145.headers;
    const v147 = 'if-modified-since' in v146;
    if (v147) {
        const v148 = data.file;
        const v158 = function (err, stats) {
            if (err) {
                const v149 = cb(err, data);
                return v149;
            }
            data.stats = stats;
            const v150 = data.req;
            const v151 = v150.headers;
            const v152 = v151['if-none-match'];
            const v153 = new Date(v152);
            var req_mtime = v153.getTime();
            const v154 = stats.mtime;
            const v155 = new Date(v154);
            var file_mtime = v155.getTime();
            const v156 = file_mtime > req_mtime;
            if (v156) {
                data._changed = true;
                data.status = 200;
            } else {
                data.status = 304;
            }
            const v157 = cb(null, data);
            v157;
        };
        const v159 = fs.stat(v148, v158);
        v159;
    } else {
        const v160 = cb(null, data);
        return v160;
    }
};
const checkETag = function (data, cb) {
    const v161 = data._changed;
    if (v161) {
        const v162 = cb(null, data);
        return v162;
    }
    const v163 = data.file;
    const v170 = function (err, msg) {
        if (err) {
            const v164 = cb(err, data);
            return v164;
        }
        data.hash = msg;
        const v165 = data.req;
        const v166 = v165.headers;
        const v167 = v166['if-none-match'];
        const v168 = v167 != msg;
        if (v168) {
            data._changed = true;
            data.status = 200;
        } else {
            data._changed = false;
            data.status = 304;
        }
        const v169 = cb(null, data);
        v169;
    };
    const v171 = MD5(v163, v170);
    v171;
};
const checkSanity = function (data, cb) {
    const v172 = data.options;
    const v173 = v172.etag;
    const v174 = !v173;
    const v175 = data.options;
    const v176 = v175.lastModified;
    const v177 = !v176;
    const v178 = v174 && v177;
    if (v178) {
        data._changed = true;
        data.status = 200;
    }
    const v179 = cb(null, data);
    v179;
};
const makeExpires = function (data, cb) {
    const v180 = data.headers;
    const v181 = data.options;
    const v182 = v181.age;
    const v183 = getTimedDateString(v182);
    const v184 = [
        'Expires',
        v183
    ];
    const v185 = v180.push(v184);
    v185;
    const v186 = cb(null, data);
    v186;
};
const makeCacheControl = function (data, cb) {
    var parts = [];
    const v187 = data.options;
    const v188 = v187.cacheKeywords;
    const v189 = v188 || 'public';
    const v190 = parts.push(v189);
    v190;
    const v191 = data.options;
    const v192 = v191.age;
    const v193 = 'max-age=' + v192;
    const v194 = parts.push(v193);
    v194;
    const v195 = data.headers;
    const v196 = parts.join(', ');
    const v197 = [
        'Cache-Control',
        v196
    ];
    const v198 = v195.push(v197);
    v198;
    const v199 = cb(null, data);
    v199;
};
const makeLastModified = function (data, cb) {
    var stats = data.stats;
    const v200 = stats.mtime;
    const v201 = new Date(v200);
    var dateStr = v201.toUTCString();
    const v202 = data.headers;
    const v203 = [
        'Last-Modified',
        dateStr
    ];
    const v204 = v202.push(v203);
    v204;
    const v205 = cb(null, data);
    v205;
};
const makeETag = function (data, cb) {
    const v206 = data.headers;
    const v207 = data.hash;
    const v208 = [
        'ETag',
        v207
    ];
    const v209 = v206.push(v208);
    v209;
    const v210 = cb(null, data);
    v210;
};
const Blinker = function (basePath, confs) {
    const v272 = function (req, res, next) {
        var options;
        let k;
        for (k in confs) {
            var segment = confs[k];
            const v211 = segment.test;
            const v212 = req.url;
            const v213 = v211.test(v212);
            if (v213) {
                options = segment;
                break;
            }
        }
        const v214 = req.url;
        var filePath = basePath + v214;
        const v221 = function fileExists(cb) {
            const v219 = function (exists) {
                if (exists) {
                    const v215 = cb(null, exists);
                    v215;
                } else {
                    const v216 = filePath + ' does not exist.';
                    const v217 = new Error(v216);
                    const v218 = cb(v217);
                    v218;
                }
            };
            const v220 = fs.exists(filePath, v219);
            v220;
        };
        const v228 = function isFile(cb) {
            const v226 = function (err, stats) {
                const v222 = stats.isFile();
                if (v222) {
                    const v223 = cb(null, true);
                    v223;
                } else {
                    const v224 = new Error('Not a file.');
                    const v225 = cb(v224);
                    v225;
                }
            };
            const v227 = fs.stat(filePath, v226);
            v227;
        };
        const v229 = {
            fileExists: v221,
            isFile: v228
        };
        const v270 = function (err) {
            if (err) {
                const v230 = debug(err);
                v230;
                const v231 = next();
                v231;
            } else {
                var wave = [];
                const v232 = options.lastModified;
                if (v232) {
                    const v233 = wave.push(checkLastModified);
                    v233;
                }
                const v234 = options.etag;
                if (v234) {
                    const v235 = wave.push(checkETag);
                    v235;
                }
                const v236 = wave.push(checkSanity);
                v236;
                const v237 = options.expires;
                if (v237) {
                    const v238 = wave.push(makeExpires);
                    v238;
                }
                const v239 = options.cacheControl;
                if (v239) {
                    const v240 = wave.push(makeCacheControl);
                    v240;
                }
                const v241 = options.lastModified;
                if (v241) {
                    const v242 = wave.push(makeLastModified);
                    v242;
                }
                const v243 = options.etag;
                if (v243) {
                    const v244 = wave.push(makeETag);
                    v244;
                }
                const v245 = async.seq;
                const v246 = async.seq;
                var runner = v245.apply(v246, wave);
                const v247 = req.url;
                const v248 = basePath + v247;
                const v249 = [];
                var data = {};
                data.res = res;
                data.req = req;
                data.file = v248;
                data.options = options;
                data.headers = v249;
                data._changed = false;
                data.status = 200;
                const v268 = function (err, result) {
                    if (err) {
                        const v250 = next(err);
                        return v250;
                    }
                    const v251 = result._changed;
                    if (v251) {
                        let rk;
                        const v252 = result.headers;
                        for (rk in v252) {
                            const v253 = result.headers;
                            var pair = v253[rk];
                            const v254 = pair[0];
                            const v255 = pair[1];
                            const v256 = res.setHeader(v254, v255);
                            v256;
                        }
                        const v257 = result.file;
                        const v258 = mime.lookup(v257);
                        const v259 = res.setHeader('Content-Type', v258);
                        v259;
                        const v260 = result.status;
                        const v261 = res.status(v260);
                        v261;
                        const v262 = result.file;
                        const v263 = fs.createReadStream(v262);
                        const v264 = v263.pipe(res);
                        v264;
                    } else {
                        const v265 = result.status;
                        const v266 = res.status(v265);
                        const v267 = v266.end();
                        v267;
                    }
                };
                const v269 = runner(data, v268);
                v269;
            }
        };
        const v271 = async.series(v229, v270);
        v271;
    };
    return v272;
};
module.exports = Blinker;