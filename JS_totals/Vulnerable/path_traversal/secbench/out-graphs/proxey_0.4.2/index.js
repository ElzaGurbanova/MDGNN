'use strict';
var http = require('http');
var fs = require('fs');
var url = require('url');
var mimetype = require('./mimetype.js');
const Proxey = function () {
    this.proxyUrl = '/proxy';
    this.rootFolder = null;
    this.rootDocument = 'index.html';
    this.port = 5000;
    this.instance = null;
    const v174 = {};
    this.vars = v174;
    const v175 = {};
    this.routes = v175;
    this.debug = true;
    this.charset = 'utf-8';
    this.proxy = null;
};
const v176 = Proxey.prototype;
const v179 = function (path) {
    const v177 = this.routes;
    const v178 = v177[path];
    return v178;
};
v176.getRoute = v179;
const v180 = Proxey.prototype;
const v206 = function (config) {
    const v181 = config === undefined;
    if (v181) {
        return;
    }
    const v182 = config.debug;
    const v183 = v182 !== undefined;
    if (v183) {
        const v184 = config.debug;
        this.debug = v184;
    }
    const v185 = config.port;
    if (v185) {
        const v186 = config.port;
        this.port = v186;
    }
    const v187 = config.proxyUrl;
    if (v187) {
        const v188 = config.proxyUrl;
        this.proxyUrl = v188;
    }
    const v189 = config.proxy;
    if (v189) {
        const v190 = config.proxy;
        this.proxy = v190;
    }
    const v191 = config.rootFolder;
    if (v191) {
        const v192 = config.rootFolder;
        this.rootFolder = v192;
    }
    const v193 = config.rootDocument;
    if (v193) {
        const v194 = config.rootDocument;
        this.rootDocument = v194;
    }
    const v195 = config.vars;
    if (v195) {
        const v196 = config.vars;
        this.vars = v196;
    }
    const v197 = config.routes;
    if (v197) {
        const v198 = config.routes;
        this.routes = v198;
        const v199 = this.routes;
        const v200 = v199['/'];
        const v201 = !v200;
        if (v201) {
            const v202 = this.routes;
            const v203 = this.rootDocument;
            v202['/'] = v203;
        }
    }
    const v204 = config.charset;
    if (v204) {
        const v205 = config.charset;
        this.charset = v205;
    }
};
v180.setConfig = v206;
const v207 = Proxey.prototype;
const v280 = function (req, res, config) {
    var joinSplitedUrl = function (arr) {
        var i = 1;
        const v208 = arr.length;
        let v209 = i < v208;
        while (v209) {
            proxyUrl += arr[i];
            const v210 = i++;
            v209 = i < v208;
        }
    };
    var splitedUrl;
    var proxyUrl = '';
    if (config) {
        const v211 = req.url;
        const v212 = config.key;
        splitedUrl = v211.split(v212);
        proxyUrl = config.value;
        const v213 = joinSplitedUrl(splitedUrl);
        v213;
    } else {
        const v214 = req.url;
        const v215 = this.proxyUrl;
        const v216 = v215 + '?url=';
        splitedUrl = v214.split(v216);
        const v217 = joinSplitedUrl(splitedUrl);
        v217;
        const v218 = splitedUrl.length;
        const v219 = v218 < 2;
        if (v219) {
            const v220 = res.writeHead(400);
            v220;
            const v221 = req.url;
            const v222 = 'GET: ' + v221;
            const v223 = v222 + 'INVALID PROXY URL(400)';
            const v224 = res.end(v223);
            v224;
            return;
        }
    }
    const v225 = decodeURIComponent(proxyUrl);
    var parsedUrl = url.parse(v225);
    var dataString = '';
    const v226 = parsedUrl.host;
    const v227 = req.port;
    const v228 = req.port;
    let v229;
    if (v227) {
        v229 = v228;
    } else {
        v229 = 80;
    }
    const v230 = parsedUrl.path;
    const v231 = req.method;
    const v232 = req.headers;
    var options = {};
    options.hostname = v226;
    options.port = v229;
    options.path = v230;
    options.method = v231;
    options.headers = v232;
    const v233 = options.headers;
    const v234 = v233['host'];
    const v235 = delete v234;
    v235;
    let _var;
    const v236 = this.vars;
    for (_var in v236) {
        var key = _var;
        const v237 = this.vars;
        var value = v237[_var];
        const v238 = typeof value;
        const v239 = v238 == 'string';
        if (v239) {
            const v240 = options.headers;
            v240[key] = value;
        } else {
            const v241 = typeof value;
            const v242 = v241 == 'object';
            if (v242) {
                const v243 = options.headers;
                const v244 = v243[key];
                const v245 = v244 !== undefined;
                const v246 = options.headers;
                const v247 = v246[key];
                const v248 = v247.replace(/\_/gim, '');
                const v249 = v248 == key;
                const v250 = v245 && v249;
                if (v250) {
                    const v251 = value.real;
                    var real = v251 || key;
                    const v252 = options.headers;
                    const v253 = value.value;
                    v252[real] = v253;
                    const v254 = value.real;
                    if (v254) {
                        const v255 = options.headers;
                        const v256 = v255[key];
                        const v257 = delete v256;
                        v257;
                    }
                }
            }
        }
    }
    const v267 = function (response) {
        const v258 = response.setEncoding('utf8');
        v258;
        const v259 = function (chunk) {
            dataString += chunk;
        };
        const v260 = response.on('data', v259);
        v260;
        const v265 = function () {
            const v261 = response.statusCode;
            const v262 = response.headers;
            const v263 = res.writeHead(v261, v262);
            v263;
            const v264 = res.end(dataString);
            v264;
        };
        const v266 = response.on('end', v265);
        v266;
    };
    var proxy = http.request(options, v267);
    const v268 = req.method;
    const v269 = v268 == 'PUT';
    const v270 = req.method;
    const v271 = v270 == 'POST';
    const v272 = v269 || v271;
    if (v272) {
        var requestData = '';
        const v273 = function (chunk) {
            requestData += chunk;
        };
        const v274 = req.on('data', v273);
        v274;
        const v277 = function () {
            const v275 = proxy.write(requestData);
            v275;
            const v276 = proxy.end();
            v276;
        };
        const v278 = req.on('end', v277);
        v278;
    }
    const v279 = proxy.end();
    v279;
};
v207.request = v280;
const v281 = Proxey.prototype;
const v343 = function (config) {
    var top = this;
    const v282 = this.setConfig(config);
    v282;
    const v336 = function (req, res) {
        var isProxyUrl = function (url) {
            const v283 = top.proxy;
            const v284 = !v283;
            if (v284) {
                return false;
            }
            let item;
            const v285 = top.proxy;
            for (item in v285) {
                const v286 = req.url;
                const v287 = v286.indexOf(item);
                const v288 = v287 === 0;
                if (v288) {
                    return true;
                }
            }
            return false;
        };
        const v289 = top.proxyUrl;
        var proxyUrlPattern = '^' + v289;
        const v290 = req.url;
        var template = top.getRoute(v290);
        if (template) {
            const v291 = top.rootFolder;
            const v292 = v291 + '/';
            const v293 = v292 + template;
            var documentFile = fs.readFileSync(v293);
            var documentFileMimetype = template.match(/\.[0-9a-z]+$/i);
            var mime;
            const v294 = !documentFileMimetype;
            if (v294) {
                mime = 'text/html';
            } else {
                const v295 = documentFileMimetype[0];
                const v296 = v295.replace('.', '');
                mime = mimetype.get(v296);
            }
            const v297 = mime === undefined;
            if (v297) {
                mime = 'text/html';
            }
            const v298 = top.charset;
            mime += ';charset=' + v298;
            const v299 = { 'Content-Type': mime };
            const v300 = res.writeHead(200, v299);
            v300;
            const v301 = res.end(documentFile);
            v301;
        } else {
            const v302 = req.url;
            const v303 = new RegExp(proxyUrlPattern, 'g');
            const v304 = v302.match(v303);
            if (v304) {
                const v305 = top.request(req, res);
                v305;
            } else {
                const v306 = req.url;
                const v307 = isProxyUrl(v306);
                if (v307) {
                    let item;
                    const v308 = top.proxy;
                    for (item in v308) {
                        const v309 = req.url;
                        const v310 = v309.indexOf(item);
                        const v311 = v310 === 0;
                        if (v311) {
                            const v312 = top.proxy;
                            const v313 = v312[item];
                            const v314 = {
                                key: item,
                                value: v313
                            };
                            const v315 = top.request(req, res, v314);
                            v315;
                        }
                    }
                } else {
                    try {
                        var resource = req.url;
                        const v316 = resource.indexOf('?');
                        const v317 = -1;
                        const v318 = v316 != v317;
                        if (v318) {
                            const v319 = resource.split('?');
                            resource = v319[0];
                        }
                        const v320 = resource.indexOf('#');
                        const v321 = -1;
                        const v322 = v320 != v321;
                        if (v322) {
                            const v323 = resource.split('#');
                            resource = v323[0];
                        }
                        var resourceFileMimetype = resource.match(/\.[0-9a-z]+$/i);
                        const v324 = resourceFileMimetype[0];
                        resourceFileMimetype = v324.replace('.', '');
                        var mime = mimetype.get(resourceFileMimetype);
                        const v325 = top.rootFolder;
                        const v326 = v325 + resource;
                        var resourceFile = fs.readFileSync(v326);
                        const v327 = { 'Content-Type': mime };
                        const v328 = res.writeHead(200, v327);
                        v328;
                        const v329 = res.end(resourceFile);
                        v329;
                    } catch (e) {
                        const v330 = console.log(e);
                        v330;
                        const v331 = res.writeHead(404);
                        v331;
                        const v332 = req.url;
                        const v333 = 'GET: ' + v332;
                        const v334 = v333 + 'NOT FOUND(404)';
                        const v335 = res.end(v334);
                        v335;
                    }
                }
            }
        }
    };
    const v337 = http.createServer(v336);
    const v338 = this.port;
    const v339 = v337.listen(v338);
    this.instance = v339;
    const v340 = this.port;
    const v341 = 'Running in port: ' + v340;
    const v342 = console.log(v341);
    v342;
};
v281.run = v343;
const v344 = Proxey.prototype;
const v346 = function () {
    const v345 = proxy.stop();
    v345;
};
v344.stop = v346;
var proxey = new Proxey();
module.exports = proxey;