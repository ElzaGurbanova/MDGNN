'use strict';
var accepts = require('accepts');
var createError = require('http-errors');
const v347 = require('debug');
var debug = v347('serve-index');
var escapeHtml = require('escape-html');
var fs = require('fs');
var path = require('path');
var normalize = path.normalize;
var sep = path.sep;
var extname = path.extname;
var join = path.join;
var Batch = require('batch');
var mime = require('mime-types');
var parseUrl = require('parseurl');
const v348 = require('path');
var resolve = v348.resolve;
module.exports = serveIndex;
var cache = {};
var defaultTemplate = join(__dirname, 'public', 'directory.html');
var defaultStylesheet = join(__dirname, 'public', 'style.css');
var mediaTypes = [
    'text/html',
    'text/plain',
    'application/json'
];
var mediaType = {};
mediaType['text/html'] = 'html';
mediaType['text/plain'] = 'plain';
mediaType['application/json'] = 'json';
const serveIndex = function (root, options) {
    const v349 = {};
    var opts = options || v349;
    const v350 = !root;
    if (v350) {
        const v351 = new TypeError('serveIndex() root path required');
        throw v351;
    }
    const v352 = resolve(root);
    const v353 = v352 + sep;
    var rootPath = normalize(v353);
    var filter = opts.filter;
    var hidden = opts.hidden;
    var icons = opts.icons;
    const v354 = opts.stylesheet;
    var stylesheet = v354 || defaultStylesheet;
    const v355 = opts.template;
    var template = v355 || defaultTemplate;
    const v356 = opts.view;
    var view = v356 || 'tiles';
    const v414 = function (req, res, next) {
        const v357 = req.method;
        const v358 = v357 !== 'GET';
        const v359 = req.method;
        const v360 = v359 !== 'HEAD';
        const v361 = v358 && v360;
        if (v361) {
            const v362 = req.method;
            const v363 = 'OPTIONS' === v362;
            let v364;
            if (v363) {
                v364 = 200;
            } else {
                v364 = 405;
            }
            res.statusCode = v364;
            const v365 = res.setHeader('Allow', 'GET, HEAD, OPTIONS');
            v365;
            const v366 = res.setHeader('Content-Length', '0');
            v366;
            const v367 = res.end();
            v367;
            return;
        }
        var dir = getRequestedDir(req);
        const v368 = dir === null;
        if (v368) {
            const v369 = createError(400);
            const v370 = next(v369);
            return v370;
        }
        var originalUrl = parseUrl.original(req);
        const v371 = originalUrl.pathname;
        var originalDir = decodeURIComponent(v371);
        const v372 = join(rootPath, dir);
        var path = normalize(v372);
        const v373 = path.indexOf('\0');
        const v374 = ~v373;
        if (v374) {
            const v375 = createError(400);
            const v376 = next(v375);
            return v376;
        }
        const v377 = path + sep;
        const v378 = rootPath.length;
        const v379 = v377.substr(0, v378);
        const v380 = v379 !== rootPath;
        if (v380) {
            const v381 = debug('malicious path "%s"', path);
            v381;
            const v382 = createError(403);
            const v383 = next(v382);
            return v383;
        }
        const v384 = resolve(path);
        const v385 = v384 + sep;
        const v386 = normalize(v385);
        var showUp = v386 !== rootPath;
        const v387 = debug('stat "%s"', path);
        v387;
        const v412 = function (err, stat) {
            const v388 = err.code;
            const v389 = v388 === 'ENOENT';
            const v390 = err && v389;
            if (v390) {
                const v391 = next();
                return v391;
            }
            if (err) {
                const v392 = err.code;
                const v393 = v392 === 'ENAMETOOLONG';
                let v394;
                if (v393) {
                    v394 = 414;
                } else {
                    v394 = 500;
                }
                err.status = v394;
                const v395 = next(err);
                return v395;
            }
            const v396 = stat.isDirectory();
            const v397 = !v396;
            if (v397) {
                const v398 = next();
                return v398;
            }
            const v399 = debug('readdir "%s"', path);
            v399;
            const v410 = function (err, files) {
                if (err) {
                    const v400 = next(err);
                    return v400;
                }
                const v401 = !hidden;
                if (v401) {
                    files = removeHidden(files);
                }
                if (filter) {
                    const v403 = function (filename, index, list) {
                        const v402 = filter(filename, index, list, path);
                        return v402;
                    };
                    files = files.filter(v403);
                }
                const v404 = files.sort();
                v404;
                var accept = accepts(req);
                var type = accept.type(mediaTypes);
                const v405 = !type;
                if (v405) {
                    const v406 = createError(406);
                    const v407 = next(v406);
                    return v407;
                }
                const v408 = mediaType[type];
                const v409 = serveIndex[v408](req, res, files, next, originalDir, showUp, icons, path, view, template, stylesheet);
                v409;
            };
            const v411 = fs.readdir(path, v410);
            v411;
        };
        const v413 = fs.stat(path, v412);
        v413;
    };
    return v414;
};
;
const _html = function (req, res, files, next, dir, showUp, icons, path, view, template, stylesheet) {
    let render;
    const v415 = typeof template;
    const v416 = v415 !== 'function';
    const v417 = createHtmlRender(template);
    if (v416) {
        render = v417;
    } else {
        render = template;
    }
    if (showUp) {
        const v418 = files.unshift('..');
        v418;
    }
    const v429 = function (err, fileList) {
        if (err) {
            const v419 = next(err);
            return v419;
        }
        const v420 = fileList.sort(fileSort);
        v420;
        const v427 = function (err, style) {
            if (err) {
                const v421 = next(err);
                return v421;
            }
            const v422 = Boolean(icons);
            var locals = {};
            locals.directory = dir;
            locals.displayIcons = v422;
            locals.fileList = fileList;
            locals.path = path;
            locals.style = style;
            locals.viewName = view;
            const v425 = function (err, body) {
                if (err) {
                    const v423 = next(err);
                    return v423;
                }
                const v424 = send(res, 'text/html', body);
                v424;
            };
            const v426 = render(locals, v425);
            v426;
        };
        const v428 = fs.readFile(stylesheet, 'utf8', v427);
        v428;
    };
    const v430 = stat(path, files, v429);
    v430;
};
serveIndex.html = _html;
const _json = function (req, res, files, next, dir, showUp, icons, path) {
    const v437 = function (err, fileList) {
        if (err) {
            const v431 = next(err);
            return v431;
        }
        const v432 = fileList.sort(fileSort);
        v432;
        const v434 = function (file) {
            const v433 = file.name;
            return v433;
        };
        const v435 = fileList.map(v434);
        var body = JSON.stringify(v435);
        const v436 = send(res, 'application/json', body);
        v436;
    };
    const v438 = stat(path, files, v437);
    v438;
};
serveIndex.json = _json;
const _plain = function (req, res, files, next, dir, showUp, icons, path) {
    const v446 = function (err, fileList) {
        if (err) {
            const v439 = next(err);
            return v439;
        }
        const v440 = fileList.sort(fileSort);
        v440;
        const v442 = function (file) {
            const v441 = file.name;
            return v441;
        };
        const v443 = fileList.map(v442);
        const v444 = v443.join('\n');
        var body = v444 + '\n';
        const v445 = send(res, 'text/plain', body);
        v445;
    };
    const v447 = stat(path, files, v446);
    v447;
};
serveIndex.plain = _plain;
const createHtmlFileList = function (files, dir, useIcons, view) {
    const v448 = escapeHtml(view);
    const v449 = '<ul id="files" class="view-' + v448;
    const v450 = v449 + '">';
    const v451 = view === 'details';
    const v452 = '<li class="header">' + '<span class="name">Name</span>';
    const v453 = v452 + '<span class="size">Size</span>';
    const v454 = v453 + '<span class="date">Modified</span>';
    const v455 = v454 + '</li>';
    let v456;
    if (v451) {
        v456 = v455;
    } else {
        v456 = '';
    }
    var html = v450 + v456;
    const v526 = function (file) {
        var classes = [];
        const v457 = file.stat;
        const v458 = file.stat;
        const v459 = v458.isDirectory();
        var isDir = v457 && v459;
        const v460 = dir.split('/');
        const v462 = function (c) {
            const v461 = encodeURIComponent(c);
            return v461;
        };
        var path = v460.map(v462);
        if (useIcons) {
            const v463 = classes.push('icon');
            v463;
            if (isDir) {
                const v464 = classes.push('icon-directory');
                v464;
            } else {
                const v465 = file.name;
                var ext = extname(v465);
                const v466 = file.name;
                var icon = iconLookup(v466);
                const v467 = classes.push('icon');
                v467;
                const v468 = ext.substring(1);
                const v469 = 'icon-' + v468;
                const v470 = classes.push(v469);
                v470;
                const v471 = icon.className;
                const v472 = classes.indexOf(v471);
                const v473 = -1;
                const v474 = v472 === v473;
                if (v474) {
                    const v475 = icon.className;
                    const v476 = classes.push(v475);
                    v476;
                }
            }
        }
        const v477 = file.name;
        const v478 = encodeURIComponent(v477);
        const v479 = path.push(v478);
        v479;
        let date;
        const v480 = file.stat;
        const v481 = file.name;
        const v482 = v481 !== '..';
        const v483 = v480 && v482;
        const v484 = file.stat;
        const v485 = v484.mtime;
        const v486 = v485.toLocaleDateString();
        const v487 = v486 + ' ';
        const v488 = file.stat;
        const v489 = v488.mtime;
        const v490 = v489.toLocaleTimeString();
        const v491 = v487 + v490;
        if (v483) {
            date = v491;
        } else {
            date = '';
        }
        let size;
        const v492 = file.stat;
        const v493 = !isDir;
        const v494 = v492 && v493;
        const v495 = file.stat;
        const v496 = v495.size;
        if (v494) {
            size = v496;
        } else {
            size = '';
        }
        const v497 = path.join('/');
        const v498 = normalize(v497);
        const v499 = normalizeSlashes(v498);
        const v500 = escapeHtml(v499);
        const v501 = '<li><a href="' + v500;
        const v502 = v501 + '" class="';
        const v503 = classes.join(' ');
        const v504 = escapeHtml(v503);
        const v505 = v502 + v504;
        const v506 = v505 + '"';
        const v507 = v506 + ' title="';
        const v508 = file.name;
        const v509 = escapeHtml(v508);
        const v510 = v507 + v509;
        const v511 = v510 + '">';
        const v512 = v511 + '<span class="name">';
        const v513 = file.name;
        const v514 = escapeHtml(v513);
        const v515 = v512 + v514;
        const v516 = v515 + '</span>';
        const v517 = v516 + '<span class="size">';
        const v518 = escapeHtml(size);
        const v519 = v517 + v518;
        const v520 = v519 + '</span>';
        const v521 = v520 + '<span class="date">';
        const v522 = escapeHtml(date);
        const v523 = v521 + v522;
        const v524 = v523 + '</span>';
        const v525 = v524 + '</a></li>';
        return v525;
    };
    const v527 = files.map(v526);
    html += v527.join('\n');
    html += '</ul>';
    return html;
};
const createHtmlRender = function (template) {
    const v549 = function render(locals, callback) {
        const v547 = function (err, str) {
            if (err) {
                const v528 = callback(err);
                return v528;
            }
            const v529 = locals.style;
            const v530 = locals.fileList;
            const v531 = locals.displayIcons;
            const v532 = iconStyle(v530, v531);
            const v533 = v529.concat(v532);
            const v534 = str.replace(/\{style\}/g, v533);
            const v535 = locals.fileList;
            const v536 = locals.directory;
            const v537 = locals.displayIcons;
            const v538 = locals.viewName;
            const v539 = createHtmlFileList(v535, v536, v537, v538);
            const v540 = v534.replace(/\{files\}/g, v539);
            const v541 = locals.directory;
            const v542 = escapeHtml(v541);
            const v543 = v540.replace(/\{directory\}/g, v542);
            const v544 = locals.directory;
            const v545 = htmlPath(v544);
            var body = v543.replace(/\{linked-path\}/g, v545);
            const v546 = callback(null, body);
            v546;
        };
        const v548 = fs.readFile(template, 'utf8', v547);
        v548;
    };
    return v549;
};
const fileSort = function (a, b) {
    const v550 = a.name;
    const v551 = v550 === '..';
    const v552 = b.name;
    const v553 = v552 === '..';
    const v554 = v551 || v553;
    if (v554) {
        const v555 = a.name;
        const v556 = b.name;
        const v557 = v555 === v556;
        const v558 = a.name;
        const v559 = v558 === '..';
        const v560 = -1;
        let v561;
        if (v559) {
            v561 = v560;
        } else {
            v561 = 1;
        }
        let v562;
        if (v557) {
            v562 = 0;
        } else {
            v562 = v561;
        }
        return v562;
    }
    const v563 = b.stat;
    const v564 = b.stat;
    const v565 = v564.isDirectory();
    const v566 = v563 && v565;
    const v567 = Number(v566);
    const v568 = a.stat;
    const v569 = a.stat;
    const v570 = v569.isDirectory();
    const v571 = v568 && v570;
    const v572 = Number(v571);
    const v573 = v567 - v572;
    const v574 = a.name;
    const v575 = String(v574);
    const v576 = v575.toLocaleLowerCase();
    const v577 = b.name;
    const v578 = String(v577);
    const v579 = v578.toLocaleLowerCase();
    const v580 = v576.localeCompare(v579);
    const v581 = v573 || v580;
    return v581;
};
const getRequestedDir = function (req) {
    try {
        const v582 = parseUrl(req);
        const v583 = v582.pathname;
        const v584 = decodeURIComponent(v583);
        return v584;
    } catch (e) {
        return null;
    }
};
const htmlPath = function (dir) {
    var parts = dir.split('/');
    const v585 = parts.length;
    var crumb = new Array(v585);
    var i = 0;
    const v586 = parts.length;
    let v587 = i < v586;
    while (v587) {
        var part = parts[i];
        if (part) {
            const v589 = encodeURIComponent(part);
            parts[i] = v589;
            const v590 = i + 1;
            const v591 = parts.slice(0, v590);
            const v592 = v591.join('/');
            const v593 = escapeHtml(v592);
            const v594 = '<a href="' + v593;
            const v595 = v594 + '">';
            const v596 = escapeHtml(part);
            const v597 = v595 + v596;
            crumb[i] = v597 + '</a>';
        }
        const v588 = i++;
        v587 = i < v586;
    }
    const v598 = crumb.join(' / ');
    return v598;
};
const iconLookup = function (filename) {
    var ext = extname(filename);
    const v599 = icons[ext];
    if (v599) {
        const v600 = ext.substring(1);
        const v601 = 'icon-' + v600;
        const v602 = icons[ext];
        const v603 = {};
        v603.className = v601;
        v603.fileName = v602;
        return v603;
    }
    var mimetype = mime.lookup(ext);
    const v604 = mimetype === false;
    if (v604) {
        const v605 = icons.default;
        const v606 = {};
        v606.className = 'icon-default';
        v606.fileName = v605;
        return v606;
    }
    const v607 = icons[mimetype];
    if (v607) {
        const v608 = mimetype.replace('/', '-');
        const v609 = v608.replace('+', '_');
        const v610 = 'icon-' + v609;
        const v611 = icons[mimetype];
        const v612 = {};
        v612.className = v610;
        v612.fileName = v611;
        return v612;
    }
    const v613 = mimetype.split('+');
    var suffix = v613[1];
    const v614 = '+' + suffix;
    const v615 = icons[v614];
    const v616 = suffix && v615;
    if (v616) {
        const v617 = 'icon-' + suffix;
        const v618 = '+' + suffix;
        const v619 = icons[v618];
        const v620 = {};
        v620.className = v617;
        v620.fileName = v619;
        return v620;
    }
    const v621 = mimetype.split('/');
    var type = v621[0];
    const v622 = icons[type];
    if (v622) {
        const v623 = 'icon-' + type;
        const v624 = icons[type];
        const v625 = {};
        v625.className = v623;
        v625.fileName = v624;
        return v625;
    }
    const v626 = icons.default;
    const v627 = {};
    v627.className = 'icon-default';
    v627.fileName = v626;
    return v627;
};
const iconStyle = function (files, useIcons) {
    const v628 = !useIcons;
    if (v628) {
        return '';
    }
    var i;
    var list = [];
    var rules = {};
    var selector;
    var selectors = {};
    var style = '';
    (i = 0)
    const v629 = files.length;
    let v630 = i < v629;
    while (v630) {
        var file = files[i];
        const v632 = file.stat;
        const v633 = file.stat;
        const v634 = v633.isDirectory();
        var isDir = v632 && v634;
        let icon;
        const v635 = icons.folder;
        const v636 = {
            className: 'icon-directory',
            fileName: v635
        };
        const v637 = file.name;
        const v638 = iconLookup(v637);
        if (isDir) {
            icon = v636;
        } else {
            icon = v638;
        }
        var iconName = icon.fileName;
        const v639 = icon.className;
        const v640 = '#files .' + v639;
        selector = v640 + ' .name';
        const v641 = rules[iconName];
        const v642 = !v641;
        if (v642) {
            const v643 = load(iconName);
            const v644 = 'background-image: url(data:image/png;base64,' + v643;
            rules[iconName] = v644 + ');';
            selectors[iconName] = [];
            const v645 = list.push(iconName);
            v645;
        }
        const v646 = selectors[iconName];
        const v647 = v646.indexOf(selector);
        const v648 = -1;
        const v649 = v647 === v648;
        if (v649) {
            const v650 = selectors[iconName];
            const v651 = v650.push(selector);
            v651;
        }
        const v631 = i++;
        v630 = i < v629;
    }
    (i = 0)
    const v652 = list.length;
    let v653 = i < v652;
    while (v653) {
        iconName = list[i];
        const v655 = selectors[iconName];
        const v656 = v655.join(',\n');
        const v657 = v656 + ' {\n  ';
        const v658 = rules[iconName];
        const v659 = v657 + v658;
        style += v659 + '\n}\n';
        const v654 = i++;
        v653 = i < v652;
    }
    return style;
};
const load = function (icon) {
    const v660 = cache[icon];
    if (v660) {
        const v661 = cache[icon];
        return v661;
    }
    const v662 = __dirname + '/public/icons/';
    const v663 = v662 + icon;
    const v664 = fs.readFileSync(v663, 'base64');
    return cache[icon] = v664;
};
const normalizeSlashes = function (path) {
    const v665 = path.split(sep);
    const v666 = v665.join('/');
    return v666;
};
;
const removeHidden = function (files) {
    const v669 = function (file) {
        const v667 = file[0];
        const v668 = v667 !== '.';
        return v668;
    };
    const v670 = files.filter(v669);
    return v670;
};
const send = function (res, type, body) {
    const v671 = res.setHeader('X-Content-Type-Options', 'nosniff');
    v671;
    const v672 = type + '; charset=utf-8';
    const v673 = res.setHeader('Content-Type', v672);
    v673;
    const v674 = Buffer.byteLength(body, 'utf8');
    const v675 = res.setHeader('Content-Length', v674);
    v675;
    const v676 = res.end(body, 'utf8');
    v676;
};
const stat = function (dir, files, cb) {
    var batch = new Batch();
    const v677 = batch.concurrency(10);
    v677;
    const v690 = function (file) {
        const v688 = function (done) {
            const v678 = join(dir, file);
            const v686 = function (err, stat) {
                const v679 = err.code;
                const v680 = v679 !== 'ENOENT';
                const v681 = err && v680;
                if (v681) {
                    const v682 = done(err);
                    return v682;
                }
                const v683 = stat || null;
                const v684 = {
                    name: file,
                    stat: v683
                };
                const v685 = done(null, v684);
                v685;
            };
            const v687 = fs.stat(v678, v686);
            v687;
        };
        const v689 = batch.push(v688);
        v689;
    };
    const v691 = files.forEach(v690);
    v691;
    const v692 = batch.end(cb);
    v692;
};
var icons = {};
icons['default'] = 'page_white.png';
icons['folder'] = 'folder.png';
icons['font'] = 'font.png';
icons['image'] = 'image.png';
icons['text'] = 'page_white_text.png';
icons['video'] = 'film.png';
icons['+json'] = 'page_white_code.png';
icons['+xml'] = 'page_white_code.png';
icons['+zip'] = 'box.png';
icons['application/javascript'] = 'page_white_code_red.png';
icons['application/json'] = 'page_white_code.png';
icons['application/msword'] = 'page_white_word.png';
icons['application/pdf'] = 'page_white_acrobat.png';
icons['application/postscript'] = 'page_white_vector.png';
icons['application/rtf'] = 'page_white_word.png';
icons['application/vnd.ms-excel'] = 'page_white_excel.png';
icons['application/vnd.ms-powerpoint'] = 'page_white_powerpoint.png';
icons['application/vnd.oasis.opendocument.presentation'] = 'page_white_powerpoint.png';
icons['application/vnd.oasis.opendocument.spreadsheet'] = 'page_white_excel.png';
icons['application/vnd.oasis.opendocument.text'] = 'page_white_word.png';
icons['application/x-7z-compressed'] = 'box.png';
icons['application/x-sh'] = 'application_xp_terminal.png';
icons['application/x-msaccess'] = 'page_white_database.png';
icons['application/x-shockwave-flash'] = 'page_white_flash.png';
icons['application/x-sql'] = 'page_white_database.png';
icons['application/x-tar'] = 'box.png';
icons['application/x-xz'] = 'box.png';
icons['application/xml'] = 'page_white_code.png';
icons['application/zip'] = 'box.png';
icons['image/svg+xml'] = 'page_white_vector.png';
icons['text/css'] = 'page_white_code.png';
icons['text/html'] = 'page_white_code.png';
icons['text/less'] = 'page_white_code.png';
icons['.accdb'] = 'page_white_database.png';
icons['.apk'] = 'box.png';
icons['.app'] = 'application_xp.png';
icons['.as'] = 'page_white_actionscript.png';
icons['.asp'] = 'page_white_code.png';
icons['.aspx'] = 'page_white_code.png';
icons['.bat'] = 'application_xp_terminal.png';
icons['.bz2'] = 'box.png';
icons['.c'] = 'page_white_c.png';
icons['.cab'] = 'box.png';
icons['.cfm'] = 'page_white_coldfusion.png';
icons['.clj'] = 'page_white_code.png';
icons['.cc'] = 'page_white_cplusplus.png';
icons['.cgi'] = 'application_xp_terminal.png';
icons['.cpp'] = 'page_white_cplusplus.png';
icons['.cs'] = 'page_white_csharp.png';
icons['.db'] = 'page_white_database.png';
icons['.dbf'] = 'page_white_database.png';
icons['.deb'] = 'box.png';
icons['.dll'] = 'page_white_gear.png';
icons['.dmg'] = 'drive.png';
icons['.docx'] = 'page_white_word.png';
icons['.erb'] = 'page_white_ruby.png';
icons['.exe'] = 'application_xp.png';
icons['.fnt'] = 'font.png';
icons['.gam'] = 'controller.png';
icons['.gz'] = 'box.png';
icons['.h'] = 'page_white_h.png';
icons['.ini'] = 'page_white_gear.png';
icons['.iso'] = 'cd.png';
icons['.jar'] = 'box.png';
icons['.java'] = 'page_white_cup.png';
icons['.jsp'] = 'page_white_cup.png';
icons['.lua'] = 'page_white_code.png';
icons['.lz'] = 'box.png';
icons['.lzma'] = 'box.png';
icons['.m'] = 'page_white_code.png';
icons['.map'] = 'map.png';
icons['.msi'] = 'box.png';
icons['.mv4'] = 'film.png';
icons['.pdb'] = 'page_white_database.png';
icons['.php'] = 'page_white_php.png';
icons['.pl'] = 'page_white_code.png';
icons['.pkg'] = 'box.png';
icons['.pptx'] = 'page_white_powerpoint.png';
icons['.psd'] = 'page_white_picture.png';
icons['.py'] = 'page_white_code.png';
icons['.rar'] = 'box.png';
icons['.rb'] = 'page_white_ruby.png';
icons['.rm'] = 'film.png';
icons['.rom'] = 'controller.png';
icons['.rpm'] = 'box.png';
icons['.sass'] = 'page_white_code.png';
icons['.sav'] = 'controller.png';
icons['.scss'] = 'page_white_code.png';
icons['.srt'] = 'page_white_text.png';
icons['.tbz2'] = 'box.png';
icons['.tgz'] = 'box.png';
icons['.tlz'] = 'box.png';
icons['.vb'] = 'page_white_code.png';
icons['.vbs'] = 'page_white_code.png';
icons['.xcf'] = 'page_white_picture.png';
icons['.xlsx'] = 'page_white_excel.png';
icons['.yaws'] = 'page_white_code.png';