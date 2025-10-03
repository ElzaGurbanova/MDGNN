'use strict';
var fs = require('fs');
var yaml = require('js-yaml');
var Docker = require('dockerode');
const v238 = require('child_process');
var exec = v238.exec;
const v239 = require('child_process');
var spawn = v239.spawn;
const v474 = function (options) {
    var cwd = __dirname;
    const v240 = options.cwd;
    const v241 = typeof v240;
    const v242 = v241 == 'string';
    if (v242) {
        cwd = options.cwd;
    }
    const v259 = function (fnStdout, fnStderr, fnExit) {
        const v243 = { cwd: cwd };
        var execDockerCompose = exec('docker-compose build', v243);
        const v244 = execDockerCompose.stdout;
        const v249 = function (data) {
            const v245 = typeof fnStdout;
            const v246 = v245 == 'function';
            if (v246) {
                const v247 = data.toString();
                const v248 = fnStdout(v247);
                v248;
            }
        };
        const v250 = v244.on('data', v249);
        v250;
        const v251 = execDockerCompose.stderr;
        const v256 = function (data) {
            const v252 = typeof fnStderr;
            const v253 = v252 == 'function';
            if (v253) {
                const v254 = data.toString();
                const v255 = fnStderr(v254);
                v255;
            }
        };
        const v257 = v251.on('data', v256);
        v257;
        const v258 = execDockerCompose.on('exit', fnExit);
        v258;
    };
    const v276 = function (fnStdout, fnStderr, fnExit) {
        const v260 = { cwd: cwd };
        var execDockerCompose = exec('docker-compose create --force-recreate --build', v260);
        const v261 = execDockerCompose.stdout;
        const v266 = function (data) {
            const v262 = typeof fnStdout;
            const v263 = v262 == 'function';
            if (v263) {
                const v264 = data.toString();
                const v265 = fnStdout(v264);
                v265;
            }
        };
        const v267 = v261.on('data', v266);
        v267;
        const v268 = execDockerCompose.stderr;
        const v273 = function (data) {
            const v269 = typeof fnStderr;
            const v270 = v269 == 'function';
            if (v270) {
                const v271 = data.toString();
                const v272 = fnStderr(v271);
                v272;
            }
        };
        const v274 = v268.on('data', v273);
        v274;
        const v275 = execDockerCompose.on('exit', fnExit);
        v275;
    };
    const v280 = function () {
        const v277 = cwd + '/docker-compose.yml';
        const v278 = fs.readFileSync(v277, 'utf8');
        const v279 = yaml.safeLoad(v278);
        return v279;
    };
    const v297 = function (fnStdout, fnStderr, fnExit) {
        const v281 = { cwd: cwd };
        var execDockerCompose = exec('docker-compose down --remove-orphans', v281);
        const v282 = execDockerCompose.stdout;
        const v287 = function (data) {
            const v283 = typeof fnStdout;
            const v284 = v283 == 'function';
            if (v284) {
                const v285 = data.toString();
                const v286 = fnStdout(v285);
                v286;
            }
        };
        const v288 = v282.on('data', v287);
        v288;
        const v289 = execDockerCompose.stderr;
        const v294 = function (data) {
            const v290 = typeof fnStderr;
            const v291 = v290 == 'function';
            if (v291) {
                const v292 = data.toString();
                const v293 = fnStderr(v292);
                v293;
            }
        };
        const v295 = v289.on('data', v294);
        v295;
        const v296 = execDockerCompose.on('exit', fnExit);
        v296;
    };
    const v312 = function (fnStdout, fnStderr, fnExit) {
        const v298 = [
            'events',
            '--json'
        ];
        const v299 = { cwd: cwd };
        var spawnDockerCompose = spawn('docker-compose', v298, v299);
        const v300 = spawnDockerCompose.stdout;
        const v304 = function (data) {
            const v301 = data.toString();
            const v302 = JSON.parse(v301);
            const v303 = fnStdout(v302);
            v303;
        };
        const v305 = v300.on('data', v304);
        v305;
        const v306 = spawnDockerCompose.stderr;
        const v309 = function (data) {
            const v307 = data.toString();
            const v308 = fnStderr(v307);
            v308;
        };
        const v310 = v306.on('data', v309);
        v310;
        const v311 = execDockerCompose.on('exit', fnExit);
        v311;
    };
    const v332 = function (serviceName, cmd, fnStdout, fnStderr, fnExit) {
        const v313 = 'docker-compose exec ' + serviceName;
        const v314 = v313 + ' ';
        const v315 = v314 + cmd;
        const v316 = { cwd: cwd };
        var execDockerCompose = exec(v315, v316);
        const v317 = execDockerCompose.stdout;
        const v322 = function (data) {
            const v318 = typeof fnStdout;
            const v319 = v318 == 'function';
            if (v319) {
                const v320 = data.toString();
                const v321 = fnStdout(v320);
                v321;
            }
        };
        const v323 = v317.on('data', v322);
        v323;
        const v324 = execDockerCompose.stderr;
        const v329 = function (data) {
            const v325 = typeof fnStderr;
            const v326 = v325 == 'function';
            if (v326) {
                const v327 = data.toString();
                const v328 = fnStderr(v327);
                v328;
            }
        };
        const v330 = v324.on('data', v329);
        v330;
        const v331 = execDockerCompose.on('exit', fnExit);
        v331;
    };
    const v350 = function (serviceName, fnStdout, fnStderr, fnExit) {
        const v333 = 'docker-compose kill -s SIGINT ' + serviceName;
        const v334 = { cwd: cwd };
        var execDockerCompose = exec(v333, v334);
        const v335 = execDockerCompose.stdout;
        const v340 = function (data) {
            const v336 = typeof fnStdout;
            const v337 = v336 == 'function';
            if (v337) {
                const v338 = data.toString();
                const v339 = fnStdout(v338);
                v339;
            }
        };
        const v341 = v335.on('data', v340);
        v341;
        const v342 = execDockerCompose.stderr;
        const v347 = function (data) {
            const v343 = typeof fnStderr;
            const v344 = v343 == 'function';
            if (v344) {
                const v345 = data.toString();
                const v346 = fnStderr(v345);
                v346;
            }
        };
        const v348 = v342.on('data', v347);
        v348;
        const v349 = execDockerCompose.on('exit', fnExit);
        v349;
    };
    const v368 = function (serviceName, fnStdout, fnStderr, fnExit) {
        const v351 = 'docker-compose restart ' + serviceName;
        const v352 = { cwd: cwd };
        var execDockerCompose = exec(v351, v352);
        const v353 = execDockerCompose.stdout;
        const v358 = function (data) {
            const v354 = typeof fnStdout;
            const v355 = v354 == 'function';
            if (v355) {
                const v356 = data.toString();
                const v357 = fnStdout(v356);
                v357;
            }
        };
        const v359 = v353.on('data', v358);
        v359;
        const v360 = execDockerCompose.stderr;
        const v365 = function (data) {
            const v361 = typeof fnStderr;
            const v362 = v361 == 'function';
            if (v362) {
                const v363 = data.toString();
                const v364 = fnStderr(v363);
                v364;
            }
        };
        const v366 = v360.on('data', v365);
        v366;
        const v367 = execDockerCompose.on('exit', fnExit);
        v367;
    };
    const v386 = function (serviceName, fnStdout, fnStderr, fnExit) {
        const v369 = 'docker-compose rm -f ' + serviceName;
        const v370 = { cwd: cwd };
        var execDockerCompose = exec(v369, v370);
        const v371 = execDockerCompose.stdout;
        const v376 = function (data) {
            const v372 = typeof fnStdout;
            const v373 = v372 == 'function';
            if (v373) {
                const v374 = data.toString();
                const v375 = fnStdout(v374);
                v375;
            }
        };
        const v377 = v371.on('data', v376);
        v377;
        const v378 = execDockerCompose.stderr;
        const v383 = function (data) {
            const v379 = typeof fnStderr;
            const v380 = v379 == 'function';
            if (v380) {
                const v381 = data.toString();
                const v382 = fnStderr(v381);
                v382;
            }
        };
        const v384 = v378.on('data', v383);
        v384;
        const v385 = execDockerCompose.on('exit', fnExit);
        v385;
    };
    const v406 = function (serviceName, cmd, fnStdout, fnStderr, fnExit) {
        const v387 = 'docker-compose run ' + serviceName;
        const v388 = v387 + ' ';
        const v389 = v388 + cmd;
        const v390 = { cwd: cwd };
        var execDockerCompose = exec(v389, v390);
        const v391 = execDockerCompose.stdout;
        const v396 = function (data) {
            const v392 = typeof fnStdout;
            const v393 = v392 == 'function';
            if (v393) {
                const v394 = data.toString();
                const v395 = fnStdout(v394);
                v395;
            }
        };
        const v397 = v391.on('data', v396);
        v397;
        const v398 = execDockerCompose.stderr;
        const v403 = function (data) {
            const v399 = typeof fnStderr;
            const v400 = v399 == 'function';
            if (v400) {
                const v401 = data.toString();
                const v402 = fnStderr(v401);
                v402;
            }
        };
        const v404 = v398.on('data', v403);
        v404;
        const v405 = execDockerCompose.on('exit', fnExit);
        v405;
    };
    const v432 = function (cb) {
        var ps = '';
        const v407 = { cwd: cwd };
        var execDockerCompose = exec('docker-compose ps', v407);
        const v408 = execDockerCompose.stdout;
        const v409 = function (data) {
            ps += data.toString();
        };
        const v410 = v408.on('data', v409);
        v410;
        const v430 = function (data) {
            var lines = ps.split('\n');
            const v411 = lines.length;
            const v412 = v411 > 2;
            if (v412) {
                var containers = [];
                var key = 2;
                const v413 = lines.length;
                let v414 = key < v413;
                while (v414) {
                    const v416 = lines[key];
                    const v417 = v416.replace('\r');
                    var stats = v417.split('   ');
                    const v418 = stats[0];
                    const v419 = stats[1];
                    const v420 = v418 && v419;
                    if (v420) {
                        const v421 = stats[0];
                        const v422 = stats[1];
                        const v423 = stats[2];
                        const v424 = stats[3];
                        const v425 = {
                            name: v421,
                            command: v422,
                            state: v423,
                            ports: v424
                        };
                        const v426 = containers.push(v425);
                        v426;
                    }
                    const v415 = key++;
                    v414 = key < v413;
                }
                const v427 = cb(containers);
                v427;
            } else {
                const v428 = [];
                const v429 = cb(v428);
                v429;
            }
        };
        const v431 = execDockerCompose.on('exit', v430);
        v431;
    };
    const v449 = function (fnStdout, fnStderr, fnExit) {
        const v433 = { cwd: cwd };
        var execDockerCompose = exec('docker-compose up -d --remove-orphans', v433);
        const v434 = execDockerCompose.stdout;
        const v439 = function (data) {
            const v435 = typeof fnStdout;
            const v436 = v435 == 'function';
            if (v436) {
                const v437 = data.toString();
                const v438 = fnStdout(v437);
                v438;
            }
        };
        const v440 = v434.on('data', v439);
        v440;
        const v441 = execDockerCompose.stderr;
        const v446 = function (data) {
            const v442 = typeof fnStderr;
            const v443 = v442 == 'function';
            if (v443) {
                const v444 = data.toString();
                const v445 = fnStderr(v444);
                v445;
            }
        };
        const v447 = v441.on('data', v446);
        v447;
        const v448 = execDockerCompose.on('exit', fnExit);
        v448;
    };
    const v453 = function (options) {
        const v450 = typeof options;
        const v451 = v450 == 'object';
        if (v451) {
            options.cwd = cwd;
        } else {
            options.cwd = cwd;
            options = {};
            options = {};
        }
        const v452 = RemoteAPIModel(options);
        return v452;
    };
    const v454 = {};
    v454.build = v259;
    v454.create = v276;
    v454.config = v280;
    v454.down = v297;
    v454.events = v312;
    v454.exec = v332;
    v454.kill = v350;
    v454.restart = v368;
    v454.rm = v386;
    v454.run = v406;
    v454.ps = v432;
    v454.up = v449;
    v454.DockerRemoteAPI = v453;
    return v454;
    const RemoteAPIModel = function (options) {
        const v455 = options.cwd;
        const v456 = v455 + '/docker-compose.yml';
        const v457 = fs.readFileSync(v456, 'utf8');
        const v458 = yaml.safeLoad(v457);
        const v459 = new Docker(options);
        const v472 = function (containerName, fn) {
            const v460 = 'docker-compose ps -q ' + containerName;
            const v461 = options.cwd;
            const v462 = { cwd: v461 };
            const v470 = function (err, stdout, stderr) {
                if (err) {
                    const v463 = fn(err, null);
                    v463;
                } else {
                    if (stderr) {
                        const v464 = fn(stderr, null);
                        v464;
                    } else {
                        if (stdout) {
                            const v465 = stdout.replace('\r', '');
                            const v466 = v465.replace('\n', '');
                            const v467 = v466.substr(0, 12);
                            const v468 = fn(null, v467);
                            v468;
                        } else {
                            const v469 = fn('The requested container does not exist or is not currently active', null);
                            v469;
                        }
                    }
                }
            };
            const v471 = exec(v460, v462, v470);
            v471;
        };
        const v473 = {};
        v473.settings = v458;
        v473.dockerode = v459;
        v473.getContainerId = v472;
        return v473;
    };
};
module.exports = v474;