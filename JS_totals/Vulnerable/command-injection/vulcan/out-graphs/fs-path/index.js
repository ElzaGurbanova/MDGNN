'use strict';
var fs = require('fs');
var path = require('path');
var async = require('async');
var child_process = require('child_process');
const v235 = process.platform;
const v236 = v235 === 'win32';
const v240 = function () {
    const v237 = child_process.execSync;
    const v238 = !v237;
    if (v238) {
        const v239 = new Error('your node.js version is to low(<0.11.12).');
        throw v239;
    }
    return this;
};
const v262 = function (dist, callback) {
    var dirs = [];
    dist = path.resolve(dist);
    const v241 = dist.split(/[\\\/]/);
    const v244 = function (first, second) {
        const v242 = first || '/';
        var _path = path.join(v242, second);
        const v243 = dirs.push(_path);
        v243;
        return _path;
    };
    const v245 = v241.reduce(v244);
    v245;
    const v257 = function (_path, callback) {
        const v255 = function (exists) {
            if (exists) {
                const v246 = callback(null);
                v246;
            } else {
                const v253 = function (err) {
                    const v247 = !err;
                    const v248 = err.code;
                    const v249 = v248 === 'EEXIST';
                    const v250 = v247 || v249;
                    let v251;
                    if (v250) {
                        v251 = null;
                    } else {
                        v251 = err;
                    }
                    const v252 = callback(v251);
                    v252;
                };
                const v254 = fs.mkdir(_path, v253);
                v254;
            }
        };
        const v256 = fs.exists(_path, v255);
        v256;
    };
    const v260 = function (err) {
        const v258 = callback(err);
        const v259 = callback && v258;
        v259;
    };
    const v261 = async.eachSeries(dirs, v257, v260);
    v261;
};
const v268 = function (dist) {
    dist = path.resolve(dist);
    const v263 = fs.existsSync(dist);
    const v264 = !v263;
    if (v264) {
        const v265 = path.dirname(dist);
        const v266 = fsPath.mkdirSync(v265);
        v266;
        const v267 = fs.mkdirSync(dist);
        v267;
    }
};
const v305 = function (from, dist, callback) {
    var that = this;
    var cmd = '';
    dist = path.resolve(dist);
    const v303 = function (err, stats) {
        if (err) {
            const v269 = callback(err);
            v269;
        } else {
            const v270 = stats.isDirectory();
            if (v270) {
                const v286 = function (err) {
                    if (err) {
                        const v271 = callback(err);
                        v271;
                    } else {
                        const v272 = that._win32;
                        if (v272) {
                            const v273 = path.join(from, '*');
                            const v274 = 'echo d|xcopy /s /e /y "' + v273;
                            const v275 = v274 + '" "';
                            const v276 = v275 + dist;
                            cmd = v276 + '"';
                        } else {
                            const v277 = path.join(from, '*');
                            const v278 = v277.replace(/ /g, '\\ ');
                            const v279 = 'cp -f -R -p ' + v278;
                            const v280 = v279 + ' ';
                            const v281 = dist.replace(/ /g, '\\ ');
                            cmd = v280 + v281;
                        }
                        const v284 = function (error, stdout, stderr) {
                            const v282 = callback(error);
                            const v283 = callback && v282;
                            v283;
                        };
                        const v285 = child_process.exec(cmd, v284);
                        v285;
                    }
                };
                const v287 = that.mkdir(dist, v286);
                v287;
            } else {
                const v288 = stats.isFile();
                if (v288) {
                    const v289 = that._win32;
                    if (v289) {
                        const v290 = 'echo f|xcopy /y "' + from;
                        const v291 = v290 + '" "';
                        const v292 = v291 + dist;
                        cmd = v292 + '"';
                    } else {
                        const v293 = from.replace(/ /g, '\\ ');
                        const v294 = 'cp -f -p ' + v293;
                        const v295 = v294 + ' ';
                        const v296 = dist.replace(/ /g, '\\ ');
                        cmd = v295 + v296;
                    }
                    const v299 = function (error, stdout, stderr) {
                        const v297 = callback(error);
                        const v298 = callback && v297;
                        v298;
                    };
                    const v300 = child_process.exec(cmd, v299);
                    v300;
                } else {
                    const v301 = callback(null);
                    const v302 = callback && v301;
                    v302;
                }
            }
        }
    };
    const v304 = fs.lstat(from, v303);
    v304;
};
const v329 = function (from, dist) {
    const v306 = this._supportExecSync();
    v306;
    try {
        var cmd = '';
        var stats = fs.lstatSync(from);
        dist = path.resolve(dist);
        const v307 = stats.isDirectory();
        if (v307) {
            const v308 = this._win32;
            if (v308) {
                const v309 = path.join(from, '*');
                const v310 = 'echo da|xcopy /s /e "' + v309;
                const v311 = v310 + '" "';
                const v312 = v311 + dist;
                cmd = v312 + '"';
            } else {
                const v313 = path.join(from, '*');
                const v314 = v313.replace(/ /g, '\\ ');
                const v315 = 'cp -f -R -p ' + v314;
                const v316 = v315 + ' ';
                const v317 = dist.replace(/ /g, '\\ ');
                cmd = v316 + v317;
            }
        } else {
            const v318 = stats.isFile();
            if (v318) {
                const v319 = this._win32;
                if (v319) {
                    const v320 = 'echo fa|xcopy "' + from;
                    const v321 = v320 + '" "';
                    const v322 = v321 + dist;
                    cmd = v322 + '"';
                } else {
                    const v323 = from.replace(/ /g, '\\ ');
                    const v324 = 'cp -f -p ' + v323;
                    const v325 = v324 + ' ';
                    const v326 = dist.replace(/ /g, '\\ ');
                    cmd = v325 + v326;
                }
            }
        }
        const v327 = child_process.execSync(cmd);
        const v328 = cmd && v327;
        v328;
    } catch (e) {
    }
};
const v345 = function (from, callback) {
    var that = this;
    var cmd = '';
    const v343 = function (err, stats) {
        if (err) {
            const v330 = callback(err);
            v330;
        } else {
            const v331 = that._win32;
            if (v331) {
                const v332 = stats.isDirectory();
                if (v332) {
                    const v333 = 'rd /s /q "' + from;
                    cmd = v333 + '"';
                } else {
                    const v334 = stats.isFile();
                    if (v334) {
                        const v335 = 'del /f "' + from;
                        cmd = v335 + '"';
                    }
                }
            } else {
                const v336 = from.replace(/ /g, '\\ ');
                cmd = 'rm -rf ' + v336;
            }
            if (cmd) {
                const v339 = function (error, stdout, stderr) {
                    const v337 = callback(error);
                    const v338 = callback && v337;
                    v338;
                };
                const v340 = child_process.exec(cmd, v339);
                v340;
            } else {
                const v341 = callback(null);
                const v342 = callback && v341;
                v342;
            }
        }
    };
    const v344 = fs.lstat(from, v343);
    v344;
};
const v355 = function (from) {
    const v346 = this._supportExecSync();
    v346;
    try {
        var cmd = '';
        var stats = fs.lstatSync(from);
        const v347 = this._win32;
        if (v347) {
            const v348 = stats.isDirectory();
            if (v348) {
                const v349 = 'rd /s /q "' + from;
                cmd = v349 + '"';
            } else {
                const v350 = stats.isFile();
                if (v350) {
                    const v351 = 'del /f "' + from;
                    cmd = v351 + '"';
                }
            }
        } else {
            const v352 = 'rm -rf "' + from;
            cmd = v352 + '"';
        }
        const v353 = child_process.execSync(cmd);
        const v354 = cmd && v353;
        v354;
    } catch (e) {
    }
};
const v416 = function (from, filter, callback) {
    const v356 = [];
    const v357 = [];
    var filelist = {};
    filelist.dirs = v356;
    filelist.files = v357;
    const v358 = arguments.length;
    const v359 = v358 < 3;
    if (v359) {
        callback = filter;
        filter = null;
    }
    const v414 = function (err, files) {
        if (err) {
            const v360 = callback(err);
            const v361 = callback && v360;
            v361;
        } else {
            const v407 = function (file, callback) {
                var filepath = path.join(from, file);
                const v405 = function (err, stats) {
                    if (err) {
                        const v362 = callback(err);
                        v362;
                    } else {
                        const v363 = stats.isDirectory();
                        if (v363) {
                            const v364 = !filter;
                            const v365 = filter(filepath, 'directory', file);
                            const v366 = v364 || v365;
                            if (v366) {
                                const v367 = filelist.dirs;
                                const v368 = v367.indexOf(filepath);
                                const v369 = -1;
                                const v370 = v368 === v369;
                                const v371 = filelist.dirs;
                                const v372 = v371.push(filepath);
                                const v373 = v370 && v372;
                                v373;
                                const v391 = function (err, files) {
                                    if (err) {
                                        const v374 = callback(err);
                                        const v375 = callback && v374;
                                        v375;
                                    } else {
                                        const v376 = files.dirs;
                                        const v384 = function (_dir) {
                                            const v377 = filelist.dirs;
                                            const v378 = v377.indexOf(_dir);
                                            const v379 = -1;
                                            const v380 = v378 === v379;
                                            const v381 = filelist.dirs;
                                            const v382 = v381.push(_dir);
                                            const v383 = v380 && v382;
                                            v383;
                                        };
                                        const v385 = v376.forEach(v384);
                                        v385;
                                        const v386 = filelist.files;
                                        const v387 = files.files;
                                        const v388 = v386.concat(v387);
                                        filelist.files = v388;
                                        const v389 = callback(null);
                                        const v390 = callback && v389;
                                        v390;
                                    }
                                };
                                const v392 = fsPath.find(filepath, filter, v391);
                                v392;
                            } else {
                                const v393 = callback(null);
                                const v394 = callback && v393;
                                v394;
                            }
                        } else {
                            const v395 = stats.isFile();
                            if (v395) {
                                const v396 = !filter;
                                const v397 = filter(filepath, 'file', file);
                                const v398 = v396 || v397;
                                if (v398) {
                                    const v399 = filelist.files;
                                    const v400 = v399.push(filepath);
                                    v400;
                                }
                                const v401 = callback(null);
                                const v402 = callback && v401;
                                v402;
                            } else {
                                const v403 = callback(null);
                                const v404 = callback && v403;
                                v404;
                            }
                        }
                    }
                };
                const v406 = fs.lstat(filepath, v405);
                v406;
            };
            const v412 = function (err) {
                if (err) {
                    const v408 = callback(err);
                    const v409 = callback && v408;
                    v409;
                } else {
                    const v410 = callback(null, filelist);
                    const v411 = callback && v410;
                    v411;
                }
            };
            const v413 = async.each(files, v407, v412);
            v413;
        }
    };
    const v415 = fs.readdir(from, v414);
    v415;
};
const v452 = function (from, filter) {
    const v417 = [];
    const v418 = [];
    var filelist = {};
    filelist.dirs = v417;
    filelist.files = v418;
    const v419 = fs.readdirSync(from);
    const v450 = function (file) {
        var filepath = path.join(from, file);
        var stats = fs.lstatSync(filepath);
        const v420 = stats.isDirectory();
        if (v420) {
            const v421 = !filter;
            const v422 = filter(filepath, 'directory', file);
            const v423 = v421 || v422;
            if (v423) {
                const v424 = filelist.dirs;
                const v425 = v424.indexOf(filepath);
                const v426 = -1;
                const v427 = v425 === v426;
                const v428 = filelist.dirs;
                const v429 = v428.push(filepath);
                const v430 = v427 && v429;
                v430;
                var files = fsPath.findSync(filepath, filter);
                const v431 = files.dirs;
                const v439 = function (_dir) {
                    const v432 = filelist.dirs;
                    const v433 = v432.indexOf(_dir);
                    const v434 = -1;
                    const v435 = v433 === v434;
                    const v436 = filelist.dirs;
                    const v437 = v436.push(_dir);
                    const v438 = v435 && v437;
                    v438;
                };
                const v440 = v431.forEach(v439);
                v440;
                const v441 = filelist.files;
                const v442 = files.files;
                const v443 = v441.concat(v442);
                filelist.files = v443;
            }
        } else {
            const v444 = stats.isFile();
            if (v444) {
                const v445 = !filter;
                const v446 = filter(filepath, 'file', file);
                const v447 = v445 || v446;
                if (v447) {
                    const v448 = filelist.files;
                    const v449 = v448.push(filepath);
                    v449;
                }
            }
        }
    };
    const v451 = v419.forEach(v450);
    v451;
    return filelist;
};
const v461 = function (dist, content, encoding, callback) {
    dist = path.resolve(dist);
    const v453 = typeof encoding;
    const v454 = v453 === 'function';
    if (v454) {
        callback = encoding;
        encoding = 'utf-8';
    }
    const v455 = path.dirname(dist);
    const v459 = function (err) {
        if (err) {
            const v456 = callback(err);
            v456;
        } else {
            const v457 = { encoding: encoding };
            const v458 = fs.writeFile(dist, content, v457, callback);
            v458;
        }
    };
    const v460 = fsPath.mkdir(v455, v459);
    v460;
};
const v468 = function (dist, content, encoding) {
    dist = path.resolve(dist);
    const v462 = typeof encoding;
    const v463 = v462 === 'function';
    if (v463) {
        callback = encoding;
        encoding = 'utf-8';
    }
    const v464 = path.dirname(dist);
    const v465 = fsPath.mkdirSync(v464);
    v465;
    const v466 = { encoding: encoding };
    const v467 = fs.writeFileSync(dist, content, v466);
    v467;
};
var fsPath = {};
fsPath._win32 = v236;
fsPath._supportExecSync = v240;
fsPath.mkdir = v262;
fsPath.mkdirSync = v268;
fsPath.copy = v305;
fsPath.copySync = v329;
fsPath.remove = v345;
fsPath.removeSync = v355;
fsPath.find = v416;
fsPath.findSync = v452;
fsPath.writeFile = v461;
fsPath.writeFileSync = v468;
module.exports = fsPath;