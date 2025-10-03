const v358 = require('platform-command');
var exec = v358.exec;
var fs = require('fs');
var Mustache = require('mustache');
var async = require('async');
var os = require('os');
var path = require('path');
var crypto = require('crypto');
var tinify = require('tinify');
var ora = require('ora');
const v359 = [
    '[          ]',
    '[>         ]',
    '[=>        ]',
    '[==>       ]',
    '[===>      ]',
    '[====>     ]',
    '[=====>    ]',
    '[======>   ]',
    '[=======>  ]',
    '[========> ]',
    '[=========>]',
    '[ =========]',
    '[  ========]',
    '[   =======]',
    '[    ======]',
    '[     =====]',
    '[      ====]',
    '[       ===]',
    '[        ==]',
    '[         =]'
];
const v360 = {};
v360.interval = 80;
v360.frames = v359;
var spinnerSettings = {};
spinnerSettings.build = 'Building image processing...';
spinnerSettings.tinify = 'TinyPNG processing...';
spinnerSettings.spinner = v360;
const v361 = process.env;
const TINIPNG_API_KEY = v361.TINIPNG_API_KEY;
var packing = require('./packing/packing.js');
var sorter = require('./sorter/sorter.js');
const v396 = function (files, options, callback) {
    const v362 = crypto.randomBytes(16);
    var uuid = v362.toString('hex');
    var i = 0;
    const v394 = function (file, next) {
        const v363 = file.path;
        file.originalPath = v363;
        const v364 = i++;
        v364;
        const v365 = os.tmpdir();
        const v366 = 'spritesheet_js_' + uuid;
        const v367 = v366 + '_';
        const v368 = new Date();
        const v369 = v368.getTime();
        const v370 = v367 + v369;
        const v371 = v370 + '_image_';
        const v372 = v371 + i;
        const v373 = v372 + '.png';
        const v374 = path.join(v365, v373);
        file.path = v374;
        let resize;
        const v375 = options.scale;
        const v376 = options.scale;
        const v377 = ' -resize ' + v376;
        if (v375) {
            resize = v377;
        } else {
            resize = '';
        }
        let fuzz;
        const v378 = options.fuzz;
        const v379 = options.fuzz;
        const v380 = ' -fuzz ' + v379;
        if (v378) {
            fuzz = v380;
        } else {
            fuzz = '';
        }
        let trim;
        const v381 = options.trim;
        if (v381) {
            trim = ' -bordercolor transparent -border 1 -trim ';
        } else {
            trim = '';
        }
        const v382 = 'convert' + fuzz;
        const v383 = v382 + ' -define png:exclude-chunks=date "';
        const v384 = file.originalPath;
        const v385 = v383 + v384;
        const v386 = v385 + '"';
        const v387 = v386 + trim;
        const v388 = v387 + '';
        const v389 = v388 + resize;
        const v390 = v389 + ' "';
        const v391 = file.path;
        const v392 = v390 + v391;
        var command = v392 + '"';
        const v393 = exec(command, next);
        v393;
    };
    const v395 = async.eachSeries(files, v394, callback);
    v395;
};
exports.treatImages = v396;
const v475 = function (files, options, callback) {
    const v400 = function (file) {
        const v397 = file.path;
        const v398 = '"' + v397;
        const v399 = v398 + '"';
        return v399;
    };
    var filePaths = files.map(v400);
    const v401 = filePaths.join(' ');
    const v402 = 'identify ' + v401;
    const v473 = function (err, stdout) {
        if (err) {
            const v403 = callback(err);
            return v403;
        }
        var sizes = stdout.split('\n');
        const v404 = sizes.length;
        const v405 = v404 - 1;
        sizes = sizes.splice(0, v405);
        const v470 = function (item, i) {
            var size = item.match(/ ([0-9]+)x([0-9]+) /);
            const v406 = files[i];
            const v407 = size[1];
            const v408 = parseInt(v407, 10);
            const v409 = options.padding;
            const v410 = v409 * 2;
            v406.width = v408 + v410;
            const v411 = files[i];
            const v412 = size[2];
            const v413 = parseInt(v412, 10);
            const v414 = options.padding;
            const v415 = v414 * 2;
            v411.height = v413 + v415;
            var forceTrimmed = false;
            const v416 = options.divisibleByTwo;
            if (v416) {
                const v417 = files[i];
                const v418 = v417.width;
                const v419 = v418 & 1;
                if (v419) {
                    const v420 = files[i];
                    v420.width += 1;
                    forceTrimmed = true;
                }
                const v421 = files[i];
                const v422 = v421.height;
                const v423 = v422 & 1;
                if (v423) {
                    const v424 = files[i];
                    v424.height += 1;
                    forceTrimmed = true;
                }
            }
            const v425 = files[i];
            const v426 = files[i];
            const v427 = v426.width;
            const v428 = files[i];
            const v429 = v428.height;
            v425.area = v427 * v429;
            const v430 = files[i];
            v430.trimmed = false;
            const v431 = options.trim;
            if (v431) {
                var rect = item.match(/ ([0-9]+)x([0-9]+)[\+\-]([0-9]+)[\+\-]([0-9]+) /);
                const v432 = files[i];
                const v433 = {};
                v432.trim = v433;
                const v434 = files[i];
                const v435 = v434.trim;
                const v436 = rect[3];
                const v437 = parseInt(v436, 10);
                v435.x = v437 - 1;
                const v438 = files[i];
                const v439 = v438.trim;
                const v440 = rect[4];
                const v441 = parseInt(v440, 10);
                v439.y = v441 - 1;
                const v442 = files[i];
                const v443 = v442.trim;
                const v444 = rect[1];
                const v445 = parseInt(v444, 10);
                v443.width = v445 - 2;
                const v446 = files[i];
                const v447 = v446.trim;
                const v448 = rect[2];
                const v449 = parseInt(v448, 10);
                v447.height = v449 - 2;
                const v450 = files[i];
                const v451 = files[i];
                const v452 = v451.trim;
                const v453 = v452.width;
                const v454 = files[i];
                const v455 = v454.width;
                const v456 = options.padding;
                const v457 = v456 * 2;
                const v458 = v455 - v457;
                const v459 = v453 !== v458;
                const v460 = files[i];
                const v461 = v460.trim;
                const v462 = v461.height;
                const v463 = files[i];
                const v464 = v463.height;
                const v465 = options.padding;
                const v466 = v465 * 2;
                const v467 = v464 - v466;
                const v468 = v462 !== v467;
                const v469 = v459 || v468;
                v450.trimmed = forceTrimmed || v469;
            }
        };
        const v471 = sizes.forEach(v470);
        v471;
        const v472 = callback(null, files);
        v472;
    };
    const v474 = exec(v402, v473);
    v474;
};
exports.getImagesSizes = v475;
const v494 = function (files, options, callback) {
    const v478 = function (item) {
        const v476 = item.width;
        item.w = v476;
        const v477 = item.height;
        item.h = v477;
    };
    const v479 = files.forEach(v478);
    v479;
    const v480 = options.sort;
    const v481 = sorter.run(v480, files);
    v481;
    const v482 = options.algorithm;
    const v483 = packing.pack(v482, files, options);
    v483;
    const v484 = options.square;
    if (v484) {
        const v485 = options.width;
        const v486 = options.height;
        const v487 = Math.max(v485, v486);
        options.height = v487;
        options.width = options.height;
    }
    const v488 = options.powerOfTwo;
    if (v488) {
        const v489 = options.width;
        const v490 = roundToPowerOfTwo(v489);
        options.width = v490;
        const v491 = options.height;
        const v492 = roundToPowerOfTwo(v491);
        options.height = v492;
    }
    const v493 = callback(null, options);
    v493;
};
exports.determineCanvasSize = v494;
const v588 = function (files, options, callback) {
    const v495 = spinnerSettings.build;
    const v496 = spinnerSettings.spinner;
    const v497 = {
        text: v495,
        spinner: v496
    };
    var spinner = ora(v497);
    const v498 = spinner.start();
    v498;
    const v499 = options.width;
    const v500 = 'convert -define png:exclude-chunks=date -quality 0% -size ' + v499;
    const v501 = v500 + 'x';
    const v502 = options.height;
    const v503 = v501 + v502;
    const v504 = v503 + ' xc:none';
    var command = [v504];
    const v519 = function (file) {
        const v505 = file.path;
        const v506 = '"' + v505;
        const v507 = v506 + '" -geometry +';
        const v508 = file.x;
        const v509 = options.padding;
        const v510 = v508 + v509;
        const v511 = v507 + v510;
        const v512 = v511 + '+';
        const v513 = file.y;
        const v514 = options.padding;
        const v515 = v513 + v514;
        const v516 = v512 + v515;
        const v517 = v516 + ' -composite';
        const v518 = command.push(v517);
        v518;
    };
    const v520 = files.forEach(v519);
    v520;
    const v521 = options.path;
    const v522 = v521 + '/';
    const v523 = options.name;
    const v524 = v522 + v523;
    var filePath = v524 + '.png';
    const v525 = '"' + filePath;
    const v526 = v525 + '"';
    const v527 = command.push(v526);
    v527;
    const v528 = command.join(' ');
    const v586 = function (err) {
        if (err) {
            const v529 = spinner.fail('Spritesheet build fails...');
            v529;
            const v530 = callback(err);
            return v530;
        }
        const getImageInfos = function (filePath) {
            const v542 = function (resolve) {
                const v531 = 'magick identify ' + filePath;
                const v540 = function (err, stdout) {
                    if (err) {
                        infos = 'unable to retrieve infos...';
                    } else {
                        params = stdout.split(' ');
                        const v532 = options.format;
                        const v533 = 'format: ' + v532;
                        const v534 = params[2];
                        const v535 = 'size: ' + v534;
                        const v536 = params[6];
                        const v537 = 'weight: ' + v536;
                        const v538 = [
                            v533,
                            v535,
                            v537
                        ];
                        infos = v538.join(' / ');
                    }
                    const v539 = resolve(infos);
                    v539;
                };
                const v541 = exec(v531, v540);
                v541;
            };
            const v543 = new Promise(v542);
            return v543;
        };
        const v544 = getImageInfos(filePath);
        const v584 = function (infos) {
            const v545 = 'YEAH! Spritesheet successfully generated! ' + infos;
            const v546 = spinner.succeed(v545);
            v546;
            const v555 = function (file) {
                const v547 = file.originalPath;
                const v548 = file.originalPath;
                const v549 = file.path;
                const v550 = v548 !== v549;
                const v551 = v547 && v550;
                if (v551) {
                    const v552 = file.path;
                    const v553 = v552.replace(/\\ /g, ' ');
                    const v554 = fs.unlinkSync(v553);
                    v554;
                }
            };
            const v556 = files.forEach(v555);
            v556;
            const v557 = options.tinify;
            var tinipngApiKey = TINIPNG_API_KEY || v557;
            if (tinipngApiKey) {
                const v558 = spinnerSettings.tinify;
                const v559 = spinnerSettings.spinner;
                const v560 = {
                    text: v558,
                    spinner: v559
                };
                spinner = ora(v560);
                const v561 = spinner.start();
                v561;
                tinify.key = tinipngApiKey;
                const v562 = tinify.fromFile(filePath);
                const v563 = v562.toFile(filePath);
                const v570 = function () {
                    const v564 = getImageInfos(filePath);
                    const v568 = function (infos) {
                        const v565 = 'WOOOOW! Spritesheet successfully tinified! ' + infos;
                        const v566 = spinner.succeed(v565);
                        v566;
                        const v567 = callback(null);
                        return v567;
                    };
                    const v569 = v564.then(v568);
                    return v569;
                };
                const v581 = function (err) {
                    message = err;
                    const v571 = tinify.AccountError;
                    const v572 = err instanceof v571;
                    if (v572) {
                        message = err.message;
                    } else {
                        const v573 = tinify.ClientError;
                        const v574 = err instanceof v573;
                        if (v574) {
                            message = 'tinify: generated image seems to be the problem';
                        } else {
                            const v575 = tinify.ServerError;
                            const v576 = err instanceof v575;
                            if (v576) {
                                message = 'tinify: issue with the API';
                            } else {
                                const v577 = tinify.ConnectionError;
                                const v578 = err instanceof v577;
                                if (v578) {
                                    message = 'tinify: network connection error';
                                }
                            }
                        }
                    }
                    const v579 = spinner.fail('Sorry tinification fails...');
                    v579;
                    const v580 = callback(message);
                    return v580;
                };
                const v582 = v563.then(v570, v581);
                return v582;
            } else {
                const v583 = callback(null);
                return v583;
            }
        };
        const v585 = v544.then(v584);
        return v585;
    };
    const v587 = exec(v528, v586);
    v587;
};
exports.generateImage = v588;
const v713 = function (files, options, callback) {
    const v589 = options.customFormat;
    const v590 = Array.isArray(v589);
    const v591 = options.customFormat;
    const v592 = options.customFormat;
    const v593 = [v592];
    let v594;
    if (v590) {
        v594 = v591;
    } else {
        v594 = v593;
    }
    const v595 = options.format;
    const v596 = Array.isArray(v595);
    const v597 = options.format;
    const v598 = options.format;
    const v599 = [v598];
    let v600;
    if (v596) {
        v600 = v597;
    } else {
        v600 = v599;
    }
    var formats = v594.concat(v600);
    const v711 = function (format, i) {
        const v601 = !format;
        if (v601) {
            return;
        }
        let path;
        const v602 = typeof format;
        const v603 = v602 === 'string';
        const v604 = __dirname + '/../templates/';
        const v605 = format.template;
        const v606 = v604 + v605;
        if (v603) {
            path = format;
        } else {
            path = v606;
        }
        var templateContent = fs.readFileSync(path, 'utf-8');
        var cssPriority = 0;
        const v607 = cssPriority++;
        var cssPriorityNormal = v607;
        const v608 = cssPriority++;
        var cssPriorityHover = v608;
        const v609 = cssPriority++;
        var cssPriorityActive = v609;
        const v610 = options.sort;
        const v611 = sorter.run(v610, files);
        v611;
        options.files = files;
        const v612 = options.files;
        const v663 = function (item, i) {
            const v613 = options.width;
            item.spritesheetWidth = v613;
            const v614 = options.height;
            item.spritesheetHeight = v614;
            const v615 = options.padding;
            item.width -= v615 * 2;
            const v616 = options.padding;
            item.height -= v616 * 2;
            const v617 = options.padding;
            item.x += v617;
            const v618 = options.padding;
            item.y += v618;
            item.index = i;
            const v619 = item.trim;
            if (v619) {
                const v620 = item.trim;
                const v621 = item.trim;
                const v622 = v621.x;
                const v623 = -v622;
                v620.frameX = v623;
                const v624 = item.trim;
                const v625 = item.trim;
                const v626 = v625.y;
                const v627 = -v626;
                v624.frameY = v627;
                const v629 = item.trim;
                const v630 = v629.x;
                const v631 = item.width;
                const v632 = v631 / 2;
                const v633 = v630 + v632;
                const v634 = item.trim;
                const v635 = v634.width;
                const v636 = v635 / 2;
                const v637 = v633 - v636;
                const v638 = Math.abs(v637);
                const v639 = Math.floor(v638);
                v628.offsetX = v639;
                const v641 = item.trim;
                const v642 = v641.y;
                const v643 = item.height;
                const v644 = v643 / 2;
                const v645 = v642 + v644;
                const v646 = item.trim;
                const v647 = v646.height;
                const v648 = v647 / 2;
                const v649 = v645 - v648;
                const v650 = Math.abs(v649);
                const v651 = Math.floor(v650);
                v640.offsetY = v651;
            }
            const v652 = item.name;
            item.cssName = v652 || '';
            const v653 = item.cssName;
            const v654 = v653.indexOf('_hover');
            const v655 = v654 >= 0;
            if (v655) {
                const v656 = item.cssName;
                const v657 = v656.replace('_hover', ':hover');
                item.cssName = v657;
                item.cssPriority = cssPriorityHover;
            } else {
                const v658 = item.cssName;
                const v659 = v658.indexOf('_active');
                const v660 = v659 >= 0;
                if (v660) {
                    const v661 = item.cssName;
                    const v662 = v661.replace('_active', ':active');
                    item.cssName = v662;
                    item.cssPriority = cssPriorityActive;
                } else {
                    item.cssPriority = cssPriorityNormal;
                }
            }
        };
        const v664 = v612.forEach(v663);
        v664;
        const getIndexOfCssName = function (files, cssName) {
            var i = 0;
            const v665 = files.length;
            let v666 = i < v665;
            while (v666) {
                const v668 = files[i];
                const v669 = v668.cssName;
                const v670 = v669 === cssName;
                if (v670) {
                    return i;
                }
                const v667 = ++i;
                v666 = i < v665;
            }
            const v671 = -1;
            return v671;
        };
        const v672 = options.cssOrder;
        if (v672) {
            const v673 = options.cssOrder;
            const v674 = v673.replace(/\./g, '');
            var order = v674.split(',');
            const v681 = function (cssName) {
                var index = getIndexOfCssName(files, cssName);
                const v675 = index >= 0;
                if (v675) {
                    const v676 = files[index];
                    const v677 = cssPriority++;
                    v676.cssPriority = v677;
                } else {
                    const v678 = 'could not find :' + cssName;
                    const v679 = v678 + 'css name';
                    const v680 = console.warn(v679);
                    v680;
                }
            };
            const v682 = order.forEach(v681);
            v682;
        }
        const v683 = options.files;
        const v687 = function (a, b) {
            const v684 = a.cssPriority;
            const v685 = b.cssPriority;
            const v686 = v684 - v685;
            return v686;
        };
        const v688 = v683.sort(v687);
        v688;
        const v689 = options.files;
        const v690 = options.files;
        const v691 = v690.length;
        const v692 = v691 - 1;
        const v693 = v689[v692];
        v693.isLast = true;
        var result = Mustache.render(templateContent, options);
        const findPriority = function (property) {
            var value = options[property];
            var isArray = Array.isArray(value);
            if (isArray) {
                const v694 = value.length;
                const v695 = i < v694;
                const v696 = value[i];
                const v697 = format[property];
                const v698 = value[0];
                const v699 = v697 || v698;
                let v700;
                if (v695) {
                    v700 = v696;
                } else {
                    v700 = v699;
                }
                return v700;
            }
            const v701 = format[property];
            const v702 = v701 || value;
            return v702;
        };
        const v703 = findPriority('path');
        const v704 = v703 + '/';
        const v705 = findPriority('name');
        const v706 = v704 + v705;
        const v707 = v706 + '.';
        const v708 = findPriority('extension');
        const v709 = v707 + v708;
        const v710 = fs.writeFile(v709, result, callback);
        v710;
    };
    const v712 = formats.forEach(v711);
    v712;
};
exports.generateData = v713;
const roundToPowerOfTwo = function (value) {
    var powers = 2;
    let v714 = value > powers;
    while (v714) {
        powers *= 2;
        v714 = value > powers;
    }
    return powers;
};