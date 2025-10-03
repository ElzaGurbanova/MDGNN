'use strict';
const v180 = require('child_process');
const v181 = require('fs');
const v182 = require('path');
var Node = {};
Node.child = v180;
Node.fs = v181;
Node.path = v182;
Node.process = process;
var Queue = require('@ronomon/queue');
const assertFunction = function (key, value) {
    const v183 = typeof value;
    const v184 = v183 !== 'function';
    if (v184) {
        const v185 = key + ' must be a function';
        const v186 = new Error(v185);
        throw v186;
    }
};
const assertPath = function (key, value) {
    const v187 = typeof value;
    const v188 = v187 !== 'string';
    if (v188) {
        const v189 = key + ' must be a string';
        const v190 = new Error(v189);
        throw v190;
    }
    const v191 = value.length;
    const v192 = v191 === 0;
    if (v192) {
        const v193 = key + ' must not be empty';
        const v194 = new Error(v193);
        throw v194;
    }
    const v195 = value.indexOf('\0');
    const v196 = -1;
    const v197 = v195 !== v196;
    if (v197) {
        const v198 = key + ' must be a string without null bytes';
        const v199 = new Error(v198);
        throw v199;
    }
    const v200 = value.indexOf(assertPathBadSep);
    const v201 = -1;
    const v202 = v200 !== v201;
    if (v202) {
        const v203 = key + ' must be a string without ';
        const v204 = v203 + assertPathBadSepName;
        const v205 = new Error(v204);
        throw v205;
    }
};
const v206 = Node.process;
const v207 = v206.platform;
const v208 = v207 === 'win32';
if (v208) {
    var assertPathBadSep = '/';
    var assertPathBadSepName = 'forward slashes';
} else {
    var assertPathBadSep = '\\';
    var assertPathBadSepName = 'backslashes';
}
const assertPaths = function (key, value) {
    const v209 = !value;
    const v210 = value.constructor;
    const v211 = v210 !== Array;
    const v212 = v209 || v211;
    if (v212) {
        const v213 = key + ' must be an array';
        const v214 = new Error(v213);
        throw v214;
    }
    var index = 0;
    var length = value.length;
    let v215 = index < length;
    while (v215) {
        const v217 = 'path at index ' + index;
        const v218 = value[index];
        const v219 = assertPath(v217, v218);
        v219;
        const v216 = index++;
        v215 = index < length;
    }
};
const pathBuffer = function (path) {
    const v220 = Node.path;
    var pathLong = v220._makeLong(path);
    const v221 = Buffer.byteLength(pathLong, 'utf-8');
    const v222 = v221 + 1;
    var buffer = Buffer.alloc(v222);
    const v223 = buffer.length;
    const v224 = v223 - 1;
    const v225 = buffer.write(pathLong, 0, v224, 'utf-8');
    v225;
    const v226 = buffer.length;
    const v227 = v226 - 1;
    buffer[v227] = 0;
    const v228 = buffer.indexOf(0);
    const v229 = buffer.length;
    const v230 = v229 - 1;
    const v231 = v228 !== v230;
    if (v231) {
        const v232 = new Error('path must be a string without null bytes');
        throw v232;
    }
    return buffer;
};
var Unix = {};
const v241 = function (path, end) {
    var self = this;
    const v233 = assertPath('path', path);
    v233;
    const v234 = assertFunction('end', end);
    v234;
    const v235 = [path];
    const v239 = function (error, files) {
        if (error) {
            const v236 = end(error);
            return v236;
        }
        const v237 = files[path];
        const v238 = end(undefined, v237);
        v238;
    };
    const v240 = self.files(v235, v239);
    v240;
};
Unix.file = v241;
const v279 = function (paths, end) {
    var self = this;
    const v242 = assertPaths('paths', paths);
    v242;
    const v243 = assertFunction('end', end);
    v243;
    var files = {};
    var queue = new Queue(1);
    const v265 = function (paths, end) {
        var command = 'lsof';
        const v244 = [
            '-F',
            'n',
            '--'
        ];
        var args = v244.concat(paths);
        const v245 = 2 * 1024;
        const v246 = v245 * 1024;
        var options = {};
        options.encoding = 'utf-8';
        options.maxBuffer = v246;
        const v247 = Node.child;
        const v263 = function (error, stdout, stderr) {
            const v248 = error.code;
            const v249 = v248 === 1;
            const v250 = error && v249;
            const v251 = stderr.length;
            const v252 = v251 === 0;
            const v253 = v250 && v252;
            if (v253) {
                error = undefined;
            }
            if (error) {
                const v254 = /No such file or directory/i.test(stderr);
                if (v254) {
                    error.code = 'ENOENT';
                }
                const v255 = end(error);
                return v255;
            }
            var lines = stdout.split('\n');
            var index = 0;
            var length = lines.length;
            let v256 = index < length;
            while (v256) {
                var line = lines[index];
                const v258 = line[0];
                const v259 = v258 != 'n';
                if (v259) {
                    continue;
                }
                const v260 = line.slice(1);
                var candidate = self.unescape(v260);
                const v261 = files.hasOwnProperty(candidate);
                if (v261) {
                    files[candidate] = true;
                }
                const v257 = index++;
                v256 = index < length;
            }
            const v262 = end();
            v262;
        };
        const v264 = v247.execFile(command, args, options, v263);
        v264;
    };
    queue.onData = v265;
    const v268 = function (error) {
        if (error) {
            const v266 = end(error);
            return v266;
        }
        const v267 = end(undefined, files);
        v267;
    };
    queue.onEnd = v268;
    var batch = [];
    var index = 0;
    var length = paths.length;
    let v269 = index < length;
    while (v269) {
        var path = paths[index];
        const v271 = files.hasOwnProperty(path);
        if (v271) {
            continue;
        }
        files[path] = false;
        const v272 = batch.push(path);
        v272;
        const v273 = batch.length;
        const v274 = v273 === 32;
        if (v274) {
            const v275 = queue.push(batch);
            v275;
            batch = [];
        }
        const v270 = index++;
        v269 = index < length;
    }
    const v276 = batch.length;
    if (v276) {
        const v277 = queue.push(batch);
        v277;
    }
    const v278 = queue.end();
    v278;
};
Unix.files = v279;
const v298 = function (sourceString) {
    var self = this;
    var source = Buffer.from(sourceString, 'utf-8');
    var target;
    var targetIndex;
    var sourceIndex = 0;
    var sourceLength = source.length;
    let v280 = sourceIndex < sourceLength;
    while (v280) {
        const v281 = source[sourceIndex];
        const v282 = v281 === 92;
        const v283 = sourceIndex + 1;
        const v284 = v283 < sourceLength;
        const v285 = v282 && v284;
        if (v285) {
            const v286 = !target;
            if (v286) {
                target = Buffer.alloc(sourceLength);
                targetIndex = source.copy(target, 0, 0, sourceIndex);
            }
            const v287 = sourceIndex++;
            v287;
            const v288 = targetIndex++;
            const v289 = self.unescapeTable;
            const v290 = sourceIndex++;
            const v291 = source[v290];
            const v292 = v289[v291];
            target[v288] = v292;
        } else {
            if (target) {
                const v293 = targetIndex++;
                const v294 = sourceIndex++;
                const v295 = source[v294];
                target[v293] = v295;
            } else {
                const v296 = sourceIndex++;
                v296;
            }
        }
        v280 = sourceIndex < sourceLength;
    }
    if (target) {
        const v297 = target.toString('utf-8', 0, targetIndex);
        return v297;
    } else {
        return sourceString;
    }
};
Unix.unescape = v298;
const v311 = function () {
    var table = Buffer.alloc(256);
    var code = 0;
    let v299 = code < 256;
    while (v299) {
        table[code] = code;
        const v300 = code++;
        v299 = code < 256;
    }
    const v302 = '\b'.charCodeAt(0);
    table[v301] = v302;
    const v304 = '\f'.charCodeAt(0);
    table[v303] = v304;
    const v306 = '\t'.charCodeAt(0);
    table[v305] = v306;
    const v308 = '\n'.charCodeAt(0);
    table[v307] = v308;
    const v310 = '\r'.charCodeAt(0);
    table[v309] = v310;
    return table;
};
const v312 = v311();
Unix.unescapeTable = v312;
var Windows = {};
const v313 = {};
v313[1] = 'EISDIR';
v313[2] = 'ENOENT';
v313[3] = 'ENOENT';
v313[4] = 'EMFILE';
v313[5] = 'EPERM';
v313[6] = 'EBADF';
v313[8] = 'ENOMEM';
v313[14] = 'ENOMEM';
v313[15] = 'ENOENT';
v313[32] = 'ERROR_SHARING_VIOLATION';
v313[33] = 'ERROR_LOCK_VIOLATION';
Windows.codes = v313;
const v314 = Node.process;
const v315 = v314.platform;
const v316 = v315 === 'win32';
if (v316) {
    const v317 = require('./binding.node');
    Windows.binding = v317;
}
const v339 = function (path, end) {
    var self = this;
    const v318 = assertPath('path', path);
    v318;
    const v319 = assertFunction('end', end);
    v319;
    const v320 = self.binding;
    const v321 = pathBuffer(path);
    const v337 = function (result) {
        const v322 = result === 0;
        if (v322) {
            const v323 = end(undefined, false);
            return v323;
        }
        const v324 = self.codes;
        const v325 = v324.hasOwnProperty(result);
        if (v325) {
            const v326 = self.codes;
            var code = v326[result];
        } else {
            var code = 'ENOSYS';
        }
        const v327 = code === 'ERROR_SHARING_VIOLATION';
        const v328 = code === 'ERROR_LOCK_VIOLATION';
        const v329 = v327 || v328;
        if (v329) {
            const v330 = end(undefined, true);
            return v330;
        }
        const v331 = code + ': -';
        const v332 = v331 + result;
        const v333 = v332 + ', opened(';
        const v334 = v333 + path;
        const v335 = v334 + ')';
        var error = new Error(v335);
        error.code = code;
        const v336 = end(error);
        v336;
    };
    const v338 = v320.opened(v321, v337);
    v338;
};
Windows.file = v339;
const v355 = function (paths, end) {
    var self = this;
    const v340 = assertPaths('paths', paths);
    v340;
    const v341 = assertFunction('end', end);
    v341;
    var files = {};
    var queue = new Queue(4);
    const v346 = function (path, end) {
        const v344 = function (error, opened) {
            if (error) {
                const v342 = end(error);
                return v342;
            }
            if (opened) {
                files[path] = true;
            }
            const v343 = end();
            v343;
        };
        const v345 = self.file(path, v344);
        v345;
    };
    queue.onData = v346;
    const v349 = function (error) {
        if (error) {
            const v347 = end(error);
            return v347;
        }
        const v348 = end(undefined, files);
        v348;
    };
    queue.onEnd = v349;
    var index = 0;
    var length = paths.length;
    let v350 = index < length;
    while (v350) {
        var path = paths[index];
        const v352 = files.hasOwnProperty(path);
        if (v352) {
            continue;
        }
        files[path] = false;
        const v353 = queue.push(path);
        v353;
        const v351 = index++;
        v350 = index < length;
    }
    const v354 = queue.end();
    v354;
};
Windows.files = v355;
const v356 = Node.process;
const v357 = v356.platform;
const v358 = v357 === 'win32';
if (v358) {
    module.exports = Windows;
} else {
    module.exports = Unix;
}