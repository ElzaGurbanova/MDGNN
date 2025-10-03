'use strict';
const ChildProcess = require('child_process');
let vBoxManageBinary;
let escapeArg;
const v243 = process.platform;
const v244 = /^win/.test(v243);
if (v244) {
    const v245 = process.env;
    const v246 = v245.VBOX_INSTALL_PATH;
    const v247 = process.env;
    const v248 = v247.VBOX_MSI_INSTALL_PATH;
    const vBoxInstallPath = v246 || v248;
    if (vBoxInstallPath) {
        const v249 = vBoxInstallPath.replace(/\\$/, '');
        const v250 = '"' + v249;
        const v251 = v250 + '\\VBoxManage.exe';
        vBoxManageBinary = v251 + '"';
    } else {
        const v252 = console.warn('VBOX_INSTALL_PATH or VBOX_MSI_INSTALL_PATH environment variable is not defined.');
        v252;
        vBoxManageBinary = 'VBoxManage.exe';
    }
    const v258 = arg => {
        const v253 = /\s|[\\"&]/.test(arg);
        const v254 = !v253;
        if (v254) {
            return arg;
        }
        const v255 = arg.replace(/"/g, '"""');
        const v256 = '"' + v255;
        const v257 = v256 + '"';
        return v257;
    };
    escapeArg = v258;
} else {
    vBoxManageBinary = 'vboxmanage';
    const v260 = arg => {
        const v259 = arg.replace(/([ \t\\|;&"`$*])/g, '\\$1');
        return v259;
    };
    escapeArg = v260;
}
const VBoxManage = {};
const v291 = function (command, options) {
    const v261 = [];
    command = command || v261;
    const v262 = Array.isArray(command);
    const v263 = !v262;
    if (v263) {
        command = [command];
    }
    const v264 = {};
    options = options || v264;
    let i = 0;
    const v265 = command.length;
    let v266 = i < v265;
    while (v266) {
        const v268 = command[i];
        const v269 = escapeArg(v268);
        command[i] = v269;
        const v267 = i++;
        v266 = i < v265;
    }
    let [option, value];
    const v270 = Object.entries(options);
    for ([option, value] of v270) {
        const v271 = '--' + option;
        const v272 = command.push(v271);
        v272;
        const v273 = value !== true;
        if (v273) {
            const v274 = escapeArg(value);
            const v275 = command.push(v274);
            v275;
        }
    }
    const v276 = VBoxManage.debug;
    if (v276) {
        const v277 = command.join(' ');
        const v278 = '$ VBoxManage ' + v277;
        const v279 = console.warn(v278);
        v279;
    }
    const v289 = (resolve, reject) => {
        const v280 = vBoxManageBinary + ' ';
        const v281 = command.join(' ');
        const v282 = v280 + v281;
        const v283 = {};
        const v287 = (err, stdout, stderr) => {
            if (err) {
                err.stderr = stderr;
                const v284 = reject(err);
                return v284;
            }
            const v285 = {
                stdout: stdout,
                stderr: stderr
            };
            const v286 = resolve(v285);
            return v286;
        };
        const v288 = ChildProcess.exec(v282, v283, v287);
        v288;
    };
    const v290 = new Promise(v289);
    return v290;
};
VBoxManage.manage = v291;
const v302 = function (vmname, propName) {
    const v292 = [
        'guestproperty',
        'get',
        vmname,
        propName
    ];
    const v293 = this.manage(v292);
    const v300 = std => {
        const v294 = std.stdout;
        const v295 = std.stdout;
        const v296 = v295.indexOf(':');
        const v297 = v296 + 1;
        const v298 = v294.substr(v297);
        let value = v298.trim();
        const v299 = value === 'No value set!';
        if (v299) {
            value = undefined;
        }
        return value;
    };
    const v301 = v293.then(v300);
    return v301;
};
VBoxManage.getProperty = v302;
const v305 = function (vmname, propName, value, options) {
    const v303 = [
        'guestproperty',
        'set',
        vmname,
        propName,
        value
    ];
    const v304 = this.manage(v303, options);
    return v304;
};
VBoxManage.setProperty = v305;
const v308 = function (vmname, propName) {
    const v306 = [
        'guestproperty',
        'delete',
        vmname,
        propName
    ];
    const v307 = this.manage(v306);
    return v307;
};
VBoxManage.deleteProperty = v308;
const v312 = function (vmname, newName, options) {
    const v309 = {};
    options = options || v309;
    options['name'] = newName;
    const v310 = [
        'clonevm',
        vmname
    ];
    const v311 = this.manage(v310, options);
    return v311;
};
VBoxManage.clone = v312;
const v315 = function (vmname, snapshot, newName) {
    const v313 = { 'snapshot': snapshot };
    const v314 = this.clone(vmname, newName, v313);
    return v314;
};
VBoxManage.cloneSnapshot = v315;
const v318 = function (vmname, snapshotName) {
    const v316 = [
        'snapshot',
        vmname,
        'take',
        snapshotName
    ];
    const v317 = this.manage(v316);
    return v317;
};
VBoxManage.takeSnapshot = v318;
const v321 = function (vmname, snapshotName) {
    const v319 = [
        'snapshot',
        vmname,
        'restore',
        snapshotName
    ];
    const v320 = this.manage(v319);
    return v320;
};
VBoxManage.restoreSnapshot = v321;
const v343 = function (vmname) {
    const v322 = [
        'showvminfo',
        vmname
    ];
    const v323 = { 'machinereadable': true };
    const v324 = this.manage(v322, v323);
    const v341 = std => {
        const info = {};
        let line;
        const v325 = std.stdout;
        const v326 = v325.split('\n');
        for (line of v326) {
            const v327 = line.length;
            const v328 = v327 > 0;
            if (v328) {
                const splitPoint = line.indexOf('=');
                let key = line.substr(0, splitPoint);
                const v329 = splitPoint + 1;
                let value = line.substr(v329);
                const v330 = key[0];
                const v331 = v330 === '"';
                const v332 = key.length;
                const v333 = v332 - 1;
                const v334 = key[v333];
                const v335 = v334 === '"';
                const v336 = v331 && v335;
                if (v336) {
                    const v337 = -1;
                    key = key.slice(1, v337);
                }
                const v338 = value[0];
                const v339 = v338 === '"';
                if (v339) {
                    const v340 = value.lastIndexOf('"');
                    value = value.substring(1, v340);
                } else {
                    value = value.replace(/\s+$/, '');
                }
                info[key] = value;
            }
        }
        return info;
    };
    const v342 = v324.then(v341);
    return v342;
};
VBoxManage.getInfo = v343;
const v367 = function (vmname, timeout) {
    const v344 = timeout == null;
    if (v344) {
        const v345 = -1;
        timeout = v345;
    }
    const v346 = Date.now();
    const finishLine = v346 + timeout;
    const retryDuration = 1000;
    const v347 = this.getProperty(vmname, '/VirtualBox/GuestInfo/Net/0/V4/IP');
    const v365 = address => {
        const v348 = address !== undefined;
        const v349 = -1;
        const v350 = timeout > v349;
        const v351 = Date.now();
        const v352 = finishLine - retryDuration;
        const v353 = v351 >= v352;
        const v354 = v350 && v353;
        const v355 = v348 || v354;
        if (v355) {
            return address;
        }
        let t;
        const v363 = (resolve, reject) => {
            const v362 = () => {
                const v356 = -1;
                const v357 = timeout > v356;
                if (v357) {
                    const v358 = Date.now();
                    timeout = finishLine - v358;
                }
                const v359 = VBoxManage.getIPAddress(vmname, timeout);
                const v360 = v359.then(resolve);
                const v361 = v360.catch(reject);
                v361;
            };
            t = setTimeout(v362, 1000);
        };
        const v364 = new Promise(v363);
        return v364;
    };
    const v366 = v347.then(v365);
    return v366;
};
VBoxManage.getIPAddress = v367;
const v370 = function (vmname, options) {
    const v368 = [
        'modifyvm',
        vmname
    ];
    const v369 = this.manage(v368, options);
    return v369;
};
VBoxManage.modify = v370;
const v376 = function (vmname) {
    const v371 = this.getInfo(vmname);
    const v372 = () => {
        return true;
    };
    const v373 = v371.then(v372);
    const v374 = () => {
        return false;
    };
    const v375 = v373.catch(v374);
    return v375;
};
VBoxManage.isRegistered = v376;
const v379 = function (ovfname, options) {
    const v377 = [
        'import',
        ovfname
    ];
    const v378 = this.manage(v377, options);
    return v378;
};
VBoxManage.import = v379;
const v384 = function (vmname, gui, options) {
    const v380 = {};
    options = options || v380;
    let v381;
    if (gui) {
        v381 = 'gui';
    } else {
        v381 = 'headless';
    }
    options['type'] = v381;
    const v382 = [
        '-nologo',
        'startvm',
        vmname
    ];
    const v383 = this.manage(v382, options);
    return v383;
};
VBoxManage.start = v384;
const v387 = function (vmname) {
    const v385 = [
        'controlvm',
        vmname,
        'reset'
    ];
    const v386 = this.manage(v385);
    return v386;
};
VBoxManage.reset = v387;
const v390 = function (vmname) {
    const v388 = [
        'controlvm',
        vmname,
        'resume'
    ];
    const v389 = this.manage(v388);
    return v389;
};
VBoxManage.resume = v390;
const v393 = function (vmname) {
    const v391 = [
        'controlvm',
        vmname,
        'savestate'
    ];
    const v392 = this.manage(v391);
    return v392;
};
VBoxManage.stopAndSaveState = v393;
const v396 = function (vmname) {
    const v394 = [
        'controlvm',
        vmname,
        'poweroff'
    ];
    const v395 = this.manage(v394);
    return v395;
};
VBoxManage.powerOff = v396;
const v399 = function (vmname) {
    const v397 = [
        'controlvm',
        vmname,
        'acpipowerbutton'
    ];
    const v398 = this.manage(v397);
    return v398;
};
VBoxManage.acpiPowerButton = v399;
const v402 = function (vmname) {
    const v400 = [
        'controlvm',
        vmname,
        'acpisleepbutton'
    ];
    const v401 = this.manage(v400);
    return v401;
};
VBoxManage.acpiSleepButton = v402;
const v408 = function (vmname, username, password, source, dest, recursive) {
    let args = [
        'guestcontrol',
        vmname,
        'copyto'
    ];
    if (username) {
        const v403 = args.push('--username', username);
        v403;
    }
    if (password) {
        const v404 = args.push('--password', password);
        v404;
    }
    if (recursive) {
        const v405 = args.push('--recursive');
        v405;
    }
    const v406 = args.push('--target-directory', dest);
    v406;
    args = args.concat(source);
    const v407 = this.manage(args);
    return v407;
};
VBoxManage.copyToVm = v408;
const v414 = function (vmname, username, password, source, dest, recursive) {
    let args = [
        'guestcontrol',
        vmname,
        'copyfrom'
    ];
    if (username) {
        const v409 = args.push('--username', username);
        v409;
    }
    if (password) {
        const v410 = args.push('--password', password);
        v410;
    }
    if (recursive) {
        const v411 = args.push('--recursive');
        v411;
    }
    const v412 = args.push('--target-directory', dest);
    v412;
    args = args.concat(source);
    const v413 = this.manage(args);
    return v413;
};
VBoxManage.copyFromVm = v414;
const v420 = function (vmname, username, password, path, parents) {
    const args = [
        'guestcontrol',
        vmname,
        'mkdir'
    ];
    if (username) {
        const v415 = args.push('--username', username);
        v415;
    }
    if (password) {
        const v416 = args.push('--password', password);
        v416;
    }
    if (parents) {
        const v417 = args.push('--parents');
        v417;
    }
    const v418 = args.push(path);
    v418;
    const v419 = this.manage(args);
    return v419;
};
VBoxManage.mkdir = v420;
const v426 = function (vmname, username, password, path, recursive) {
    const args = [
        'guestcontrol',
        vmname,
        'rmdir'
    ];
    if (username) {
        const v421 = args.push('--username', username);
        v421;
    }
    if (password) {
        const v422 = args.push('--password', password);
        v422;
    }
    if (recursive) {
        const v423 = args.push('--recursive');
        v423;
    }
    const v424 = args.push(path);
    v424;
    const v425 = this.manage(args);
    return v425;
};
VBoxManage.rmdir = v426;
const v432 = function (vmname, username, password, path, force) {
    const args = [
        'guestcontrol',
        vmname,
        'removefile'
    ];
    if (username) {
        const v427 = args.push('--username', username);
        v427;
    }
    if (password) {
        const v428 = args.push('--password', password);
        v428;
    }
    if (force) {
        const v429 = args.push('--force');
        v429;
    }
    const v430 = args.push(path);
    v430;
    const v431 = this.manage(args);
    return v431;
};
VBoxManage.removeFile = v432;
const v437 = function (vmname, username, password, source, dest) {
    let args = [
        'guestcontrol',
        vmname,
        'mv'
    ];
    if (username) {
        const v433 = args.push('--username', username);
        v433;
    }
    if (password) {
        const v434 = args.push('--password', password);
        v434;
    }
    args = args.concat(source);
    const v435 = args.push(dest);
    v435;
    const v436 = this.manage(args);
    return v436;
};
VBoxManage.move = v437;
VBoxManage.mv = VBoxManage.move;
const v461 = function (vmname, username, password, path) {
    const args = [
        'guestcontrol',
        vmname,
        'stat'
    ];
    if (username) {
        const v438 = args.push('--username', username);
        v438;
    }
    if (password) {
        const v439 = args.push('--password', password);
        v439;
    }
    const v440 = args.push(path);
    v440;
    const v441 = this.manage(args);
    const v459 = std => {
        const v442 = std.stdout;
        const v443 = /Is a directory$/g.test(v442);
        if (v443) {
            const v444 = {};
            v444.exists = true;
            v444.isDirectory = true;
            v444.isFile = false;
            v444.isLink = false;
            return v444;
        }
        const v445 = std.stdout;
        const v446 = /Is a file/g.test(v445);
        if (v446) {
            const v447 = {};
            v447.exists = true;
            v447.isDirectory = false;
            v447.isFile = true;
            v447.isLink = false;
            return v447;
        }
        const v448 = std.stdout;
        const v449 = /found, type unknown \([0-9]+\)/g.test(v448);
        if (v449) {
            const v450 = {};
            v450.exists = true;
            v450.isDirectory = false;
            v450.isFile = false;
            v450.isLink = true;
            return v450;
        }
        const v451 = std.stdout;
        const v452 = typeof v451;
        const v453 = v452 === 'string';
        const v454 = std.stdout;
        const v455 = v454.trim();
        const v456 = v453 && v455;
        if (v456) {
            const v457 = {};
            v457.exists = true;
            v457.isDirectory = false;
            v457.isFile = false;
            v457.isLink = false;
            return v457;
        }
        const v458 = {};
        v458.exists = false;
        v458.isDirectory = false;
        v458.isFile = false;
        v458.isLink = false;
        return v458;
    };
    const v460 = v441.then(v459);
    return v460;
};
VBoxManage.stat = v461;
const v478 = function (vmname, username, password, cmd, params, async) {
    const v462 = this.getInfo(vmname);
    const v476 = info => {
        const v463 = info['ostype'];
        const isWindows = /windows/i.test(v463);
        const args = [
            'guestcontrol',
            vmname
        ];
        const v464 = [];
        params = params || v464;
        if (username) {
            const v465 = args.push('--username', username);
            v465;
        }
        if (password) {
            const v466 = args.push('--password', password);
            v466;
        }
        if (async) {
            const v467 = args.push('start');
            v467;
        } else {
            const v468 = args.push('run');
            v468;
        }
        if (isWindows) {
            const v469 = args.push('--exe', 'cmd.exe', '--', 'cmd.exe', '/c');
            v469;
        } else {
            const v470 = args.push('--exe', '/bin/sh', '--', '/bin/sh', '-c');
            v470;
        }
        const v471 = cmd + ' ';
        const v472 = params.join(' ');
        const v473 = v471 + v472;
        const v474 = args.push(v473);
        v474;
        const v475 = VBoxManage.manage(args);
        return v475;
    };
    const v477 = v462.then(v476);
    return v477;
};
VBoxManage.execOnVm = v478;
const v484 = function (vmname, username, password, taskName) {
    const v479 = this.getInfo(vmname);
    const v482 = info => {
        let path;
        let params;
        const v480 = info['ostype'];
        const isWindows = /windows/i.test(v480);
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
        const v481 = VBoxManage.execOnVm(vmname, username, password, path, params);
        return v481;
    };
    const v483 = v479.then(v482);
    return v483;
};
VBoxManage.killOnVm = v484;
module.exports = VBoxManage;