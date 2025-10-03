const express = require('express');
const matchPath = require('./matchPath');
const v231 = require('zero-static');
const staticHandler = v231.handler;
const path = require('path');
const url = require('url');
const handlers = require('../handlers');
const fetch = require('node-fetch');
const v232 = require('debug');
const debug = v232('core');
const ora = require('ora');
const del = require('del');
const v233 = require('child_process');
const fork = v233.fork;
const forkasync = require('../utils/spawn-async');
var lambdaIdToPortMap = {};
var lambdaIdToBundleInfo = {};
var getLambdaID = function (entryFile) {
    const v234 = require('crypto');
    const v235 = v234.createHash('sha1');
    const v236 = v235.update(entryFile);
    const v237 = v236.digest('hex');
    return v237;
};
const proxyLambdaRequest = async function (req, res, endpointData) {
    const v238 = {
        color: 'green',
        spinner: 'star'
    };
    const spinner = ora(v238);
    const v239 = process.env;
    const v240 = v239.SERVERADDRESS;
    const v241 = !v240;
    if (v241) {
        const v242 = process.env;
        const v243 = req.headers;
        const v244 = v243.host;
        v242.SERVERADDRESS = 'http://' + v244;
    }
    const v245 = endpointData[1];
    var lambdaID = getLambdaID(v245);
    const v246 = lambdaIdToBundleInfo[lambdaID];
    const v247 = !v246;
    const v248 = endpointData[2];
    const v249 = handlers[v248];
    const v250 = v249.bundler;
    const v251 = v247 && v250;
    if (v251) {
        const v252 = endpointData[0];
        const v253 = url.resolve('/', v252);
        const v254 = 'Building ' + v253;
        const v255 = spinner.start(v254);
        v255;
        await getBundleInfo(endpointData);
    }
    const v256 = endpointData[0];
    const v257 = url.resolve('/', v256);
    const v258 = 'Serving ' + v257;
    const v259 = spinner.start(v258);
    v259;
    const v260 = process.env;
    var serverAddress = v260.SERVERADDRESS;
    const port = await getLambdaServerPort(endpointData);
    const v261 = endpointData[1];
    const v262 = req.method;
    const v263 = req.body;
    const v264 = debug('req', v261, port, v262, v263);
    v264;
    var lambdaAddress = 'http://127.0.0.1:' + port;
    const v265 = req.method;
    const v266 = req.headers;
    const v267 = v266.host;
    const v268 = { 'x-forwarded-host': v267 };
    const v269 = req.headers;
    const v270 = Object.assign(v268, v269);
    var options = {};
    options.method = v265;
    options.headers = v270;
    options.compress = false;
    options.redirect = 'manual';
    const v271 = req.method;
    const v272 = v271.toLowerCase();
    const v273 = v272 !== 'get';
    const v274 = req.method;
    const v275 = v274.toLowerCase();
    const v276 = v275 !== 'head';
    const v277 = v273 && v276;
    if (v277) {
        options.body = req;
    }
    const v278 = req.url;
    const v279 = lambdaAddress + v278;
    const proxyRes = await fetch(v279, options);
    const v280 = spinner.isSpinning;
    if (v280) {
        const v281 = endpointData[0];
        const v282 = url.resolve('/', v281);
        const v283 = v282 + ' ready';
        const v284 = spinner.succeed(v283);
        v284;
    }
    const v285 = proxyRes.status;
    res.statusCode = v285;
    const v286 = proxyRes.headers;
    const headers = v286.raw();
    let key;
    const v287 = Object.keys(headers);
    for (key of v287) {
        const v288 = key.toLowerCase();
        const v289 = v288 === 'location';
        const v290 = headers[key];
        const v291 = v289 && v290;
        if (v291) {
            const v292 = headers[key];
            const v293 = v292[0];
            const v294 = v293.replace(lambdaAddress, serverAddress);
            headers[key] = v294;
        }
        const v295 = headers[key];
        const v296 = res.setHeader(key, v295);
        v296;
    }
    const v297 = res.setHeader('x-powered-by', 'ZeroServer');
    v297;
    const v298 = proxyRes.body;
    const v299 = v298.pipe(res);
    v299;
    const v300 = proxyRes.body;
    const v306 = err => {
        const v301 = `Error on proxying url: ${ newUrl }`;
        const v302 = console.error(v301);
        v302;
        const v303 = err.stack;
        const v304 = console.error(v303);
        v304;
        const v305 = res.end();
        v305;
    };
    const v307 = v300.on('error', v306);
    v307;
    const v310 = () => {
        const v308 = proxyRes.body;
        const v309 = v308.destroy();
        v309;
    };
    const v311 = req.on('abort', v310);
    v311;
};
const v315 = () => {
    let id;
    for (id in lambdaIdToPortMap) {
        const v312 = lambdaIdToPortMap[id];
        const v313 = v312.process;
        const v314 = v313.kill();
        v314;
    }
};
const v316 = process.on('exit', v315);
v316;
const getBundleInfo = function (endpointData) {
    const v346 = async (resolve, reject) => {
        const entryFilePath = endpointData[1];
        const lambdaID = getLambdaID(entryFilePath);
        const v317 = lambdaIdToBundleInfo[lambdaID];
        if (v317) {
            const v318 = lambdaIdToBundleInfo[lambdaID];
            const v319 = resolve(v318);
            return v319;
        }
        const bundlerProgram = require.resolve('../builder/bundlerProcess.js');
        const v320 = !bundlerProgram;
        if (v320) {
            const v321 = resolve(false);
            return v321;
        }
        const v322 = endpointData[0];
        const v323 = endpointData[1];
        const v324 = endpointData[2];
        const v325 = 'zero-builds/' + lambdaID;
        const parameters = [
            v322,
            v323,
            v324,
            v325
        ];
        const v326 = [
            'pipe',
            'pipe',
            'pipe',
            'ipc'
        ];
        const options = {};
        options.stdio = v326;
        const child = fork(bundlerProgram, parameters, options);
        const v330 = message => {
            const v327 = {};
            v327.info = message;
            v327.process = child;
            lambdaIdToBundleInfo[lambdaID] = v327;
            const v328 = lambdaIdToBundleInfo[lambdaID];
            const v329 = resolve(v328);
            return v329;
        };
        const v331 = child.on('message', v330);
        v331;
        const v334 = () => {
            const v332 = lambdaIdToBundleInfo[lambdaID];
            const v333 = delete v332;
            v333;
        };
        const v335 = child.on('close', v334);
        v335;
        const v336 = child.stdout;
        const v339 = data => {
            const v337 = `${ data }`;
            const v338 = console.log(v337);
            v338;
        };
        const v340 = v336.on('data', v339);
        v340;
        const v341 = child.stderr;
        const v344 = data => {
            const v342 = `${ data }`;
            const v343 = console.error(v342);
            v343;
        };
        const v345 = v341.on('data', v344);
        v345;
    };
    const v347 = new Promise(v346);
    return v347;
};
const getLambdaServerPort = function (endpointData) {
    const v403 = (resolve, reject) => {
        const entryFilePath = endpointData[1];
        const lambdaID = getLambdaID(entryFilePath);
        const v348 = lambdaIdToPortMap[lambdaID];
        if (v348) {
            const v349 = lambdaIdToPortMap[lambdaID];
            const v350 = v349.port;
            const v351 = resolve(v350);
            return v351;
        }
        const v352 = endpointData[2];
        const v353 = handlers[v352];
        const program = v353.process;
        const v354 = endpointData[0];
        const v355 = endpointData[1];
        const v356 = endpointData[2];
        const v357 = process.env;
        const v358 = v357.SERVERADDRESS;
        const v359 = 'zero-builds/' + lambdaID;
        const v360 = lambdaIdToBundleInfo[lambdaID];
        const v361 = lambdaIdToBundleInfo[lambdaID];
        const v362 = v361.info;
        let v363;
        if (v360) {
            v363 = v362;
        } else {
            v363 = '';
        }
        const parameters = [
            v354,
            v355,
            v356,
            v358,
            v359,
            v363
        ];
        const v364 = [
            'pipe',
            'pipe',
            'pipe',
            'ipc'
        ];
        const options = {};
        options.stdio = v364;
        const child = fork(program, parameters, options);
        const v365 = child.stdout;
        const v368 = data => {
            const v366 = `${ data }`;
            const v367 = console.log(v366);
            v367;
        };
        const v369 = v365.on('data', v368);
        v369;
        const v370 = child.stderr;
        const v373 = data => {
            const v371 = `${ data }`;
            const v372 = console.error(v371);
            v372;
        };
        const v374 = v370.on('data', v373);
        v374;
        const v381 = message => {
            const v375 = debug('got Port for', entryFilePath, message);
            v375;
            const v376 = parseInt(message);
            const v377 = {};
            v377.port = v376;
            v377.process = child;
            v377.endpointData = endpointData;
            lambdaIdToPortMap[lambdaID] = v377;
            const v378 = lambdaIdToPortMap[lambdaID];
            const v379 = v378.port;
            const v380 = resolve(v379);
            v380;
        };
        const v382 = child.on('message', v381);
        v382;
        const v391 = err => {
            const v383 = debug('Failed to start subprocess.', err);
            v383;
            const v384 = process.env;
            const v385 = v384.BUILDPATH;
            const v386 = path.join(v385, 'zero-builds', lambdaID, '/**');
            const v387 = { force: true };
            const v388 = del(v386, v387);
            v388;
            const v389 = lambdaIdToPortMap[lambdaID];
            const v390 = delete v389;
            v390;
        };
        const v392 = child.on('error', v391);
        v392;
        const v401 = e => {
            const v393 = debug('subprocess stopped.', e);
            v393;
            const v394 = process.env;
            const v395 = v394.BUILDPATH;
            const v396 = path.join(v395, 'zero-builds', lambdaID, '/**');
            const v397 = { force: true };
            const v398 = del(v396, v397);
            v398;
            const v399 = lambdaIdToPortMap[lambdaID];
            const v400 = delete v399;
            v400;
        };
        const v402 = child.on('close', v401);
        v402;
    };
    const v404 = new Promise(v403);
    return v404;
};
const v453 = buildPath => {
    const app = express();
    const v405 = [];
    const v406 = {};
    var manifest = {};
    manifest.lambdas = v405;
    manifest.fileToLambdas = v406;
    var forbiddenStaticFiles = [];
    const v412 = (request, response) => {
        const v407 = request.url;
        var endpointData = matchPath(manifest, forbiddenStaticFiles, buildPath, v407);
        const v408 = request.url;
        const v409 = debug('match', v408, endpointData);
        v409;
        if (endpointData) {
            const v410 = proxyLambdaRequest(request, response, endpointData);
            return v410;
        }
        const v411 = staticHandler(request, response);
        return v411;
    };
    const v413 = app.all('*', v412);
    v413;
    const v414 = process.env;
    const v415 = v414.PORT;
    const v419 = () => {
        const v416 = listener.address();
        const v417 = v416.port;
        const v418 = debug('Running on port', v417);
        v418;
    };
    var listener = app.listen(v415, v419);
    const v452 = (newManifest, newForbiddenFiles, filesUpdated) => {
        const v420 = debug('updating manifest in server');
        v420;
        manifest = newManifest;
        forbiddenStaticFiles = newForbiddenFiles;
        if (filesUpdated) {
            const v446 = async file => {
                var lambdaID = getLambdaID(file);
                const v421 = lambdaIdToPortMap[lambdaID];
                const v422 = lambdaIdToPortMap[lambdaID];
                const v423 = v422.endpointData;
                const v424 = shouldKillOnChange(v423);
                const v425 = v421 && v424;
                if (v425) {
                    const v426 = lambdaIdToPortMap[lambdaID];
                    const v427 = v426.port;
                    const v428 = debug('killing', file, v427);
                    v428;
                    const v429 = lambdaIdToPortMap[lambdaID];
                    const v430 = v429.process;
                    const v431 = v430.kill();
                    v431;
                    const v432 = process.env;
                    const v433 = v432.BUILDPATH;
                    const v434 = path.join(v433, 'zero-builds', lambdaID, '/**');
                    const v435 = { force: true };
                    await del(v434, v435);
                    const v436 = newManifest.lambdas;
                    const v439 = lambda => {
                        const v437 = lambda[1];
                        const v438 = v437 === file;
                        return v438;
                    };
                    var endpointData = v436.find(v439);
                    const v440 = lambdaIdToBundleInfo[lambdaID];
                    const v441 = delete v440;
                    v441;
                    await getBundleInfo(endpointData);
                    const v442 = lambdaIdToPortMap[lambdaID];
                    const v443 = delete v442;
                    v443;
                    const v444 = debug('starting', endpointData);
                    v444;
                    if (endpointData) {
                        const v445 = getLambdaServerPort(endpointData);
                        v445;
                    }
                }
            };
            const v447 = filesUpdated.forEach(v446);
            v447;
        } else {
            let file;
            for (file in lambdaIdToPortMap) {
                const v448 = getLambdaID(file);
                const v449 = lambdaIdToPortMap[v448];
                const v450 = v449.process;
                const v451 = v450.kill();
                v451;
            }
        }
    };
    return v452;
};
module.exports = v453;
const shouldKillOnChange = function (endpointData) {
    let config;
    const v454 = endpointData[2];
    const v455 = handlers[v454];
    const v456 = endpointData[2];
    const v457 = handlers[v456];
    const v458 = v457.config;
    if (v455) {
        config = v458;
    } else {
        config = false;
    }
    if (config) {
        const v459 = config.restartOnFileChange;
        const v460 = v459 === false;
        if (v460) {
            return false;
        }
    }
    return true;
};