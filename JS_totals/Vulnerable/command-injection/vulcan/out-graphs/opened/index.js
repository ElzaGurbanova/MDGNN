'use strict';
const v184 = require('child_process');
const v185 = require('fs');
const v186 = require('path');
var Node = {};
Node.child = v184;
Node.fs = v185;
Node.path = v186;
Node.process = process;
var Queue = require('@ronomon/queue');
const assertFunction = function (key, value) {
    const v187 = typeof value;
    const v188 = v187 !== 'function';
    if (v188) {
        const v189 = key + ' must be a function';
        const v190 = new Error(v189);
        throw v190;
    }
};
const assertPath = function (key, value) {
    const v191 = typeof value;
    const v192 = v191 !== 'string';
    if (v192) {
        const v193 = key + ' must be a string';
        const v194 = new Error(v193);
        throw v194;
    }
    const v195 = value.length;
    const v196 = v195 === 0;
    if (v196) {
        const v197 = key + ' must not be empty';
        const v198 = new Error(v197);
        throw v198;
    }
    const v199 = value.indexOf('\0');
    const v200 = -1;
    const v201 = v199 !== v200;
    if (v201) {
        const v202 = key + ' must be a string without null bytes';
        const v203 = new Error(v202);
        throw v203;
    }
    const v204 = value.indexOf(assertPathBadSep);
    const v205 = -1;
    const v206 = v204 !== v205;
    if (v206) {
        const v207 = key + ' must be a string without ';
        const v208 = v207 + assertPathBadSepName;
        const v209 = new Error(v208);
        throw v209;
    }
};
const v210 = Node.process;
const v211 = v210.platform;
const v212 = v211 === 'win32';
if (v212) {
    var assertPathBadSep = '/';
    var assertPathBadSepName = 'forward slashes';
} else {
    var assertPathBadSep = '\\';
    var assertPathBadSepName = 'backslashes';
}
const assertPaths = function (key, value) {
    const v213 = !value;
    const v214 = value.constructor;
    const v215 = v214 !== Array;
    const v216 = v213 || v215;
    if (v216) {
        const v217 = key + ' must be an array';
        const v218 = new Error(v217);
        throw v218;
    }
    var index = 0;
    var length = value.length;
    let v219 = index < length;
    while (v219) {
        const v221 = 'path at index ' + index;
        const v222 = value[index];
        const v223 = assertPath(v221, v222);
        v223;
        const v220 = index++;
        v219 = index < length;
    }
};
const pathBuffer = function (path) {
    const v224 = Node.path;
    var pathLong = v224._makeLong(path);
    const v225 = Buffer.byteLength(pathLong, 'utf-8');
    const v226 = v225 + 1;
    var buffer = Buffer.alloc(v226);
    const v227 = buffer.length;
    const v228 = v227 - 1;
    const v229 = buffer.write(pathLong, 0, v228, 'utf-8');
    v229;
    const v230 = buffer.length;
    const v231 = v230 - 1;
    buffer[v231] = 0;
    const v232 = buffer.indexOf(0);
    const v233 = buffer.length;
    const v234 = v233 - 1;
    const v235 = v232 !== v234;
    if (v235) {
        const v236 = new Error('path must be a string without null bytes');
        throw v236;
    }
    return buffer;
};
var Unix = {};
const v245 = function (path, end) {
    var self = this;
    const v237 = assertPath('path', path);
    v237;
    const v238 = assertFunction('end', end);
    v238;
    const v239 = [path];
    const v243 = function (error, files) {
        if (error) {
            const v240 = end(error);
            return v240;
        }
        const v241 = files[path];
        const v242 = end(undefined, v241);
        v242;
    };
    const v244 = self.files(v239, v243);
    v244;
};
Unix.file = v245;
const v287 = function (paths, end) {
    var self = this;
    const v246 = assertPaths('paths', paths);
    v246;
    const v247 = assertFunction('end', end);
    v247;
    var files = {};
    var queue = new Queue(1);
    const v273 = function (paths, end) {
        const v251 = function (path) {
            const v248 = path.replace(/"/g, '\\"');
            const v249 = '"' + v248;
            const v250 = v249 + '"';
            return v250;
        };
        var escapedPaths = paths.map(v251);
        const v252 = escapedPaths.join(' ');
        var command = 'lsof -F n -- ' + v252;
        const v253 = 2 * 1024;
        const v254 = v253 * 1024;
        var options = {};
        options.encoding = 'utf-8';
        options.maxBuffer = v254;
        const v255 = Node.child;
        const v271 = function (error, stdout, stderr) {
            const v256 = error.code;
            const v257 = v256 === 1;
            const v258 = error && v257;
            const v259 = stderr.length;
            const v260 = v259 === 0;
            const v261 = v258 && v260;
            if (v261) {
                error = undefined;
            }
            if (error) {
                const v262 = /No such file or directory/i.test(stderr);
                if (v262) {
                    error.code = 'ENOENT';
                }
                const v263 = end(error);
                return v263;
            }
            var lines = stdout.split('\n');
            var index = 0;
            var length = lines.length;
            let v264 = index < length;
            while (v264) {
                var line = lines[index];
                const v266 = line[0];
                const v267 = v266 != 'n';
                if (v267) {
                    continue;
                }
                const v268 = line.slice(1);
                var candidate = self.unescape(v268);
                const v269 = files.hasOwnProperty(candidate);
                if (v269) {
                    files[candidate] = true;
                }
                const v265 = index++;
                v264 = index < length;
            }
            const v270 = end();
            v270;
        };
        const v272 = v255.exec(command, options, v271);
        v272;
    };
    queue.onData = v273;
    const v276 = function (error) {
        if (error) {
            const v274 = end(error);
            return v274;
        }
        const v275 = end(undefined, files);
        v275;
    };
    queue.onEnd = v276;
    var batch = [];
    var index = 0;
    var length = paths.length;
    let v277 = index < length;
    while (v277) {
        var path = paths[index];
        const v279 = files.hasOwnProperty(path);
        if (v279) {
            continue;
        }
        files[path] = false;
        const v280 = batch.push(path);
        v280;
        const v281 = batch.length;
        const v282 = v281 === 32;
        if (v282) {
            const v283 = queue.push(batch);
            v283;
            batch = [];
        }
        const v278 = index++;
        v277 = index < length;
    }
    const v284 = batch.length;
    if (v284) {
        const v285 = queue.push(batch);
        v285;
    }
    const v286 = queue.end();
    v286;
};
Unix.files = v287;
const v306 = function (sourceString) {
    var self = this;
    var source = Buffer.from(sourceString, 'utf-8');
    var target;
    var targetIndex;
    var sourceIndex = 0;
    var sourceLength = source.length;
    let v288 = sourceIndex < sourceLength;
    while (v288) {
        const v289 = source[sourceIndex];
        const v290 = v289 === 92;
        const v291 = sourceIndex + 1;
        const v292 = v291 < sourceLength;
        const v293 = v290 && v292;
        if (v293) {
            const v294 = !target;
            if (v294) {
                target = Buffer.alloc(sourceLength);
                targetIndex = source.copy(target, 0, 0, sourceIndex);
            }
            const v295 = sourceIndex++;
            v295;
            const v296 = targetIndex++;
            const v297 = self.unescapeTable;
            const v298 = sourceIndex++;
            const v299 = source[v298];
            const v300 = v297[v299];
            target[v296] = v300;
        } else {
            if (target) {
                const v301 = targetIndex++;
                const v302 = sourceIndex++;
                const v303 = source[v302];
                target[v301] = v303;
            } else {
                const v304 = sourceIndex++;
                v304;
            }
        }
        v288 = sourceIndex < sourceLength;
    }
    if (target) {
        const v305 = target.toString('utf-8', 0, targetIndex);
        return v305;
    } else {
        return sourceString;
    }
};
Unix.unescape = v306;
const v319 = function () {
    var table = Buffer.alloc(256);
    var code = 0;
    let v307 = code < 256;
    while (v307) {
        table[code] = code;
        const v308 = code++;
        v307 = code < 256;
    }
    const v310 = '\b'.charCodeAt(0);
    table[v309] = v310;
    const v312 = '\f'.charCodeAt(0);
    table[v311] = v312;
    const v314 = '\t'.charCodeAt(0);
    table[v313] = v314;
    const v316 = '\n'.charCodeAt(0);
    table[v315] = v316;
    const v318 = '\r'.charCodeAt(0);
    table[v317] = v318;
    return table;
};
const v320 = v319();
Unix.unescapeTable = v320;
var Windows = {};
const v321 = {};
v321[1] = 'EISDIR';
v321[2] = 'ENOENT';
v321[3] = 'ENOENT';
v321[4] = 'EMFILE';
v321[5] = 'EPERM';
v321[6] = 'EBADF';
v321[8] = 'ENOMEM';
v321[14] = 'ENOMEM';
v321[15] = 'ENOENT';
v321[32] = 'ERROR_SHARING_VIOLATION';
v321[33] = 'ERROR_LOCK_VIOLATION';
Windows.codes = v321;
const v322 = Node.process;
const v323 = v322.platform;
const v324 = v323 === 'win32';
if (v324) {
    const v325 = require('./binding.node');
    Windows.binding = v325;
}
const v347 = function (path, end) {
    var self = this;
    const v326 = assertPath('path', path);
    v326;
    const v327 = assertFunction('end', end);
    v327;
    const v328 = self.binding;
    const v329 = pathBuffer(path);
    const v345 = function (result) {
        const v330 = result === 0;
        if (v330) {
            const v331 = end(undefined, false);
            return v331;
        }
        const v332 = self.codes;
        const v333 = v332.hasOwnProperty(result);
        if (v333) {
            const v334 = self.codes;
            var code = v334[result];
        } else {
            var code = 'ENOSYS';
        }
        const v335 = code === 'ERROR_SHARING_VIOLATION';
        const v336 = code === 'ERROR_LOCK_VIOLATION';
        const v337 = v335 || v336;
        if (v337) {
            const v338 = end(undefined, true);
            return v338;
        }
        const v339 = code + ': -';
        const v340 = v339 + result;
        const v341 = v340 + ', opened(';
        const v342 = v341 + path;
        const v343 = v342 + ')';
        var error = new Error(v343);
        error.code = code;
        const v344 = end(error);
        v344;
    };
    const v346 = v328.opened(v329, v345);
    v346;
};
Windows.file = v347;
const v363 = function (paths, end) {
    var self = this;
    const v348 = assertPaths('paths', paths);
    v348;
    const v349 = assertFunction('end', end);
    v349;
    var files = {};
    var queue = new Queue(4);
    const v354 = function (path, end) {
        const v352 = function (error, opened) {
            if (error) {
                const v350 = end(error);
                return v350;
            }
            if (opened) {
                files[path] = true;
            }
            const v351 = end();
            v351;
        };
        const v353 = self.file(path, v352);
        v353;
    };
    queue.onData = v354;
    const v357 = function (error) {
        if (error) {
            const v355 = end(error);
            return v355;
        }
        const v356 = end(undefined, files);
        v356;
    };
    queue.onEnd = v357;
    var index = 0;
    var length = paths.length;
    let v358 = index < length;
    while (v358) {
        var path = paths[index];
        const v360 = files.hasOwnProperty(path);
        if (v360) {
            continue;
        }
        files[path] = false;
        const v361 = queue.push(path);
        v361;
        const v359 = index++;
        v358 = index < length;
    }
    const v362 = queue.end();
    v362;
};
Windows.files = v363;
const v364 = Node.process;
const v365 = v364.platform;
const v366 = v365 === 'win32';
if (v366) {
    module.exports = Windows;
} else {
    module.exports = Unix;
}