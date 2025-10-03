const v705 = function () {
    var Server;
    var _;
    var fs;
    var http;
    var mime;
    var minimatch;
    var path;
    var pkg;
    var url;
    pkg = require('../package.json');
    fs = require('fs');
    _ = require('underscore');
    mime = require('mime');
    http = require('http');
    url = require('url');
    path = require('path');
    minimatch = require('minimatch');
    const v704 = function () {
        const v354 = Server.prototype;
        const v355 = pkg.name;
        v354.name = v355;
        const v356 = Server.prototype;
        const v357 = pkg.version;
        v356.version = v357;
        const v358 = Server.prototype;
        const v360 = function () {
            const v359 = {};
            v359.port = 8000;
            v359.host = '0.0.0.0';
            v359.logs = false;
            v359.index = 'index.html';
            return v359;
        };
        v358.defaults = v360;
        const Server = function (options, exitCallback) {
            const v361 = options == null;
            if (v361) {
                options = {};
            }
            this.exitCallback = exitCallback;
            const v362 = this.defaults();
            const v363 = _.extend(v362, options);
            this.options = v363;
            const v364 = this._initLogs();
            v364;
            const v365 = this._bindCloseEvents();
            v365;
            const v366 = this.start();
            v366;
        };
        const v367 = Server.prototype;
        const v377 = function () {
            const v368 = this.request;
            const v369 = _.bind(v368, this);
            const v370 = http.createServer(v369);
            const v371 = this.options;
            const v372 = v371.port;
            const v373 = Number(v372);
            const v374 = this.options;
            const v375 = v374.host;
            const v376 = v370.listen(v373, v375);
            return this.server = v376;
        };
        v367.start = v377;
        const v378 = Server.prototype;
        const v392 = function (callback) {
            var ref;
            var ref1;
            const v379 = (ref = this.server) != null;
            if (v379) {
                const v380 = ref.close();
                v380;
            }
            const v381 = (ref1 = this._loger) != null;
            if (v381) {
                const v382 = ref1.end();
                v382;
            }
            const v383 = this.exitCallback;
            const v384 = typeof v383;
            const v385 = v384 === 'function';
            if (v385) {
                const v386 = this.exitCallback();
                v386;
            }
            const v387 = typeof callback;
            const v388 = v387 === 'function';
            const v389 = callback();
            const v390 = void 0;
            let v391;
            if (v388) {
                v391 = v389;
            } else {
                v391 = v390;
            }
            return v391;
        };
        v378.stop = v392;
        const v393 = Server.prototype;
        const v403 = function () {
            var exit;
            const v400 = function (_this) {
                const v399 = function () {
                    const v394 = process.removeAllListeners('SIGINT');
                    v394;
                    const v395 = process.removeAllListeners('SIGTERM');
                    v395;
                    const v397 = function () {
                        const v396 = process.exit();
                        return v396;
                    };
                    const v398 = _this.stop(v397);
                    return v398;
                };
                return v399;
            };
            exit = v400(this);
            const v401 = process.on('SIGINT', exit);
            v401;
            const v402 = process.on('SIGTERM', exit);
            return v402;
        };
        v393._bindCloseEvents = v403;
        const v404 = Server.prototype;
        const v416 = function () {
            const v405 = this.options;
            const v406 = v405.logs;
            if (v406) {
                const v407 = this.options;
                const v408 = v407.logs;
                const v409 = typeof v408;
                const v410 = v409 === 'string';
                if (v410) {
                    const v411 = this.options;
                    const v412 = v411.logs;
                    const v413 = { flags: 'a' };
                    const v414 = fs.createWriteStream(v412, v413);
                    return this._logger = v414;
                } else {
                    const v415 = console.log;
                    return this._log = v415;
                }
            }
        };
        v404._initLogs = v416;
        const v417 = Server.prototype;
        const v538 = function (req, res) {
            var filePath;
            var headers;
            var method;
            var time;
            time = new Date();
            filePath = null;
            method = null;
            headers = null;
            const v422 = function (_this) {
                const v421 = function (resolve, reject) {
                    var uri;
                    const v418 = req.url;
                    uri = url.parse(v418);
                    const v419 = uri.pathname;
                    const v420 = resolve(v419);
                    return v420;
                };
                return v421;
            };
            const v423 = v422(this);
            const v424 = new Promise(v423);
            const v438 = function (_this) {
                const v437 = function (pathname) {
                    var rootPath;
                    const v425 = process.cwd();
                    const v426 = _this.options;
                    const v427 = v426.root;
                    const v428 = v427 || './';
                    rootPath = path.resolve(v425, v428);
                    filePath = pathname;
                    const v429 = _this.options;
                    const v430 = v429.index;
                    const v431 = '/' + v430;
                    filePath = filePath.replace(/\/$/, v431);
                    filePath = filePath.replace(/^\//, '');
                    filePath = path.join(rootPath, filePath);
                    const v432 = filePath.indexOf(rootPath);
                    const v433 = v432 !== 0;
                    if (v433) {
                        const v434 = 'Bad URL: ' + pathname;
                        const v435 = {
                            code: 400,
                            message: v434
                        };
                        throw v435;
                    }
                    method = req.method;
                    headers = req.headers;
                    const v436 = _this.processRequest(res, filePath, method, headers);
                    return v436;
                };
                return v437;
            };
            const v439 = v438(this);
            const v450 = function (_this) {
                const v449 = function (err) {
                    const v440 = err.message;
                    const v441 = 'Message: ' + v440;
                    const v442 = v441 + '\nURL: ';
                    const v443 = req.url;
                    const v444 = v442 + v443;
                    const v445 = v444 + '\n\n';
                    const v446 = err.stack;
                    const v447 = v445 + v446;
                    const v448 = _this.errorCode(res, 400, v447);
                    return v448;
                };
                return v449;
            };
            const v451 = v450(this);
            const v452 = v424.then(v439, v451);
            const v494 = function (_this) {
                const v493 = function (err) {
                    var ref;
                    const v453 = err.code;
                    const v454 = v453 === 'ENOENT';
                    if (v454) {
                        const v455 = err.path;
                        const v456 = _this.handlerNotFound(res, v455, method, headers);
                        return v456;
                    } else {
                        const v457 = (ref = err.code) === 400;
                        const v458 = ref === 405;
                        const v459 = v457 || v458;
                        if (v459) {
                            const v460 = time.toJSON();
                            const v461 = '[' + v460;
                            const v462 = v461 + '] Error: ';
                            const v463 = err.message;
                            const v464 = v462 + v463;
                            const v465 = v464 + ', Code: ';
                            const v466 = err.code;
                            const v467 = v465 + v466;
                            const v468 = _this.log(v467);
                            v468;
                            const v469 = err.message;
                            const v470 = 'Message: ' + v469;
                            const v471 = v470 + '\nCode: ';
                            const v472 = err.code;
                            const v473 = v471 + v472;
                            const v474 = _this.errorCode(res, 405, v473);
                            return v474;
                        } else {
                            const v475 = time.toJSON();
                            const v476 = '[' + v475;
                            const v477 = v476 + '] Error: ';
                            const v478 = err.message;
                            const v479 = v477 + v478;
                            const v480 = v479 + ', Code: ';
                            const v481 = err.code;
                            const v482 = v480 + v481;
                            const v483 = _this.log(v482);
                            v483;
                            const v484 = err.message;
                            const v485 = 'Message: ' + v484;
                            const v486 = v485 + '\nCode: ';
                            const v487 = err.code;
                            const v488 = v486 + v487;
                            const v489 = v488 + '\n\n';
                            const v490 = err.stack;
                            const v491 = v489 + v490;
                            const v492 = _this.errorCode(res, 500, v491);
                            return v492;
                        }
                    }
                };
                return v493;
            };
            const v495 = v494(this);
            const v496 = v452['catch'](v495);
            const v513 = function (_this) {
                const v512 = function (err) {
                    const v497 = time.toJSON();
                    const v498 = '[' + v497;
                    const v499 = v498 + '] Error: ';
                    const v500 = err.message;
                    const v501 = v499 + v500;
                    const v502 = _this.log(v501);
                    v502;
                    const v503 = err.message;
                    const v504 = 'Message: ' + v503;
                    const v505 = v504 + '\nCode: ';
                    const v506 = err.code;
                    const v507 = v505 + v506;
                    const v508 = v507 + '\n\n';
                    const v509 = err.stack;
                    const v510 = v508 + v509;
                    const v511 = _this.errorCode(res, 500, v510);
                    return v511;
                };
                return v512;
            };
            const v514 = v513(this);
            const v515 = v496['catch'](v514);
            const v535 = function (_this) {
                const v534 = function (code) {
                    var host;
                    var log;
                    const v516 = req.headers;
                    const v517 = v516.host;
                    const v518 = _this.options;
                    const v519 = v518.port;
                    const v520 = 'localhost:' + v519;
                    const v521 = v517 || v520;
                    const v522 = req.url;
                    host = path.join(v521, v522);
                    const v523 = time.toJSON();
                    const v524 = '[' + v523;
                    log = v524 + ']';
                    const v525 = Date.now();
                    const v526 = v525 - time;
                    const v527 = ' (+' + v526;
                    log += v527 + 'ms):';
                    log += ' ' + code;
                    log += ' ' + method;
                    log += ' ' + host;
                    if (filePath) {
                        log += ' - ' + filePath;
                    }
                    const v528 = req.headers;
                    const v529 = v528['user-agent'];
                    if (v529) {
                        const v530 = req.headers;
                        const v531 = v530['user-agent'];
                        const v532 = ' (' + v531;
                        log += v532 + ')';
                    }
                    const v533 = _this.log(log);
                    return v533;
                };
                return v534;
            };
            const v536 = v535(this);
            const v537 = v515.then(v536);
            return v537;
        };
        v417.request = v538;
        const v539 = Server.prototype;
        const v545 = function (filePath) {
            var headers;
            const v540 = this.name;
            const v541 = v540 + '/';
            const v542 = this.version;
            const v543 = v541 + v542;
            headers['Server'] = v543;
            headers = {};
            headers = {};
            if (filePath) {
                const v544 = mime.lookup(filePath);
                headers['Content-Type'] = v544;
            }
            return headers;
        };
        v539.getHeaders = v545;
        const v546 = Server.prototype;
        const v570 = function (range, size) {
            var end;
            var firstRangeStr;
            var ref;
            var start;
            const v547 = range == null;
            if (v547) {
                range = '';
            }
            const v548 = size == null;
            if (v548) {
                size = 0;
            }
            const v549 = String(range);
            const v550 = v549.indexOf('bytes=');
            const v551 = v550 !== 0;
            if (v551) {
                return null;
            }
            const v552 = range.replace('bytes=', '');
            const v553 = v552.split(',');
            firstRangeStr = v553[0];
            const v554 = firstRangeStr.indexOf('-');
            const v555 = -1;
            const v556 = v554 > v555;
            const v557 = !v556;
            if (v557) {
                return null;
            }
            ref = firstRangeStr.split('-'), start = ref[0], end = ref[1];
            start = parseInt(start, 10);
            end = parseInt(end, 10);
            const v558 = _.isNaN(start);
            if (v558) {
                start = size - end;
                end = size - 1;
            } else {
                const v559 = _.isNaN(end);
                if (v559) {
                    end = size - 1;
                }
            }
            const v560 = size - 1;
            const v561 = end > v560;
            if (v561) {
                end = size - 1;
            }
            const v562 = _.isNaN(start);
            const v563 = _.isNaN(end);
            const v564 = v562 || v563;
            const v565 = start > end;
            const v566 = v564 || v565;
            const v567 = start < 0;
            const v568 = v566 || v567;
            if (v568) {
                return null;
            }
            const v569 = {};
            v569.start = start;
            v569.end = end;
            return v569;
        };
        v546._parseRange = v570;
        const v571 = Server.prototype;
        const v578 = function (path) {
            const v576 = function (resolve, reject) {
                const v574 = function (err, stats) {
                    if (err) {
                        const v572 = reject(err);
                        return v572;
                    }
                    const v573 = resolve(stats);
                    return v573;
                };
                const v575 = fs.stat(path, v574);
                return v575;
            };
            const v577 = new Promise(v576);
            return v577;
        };
        v571.fileStats = v578;
        const v579 = Server.prototype;
        const v582 = function (res, filePath, method, headers) {
            var handler;
            if (handler = this.handle(filePath)) {
                const v580 = handler.call(this, res, filePath, method, headers);
                return v580;
            } else {
                const v581 = this.handlerStaticFile(res, filePath, method, headers);
                return v581;
            }
        };
        v579.processRequest = v582;
        const v583 = Server.prototype;
        const v586 = function (filePath) {
            var handlers;
            var pattern;
            handlers = _.result(this, 'handlers');
            for (pattern in handlers) {
                const v584 = minimatch(filePath, pattern);
                if (v584) {
                    const v585 = handlers[pattern];
                    return v585;
                }
            }
            return null;
        };
        v583.handle = v586;
        const v587 = Server.prototype;
        const v589 = function () {
            const v588 = {};
            return v588;
        };
        v587.handlers = v589;
        const v590 = Server.prototype;
        const v636 = function (res, filePath, method, reqHeaders) {
            var load;
            const v607 = function (range, headers, successCode) {
                const v605 = function (resolve, reject) {
                    const v591 = fs.createReadStream(filePath, range);
                    const v593 = function () {
                        const v592 = res.writeHead(successCode, headers);
                        return v592;
                    };
                    const v594 = v591.on('open', v593);
                    const v596 = function (err) {
                        const v595 = reject(err);
                        return v595;
                    };
                    const v597 = v594.on('error', v596);
                    const v599 = function (data) {
                        const v598 = res.write(data);
                        return v598;
                    };
                    const v600 = v597.on('data', v599);
                    const v603 = function () {
                        const v601 = res.end();
                        v601;
                        const v602 = resolve(successCode);
                        return v602;
                    };
                    const v604 = v600.on('end', v603);
                    return v604;
                };
                const v606 = new Promise(v605);
                return v606;
            };
            load = v607;
            const v608 = Promise.resolve();
            const v611 = function (_this) {
                const v610 = function () {
                    const v609 = _this.fileStats(filePath);
                    return v609;
                };
                return v610;
            };
            const v612 = v611(this);
            const v613 = v608.then(v612);
            const v633 = function (_this) {
                const v632 = function (stats) {
                    var code;
                    var headers;
                    var range;
                    const v614 = reqHeaders['range'];
                    const v615 = stats.size;
                    range = _this._parseRange(v614, v615);
                    if (range) {
                        code = 206;
                    } else {
                        code = 200;
                    }
                    headers = _this.getHeaders(filePath);
                    headers['Accept-Ranges'] = 'bytes';
                    if (range) {
                        const v616 = range.start;
                        const v617 = v616 + '-';
                        const v618 = range.end;
                        const v619 = v617 + v618;
                        const v620 = v619 + '/';
                        const v621 = stats.size;
                        headers['Content-Range'] = v620 + v621;
                        const v622 = range.end;
                        const v623 = range.start;
                        headers['Content-Length'] = v622 - v623;
                    } else {
                        const v624 = stats.size;
                        headers['Content-Length'] = v624;
                    }
                    const v625 = method === 'HEAD';
                    if (v625) {
                        const v626 = res.writeHead(code, headers);
                        v626;
                        const v627 = res.end();
                        v627;
                        return code;
                    } else {
                        const v628 = method === 'GET';
                        if (v628) {
                            const v629 = load(range, headers, code);
                            return v629;
                        } else {
                            const v630 = method + ' method not allowed';
                            const v631 = {
                                code: 405,
                                message: v630
                            };
                            throw v631;
                        }
                    }
                };
                return v632;
            };
            const v634 = v633(this);
            const v635 = v613.then(v634);
            return v635;
        };
        v590.handlerStaticFile = v636;
        const v637 = Server.prototype;
        const v675 = function (res, filePath, method, headers) {
            var code;
            var errorPath;
            var notFound;
            code = 404;
            const v641 = function (_this) {
                const v640 = function () {
                    const v638 = 'Path: ' + filePath;
                    const v639 = _this.errorCode(res, code, v638);
                    return v639;
                };
                return v640;
            };
            notFound = v641(this);
            const v642 = this.options;
            const v643 = v642[code];
            const v644 = !v643;
            if (v644) {
                const v645 = notFound();
                return v645;
            }
            const v646 = process.cwd();
            const v647 = this.options;
            const v648 = v647[code];
            errorPath = path.resolve(v646, v648);
            const v649 = this.getHeaders();
            const v650 = { 'Content-Type': 'text/html' };
            headers = _.extend(v649, v650);
            const v651 = method === 'HEAD';
            if (v651) {
                const v652 = res.writeHead(code, headers);
                v652;
                const v653 = res.end();
                v653;
                return code;
            } else {
                const v654 = method === 'GET';
                if (v654) {
                    const v670 = function (_this) {
                        const v669 = function (resolve, reject) {
                            const v655 = fs.createReadStream(errorPath);
                            const v657 = function () {
                                const v656 = res.writeHead(code, headers);
                                return v656;
                            };
                            const v658 = v655.on('open', v657);
                            const v660 = function (err) {
                                const v659 = reject(err);
                                return v659;
                            };
                            const v661 = v658.on('error', v660);
                            const v663 = function (data) {
                                const v662 = res.write(data);
                                return v662;
                            };
                            const v664 = v661.on('data', v663);
                            const v667 = function () {
                                const v665 = res.end();
                                v665;
                                const v666 = resolve(code);
                                return v666;
                            };
                            const v668 = v664.on('end', v667);
                            return v668;
                        };
                        return v669;
                    };
                    const v671 = v670(this);
                    const v672 = new Promise(v671);
                    return v672;
                } else {
                    const v673 = method + ' method not allowed';
                    const v674 = {
                        code: 405,
                        message: v673
                    };
                    throw v674;
                }
            }
        };
        v637.handlerNotFound = v675;
        const v676 = Server.prototype;
        const v692 = function (res, code, text) {
            const v677 = text == null;
            if (v677) {
                text = '';
            }
            if (text) {
                const v678 = '<pre>' + text;
                text = v678 + '</pre>';
            }
            const v679 = this.getHeaders();
            const v680 = { 'Content-Type': 'text/html' };
            const v681 = _.extend(v679, v680);
            const v682 = res.writeHead(code, v681);
            v682;
            const v683 = '<h1>' + code;
            const v684 = v683 + ' ';
            const v685 = http.STATUS_CODES;
            const v686 = v685[code];
            const v687 = v684 + v686;
            const v688 = v687 + '</h1>';
            const v689 = v688 + text;
            const v690 = res.write(v689);
            v690;
            const v691 = res.end();
            v691;
            return code;
        };
        v676.errorCode = v692;
        const v693 = Server.prototype;
        const v703 = function (string) {
            var ref;
            const v694 = (ref = this._logger) != null;
            if (v694) {
                const v695 = string + '\n';
                const v696 = ref.write(v695);
                v696;
            }
            const v697 = this._log;
            const v698 = typeof v697;
            const v699 = v698 === 'function';
            const v700 = this._log(string);
            const v701 = void 0;
            let v702;
            if (v699) {
                v702 = v700;
            } else {
                v702 = v701;
            }
            return v702;
        };
        v693.log = v703;
        return Server;
    };
    Server = v704();
    module.exports = Server;
};
const v706 = v705.call(this);
v706;