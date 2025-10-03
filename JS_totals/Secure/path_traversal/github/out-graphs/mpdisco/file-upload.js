var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var util = require('util');
var _ = require('underscore');
const v214 = require('events');
var EventEmitter = v214.EventEmitter;
var formidable = require('formidable');
var options;
const v215 = __dirname + '/../tmp';
const v216 = __dirname + '/../public';
const v217 = __dirname + '/../public/files';
const v218 = {};
v218.allowOrigin = '*';
v218.allowMethods = 'OPTIONS, HEAD, GET, POST, PUT, DELETE';
v218.allowHeaders = 'Content-Type, Content-Range, Content-Disposition';
const v221 = function (filePath, callback) {
    const v219 = options.uploadDir;
    const v220 = callback(v219);
    v220;
};
var defaults = {};
defaults.tmpDir = v215;
defaults.publicDir = v216;
defaults.uploadDir = v217;
defaults.uploadUrl = '/files/';
defaults.maxPostSize = 11000000000;
defaults.minFileSize = 1;
defaults.maxFileSize = 10000000000;
defaults.acceptFileTypes = /.+/i;
defaults.safeFileTypes = /\.(gif|jpe?g|png)$/i;
defaults.accessControl = v218;
defaults.uploadPath = v221;
var utf8encode = function (str) {
    const v222 = encodeURIComponent(str);
    const v223 = unescape(v222);
    return v223;
};
var nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/;
var nameCountFunc = function (s, index, ext) {
    const v224 = parseInt(index, 10);
    const v225 = v224 || 0;
    const v226 = v225 + 1;
    const v227 = ' (' + v226;
    const v228 = v227 + ')';
    const v229 = ext || '';
    const v230 = v228 + v229;
    return v230;
};
var FileInfo = function (file) {
    const v231 = file.name;
    this.name = v231;
    const v232 = file.size;
    this.size = v232;
    const v233 = file.type;
    this.type = v233;
    this.delete_type = 'DELETE';
};
var UploadHandler = function (req, res, callback) {
    this.req = req;
    this.res = res;
    this.callback = callback;
};
const v234 = FileInfo.prototype;
const v251 = function () {
    const v235 = options.minFileSize;
    const v236 = options.minFileSize;
    const v237 = this.size;
    const v238 = v236 > v237;
    const v239 = v235 && v238;
    if (v239) {
        this.error = 'File is too small';
    } else {
        const v240 = options.maxFileSize;
        const v241 = options.maxFileSize;
        const v242 = this.size;
        const v243 = v241 < v242;
        const v244 = v240 && v243;
        if (v244) {
            this.error = 'File is too big';
        } else {
            const v245 = options.acceptFileTypes;
            const v246 = this.name;
            const v247 = v245.test(v246);
            const v248 = !v247;
            if (v248) {
                this.error = 'Filetype not allowed';
            }
        }
    }
    const v249 = this.error;
    const v250 = !v249;
    return v250;
};
v234.validate = v251;
const v252 = FileInfo.prototype;
const v263 = function () {
    const v253 = this.name;
    const v254 = path.basename(v253);
    const v255 = v254.replace(/^\.+/, '');
    this.name = v255;
    const v256 = options.uploadDir;
    const v257 = v256 + '/';
    const v258 = this.name;
    const v259 = v257 + v258;
    let v260 = fs.existsSync(v259);
    while (v260) {
        const v261 = this.name;
        const v262 = v261.replace(nameCountRegexp, nameCountFunc);
        this.name = v262;
        v260 = fs.existsSync(v259);
    }
};
v252.safeName = v263;
const v264 = FileInfo.prototype;
const v276 = function (req) {
    const v265 = this.error;
    const v266 = !v265;
    if (v266) {
        const v267 = options.ssl;
        let v268;
        if (v267) {
            v268 = 'https:';
        } else {
            v268 = 'http:';
        }
        const v269 = v268 + '//';
        const v270 = req.headers;
        const v271 = v270.host;
        const v272 = v269 + v271;
        const v273 = options.uploadUrl;
        var baseUrl = v272 + v273;
        const v274 = this.name;
        const v275 = encodeURIComponent(v274);
        this.url = this.delete_url = baseUrl + v275;
    }
};
v264.initUrls = v276;
const v277 = UploadHandler.prototype;
const v297 = function () {
    var handler = this;
    var files = [];
    const v278 = options.uploadDir;
    const v295 = function (err, list) {
        const v291 = function (name) {
            const v279 = options.uploadDir;
            const v280 = v279 + '/';
            const v281 = v280 + name;
            var stats = fs.statSync(v281);
            var fileInfo;
            const v282 = stats.isFile();
            const v283 = name[0];
            const v284 = v283 !== '.';
            const v285 = v282 && v284;
            if (v285) {
                const v286 = stats.size;
                const v287 = {
                    name: name,
                    size: v286
                };
                fileInfo = new FileInfo(v287);
                const v288 = handler.req;
                const v289 = fileInfo.initUrls(v288);
                v289;
                const v290 = files.push(fileInfo);
                v290;
            }
        };
        const v292 = list.forEach(v291);
        v292;
        const v293 = { files: files };
        const v294 = handler.callback(v293);
        v294;
    };
    const v296 = fs.readdir(v278, v295);
    v296;
};
v277.get = v297;
const v298 = UploadHandler.prototype;
const v354 = function () {
    var handler = this;
    var form = new formidable.IncomingForm();
    var tmpFiles = [];
    var files = [];
    var map = {};
    var counter = 1;
    var redirect;
    var finish = function () {
        counter -= 1;
        const v299 = !counter;
        if (v299) {
            const v302 = function (fileInfo) {
                const v300 = handler.req;
                const v301 = fileInfo.initUrls(v300);
                v301;
            };
            const v303 = files.forEach(v302);
            v303;
            const v304 = { files: files };
            const v305 = handler.callback(v304, redirect);
            v305;
        }
    };
    const v306 = options.tmpDir;
    form.uploadDir = v306;
    const v314 = function (name, file) {
        const v307 = file.path;
        const v308 = tmpFiles.push(v307);
        v308;
        const v309 = handler.req;
        var fileInfo = new FileInfo(file, v309, true);
        const v310 = fileInfo.safeName();
        v310;
        const v311 = file.path;
        const v312 = path.basename(v311);
        map[v312] = fileInfo;
        const v313 = files.push(fileInfo);
        v313;
    };
    const v315 = form.on('fileBegin', v314);
    const v317 = function (name, value) {
        const v316 = name === 'redirect';
        if (v316) {
            redirect = value;
        }
    };
    const v318 = v315.on('field', v317);
    const v334 = function (name, file) {
        const v319 = file.path;
        const v320 = path.basename(v319);
        var fileInfo = map[v320];
        const v321 = file.size;
        fileInfo.size = v321;
        const v322 = fileInfo.validate();
        const v323 = !v322;
        if (v323) {
            const v324 = file.path;
            const v325 = fs.unlink(v324);
            v325;
            return;
        }
        const v326 = file.path;
        const v332 = function (uploadPath) {
            const v327 = mkdirp.sync(uploadPath);
            v327;
            const v328 = file.path;
            const v329 = fileInfo.name;
            const v330 = path.join(uploadPath, v329);
            const v331 = fs.renameSync(v328, v330);
            v331;
        };
        const v333 = options.uploadPath(v326, v332);
        v333;
    };
    const v335 = v318.on('file', v334);
    const v339 = function () {
        const v337 = function (file) {
            const v336 = fs.unlink(file);
            v336;
        };
        const v338 = tmpFiles.forEach(v337);
        v338;
    };
    const v340 = v335.on('aborted', v339);
    const v342 = function (e) {
        const v341 = console.log(e);
        v341;
    };
    const v343 = v340.on('error', v342);
    const v349 = function (bytesReceived, bytesExpected) {
        const v344 = options.maxPostSize;
        const v345 = bytesReceived > v344;
        if (v345) {
            const v346 = handler.req;
            const v347 = v346.connection;
            const v348 = v347.destroy();
            v348;
        }
    };
    const v350 = v343.on('progress', v349);
    const v351 = v350.on('end', finish);
    const v352 = handler.req;
    const v353 = v351.parse(v352);
    v353;
};
v298.post = v354;
const v355 = UploadHandler.prototype;
const v378 = function () {
    var handler = this;
    var fileName;
    const v356 = handler.req;
    const v357 = v356.url;
    const v358 = options.uploadUrl;
    const v359 = v358.length;
    const v360 = v357.slice(0, v359);
    const v361 = options.uploadUrl;
    const v362 = v360 === v361;
    if (v362) {
        const v363 = handler.req;
        const v364 = v363.url;
        const v365 = decodeURIComponent(v364);
        fileName = path.basename(v365);
        const v366 = fileName[0];
        const v367 = v366 !== '.';
        if (v367) {
            const v368 = options.uploadDir;
            const v369 = v368 + '/';
            const v370 = v369 + fileName;
            const v374 = function (ex) {
                const v371 = !ex;
                const v372 = { success: v371 };
                const v373 = handler.callback(v372);
                v373;
            };
            const v375 = fs.unlink(v370, v374);
            v375;
            return;
        }
    }
    const v376 = { success: false };
    const v377 = handler.callback(v376);
    v377;
};
v355.destroy = v378;
var FileUpload = function (opts) {
    options = _.defaults(opts, defaults);
    var events = new EventEmitter();
    var fn = function (req, res) {
        const v379 = options.accessControl;
        const v380 = v379.allowOrigin;
        const v381 = res.setHeader('Access-Control-Allow-Origin', v380);
        v381;
        const v382 = options.accessControl;
        const v383 = v382.allowMethods;
        const v384 = res.setHeader('Access-Control-Allow-Methods', v383);
        v384;
        const v385 = options.accessControl;
        const v386 = v385.allowHeaders;
        const v387 = res.setHeader('Access-Control-Allow-Headers', v386);
        v387;
        const v405 = function (result, redirect) {
            if (redirect) {
                const v388 = JSON.stringify(result);
                const v389 = encodeURIComponent(v388);
                const v390 = redirect.replace(/%s/, v389);
                const v391 = { 'Location': v390 };
                const v392 = res.writeHead(302, v391);
                v392;
                const v393 = res.end();
                v393;
            } else {
                const v394 = req.headers;
                const v395 = v394.accept;
                const v396 = v395.indexOf('application/json');
                const v397 = -1;
                const v398 = v396 !== v397;
                let v399;
                if (v398) {
                    v399 = 'application/json';
                } else {
                    v399 = 'text/plain';
                }
                const v400 = { 'Content-Type': v399 };
                const v401 = res.writeHead(200, v400);
                v401;
                const v402 = JSON.stringify(result);
                const v403 = res.end(v402);
                v403;
            }
            const v404 = events.emit('end', result);
            v404;
        };
        var handleResult = v405.bind(this);
        var setNoCacheHeaders = function () {
            const v406 = res.setHeader('Pragma', 'no-cache');
            v406;
            const v407 = res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            v407;
            const v408 = res.setHeader('Content-Disposition', 'inline; filename="files.json"');
            v408;
        };
        var handler = new UploadHandler(req, res, handleResult);
        const v409 = req.method;
        switch (v409) {
        case 'OPTIONS':
            const v410 = res.end();
            v410;
            break;
        case 'HEAD':
        case 'GET':
            const v411 = req.url;
            const v412 = v411 === '/';
            if (v412) {
                const v413 = setNoCacheHeaders();
                v413;
                const v414 = req.method;
                const v415 = v414 === 'GET';
                if (v415) {
                    const v416 = handler.get();
                    v416;
                } else {
                    const v417 = res.end();
                    v417;
                }
            } else {
                const v418 = fileServer.serve(req, res);
                v418;
            }
            break;
        case 'POST':
            const v419 = setNoCacheHeaders();
            v419;
            const v420 = handler.post();
            v420;
            break;
        case 'DELETE':
            const v421 = handler.destroy();
            v421;
            break;
        default:
            res.statusCode = 405;
            const v422 = res.end();
            v422;
        }
    };
    const v423 = events.on;
    const v424 = v423.bind(events);
    const v425 = { on: v424 };
    const v426 = _.extend(fn, v425);
    v426;
    return fn;
};
FileUpload.defaults = defaults;
module.exports = FileUpload;