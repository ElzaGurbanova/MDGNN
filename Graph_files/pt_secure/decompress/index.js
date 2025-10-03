'use strict';
const path = require('path');
const fs = require('graceful-fs');
const decompressTar = require('decompress-tar');
const decompressTarbz2 = require('decompress-tarbz2');
const decompressTargz = require('decompress-targz');
const decompressUnzip = require('decompress-unzip');
const makeDir = require('make-dir');
const pify = require('pify');
const stripDirs = require('strip-dirs');
const fsP = pify(fs);
const runPlugins = (input, opts) => {
    const v155 = opts.plugins;
    const v156 = v155.length;
    const v157 = v156 === 0;
    if (v157) {
        const v158 = [];
        const v159 = Promise.resolve(v158);
        return v159;
    }
    const v160 = opts.plugins;
    const v162 = x => {
        const v161 = x(input, opts);
        return v161;
    };
    const v163 = v160.map(v162);
    const v164 = Promise.all(v163);
    const v168 = files => {
        const v166 = (a, b) => {
            const v165 = a.concat(b);
            return v165;
        };
        const v167 = files.reduce(v166);
        return v167;
    };
    const v169 = v164.then(v168);
    return v169;
};
const safeMakeDir = (dir, realOutputPath) => {
    const v170 = fsP.realpath(dir);
    const v172 = _ => {
        const parent = path.dirname(dir);
        const v171 = safeMakeDir(parent, realOutputPath);
        return v171;
    };
    const v173 = v170.catch(v172);
    const v180 = realParentPath => {
        const v174 = realParentPath.indexOf(realOutputPath);
        const v175 = v174 !== 0;
        if (v175) {
            const v176 = new Error('Refusing to create a directory outside the output path.');
            throw v176;
        }
        const v177 = makeDir(dir);
        const v178 = fsP.realpath;
        const v179 = v177.then(v178);
        return v179;
    };
    const v181 = v173.then(v180);
    return v181;
};
const preventWritingThroughSymlink = (destination, realOutputPath) => {
    const v182 = fsP.readlink(destination);
    const v183 = _ => {
        return null;
    };
    const v184 = v182.catch(v183);
    const v186 = symlinkPointsTo => {
        if (symlinkPointsTo) {
            const v185 = new Error('Refusing to write into a symlink');
            throw v185;
        }
        return realOutputPath;
    };
    const v187 = v184.then(v186);
    return v187;
};
const extractFile = (input, output, opts) => {
    const v188 = runPlugins(input, opts);
    const v284 = files => {
        const v189 = opts.strip;
        const v190 = v189 > 0;
        if (v190) {
            const v194 = x => {
                const v191 = x.path;
                const v192 = opts.strip;
                const v193 = stripDirs(v191, v192);
                x.path = v193;
                return x;
            };
            const v195 = files.map(v194);
            const v198 = x => {
                const v196 = x.path;
                const v197 = v196 !== '.';
                return v197;
            };
            files = v195.filter(v198);
        }
        const v199 = opts.filter;
        const v200 = typeof v199;
        const v201 = v200 === 'function';
        if (v201) {
            const v202 = opts.filter;
            files = files.filter(v202);
        }
        const v203 = opts.map;
        const v204 = typeof v203;
        const v205 = v204 === 'function';
        if (v205) {
            const v206 = opts.map;
            files = files.map(v206);
        }
        const v207 = !output;
        if (v207) {
            return files;
        }
        const v281 = x => {
            const v208 = x.path;
            const dest = path.join(output, v208);
            const v209 = x.mode;
            const v210 = process.umask();
            const v211 = ~v210;
            const mode = v209 & v211;
            const now = new Date();
            const v212 = x.type;
            const v213 = v212 === 'directory';
            if (v213) {
                const v214 = makeDir(output);
                const v216 = outputPath => {
                    const v215 = fsP.realpath(outputPath);
                    return v215;
                };
                const v217 = v214.then(v216);
                const v219 = realOutputPath => {
                    const v218 = safeMakeDir(dest, realOutputPath);
                    return v218;
                };
                const v220 = v217.then(v219);
                const v223 = () => {
                    const v221 = x.mtime;
                    const v222 = fsP.utimes(dest, now, v221);
                    return v222;
                };
                const v224 = v220.then(v223);
                const v225 = () => {
                    return x;
                };
                const v226 = v224.then(v225);
                return v226;
            }
            const v227 = makeDir(output);
            const v229 = outputPath => {
                const v228 = fsP.realpath(outputPath);
                return v228;
            };
            const v230 = v227.then(v229);
            const v235 = realOutputPath => {
                const v231 = path.dirname(dest);
                const v232 = safeMakeDir(v231, realOutputPath);
                const v233 = () => {
                    return realOutputPath;
                };
                const v234 = v232.then(v233);
                return v234;
            };
            const v236 = v230.then(v235);
            const v240 = realOutputPath => {
                const v237 = x.type;
                const v238 = v237 === 'file';
                if (v238) {
                    const v239 = preventWritingThroughSymlink(dest, realOutputPath);
                    return v239;
                }
                return realOutputPath;
            };
            const v241 = v236.then(v240);
            const v250 = realOutputPath => {
                const v242 = path.dirname(dest);
                const v243 = fsP.realpath(v242);
                const v248 = realDestinationDir => {
                    const v244 = realDestinationDir.indexOf(realOutputPath);
                    const v245 = v244 !== 0;
                    if (v245) {
                        const v246 = 'Refusing to write outside output directory: ' + realDestinationDir;
                        const v247 = new Error(v246);
                        throw v247;
                    }
                };
                const v249 = v243.then(v248);
                return v249;
            };
            const v251 = v241.then(v250);
            const v270 = () => {
                const v252 = x.type;
                const v253 = v252 === 'link';
                if (v253) {
                    const v254 = x.linkname;
                    const v255 = fsP.link(v254, dest);
                    return v255;
                }
                const v256 = x.type;
                const v257 = v256 === 'symlink';
                const v258 = process.platform;
                const v259 = v258 === 'win32';
                const v260 = v257 && v259;
                if (v260) {
                    const v261 = x.linkname;
                    const v262 = fsP.link(v261, dest);
                    return v262;
                }
                const v263 = x.type;
                const v264 = v263 === 'symlink';
                if (v264) {
                    const v265 = x.linkname;
                    const v266 = fsP.symlink(v265, dest);
                    return v266;
                }
                const v267 = x.data;
                const v268 = { mode };
                const v269 = fsP.writeFile(dest, v267, v268);
                return v269;
            };
            const v271 = v251.then(v270);
            const v277 = () => {
                const v272 = x.type;
                const v273 = v272 === 'file';
                const v274 = x.mtime;
                const v275 = fsP.utimes(dest, now, v274);
                const v276 = v273 && v275;
                return v276;
            };
            const v278 = v271.then(v277);
            const v279 = () => {
                return x;
            };
            const v280 = v278.then(v279);
            return v280;
        };
        const v282 = files.map(v281);
        const v283 = Promise.all(v282);
        return v283;
    };
    const v285 = v188.then(v284);
    return v285;
};
const v308 = (input, output, opts) => {
    const v286 = typeof input;
    const v287 = v286 !== 'string';
    const v288 = Buffer.isBuffer(input);
    const v289 = !v288;
    const v290 = v287 && v289;
    if (v290) {
        const v291 = new TypeError('Input file required');
        const v292 = Promise.reject(v291);
        return v292;
    }
    const v293 = typeof output;
    const v294 = v293 === 'object';
    if (v294) {
        opts = output;
        output = null;
    }
    const v295 = decompressTar();
    const v296 = decompressTarbz2();
    const v297 = decompressTargz();
    const v298 = decompressUnzip();
    const v299 = [
        v295,
        v296,
        v297,
        v298
    ];
    const v300 = { plugins: v299 };
    opts = Object.assign(v300, opts);
    let read;
    const v301 = typeof input;
    const v302 = v301 === 'string';
    const v303 = fsP.readFile(input);
    const v304 = Promise.resolve(input);
    if (v302) {
        read = v303;
    } else {
        read = v304;
    }
    const v306 = buf => {
        const v305 = extractFile(buf, output, opts);
        return v305;
    };
    const v307 = read.then(v306);
    return v307;
};
module.exports = v308;