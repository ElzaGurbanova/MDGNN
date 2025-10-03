'use strict';
const os = require('os');
const util = require('util');
const v230 = require('child_process');
const v231 = v230.exec;
const exec = util.promisify(v231);
const PS_HEADER_OSX = 'USERPID%CPU%MEMVSZRSSTTSTATSTARTEDTIMECOMMAND';
const PS_HEADER_LINUX = 'USERPID%CPU%MEMVSZRSSTTYSTATSTARTTIMECOMMAND';
const USER = 'user';
const PID = 'pid';
const CPU = 'cpu';
const MEM = 'mem';
const VSZ = 'vsz';
const RSS = 'rss';
const TT = 'tt';
const STAT = 'stat';
const STARTED = 'started';
const TIME = 'time';
const COMMAND = 'command';
const KILL_SIGNAL_OSX = [
    'SIGHUP',
    'SIGINT',
    'SIGQUIT',
    'SIGILL',
    'SIGTRAP',
    'SIGABRT',
    'SIGEMT',
    'SIGFPE',
    'SIGKILL',
    'SIGBUS',
    'SIGSEGV',
    'SIGSYS',
    'SIGPEPE',
    'SIGALRM',
    'SIGTERM',
    'SIGURG',
    'SIGSTOP',
    'SIGTSTP',
    'SIGCONT',
    'SIGCHLD',
    'SIGTTIN',
    'SIGTTOU',
    'SIGIO',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGVTALRM',
    'SIGPROF',
    'SIGWINCH',
    'SIGINFO',
    'SIGUSR1',
    'SIGUSR2'
];
const KILL_SIGNAL_LINUX = [
    'SIGHUP',
    'SIGINT',
    'SIGQUIT',
    'SIGILL',
    'SIGTRAP',
    'SIGABRT',
    'SIGBUS',
    'SIGFPE',
    'SIGKILL',
    'SIGUSR1',
    'SIGSEGV',
    'SIGUSR2',
    'SIGPIPE',
    'SIGALRM',
    'SIGTERM',
    'SIGSTKFLT',
    'SIGCHLD',
    'SIGCONT',
    'SIGSTOP',
    'SIGTSTP',
    'SIGTTIN',
    'SIGTTOU',
    'SIGURG',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGVTALRM',
    'SIGPROF',
    'SIGWINCH',
    'SIGIO',
    'SIGPWR',
    'SIGSYS',
    'SIGRTMIN',
    'SIGRTMIN+1',
    'SIGRTMIN+2',
    'SIGRTMIN+3',
    'SIGRTMIN+4',
    'SIGRTMIN+5',
    'SIGRTMIN+6',
    'SIGRTMIN+7',
    'SIGRTMIN+8',
    'SIGRTMIN+9',
    'SIGRTMIN+10',
    'SIGRTMIN+11',
    'SIGRTMIN+12',
    'SIGRTMIN+13',
    'SIGRTMIN+14',
    'SIGRTMIN+15',
    'SIGRTMAX-14',
    'SIGRTMAX-13',
    'SIGRTMAX-12',
    'SIGRTMAX-11',
    'SIGRTMAX-10',
    'SIGRTMAX-9',
    'SIGRTMAX-8',
    'SIGRTMAX-7',
    'SIGRTMAX-6',
    'SIGRTMAX-5',
    'SIGRTMAX-4',
    'SIGRTMAX-3',
    'SIGRTMAX-2',
    'SIGRTMAX-1',
    'SIGRTMAX'
];
const psRaw = (extra, keywords, filterWaste = true) => {
    let cmd = 'ps aux';
    if (extra) {
        cmd += ` | ${ extra }`;
    }
    const v232 = exec(cmd);
    const v275 = result => {
        const v233 = result.stderr;
        if (v233) {
            const v234 = result.stderr;
            const v235 = new Error(v234);
            throw v235;
        }
        const v236 = result.stdout;
        if (v236) {
            const v237 = result.stdout;
            const tmp1 = v237.split(/(\r\n)|(\n\r)|\n|\r/);
            const v238 = tmp1.length;
            const v239 = v238 === 0;
            if (v239) {
                const v240 = [];
                return v240;
            }
            const tmp2 = [];
            const v243 = element => {
                if (element) {
                    const t = element.trim();
                    const v241 = t !== '';
                    if (v241) {
                        const v242 = tmp2.push(t);
                        v242;
                    }
                }
            };
            const v244 = tmp1.forEach(v243);
            v244;
            const v245 = tmp2.length;
            const v246 = v245 === 0;
            if (v246) {
                const v247 = [];
                return v247;
            }
            const v248 = tmp2[0];
            const v249 = checkHeader(v248);
            if (v249) {
                const v250 = tmp2.shift();
                v250;
            }
            const v251 = tmp2.length;
            const v252 = v251 === 0;
            if (v252) {
                const v253 = [];
                return v253;
            }
            const v272 = value => {
                if (filterWaste) {
                    const v254 = value.includes('ps aux');
                    if (v254) {
                        return false;
                    }
                    const v255 = value.includes('grep');
                    if (v255) {
                        const t = parseLine(value);
                        const v256 = t[COMMAND];
                        const v257 = v256.trim();
                        const v258 = v257.split(/\s+/);
                        const v264 = value => {
                            const v259 = value !== undefined;
                            const v260 = value !== null;
                            const v261 = v259 && v260;
                            const v262 = value !== '';
                            const v263 = v261 && v262;
                            return v263;
                        };
                        const tCmd = v258.filter(v264);
                        const v265 = tCmd[0];
                        const v266 = v265 === 'grep';
                        if (v266) {
                            return false;
                        }
                    }
                }
                if (keywords) {
                    const v267 = Array.isArray(keywords);
                    if (v267) {
                        let element;
                        for (element of keywords) {
                            const v268 = value.includes(element);
                            const v269 = !v268;
                            if (v269) {
                                return false;
                            }
                        }
                    } else {
                        const v270 = value.includes(keywords);
                        const v271 = !v270;
                        if (v271) {
                            return false;
                        }
                    }
                }
                return true;
            };
            const v273 = tmp2.filter(v272);
            return v273;
        }
        const v274 = [];
        return v274;
    };
    const v276 = v232.then(v275);
    return v276;
};
const checkHeader = line => {
    const tmp = line.replace(/\s/ig, '');
    const v277 = os.platform();
    const v278 = v277 === 'linux';
    if (v278) {
        const v279 = tmp === PS_HEADER_LINUX;
        return v279;
    } else {
        const v280 = os.platform();
        const v281 = v280 === 'darwin';
        if (v281) {
            const v282 = tmp === PS_HEADER_OSX;
            return v282;
        }
    }
    return false;
};
const parseLine = line => {
    const v283 = line.split(/\s+/);
    const v289 = value => {
        const v284 = value !== undefined;
        const v285 = value !== null;
        const v286 = v284 && v285;
        const v287 = value !== '';
        const v288 = v286 && v287;
        return v288;
    };
    const fields = v283.filter(v289);
    const info = {};
    const v290 = fields[0];
    info[USER] = v290;
    const v291 = fields[1];
    info[PID] = v291;
    const v292 = fields[2];
    info[CPU] = v292;
    const v293 = fields[3];
    info[MEM] = v293;
    const v294 = fields[4];
    info[VSZ] = v294;
    const v295 = fields[5];
    info[RSS] = v295;
    const v296 = fields[6];
    info[TT] = v296;
    const v297 = fields[7];
    info[STAT] = v297;
    const v298 = fields[8];
    info[STARTED] = v298;
    const v299 = fields[9];
    info[TIME] = v299;
    const v300 = fields[10];
    let cmd = v300.trim();
    let i = 11;
    const v301 = fields.length;
    let v302 = i < v301;
    while (v302) {
        const v304 = fields[i];
        const v305 = v304.trim();
        cmd += ` ${ v305 }`;
        const v303 = i++;
        v302 = i < v301;
    }
    info[COMMAND] = cmd;
    return info;
};
const ps = (condition, extra, keywords, filterWaste = true) => {
    const v306 = psRaw(extra, keywords, filterWaste);
    const v323 = result => {
        const v307 = result.length;
        const v308 = v307 === 0;
        if (v308) {
            const v309 = [];
            return v309;
        }
        const tmp1 = [];
        const v312 = element => {
            const v310 = parseLine(element);
            const v311 = tmp1.push(v310);
            v311;
        };
        const v313 = result.forEach(v312);
        v313;
        const v321 = value => {
            const v314 = typeof condition;
            const v315 = v314 === 'object';
            const v316 = Object.keys(condition);
            const v317 = v316.length;
            const v318 = v317 > 0;
            const v319 = v315 && v318;
            if (v319) {
                const v320 = checkCondition(value, condition);
                return v320;
            }
            return true;
        };
        const v322 = tmp1.filter(v321);
        return v322;
    };
    const v324 = v306.then(v323);
    return v324;
};
const checkCondition = (line, condition) => {
    const v325 = !condition;
    if (v325) {
        return true;
    }
    const keys = Object.keys(condition);
    const v326 = keys.length;
    const v327 = v326 === 0;
    if (v327) {
        return true;
    }
    const v328 = keys.includes(USER);
    if (v328) {
        const v329 = line[USER];
        const v330 = condition[USER];
        const v331 = stringCompare(v329, v330);
        const v332 = !v331;
        if (v332) {
            return false;
        }
    }
    const v333 = keys.includes(PID);
    if (v333) {
        const v334 = condition[PID];
        const v335 = v334.toString();
        const v336 = v335.trim();
        const v337 = line[PID];
        const v338 = v336 !== v337;
        if (v338) {
            return false;
        }
    }
    const v339 = keys.includes(CPU);
    if (v339) {
        const v340 = line[CPU];
        const v341 = condition[CPU];
        const v342 = numberCompare(v340, v341);
        const v343 = !v342;
        if (v343) {
            return false;
        }
    }
    const v344 = keys.includes(MEM);
    if (v344) {
        const v345 = line[MEM];
        const v346 = condition[MEM];
        const v347 = numberCompare(v345, v346);
        const v348 = !v347;
        if (v348) {
            return false;
        }
    }
    const v349 = keys.includes(VSZ);
    if (v349) {
        const v350 = line[VSZ];
        const v351 = condition[VSZ];
        const v352 = numberCompare(v350, v351);
        const v353 = !v352;
        if (v353) {
            return false;
        }
    }
    const v354 = keys.includes(RSS);
    if (v354) {
        const v355 = line[RSS];
        const v356 = condition[RSS];
        const v357 = numberCompare(v355, v356);
        const v358 = !v357;
        if (v358) {
            return false;
        }
    }
    const v359 = keys.includes(TT);
    if (v359) {
        const v360 = condition[TT];
        const v361 = v360.toString();
        const v362 = v361.trim();
        const v363 = line[TT];
        const v364 = v362 !== v363;
        if (v364) {
            return false;
        }
    }
    const v365 = keys.includes(STAT);
    if (v365) {
        const v366 = condition[STAT];
        const v367 = v366.toString();
        const v368 = v367.trim();
        const v369 = line[STAT];
        const v370 = v368 !== v369;
        if (v370) {
            return false;
        }
    }
    const v371 = keys.includes(STARTED);
    if (v371) {
    }
    const v372 = keys.includes(TIME);
    if (v372) {
    }
    const v373 = keys.includes(COMMAND);
    if (v373) {
        const v374 = condition[COMMAND];
        const v375 = v374.trim();
        const cmd = v375.split(/\s+/);
        const v376 = cmd.length;
        const v377 = v376 === 1;
        if (v377) {
            const v378 = line[COMMAND];
            const v379 = cmd[0];
            const v380 = stringCompare(v378, v379);
            const v381 = !v380;
            if (v381) {
                return false;
            }
        } else {
            const v382 = cmd.length;
            const v383 = v382 > 1;
            if (v383) {
                let element;
                for (element of cmd) {
                    let t = element.trim();
                    const v384 = !t;
                    if (v384) {
                        continue;
                    }
                    const v385 = t.startsWith('~');
                    const v386 = !v385;
                    if (v386) {
                        t = '~' + t;
                    }
                    const v387 = line[COMMAND];
                    const v388 = stringCompare(v387, t);
                    const v389 = !v388;
                    if (v389) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};
const numberCompare = (origin, compare) => {
    const v390 = !origin;
    if (v390) {
        return false;
    }
    const v391 = !compare;
    if (v391) {
        return true;
    }
    let originTmp = NaN;
    const v392 = typeof origin;
    const v393 = v392 === 'number';
    if (v393) {
        originTmp = origin;
    } else {
        const v394 = origin.trim();
        const v395 = +v394;
        originTmp = v395;
    }
    const v396 = Number.isNaN(originTmp);
    if (v396) {
        return false;
    }
    const v397 = compare.trim();
    const compareTmp = v397.split(/\s+/);
    const v398 = compareTmp.length;
    const v399 = v398 === 0;
    if (v399) {
        return true;
    }
    let element;
    for (element of compareTmp) {
        const tElement = element.trim();
        const v400 = !tElement;
        if (v400) {
            continue;
        }
        const v401 = tElement.startsWith('>=');
        if (v401) {
            const v402 = tElement.slice(2);
            const v403 = +v402;
            const tCompare = v403;
            if (tCompare) {
                const v404 = originTmp < tCompare;
                if (v404) {
                    return false;
                }
            }
        } else {
            const v405 = tElement.startsWith('<=');
            if (v405) {
                const v406 = tElement.slice(2);
                const v407 = +v406;
                const tCompare = v407;
                if (tCompare) {
                    const v408 = originTmp > tCompare;
                    if (v408) {
                        return false;
                    }
                }
            } else {
                const v409 = tElement.startsWith('>');
                if (v409) {
                    const v410 = tElement.slice(1);
                    const v411 = +v410;
                    const tCompare = v411;
                    if (tCompare) {
                        const v412 = originTmp <= tCompare;
                        if (v412) {
                            return false;
                        }
                    }
                } else {
                    const v413 = tElement.startsWith('<');
                    if (v413) {
                        const v414 = tElement.slice(1);
                        const v415 = +v414;
                        const tCompare = v415;
                        if (tCompare) {
                            const v416 = originTmp >= tCompare;
                            if (v416) {
                                return false;
                            }
                        }
                    } else {
                        const v417 = -1;
                        let tCompare = v417;
                        const v418 = tElement.startsWith('=');
                        if (v418) {
                            const v419 = tElement.slice(1);
                            const v420 = +v419;
                            tCompare = v420;
                        } else {
                            const v421 = +tElement;
                            tCompare = v421;
                        }
                        if (tCompare) {
                            const v422 = originTmp !== tCompare;
                            if (v422) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
};
const stringCompare = (origin, compare) => {
    const v423 = !origin;
    if (v423) {
        return false;
    }
    const v424 = !compare;
    if (v424) {
        return true;
    }
    const originTmp = origin.trim();
    const v425 = !originTmp;
    if (v425) {
        return false;
    }
    const compareTmp = compare.trim();
    const v426 = !compareTmp;
    if (v426) {
        return true;
    }
    const v427 = compareTmp.startsWith('~');
    if (v427) {
        const tCompare = compareTmp.slice(1);
        const v428 = originTmp.includes(tCompare);
        const v429 = !v428;
        if (v429) {
            return false;
        }
    } else {
        const v430 = originTmp !== compareTmp;
        if (v430) {
            return false;
        }
    }
    return true;
};
const kill = (pid, signal) => {
    const v431 = -1;
    let signalIndex = v431;
    if (signal) {
        const v432 = Number.isInteger(signal);
        if (v432) {
            signalIndex = signal;
        } else {
            signalIndex = getSignal(signal);
        }
    }
    let cmd = '';
    const v433 = signalIndex < 0;
    if (v433) {
        cmd = `kill ${ pid }`;
    } else {
        cmd = `kill -${ signalIndex } ${ pid }`;
    }
    const v434 = exec(cmd);
    const v439 = result => {
        const v435 = result.stderr;
        if (v435) {
            const v436 = result.stderr;
            const v437 = new Error(v436);
            throw v437;
        }
        const v438 = Promise.resolve();
        return v438;
    };
    const v440 = v434.then(v439);
    return v440;
};
const getSignal = signal => {
    let tmp = signal.trim();
    const v441 = tmp.startsWith('SIG');
    const v442 = !v441;
    if (v442) {
        tmp = 'SIG' + tmp;
    }
    const v443 = -1;
    let index = v443;
    const v444 = os.platform();
    const v445 = v444 === 'linux';
    if (v445) {
        index = KILL_SIGNAL_LINUX.indexOf(tmp);
    } else {
        const v446 = os.platform();
        const v447 = v446 === 'darwin';
        if (v447) {
            index = KILL_SIGNAL_OSX.indexOf(tmp);
        }
    }
    const v448 = index >= 0;
    if (v448) {
        index += 1;
    }
    return index;
};
const getSignalRaw = signal => {
    let tmp = signal.trim();
    const v449 = tmp.startsWith('SIG');
    if (v449) {
        tmp = tmp.slice(3);
    }
    const cmd = `kill -l ${ tmp }`;
    const v450 = exec(cmd);
    const v456 = result => {
        const v451 = result.stderr;
        if (v451) {
            const v452 = result.stderr;
            const v453 = new Error(v452);
            throw v453;
        }
        const v454 = result.stdout;
        const tSignal = Number.parseInt(v454);
        if (tSignal) {
            return tSignal;
        }
        const v455 = -1;
        return v455;
    };
    const v457 = v450.then(v456);
    return v457;
};
const v458 = {};
v458.ps = ps;
v458.kill = kill;
v458.getSignalRaw = getSignalRaw;
module.exports = v458;