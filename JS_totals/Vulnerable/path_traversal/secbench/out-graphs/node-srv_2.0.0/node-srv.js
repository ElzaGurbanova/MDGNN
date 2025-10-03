const v265 = function () {
    var Server;
    var _;
    var fs;
    var http;
    var mime;
    var minimatch;
    var path;
    var pkg;
    var url;
    pkg = require('../package.json');
    fs = require('fs');
    _ = require('underscore');
    mime = require('mime');
    http = require('http');
    url = require('url');
    path = require('path');
    minimatch = require('minimatch');
    const v264 = function () {
        const v1 = Server.prototype;
        const v2 = pkg.name;
        v1.name = v2;
        const v3 = Server.prototype;
        const v4 = pkg.version;
        v3.version = v4;
        const v5 = Server.prototype;
        const v7 = function () {
            const v6 = {};
            v6.port = 8000;
            v6.host = '0.0.0.0';
            v6.logs = false;
            v6.index = 'index.html';
            return v6;
        };
        v5.defaults = v7;
        const Server = function (options, exitCallback) {
            const v8 = options == null;
            if (v8) {
                options = {};
            }
            this.exitCallback = exitCallback;
            const v9 = this.defaults();
            const v10 = _.extend(v9, options);
            this.options = v10;
            const v11 = this._initLogs();
            v11;
            const v12 = this._bindCloseEvents();
            v12;
            const v13 = this.start();
            v13;
        };
        const v14 = Server.prototype;
        const v24 = function () {
            const v15 = this.request;
            const v16 = _.bind(v15, this);
            const v17 = http.createServer(v16);
            const v18 = this.options;
            const v19 = v18.port;
            const v20 = Number(v19);
            const v21 = this.options;
            const v22 = v21.host;
            const v23 = v17.listen(v20, v22);
            return this.server = v23;
        };
        v14.start = v24;
        const v25 = Server.prototype;
        const v39 = function (callback) {
            var ref;
            var ref1;
            const v26 = (ref = this.server) != null;
            if (v26) {
                const v27 = ref.close();
                v27;
            }
            const v28 = (ref1 = this._loger) != null;
            if (v28) {
                const v29 = ref1.end();
                v29;
            }
            const v30 = this.exitCallback;
            const v31 = typeof v30;
            const v32 = v31 === 'function';
            if (v32) {
                const v33 = this.exitCallback();
                v33;
            }
            const v34 = typeof callback;
            const v35 = v34 === 'function';
            const v36 = callback();
            const v37 = void 0;
            let v38;
            if (v35) {
                v38 = v36;
            } else {
                v38 = v37;
            }
            return v38;
        };
        v25.stop = v39;
        const v40 = Server.prototype;
        const v50 = function () {
            var exit;
            const v47 = function (_this) {
                const v46 = function () {
                    const v41 = process.removeAllListeners('SIGINT');
                    v41;
                    const v42 = process.removeAllListeners('SIGTERM');
                    v42;
                    const v44 = function () {
                        const v43 = process.exit();
                        return v43;
                    };
                    const v45 = _this.stop(v44);
                    return v45;
                };
                return v46;
            };
            exit = v47(this);
            const v48 = process.on('SIGINT', exit);
            v48;
            const v49 = process.on('SIGTERM', exit);
            return v49;
        };
        v40._bindCloseEvents = v50;
        const v51 = Server.prototype;
        const v63 = function () {
            const v52 = this.options;
            const v53 = v52.logs;
            if (v53) {
                const v54 = this.options;
                const v55 = v54.logs;
                const v56 = typeof v55;
                const v57 = v56 === 'string';
                if (v57) {
                    const v58 = this.options;
                    const v59 = v58.logs;
                    const v60 = { flags: 'a' };
                    const v61 = fs.createWriteStream(v59, v60);
                    return this._logger = v61;
                } else {
                    const v62 = console.log;
                    return this._log = v62;
                }
            }
        };
        v51._initLogs = v63;
        const v64 = Server.prototype;
        const v163 = function (req, res) {
            var filePath;
            var time;
            time = new Date();
            filePath = null;
            const v69 = function (_this) {
                const v68 = function (resolve, reject) {
                    var uri;
                    const v65 = req.url;
                    uri = url.parse(v65);
                    const v66 = uri.pathname;
                    const v67 = resolve(v66);
                    return v67;
                };
                return v68;
            };
            const v70 = v69(this);
            const v71 = new Promise(v70);
            const v81 = function (_this) {
                const v80 = function (pathname) {
                    filePath = pathname;
                    const v72 = _this.options;
                    const v73 = v72.index;
                    const v74 = '/' + v73;
                    filePath = filePath.replace(/\/$/, v74);
                    filePath = filePath.replace(/^\//, '');
                    const v75 = process.cwd();
                    const v76 = _this.options;
                    const v77 = v76.root;
                    const v78 = v77 || './';
                    filePath = path.resolve(v75, v78, filePath);
                    const v79 = _this.processRequest(res, filePath);
                    return v79;
                };
                return v80;
            };
            const v82 = v81(this);
            const v93 = function (_this) {
                const v92 = function (err) {
                    const v83 = err.message;
                    const v84 = 'Message: ' + v83;
                    const v85 = v84 + '\nURL: ';
                    const v86 = req.url;
                    const v87 = v85 + v86;
                    const v88 = v87 + '\n\n';
                    const v89 = err.stack;
                    const v90 = v88 + v89;
                    const v91 = _this.errorCode(res, 400, v90);
                    return v91;
                };
                return v92;
            };
            const v94 = v93(this);
            const v95 = v71.then(v82, v94);
            const v119 = function (_this) {
                const v118 = function (err) {
                    const v96 = err.code;
                    const v97 = v96 === 'ENOENT';
                    if (v97) {
                        const v98 = err.path;
                        const v99 = _this.handlerNotFound(res, v98);
                        return v99;
                    } else {
                        const v100 = time.toJSON();
                        const v101 = '[' + v100;
                        const v102 = v101 + '] Error: ';
                        const v103 = err.message;
                        const v104 = v102 + v103;
                        const v105 = v104 + ', Code: ';
                        const v106 = err.code;
                        const v107 = v105 + v106;
                        const v108 = _this.log(v107);
                        v108;
                        const v109 = err.message;
                        const v110 = 'Message: ' + v109;
                        const v111 = v110 + '\nCode: ';
                        const v112 = err.code;
                        const v113 = v111 + v112;
                        const v114 = v113 + '\n\n';
                        const v115 = err.stack;
                        const v116 = v114 + v115;
                        const v117 = _this.errorCode(res, 500, v116);
                        return v117;
                    }
                };
                return v118;
            };
            const v120 = v119(this);
            const v121 = v95['catch'](v120);
            const v138 = function (_this) {
                const v137 = function (err) {
                    const v122 = time.toJSON();
                    const v123 = '[' + v122;
                    const v124 = v123 + '] Error: ';
                    const v125 = err.message;
                    const v126 = v124 + v125;
                    const v127 = _this.log(v126);
                    v127;
                    const v128 = err.message;
                    const v129 = 'Message: ' + v128;
                    const v130 = v129 + '\nCode: ';
                    const v131 = err.code;
                    const v132 = v130 + v131;
                    const v133 = v132 + '\n\n';
                    const v134 = err.stack;
                    const v135 = v133 + v134;
                    const v136 = _this.errorCode(res, 500, v135);
                    return v136;
                };
                return v137;
            };
            const v139 = v138(this);
            const v140 = v121['catch'](v139);
            const v160 = function (_this) {
                const v159 = function (code) {
                    var host;
                    var log;
                    const v141 = req.headers;
                    const v142 = v141.host;
                    const v143 = _this.options;
                    const v144 = v143.port;
                    const v145 = 'localhost:' + v144;
                    const v146 = v142 || v145;
                    const v147 = req.url;
                    host = path.join(v146, v147);
                    const v148 = time.toJSON();
                    const v149 = '[' + v148;
                    log = v149 + ']';
                    const v150 = Date.now();
                    const v151 = v150 - time;
                    const v152 = ' (+' + v151;
                    log += v152 + 'ms):';
                    log += ' ' + code;
                    log += ' ' + host;
                    if (filePath) {
                        log += ' - ' + filePath;
                    }
                    const v153 = req.headers;
                    const v154 = v153['user-agent'];
                    if (v154) {
                        const v155 = req.headers;
                        const v156 = v155['user-agent'];
                        const v157 = ' (' + v156;
                        log += v157 + ')';
                    }
                    const v158 = _this.log(log);
                    return v158;
                };
                return v159;
            };
            const v161 = v160(this);
            const v162 = v140.then(v161);
            return v162;
        };
        v64.request = v163;
        const v164 = Server.prototype;
        const v170 = function (filePath) {
            var headers;
            const v165 = this.name;
            const v166 = v165 + '/';
            const v167 = this.version;
            const v168 = v166 + v167;
            headers['Server'] = v168;
            headers = {};
            headers = {};
            if (filePath) {
                const v169 = mime.lookup(filePath);
                headers['Content-Type'] = v169;
            }
            return headers;
        };
        v164.getHeaders = v170;
        const v171 = Server.prototype;
        const v175 = function (res, filePath) {
            var handler;
            if (handler = this.handle(filePath)) {
                const v172 = this(res, filePath);
                const v173 = handler.call(v172);
                return v173;
            } else {
                const v174 = this.handlerStaticFile(res, filePath);
                return v174;
            }
        };
        v171.processRequest = v175;
        const v176 = Server.prototype;
        const v179 = function (filePath) {
            var handlers;
            var pattern;
            handlers = _.result(this, 'handlers');
            for (pattern in handlers) {
                const v177 = minimatch(filePath, pattern);
                if (v177) {
                    const v178 = handlers[pattern];
                    return v178;
                }
            }
            return null;
        };
        v176.handle = v179;
        const v180 = Server.prototype;
        const v182 = function () {
            const v181 = {};
            return v181;
        };
        v180.handlers = v182;
        const v183 = Server.prototype;
        const v201 = function (res, filePath) {
            var server;
            server = this;
            const v199 = function (resolve, reject) {
                const v184 = fs.createReadStream(filePath);
                const v187 = function () {
                    const v185 = server.getHeaders(filePath);
                    const v186 = res.writeHead(200, v185);
                    return v186;
                };
                const v188 = v184.on('open', v187);
                const v190 = function (err) {
                    const v189 = reject(err);
                    return v189;
                };
                const v191 = v188.on('error', v190);
                const v193 = function (data) {
                    const v192 = res.write(data);
                    return v192;
                };
                const v194 = v191.on('data', v193);
                const v197 = function () {
                    const v195 = res.end();
                    v195;
                    const v196 = resolve(200);
                    return v196;
                };
                const v198 = v194.on('end', v197);
                return v198;
            };
            const v200 = new Promise(v199);
            return v200;
        };
        v183.handlerStaticFile = v201;
        const v202 = Server.prototype;
        const v235 = function (res, filePath) {
            var errorPath;
            var notFound;
            const v206 = function (_this) {
                const v205 = function () {
                    const v203 = 'Path: ' + filePath;
                    const v204 = _this.errorCode(res, 404, v203);
                    return v204;
                };
                return v205;
            };
            notFound = v206(this);
            const v207 = this.options;
            const v208 = v207['404'];
            const v209 = !v208;
            if (v209) {
                const v210 = notFound();
                return v210;
            }
            const v211 = process.cwd();
            const v212 = this.options;
            const v213 = v212['404'];
            errorPath = path.resolve(v211, v213);
            const v232 = function (_this) {
                const v231 = function (resolve, reject) {
                    const v214 = fs.createReadStream(errorPath);
                    const v219 = function () {
                        const v215 = this.getHeaders();
                        const v216 = { 'Content-Type': 'text/html' };
                        const v217 = _.extend(v215, v216);
                        const v218 = res.writeHead(404, v217);
                        return v218;
                    };
                    const v220 = v214.on('open', v219);
                    const v222 = function (err) {
                        const v221 = reject(err);
                        return v221;
                    };
                    const v223 = v220.on('error', v222);
                    const v225 = function (data) {
                        const v224 = res.write(data);
                        return v224;
                    };
                    const v226 = v223.on('data', v225);
                    const v229 = function () {
                        const v227 = res.end();
                        v227;
                        const v228 = resolve(404);
                        return v228;
                    };
                    const v230 = v226.on('end', v229);
                    return v230;
                };
                return v231;
            };
            const v233 = v232(this);
            const v234 = new Promise(v233);
            return v234;
        };
        v202.handlerNotFound = v235;
        const v236 = Server.prototype;
        const v252 = function (res, code, text) {
            const v237 = text == null;
            if (v237) {
                text = '';
            }
            if (text) {
                const v238 = '<pre>' + text;
                text = v238 + '</pre>';
            }
            const v239 = this.getHeaders();
            const v240 = { 'Content-Type': 'text/html' };
            const v241 = _.extend(v239, v240);
            const v242 = res.writeHead(code, v241);
            v242;
            const v243 = '<h1>' + code;
            const v244 = v243 + ' ';
            const v245 = http.STATUS_CODES;
            const v246 = v245[code];
            const v247 = v244 + v246;
            const v248 = v247 + '</h1>';
            const v249 = v248 + text;
            const v250 = res.write(v249);
            v250;
            const v251 = res.end();
            v251;
            return code;
        };
        v236.errorCode = v252;
        const v253 = Server.prototype;
        const v263 = function (string) {
            var ref;
            const v254 = (ref = this._logger) != null;
            if (v254) {
                const v255 = string + '\n';
                const v256 = ref.write(v255);
                v256;
            }
            const v257 = this._log;
            const v258 = typeof v257;
            const v259 = v258 === 'function';
            const v260 = this._log(string);
            const v261 = void 0;
            let v262;
            if (v259) {
                v262 = v260;
            } else {
                v262 = v261;
            }
            return v262;
        };
        v253.log = v263;
        return Server;
    };
    Server = v264();
    module.exports = Server;
};
const v266 = v265.call(this);
v266;