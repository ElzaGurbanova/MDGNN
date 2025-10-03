var fs = require('fs');
var cleanUrl = function (url) {
    url = decodeURIComponent(url);
    const v264 = url.indexOf('..');
    let v265 = v264 >= 0;
    while (v265) {
        url = url.replace('..', '');
        v265 = v264 >= 0;
    }
    return url;
};
const v526 = function (vpath, path, req, res, readOnly, logHeadRequests) {
    var writeError = function (err, code) {
        code = code || 500;
        const v266 = 'Error ' + code;
        const v267 = v266 + ': ';
        const v268 = v267 + err;
        const v269 = console.log(v268);
        v269;
        try {
            res.statusCode = code;
            const v270 = res.setHeader('Content-Type', 'application/json');
            v270;
            const v271 = JSON.stringify(err);
            const v272 = res.end(v271);
            v272;
        } catch (resErr) {
            const v273 = 'failed to write error to response: ' + resErr;
            const v274 = console.log(v273);
            v274;
        }
    };
    const v275 = path.lastIndexOf('/');
    const v276 = path.length;
    const v277 = v276 - 1;
    const v278 = v275 !== v277;
    if (v278) {
        path += '/';
    }
    const v279 = require('url');
    const v280 = req.url;
    var parsedUrl = v279.parse(v280);
    let query;
    const v281 = {};
    const v282 = require('querystring');
    const v283 = parsedUrl.query;
    const v284 = v282.parse(v283);
    if (query) {
        query = v281;
    } else {
        query = v284;
    }
    const v285 = parsedUrl.pathname;
    var url = cleanUrl(v285);
    const v286 = url.lastIndexOf('/');
    const v287 = url.length;
    const v288 = v287 - 1;
    const v289 = v286 === v288;
    if (v289) {
        const v290 = url.length;
        url = url.slice(0, v290);
    }
    const v291 = url[0];
    const v292 = v291 === '/';
    if (v292) {
        const v293 = url.length;
        url = url.slice(1, v293);
    }
    const v294 = url.indexOf(vpath);
    const v295 = v294 != 0;
    const v296 = vpath && v295;
    if (v296) {
        const v297 = console.log('url does not begin with vpath');
        v297;
        const v298 = 'url [' + url;
        const v299 = v298 + '] does not begin with vpath [';
        const v300 = v299 + vpath;
        const v301 = v300 + ']';
        throw v301;
    }
    const v302 = req.method;
    const v303 = v302 != 'HEAD';
    if (v303) {
        const v304 = req.method;
        const v305 = v304 + ' ';
        const v306 = req.url;
        const v307 = v305 + v306;
        const v308 = console.log(v307);
        v308;
    }
    let relativePath;
    const v309 = url.indexOf(vpath);
    const v310 = v309 == 0;
    const v311 = vpath && v310;
    const v312 = vpath.length;
    const v313 = v312 + 1;
    const v314 = url.length;
    const v315 = url.slice(v313, v314);
    const v316 = path + v315;
    const v317 = path + url;
    if (v311) {
        relativePath = v316;
    } else {
        relativePath = v317;
    }
    try {
        const v318 = req.method;
        const v319 = v318 != 'GET';
        const v320 = readOnly && v319;
        if (v320) {
            const v321 = req.method;
            const v322 = v321 + ' forbidden on this resource';
            const v323 = writeError(v322, 403);
            v323;
        } else {
            const v324 = req.method;
            switch (v324) {
            case 'HEAD':
                if (logHeadRequests) {
                    const v325 = 'head: ' + relativePath;
                    const v326 = console.log(v325);
                    v326;
                }
                const v353 = function (err, stats) {
                    if (err) {
                        const v327 = writeError(err);
                        v327;
                    } else {
                        const v328 = stats.mtime;
                        const v329 = res.setHeader('Last-Modified', v328);
                        v329;
                        const v330 = res.setHeader('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
                        v330;
                        const v331 = res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                        v331;
                        const v332 = res.setHeader('Cache-Control', 'post-check=0, pre-check=0');
                        v332;
                        const v333 = res.setHeader('Pragma', 'no-cache');
                        v333;
                        const v334 = stats.isDirectory();
                        if (v334) {
                            const v335 = query.type;
                            const v336 = v335 == 'json';
                            const v337 = query.dir;
                            const v338 = v337 == 'json';
                            const v339 = v336 || v338;
                            let v340;
                            if (v339) {
                                v340 = 'application/json';
                            } else {
                                v340 = 'text/html';
                            }
                            const v341 = res.setHeader('Content-Type', v340);
                            v341;
                        } else {
                            const v342 = query.type;
                            const v343 = v342 == 'json';
                            const v344 = query.dir;
                            const v345 = v344 == 'json';
                            const v346 = v343 || v345;
                            if (v346) {
                                const v347 = res.setHeader('Content-Type', 'application/json');
                                v347;
                            } else {
                                const v348 = require('mime');
                                var type = v348.lookup(relativePath);
                                const v349 = res.setHeader('Content-Type', type);
                                v349;
                                const v350 = stats.size;
                                const v351 = res.setHeader('Content-Length', v350);
                                v351;
                            }
                        }
                        const v352 = res.end();
                        v352;
                    }
                };
                const v354 = fs.stat(relativePath, v353);
                v354;
                break;
            case 'GET':
                const v355 = 'relativePath: ' + relativePath;
                const v356 = console.log(v355);
                v356;
                const v357 = url === 'favicon.ico';
                if (v357) {
                    const v358 = res.end();
                    v358;
                } else {
                    const v443 = function (err, stats) {
                        if (err) {
                            const v359 = writeError(err);
                            v359;
                        } else {
                            const v360 = stats.isDirectory();
                            if (v360) {
                                const v361 = stats.mtime;
                                const v362 = res.setHeader('Last-Modified', v361);
                                v362;
                                const v363 = res.setHeader('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
                                v363;
                                const v364 = res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                                v364;
                                const v365 = res.setHeader('Cache-Control', 'post-check=0, pre-check=0');
                                v365;
                                const v366 = res.setHeader('Pragma', 'no-cache');
                                v366;
                                const v367 = 'reading directory ' + relativePath;
                                const v368 = console.log(v367);
                                v368;
                                const v416 = function (err, files) {
                                    if (err) {
                                        const v369 = console.log('writeError');
                                        v369;
                                        const v370 = writeError(err);
                                        v370;
                                    } else {
                                        var results = [];
                                        var search = {};
                                        const v414 = function (files) {
                                            const v371 = files.length;
                                            if (v371) {
                                                var file = files.shift();
                                                const v372 = relativePath + '/';
                                                const v373 = v372 + file;
                                                const v382 = function (err, stats) {
                                                    if (err) {
                                                        const v374 = writeError(err);
                                                        v374;
                                                    } else {
                                                        stats.name = file;
                                                        const v375 = stats.isFile();
                                                        stats.isFile = v375;
                                                        const v376 = stats.isDirectory();
                                                        stats.isDirectory = v376;
                                                        const v377 = stats.isBlockDevice();
                                                        stats.isBlockDevice = v377;
                                                        const v378 = stats.isFIFO();
                                                        stats.isFIFO = v378;
                                                        const v379 = stats.isSocket();
                                                        stats.isSocket = v379;
                                                        const v380 = results.push(stats);
                                                        v380;
                                                        const v381 = search.stats(files);
                                                        v381;
                                                    }
                                                };
                                                const v383 = fs.stat(v373, v382);
                                                v383;
                                            } else {
                                                const v384 = query.type;
                                                const v385 = v384 == 'json';
                                                const v386 = query.dir;
                                                const v387 = v386 == 'json';
                                                const v388 = v385 || v387;
                                                if (v388) {
                                                    const v389 = res.setHeader('Content-Type', 'application/json');
                                                    v389;
                                                    const v390 = JSON.stringify(results);
                                                    const v391 = res.write(v390);
                                                    v391;
                                                    const v392 = res.end();
                                                    v392;
                                                } else {
                                                    const v393 = res.setHeader('Content-Type', 'text/html');
                                                    v393;
                                                    const v394 = res.write('<html><body>');
                                                    v394;
                                                    var f = 0;
                                                    const v395 = results.length;
                                                    let v396 = f < v395;
                                                    while (v396) {
                                                        const v398 = results[f];
                                                        var name = v398.name;
                                                        const v399 = url + '/';
                                                        var normalized = v399 + name;
                                                        const v400 = normalized[0];
                                                        let v401 = v400 == '/';
                                                        while (v401) {
                                                            const v402 = normalized.length;
                                                            normalized = normalized.slice(1, v402);
                                                            v401 = v400 == '/';
                                                        }
                                                        const v403 = normalized.indexOf('"');
                                                        const v404 = v403 >= 0;
                                                        if (v404) {
                                                            const v405 = new Error('unsupported file name');
                                                            throw v405;
                                                        }
                                                        const v406 = name.replace(/&/g, '&amp;');
                                                        const v407 = v406.replace(/</g, '&lt;');
                                                        name = v407.replace(/>/g, '&gt;');
                                                        const v408 = '\r\n<p><a href="/' + normalized;
                                                        const v409 = v408 + '"><span>';
                                                        const v410 = v409 + name;
                                                        const v411 = v410 + '</span></a></p>';
                                                        const v412 = res.write(v411);
                                                        v412;
                                                        const v397 = f++;
                                                        v396 = f < v395;
                                                    }
                                                    const v413 = res.end('\r\n</body></html>');
                                                    v413;
                                                }
                                            }
                                        };
                                        search.stats = v414;
                                        const v415 = search.stats(files);
                                        v415;
                                    }
                                };
                                const v417 = fs.readdir(relativePath, v416);
                                v417;
                            } else {
                                const v418 = 'reading file ' + relativePath;
                                const v419 = console.log(v418);
                                v419;
                                const v420 = query.type;
                                const v421 = v420 == 'json';
                                const v422 = query.dir;
                                const v423 = v422 == 'json';
                                const v424 = v421 || v423;
                                if (v424) {
                                    var type = 'application/json';
                                    const v425 = res.setHeader('Content-Type', type);
                                    v425;
                                    const v433 = function (err, data) {
                                        if (err) {
                                            const v426 = writeError(err);
                                            v426;
                                        } else {
                                            const v427 = data.toString();
                                            const v428 = require('mime');
                                            const v429 = v428.lookup(relativePath);
                                            const v430 = {
                                                data: v427,
                                                type: v429
                                            };
                                            const v431 = JSON.stringify(v430);
                                            const v432 = res.end(v431);
                                            v432;
                                        }
                                    };
                                    const v434 = fs.readFile(relativePath, v433);
                                    v434;
                                } else {
                                    const v435 = require('mime');
                                    var type = v435.lookup(relativePath);
                                    const v436 = res.setHeader('Content-Type', type);
                                    v436;
                                    const v441 = function (err, data) {
                                        if (err) {
                                            const v437 = writeError(err);
                                            v437;
                                        } else {
                                            const v438 = data.length;
                                            const v439 = res.setHeader('Content-Length', v438);
                                            v439;
                                            const v440 = res.end(data);
                                            v440;
                                        }
                                    };
                                    const v442 = fs.readFile(relativePath, v441);
                                    v442;
                                }
                            }
                        }
                    };
                    const v444 = fs.stat(relativePath, v443);
                    v444;
                }
                return;
            case 'PUT':
                const v445 = 'writing ' + relativePath;
                const v446 = console.log(v445);
                v446;
                var stream = fs.createWriteStream(relativePath);
                stream.ok = true;
                const v447 = req.pipe(stream);
                v447;
                const v450 = function () {
                    const v448 = stream.ok;
                    if (v448) {
                        const v449 = res.end();
                        v449;
                    }
                };
                const v451 = stream.on('close', v450);
                v451;
                const v453 = function (err) {
                    stream.ok = false;
                    const v452 = writeError(err);
                    v452;
                };
                const v454 = stream.on('error', v453);
                v454;
                return;
            case 'POST':
                const v455 = query.rename;
                if (v455) {
                    const v456 = 'rename: ' + relativePath;
                    const v457 = console.log(v456);
                    v457;
                    const v458 = query.rename;
                    const v459 = cleanUrl(v458);
                    query.rename = v459;
                    if (vpath) {
                        const v460 = query.rename;
                        const v461 = '/' + vpath;
                        const v462 = v461 + '/';
                        const v463 = v460.indexOf(v462);
                        const v464 = v463 == 0;
                        if (v464) {
                            const v465 = query.rename;
                            const v466 = vpath.length;
                            const v467 = v466 + 2;
                            const v468 = query.rename;
                            const v469 = v468.length;
                            const v470 = v465.slice(v467, v469);
                            query.rename = v470;
                        } else {
                            const v471 = query.rename;
                            const v472 = 'renamed url [' + v471;
                            const v473 = v472 + '] does not begin with vpath [';
                            const v474 = v473 + vpath;
                            const v475 = v474 + ']';
                            throw v475;
                        }
                    }
                    const v476 = 'renaming ' + relativePath;
                    const v477 = v476 + ' to ';
                    const v478 = v477 + path;
                    const v479 = query.rename;
                    const v480 = v478 + v479;
                    const v481 = console.log(v480);
                    v481;
                    const v482 = query.rename;
                    const v483 = path + v482;
                    const v486 = function (err) {
                        if (err) {
                            const v484 = writeError(err);
                            v484;
                        } else {
                            const v485 = res.end();
                            v485;
                        }
                    };
                    const v487 = fs.rename(relativePath, v483, v486);
                    v487;
                } else {
                    const v488 = query.create;
                    const v489 = v488 == 'directory';
                    if (v489) {
                        const v490 = 'creating directory ' + relativePath;
                        const v491 = console.log(v490);
                        v491;
                        const v494 = function (err) {
                            if (err) {
                                const v492 = writeError(err);
                                v492;
                            } else {
                                const v493 = res.end();
                                v493;
                            }
                        };
                        const v495 = fs.mkdir(relativePath, 511, v494);
                        v495;
                    } else {
                        const v496 = 'relativePath: ' + relativePath;
                        const v497 = console.log(v496);
                        v497;
                        const v498 = 'valid queries are ' + url;
                        const v499 = v498 + '?rename=[new name] or ';
                        const v500 = v499 + url;
                        const v501 = v500 + '?create=directory';
                        const v502 = writeError(v501);
                        v502;
                    }
                }
                return;
            case 'DELETE':
                const v517 = function (err, stats) {
                    if (err) {
                        const v503 = writeError(err);
                        v503;
                    } else {
                        const v504 = stats.isDirectory();
                        if (v504) {
                            const v505 = 'deleting directory ' + relativePath;
                            const v506 = console.log(v505);
                            v506;
                            const v509 = function (err) {
                                if (err) {
                                    const v507 = writeError(err);
                                    v507;
                                } else {
                                    const v508 = res.end();
                                    v508;
                                }
                            };
                            const v510 = fs.rmdir(relativePath, v509);
                            v510;
                        } else {
                            const v511 = 'deleting file ' + relativePath;
                            const v512 = console.log(v511);
                            v512;
                            const v515 = function (err) {
                                if (err) {
                                    const v513 = writeError(err);
                                    v513;
                                } else {
                                    const v514 = res.end();
                                    v514;
                                }
                            };
                            const v516 = fs.unlink(relativePath, v515);
                            v516;
                        }
                    }
                };
                const v518 = fs.stat(relativePath, v517);
                v518;
                return;
            default:
                const v519 = 'unsupported: ' + relativePath;
                const v520 = console.log(v519);
                v520;
                const v521 = 'Method ' + method;
                const v522 = v521 + ' not allowed';
                const v523 = writeError(v522, 405);
                v523;
                return;
            }
        }
    } catch (err) {
        const v524 = 'unhandled error: ' + err;
        const v525 = writeError(v524);
        v525;
    }
};
exports.handleRequest = v526;