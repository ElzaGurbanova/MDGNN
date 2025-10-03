var express = require('express');
var _ = require('underscore');
var Priest = require('./controller.js');
var AnsiConverter = require('ansi-to-html');
var uncolor = require('uncolor');
module.exports = priestMiddleware;
const priestMiddleware = function (options) {
    var controller;
    const v273 = !options;
    if (v273) {
        controller = new Priest();
        options = {};
    } else {
        const v274 = options instanceof Priest;
        if (v274) {
            controller = options;
            options = {};
        }
    }
    var router = new express.Router();
    const v284 = function (req, res, next) {
        const v282 = function (err, list) {
            if (err) {
                const v275 = next(err);
                return v275;
            }
            const v280 = function (info) {
                var result = normalize(info);
                const v276 = result.process;
                const v277 = delete v276;
                v277;
                const v278 = result.log;
                const v279 = delete v278;
                v279;
                return result;
            };
            list = list.map(v280);
            const v281 = res.json(list);
            v281;
        };
        const v283 = controller.listProcess(v282);
        v283;
    };
    const v285 = router.get('/', v284);
    v285;
    const v295 = function (req, res, next) {
        const v293 = function (err, list) {
            if (err) {
                const v286 = next(err);
                return v286;
            }
            const v291 = function (info) {
                var result = normalize(info);
                const v287 = result.process;
                const v288 = delete v287;
                v288;
                const v289 = result.log;
                const v290 = delete v289;
                v290;
                return result;
            };
            list = list.map(v291);
            const v292 = res.json(list);
            v292;
        };
        const v294 = controller.listProcess(true, v293);
        v294;
    };
    const v296 = router.get('/all', v295);
    v296;
    const v300 = function (req, res, next) {
        const v297 = controller.version;
        const v298 = {
            name: 'Priest',
            version: v297
        };
        const v299 = res.json(v298);
        v299;
    };
    const v301 = router.get('/about', v300);
    v301;
    const v318 = function (req, res, next) {
        var params = req.body;
        const v302 = params.bin;
        const v303 = !v302;
        const v304 = params.args;
        const v305 = !v304;
        const v306 = v303 && v305;
        if (v306) {
            const v307 = badRequest(res);
            return v307;
        }
        const v316 = function (err, info) {
            if (err) {
                const v308 = next(err);
                return v308;
            }
            const v309 = !info;
            if (v309) {
                const v310 = serverError('Unknown error');
                return v310;
            }
            var result = normalize(info);
            const v311 = result.process;
            const v312 = delete v311;
            v312;
            const v313 = result.log;
            const v314 = delete v313;
            v314;
            const v315 = res.json(result);
            v315;
        };
        const v317 = controller.startProcess(params, v316);
        v317;
    };
    const v319 = router.post('/', v318);
    v319;
    const v324 = function (req, res, next) {
        const v322 = function (err) {
            if (err) {
                const v320 = next(err);
                return v320;
            }
            const v321 = res.json(true);
            v321;
        };
        const v323 = controller.stopAll(v322);
        v323;
    };
    const v325 = router.delete('/', v324);
    v325;
    const v338 = function (req, res, next) {
        const v326 = req.params;
        const v327 = v326.id;
        const v336 = function (err, info) {
            if (err) {
                const v328 = next(err);
                return v328;
            }
            const v329 = !info;
            if (v329) {
                const v330 = notFound(res);
                return v330;
            }
            var result = normalize(info);
            const v331 = result.process;
            const v332 = delete v331;
            v332;
            const v333 = result.log;
            const v334 = delete v333;
            v334;
            const v335 = res.json(result);
            v335;
        };
        const v337 = controller.restartProcess(v327, v336);
        v337;
    };
    const v339 = router.put('/:id', v338);
    v339;
    const v352 = function (req, res, next) {
        const v340 = req.params;
        const v341 = v340.id;
        const v350 = function (err, info) {
            if (err) {
                const v342 = next(err);
                return v342;
            }
            const v343 = !info;
            if (v343) {
                const v344 = notFound(res);
                return v344;
            }
            var result = normalize(info);
            const v345 = result.process;
            const v346 = delete v345;
            v346;
            const v347 = result.log;
            const v348 = delete v347;
            v348;
            const v349 = res.json(result);
            v349;
        };
        const v351 = controller.getProcess(v341, v350);
        v351;
    };
    const v353 = router.get('/:id', v352);
    v353;
    const v362 = function (req, res, next) {
        const v354 = req.params;
        const v355 = v354.id;
        const v360 = function (err, info) {
            if (err) {
                const v356 = next(err);
                return v356;
            }
            const v357 = !info;
            if (v357) {
                const v358 = notFound(res);
                return v358;
            }
            const v359 = res.json(true);
            v359;
        };
        const v361 = controller.stopProcess(v355, v360);
        v361;
    };
    const v363 = router.delete('/:id', v362);
    v363;
    const v434 = function (req, res, next) {
        const v364 = req.params;
        const v365 = v364.id;
        const v432 = function (err, info) {
            if (err) {
                const v366 = next(err);
                return v366;
            }
            const v367 = !info;
            if (v367) {
                const v368 = notFound(res);
                return v368;
            }
            var logs = info.log;
            const v369 = req.query;
            const v370 = v369.from;
            if (v370) {
                const v371 = req.query;
                const v372 = v371.from;
                var date = new Date(v372);
                const v375 = function (item) {
                    const v373 = item.time;
                    const v374 = v373 >= date;
                    return v374;
                };
                logs = logs.filter(v375);
            } else {
                const v376 = req.query;
                const v377 = v376.limit;
                const v378 = v377 || 20;
                const v379 = -v378;
                logs = logs.slice(v379);
            }
            const v380 = req.query;
            const v381 = v380.format;
            var format = v381 || 'plain';
            var filterFn;
            const v382 = { stream: true };
            var converter = new AnsiConverter(v382);
            const v383 = format === 'html';
            if (v383) {
                const v386 = function (item) {
                    const v384 = item.data;
                    const v385 = converter.toHtml(v384);
                    return v385;
                };
                filterFn = v386;
            } else {
                const v389 = function (item) {
                    const v387 = item.data;
                    const v388 = uncolor(v387);
                    return v388;
                };
                filterFn = v389;
            }
            logs = logs.map(filterFn);
            const v390 = req.query;
            const v391 = v390.stream;
            const v392 = !v391;
            if (v392) {
                const v393 = 'text/' + format;
                const v394 = res.header('content-type', v393);
                v394;
                const v395 = logs.join('');
                const v396 = res.end(v395);
                v396;
                return;
            }
            var child = info.process;
            var onData;
            var write = function (data) {
                const v397 = data.split('\n');
                const v398 = v397.join('\ndata:');
                const v399 = 'data:' + v398;
                const v400 = v399 + '\n\n';
                const v401 = res.write(v400);
                v401;
            };
            const v402 = req.query;
            const v403 = v402.format;
            const v404 = v403 === 'html';
            if (v404) {
                const v405 = { stream: true };
                converter = new AnsiConverter(v405);
                const v408 = function (chunk) {
                    const v406 = chunk.toString();
                    var data = converter.toHtml(v406);
                    const v407 = write(data);
                    v407;
                };
                onData = v408;
            } else {
                const v411 = function (chunk) {
                    const v409 = chunk.toString();
                    var data = uncolor(v409);
                    const v410 = write(data);
                    v410;
                };
                onData = v411;
            }
            const v412 = info.stopped;
            if (v412) {
                const v413 = 'text/' + format;
                const v414 = res.header('content-type', v413);
                v414;
                const v415 = logs.join('');
                const v416 = onData(v415);
                v416;
                return;
            }
            var onExit = function () {
                const v417 = res.end();
                v417;
            };
            const v418 = child.stdout;
            const v419 = v418.on('data', onData);
            v419;
            const v420 = child.stderr;
            const v421 = v420.on('data', onData);
            v421;
            const v422 = child.on('exit', onExit);
            v422;
            const v423 = {
                'content-type': 'text/event-stream',
                'cache-control': 'no-cache',
                'connection': 'keep-alive'
            };
            const v424 = res.writeHead(200, v423);
            v424;
            const v430 = function () {
                const v425 = child.stdout;
                const v426 = v425.removeListener('data', onData);
                v426;
                const v427 = child.stderr;
                const v428 = v427.removeListener('data', onData);
                v428;
                const v429 = child.removeListener('exit', onExit);
                v429;
            };
            const v431 = req.on('close', v430);
            v431;
        };
        const v433 = controller.getProcess(v365, v432);
        v433;
    };
    const v435 = router.get('/:id/log', v434);
    v435;
    const v448 = function (req, res, next) {
        const v436 = req.params;
        const v437 = v436.id;
        const v446 = function (err, list) {
            if (err) {
                const v438 = next(err);
                return v438;
            }
            const v444 = function (info) {
                const v439 = {};
                var result = _.extend(v439, info);
                const v440 = result.process;
                const v441 = delete v440;
                v441;
                const v442 = result.log;
                const v443 = delete v442;
                v443;
                return result;
            };
            list = list.map(v444);
            const v445 = res.json(list);
            v445;
        };
        const v447 = controller.listNamedProcess(v437, v446);
        v447;
    };
    const v449 = router.get('/:id/list', v448);
    v449;
    const v466 = function (err, req, res, next) {
        if (err) {
            const v450 = err.stack;
            const v451 = console.error(v450);
            v451;
            const v452 = res.status(500);
            const v458 = function () {
                const v453 = err.message;
                const v454 = err.toString();
                const v455 = v453 || v454;
                const v456 = {
                    status: false,
                    error: v455
                };
                const v457 = res.json(v456);
                v457;
            };
            const v460 = function () {
                const v459 = res.end(err);
                v459;
            };
            const v462 = function () {
                const v461 = res.end(err);
                v461;
            };
            const v463 = {
                json: v458,
                html: v460,
                default: v462
            };
            const v464 = v452.format(v463);
            return v464;
        }
        const v465 = next();
        v465;
    };
    const v467 = router.use(v466);
    v467;
    const normalize = function (target) {
        const v468 = _.isObject(target);
        const v469 = !v468;
        if (v469) {
            return target;
        }
        const v470 = Array.isArray(target);
        if (v470) {
            const v471 = target.map(normalize);
            return v471;
        }
        var result = {};
        const v472 = Object.getOwnPropertyNames(target);
        const v483 = function (name) {
            const v473 = name.charAt(0);
            const v474 = v473 === '_';
            if (v474) {
                return;
            }
            var value = target[name];
            const v475 = _.isObject(value);
            if (v475) {
                const v476 = value.constructor;
                const v477 = v476 === Object;
                if (v477) {
                    const v478 = normalize(value);
                    result[name] = v478;
                } else {
                    const v479 = Array.isArray(value);
                    if (v479) {
                        const v480 = value.map(normalize);
                        result[name] = v480;
                    } else {
                        const v481 = value instanceof Date;
                        if (v481) {
                            const v482 = value.toISOString();
                            result[name] = v482;
                        }
                    }
                }
            } else {
                result[name] = value;
            }
        };
        const v484 = v472.forEach(v483);
        v484;
        return result;
    };
    return router;
};
const sendResponse = function (res, data) {
    const v485 = res.status(200);
    const v490 = function () {
        const v486 = {};
        const v487 = data || v486;
        const v488 = {
            status: true,
            result: v487
        };
        const v489 = res.json(v488);
        v489;
    };
    const v492 = function () {
        const v491 = res.send(data);
        v491;
    };
    const v494 = function () {
        const v493 = res.send(data);
        v493;
    };
    const v495 = {
        json: v490,
        html: v492,
        default: v494
    };
    const v496 = v485.format(v495);
    v496;
};
const badRequest = function (res, message) {
    message = message || 'Bad request';
    const v497 = res.status(400);
    const v500 = function () {
        const v498 = {
            status: false,
            error: message
        };
        const v499 = res.json(v498);
        v499;
    };
    const v503 = function () {
        const v501 = res.type('text/plain');
        const v502 = v501.send(message);
        v502;
    };
    const v506 = function () {
        const v504 = res.type('text/plain');
        const v505 = v504.send(message);
        v505;
    };
    const v507 = {
        json: v500,
        html: v503,
        default: v506
    };
    const v508 = v497.format(v507);
    v508;
};
const notFound = function (res, message) {
    message = message || 'Not found';
    const v509 = res.status(404);
    const v512 = function () {
        const v510 = {
            status: false,
            error: message
        };
        const v511 = res.json(v510);
        v511;
    };
    const v515 = function () {
        const v513 = res.type('text/plain');
        const v514 = v513.send(message);
        v514;
    };
    const v518 = function () {
        const v516 = res.type('text/plain');
        const v517 = v516.send(message);
        v517;
    };
    const v519 = {
        json: v512,
        html: v515,
        default: v518
    };
    const v520 = v509.format(v519);
    v520;
};
const forbidden = function (res, message) {
    message = message || 'Access forbidden';
    const v521 = res.status(403);
    const v524 = function () {
        const v522 = {
            status: false,
            error: message
        };
        const v523 = res.json(v522);
        v523;
    };
    const v527 = function () {
        const v525 = res.type('text/plain');
        const v526 = v525.html(message);
        v526;
    };
    const v530 = function () {
        const v528 = res.type('text/plain');
        const v529 = v528.send(message);
        v529;
    };
    const v531 = {
        json: v524,
        html: v527,
        default: v530
    };
    const v532 = v521.format(v531);
    v532;
};
const serverError = function (res, message) {
    message = message || 'Server error';
    const v533 = res.status(500);
    const v536 = function () {
        const v534 = {
            status: false,
            error: message
        };
        const v535 = res.json(v534);
        v535;
    };
    const v539 = function () {
        const v537 = res.type('text/plain');
        const v538 = v537.send(message);
        v538;
    };
    const v542 = function () {
        const v540 = res.type('text/plain');
        const v541 = v540.send(message);
        v541;
    };
    const v543 = {
        json: v536,
        html: v539,
        default: v542
    };
    const v544 = v533.format(v543);
    v544;
};