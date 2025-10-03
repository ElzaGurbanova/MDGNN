const v311 = require('platform-command');
var exec = v311.exec;
var fs = require('fs');
var Mustache = require('mustache');
var async = require('async');
var os = require('os');
var path = require('path');
var crypto = require('crypto');
var packing = require('./packing/packing.js');
var sorter = require('./sorter/sorter.js');
const v350 = function (files, options, callback) {
    const v312 = options.trim;
    const v313 = !v312;
    if (v313) {
        const v314 = callback(null);
        return v314;
    }
    const v315 = crypto.randomBytes(16);
    var uuid = v315.toString('hex');
    var i = 0;
    const v348 = function (file, next) {
        const v316 = file.path;
        file.originalPath = v316;
        const v317 = i++;
        v317;
        const v318 = os.tmpDir();
        const v319 = 'spritesheet_js_' + uuid;
        const v320 = v319 + '_';
        const v321 = new Date();
        const v322 = v321.getTime();
        const v323 = v320 + v322;
        const v324 = v323 + '_image_';
        const v325 = v324 + i;
        const v326 = v325 + '.png';
        const v327 = path.join(v318, v326);
        file.path = v327;
        let scale;
        const v328 = options.scale;
        const v329 = options.scale;
        const v330 = v329 !== '100%';
        const v331 = v328 && v330;
        const v332 = options.scale;
        const v333 = ' -resize ' + v332;
        if (v331) {
            scale = v333;
        } else {
            scale = '';
        }
        let fuzz;
        const v334 = options.fuzz;
        const v335 = options.fuzz;
        const v336 = ' -fuzz ' + v335;
        if (v334) {
            fuzz = v336;
        } else {
            fuzz = '';
        }
        const v337 = 'convert' + scale;
        const v338 = v337 + ' ';
        const v339 = v338 + fuzz;
        const v340 = v339 + ' -define png:exclude-chunks=date "';
        const v341 = file.originalPath;
        const v342 = v340 + v341;
        const v343 = v342 + '" -bordercolor transparent -border 1 -trim "';
        const v344 = file.path;
        const v345 = v343 + v344;
        const v346 = v345 + '"';
        const v347 = exec(v346, next);
        v347;
    };
    const v349 = async.eachSeries(files, v348, callback);
    v349;
};
exports.trimImages = v350;
const v429 = function (files, options, callback) {
    const v354 = function (file) {
        const v351 = file.path;
        const v352 = '"' + v351;
        const v353 = v352 + '"';
        return v353;
    };
    var filePaths = files.map(v354);
    const v355 = filePaths.join(' ');
    const v356 = 'identify ' + v355;
    const v427 = function (err, stdout) {
        if (err) {
            const v357 = callback(err);
            return v357;
        }
        var sizes = stdout.split('\n');
        const v358 = sizes.length;
        const v359 = v358 - 1;
        sizes = sizes.splice(0, v359);
        const v424 = function (item, i) {
            var size = item.match(/ ([0-9]+)x([0-9]+) /);
            const v360 = files[i];
            const v361 = size[1];
            const v362 = parseInt(v361, 10);
            const v363 = options.padding;
            const v364 = v363 * 2;
            v360.width = v362 + v364;
            const v365 = files[i];
            const v366 = size[2];
            const v367 = parseInt(v366, 10);
            const v368 = options.padding;
            const v369 = v368 * 2;
            v365.height = v367 + v369;
            var forceTrimmed = false;
            const v370 = options.divisibleByTwo;
            if (v370) {
                const v371 = files[i];
                const v372 = v371.width;
                const v373 = v372 & 1;
                if (v373) {
                    const v374 = files[i];
                    v374.width += 1;
                    forceTrimmed = true;
                }
                const v375 = files[i];
                const v376 = v375.height;
                const v377 = v376 & 1;
                if (v377) {
                    const v378 = files[i];
                    v378.height += 1;
                    forceTrimmed = true;
                }
            }
            const v379 = files[i];
            const v380 = files[i];
            const v381 = v380.width;
            const v382 = files[i];
            const v383 = v382.height;
            v379.area = v381 * v383;
            const v384 = files[i];
            v384.trimmed = false;
            const v385 = options.trim;
            if (v385) {
                var rect = item.match(/ ([0-9]+)x([0-9]+)[\+\-]([0-9]+)[\+\-]([0-9]+) /);
                const v386 = files[i];
                const v387 = {};
                v386.trim = v387;
                const v388 = files[i];
                const v389 = v388.trim;
                const v390 = rect[3];
                const v391 = parseInt(v390, 10);
                v389.x = v391 - 1;
                const v392 = files[i];
                const v393 = v392.trim;
                const v394 = rect[4];
                const v395 = parseInt(v394, 10);
                v393.y = v395 - 1;
                const v396 = files[i];
                const v397 = v396.trim;
                const v398 = rect[1];
                const v399 = parseInt(v398, 10);
                v397.width = v399 - 2;
                const v400 = files[i];
                const v401 = v400.trim;
                const v402 = rect[2];
                const v403 = parseInt(v402, 10);
                v401.height = v403 - 2;
                const v404 = files[i];
                const v405 = files[i];
                const v406 = v405.trim;
                const v407 = v406.width;
                const v408 = files[i];
                const v409 = v408.width;
                const v410 = options.padding;
                const v411 = v410 * 2;
                const v412 = v409 - v411;
                const v413 = v407 !== v412;
                const v414 = files[i];
                const v415 = v414.trim;
                const v416 = v415.height;
                const v417 = files[i];
                const v418 = v417.height;
                const v419 = options.padding;
                const v420 = v419 * 2;
                const v421 = v418 - v420;
                const v422 = v416 !== v421;
                const v423 = v413 || v422;
                v404.trimmed = forceTrimmed || v423;
            }
        };
        const v425 = sizes.forEach(v424);
        v425;
        const v426 = callback(null, files);
        v426;
    };
    const v428 = exec(v356, v427);
    v428;
};
exports.getImagesSizes = v429;
const v448 = function (files, options, callback) {
    const v432 = function (item) {
        const v430 = item.width;
        item.w = v430;
        const v431 = item.height;
        item.h = v431;
    };
    const v433 = files.forEach(v432);
    v433;
    const v434 = options.sort;
    const v435 = sorter.run(v434, files);
    v435;
    const v436 = options.algorithm;
    const v437 = packing.pack(v436, files, options);
    v437;
    const v438 = options.square;
    if (v438) {
        const v439 = options.width;
        const v440 = options.height;
        const v441 = Math.max(v439, v440);
        options.height = v441;
        options.width = options.height;
    }
    const v442 = options.powerOfTwo;
    if (v442) {
        const v443 = options.width;
        const v444 = roundToPowerOfTwo(v443);
        options.width = v444;
        const v445 = options.height;
        const v446 = roundToPowerOfTwo(v445);
        options.height = v446;
    }
    const v447 = callback(null, options);
    v447;
};
exports.determineCanvasSize = v448;
const v484 = function (files, options, callback) {
    const v449 = options.width;
    const v450 = 'convert -define png:exclude-chunks=date -quality 0% -size ' + v449;
    const v451 = v450 + 'x';
    const v452 = options.height;
    const v453 = v451 + v452;
    const v454 = v453 + ' xc:none';
    var command = [v454];
    const v469 = function (file) {
        const v455 = file.path;
        const v456 = '"' + v455;
        const v457 = v456 + '" -geometry +';
        const v458 = file.x;
        const v459 = options.padding;
        const v460 = v458 + v459;
        const v461 = v457 + v460;
        const v462 = v461 + '+';
        const v463 = file.y;
        const v464 = options.padding;
        const v465 = v463 + v464;
        const v466 = v462 + v465;
        const v467 = v466 + ' -composite';
        const v468 = command.push(v467);
        v468;
    };
    const v470 = files.forEach(v469);
    v470;
    const v471 = options.path;
    const v472 = '"' + v471;
    const v473 = v472 + '/';
    const v474 = options.name;
    const v475 = v473 + v474;
    const v476 = v475 + '.png"';
    const v477 = command.push(v476);
    v477;
    const v478 = command.join(' ');
    const v482 = function (err) {
        if (err) {
            const v479 = callback(err);
            return v479;
        }
        const v480 = unlinkTempFiles(files);
        v480;
        const v481 = callback(null);
        v481;
    };
    const v483 = exec(v478, v482);
    v483;
};
exports.generateImage = v484;
const unlinkTempFiles = function (files) {
    const v493 = function (file) {
        const v485 = file.originalPath;
        const v486 = file.originalPath;
        const v487 = file.path;
        const v488 = v486 !== v487;
        const v489 = v485 && v488;
        if (v489) {
            const v490 = file.path;
            const v491 = v490.replace(/\\ /g, ' ');
            const v492 = fs.unlinkSync(v491);
            v492;
        }
    };
    const v494 = files.forEach(v493);
    v494;
};
const v619 = function (files, options, callback) {
    const v495 = options.customFormat;
    const v496 = Array.isArray(v495);
    const v497 = options.customFormat;
    const v498 = options.customFormat;
    const v499 = [v498];
    let v500;
    if (v496) {
        v500 = v497;
    } else {
        v500 = v499;
    }
    const v501 = options.format;
    const v502 = Array.isArray(v501);
    const v503 = options.format;
    const v504 = options.format;
    const v505 = [v504];
    let v506;
    if (v502) {
        v506 = v503;
    } else {
        v506 = v505;
    }
    var formats = v500.concat(v506);
    const v617 = function (format, i) {
        const v507 = !format;
        if (v507) {
            return;
        }
        let path;
        const v508 = typeof format;
        const v509 = v508 === 'string';
        const v510 = __dirname + '/../templates/';
        const v511 = format.template;
        const v512 = v510 + v511;
        if (v509) {
            path = format;
        } else {
            path = v512;
        }
        var templateContent = fs.readFileSync(path, 'utf-8');
        var cssPriority = 0;
        const v513 = cssPriority++;
        var cssPriorityNormal = v513;
        const v514 = cssPriority++;
        var cssPriorityHover = v514;
        const v515 = cssPriority++;
        var cssPriorityActive = v515;
        const v516 = options.sort;
        const v517 = sorter.run(v516, files);
        v517;
        options.files = files;
        const v518 = options.files;
        const v569 = function (item, i) {
            const v519 = options.width;
            item.spritesheetWidth = v519;
            const v520 = options.height;
            item.spritesheetHeight = v520;
            const v521 = options.padding;
            item.width -= v521 * 2;
            const v522 = options.padding;
            item.height -= v522 * 2;
            const v523 = options.padding;
            item.x += v523;
            const v524 = options.padding;
            item.y += v524;
            item.index = i;
            const v525 = item.trim;
            if (v525) {
                const v526 = item.trim;
                const v527 = item.trim;
                const v528 = v527.x;
                const v529 = -v528;
                v526.frameX = v529;
                const v530 = item.trim;
                const v531 = item.trim;
                const v532 = v531.y;
                const v533 = -v532;
                v530.frameY = v533;
                const v535 = item.trim;
                const v536 = v535.x;
                const v537 = item.width;
                const v538 = v537 / 2;
                const v539 = v536 + v538;
                const v540 = item.trim;
                const v541 = v540.width;
                const v542 = v541 / 2;
                const v543 = v539 - v542;
                const v544 = Math.abs(v543);
                const v545 = Math.floor(v544);
                v534.offsetX = v545;
                const v547 = item.trim;
                const v548 = v547.y;
                const v549 = item.height;
                const v550 = v549 / 2;
                const v551 = v548 + v550;
                const v552 = item.trim;
                const v553 = v552.height;
                const v554 = v553 / 2;
                const v555 = v551 - v554;
                const v556 = Math.abs(v555);
                const v557 = Math.floor(v556);
                v546.offsetY = v557;
            }
            const v558 = item.name;
            item.cssName = v558 || '';
            const v559 = item.cssName;
            const v560 = v559.indexOf('_hover');
            const v561 = v560 >= 0;
            if (v561) {
                const v562 = item.cssName;
                const v563 = v562.replace('_hover', ':hover');
                item.cssName = v563;
                item.cssPriority = cssPriorityHover;
            } else {
                const v564 = item.cssName;
                const v565 = v564.indexOf('_active');
                const v566 = v565 >= 0;
                if (v566) {
                    const v567 = item.cssName;
                    const v568 = v567.replace('_active', ':active');
                    item.cssName = v568;
                    item.cssPriority = cssPriorityActive;
                } else {
                    item.cssPriority = cssPriorityNormal;
                }
            }
        };
        const v570 = v518.forEach(v569);
        v570;
        const getIndexOfCssName = function (files, cssName) {
            var i = 0;
            const v571 = files.length;
            let v572 = i < v571;
            while (v572) {
                const v574 = files[i];
                const v575 = v574.cssName;
                const v576 = v575 === cssName;
                if (v576) {
                    return i;
                }
                const v573 = ++i;
                v572 = i < v571;
            }
            const v577 = -1;
            return v577;
        };
        ;
        const v578 = options.cssOrder;
        if (v578) {
            const v579 = options.cssOrder;
            const v580 = v579.replace(/\./g, '');
            var order = v580.split(',');
            const v587 = function (cssName) {
                var index = getIndexOfCssName(files, cssName);
                const v581 = index >= 0;
                if (v581) {
                    const v582 = files[index];
                    const v583 = cssPriority++;
                    v582.cssPriority = v583;
                } else {
                    const v584 = 'could not find :' + cssName;
                    const v585 = v584 + 'css name';
                    const v586 = console.warn(v585);
                    v586;
                }
            };
            const v588 = order.forEach(v587);
            v588;
        }
        const v589 = options.files;
        const v593 = function (a, b) {
            const v590 = a.cssPriority;
            const v591 = b.cssPriority;
            const v592 = v590 - v591;
            return v592;
        };
        const v594 = v589.sort(v593);
        v594;
        const v595 = options.files;
        const v596 = options.files;
        const v597 = v596.length;
        const v598 = v597 - 1;
        const v599 = v595[v598];
        v599.isLast = true;
        var result = Mustache.render(templateContent, options);
        const findPriority = function (property) {
            var value = options[property];
            var isArray = Array.isArray(value);
            if (isArray) {
                const v600 = value.length;
                const v601 = i < v600;
                const v602 = value[i];
                const v603 = format[property];
                const v604 = value[0];
                const v605 = v603 || v604;
                let v606;
                if (v601) {
                    v606 = v602;
                } else {
                    v606 = v605;
                }
                return v606;
            }
            const v607 = format[property];
            const v608 = v607 || value;
            return v608;
        };
        const v609 = findPriority('path');
        const v610 = v609 + '/';
        const v611 = findPriority('name');
        const v612 = v610 + v611;
        const v613 = v612 + '.';
        const v614 = findPriority('extension');
        const v615 = v613 + v614;
        const v616 = fs.writeFile(v615, result, callback);
        v616;
    };
    const v618 = formats.forEach(v617);
    v618;
};
exports.generateData = v619;
const roundToPowerOfTwo = function (value) {
    var powers = 2;
    let v620 = value > powers;
    while (v620) {
        powers *= 2;
        v620 = value > powers;
    }
    return powers;
};