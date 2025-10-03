const v194 = function () {
    'use strict';
    var path = require('path');
    var config;
    var cwd = process.cwd();
    const v170 = {};
    v170.success = 'alert alert-success';
    v170.alert = 'alert';
    v170.error = 'alert alert-error';
    v170.info = 'alert alert-info';
    const v171 = {};
    v171.success = 'alert alert-block alert-success';
    v171.alert = 'alert alert-block';
    v171.error = 'alert alert-block alert-error';
    v171.info = 'alert alert-block alert-info';
    const v172 = {};
    v172.defaultClass = 'alert';
    v172.inlineClasses = v170;
    v172.blockClasses = v171;
    const v173 = [];
    const v174 = {};
    v174.files = v173;
    v174.includePattern = '';
    v174.excludePattern = '';
    const v175 = 2 * 60;
    const v176 = v175 * 60;
    const v177 = v176 * 1000;
    const v178 = 5 * 60;
    const v179 = v178 * 1000;
    const v180 = cwd + '/log';
    const v181 = path.normalize(v180);
    const v182 = cwd + '/public';
    const v183 = path.normalize(v182);
    const v184 = {};
    v184.default = 0;
    const v185 = {};
    v185.expires = v184;
    const v186 = 14 * 24;
    const v187 = v186 * 60;
    const v188 = v187 * 60;
    const v189 = {};
    v189.store = 'cookie';
    v189.key = 'sid';
    v189.expiry = v188;
    v189.port = 4001;
    v189.createServer = true;
    const v190 = cwd + '/config/locales';
    const v191 = path.normalize(v190);
    const v192 = [v191];
    const v193 = {};
    v193.defaultLocale = 'en-us';
    v193.loadPaths = v192;
    config.environment = 'development';
    config.workers = 2;
    config.port = 4000;
    config.spdy = null;
    config.ssl = null;
    config.detailedErrors = true;
    config.requestTimeout = null;
    config.flash = v172;
    config.debug = false;
    config.watch = v174;
    config.rotateWorkers = true;
    config.rotationWindow = v177;
    config.rotationTimeout = v179;
    config.logDir = v181;
    config.gracefulShutdownTimeout = 30000;
    config.heartbeatInterval = 5000;
    config.heartbeatWindow = 20000;
    config.staticFilePath = v183;
    config.assetHost = '';
    config.assetBasePath = '/';
    config.cacheControl = v185;
    config.sessions = v189;
    config.cookieSessionKey = 'sdata';
    config.i18n = v193;
    config.appName = 'Geddy App';
    config.hostname = null;
    config.fullHostname = null;
    config.connectCompatibility = false;
    config.mailer = null;
    config = {};
    config = {};
    module.exports = config;
};
const v195 = v194();
v195;
const v337 = function () {
    'use strict';
    var domain = require('domain');
    var fs = require('fs');
    var path = require('path');
    var model = require('model');
    var controller = require('../controller');
    var format = require('../response/format');
    var utils = require('../utils');
    var cwd = process.cwd();
    var errors = require('../response/errors');
    var init = require('../init');
    var helpers = require('../template/helpers');
    var actionHelpers = require('../template/helpers/action');
    const v196 = require('../controller/error_controller');
    var ErrorController = v196.ErrorController;
    const v197 = require('../controller/static_file_controller');
    var StaticFileController = v197.StaticFileController;
    var controllerInit = require('../controller/init');
    const v198 = require('../in_flight');
    var InFlight = v198.InFlight;
    var usingCoffee;
    var logging = require('./logging');
    var templateAdapters = require('../template/adapters');
    var requestHelpers = require('./request_helpers');
    const v199 = utils.log;
    const v200 = geddy.log;
    const v201 = v199.registerLogger(v200);
    v201;
    geddy.model = model;
    geddy.controller = controller;
    const v202 = utils.inflection;
    geddy.inflection = v202;
    geddy.utils = utils;
    geddy.errors = errors;
    const v203 = geddy.viewHelpers;
    const v204 = {};
    geddy.viewHelpers = v203 || v204;
    geddy.template = templateAdapters;
    const v205 = format.addFormat;
    const v206 = v205.bind(format);
    geddy.addFormat = v206;
    var App = function () {
        this.config = null;
        this.router = null;
        const v207 = {};
        this.modelRegistry = v207;
        const v208 = {};
        this.templateRegistry = v208;
        const v209 = {};
        this.controllerRegistry = v209;
        const v213 = function (config, callback) {
            var self = this;
            this.config = config;
            const v211 = function () {
                const v210 = self.start(callback);
                v210;
            };
            const v212 = init.init(this, v211);
            v212;
        };
        this.init = v213;
        const v235 = function (controllerInst, reqUrl, method, params, accessTime, reqObj, respObj) {
            var initKeys;
            var initializer;
            var cb;
            initKeys = [
                'cookies',
                'i18n',
                'inFlight',
                'parseBody',
                'session'
            ];
            const v214 = params.controller;
            const v215 = {
                app: this,
                url: reqUrl,
                method: method,
                params: params,
                accessTime: accessTime,
                request: reqObj,
                response: respObj,
                name: v214
            };
            const v216 = utils.mixin(controllerInst, v215);
            v216;
            reqObj.controller = controllerInst;
            respObj.controller = controllerInst;
            const v227 = function () {
                const v217 = controllerInst._handleAction;
                const v218 = params.action;
                const v219 = v217.call(controllerInst, v218);
                v219;
                const v220 = reqObj.req;
                const v221 = reqObj.req;
                const v222 = v221.read;
                const v223 = typeof v222;
                const v224 = v223 != 'function';
                const v225 = v220 && v224;
                if (v225) {
                    const v226 = reqObj.sync();
                    v226;
                }
            };
            cb = v227;
            const v228 = utils.async;
            initializer = new v228.Initializer(initKeys, cb);
            const v233 = function (key) {
                const v229 = controllerInit[key];
                const v231 = function () {
                    const v230 = initializer.complete(key);
                    v230;
                };
                const v232 = v229.call(controllerInst, v231);
                v232;
            };
            const v234 = initKeys.forEach(v233);
            v234;
        };
        this.handleControllerAction = v235;
        const v250 = function (staticPath, params, reqUrl, reqObj, respObj) {
            var controllerInst;
            const v236 = fs.statSync(staticPath);
            const v237 = v236.isDirectory();
            if (v237) {
                staticPath = path.join(staticPath, 'index.html');
                const v238 = utils.file;
                const v239 = v238.existsSync(staticPath);
                const v240 = fs.statSync(staticPath);
                const v241 = v240.isFile();
                const v242 = v239 && v241;
                if (v242) {
                    controllerInst = new StaticFileController(reqObj, respObj, params);
                    const v243 = { path: staticPath };
                    const v244 = controllerInst.respond(v243);
                    v244;
                } else {
                    const v245 = this.handleNotFound(reqUrl, params, reqObj, respObj);
                    v245;
                }
            } else {
                const v246 = fs.statSync(staticPath);
                const v247 = v246.isFile();
                if (v247) {
                    controllerInst = new StaticFileController(reqObj, respObj, params);
                    const v248 = { path: staticPath };
                    const v249 = controllerInst.respond(v248);
                    v249;
                }
            }
        };
        this.handleStaticFile = v250;
        const v260 = function (method, reqUrl, params, reqObj, respObj, nonMethodRoutes) {
            var acceptableMethods = {};
            var err;
            var controllerInst;
            const v252 = function (params) {
                const v251 = params.method;
                acceptableMethods[v251] = true;
            };
            const v253 = nonMethodRoutes.map(v252);
            v253;
            acceptableMethods = Object.keys(acceptableMethods);
            const v254 = method + ' method not allowed. Please consider ';
            const v255 = acceptableMethods.join(', ');
            const v256 = v255.replace(/,\s(\w+)$/, ' or $1');
            const v257 = v254 + v256;
            const v258 = v257 + ' instead.';
            const v259 = new errors.MethodNotAllowedError(v258);
            throw v259;
        };
        this.handleMethodNotAllowed = v260;
        const v263 = function (reqUrl, params, reqObj, respObj) {
            const v261 = reqUrl + ' not found.';
            const v262 = new errors.NotFoundError(v261);
            throw v262;
        };
        this.handleNotFound = v263;
        const v281 = function (method, reqUrl, params, reqObj, respObj) {
            var staticPath;
            var controllerInst;
            var nonMethodRoutes;
            const v264 = this.config;
            const v265 = v264.staticFilePath;
            const v266 = decodeURIComponent(reqUrl);
            const v267 = path.join(v265, v266);
            staticPath = path.resolve(v267);
            const v268 = this.config;
            const v269 = v268.staticFilePath;
            const v270 = staticPath.indexOf(v269);
            const v271 = v270 !== 0;
            if (v271) {
                const v272 = this.handleNotFound(reqUrl, params, reqObj, respObj);
                v272;
                return;
            }
            const v273 = staticPath.split('?');
            staticPath = v273[0];
            const v274 = utils.file;
            const v275 = v274.existsSync(staticPath);
            if (v275) {
                const v276 = this.handleStaticFile(staticPath, params, reqUrl, reqObj, respObj, params);
                v276;
            } else {
                const v277 = this.router;
                nonMethodRoutes = v277.all(reqUrl);
                const v278 = nonMethodRoutes.length;
                if (v278) {
                    const v279 = this.handleMethodNotAllowed(method, reqUrl, params, reqObj, respObj, nonMethodRoutes);
                    v279;
                } else {
                    const v280 = this.handleNotFound(reqUrl, params, reqObj, respObj);
                    v280;
                }
            }
        };
        this.handleNoMatchedRoute = v281;
        const v289 = function (params, reqObj, respObj) {
            const v282 = params.action;
            const v283 = 'No ' + v282;
            const v284 = v283 + ' action on ';
            const v285 = params.controller;
            const v286 = v284 + v285;
            const v287 = v286 + ' controller.';
            const v288 = new errors.InternalServerError(v287);
            throw v288;
        };
        this.handleNoAction = v289;
        const v294 = function (params, reqObj, respObj) {
            const v290 = params.controller;
            const v291 = 'controller ' + v290;
            const v292 = v291 + ' not found.';
            const v293 = new errors.InternalServerError(v292);
            throw v293;
        };
        this.handleNoController = v294;
        const v335 = function (callback) {
            var self = this;
            var ctors = this.controllerRegistry;
            var controllerActionTimers = {};
            const v295 = geddy.server;
            const v332 = function (req, resp) {
                var dmn = domain.create();
                var caught = false;
                var badRequestErr;
                var controllerInst;
                var reqObj;
                var respObj;
                const v302 = function (err) {
                    var serverErr;
                    var controllerInst;
                    if (caught) {
                        const v296 = errors.respond(err, respObj);
                        return v296;
                    }
                    caught = true;
                    const v297 = err.statusCode;
                    if (v297) {
                        serverErr = err;
                    } else {
                        const v298 = err.message;
                        const v299 = err.stack;
                        serverErr = new errors.InternalServerError(v298, v299);
                    }
                    try {
                        controllerInst = new ErrorController(reqObj, respObj);
                        const v300 = controllerInst.respondWith(serverErr);
                        v300;
                    } catch (e) {
                        const v301 = errors.respond(e, respObj);
                        v301;
                    }
                };
                const v303 = dmn.on('error', v302);
                v303;
                const v304 = dmn.add(req);
                v304;
                const v305 = dmn.add(resp);
                v305;
                try {
                    reqObj = requestHelpers.enhanceRequest(req);
                    respObj = requestHelpers.enhanceResponse(resp);
                } catch (err) {
                    req.url = '/';
                    reqObj = requestHelpers.enhanceRequest(req);
                    respObj = requestHelpers.enhanceResponse(resp);
                    const v306 = err.message;
                    const v307 = err.stack;
                    badRequestErr = new errors.BadRequestError(v306, v307);
                    controllerInst = new ErrorController(reqObj, respObj);
                    const v308 = controllerInst.respondWith(badRequestErr);
                    return v308;
                }
                const v309 = dmn.add(reqObj);
                v309;
                const v310 = dmn.add(respObj);
                v310;
                const v330 = function () {
                    var reqUrl;
                    var urlParams;
                    var urlPath;
                    var method;
                    var accessTime;
                    var params;
                    var controllerInst;
                    reqUrl = requestHelpers.normalizeUrl(req);
                    urlParams = requestHelpers.getUrlParams(reqUrl);
                    urlPath = requestHelpers.getBasePath(reqUrl);
                    method = requestHelpers.getMethod(reqUrl, urlParams, req);
                    accessTime = requestHelpers.getAccessTime();
                    const v311 = requestHelpers.initInFlight(reqObj, respObj, method, accessTime);
                    v311;
                    const v312 = logging.initRequestLogger(reqUrl, reqObj, respObj, method, accessTime);
                    v312;
                    const v313 = self.router;
                    params = requestHelpers.getParams(v313, urlPath, method);
                    if (params) {
                        const v314 = params.controller;
                        controllerInst = controller.create(v314);
                        if (controllerInst) {
                            const v315 = geddy.mixin(params, urlParams);
                            v315;
                            const v316 = params.action;
                            const v317 = v316 == 'destroy';
                            const v318 = controllerInst.destroy;
                            const v319 = typeof v318;
                            const v320 = v319 != 'function';
                            const v321 = v317 && v320;
                            if (v321) {
                                params.action = 'remove';
                            }
                            const v322 = params.action;
                            const v323 = controllerInst[v322];
                            const v324 = typeof v323;
                            const v325 = v324 == 'function';
                            if (v325) {
                                const v326 = self.handleControllerAction(controllerInst, reqUrl, method, params, accessTime, reqObj, respObj);
                                v326;
                            } else {
                                const v327 = self.handleNoAction(params, reqObj, respObj);
                                v327;
                            }
                        } else {
                            const v328 = self.handleNoController(params, reqObj, respObj);
                            v328;
                        }
                    } else {
                        const v329 = self.handleNoMatchedRoute(method, reqUrl, params, reqObj, respObj);
                        v329;
                    }
                };
                const v331 = dmn.run(v330);
                v331;
            };
            const v333 = v295.addListener('request', v332);
            v333;
            const v334 = callback();
            v334;
        };
        this.start = v335;
    };
    const v336 = module.exports;
    v336.App = App;
};
const v338 = v337();
v338;