const tar = require('tar-stream');
const pump = require('pump');
const fs = require('fs');
const path = require('path');
const v381 = global.Bare;
const v382 = global.Bare;
const v383 = v382.platform;
const v384 = process.platform;
let v385;
if (v381) {
    v385 = v383;
} else {
    v385 = v384;
}
const win32 = v385 === 'win32';
const pack = function (cwd, opts) {
    const v386 = !cwd;
    if (v386) {
        cwd = '.';
    }
    const v387 = !opts;
    if (v387) {
        opts = {};
    }
    const v388 = opts.fs;
    const xfs = v388 || fs;
    const v389 = opts.ignore;
    const v390 = opts.filter;
    const v391 = v389 || v390;
    const ignore = v391 || noop;
    const v392 = opts.mapStream;
    const mapStream = v392 || echo;
    const v393 = opts.dereference;
    const v394 = xfs.stat;
    const v395 = xfs.lstat;
    let v396;
    if (v393) {
        v396 = v394;
    } else {
        v396 = v395;
    }
    const v397 = opts.entries;
    const v398 = opts.sort;
    const statNext = statAll(xfs, v396, cwd, ignore, v397, v398);
    const v399 = opts.strict;
    const strict = v399 !== false;
    let umask;
    const v400 = opts.umask;
    const v401 = typeof v400;
    const v402 = v401 === 'number';
    const v403 = opts.umask;
    const v404 = ~v403;
    const v405 = processUmask();
    const v406 = ~v405;
    if (v402) {
        umask = v404;
    } else {
        umask = v406;
    }
    const v407 = opts.pack;
    const v408 = tar.pack();
    const pack = v407 || v408;
    const v409 = opts.finish;
    const finish = v409 || noop;
    const v410 = opts.map;
    let map = v410 || noop;
    let dmode;
    const v411 = opts.dmode;
    const v412 = typeof v411;
    const v413 = v412 === 'number';
    const v414 = opts.dmode;
    if (v413) {
        dmode = v414;
    } else {
        dmode = 0;
    }
    let fmode;
    const v415 = opts.fmode;
    const v416 = typeof v415;
    const v417 = v416 === 'number';
    const v418 = opts.fmode;
    if (v417) {
        fmode = v418;
    } else {
        fmode = 0;
    }
    const v419 = opts.strip;
    if (v419) {
        const v420 = opts.strip;
        map = strip(map, v420);
    }
    const v421 = opts.readable;
    if (v421) {
        dmode |= parseInt(555, 8);
        fmode |= parseInt(444, 8);
    }
    const v422 = opts.writable;
    if (v422) {
        dmode |= parseInt(333, 8);
        fmode |= parseInt(222, 8);
    }
    const v423 = onnextentry();
    v423;
    const onsymlink = function (filename, header) {
        const v424 = path.join(cwd, filename);
        const v428 = function (err, linkname) {
            if (err) {
                const v425 = pack.destroy(err);
                return v425;
            }
            const v426 = normalize(linkname);
            header.linkname = v426;
            const v427 = pack.entry(header, onnextentry);
            v427;
        };
        const v429 = xfs.readlink(v424, v428);
        v429;
    };
    const onstat = function (err, filename, stat) {
        const v430 = pack.destroyed;
        if (v430) {
            return;
        }
        if (err) {
            const v431 = pack.destroy(err);
            return v431;
        }
        const v432 = !filename;
        if (v432) {
            const v433 = opts.finalize;
            const v434 = v433 !== false;
            if (v434) {
                const v435 = pack.finalize();
                v435;
            }
            const v436 = finish(pack);
            return v436;
        }
        const v437 = stat.isSocket();
        if (v437) {
            const v438 = onnextentry();
            return v438;
        }
        const v439 = normalize(filename);
        const v440 = stat.mode;
        const v441 = stat.isDirectory();
        let v442;
        if (v441) {
            v442 = dmode;
        } else {
            v442 = fmode;
        }
        const v443 = v440 | v442;
        const v444 = v443 & umask;
        const v445 = stat.mtime;
        const v446 = stat.size;
        const v447 = stat.uid;
        const v448 = stat.gid;
        let header = {};
        header.name = v439;
        header.mode = v444;
        header.mtime = v445;
        header.size = v446;
        header.type = 'file';
        header.uid = v447;
        header.gid = v448;
        const v449 = stat.isDirectory();
        if (v449) {
            header.size = 0;
            header.type = 'directory';
            const v450 = map(header);
            header = v450 || header;
            const v451 = pack.entry(header, onnextentry);
            return v451;
        }
        const v452 = stat.isSymbolicLink();
        if (v452) {
            header.size = 0;
            header.type = 'symlink';
            const v453 = map(header);
            header = v453 || header;
            const v454 = onsymlink(filename, header);
            return v454;
        }
        const v455 = map(header);
        header = v455 || header;
        const v456 = stat.isFile();
        const v457 = !v456;
        if (v457) {
            if (strict) {
                const v458 = 'unsupported type for ' + filename;
                const v459 = new Error(v458);
                const v460 = pack.destroy(v459);
                return v460;
            }
            const v461 = onnextentry();
            return v461;
        }
        const entry = pack.entry(header, onnextentry);
        const v462 = path.join(cwd, filename);
        const v463 = header.size;
        const v464 = v463 > 0;
        const v465 = header.size;
        const v466 = v465 - 1;
        const v467 = header.size;
        let v468;
        if (v464) {
            v468 = v466;
        } else {
            v468 = v467;
        }
        const v469 = {
            start: 0,
            end: v468
        };
        const v470 = xfs.createReadStream(v462, v469);
        const rs = mapStream(v470, header);
        const v472 = function (err) {
            const v471 = entry.destroy(err);
            v471;
        };
        const v473 = rs.on('error', v472);
        v473;
        const v474 = pump(rs, entry);
        v474;
    };
    const onnextentry = function (err) {
        if (err) {
            const v475 = pack.destroy(err);
            return v475;
        }
        const v476 = statNext(onstat);
        v476;
    };
    return pack;
};
exports.pack = pack;
const head = function (list) {
    const v477 = list.length;
    const v478 = list.length;
    const v479 = v478 - 1;
    const v480 = list[v479];
    let v481;
    if (v477) {
        v481 = v480;
    } else {
        v481 = null;
    }
    return v481;
};
const processGetuid = function () {
    const v482 = global.Bare;
    const v483 = !v482;
    const v484 = process.getuid;
    const v485 = v483 && v484;
    const v486 = process.getuid();
    const v487 = -1;
    let v488;
    if (v485) {
        v488 = v486;
    } else {
        v488 = v487;
    }
    return v488;
};
const processUmask = function () {
    const v489 = global.Bare;
    const v490 = !v489;
    const v491 = process.umask;
    const v492 = v490 && v491;
    const v493 = process.umask();
    let v494;
    if (v492) {
        v494 = v493;
    } else {
        v494 = 0;
    }
    return v494;
};
const extract = function (cwd, opts) {
    const v495 = !cwd;
    if (v495) {
        cwd = '.';
    }
    const v496 = !opts;
    if (v496) {
        opts = {};
    }
    cwd = path.resolve(cwd);
    const v497 = opts.fs;
    const xfs = v497 || fs;
    const v498 = opts.ignore;
    const v499 = opts.filter;
    const v500 = v498 || v499;
    const ignore = v500 || noop;
    const v501 = opts.mapStream;
    const mapStream = v501 || echo;
    const v502 = opts.chown;
    const v503 = v502 !== false;
    const v504 = !win32;
    const v505 = v503 && v504;
    const v506 = processGetuid();
    const v507 = v506 === 0;
    const own = v505 && v507;
    const v508 = opts.extract;
    const v509 = tar.extract();
    const extract = v508 || v509;
    const stack = [];
    const now = new Date();
    let umask;
    const v510 = opts.umask;
    const v511 = typeof v510;
    const v512 = v511 === 'number';
    const v513 = opts.umask;
    const v514 = ~v513;
    const v515 = processUmask();
    const v516 = ~v515;
    if (v512) {
        umask = v514;
    } else {
        umask = v516;
    }
    const v517 = opts.strict;
    const strict = v517 !== false;
    const v518 = opts.validateSymlinks;
    const validateSymLinks = v518 !== false;
    const v519 = opts.map;
    let map = v519 || noop;
    let dmode;
    const v520 = opts.dmode;
    const v521 = typeof v520;
    const v522 = v521 === 'number';
    const v523 = opts.dmode;
    if (v522) {
        dmode = v523;
    } else {
        dmode = 0;
    }
    let fmode;
    const v524 = opts.fmode;
    const v525 = typeof v524;
    const v526 = v525 === 'number';
    const v527 = opts.fmode;
    if (v526) {
        fmode = v527;
    } else {
        fmode = 0;
    }
    const v528 = opts.strip;
    if (v528) {
        const v529 = opts.strip;
        map = strip(map, v529);
    }
    const v530 = opts.readable;
    if (v530) {
        dmode |= parseInt(555, 8);
        fmode |= parseInt(444, 8);
    }
    const v531 = opts.writable;
    if (v531) {
        dmode |= parseInt(333, 8);
        fmode |= parseInt(222, 8);
    }
    const v532 = extract.on('entry', onentry);
    v532;
    const v533 = opts.finish;
    if (v533) {
        const v534 = opts.finish;
        const v535 = extract.on('finish', v534);
        v535;
    }
    return extract;
    const onentry = function (header, stream, next) {
        const v536 = map(header);
        header = v536 || header;
        const v537 = header.name;
        const v538 = normalize(v537);
        header.name = v538;
        const v539 = header.name;
        const v540 = path.join('/', v539);
        const name = path.join(cwd, v540);
        const v541 = ignore(name, header);
        if (v541) {
            const v542 = stream.resume();
            v542;
            const v543 = next();
            return v543;
        }
        let dir;
        const v544 = path.join(name, '.');
        const v545 = path.join(cwd, '.');
        const v546 = v544 === v545;
        const v547 = path.dirname(name);
        if (v546) {
            dir = cwd;
        } else {
            dir = v547;
        }
        const v548 = path.join(cwd, '.');
        const v583 = function (err, valid) {
            if (err) {
                const v549 = next(err);
                return v549;
            }
            const v550 = !valid;
            if (v550) {
                const v551 = dir + ' is not a valid path';
                const v552 = new Error(v551);
                const v553 = next(v552);
                return v553;
            }
            const v554 = header.type;
            const v555 = v554 === 'directory';
            if (v555) {
                const v556 = header.mtime;
                const v557 = [
                    name,
                    v556
                ];
                const v558 = stack.push(v557);
                v558;
                const v559 = header.uid;
                const v560 = header.gid;
                const v561 = header.mode;
                const v562 = {
                    fs: xfs,
                    own,
                    uid: v559,
                    gid: v560,
                    mode: v561
                };
                const v563 = mkdirfix(name, v562, stat);
                return v563;
            }
            const v564 = header.uid;
            const v565 = header.gid;
            const v566 = {
                fs: xfs,
                own,
                uid: v564,
                gid: v565,
                mode: 493
            };
            const v581 = function (err) {
                if (err) {
                    const v567 = next(err);
                    return v567;
                }
                const v568 = header.type;
                switch (v568) {
                case 'file':
                    const v569 = onfile();
                    return v569;
                case 'link':
                    const v570 = onlink();
                    return v570;
                case 'symlink':
                    const v571 = onsymlink();
                    return v571;
                }
                if (strict) {
                    const v572 = 'unsupported type for ' + name;
                    const v573 = v572 + ' (';
                    const v574 = header.type;
                    const v575 = v573 + v574;
                    const v576 = v575 + ')';
                    const v577 = new Error(v576);
                    const v578 = next(v577);
                    return v578;
                }
                const v579 = stream.resume();
                v579;
                const v580 = next();
                v580;
            };
            const v582 = mkdirfix(dir, v566, v581);
            v582;
        };
        const v584 = validate(xfs, dir, v548, v583);
        v584;
        const stat = function (err) {
            if (err) {
                const v585 = next(err);
                return v585;
            }
            const v589 = function (err) {
                if (err) {
                    const v586 = next(err);
                    return v586;
                }
                if (win32) {
                    const v587 = next();
                    return v587;
                }
                const v588 = chperm(name, header, next);
                v588;
            };
            const v590 = utimes(name, header, v589);
            v590;
        };
        const onsymlink = function () {
            if (win32) {
                const v591 = next();
                return v591;
            }
            const v602 = function () {
                const v592 = path.dirname(name);
                const v593 = header.linkname;
                const dst = path.resolve(v592, v593);
                const v594 = inCwd(dst);
                const v595 = !v594;
                const v596 = v595 && validateSymLinks;
                if (v596) {
                    const v597 = name + ' is not a valid symlink';
                    const v598 = new Error(v597);
                    const v599 = next(v598);
                    return v599;
                }
                const v600 = header.linkname;
                const v601 = xfs.symlink(v600, name, stat);
                v601;
            };
            const v603 = xfs.unlink(name, v602);
            v603;
        };
        const onlink = function () {
            if (win32) {
                const v604 = next();
                return v604;
            }
            const v624 = function () {
                const v605 = header.linkname;
                const v606 = path.join('/', v605);
                const link = path.join(cwd, v606);
                const v622 = function (err, dst) {
                    const v607 = inCwd(dst);
                    const v608 = !v607;
                    const v609 = err || v608;
                    if (v609) {
                        const v610 = name + ' is not a valid hardlink';
                        const v611 = new Error(v610);
                        const v612 = next(v611);
                        return v612;
                    }
                    const v620 = function (err) {
                        const v613 = err.code;
                        const v614 = v613 === 'EPERM';
                        const v615 = err && v614;
                        const v616 = opts.hardlinkAsFilesFallback;
                        const v617 = v615 && v616;
                        if (v617) {
                            stream = xfs.createReadStream(dst);
                            const v618 = onfile();
                            return v618;
                        }
                        const v619 = stat(err);
                        v619;
                    };
                    const v621 = xfs.link(dst, name, v620);
                    v621;
                };
                const v623 = fs.realpath(link, v622);
                v623;
            };
            const v625 = xfs.unlink(name, v624);
            v625;
        };
        const inCwd = function (dst) {
            const v626 = dst.startsWith(cwd);
            return v626;
        };
        const onfile = function () {
            const ws = xfs.createWriteStream(name);
            const rs = mapStream(stream, header);
            const v628 = function (err) {
                const v627 = rs.destroy(err);
                v627;
            };
            const v629 = ws.on('error', v628);
            v629;
            const v632 = function (err) {
                if (err) {
                    const v630 = next(err);
                    return v630;
                }
                const v631 = ws.on('close', stat);
                v631;
            };
            const v633 = pump(rs, ws, v632);
            v633;
        };
    };
    const utimesParent = function (name, cb) {
        let top;
        const v634 = top[0];
        const v635 = v634.length;
        const v636 = name.slice(0, v635);
        const v637 = top[0];
        const v638 = v636 !== v637;
        let v639 = (top = head(stack)) && v638;
        while (v639) {
            const v640 = stack.pop();
            v640;
            v639 = (top = head(stack)) && v638;
        }
        const v641 = !top;
        if (v641) {
            const v642 = cb();
            return v642;
        }
        const v643 = top[0];
        const v644 = top[1];
        const v645 = xfs.utimes(v643, now, v644, cb);
        v645;
    };
    const utimes = function (name, header, cb) {
        const v646 = opts.utimes;
        const v647 = v646 === false;
        if (v647) {
            const v648 = cb();
            return v648;
        }
        const v649 = header.type;
        const v650 = v649 === 'directory';
        if (v650) {
            const v651 = header.mtime;
            const v652 = xfs.utimes(name, now, v651, cb);
            return v652;
        }
        const v653 = header.type;
        const v654 = v653 === 'symlink';
        if (v654) {
            const v655 = utimesParent(name, cb);
            return v655;
        }
        const v656 = header.mtime;
        const v659 = function (err) {
            if (err) {
                const v657 = cb(err);
                return v657;
            }
            const v658 = utimesParent(name, cb);
            v658;
        };
        const v660 = xfs.utimes(name, now, v656, v659);
        v660;
    };
    const chperm = function (name, header, cb) {
        const v661 = header.type;
        const link = v661 === 'symlink';
        let chmod;
        const v662 = xfs.lchmod;
        const v663 = xfs.chmod;
        if (link) {
            chmod = v662;
        } else {
            chmod = v663;
        }
        let chown;
        const v664 = xfs.lchown;
        const v665 = xfs.chown;
        if (link) {
            chown = v664;
        } else {
            chown = v665;
        }
        const v666 = !chmod;
        if (v666) {
            const v667 = cb();
            return v667;
        }
        const v668 = header.mode;
        const v669 = header.type;
        const v670 = v669 === 'directory';
        let v671;
        if (v670) {
            v671 = dmode;
        } else {
            v671 = fmode;
        }
        const v672 = v668 | v671;
        const mode = v672 & umask;
        const v673 = chown && own;
        if (v673) {
            const v674 = header.uid;
            const v675 = header.gid;
            const v676 = chown.call(xfs, name, v674, v675, onchown);
            v676;
        } else {
            const v677 = onchown(null);
            v677;
        }
        const onchown = function (err) {
            if (err) {
                const v678 = cb(err);
                return v678;
            }
            const v679 = !chmod;
            if (v679) {
                const v680 = cb();
                return v680;
            }
            const v681 = chmod.call(xfs, name, mode, cb);
            v681;
        };
    };
    const mkdirfix = function (name, opts, cb) {
        const v693 = function (err) {
            const v682 = !err;
            if (v682) {
                const v683 = cb(null);
                return v683;
            }
            const v684 = err.code;
            const v685 = v684 !== 'ENOENT';
            if (v685) {
                const v686 = cb(err);
                return v686;
            }
            const v687 = opts.mode;
            const v688 = {
                mode: v687,
                recursive: true
            };
            const v691 = function (err, made) {
                if (err) {
                    const v689 = cb(err);
                    return v689;
                }
                const v690 = chperm(name, opts, cb);
                v690;
            };
            const v692 = xfs.mkdir(name, v688, v691);
            v692;
        };
        const v694 = xfs.stat(name, v693);
        v694;
    };
};
exports.extract = extract;
const validate = function (fs, name, root, cb) {
    const v695 = name === root;
    if (v695) {
        const v696 = cb(null, true);
        return v696;
    }
    const v709 = function (err, st) {
        const v697 = err.code;
        const v698 = v697 !== 'ENOENT';
        const v699 = err && v698;
        const v700 = err.code;
        const v701 = v700 !== 'EPERM';
        const v702 = v699 && v701;
        if (v702) {
            const v703 = cb(err);
            return v703;
        }
        const v704 = st.isDirectory();
        const v705 = err || v704;
        if (v705) {
            const v706 = path.join(name, '..');
            const v707 = validate(fs, v706, root, cb);
            return v707;
        }
        const v708 = cb(null, false);
        v708;
    };
    const v710 = fs.lstat(name, v709);
    v710;
};
const noop = function () {
};
const echo = function (name) {
    return name;
};
const normalize = function (name) {
    const v711 = name.replace(/\\/g, '/');
    const v712 = v711.replace(/[:?<>|]/g, '_');
    let v713;
    if (win32) {
        v713 = v712;
    } else {
        v713 = name;
    }
    return v713;
};
const statAll = function (fs, stat, cwd, ignore, entries, sort) {
    const v714 = !entries;
    if (v714) {
        entries = ['.'];
    }
    const queue = entries.slice(0);
    const v746 = function loop(callback) {
        const v715 = queue.length;
        const v716 = !v715;
        if (v716) {
            const v717 = callback(null);
            return v717;
        }
        const next = queue.shift();
        const nextAbs = path.join(cwd, next);
        const v744 = function (err, stat) {
            if (err) {
                const v718 = entries.indexOf(next);
                const v719 = -1;
                const v720 = v718 === v719;
                const v721 = err.code;
                const v722 = v721 === 'ENOENT';
                const v723 = v720 && v722;
                let v724;
                if (v723) {
                    v724 = null;
                } else {
                    v724 = err;
                }
                const v725 = callback(v724);
                return v725;
            }
            const v726 = stat.isDirectory();
            const v727 = !v726;
            if (v727) {
                const v728 = callback(null, next, stat);
                return v728;
            }
            const v742 = function (err, files) {
                if (err) {
                    const v729 = callback(err);
                    return v729;
                }
                if (sort) {
                    const v730 = files.sort();
                    v730;
                }
                let i = 0;
                const v731 = files.length;
                let v732 = i < v731;
                while (v732) {
                    const v734 = files[i];
                    const v735 = path.join(cwd, next, v734);
                    const v736 = ignore(v735);
                    const v737 = !v736;
                    if (v737) {
                        const v738 = files[i];
                        const v739 = path.join(next, v738);
                        const v740 = queue.push(v739);
                        v740;
                    }
                    const v733 = i++;
                    v732 = i < v731;
                }
                const v741 = callback(null, next, stat);
                v741;
            };
            const v743 = fs.readdir(nextAbs, v742);
            v743;
        };
        const v745 = stat.call(fs, nextAbs, v744);
        v745;
    };
    return v746;
};
const strip = function (map, level) {
    const v760 = function (header) {
        const v747 = header.name;
        const v748 = v747.split('/');
        const v749 = v748.slice(level);
        const v750 = v749.join('/');
        header.name = v750;
        const linkname = header.linkname;
        const v751 = header.type;
        const v752 = v751 === 'link';
        const v753 = path.isAbsolute(linkname);
        const v754 = v752 || v753;
        const v755 = linkname && v754;
        if (v755) {
            const v756 = linkname.split('/');
            const v757 = v756.slice(level);
            const v758 = v757.join('/');
            header.linkname = v758;
        }
        const v759 = map(header);
        return v759;
    };
    return v760;
};