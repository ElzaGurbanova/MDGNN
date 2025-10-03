const express = require('express');
const compression = require('compression');
const matchPath = require('./matchPath');
const v233 = require('zero-static');
const staticHandler = v233.handler;
const path = require('path');
const url = require('url');
const handlers = require('zero-handlers-map');
const fetch = require('node-fetch');
const fs = require('fs');
const v234 = require('debug');
const debug = v234('core');
const ora = require('ora');
const del = require('del');
const v235 = require('child_process');
const fork = v235.fork;
const forkasync = require('../utils/spawn-async');
const bundlerProgram = require.resolve('zero-bundler-process');
var lambdaIdToPortMap = {};
var lambdaIdToBundleInfo = {};
var updatedManifest = false;
var getLambdaID = function (entryFile) {
    const v236 = require('crypto');
    const v237 = v236.createHash('sha1');
    const v238 = v237.update(entryFile);
    const v239 = v238.digest('hex');
    return v239;
};
const proxyLambdaRequest = async function (req, res, endpointData) {
    const v240 = {
        color: 'green',
        spinner: 'star'
    };
    const spinner = ora(v240);
    const v241 = process.env;
    const v242 = v241.SERVERADDRESS;
    const v243 = !v242;
    if (v243) {
        const v244 = process.env;
        const v245 = req.headers;
        const v246 = v245.host;
        v244.SERVERADDRESS = 'http://' + v246;
    }
    const v247 = endpointData[0];
    var lambdaID = getLambdaID(v247);
    const v248 = lambdaIdToBundleInfo[lambdaID];
    const v249 = !v248;
    const v250 = endpointData[2];
    const v251 = handlers[v250];
    const v252 = v251.bundler;
    const v253 = v249 && v252;
    if (v253) {
        const v254 = endpointData[0];
        const v255 = url.resolve('/', v254);
        const v256 = 'Building ' + v255;
        const v257 = spinner.start(v256);
        v257;
        await getBundleInfo(endpointData);
    }
    const v258 = endpointData[0];
    const v259 = url.resolve('/', v258);
    const v260 = 'Serving ' + v259;
    const v261 = spinner.start(v260);
    v261;
    const v262 = process.env;
    var serverAddress = v262.SERVERADDRESS;
    const port = await getLambdaServerPort(endpointData);
    const v263 = endpointData[1];
    const v264 = req.method;
    const v265 = req.body;
    const v266 = debug('req', v263, port, v264, v265);
    v266;
    var lambdaAddress = 'http://127.0.0.1:' + port;
    const v267 = req.method;
    const v268 = req.headers;
    const v269 = v268.host;
    const v270 = { 'x-forwarded-host': v269 };
    const v271 = req.headers;
    const v272 = Object.assign(v270, v271);
    var options = {};
    options.method = v267;
    options.headers = v272;
    options.compress = false;
    options.redirect = 'manual';
    const v273 = req.method;
    const v274 = v273.toLowerCase();
    const v275 = v274 !== 'get';
    const v276 = req.method;
    const v277 = v276.toLowerCase();
    const v278 = v277 !== 'head';
    const v279 = v275 && v278;
    if (v279) {
        options.body = req;
    }
    const v280 = req.url;
    const v281 = lambdaAddress + v280;
    const proxyRes = await fetch(v281, options);
    const v282 = spinner.isSpinning;
    if (v282) {
        const v283 = endpointData[0];
        const v284 = url.resolve('/', v283);
        const v285 = v284 + ' ready';
        const v286 = spinner.succeed(v285);
        v286;
    }
    const v287 = proxyRes.status;
    res.statusCode = v287;
    const v288 = proxyRes.headers;
    const headers = v288.raw();
    let key;
    const v289 = Object.keys(headers);
    for (key of v289) {
        const v290 = key.toLowerCase();
        const v291 = v290 === 'location';
        const v292 = headers[key];
        const v293 = v291 && v292;
        if (v293) {
            const v294 = headers[key];
            const v295 = v294[0];
            const v296 = v295.replace(lambdaAddress, serverAddress);
            headers[key] = v296;
        }
        const v297 = headers[key];
        const v298 = res.setHeader(key, v297);
        v298;
    }
    const v299 = res.setHeader('x-powered-by', 'ZeroServer');
    v299;
    const v300 = proxyRes.body;
    const v301 = v300.pipe(res);
    v301;
    const v302 = proxyRes.body;
    const v308 = err => {
        const v303 = `Error on proxying url: ${ newUrl }`;
        const v304 = console.error(v303);
        v304;
        const v305 = err.stack;
        const v306 = console.error(v305);
        v306;
        const v307 = res.end();
        v307;
    };
    const v309 = v302.on('error', v308);
    v309;
    const v312 = () => {
        const v310 = proxyRes.body;
        const v311 = v310.destroy();
        v311;
    };
    const v313 = req.on('abort', v312);
    v313;
};
const v317 = () => {
    let id;
    for (id in lambdaIdToPortMap) {
        const v314 = lambdaIdToPortMap[id];
        const v315 = v314.process;
        const v316 = v315.kill();
        v316;
    }
};
const v318 = process.on('exit', v317);
v318;
const getBundleInfo = function (endpointData) {
    const v339 = async (resolve, reject) => {
        const entryFilePath = endpointData[1];
        const v319 = endpointData[0];
        const lambdaID = getLambdaID(v319);
        const v320 = lambdaIdToBundleInfo[lambdaID];
        if (v320) {
            const v321 = lambdaIdToBundleInfo[lambdaID];
            const v322 = resolve(v321);
            return v322;
        }
        const v323 = !bundlerProgram;
        if (v323) {
            const v324 = resolve(false);
            return v324;
        }
        const v325 = endpointData[0];
        const v326 = endpointData[1];
        const v327 = endpointData[2];
        const v328 = 'zero-builds/' + lambdaID;
        const parameters = [
            v325,
            v326,
            v327,
            v328
        ];
        const v329 = [
            0,
            1,
            2,
            'ipc'
        ];
        const options = {};
        options.stdio = v329;
        const child = fork(bundlerProgram, parameters, options);
        const v333 = message => {
            const v330 = {};
            v330.info = message;
            v330.process = child;
            lambdaIdToBundleInfo[lambdaID] = v330;
            const v331 = lambdaIdToBundleInfo[lambdaID];
            const v332 = resolve(v331);
            return v332;
        };
        const v334 = child.on('message', v333);
        v334;
        const v337 = () => {
            const v335 = lambdaIdToBundleInfo[lambdaID];
            const v336 = delete v335;
            v336;
        };
        const v338 = child.on('close', v337);
        v338;
    };
    const v340 = new Promise(v339);
    return v340;
};
const getLambdaServerPort = function (endpointData) {
    const v397 = (resolve, reject) => {
        const entryFilePath = endpointData[1];
        const v341 = endpointData[0];
        const lambdaID = getLambdaID(v341);
        const v342 = lambdaIdToPortMap[lambdaID];
        if (v342) {
            const v343 = lambdaIdToPortMap[lambdaID];
            const v344 = v343.port;
            const v345 = resolve(v344);
            return v345;
        }
        const v346 = endpointData[2];
        const v347 = handlers[v346];
        const program = v347.process;
        const v348 = endpointData[0];
        const v349 = endpointData[1];
        const v350 = endpointData[2];
        const v351 = process.env;
        const v352 = v351.SERVERADDRESS;
        const v353 = 'zero-builds/' + lambdaID;
        const v354 = lambdaIdToBundleInfo[lambdaID];
        const v355 = lambdaIdToBundleInfo[lambdaID];
        const v356 = v355.info;
        let v357;
        if (v354) {
            v357 = v356;
        } else {
            v357 = '';
        }
        const parameters = [
            v348,
            v349,
            v350,
            v352,
            v353,
            v357
        ];
        const v358 = [
            'pipe',
            'pipe',
            'pipe',
            'ipc'
        ];
        const options = {};
        options.stdio = v358;
        const child = fork(program, parameters, options);
        const v359 = child.stdout;
        const v362 = data => {
            const v360 = `${ data }`;
            const v361 = console.log(v360);
            v361;
        };
        const v363 = v359.on('data', v362);
        v363;
        const v364 = child.stderr;
        const v367 = data => {
            const v365 = `${ data }`;
            const v366 = console.error(v365);
            v366;
        };
        const v368 = v364.on('data', v367);
        v368;
        const v375 = message => {
            const v369 = debug('got Port for', entryFilePath, message);
            v369;
            const v370 = parseInt(message);
            const v371 = {};
            v371.port = v370;
            v371.process = child;
            v371.endpointData = endpointData;
            lambdaIdToPortMap[lambdaID] = v371;
            const v372 = lambdaIdToPortMap[lambdaID];
            const v373 = v372.port;
            const v374 = resolve(v373);
            v374;
        };
        const v376 = child.on('message', v375);
        v376;
        const v385 = err => {
            const v377 = debug('Failed to start subprocess.', err);
            v377;
            const v378 = process.env;
            const v379 = v378.BUILDPATH;
            const v380 = path.join(v379, 'zero-builds', lambdaID, '/**');
            const v381 = { force: true };
            const v382 = del(v380, v381);
            v382;
            const v383 = lambdaIdToPortMap[lambdaID];
            const v384 = delete v383;
            v384;
        };
        const v386 = child.on('error', v385);
        v386;
        const v395 = e => {
            const v387 = debug('subprocess stopped.', e);
            v387;
            const v388 = process.env;
            const v389 = v388.BUILDPATH;
            const v390 = path.join(v389, 'zero-builds', lambdaID, '/**');
            const v391 = { force: true };
            const v392 = del(v390, v391);
            v392;
            const v393 = lambdaIdToPortMap[lambdaID];
            const v394 = delete v393;
            v394;
        };
        const v396 = child.on('close', v395);
        v396;
    };
    const v398 = new Promise(v397);
    return v398;
};
const v457 = buildPath => {
    const app = express();
    const v399 = { threshold: 1 };
    const v400 = compression(v399);
    const v401 = app.use(v400);
    v401;
    const v402 = [];
    const v403 = {};
    var manifest = {};
    manifest.lambdas = v402;
    manifest.fileToLambdas = v403;
    var forbiddenStaticFiles = [];
    const v409 = (request, response) => {
        const v404 = request.url;
        var endpointData = matchPath(manifest, forbiddenStaticFiles, buildPath, v404);
        const v405 = request.url;
        const v406 = debug('match', v405, endpointData);
        v406;
        if (endpointData) {
            const v407 = proxyLambdaRequest(request, response, endpointData);
            return v407;
        }
        const v408 = staticHandler(request, response);
        return v408;
    };
    const v410 = app.all('*', v409);
    v410;
    const v411 = process.env;
    const v412 = v411.PORT;
    const v416 = () => {
        const v413 = listener.address();
        const v414 = v413.port;
        const v415 = debug('Running on port', v414);
        v415;
    };
    var listener = app.listen(v412, v416);
    const v456 = (newManifest, newForbiddenFiles, filesUpdated) => {
        const v417 = debug('updating manifest in server');
        v417;
        manifest = newManifest;
        forbiddenStaticFiles = newForbiddenFiles;
        const v418 = !updatedManifest;
        if (v418) {
            updatedManifest = true;
            try {
                const v419 = path.join(buildPath, '/zero-builds/build-info.json');
                var file = fs.readFileSync(v419, 'utf8');
                lambdaIdToBundleInfo = JSON.parse(file);
                const v420 = Object.keys(lambdaIdToBundleInfo);
                const v421 = v420.length;
                const v422 = console.log('loading build info with ', v421, 'keys');
                v422;
            } catch (e) {
            }
        }
        if (filesUpdated) {
            const v450 = async file => {
                const v423 = manifest.fileToLambdas;
                var lambdaEntryFile = v423[file];
                const v424 = !lambdaEntryFile;
                if (v424) {
                    return;
                }
                var lambdaID = getLambdaID(lambdaEntryFile);
                const v425 = lambdaIdToPortMap[lambdaID];
                const v426 = lambdaIdToPortMap[lambdaID];
                const v427 = v426.endpointData;
                const v428 = shouldKillOnChange(v427);
                const v429 = v425 && v428;
                if (v429) {
                    const v430 = lambdaIdToPortMap[lambdaID];
                    const v431 = v430.port;
                    const v432 = debug('killing', lambdaEntryFile, v431);
                    v432;
                    const v433 = lambdaIdToPortMap[lambdaID];
                    const v434 = v433.process;
                    const v435 = v434.kill();
                    v435;
                    const v436 = process.env;
                    const v437 = v436.BUILDPATH;
                    const v438 = path.join(v437, 'zero-builds', lambdaID, '/**');
                    const v439 = { force: true };
                    await del(v438, v439);
                    const v440 = newManifest.lambdas;
                    const v443 = lambda => {
                        const v441 = lambda[1];
                        const v442 = v441 === lambdaEntryFile;
                        return v442;
                    };
                    var endpointData = v440.find(v443);
                    const v444 = lambdaIdToBundleInfo[lambdaID];
                    const v445 = delete v444;
                    v445;
                    await getBundleInfo(endpointData);
                    const v446 = lambdaIdToPortMap[lambdaID];
                    const v447 = delete v446;
                    v447;
                    const v448 = debug('starting', endpointData);
                    v448;
                    if (endpointData) {
                        const v449 = getLambdaServerPort(endpointData);
                        v449;
                    }
                }
            };
            const v451 = filesUpdated.forEach(v450);
            v451;
        } else {
            let file;
            for (file in lambdaIdToPortMap) {
                const v452 = getLambdaID(file);
                const v453 = lambdaIdToPortMap[v452];
                const v454 = v453.process;
                const v455 = v454.kill();
                v455;
            }
        }
    };
    return v456;
};
module.exports = v457;
const shouldKillOnChange = function (endpointData) {
    let config;
    const v458 = endpointData[2];
    const v459 = handlers[v458];
    const v460 = endpointData[2];
    const v461 = handlers[v460];
    const v462 = v461.config;
    if (v459) {
        config = v462;
    } else {
        config = false;
    }
    if (config) {
        const v463 = config.restartOnFileChange;
        const v464 = v463 === false;
        if (v464) {
            return false;
        }
    }
    return true;
};