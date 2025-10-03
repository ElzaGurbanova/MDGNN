var Server;
var Writable;
var datetime;
var env;
var fs;
var http;
var path;
var style;
var url;
var util;
fs = require('fs');
url = require('url');
path = require('path');
http = require('http');
util = require('util');
const v181 = require('stream');
Writable = v181.Writable;
const v182 = process.env;
const v183 = v182.NODE_ENV;
env = v183 || 'development';
const v186 = function (str) {
    const v184 = '\x1B[1m' + str;
    const v185 = v184 + '\x1B[0m';
    return v185;
};
const v189 = function (str) {
    const v187 = '\x1B[32m' + str;
    const v188 = v187 + '\x1B[0m';
    return v188;
};
const v192 = function (str) {
    const v190 = '\x1B[34m' + str;
    const v191 = v190 + '\x1B[0m';
    return v191;
};
const v195 = function (str) {
    const v193 = '\x1B[36m' + str;
    const v194 = v193 + '\x1B[0m';
    return v194;
};
style.head = v186;
style.tag = v189;
style.int = v192;
style.tip = v195;
style = {};
style = {};
const v202 = function () {
    var date;
    var day;
    var month;
    var year;
    date = new Date();
    year = date.getFullYear();
    const v196 = date.getMonth();
    month = v196 + 1;
    const v197 = month < 10;
    if (v197) {
        month = '0' + month;
    }
    day = date.getDate();
    const v198 = day < 10;
    if (v198) {
        day = '0' + day;
    }
    const v199 = util.format('%s-%s-%s', year, month, day);
    const v200 = date.toLocaleTimeString();
    const v201 = [
        v199,
        v200
    ];
    return v201;
};
datetime = v202;
const v360 = function () {
    const Server = function () {
    };
    const v208 = function (callback) {
        const v203 = typeof callback;
        const v204 = v203 !== 'function';
        if (v204) {
            const v205 = typeof callback;
            const v206 = v205 + ' is not a function';
            const v207 = new TypeError(v206);
            throw v207;
        }
        return this._error = callback;
    };
    Server.error = v208;
    const v221 = function (extname, type) {
        const v209 = this._types;
        const v210 = v209 == null;
        if (v210) {
            const v211 = {};
            v211['.html'] = 'text/html';
            v211['.htm'] = 'text/html';
            v211['.js'] = 'text/javascript';
            v211['.css'] = 'text/css';
            v211['.jpeg'] = 'image/jpeg';
            v211['.jpg'] = 'image/jpeg';
            v211['.png'] = 'image/png';
            v211['.gif'] = 'image/gif';
            this._types = v211;
        }
        const v212 = typeof type;
        const v213 = v212 === 'string';
        if (v213) {
            const v214 = this._types;
            return v214[extname] = type;
        }
        const v215 = this._types;
        const v216 = v215[extname];
        const v217 = typeof v216;
        const v218 = v217 === 'string';
        if (v218) {
            const v219 = this._types;
            const v220 = v219[extname];
            return v220;
        }
        return 'text/plain';
    };
    Server.contentType = v221;
    const v224 = function () {
        var server;
        server = http.createServer(this);
        const v222 = server.listen;
        const v223 = v222.apply(server, arguments);
        return v223;
    };
    Server.listen = v224;
    const v266 = function (arg1, arg2) {
        var date;
        var msg;
        var time;
        var _ref;
        var _ref1;
        const v225 = this._log;
        const v226 = env !== 'production';
        const v227 = v225 || v226;
        if (v227) {
            const v228 = this._format;
            const v229 = v228 == null;
            if (v229) {
                const v241 = function (req, res) {
                    const v230 = style.tip('(%sms)');
                    const v231 = '%s %s, %s %s, %s ' + v230;
                    const v232 = req.method;
                    const v233 = style.head(v232);
                    const v234 = req.url;
                    const v235 = style.tag('Content-Type');
                    const v236 = res.getHeader('Content-Type');
                    const v237 = res.statusCode;
                    const v238 = style.int(v237);
                    const v239 = res.elapsedTime;
                    const v240 = util.format(v231, v233, v234, v235, v236, v238, v239);
                    return v240;
                };
                this._format = v241;
            }
            const v242 = arg1 instanceof Writable;
            if (v242) {
                return this._log = arg1;
            }
            const v243 = typeof arg1;
            const v244 = v243 === 'function';
            if (v244) {
                arg2 = arg1;
            }
            const v245 = typeof arg2;
            const v246 = v245 === 'function';
            if (v246) {
                return this._format = arg2;
            }
            const v247 = typeof arg1;
            const v248 = v247 === 'string';
            if (v248) {
                const v249 = util.format;
                const v250 = v249.apply(util, arguments);
                msg = v250 + '\n';
            }
            const v251 = http.IncomingMessage;
            const v252 = arg1 instanceof v251;
            const v253 = http.ServerResponse;
            const v254 = arg2 instanceof v253;
            const v255 = v252 && v254;
            if (v255) {
                msg = this._format(arg1, arg2);
            }
            const v256 = typeof msg;
            const v257 = v256 !== 'string';
            if (v257) {
                return;
            }
            _ref = datetime(), date = _ref[0], time = _ref[1];
            msg = util.format('%s - %s', time, msg);
            const v258 = env !== 'production';
            if (v258) {
                const v259 = console.log(msg);
                v259;
            }
            const v260 = (_ref1 = this._log) != null;
            const v261 = msg.replace(/\x1b\[[0-9;]*m/g, '');
            const v262 = util.format('%s %s\n', date, v261);
            const v263 = _ref1.write(v262);
            const v264 = void 0;
            let v265;
            if (v260) {
                v265 = v263;
            } else {
                v265 = v264;
            }
            return v265;
        }
    };
    Server.log = v266;
    const v359 = function (req, res) {
        var controller;
        var dynamic;
        var dynamicfile;
        var elapsedTime;
        var extname;
        var file;
        var pathname;
        var rs;
        var staticfile;
        var status;
        const v267 = new Date();
        elapsedTime = v267.getTime();
        const v280 = function (_this) {
            const v279 = function () {
                const v268 = new Date();
                const v269 = v268.getTime();
                res.elapsedTime = v269 - elapsedTime;
                const v277 = function (name) {
                    var reg;
                    const v270 = '^' + name;
                    const v271 = v270 + ':(.+)$';
                    reg = new RegExp(v271, 'm');
                    const v272 = res._header;
                    const v273 = reg.exec(v272);
                    const v274 = v273[1];
                    const v275 = v274.toString();
                    const v276 = v275.trim();
                    return v276;
                };
                res.getHeader = v277;
                const v278 = _this.log(req, res);
                return v278;
            };
            return v279;
        };
        const v281 = v280(this);
        const v282 = res.on('finish', v281);
        v282;
        const v294 = function (_this) {
            const v293 = function (code, text) {
                var codefile;
                var file;
                var rs;
                const v283 = { 'Content-Type': 'text/html;charset=utf-8' };
                const v284 = res.writeHead(code, v283);
                v284;
                const v285 = process.cwd();
                const v286 = _this['static'];
                const v287 = '_' + code;
                const v288 = v287 + '.html';
                codefile = path.join(v285, v286, v288);
                const v289 = fs.existsSync(codefile);
                if (v289) {
                    file = codefile;
                    rs = fs.createReadStream(codefile);
                    const v290 = rs.pipe(res);
                    return v290;
                } else {
                    const v291 = util.format('<title>%s %s</title><center><p><br><br></p><h1>%s %s</h1><p><i>starfruit.js<i></p></center>', code, text, code, text);
                    const v292 = res.end(v291);
                    return v292;
                }
            };
            return v293;
        };
        status = v294(this);
        const v295 = this.timeout;
        const v296 = v295 * 1000;
        const v305 = function () {
            const v297 = status(503, 'Service Unavailable');
            v297;
            const v298 = this._error;
            const v299 = typeof v298;
            const v300 = v299 === 'function';
            const v301 = new Error('Service unavailable');
            const v302 = this._error(v301);
            const v303 = void 0;
            let v304;
            if (v300) {
                v304 = v302;
            } else {
                v304 = v303;
            }
            return v304;
        };
        const v306 = res.setTimeout(v296, v305);
        v306;
        const v307 = req.url;
        const v308 = url.parse(v307);
        const v309 = v308.pathname;
        pathname = v309.toLowerCase();
        file = false;
        const v310 = process.cwd();
        const v311 = this['static'];
        staticfile = path.join(v310, v311, pathname);
        extname = path.extname(staticfile);
        const v312 = extname.length;
        const v313 = v312 < 1;
        if (v313) {
            const v314 = this['default'];
            const v315 = v314 + '.html';
            staticfile = path.join(staticfile, v315);
        }
        const v316 = fs.existsSync(staticfile);
        if (v316) {
            file = staticfile;
            const v317 = this.contentType(extname);
            const v318 = { 'Content-Type': v317 };
            const v319 = res.writeHead(200, v318);
            v319;
            rs = fs.createReadStream(staticfile);
            const v320 = rs.pipe(res);
            v320;
        }
        const v321 = file === false;
        if (v321) {
            const v322 = process.cwd();
            const v323 = this.dynamic;
            dynamic = path.join(v322, v323, pathname);
            dynamicfile = dynamic;
            extname = path.extname(dynamicfile);
            const v324 = extname.length;
            const v325 = v324 < 1;
            if (v325) {
                dynamicfile = dynamicfile + '.js';
            }
            const v326 = fs.existsSync(dynamicfile);
            const v327 = !v326;
            if (v327) {
                const v328 = this['default'];
                const v329 = v328 + '.js';
                dynamicfile = path.join(dynamic, v329);
            }
            const v330 = fs.existsSync(dynamicfile);
            if (v330) {
                file = dynamicfile;
                controller = require(dynamicfile);
                const v331 = typeof controller;
                const v332 = v331 === 'function';
                if (v332) {
                    controller = new controller();
                }
                const v340 = function (err) {
                    const v333 = status(500, 'Internal Server Error');
                    v333;
                    const v334 = this._error;
                    const v335 = typeof v334;
                    const v336 = v335 === 'function';
                    const v337 = this._error(err);
                    const v338 = void 0;
                    let v339;
                    if (v336) {
                        v339 = v337;
                    } else {
                        v339 = v338;
                    }
                    return v339;
                };
                const v341 = controller.error(v340);
                v341;
                const v342 = controller.init;
                const v343 = typeof v342;
                const v344 = v343 === 'function';
                if (v344) {
                    const v345 = controller.init();
                    v345;
                }
                const v346 = controller['do'](req, res);
                v346;
            }
        }
        const v347 = file === false;
        if (v347) {
            const v348 = status(404, 'Not Found');
            v348;
            const v349 = this._error;
            const v350 = typeof v349;
            const v351 = v350 === 'function';
            const v352 = this['static'];
            const v353 = this.dynamic;
            const v354 = util.format('Can not found files in %s folder or %s folder.', v352, v353);
            const v355 = new Error(v354);
            const v356 = this._error(v355);
            const v357 = void 0;
            let v358;
            if (v351) {
                v358 = v356;
            } else {
                v358 = v357;
            }
            return v358;
        }
    };
    Server['do'] = v359;
    return Server;
};
Server = v360();
module.exports = Server;