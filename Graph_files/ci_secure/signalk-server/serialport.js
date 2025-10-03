const v311 = require('stream');
const Transform = v311.Transform;
const child_process = require('child_process');
const v312 = require('serialport');
const SerialPort = v312.SerialPort;
const v313 = require('@serialport/parser-readline');
const ReadlineParser = v313.ReadlineParser;
const v314 = require('lodash');
const isArray = v314.isArray;
const v315 = require('lodash');
const isBuffer = v315.isBuffer;
const splitArgs = function (str) {
    const v316 = !str;
    if (v316) {
        const v317 = [];
        return v317;
    }
    const out = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let m;
    while (m = re.exec(str)) {
        const v318 = m[1];
        const v319 = m[2];
        const v320 = v318 || v319;
        const v321 = m[3];
        const v322 = v320 || v321;
        const v323 = out.push(v322);
        v323;
    }
    return out;
};
const SerialStream = function (options) {
    const v324 = this instanceof SerialStream;
    const v325 = !v324;
    if (v325) {
        const v326 = new SerialStream(options);
        return v326;
    }
    const v327 = Transform.call(this, options);
    v327;
    const v328 = options.reconnect;
    this.reconnect = v328 || true;
    this.reconnectDelay = 1000;
    this.serial = null;
    this.options = options;
    const v329 = options.maxPendingWrites;
    this.maxPendingWrites = v329 || 5;
    const v330 = this.start();
    v330;
    this.isFirstError = true;
    const v331 = options.createDebug;
    const v332 = require('debug');
    const createDebug = v331 || v332;
    const v333 = createDebug('signalk:streams:serialport');
    this.debug = v333;
};
const v334 = require('util');
const v335 = v334.inherits(SerialStream, Transform);
v335;
const v336 = SerialStream.prototype;
const v438 = function () {
    const that = this;
    const v337 = this.serial;
    const v338 = v337 !== null;
    if (v338) {
        const v339 = this.serial;
        const v340 = v339.unpipe(this);
        v340;
        const v341 = this.serial;
        const v342 = v341.removeAllListeners();
        v342;
        this.serial = null;
    }
    const v343 = this.reconnect;
    const v344 = v343 === false;
    if (v344) {
        return;
    }
    const v345 = process.env;
    const v346 = v345.PRESERIALCOMMAND;
    if (v346) {
        const v347 = process.env;
        const v348 = v347.PRESERIALCOMMAND;
        const parts = splitArgs(v348);
        const v349 = parts.length;
        const v350 = v349 > 0;
        if (v350) {
            const cmd = parts[0];
            const v351 = parts.slice(1);
            const v352 = this.options;
            const v353 = v352.device;
            const v354 = String(v353);
            const v355 = [v354];
            const args = v351.concat(v355);
            const v356 = { stdio: 'ignore' };
            const v357 = child_process.execFileSync(cmd, args, v356);
            v357;
        }
    }
    const v358 = this.options;
    const v359 = v358.device;
    const v360 = this.options;
    const v361 = v360.baudrate;
    const v362 = {
        path: v359,
        baudRate: v361
    };
    this.serial = new SerialPort(v362);
    const v363 = this.serial;
    const v375 = function () {
        this.reconnectDelay = 1000;
        const v364 = this.options;
        const v365 = v364.app;
        const v366 = this.options;
        const v367 = v366.providerId;
        const v368 = this.options;
        const v369 = v368.device;
        const v370 = `Connected to ${ v369 }`;
        const v371 = v365.setProviderStatus(v367, v370);
        v371;
        this.isFirstError = true;
        const parser = new ReadlineParser();
        const v372 = this.serial;
        const v373 = v372.pipe(parser);
        const v374 = v373.pipe(this);
        v374;
    };
    const v376 = v375.bind(this);
    const v377 = v363.on('open', v376);
    v377;
    const v378 = this.serial;
    const v391 = function (x) {
        const v379 = this.options;
        const v380 = v379.app;
        const v381 = this.options;
        const v382 = v381.providerId;
        const v383 = x.message;
        const v384 = v380.setProviderError(v382, v383);
        v384;
        const v385 = this.isFirstError;
        if (v385) {
            const v386 = x.message;
            const v387 = console.log(v386);
            v387;
        }
        const v388 = x.message;
        const v389 = this.debug(v388);
        v389;
        this.isFirstError = false;
        const v390 = this.scheduleReconnect();
        v390;
    };
    const v392 = v391.bind(this);
    const v393 = v378.on('error', v392);
    v393;
    const v394 = this.serial;
    const v401 = function () {
        const v395 = this.options;
        const v396 = v395.app;
        const v397 = this.options;
        const v398 = v397.providerId;
        const v399 = v396.setProviderError(v398, 'Closed, reconnecting...');
        v399;
        const v400 = this.scheduleReconnect();
        v400;
    };
    const v402 = v401.bind(this);
    const v403 = v394.on('close', v402);
    v403;
    let pendingWrites = 0;
    const v404 = this.options;
    const stdOutEvent = v404.toStdout;
    if (stdOutEvent) {
        ;
        const v405 = isArray(stdOutEvent);
        const v406 = [stdOutEvent];
        let v407;
        if (v405) {
            v407 = stdOutEvent;
        } else {
            v407 = v406;
        }
        const v436 = event => {
            const onDrain = () => {
                const v408 = pendingWrites--;
                v408;
            };
            const v409 = that.options;
            const v410 = v409.app;
            const v434 = d => {
                const v411 = that.maxPendingWrites;
                const v412 = pendingWrites > v411;
                if (v412) {
                    const v413 = 'Buffer overflow, not writing:' + d;
                    const v414 = that.debug(v413);
                    v414;
                    return;
                }
                const v415 = 'Writing:' + d;
                const v416 = that.debug(v415);
                v416;
                const v417 = isBuffer(d);
                if (v417) {
                    const v418 = that.serial;
                    const v419 = v418.write(d);
                    v419;
                } else {
                    const v420 = that.serial;
                    const v421 = d + '\r\n';
                    const v422 = v420.write(v421);
                    v422;
                }
                const v429 = () => {
                    const v423 = that.options;
                    const v424 = v423.app;
                    const v425 = that.options;
                    const v426 = v425.providerId;
                    const v427 = { providerId: v426 };
                    const v428 = v424.emit('connectionwrite', v427);
                    v428;
                };
                const v430 = setImmediate(v429);
                v430;
                const v431 = pendingWrites++;
                v431;
                const v432 = that.serial;
                const v433 = v432.drain(onDrain);
                v433;
            };
            const v435 = v410.on(event, v434);
            v435;
        };
        const v437 = v407.forEach(v436);
        v437;
    }
};
v336.start = v438;
const v439 = SerialStream.prototype;
const v442 = function () {
    const v440 = this.serial;
    const v441 = v440.close();
    v441;
};
v439.end = v442;
const v443 = SerialStream.prototype;
const v446 = function (chunk, encoding, done) {
    const v444 = this.push(chunk);
    v444;
    const v445 = done();
    v445;
};
v443._transform = v446;
const v447 = SerialStream.prototype;
const v465 = function () {
    const v448 = this.reconnectDelay;
    const v449 = 60 * 1000;
    const v450 = v448 < v449;
    let v451;
    if (v450) {
        v451 = 1.5;
    } else {
        v451 = 1;
    }
    this.reconnectDelay *= v451;
    const v452 = this.reconnectDelay;
    const v453 = v452 / 1000;
    const v454 = v453.toFixed(0);
    const msg = `Not connected (retry delay ${ v454 } s)`;
    const v455 = this.debug(msg);
    v455;
    const v456 = this.options;
    const v457 = v456.app;
    const v458 = this.options;
    const v459 = v458.providerId;
    const v460 = v457.setProviderStatus(v459, msg);
    v460;
    const v461 = this.start;
    const v462 = v461.bind(this);
    const v463 = this.reconnectDelay;
    const v464 = setTimeout(v462, v463);
    v464;
};
v447.scheduleReconnect = v465;
module.exports = SerialStream;