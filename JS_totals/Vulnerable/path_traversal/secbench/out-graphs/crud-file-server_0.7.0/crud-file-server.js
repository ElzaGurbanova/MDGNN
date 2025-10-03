var fs = require('fs');
var cleanUrl = function (url) {
    url = decodeURIComponent(url);
    const v265 = url.indexOf('..');
    const v266 = v265.length;
    let v267 = v266 > 0;
    while (v267) {
        url = url.replace('..', '');
        v267 = v266 > 0;
    }
    return url;
};
const v528 = function (vpath, path, req, res, readOnly, logHeadRequests) {
    var writeError = function (err, code) {
        code = code || 500;
        const v268 = 'Error ' + code;
        const v269 = v268 + ': ';
        const v270 = v269 + err;
        const v271 = console.log(v270);
        v271;
        try {
            res.statusCode = code;
            const v272 = res.setHeader('Content-Type', 'application/json');
            v272;
            const v273 = JSON.stringify(err);
            const v274 = res.end(v273);
            v274;
        } catch (resErr) {
            const v275 = 'failed to write error to response: ' + resErr;
            const v276 = console.log(v275);
            v276;
        }
    };
    const v277 = path.lastIndexOf('/');
    const v278 = path.length;
    const v279 = v278 - 1;
    const v280 = v277 !== v279;
    if (v280) {
        path += '/';
    }
    const v281 = require('url');
    const v282 = req.url;
    var parsedUrl = v281.parse(v282);
    let query;
    const v283 = {};
    const v284 = require('querystring');
    const v285 = parsedUrl.query;
    const v286 = v284.parse(v285);
    if (query) {
        query = v283;
    } else {
        query = v286;
    }
    const v287 = parsedUrl.pathname;
    var url = cleanUrl(v287);
    const v288 = url.lastIndexOf('/');
    const v289 = url.length;
    const v290 = v289 - 1;
    const v291 = v288 === v290;
    if (v291) {
        const v292 = url.length;
        url = url.slice(0, v292);
    }
    const v293 = url[0];
    const v294 = v293 === '/';
    if (v294) {
        const v295 = url.length;
        url = url.slice(1, v295);
    }
    const v296 = url.indexOf(vpath);
    const v297 = v296 != 0;
    const v298 = vpath && v297;
    if (v298) {
        const v299 = console.log('url does not begin with vpath');
        v299;
        const v300 = 'url [' + url;
        const v301 = v300 + '] does not begin with vpath [';
        const v302 = v301 + vpath;
        const v303 = v302 + ']';
        throw v303;
    }
    const v304 = req.method;
    const v305 = v304 != 'HEAD';
    if (v305) {
        const v306 = req.method;
        const v307 = v306 + ' ';
        const v308 = req.url;
        const v309 = v307 + v308;
        const v310 = console.log(v309);
        v310;
    }
    let relativePath;
    const v311 = url.indexOf(vpath);
    const v312 = v311 == 0;
    const v313 = vpath && v312;
    const v314 = vpath.length;
    const v315 = v314 + 1;
    const v316 = url.length;
    const v317 = url.slice(v315, v316);
    const v318 = path + v317;
    const v319 = path + url;
    if (v313) {
        relativePath = v318;
    } else {
        relativePath = v319;
    }
    try {
        const v320 = req.method;
        const v321 = v320 != 'GET';
        const v322 = readOnly && v321;
        if (v322) {
            const v323 = req.method;
            const v324 = v323 + ' forbidden on this resource';
            const v325 = writeError(v324, 403);
            v325;
        } else {
            const v326 = req.method;
            switch (v326) {
            case 'HEAD':
                if (logHeadRequests) {
                    const v327 = 'head: ' + relativePath;
                    const v328 = console.log(v327);
                    v328;
                }
                const v355 = function (err, stats) {
                    if (err) {
                        const v329 = writeError(err);
                        v329;
                    } else {
                        const v330 = stats.mtime;
                        const v331 = res.setHeader('Last-Modified', v330);
                        v331;
                        const v332 = res.setHeader('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
                        v332;
                        const v333 = res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                        v333;
                        const v334 = res.setHeader('Cache-Control', 'post-check=0, pre-check=0');
                        v334;
                        const v335 = res.setHeader('Pragma', 'no-cache');
                        v335;
                        const v336 = stats.isDirectory();
                        if (v336) {
                            const v337 = query.type;
                            const v338 = v337 == 'json';
                            const v339 = query.dir;
                            const v340 = v339 == 'json';
                            const v341 = v338 || v340;
                            let v342;
                            if (v341) {
                                v342 = 'application/json';
                            } else {
                                v342 = 'text/html';
                            }
                            const v343 = res.setHeader('Content-Type', v342);
                            v343;
                        } else {
                            const v344 = query.type;
                            const v345 = v344 == 'json';
                            const v346 = query.dir;
                            const v347 = v346 == 'json';
                            const v348 = v345 || v347;
                            if (v348) {
                                const v349 = res.setHeader('Content-Type', 'application/json');
                                v349;
                            } else {
                                const v350 = require('mime');
                                var type = v350.lookup(relativePath);
                                const v351 = res.setHeader('Content-Type', type);
                                v351;
                                const v352 = stats.size;
                                const v353 = res.setHeader('Content-Length', v352);
                                v353;
                            }
                        }
                        const v354 = res.end();
                        v354;
                    }
                };
                const v356 = fs.stat(relativePath, v355);
                v356;
                break;
            case 'GET':
                const v357 = 'relativePath: ' + relativePath;
                const v358 = console.log(v357);
                v358;
                const v359 = url === 'favicon.ico';
                if (v359) {
                    const v360 = res.end();
                    v360;
                } else {
                    const v445 = function (err, stats) {
                        if (err) {
                            const v361 = writeError(err);
                            v361;
                        } else {
                            const v362 = stats.isDirectory();
                            if (v362) {
                                const v363 = stats.mtime;
                                const v364 = res.setHeader('Last-Modified', v363);
                                v364;
                                const v365 = res.setHeader('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
                                v365;
                                const v366 = res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                                v366;
                                const v367 = res.setHeader('Cache-Control', 'post-check=0, pre-check=0');
                                v367;
                                const v368 = res.setHeader('Pragma', 'no-cache');
                                v368;
                                const v369 = 'reading directory ' + relativePath;
                                const v370 = console.log(v369);
                                v370;
                                const v418 = function (err, files) {
                                    if (err) {
                                        const v371 = console.log('writeError');
                                        v371;
                                        const v372 = writeError(err);
                                        v372;
                                    } else {
                                        var results = [];
                                        var search = {};
                                        const v416 = function (files) {
                                            const v373 = files.length;
                                            if (v373) {
                                                var file = files.shift();
                                                const v374 = relativePath + '/';
                                                const v375 = v374 + file;
                                                const v384 = function (err, stats) {
                                                    if (err) {
                                                        const v376 = writeError(err);
                                                        v376;
                                                    } else {
                                                        stats.name = file;
                                                        const v377 = stats.isFile();
                                                        stats.isFile = v377;
                                                        const v378 = stats.isDirectory();
                                                        stats.isDirectory = v378;
                                                        const v379 = stats.isBlockDevice();
                                                        stats.isBlockDevice = v379;
                                                        const v380 = stats.isFIFO();
                                                        stats.isFIFO = v380;
                                                        const v381 = stats.isSocket();
                                                        stats.isSocket = v381;
                                                        const v382 = results.push(stats);
                                                        v382;
                                                        const v383 = search.stats(files);
                                                        v383;
                                                    }
                                                };
                                                const v385 = fs.stat(v375, v384);
                                                v385;
                                            } else {
                                                const v386 = query.type;
                                                const v387 = v386 == 'json';
                                                const v388 = query.dir;
                                                const v389 = v388 == 'json';
                                                const v390 = v387 || v389;
                                                if (v390) {
                                                    const v391 = res.setHeader('Content-Type', 'application/json');
                                                    v391;
                                                    const v392 = JSON.stringify(results);
                                                    const v393 = res.write(v392);
                                                    v393;
                                                    const v394 = res.end();
                                                    v394;
                                                } else {
                                                    const v395 = res.setHeader('Content-Type', 'text/html');
                                                    v395;
                                                    const v396 = res.write('<html><body>');
                                                    v396;
                                                    var f = 0;
                                                    const v397 = results.length;
                                                    let v398 = f < v397;
                                                    while (v398) {
                                                        const v400 = results[f];
                                                        var name = v400.name;
                                                        const v401 = url + '/';
                                                        var normalized = v401 + name;
                                                        const v402 = normalized[0];
                                                        let v403 = v402 == '/';
                                                        while (v403) {
                                                            const v404 = normalized.length;
                                                            normalized = normalized.slice(1, v404);
                                                            v403 = v402 == '/';
                                                        }
                                                        const v405 = normalized.indexOf('"');
                                                        const v406 = v405 >= 0;
                                                        if (v406) {
                                                            const v407 = new Error('unsupported file name');
                                                            throw v407;
                                                        }
                                                        const v408 = name.replace(/&/g, '&amp;');
                                                        const v409 = v408.replace(/</g, '&lt;');
                                                        name = v409.replace(/>/g, '&gt;');
                                                        const v410 = '\r\n<p><a href="/' + normalized;
                                                        const v411 = v410 + '"><span>';
                                                        const v412 = v411 + name;
                                                        const v413 = v412 + '</span></a></p>';
                                                        const v414 = res.write(v413);
                                                        v414;
                                                        const v399 = f++;
                                                        v398 = f < v397;
                                                    }
                                                    const v415 = res.end('\r\n</body></html>');
                                                    v415;
                                                }
                                            }
                                        };
                                        search.stats = v416;
                                        const v417 = search.stats(files);
                                        v417;
                                    }
                                };
                                const v419 = fs.readdir(relativePath, v418);
                                v419;
                            } else {
                                const v420 = 'reading file ' + relativePath;
                                const v421 = console.log(v420);
                                v421;
                                const v422 = query.type;
                                const v423 = v422 == 'json';
                                const v424 = query.dir;
                                const v425 = v424 == 'json';
                                const v426 = v423 || v425;
                                if (v426) {
                                    var type = 'application/json';
                                    const v427 = res.setHeader('Content-Type', type);
                                    v427;
                                    const v435 = function (err, data) {
                                        if (err) {
                                            const v428 = writeError(err);
                                            v428;
                                        } else {
                                            const v429 = data.toString();
                                            const v430 = require('mime');
                                            const v431 = v430.lookup(relativePath);
                                            const v432 = {
                                                data: v429,
                                                type: v431
                                            };
                                            const v433 = JSON.stringify(v432);
                                            const v434 = res.end(v433);
                                            v434;
                                        }
                                    };
                                    const v436 = fs.readFile(relativePath, v435);
                                    v436;
                                } else {
                                    const v437 = require('mime');
                                    var type = v437.lookup(relativePath);
                                    const v438 = res.setHeader('Content-Type', type);
                                    v438;
                                    const v443 = function (err, data) {
                                        if (err) {
                                            const v439 = writeError(err);
                                            v439;
                                        } else {
                                            const v440 = data.length;
                                            const v441 = res.setHeader('Content-Length', v440);
                                            v441;
                                            const v442 = res.end(data);
                                            v442;
                                        }
                                    };
                                    const v444 = fs.readFile(relativePath, v443);
                                    v444;
                                }
                            }
                        }
                    };
                    const v446 = fs.stat(relativePath, v445);
                    v446;
                }
                return;
            case 'PUT':
                const v447 = 'writing ' + relativePath;
                const v448 = console.log(v447);
                v448;
                var stream = fs.createWriteStream(relativePath);
                stream.ok = true;
                const v449 = req.pipe(stream);
                v449;
                const v452 = function () {
                    const v450 = stream.ok;
                    if (v450) {
                        const v451 = res.end();
                        v451;
                    }
                };
                const v453 = stream.on('close', v452);
                v453;
                const v455 = function (err) {
                    stream.ok = false;
                    const v454 = writeError(err);
                    v454;
                };
                const v456 = stream.on('error', v455);
                v456;
                return;
            case 'POST':
                const v457 = query.rename;
                if (v457) {
                    const v458 = 'rename: ' + relativePath;
                    const v459 = console.log(v458);
                    v459;
                    const v460 = query.rename;
                    const v461 = cleanUrl(v460);
                    query.rename = v461;
                    if (vpath) {
                        const v462 = query.rename;
                        const v463 = '/' + vpath;
                        const v464 = v463 + '/';
                        const v465 = v462.indexOf(v464);
                        const v466 = v465 == 0;
                        if (v466) {
                            const v467 = query.rename;
                            const v468 = vpath.length;
                            const v469 = v468 + 2;
                            const v470 = query.rename;
                            const v471 = v470.length;
                            const v472 = v467.slice(v469, v471);
                            query.rename = v472;
                        } else {
                            const v473 = query.rename;
                            const v474 = 'renamed url [' + v473;
                            const v475 = v474 + '] does not begin with vpath [';
                            const v476 = v475 + vpath;
                            const v477 = v476 + ']';
                            throw v477;
                        }
                    }
                    const v478 = 'renaming ' + relativePath;
                    const v479 = v478 + ' to ';
                    const v480 = v479 + path;
                    const v481 = query.rename;
                    const v482 = v480 + v481;
                    const v483 = console.log(v482);
                    v483;
                    const v484 = query.rename;
                    const v485 = path + v484;
                    const v488 = function (err) {
                        if (err) {
                            const v486 = writeError(err);
                            v486;
                        } else {
                            const v487 = res.end();
                            v487;
                        }
                    };
                    const v489 = fs.rename(relativePath, v485, v488);
                    v489;
                } else {
                    const v490 = query.create;
                    const v491 = v490 == 'directory';
                    if (v491) {
                        const v492 = 'creating directory ' + relativePath;
                        const v493 = console.log(v492);
                        v493;
                        const v496 = function (err) {
                            if (err) {
                                const v494 = writeError(err);
                                v494;
                            } else {
                                const v495 = res.end();
                                v495;
                            }
                        };
                        const v497 = fs.mkdir(relativePath, 511, v496);
                        v497;
                    } else {
                        const v498 = 'relativePath: ' + relativePath;
                        const v499 = console.log(v498);
                        v499;
                        const v500 = 'valid queries are ' + url;
                        const v501 = v500 + '?rename=[new name] or ';
                        const v502 = v501 + url;
                        const v503 = v502 + '?create=directory';
                        const v504 = writeError(v503);
                        v504;
                    }
                }
                return;
            case 'DELETE':
                const v519 = function (err, stats) {
                    if (err) {
                        const v505 = writeError(err);
                        v505;
                    } else {
                        const v506 = stats.isDirectory();
                        if (v506) {
                            const v507 = 'deleting directory ' + relativePath;
                            const v508 = console.log(v507);
                            v508;
                            const v511 = function (err) {
                                if (err) {
                                    const v509 = writeError(err);
                                    v509;
                                } else {
                                    const v510 = res.end();
                                    v510;
                                }
                            };
                            const v512 = fs.rmdir(relativePath, v511);
                            v512;
                        } else {
                            const v513 = 'deleting file ' + relativePath;
                            const v514 = console.log(v513);
                            v514;
                            const v517 = function (err) {
                                if (err) {
                                    const v515 = writeError(err);
                                    v515;
                                } else {
                                    const v516 = res.end();
                                    v516;
                                }
                            };
                            const v518 = fs.unlink(relativePath, v517);
                            v518;
                        }
                    }
                };
                const v520 = fs.stat(relativePath, v519);
                v520;
                return;
            default:
                const v521 = 'unsupported: ' + relativePath;
                const v522 = console.log(v521);
                v522;
                const v523 = 'Method ' + method;
                const v524 = v523 + ' not allowed';
                const v525 = writeError(v524, 405);
                v525;
                return;
            }
        }
    } catch (err) {
        const v526 = 'unhandled error: ' + err;
        const v527 = writeError(v526);
        v527;
    }
};
exports.handleRequest = v528;