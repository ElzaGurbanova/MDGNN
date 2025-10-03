'use strict';
const ChildProcess = require('child_process');
let vBoxManageBinary;
let escapeArg;
let isOptionSafe;
const v253 = process.platform;
const v254 = /^win/.test(v253);
if (v254) {
    const v255 = process.env;
    const v256 = v255.VBOX_INSTALL_PATH;
    const v257 = process.env;
    const v258 = v257.VBOX_MSI_INSTALL_PATH;
    const vBoxInstallPath = v256 || v258;
    if (vBoxInstallPath) {
        const v259 = vBoxInstallPath.replace(/\\$/, '');
        const v260 = '"' + v259;
        const v261 = v260 + '\\VBoxManage.exe';
        vBoxManageBinary = v261 + '"';
    } else {
        const v262 = console.warn('VBOX_INSTALL_PATH or VBOX_MSI_INSTALL_PATH environment variable is not defined.');
        v262;
        vBoxManageBinary = 'VBoxManage.exe';
    }
    const v268 = arg => {
        const v263 = /\s|[\\"&]/.test(arg);
        const v264 = !v263;
        if (v264) {
            return arg;
        }
        const v265 = arg.replace(/"/g, '"""');
        const v266 = '"' + v265;
        const v267 = v266 + '"';
        return v267;
    };
    escapeArg = v268;
    const v271 = opt => {
        const v269 = /\s|[\\"&]/.test(opt);
        const v270 = !v269;
        return v270;
    };
    isOptionSafe = v271;
} else {
    vBoxManageBinary = 'vboxmanage';
    const v273 = arg => {
        const v272 = arg.replace(/([ \t\\|;&"`$*])/g, '\\$1');
        return v272;
    };
    escapeArg = v273;
    const v276 = opt => {
        const v274 = /([ \t\\|;&"`$*])/.test(opt);
        const v275 = !v274;
        return v275;
    };
    isOptionSafe = v276;
}
const VBoxManage = {};
const v311 = function (command, options) {
    const v277 = [];
    command = command || v277;
    const v278 = Array.isArray(command);
    const v279 = !v278;
    if (v279) {
        command = [command];
    }
    const v280 = {};
    options = options || v280;
    let i = 0;
    const v281 = command.length;
    let v282 = i < v281;
    while (v282) {
        const v284 = command[i];
        const v285 = escapeArg(v284);
        command[i] = v285;
        const v283 = i++;
        v282 = i < v281;
    }
    let [option, value];
    const v286 = Object.entries(options);
    for ([option, value] of v286) {
        const v287 = isOptionSafe(option);
        const v288 = !v287;
        if (v288) {
            const v289 = 'An unsafe option was passed to VBoxManage.manage: ' + option;
            const v290 = new Error(v289);
            throw v290;
        }
        const v291 = '--' + option;
        const v292 = command.push(v291);
        v292;
        const v293 = value !== true;
        if (v293) {
            const v294 = escapeArg(value);
            const v295 = command.push(v294);
            v295;
        }
    }
    const v296 = VBoxManage.debug;
    if (v296) {
        const v297 = command.join(' ');
        const v298 = '$ VBoxManage ' + v297;
        const v299 = console.warn(v298);
        v299;
    }
    const v309 = (resolve, reject) => {
        const v300 = vBoxManageBinary + ' ';
        const v301 = command.join(' ');
        const v302 = v300 + v301;
        const v303 = {};
        const v307 = (err, stdout, stderr) => {
            if (err) {
                err.stderr = stderr;
                const v304 = reject(err);
                return v304;
            }
            const v305 = {
                stdout: stdout,
                stderr: stderr
            };
            const v306 = resolve(v305);
            return v306;
        };
        const v308 = ChildProcess.exec(v302, v303, v307);
        v308;
    };
    const v310 = new Promise(v309);
    return v310;
};
VBoxManage.manage = v311;
const v322 = function (vmname, propName) {
    const v312 = [
        'guestproperty',
        'get',
        vmname,
        propName
    ];
    const v313 = this.manage(v312);
    const v320 = std => {
        const v314 = std.stdout;
        const v315 = std.stdout;
        const v316 = v315.indexOf(':');
        const v317 = v316 + 1;
        const v318 = v314.substr(v317);
        let value = v318.trim();
        const v319 = value === 'No value set!';
        if (v319) {
            value = undefined;
        }
        return value;
    };
    const v321 = v313.then(v320);
    return v321;
};
VBoxManage.getProperty = v322;
const v325 = function (vmname, propName, value, options) {
    const v323 = [
        'guestproperty',
        'set',
        vmname,
        propName,
        value
    ];
    const v324 = this.manage(v323, options);
    return v324;
};
VBoxManage.setProperty = v325;
const v328 = function (vmname, propName) {
    const v326 = [
        'guestproperty',
        'delete',
        vmname,
        propName
    ];
    const v327 = this.manage(v326);
    return v327;
};
VBoxManage.deleteProperty = v328;
const v332 = function (vmname, newName, options) {
    const v329 = {};
    options = options || v329;
    options['name'] = newName;
    const v330 = [
        'clonevm',
        vmname
    ];
    const v331 = this.manage(v330, options);
    return v331;
};
VBoxManage.clone = v332;
const v335 = function (vmname, snapshot, newName) {
    const v333 = { 'snapshot': snapshot };
    const v334 = this.clone(vmname, newName, v333);
    return v334;
};
VBoxManage.cloneSnapshot = v335;
const v338 = function (vmname, snapshotName) {
    const v336 = [
        'snapshot',
        vmname,
        'take',
        snapshotName
    ];
    const v337 = this.manage(v336);
    return v337;
};
VBoxManage.takeSnapshot = v338;
const v341 = function (vmname, snapshotName) {
    const v339 = [
        'snapshot',
        vmname,
        'restore',
        snapshotName
    ];
    const v340 = this.manage(v339);
    return v340;
};
VBoxManage.restoreSnapshot = v341;
const v363 = function (vmname) {
    const v342 = [
        'showvminfo',
        vmname
    ];
    const v343 = { 'machinereadable': true };
    const v344 = this.manage(v342, v343);
    const v361 = std => {
        const info = {};
        let line;
        const v345 = std.stdout;
        const v346 = v345.split('\n');
        for (line of v346) {
            const v347 = line.length;
            const v348 = v347 > 0;
            if (v348) {
                const splitPoint = line.indexOf('=');
                let key = line.substr(0, splitPoint);
                const v349 = splitPoint + 1;
                let value = line.substr(v349);
                const v350 = key[0];
                const v351 = v350 === '"';
                const v352 = key.length;
                const v353 = v352 - 1;
                const v354 = key[v353];
                const v355 = v354 === '"';
                const v356 = v351 && v355;
                if (v356) {
                    const v357 = -1;
                    key = key.slice(1, v357);
                }
                const v358 = value[0];
                const v359 = v358 === '"';
                if (v359) {
                    const v360 = value.lastIndexOf('"');
                    value = value.substring(1, v360);
                } else {
                    value = value.replace(/\s+$/, '');
                }
                info[key] = value;
            }
        }
        return info;
    };
    const v362 = v344.then(v361);
    return v362;
};
VBoxManage.getInfo = v363;
const v387 = function (vmname, timeout) {
    const v364 = timeout == null;
    if (v364) {
        const v365 = -1;
        timeout = v365;
    }
    const v366 = Date.now();
    const finishLine = v366 + timeout;
    const retryDuration = 1000;
    const v367 = this.getProperty(vmname, '/VirtualBox/GuestInfo/Net/0/V4/IP');
    const v385 = address => {
        const v368 = address !== undefined;
        const v369 = -1;
        const v370 = timeout > v369;
        const v371 = Date.now();
        const v372 = finishLine - retryDuration;
        const v373 = v371 >= v372;
        const v374 = v370 && v373;
        const v375 = v368 || v374;
        if (v375) {
            return address;
        }
        let t;
        const v383 = (resolve, reject) => {
            const v382 = () => {
                const v376 = -1;
                const v377 = timeout > v376;
                if (v377) {
                    const v378 = Date.now();
                    timeout = finishLine - v378;
                }
                const v379 = VBoxManage.getIPAddress(vmname, timeout);
                const v380 = v379.then(resolve);
                const v381 = v380.catch(reject);
                v381;
            };
            t = setTimeout(v382, 1000);
        };
        const v384 = new Promise(v383);
        return v384;
    };
    const v386 = v367.then(v385);
    return v386;
};
VBoxManage.getIPAddress = v387;
const v390 = function (vmname, options) {
    const v388 = [
        'modifyvm',
        vmname
    ];
    const v389 = this.manage(v388, options);
    return v389;
};
VBoxManage.modify = v390;
const v396 = function (vmname) {
    const v391 = this.getInfo(vmname);
    const v392 = () => {
        return true;
    };
    const v393 = v391.then(v392);
    const v394 = () => {
        return false;
    };
    const v395 = v393.catch(v394);
    return v395;
};
VBoxManage.isRegistered = v396;
const v399 = function (ovfname, options) {
    const v397 = [
        'import',
        ovfname
    ];
    const v398 = this.manage(v397, options);
    return v398;
};
VBoxManage.import = v399;
const v404 = function (vmname, gui, options) {
    const v400 = {};
    options = options || v400;
    let v401;
    if (gui) {
        v401 = 'gui';
    } else {
        v401 = 'headless';
    }
    options['type'] = v401;
    const v402 = [
        '-nologo',
        'startvm',
        vmname
    ];
    const v403 = this.manage(v402, options);
    return v403;
};
VBoxManage.start = v404;
const v407 = function (vmname) {
    const v405 = [
        'controlvm',
        vmname,
        'reset'
    ];
    const v406 = this.manage(v405);
    return v406;
};
VBoxManage.reset = v407;
const v410 = function (vmname) {
    const v408 = [
        'controlvm',
        vmname,
        'resume'
    ];
    const v409 = this.manage(v408);
    return v409;
};
VBoxManage.resume = v410;
const v413 = function (vmname) {
    const v411 = [
        'controlvm',
        vmname,
        'savestate'
    ];
    const v412 = this.manage(v411);
    return v412;
};
VBoxManage.stopAndSaveState = v413;
const v416 = function (vmname) {
    const v414 = [
        'controlvm',
        vmname,
        'poweroff'
    ];
    const v415 = this.manage(v414);
    return v415;
};
VBoxManage.powerOff = v416;
const v419 = function (vmname) {
    const v417 = [
        'controlvm',
        vmname,
        'acpipowerbutton'
    ];
    const v418 = this.manage(v417);
    return v418;
};
VBoxManage.acpiPowerButton = v419;
const v422 = function (vmname) {
    const v420 = [
        'controlvm',
        vmname,
        'acpisleepbutton'
    ];
    const v421 = this.manage(v420);
    return v421;
};
VBoxManage.acpiSleepButton = v422;
const v428 = function (vmname, username, password, source, dest, recursive) {
    let args = [
        'guestcontrol',
        vmname,
        'copyto'
    ];
    if (username) {
        const v423 = args.push('--username', username);
        v423;
    }
    if (password) {
        const v424 = args.push('--password', password);
        v424;
    }
    if (recursive) {
        const v425 = args.push('--recursive');
        v425;
    }
    const v426 = args.push('--target-directory', dest);
    v426;
    args = args.concat(source);
    const v427 = this.manage(args);
    return v427;
};
VBoxManage.copyToVm = v428;
const v434 = function (vmname, username, password, source, dest, recursive) {
    let args = [
        'guestcontrol',
        vmname,
        'copyfrom'
    ];
    if (username) {
        const v429 = args.push('--username', username);
        v429;
    }
    if (password) {
        const v430 = args.push('--password', password);
        v430;
    }
    if (recursive) {
        const v431 = args.push('--recursive');
        v431;
    }
    const v432 = args.push('--target-directory', dest);
    v432;
    args = args.concat(source);
    const v433 = this.manage(args);
    return v433;
};
VBoxManage.copyFromVm = v434;
const v440 = function (vmname, username, password, path, parents) {
    const args = [
        'guestcontrol',
        vmname,
        'mkdir'
    ];
    if (username) {
        const v435 = args.push('--username', username);
        v435;
    }
    if (password) {
        const v436 = args.push('--password', password);
        v436;
    }
    if (parents) {
        const v437 = args.push('--parents');
        v437;
    }
    const v438 = args.push(path);
    v438;
    const v439 = this.manage(args);
    return v439;
};
VBoxManage.mkdir = v440;
const v446 = function (vmname, username, password, path, recursive) {
    const args = [
        'guestcontrol',
        vmname,
        'rmdir'
    ];
    if (username) {
        const v441 = args.push('--username', username);
        v441;
    }
    if (password) {
        const v442 = args.push('--password', password);
        v442;
    }
    if (recursive) {
        const v443 = args.push('--recursive');
        v443;
    }
    const v444 = args.push(path);
    v444;
    const v445 = this.manage(args);
    return v445;
};
VBoxManage.rmdir = v446;
const v452 = function (vmname, username, password, path, force) {
    const args = [
        'guestcontrol',
        vmname,
        'removefile'
    ];
    if (username) {
        const v447 = args.push('--username', username);
        v447;
    }
    if (password) {
        const v448 = args.push('--password', password);
        v448;
    }
    if (force) {
        const v449 = args.push('--force');
        v449;
    }
    const v450 = args.push(path);
    v450;
    const v451 = this.manage(args);
    return v451;
};
VBoxManage.removeFile = v452;
const v457 = function (vmname, username, password, source, dest) {
    let args = [
        'guestcontrol',
        vmname,
        'mv'
    ];
    if (username) {
        const v453 = args.push('--username', username);
        v453;
    }
    if (password) {
        const v454 = args.push('--password', password);
        v454;
    }
    args = args.concat(source);
    const v455 = args.push(dest);
    v455;
    const v456 = this.manage(args);
    return v456;
};
VBoxManage.move = v457;
VBoxManage.mv = VBoxManage.move;
const v481 = function (vmname, username, password, path) {
    const args = [
        'guestcontrol',
        vmname,
        'stat'
    ];
    if (username) {
        const v458 = args.push('--username', username);
        v458;
    }
    if (password) {
        const v459 = args.push('--password', password);
        v459;
    }
    const v460 = args.push(path);
    v460;
    const v461 = this.manage(args);
    const v479 = std => {
        const v462 = std.stdout;
        const v463 = /Is a directory$/g.test(v462);
        if (v463) {
            const v464 = {};
            v464.exists = true;
            v464.isDirectory = true;
            v464.isFile = false;
            v464.isLink = false;
            return v464;
        }
        const v465 = std.stdout;
        const v466 = /Is a file/g.test(v465);
        if (v466) {
            const v467 = {};
            v467.exists = true;
            v467.isDirectory = false;
            v467.isFile = true;
            v467.isLink = false;
            return v467;
        }
        const v468 = std.stdout;
        const v469 = /found, type unknown \([0-9]+\)/g.test(v468);
        if (v469) {
            const v470 = {};
            v470.exists = true;
            v470.isDirectory = false;
            v470.isFile = false;
            v470.isLink = true;
            return v470;
        }
        const v471 = std.stdout;
        const v472 = typeof v471;
        const v473 = v472 === 'string';
        const v474 = std.stdout;
        const v475 = v474.trim();
        const v476 = v473 && v475;
        if (v476) {
            const v477 = {};
            v477.exists = true;
            v477.isDirectory = false;
            v477.isFile = false;
            v477.isLink = false;
            return v477;
        }
        const v478 = {};
        v478.exists = false;
        v478.isDirectory = false;
        v478.isFile = false;
        v478.isLink = false;
        return v478;
    };
    const v480 = v461.then(v479);
    return v480;
};
VBoxManage.stat = v481;
const v498 = function (vmname, username, password, cmd, params, async) {
    const v482 = this.getInfo(vmname);
    const v496 = info => {
        const v483 = info['ostype'];
        const isWindows = /windows/i.test(v483);
        const args = [
            'guestcontrol',
            vmname
        ];
        const v484 = [];
        params = params || v484;
        if (username) {
            const v485 = args.push('--username', username);
            v485;
        }
        if (password) {
            const v486 = args.push('--password', password);
            v486;
        }
        if (async) {
            const v487 = args.push('start');
            v487;
        } else {
            const v488 = args.push('run');
            v488;
        }
        if (isWindows) {
            const v489 = args.push('--exe', 'cmd.exe', '--', 'cmd.exe', '/c');
            v489;
        } else {
            const v490 = args.push('--exe', '/bin/sh', '--', '/bin/sh', '-c');
            v490;
        }
        const v491 = cmd + ' ';
        const v492 = params.join(' ');
        const v493 = v491 + v492;
        const v494 = args.push(v493);
        v494;
        const v495 = VBoxManage.manage(args);
        return v495;
    };
    const v497 = v482.then(v496);
    return v497;
};
VBoxManage.execOnVm = v498;
const v504 = function (vmname, username, password, taskName) {
    const v499 = this.getInfo(vmname);
    const v502 = info => {
        let path;
        let params;
        const v500 = info['ostype'];
        const isWindows = /windows/i.test(v500);
        if (isWindows) {
            path = 'taskkill.exe';
            params = [
                '/f',
                '/im',
                taskName
            ];
        } else {
            path = 'sudo';
            params = [
                'killall',
                taskName
            ];
        }
        const v501 = VBoxManage.execOnVm(vmname, username, password, path, params);
        return v501;
    };
    const v503 = v499.then(v502);
    return v503;
};
VBoxManage.killOnVm = v504;
module.exports = VBoxManage;