'use strict';
var _ = require('lodash');
var Media = require('./media.model');
var config = require('../../config/environment');
var path = require('path');
var fs = require('fs');
const v235 = fs.existsSync;
const v236 = path.existsSync;
var _existsSync = v235 || v236;
var formidable = require('formidable');
var imageMagick = require('imagemagick');
var options = config.mediaOptions;
var utf8encode = function (str) {
    const v237 = encodeURIComponent(str);
    const v238 = unescape(v237);
    return v238;
};
var nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/;
var nameCountFunc = function (s, index, ext) {
    const v239 = parseInt(index, 10);
    const v240 = v239 || 0;
    const v241 = v240 + 1;
    const v242 = ' (' + v241;
    const v243 = v242 + ')';
    const v244 = ext || '';
    const v245 = v243 + v244;
    return v245;
};
const v246 = options.uploadDir;
const v247 = path.resolve(v246);
var UPLOAD_ROOT = fs.realpathSync(v247);
const safeResolve = function () {
    const v248 = path.resolve;
    const v249 = [UPLOAD_ROOT];
    const v250 = [];
    const v251 = v250.slice;
    const v252 = v251.call(arguments);
    const v253 = v249.concat(v252);
    var candidate = v248.apply(path, v253);
    var rel = path.relative(UPLOAD_ROOT, candidate);
    const v254 = rel.startsWith('..');
    const v255 = path.isAbsolute(rel);
    const v256 = v254 || v255;
    if (v256) {
        const v257 = new Error('Path escapes upload root');
        throw v257;
    }
    return candidate;
};
var FileInfo = function (file) {
    const v258 = file.name;
    this.name = v258;
    const v259 = file.size;
    this.size = v259;
    const v260 = file.type;
    this.type = v260;
    this.deleteType = 'DELETE';
};
const v261 = FileInfo.prototype;
const v278 = function () {
    const v262 = options.minFileSize;
    const v263 = options.minFileSize;
    const v264 = this.size;
    const v265 = v263 > v264;
    const v266 = v262 && v265;
    if (v266) {
        this.error = 'File is too small';
    } else {
        const v267 = options.maxFileSize;
        const v268 = options.maxFileSize;
        const v269 = this.size;
        const v270 = v268 < v269;
        const v271 = v267 && v270;
        if (v271) {
            this.error = 'File is too big';
        } else {
            const v272 = options.acceptFileTypes;
            const v273 = this.name;
            const v274 = v272.test(v273);
            const v275 = !v274;
            if (v275) {
                this.error = 'Filetype not allowed';
            }
        }
    }
    const v276 = this.error;
    const v277 = !v276;
    return v277;
};
v261.validate = v278;
const v279 = FileInfo.prototype;
const v290 = function () {
    const v280 = this.name;
    const v281 = path.basename(v280);
    const v282 = v281.replace(/^\.+/, '');
    this.name = v282;
    const v283 = options.uploadDir;
    const v284 = v283 + '/';
    const v285 = this.name;
    const v286 = v284 + v285;
    let v287 = _existsSync(v286);
    while (v287) {
        const v288 = this.name;
        const v289 = v288.replace(nameCountRegexp, nameCountFunc);
        this.name = v289;
        v287 = _existsSync(v286);
    }
};
v279.safeName = v290;
const v291 = FileInfo.prototype;
const v319 = function (req) {
    const v292 = this.error;
    const v293 = !v292;
    if (v293) {
        var that = this;
        const v294 = options.ssl;
        let v295;
        if (v294) {
            v295 = 'https:';
        } else {
            v295 = 'http:';
        }
        const v296 = v295 + '//';
        const v297 = req.headers;
        const v298 = v297.host;
        const v299 = v296 + v298;
        const v300 = options.uploadUrl;
        var baseUrl = v299 + v300;
        const v301 = this.name;
        const v302 = encodeURIComponent(v301);
        this.url = this.deleteUrl = baseUrl + v302;
        const v303 = options.imageVersions;
        const v304 = Object.keys(v303);
        const v317 = function (version) {
            const v305 = options.uploadDir;
            const v306 = v305 + '/';
            const v307 = v306 + version;
            const v308 = v307 + '/';
            const v309 = that.name;
            const v310 = v308 + v309;
            const v311 = _existsSync(v310);
            if (v311) {
                const v312 = version + 'Url';
                const v313 = that.name;
                const v314 = encodeURIComponent(v313);
                const v315 = baseUrl + v314;
                const v316 = v315 + '?v=';
                that[v312] = v316 + version;
            }
        };
        const v318 = v304.forEach(v317);
        v318;
    }
};
v291.initUrls = v319;
var overrideHeaders = function (req, res) {
    const v320 = options.accessControl;
    const v321 = v320.allowOrigin;
    const v322 = res.setHeader('Access-Control-Allow-Origin', v321);
    v322;
    const v323 = options.accessControl;
    const v324 = v323.allowMethods;
    const v325 = res.setHeader('Access-Control-Allow-Methods', v324);
    v325;
    const v326 = options.accessControl;
    const v327 = v326.allowHeaders;
    const v328 = res.setHeader('Access-Control-Allow-Headers', v327);
    v328;
};
const v348 = function (req, res) {
    var files = [];
    const v329 = options.uploadDir;
    const v346 = function (err, list) {
        const v341 = function (name) {
            const v330 = options.uploadDir;
            const v331 = v330 + '/';
            const v332 = v331 + name;
            var stats = fs.statSync(v332);
            var fileInfo;
            const v333 = stats.isFile();
            const v334 = name[0];
            const v335 = v334 !== '.';
            const v336 = v333 && v335;
            if (v336) {
                const v337 = stats.size;
                const v338 = {
                    name: name,
                    size: v337
                };
                fileInfo = new FileInfo(v338);
                const v339 = fileInfo.initUrls(req);
                v339;
                const v340 = files.push(fileInfo);
                v340;
            }
        };
        const v342 = list.forEach(v341);
        const v343 = list && v342;
        v343;
        const v344 = { files: files };
        const v345 = res.json(200, v344);
        v345;
    };
    const v347 = fs.readdir(v329, v346);
    v347;
};
exports.index = v348;
const v375 = function (req, res) {
    try {
        const v349 = req.params;
        const v350 = v349.id;
        const v351 = v350 || '';
        var filename = path.basename(v351);
        const v352 = req.query;
        var version = v352.v;
        const v353 = options.imageVersions;
        const v354 = v353[version];
        const v355 = !v354;
        const v356 = version && v355;
        if (v356) {
            version = null;
        }
        const v357 = !filename;
        const v358 = filename[0];
        const v359 = v358 === '.';
        const v360 = v357 || v359;
        if (v360) {
            const v361 = res.send(400);
            return v361;
        }
        let filepath;
        const v362 = safeResolve(version, filename);
        const v363 = safeResolve(filename);
        if (version) {
            filepath = v362;
        } else {
            filepath = v363;
        }
        const v372 = function (exists) {
            if (exists) {
                const v364 = options.inlineFileTypes;
                const v365 = v364.test(filename);
                const v366 = !v365;
                if (v366) {
                    const v367 = path.basename(filename);
                    const v368 = utf8encode(v367);
                    const v369 = res.download(filepath, v368);
                    return v369;
                }
                const v370 = res.sendFile(filepath);
                return v370;
            }
            const v371 = res.send(404);
            return v371;
        };
        const v373 = fs.exists(filepath, v372);
        return v373;
    } catch (e) {
        const v374 = res.send(400);
        return v374;
    }
};
exports.show = v375;
const v447 = function (req, res) {
    var form = new formidable.IncomingForm();
    var tmpFiles = [];
    var files = [];
    var map = {};
    var counter = 1;
    var redirect;
    var finish = function () {
        counter -= 1;
        const v376 = !counter;
        if (v376) {
            const v378 = function (fileInfo) {
                const v377 = fileInfo.initUrls(req);
                v377;
            };
            const v379 = files.forEach(v378);
            v379;
            const v380 = { files: files };
            const v381 = res.json(200, v380);
            v381;
        }
    };
    const v382 = options.tmpDir;
    form.uploadDir = v382;
    const v389 = function (name, file) {
        const v383 = file.path;
        const v384 = tmpFiles.push(v383);
        v384;
        var fileInfo = new FileInfo(file, req, true);
        const v385 = fileInfo.safeName();
        v385;
        const v386 = file.path;
        const v387 = path.basename(v386);
        map[v387] = fileInfo;
        const v388 = files.push(fileInfo);
        v388;
    };
    const v390 = form.on('fileBegin', v389);
    const v392 = function (name, value) {
        const v391 = name === 'redirect';
        if (v391) {
            redirect = value;
        }
    };
    const v393 = v390.on('field', v392);
    const v429 = function (name, file) {
        const v394 = file.path;
        const v395 = path.basename(v394);
        var fileInfo = map[v395];
        const v396 = file.size;
        fileInfo.size = v396;
        const v397 = fileInfo.validate();
        const v398 = !v397;
        if (v398) {
            const v399 = file.path;
            const v400 = fs.unlink(v399);
            v400;
            return;
        }
        const v401 = file.path;
        const v402 = options.uploadDir;
        const v403 = v402 + '/';
        const v404 = fileInfo.name;
        const v405 = v403 + v404;
        const v406 = fs.renameSync(v401, v405);
        v406;
        const v407 = options.imageTypes;
        const v408 = fileInfo.name;
        const v409 = v407.test(v408);
        if (v409) {
            const v410 = options.imageVersions;
            const v411 = Object.keys(v410);
            const v427 = function (version) {
                counter += 1;
                const v412 = options.imageVersions;
                var opts = v412[version];
                const v413 = opts.width;
                const v414 = opts.height;
                const v415 = options.uploadDir;
                const v416 = v415 + '/';
                const v417 = fileInfo.name;
                const v418 = v416 + v417;
                const v419 = options.uploadDir;
                const v420 = v419 + '/';
                const v421 = v420 + version;
                const v422 = v421 + '/';
                const v423 = fileInfo.name;
                const v424 = v422 + v423;
                const v425 = {
                    width: v413,
                    height: v414,
                    srcPath: v418,
                    dstPath: v424
                };
                const v426 = imageMagick.resize(v425, finish);
                v426;
            };
            const v428 = v411.forEach(v427);
            v428;
        }
    };
    const v430 = v393.on('file', v429);
    const v434 = function () {
        const v432 = function (file) {
            const v431 = fs.unlink(file);
            v431;
        };
        const v433 = tmpFiles.forEach(v432);
        v433;
    };
    const v435 = v430.on('aborted', v434);
    const v437 = function (e) {
        const v436 = console.log(e);
        v436;
    };
    const v438 = v435.on('error', v437);
    const v443 = function (bytesReceived) {
        const v439 = options.maxPostSize;
        const v440 = bytesReceived > v439;
        if (v440) {
            const v441 = req.connection;
            const v442 = v441.destroy();
            v442;
        }
    };
    const v444 = v438.on('progress', v443);
    const v445 = v444.on('end', finish);
    const v446 = v445.parse(req);
    v446;
};
exports.create = v447;
const v467 = function (req, res) {
    try {
        const v448 = req.params;
        const v449 = v448.id;
        const v450 = v449 || '';
        var filename = path.basename(v450);
        const v451 = !filename;
        const v452 = filename[0];
        const v453 = v452 === '.';
        const v454 = v451 || v453;
        if (v454) {
            const v455 = res.send(400);
            return v455;
        }
        var filepath = safeResolve(filename);
        const v464 = function (ex) {
            const v456 = options.imageVersions;
            const v457 = Object.keys(v456);
            const v460 = function (version) {
                try {
                    var versionpath = safeResolve(version, filename);
                    const v458 = function () {
                    };
                    const v459 = fs.unlink(versionpath, v458);
                    v459;
                } catch (e) {
                }
            };
            const v461 = v457.forEach(v460);
            v461;
            let v462;
            if (ex) {
                v462 = 404;
            } else {
                v462 = 200;
            }
            const v463 = res.send(v462);
            return v463;
        };
        const v465 = fs.unlink(filepath, v464);
        return v465;
    } catch (e) {
        const v466 = res.send(400);
        return v466;
    }
};
exports.destroy = v467;
const handleError = function (res, err) {
    const v468 = res.send(500, err);
    return v468;
};