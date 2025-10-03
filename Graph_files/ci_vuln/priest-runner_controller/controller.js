var _ = require('underscore');
const v270 = require('util');
var inherits = v270.inherits;
const v271 = require('child_process');
var spawn = v271.spawn;
var path = require('path');
var fs = require('fs');
const v272 = require('events');
var EventEmitter = v272.EventEmitter;
var PriestError = require('./error.js');
var async = require('async');
var pack = require('../package.json');
module.exports = PriestController;
const PriestController = function (options) {
    const v273 = EventEmitter.call(this);
    v273;
    this.id = 0;
    this.children = [];
    const v274 = {};
    const v275 = this.options;
    const v276 = _.extend(v274, v275, options);
    this.options = v276;
    const v277 = {};
    this.names = v277;
};
const v278 = inherits(PriestController, EventEmitter);
v278;
const v279 = PriestController.prototype;
const v280 = process.cwd();
const v281 = {};
v281.COLORTERM = 1;
v281.FORCE_COLOR = 1;
const v282 = {};
v282.dir = v280;
v282.logs = 'logs';
v282.logSize = 1000;
v282.restart = 5;
v282.delay = 0;
v282.env = v281;
v279.options = v282;
const v283 = PriestController.prototype;
const v284 = pack.version;
v283.version = v284;
const v285 = PriestController.prototype;
const v299 = function (all, callback) {
    const v286 = arguments.length;
    const v287 = v286 === 1;
    if (v287) {
        callback = all;
        all = false;
    }
    var list;
    const v288 = !all;
    if (v288) {
        const v289 = this.children;
        const v296 = function (info) {
            const v290 = info.stopped;
            const v291 = !v290;
            const v292 = info.process;
            const v293 = v292.killed;
            const v294 = !v293;
            const v295 = v291 && v294;
            return v295;
        };
        list = v289.filter(v296);
    } else {
        const v297 = this.children;
        list = v297.slice();
    }
    const v298 = setImmediate(callback, null, list);
    v298;
};
v285.listProcess = v299;
const v300 = PriestController.prototype;
const v312 = function (name, callback) {
    const v301 = this.children;
    const v304 = function (child) {
        const v302 = child.name;
        const v303 = v302 === name;
        return v303;
    };
    const v305 = v301.filter(v304);
    const v310 = function (a, b) {
        const v306 = a.id;
        const v307 = b.id;
        const v308 = v306 - v307;
        const v309 = -v308;
        return v309;
    };
    var children = v305.sort(v310);
    const v311 = setImmediate(callback, null, children);
    v311;
};
v300.listNamedProcess = v312;
const v313 = PriestController.prototype;
const v344 = function (params, callback) {
    var self = this;
    const v314 = params.name;
    var name = v314 || null;
    const v315 = this.names;
    const v316 = name in v315;
    const v317 = name && v316;
    if (v317) {
        const v318 = 'Name "' + name;
        const v319 = v318 + '" already taken';
        const v320 = new PriestError(v319);
        const v321 = setImmediate(callback, v320);
        return v321;
    }
    const v322 = this.id;
    const v323 = ++v322;
    const v324 = new Date();
    const v325 = [];
    var info = {};
    info.id = v323;
    info.startedAt = null;
    info.createdAt = v324;
    info.name = name;
    info.params = params;
    info.log = v325;
    const v326 = this.names;
    v326[name] = true;
    const v327 = this.children;
    const v328 = v327.push(info);
    v328;
    var delay;
    const v329 = params.hasOwnProperty('delay');
    if (v329) {
        const v330 = params.delay;
        delay = v330 * 1000;
    } else {
        delay = 0;
    }
    const v341 = function () {
        const v331 = info._timeout;
        const v332 = delete v331;
        v332;
        const v333 = self.createChild(info);
        v333;
        var child = info.process;
        const v338 = function () {
            const v334 = child.killed;
            if (v334) {
                const v335 = new PriestError('Process was not started');
                const v336 = callback(v335);
                return v336;
            }
            const v337 = callback(null, info);
            v337;
        };
        const v339 = setImmediate(v338);
        const v340 = delay || v339;
        v340;
    };
    const v342 = setTimeout(v341, delay);
    info._timeout = v342;
    if (delay) {
        const v343 = console.error('DELAY', delay);
        v343;
    }
};
v313.startProcess = v344;
const v345 = PriestController.prototype;
const v355 = function (id, callback) {
    var info = this.getProcess(id);
    const v346 = !info;
    if (v346) {
        const v347 = new PriestError('Process not found');
        const v348 = setImmediate(callback, v347);
        return v348;
    }
    var self = this;
    const v353 = function (error) {
        if (error) {
            const v349 = callback(error);
            return v349;
        }
        const v350 = {};
        const v351 = info.params;
        var params = _.extend(v350, v351);
        const v352 = self.startProcess(params, callback);
        v352;
    };
    const v354 = this.stopProcess(id, v353);
    v354;
};
v345.restartProcess = v355;
const v356 = PriestController.prototype;
const v478 = function (info) {
    var self = this;
    var params = info.params;
    const v357 = params.cmd;
    const v358 = params.bin;
    var cmd = v357 || v358;
    const v359 = cmd === 'node';
    const v360 = cmd === 'iojs';
    const v361 = v359 || v360;
    const v362 = !cmd;
    var isNode = v361 || v362;
    const v363 = process.argv;
    const v364 = v363[0];
    cmd = cmd || v364;
    const v365 = params.args;
    const v366 = process.env;
    const v367 = v366.PATH;
    const v368 = { PATH: v367 };
    const v369 = process.env;
    const v370 = this.options;
    const v371 = v370.env;
    const v372 = params.env;
    const v373 = _.extend(v368, v369, v371, v372);
    const v374 = this.options;
    const v375 = v374.dir;
    const v376 = params.cwd;
    const v377 = v376 || '.';
    const v378 = path.resolve(v375, v377);
    let v379;
    if (isNode) {
        v379 = 'ipc';
    } else {
        v379 = null;
    }
    const v380 = [
        null,
        null,
        null,
        v379
    ];
    const v381 = {
        env: v373,
        cwd: v378,
        stdio: v380
    };
    var child = spawn(cmd, v365, v381);
    const v382 = info.id;
    child.priestId = v382;
    info.startedAt = new Date();
    var onStop = function (code) {
        info.stopped = true;
        info.code = code;
        const v383 = info.process;
        const v384 = delete v383;
        v384;
        const v385 = info._timeout;
        const v386 = delete v385;
        v386;
        const v387 = info.name;
        if (v387) {
            const v388 = self.names;
            const v389 = info.name;
            const v390 = v388[v389];
            const v391 = delete v390;
            v391;
        }
        const v392 = params.restart;
        if (v392) {
            let restart;
            const v393 = params.restart;
            const v394 = v393 === true;
            const v395 = self.options;
            const v396 = v395.restart;
            const v397 = params.restart;
            if (v394) {
                restart = v396;
            } else {
                restart = v397;
            }
            const v402 = function () {
                const v398 = info.id;
                const v400 = function (err) {
                    if (err) {
                        const v399 = console.error('Could not restart process', err);
                        v399;
                    }
                };
                const v401 = self.restartProcess(v398, v400);
                v401;
            };
            const v403 = restart * 1000;
            const v404 = setTimeout(v402, v403);
            info._timeout = v404;
        }
    };
    const v411 = function (error) {
        const v405 = info.log;
        const v406 = new Date();
        const v407 = error.toString();
        const v408 = {
            channel: 2,
            time: v406,
            data: v407
        };
        const v409 = v405.push(v408);
        v409;
        const v410 = onStop(1);
        v410;
    };
    const v412 = child.on('error', v411);
    v412;
    const v413 = child.stdout;
    const v434 = function (chunk) {
        const v414 = info.log;
        const v415 = new Date();
        const v416 = chunk.toString();
        const v417 = {
            channel: 1,
            time: v415,
            data: v416
        };
        const v418 = v414.push(v417);
        v418;
        const v419 = params.logSize;
        const v420 = self.options;
        const v421 = v420.logSize;
        var logSize = v419 || v421;
        const v422 = logSize < Infinity;
        const v423 = logSize > 0;
        const v424 = v422 && v423;
        const v425 = info.log;
        const v426 = v425.length;
        const v427 = logSize + 10;
        const v428 = v426 > v427;
        var needToCut = v424 && v428;
        if (needToCut) {
            const v429 = info.log;
            const v430 = info.log;
            const v431 = v430.length;
            const v432 = v431 - logSize;
            const v433 = v429.splice(0, v432);
            v433;
        }
    };
    const v435 = v413.on('data', v434);
    v435;
    const v436 = child.stderr;
    const v457 = function (chunk) {
        const v437 = info.log;
        const v438 = new Date();
        const v439 = chunk.toString();
        const v440 = {
            channel: 2,
            time: v438,
            data: v439
        };
        const v441 = v437.push(v440);
        v441;
        const v442 = params.logSize;
        const v443 = self.options;
        const v444 = v443.logSize;
        var logSize = v442 || v444;
        const v445 = logSize < Infinity;
        const v446 = logSize > 0;
        const v447 = v445 && v446;
        const v448 = info.log;
        const v449 = v448.length;
        const v450 = logSize + 10;
        const v451 = v449 > v450;
        var needToCut = v447 && v451;
        if (needToCut) {
            const v452 = info.log;
            const v453 = info.log;
            const v454 = v453.length;
            const v455 = v454 - logSize;
            const v456 = v452.splice(0, v455);
            v456;
        }
    };
    const v458 = v436.on('data', v457);
    v458;
    const v459 = child.on('exit', onStop);
    v459;
    const v460 = params.logs;
    if (v460) {
        const v461 = this.options;
        const v462 = v461.dir;
        const v463 = this.options;
        const v464 = v463.logs;
        var logs = path.resolve(v462, v464);
        var logName;
        const v465 = params.logs;
        const v466 = typeof v465;
        const v467 = v466 === 'string';
        if (v467) {
            logName = params.logs;
        } else {
            const v468 = params.name;
            const v469 = params.bin;
            logName = v468 || v469;
        }
        const v470 = logName + '.log';
        const v471 = path.join(logs, v470);
        var stdout = fs.createWriteStream(v471);
        const v472 = logName + '.error.log';
        const v473 = path.join(logs, v472);
        var stderr = fs.createWriteStream(v473);
        const v474 = child.stdout;
        const v475 = v474.pipe(stdout);
        v475;
        const v476 = child.stderr;
        const v477 = v476.pipe(stderr);
        v477;
    }
    info.process = child;
    return info;
};
v356.createChild = v478;
const v479 = PriestController.prototype;
const v509 = function (id, signal, callback) {
    const v480 = arguments.length;
    const v481 = v480 < 3;
    if (v481) {
        callback = signal;
        signal = undefined;
    }
    var self = this;
    var info = this.getProcess(id);
    const v482 = !info;
    if (v482) {
        const v483 = setImmediate(callback);
        return v483;
    }
    const v484 = info.stopped;
    if (v484) {
        const v485 = setImmediate(callback, null, info);
        return v485;
    }
    info.stopped = true;
    const v486 = info._timeout;
    if (v486) {
        const v487 = info._timeout;
        const v488 = clearTimeout(v487);
        v488;
        const v489 = info._timeout;
        const v490 = delete v489;
        v490;
        const v491 = setImmediate(callback, null, info);
        v491;
    } else {
        const v492 = info.process;
        const v493 = v492.removeAllListeners();
        v493;
        const v494 = info.process;
        const v495 = v494.kill(signal);
        v495;
        const v496 = info.process;
        const v507 = function (code) {
            info.code = code;
            const v497 = info.process;
            const v498 = delete v497;
            v498;
            const v499 = info._timeout;
            const v500 = delete v499;
            v500;
            const v501 = info.name;
            if (v501) {
                const v502 = self.names;
                const v503 = info.name;
                const v504 = v502[v503];
                const v505 = delete v504;
                v505;
            }
            const v506 = callback(null, info);
            v506;
        };
        const v508 = v496.on('exit', v507);
        v508;
    }
};
v479.stopProcess = v509;
const v510 = PriestController.prototype;
const v527 = function (id, callback) {
    const v511 = this.children;
    const v516 = function (a, b) {
        const v512 = a.id;
        const v513 = b.id;
        const v514 = v512 - v513;
        const v515 = -v514;
        return v515;
    };
    const v517 = v511.sort(v516);
    const v525 = function (child) {
        const v518 = child.id;
        const v519 = v518.toString();
        const v520 = id.toString();
        const v521 = v519 === v520;
        const v522 = child.name;
        const v523 = v522 === id;
        const v524 = v521 || v523;
        return v524;
    };
    var result = _.find(v517, v525);
    if (callback) {
        const v526 = setImmediate(callback, null, result);
        v526;
    } else {
        return result;
    }
};
v510.getProcess = v527;
const v528 = PriestController.prototype;
const v538 = function (signal, callback) {
    const v529 = arguments.length;
    const v530 = v529 < 2;
    if (v530) {
        callback = signal;
        signal = 'SIGKILL';
    }
    var self = this;
    const v531 = this.children;
    const v536 = function (info, done) {
        const v532 = info.stopped;
        if (v532) {
            const v533 = done();
            return v533;
        }
        const v534 = info.id;
        const v535 = self.stopProcess(v534, signal, callback);
        v535;
    };
    const v537 = async.forEach(v531, v536, callback);
    v537;
};
v528.stopAll = v538;