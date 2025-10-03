'use strict';
const Fs = require('fs');
const Url = require('url');
const Zlib = require('zlib');
const Path = require('path');
const Util = require('util');
const Http = require('http');
const Https = require('https');
const Events = require('events');
const Stream = require('stream');
const v242 = require('buffer');
const Buffer = v242.Buffer;
const Querystring = require('querystring');
const Tool = require('./tool');
const Route = require('./route');
const Option = require('./option');
const Utility = require('./utility');
module.exports = class Servey extends Events {
    constructor(options) {
        const v243 = super();
        v243;
        const v244 = {};
        options = options || v244;
        const v245 = options.listener;
        if (v245) {
            const v246 = options.listener;
            const v247 = this.callback;
            const v248 = v247.bind(this);
            const v249 = v246.on('request', v248);
            v249;
        } else {
            const v250 = options.secure;
            if (v250) {
                const v251 = options.secure;
                const v252 = this.callback;
                const v253 = v252.bind(this);
                const v254 = Https.createServer(v251, v253);
                options.listener = v254;
            } else {
                const v255 = this.callback;
                const v256 = v255.bind(this);
                const v257 = Http.createServer(v256);
                options.listener = v257;
            }
        }
        const v258 = Option.call(this, options);
        v258;
        const v259 = options.tools;
        const v260 = Tool.call(this, v259);
        v260;
        const v261 = options.routes;
        const v262 = Route.call(this, v261);
        v262;
    }
    callback(request, response) {
        const self = this;
        const v263 = Promise.resolve();
        const v265 = function () {
            const v264 = self.handler(request, response);
            return v264;
        };
        const v266 = v263.then(v265);
        const v270 = function (error) {
            const v267 = self.emit('error', error);
            v267;
            const v268 = {
                code: 500,
                request: request,
                response: response
            };
            const v269 = self.ender(v268);
            return v269;
        };
        const v271 = v266.catch(v270);
        v271;
    }
    async header(context) {
        const self = this;
        const header = {};
        const v272 = self.contentType;
        header['content-type'] = v272;
        const v273 = self.cache;
        const v274 = typeof v273;
        const v275 = v274 === 'string';
        if (v275) {
            const v276 = self.cache;
            header['cache-control'] = v276;
        } else {
            const v277 = self.cache;
            const v278 = typeof v277;
            const v279 = v278 === 'number';
            if (v279) {
                const v280 = self.cache;
                header['cache-control'] = `max-age=${ v280 }`;
            } else {
                const v281 = self.cache;
                const v282 = typeof v281;
                const v283 = v282 === 'boolean';
                if (v283) {
                    const v284 = self.cache;
                    let v285;
                    if (v284) {
                        v285 = 'max-age=3600';
                    } else {
                        v285 = 'no-cache';
                    }
                    header['cache-control'] = v285;
                }
            }
        }
        const v286 = self.tool;
        const hs = await v286.headerSecurity(context, header);
        const v287 = context.head;
        const v288 = Object.assign(header, hs, v287);
        return v288;
    }
    async router(context) {
        const routes = this.routes;
        const method = context.method;
        const v289 = context.url;
        const path = v289.pathname;
        let route;
        for (route of routes) {
            const v290 = route.path;
            const v291 = v290 === '*';
            const v292 = route.path;
            const v293 = v292 === path;
            const v294 = route.method;
            const v295 = v294.toUpperCase();
            const v296 = v295 === method;
            const v297 = v293 && v296;
            const v298 = v291 || v297;
            if (v298) {
                return route;
            }
        }
        return null;
    }
    async uploader(context) {
        const self = this;
        const v315 = function (resolve, reject) {
            let data = '';
            const v299 = context.request;
            const v300 = v299.on('error', reject);
            v300;
            const v301 = context.request;
            const v308 = function (chunk) {
                const v302 = data.length;
                const v303 = self.maxBytes;
                const v304 = v302 > v303;
                if (v304) {
                    const v305 = context.request;
                    const v306 = v305.connection;
                    const v307 = v306.destroy();
                    v307;
                } else {
                    data += chunk;
                }
            };
            const v309 = v301.on('data', v308);
            v309;
            const v310 = context.request;
            const v313 = function () {
                const v311 = data.toString();
                const v312 = resolve(v311);
                v312;
            };
            const v314 = v310.on('end', v313);
            v314;
        };
        const v316 = new Promise(v315);
        return v316;
    }
    async streamer(context) {
        const v325 = function (resolve, reject) {
            const gzip = Zlib.createGzip();
            const v317 = context.body;
            const v318 = v317.on('end', resolve);
            v318;
            const v319 = context.body;
            const v320 = v319.on('error', reject);
            v320;
            const v321 = context.body;
            const v322 = v321.pipe(gzip);
            const v323 = context.response;
            const v324 = v322.pipe(v323);
            v324;
        };
        const v326 = new Promise(v325);
        return v326;
    }
    async ender(context) {
        const self = this;
        context.head = await self.header(context);
        const v327 = context.code;
        const v328 = !v327;
        if (v328) {
            context.code = 200;
        }
        const v329 = context.body;
        const v330 = !v329;
        if (v330) {
            const v331 = context.code;
            const v332 = context.message;
            const v333 = self.messages;
            const v334 = context.code;
            const v335 = v333[v334];
            const v336 = v332 || v335;
            const v337 = {};
            v337.code = v331;
            v337.message = v336;
            context.body = v337;
        }
        const v338 = context.body;
        const v339 = Stream.Readable;
        const v340 = v338 instanceof v339;
        if (v340) {
            const v341 = context.body;
            const v342 = v341.path;
            const mime = await Utility.getMime(v342);
            const v343 = context.head;
            v343['content-encoding'] = `gzip`;
            const v344 = context.head;
            v344['content-type'] = `${ mime }; charset=utf8`;
            const v345 = context.response;
            const v346 = context.code;
            const v347 = context.head;
            const v348 = v345.writeHead(v346, v347);
            v348;
            return await self.streamer(context);
        }
        const v349 = context.body;
        const v350 = typeof v349;
        const v351 = v350 === 'object';
        if (v351) {
            const mime = await Utility.getMime('json');
            const v352 = context.head;
            v352['content-type'] = `${ mime }; charset=utf8`;
            const v353 = context.body;
            const v354 = JSON.stringify(v353);
            context.body = v354;
        }
        const v356 = context.body;
        const v357 = Buffer.byteLength(v356);
        v355['content-length'] = v357;
        const v358 = context.response;
        const v359 = context.code;
        const v360 = context.head;
        const v361 = v358.writeHead(v359, v360);
        v361;
        const v362 = context.response;
        const v363 = context.body;
        const v364 = v362.end(v363);
        v364;
    }
    async handler(request, response) {
        const self = this;
        const v365 = request.url;
        const url = Url.parse(v365);
        const v366 = url.query;
        const query = Querystring.parse(v366);
        const v367 = self.emit('request', request);
        v367;
        const v368 = {};
        const v369 = self.tool;
        const v370 = request.method;
        let context = {};
        context.url = url;
        context.query = query;
        context.request = request;
        context.response = response;
        context.head = v368;
        context.body = null;
        context.code = null;
        context.instance = self;
        context.tool = v369;
        context.credential = null;
        context.method = v370;
        const route = await self.router(context);
        let routeOptions;
        const v371 = route.options;
        const v372 = route && v371;
        const v373 = route.options;
        const v374 = {};
        if (v372) {
            routeOptions = v373;
        } else {
            routeOptions = v374;
        }
        const v375 = self.auth;
        const v376 = self.cors;
        const v377 = self.cache;
        const serverOptions = {};
        serverOptions.auth = v375;
        serverOptions.cors = v376;
        serverOptions.cache = v377;
        const v378 = {};
        const options = Object.assign(v378, serverOptions, routeOptions);
        const v379 = options.vhost;
        if (v379) {
            const v380 = [];
            const v381 = options.vhost;
            let vhosts = v380.concat(v381);
            const v382 = request.headers;
            let hostname = v382.host;
            const v383 = vhosts.includes(hostname);
            const v384 = !v383;
            if (v384) {
                context.code = 404;
                return await self.ender(context);
            }
        }
        const v385 = context.url;
        const v386 = v385.pathname;
        const v387 = v386 !== '/';
        const v388 = context.url;
        const v389 = v388.pathname;
        const v390 = -1;
        const v391 = v389.slice(v390);
        const v392 = v391 === '/';
        const v393 = v387 && v392;
        if (v393) {
            const v394 = context.url;
            const v395 = v394.pathname;
            const v396 = v395.replace(/\/+/, '/');
            const v397 = -1;
            const v398 = v396.slice(0, v397);
            const pathname = v398 || '/';
            const v399 = context.url;
            const v400 = v399.search;
            const v401 = v400 || '';
            const v402 = context.url;
            const v403 = v402.hash;
            const v404 = v403 || '';
            const location = `${ pathname }${ v401 }${ v404 }`;
            const v405 = self.tool;
            const result = await v405.redirect(context, location);
            const v406 = Object.assign(context, result);
            v406;
            return await self.ender(context);
        }
        const v407 = !route;
        if (v407) {
            context.code = 404;
            return await self.ender(context);
        }
        const v408 = route.handler;
        const v409 = !v408;
        if (v409) {
            const v410 = new Error('route handler required');
            throw v410;
        }
        const v411 = route.handler;
        const v412 = typeof v411;
        const v413 = v412 !== 'function';
        if (v413) {
            const v414 = new Error('route handler requires a string or function');
            throw v414;
        }
        const v415 = route.options;
        const v416 = route.options;
        const v417 = v416.auth;
        const v418 = v415 && v417;
        const v419 = self.auth;
        const v420 = route.options;
        const v421 = !v420;
        const v422 = v419 && v421;
        const v423 = route.options;
        const v424 = v423.auth;
        const v425 = v424 !== false;
        const v426 = v422 || v425;
        const v427 = v418 || v426;
        if (v427) {
            let auth;
            const v428 = route.options;
            const v429 = route.options;
            const v430 = v429.auth;
            const v431 = typeof v430;
            const v432 = v431 === 'object';
            const v433 = v428 && v432;
            const v434 = route.options;
            const v435 = v434.auth;
            const v436 = self.auth;
            if (v433) {
                auth = v435;
            } else {
                auth = v436;
            }
            const v437 = !auth;
            const v438 = typeof auth;
            const v439 = v438 !== 'object';
            const v440 = v437 || v439;
            if (v440) {
                const v441 = new Error('auth object required');
                throw v441;
            }
            const v442 = auth.strategy;
            const v443 = !v442;
            if (v443) {
                const v444 = new Error('auth strategy required');
                throw v444;
            }
            const v445 = auth.validate;
            const v446 = !v445;
            if (v446) {
                const v447 = new Error('auth validate required');
                throw v447;
            }
            const v448 = auth.strategy;
            const v449 = self.tool;
            const v450 = v448 in v449;
            const v451 = !v450;
            if (v451) {
                const v452 = new Error('auth tool required');
                throw v452;
            }
            const v453 = auth.type;
            if (v453) {
                const v454 = context.head;
                const v455 = auth.type;
                v454['WWW-Authenticate'] = `${ v455 } realm="Secure"`;
            }
            const v456 = self.tool;
            const result = await v456.auth(context, auth);
            const v457 = result.code;
            const v458 = v457 !== 200;
            if (v458) {
                const v459 = Object.assign(context, result);
                v459;
                return await self.ender(context);
            }
            const v460 = result.credential;
            const v461 = {};
            context.credential = v460 || v461;
        }
        const result = await route.handler(context);
        const v462 = Object.assign(context, result);
        v462;
        await self.ender(context);
    }
    async open() {
        const self = this;
        const v474 = function (resolve) {
            const v463 = self.port;
            const v464 = self.hostname;
            const options = {};
            options.port = v463;
            options.host = v464;
            const v465 = self.listener;
            const v472 = function () {
                const v466 = self.information;
                const v467 = self.listener;
                const v468 = v467.address();
                const v469 = Object.assign(v466, v468);
                v469;
                const v470 = resolve();
                v470;
                const v471 = self.emit('open');
                v471;
            };
            const v473 = v465.listen(options, v472);
            v473;
        };
        const v475 = new Promise(v474);
        return v475;
    }
    async close() {
        const self = this;
        const v481 = function (resolve) {
            const v476 = self.listener;
            const v479 = function () {
                const v477 = resolve();
                v477;
                const v478 = self.emit('close');
                v478;
            };
            const v480 = v476.close(v479);
            v480;
        };
        const v482 = new Promise(v481);
        return v482;
    }
};