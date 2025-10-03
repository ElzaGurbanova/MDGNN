var Promise = require('bluebird');
var _ = require('lodash');
const v259 = require('debug');
var d = v259('apiconnect:lib:plugin-loader');
const v260 = require('child_process');
var exec = v260.exec;
const v261 = require('util');
var format = v261.format;
var fs = require('fs');
const v262 = require('fs-extra');
var fsExtra = Promise.promisifyAll(v262);
const v263 = require('strong-globalize');
var g = v263();
const v264 = require('apiconnect-config');
var getConfigDir = v264.getUserConfigDir;
const v265 = require('mkdirp');
var mkdirp = Promise.promisify(v265);
const v266 = require('./util');
var mktmpdir = v266.mktmpdir;
var path = require('path');
var util = require('util');
const v267 = require('shelljs');
var which = v267.which;
const v268 = fs.readdir;
var readDirAsync = Promise.promisify(v268);
const v269 = getConfigDir();
var userPluginBaseDir = path.resolve(v269, 'plugins', 'node_modules');
const ensureUserPluginDir = function () {
    const v270 = mkdirp(userPluginBaseDir);
    return v270;
};
const validatePlugin = function (pluginPath) {
    const v271 = d('validating plugin path %s', pluginPath);
    v271;
    var pluginInfo;
    var maybePlugin;
    try {
        const v272 = path.join(pluginPath, 'package.json');
        pluginInfo = require(v272);
    } catch (err) {
        const v273 = err.message;
        const v274 = d('unable to load plugin metadata: %s', v273);
        v274;
        return false;
    }
    var k = pluginInfo.keywords;
    const v275 = !k;
    const v276 = k.indexOf('apic-toolkit-plugin');
    const v277 = -1;
    const v278 = v276 !== v277;
    const v279 = process.env;
    const v280 = v279.APIC_DEV;
    const v281 = k.indexOf('apic-toolkit-dev-plugin');
    const v282 = -1;
    const v283 = v281 !== v282;
    const v284 = v280 && v283;
    const v285 = v278 || v284;
    const v286 = !v285;
    const v287 = v275 || v286;
    if (v287) {
        const v288 = d('invalid plugin: missing keyword');
        v288;
        return false;
    }
    try {
        maybePlugin = require(pluginPath);
    } catch (err) {
        const v289 = err.message;
        const v290 = d('unable to load plugin: %s', v289);
        v290;
        return false;
    }
    const v291 = maybePlugin.getTopics;
    const v292 = maybePlugin.getComponents;
    const v293 = v291 || v292;
    const v294 = maybePlugin && v293;
    const v295 = maybePlugin.getTopics;
    const v296 = typeof v295;
    const v297 = v296 === 'function';
    const v298 = maybePlugin.getComponents;
    const v299 = typeof v298;
    const v300 = v299 === 'function';
    const v301 = v297 || v300;
    const v302 = v294 && v301;
    const v303 = !v302;
    if (v303) {
        const v304 = d('invalid plugin: no topics/commands found');
        v304;
        return false;
    }
    var maybePluginTopics;
    var maybePluginComponents;
    const v305 = maybePlugin.getTopics;
    if (v305) {
        maybePluginTopics = maybePlugin.getTopics();
    }
    const v306 = maybePlugin.getComponents;
    if (v306) {
        maybePluginComponents = maybePlugin.getComponents();
    }
    const v307 = util.isArray(maybePluginTopics);
    const v308 = !v307;
    const v309 = util.isArray(maybePluginComponents);
    const v310 = !v309;
    const v311 = v308 && v310;
    if (v311) {
        const v312 = d('invalid plugin: no topics/components found');
        v312;
        return false;
    }
    var validTopics = [];
    var validComponents = [];
    if (maybePluginTopics) {
        const v313 = _(maybePluginTopics);
        const v352 = function (maybeTopic) {
            const v314 = !maybeTopic;
            const v315 = maybeTopic.name;
            const v316 = !v315;
            const v317 = v314 || v316;
            const v318 = maybeTopic.commands;
            const v319 = !v318;
            const v320 = v317 || v319;
            if (v320) {
                return null;
            }
            const v321 = maybeTopic.commands;
            const v322 = _(v321);
            const v349 = function (maybeCommand) {
                const v323 = maybeCommand.command;
                const v324 = !v323;
                const v325 = maybeCommand.aliases;
                const v326 = !v325;
                const v327 = v324 || v326;
                const v328 = maybeCommand.aliases;
                const v329 = util.isArray(v328);
                const v330 = !v329;
                const v331 = v327 || v330;
                const v332 = maybeCommand.options;
                const v333 = !v332;
                const v334 = v331 || v333;
                const v335 = maybeCommand.options;
                const v336 = util.isArray(v335);
                const v337 = !v336;
                const v338 = v334 || v337;
                const v339 = maybeCommand.helpInfo;
                const v340 = !v339;
                const v341 = v338 || v340;
                const v342 = maybeCommand.action;
                const v343 = !v342;
                const v344 = v341 || v343;
                const v345 = maybeCommand.action;
                const v346 = typeof v345;
                const v347 = v346 !== 'function';
                const v348 = v344 || v347;
                if (v348) {
                    return false;
                }
                return maybeCommand;
            };
            const v350 = v322.map(v349);
            const v351 = v350.compact();
            var commands = v351.value();
            maybeTopic.commands = commands;
            return maybeTopic;
        };
        const v353 = v313.map(v352);
        const v354 = v353.compact();
        validTopics = v354.value();
    }
    if (maybePluginComponents) {
        const v355 = _(maybePluginComponents);
        const v378 = function (maybeComp) {
            const v356 = !maybeComp;
            const v357 = maybeComp.name;
            const v358 = !v357;
            const v359 = v356 || v358;
            const v360 = maybeComp.ctor;
            const v361 = !v360;
            const v362 = v359 || v361;
            const v363 = maybeComp.ctor;
            const v364 = typeof v363;
            const v365 = v364 !== 'function';
            const v366 = v362 || v365;
            const v367 = maybeComp.ctor;
            const v368 = v367.prototype;
            const v369 = v368.start;
            const v370 = !v369;
            const v371 = v366 || v370;
            const v372 = maybeComp.ctor;
            const v373 = v372.prototype;
            const v374 = v373.start;
            const v375 = typeof v374;
            const v376 = v375 !== 'function';
            const v377 = v371 || v376;
            if (v377) {
                return null;
            }
            return maybeComp;
        };
        const v379 = v355.map(v378);
        const v380 = v379.compact();
        validComponents = v380.value();
    }
    const v381 = validTopics.length;
    const v382 = validComponents.length;
    const v383 = v381 + v382;
    const v384 = v383 > 0;
    return v384;
};
exports.validatePlugin = validatePlugin;
const installPlugin = function (pluginUri, registryUri) {
    const v385 = which('npm');
    const v386 = which('npm.bat');
    var npmScript = v385 || v386;
    const v387 = !npmScript;
    if (v387) {
        const v388 = g.f('The npm executable is not found on the path.');
        const v389 = new Error(v388);
        throw v389;
    }
    try {
        var maybeLocalPath = path.resolve(pluginUri);
        const v390 = fs.statSync(maybeLocalPath);
        if (v390) {
            pluginUri = maybeLocalPath;
        }
    } catch (e) {
    }
    const v391 = mktmpdir();
    const v392 = v391.then(installPluginInDir);
    const v398 = function (pluginDir) {
        const v393 = validatePlugin(pluginDir);
        const v394 = !v393;
        if (v394) {
            const v395 = g.f('The plugin is invalid.');
            const v396 = new Error(v395);
            throw v396;
        }
        const v397 = copyPluginIntoPlace(pluginDir);
        return v397;
    };
    const v399 = v392.then(v398);
    return v399;
    const copyPluginIntoPlace = function (srcDir) {
        var pluginName = path.basename(srcDir);
        var destDir = path.join(userPluginBaseDir, pluginName);
        const v400 = d('copy plugin from %s to %s', srcDir, destDir);
        v400;
        const v401 = { dereference: true };
        const v402 = fsExtra.copyAsync(srcDir, destDir, v401);
        return v402;
    };
    const installPluginInDir = function (dir) {
        var installCmd = format('"%s" --prefix "%s" install %s -g --silent --no-spin --no-progress', npmScript, dir, pluginUri);
        if (registryUri) {
            installCmd = format('%s --registry=%s', installCmd, registryUri);
        }
        const v403 = d(installCmd);
        v403;
        const v440 = function (resolve, reject) {
            const v433 = function (err) {
                if (err) {
                    const v404 = err.message;
                    const v405 = d('Error running npm install: %s', v404);
                    v405;
                    const v406 = reject(err);
                    return v406;
                }
                const v407 = process.platform;
                var isWindows = /^win/.test(v407);
                var pluginBase;
                if (isWindows) {
                    pluginBase = path.join(dir, 'node_modules');
                } else {
                    pluginBase = path.join(dir, 'lib', 'node_modules');
                }
                var pluginDirs = fs.readdirSync(pluginBase);
                const v408 = d('tmp install dir listing %j', pluginDirs);
                v408;
                const v409 = pluginDirs[0];
                const v410 = v409 === '.bin';
                if (v410) {
                    const v411 = pluginDirs.shift();
                    v411;
                }
                const v412 = pluginDirs.length;
                const v413 = v412 < 1;
                if (v413) {
                    const v414 = g.f('NPM installation failed');
                    const v415 = reject(v414);
                    return v415;
                }
                const v416 = pluginDirs[0];
                var pluginDir = path.join(pluginBase, v416);
                const v417 = loadPlugins();
                const v431 = function (plugins) {
                    const v418 = path.join(pluginDir, 'package.json');
                    var pkg = require(v418);
                    const v419 = _(plugins);
                    const v420 = pkg.name;
                    const v421 = { name: v420 };
                    var pluginInfo = v419.find(v421);
                    const v422 = pluginInfo.isBuiltin;
                    const v423 = pluginInfo && v422;
                    if (v423) {
                        const v424 = pluginInfo.name;
                        const v425 = pluginInfo.version;
                        const v426 = g.f('The built-in plugin %s %s is already installed.', v424, v425);
                        var err = new Error(v426);
                        const v427 = reject(err);
                        return v427;
                    }
                    const v428 = pluginDirs[0];
                    const v429 = d('found installed plugin in %s', v428);
                    v429;
                    const v430 = resolve(pluginDir);
                    return v430;
                };
                const v432 = v417.then(v431);
                return v432;
            };
            var proc = exec(installCmd, v433);
            const v434 = proc.stdout;
            const v435 = process.stdout;
            const v436 = v434.pipe(v435);
            v436;
            const v437 = proc.stderr;
            const v438 = process.stderr;
            const v439 = v437.pipe(v438);
            v439;
        };
        const v441 = new Promise(v440);
        return v441;
    };
};
exports.installPlugin = installPlugin;
const loadPluginFromDir = function (pluginDir, isBuiltin) {
    const v442 = typeof isBuiltin;
    const v443 = v442 === 'undefined';
    if (v443) {
        isBuiltin = false;
    }
    const v444 = d('loading %s', pluginDir);
    v444;
    try {
        const v445 = validatePlugin(pluginDir);
        const v446 = !v445;
        if (v446) {
            const v447 = Promise.resolve();
            return v447;
        }
    } catch (err) {
        const v448 = d('error loading %s: %s', pluginDir, err);
        v448;
        const v449 = Promise.resolve();
        return v449;
    }
    const v450 = require(pluginDir);
    const v451 = v450.getVersion;
    const v452 = !v451;
    const v453 = require(pluginDir);
    const v454 = v453.getVersion;
    const v455 = typeof v454;
    const v456 = v455 !== 'function';
    const v457 = v452 || v456;
    if (v457) {
        const v458 = path.join(pluginDir, 'package.json');
        var pkg = require(v458);
        var plugin = require(pluginDir);
        const v459 = pkg.name;
        const v460 = pkg.version;
        const v461 = plugin.getTopics;
        const v462 = plugin.getTopics();
        let v463;
        if (v461) {
            v463 = v462;
        } else {
            v463 = null;
        }
        const v464 = plugin.getComponents;
        const v465 = plugin.getComponents();
        let v466;
        if (v464) {
            v466 = v465;
        } else {
            v466 = null;
        }
        const v467 = pkg.gitHead;
        const v468 = {};
        v468.name = v459;
        v468.version = v460;
        v468.topics = v463;
        v468.components = v466;
        v468.path = pluginDir;
        v468.isBuiltin = isBuiltin;
        v468.gitHead = v467;
        return v468;
    } else {
        const v469 = require(pluginDir);
        const v470 = v469.getVersion();
        return v470;
    }
};
exports.loadPluginFromDir = loadPluginFromDir;
const loadPluginsFromDir = function (basedir, isBuiltin) {
    let directories;
    const v471 = util.isArray(basedir);
    const v472 = [basedir];
    if (v471) {
        directories = basedir;
    } else {
        directories = v472;
    }
    const v473 = Promise.map(directories, processDir);
    const v478 = function (res) {
        const v474 = _(res);
        const v475 = v474.compact();
        const v476 = v475.flatten();
        const v477 = v476.value();
        return v477;
    };
    const v479 = v473.then(v478);
    return v479;
    const processDir = function (directory) {
        const v480 = readDirAsync(directory);
        const v485 = function (dirs) {
            const v483 = function (d) {
                const v481 = path.join(directory, d);
                const v482 = loadPluginFromDir(v481, isBuiltin);
                return v482;
            };
            const v484 = Promise.map(dirs, v483);
            return v484;
        };
        const v486 = v480.then(v485);
        const v489 = function (err) {
            const v487 = err.message;
            const v488 = d('caught error while loading %s', directory, v487);
            v488;
            return;
        };
        const v490 = v486.catch(v489);
        return v490;
    };
};
const loadPlugins = function (dir) {
    const v491 = ensureUserPluginDir();
    const v496 = function () {
        const v492 = exports.getPluginDirs(dir);
        const v493 = loadPluginsFromDir(v492, true);
        const v494 = loadPluginsFromDir(userPluginBaseDir, false);
        var load = [
            v493,
            v494
        ];
        const v495 = Promise.all(load);
        return v495;
    };
    const v497 = v491.then(v496);
    const v504 = function (res) {
        const v498 = require('./plugins');
        const v499 = res.push(v498);
        v499;
        const v500 = _(res);
        const v501 = v500.flatten();
        const v502 = v501.compact();
        const v503 = v502.value();
        return v503;
    };
    const v505 = v497.then(v504);
    return v505;
};
exports.loadPlugins = loadPlugins;
exports.__loaderContext = __dirname;
const init = function (nodeModulesDir) {
    exports.__loaderContext = nodeModulesDir;
};
exports.init = init;
const getContextDirs = function (root) {
    const v506 = exports.__loaderContext;
    root = root || v506;
    const v507 = util.isArray(root);
    const v508 = [root];
    let v509;
    if (v507) {
        v509 = root;
    } else {
        v509 = v508;
    }
    return v509;
};
exports.getContextDirs = getContextDirs;
const getPluginDirs = function (root) {
    const v510 = getContextDirs(root);
    const v511 = _(v510);
    const v513 = function (dir) {
        const v512 = path.resolve(dir, 'node_modules');
        return v512;
    };
    const v514 = v511.map(v513);
    const v515 = v514.compact();
    const v516 = v515.value();
    return v516;
};
exports.getPluginDirs = getPluginDirs;