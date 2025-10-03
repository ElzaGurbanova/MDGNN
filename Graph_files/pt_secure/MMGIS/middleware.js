const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const rootDir = `${ __dirname }/..`;
const rootDirMissions = `${ rootDir }/Missions`;
const dirStore = {};
let DIR_STORE_MAX_AGE;
const v163 = process.env;
const v164 = v163.COMPOSITE_TILE_DIR_STORE_MAX_AGE_MS;
const v165 = v164 == null;
const v166 = process.env;
const v167 = v166.COMPOSITE_TILE_DIR_STORE_MAX_AGE_MS;
const v168 = parseInt(v167);
const v169 = isNaN(v168);
const v170 = v165 || v169;
const v171 = 3600000 / 2;
const v172 = process.env;
const v173 = v172.COMPOSITE_TILE_DIR_STORE_MAX_AGE_MS;
const v174 = parseInt(v173);
if (v170) {
    DIR_STORE_MAX_AGE = v171;
} else {
    DIR_STORE_MAX_AGE = v174;
}
const compositeImageUrls = async function (urls) {
    try {
        const v175 = {};
        v175.r = 0;
        v175.g = 0;
        v175.b = 0;
        v175.alpha = 0;
        const v176 = {};
        v176.width = 256;
        v176.height = 256;
        v176.channels = 4;
        v176.background = v175;
        const v177 = { create: v176 };
        const v178 = sharp(v177);
        const v180 = url => {
            const v179 = {};
            v179.input = `${ rootDirMissions }${ url }`;
            return v179;
        };
        const v181 = urls.map(v180);
        const v182 = v178.composite(v181);
        const v183 = v182.png();
        const output = await v183.toBuffer();
        return output;
    } catch (err) {
        return false;
    }
};
const onlyExistingFilepaths = async function (paths) {
    const filePromises = [];
    const v191 = path => {
        const v188 = async (resolve, reject) => {
            try {
                const v184 = fs.promises;
                const v185 = `${ rootDirMissions }${ path }`;
                await v184.access(v185);
                const v186 = resolve(path);
                v186;
            } catch (err) {
                const v187 = resolve(false);
                v187;
            }
        };
        const v189 = new Promise(v188);
        const v190 = filePromises.push(v189);
        v190;
    };
    const v192 = paths.forEach(v191);
    v192;
    const v193 = Promise.all(filePromises);
    const v194 = err => {
    };
    const filesExist = await v193.catch(v194);
    const v196 = p => {
        const v195 = filesExist.includes(p);
        return v195;
    };
    const v197 = paths.filter(v196);
    return v197;
};
const getTimePath = function (prepath, suffixPath, time, starttime, returnUrls) {
    let dirs = dirStore[prepath];
    if (dirs) {
        dirs = dirs.dirs;
        const v198 = time.replace(/:/g, '_');
        time = v198.replace('Z', '');
        const v199 = starttime != null;
        if (v199) {
            const v200 = starttime.replace(/:/g, '_');
            starttime = v200.replace('Z', '');
        }
        const v220 = function (v) {
            const v201 = v.split('--');
            const v202 = v201[0];
            const s = v202.replace(/Z/g, '');
            const v203 = s.indexOf('-to-');
            const v204 = -1;
            const v205 = v203 > v204;
            if (v205) {
                const t = s.split('-to-');
                const v206 = starttime != null;
                if (v206) {
                    const v207 = t[0];
                    const v208 = time < v207;
                    const v209 = t[1];
                    const v210 = starttime > v209;
                    const v211 = v208 || v210;
                    const v212 = !v211;
                    return v212;
                } else {
                    const v213 = t[1];
                    const v214 = v213 <= time;
                    return v214;
                }
            } else {
                const v215 = starttime != null;
                if (v215) {
                    const v216 = s >= starttime;
                    const v217 = s <= time;
                    const v218 = v216 && v217;
                    return v218;
                } else {
                    const v219 = s <= time;
                    return v219;
                }
            }
        };
        let closestTimeWithoutGoingOver = dirs.filter(v220);
        if (returnUrls) {
            const v222 = v => {
                const v221 = `${ prepath }${ v }${ suffixPath }`;
                return v221;
            };
            closestTimeWithoutGoingOver = closestTimeWithoutGoingOver.map(v222);
            return closestTimeWithoutGoingOver;
        }
        const v223 = closestTimeWithoutGoingOver.length;
        const v224 = v223 > 0;
        if (v224) {
            const v225 = closestTimeWithoutGoingOver.length;
            const v226 = v225 - 1;
            closestTimeWithoutGoingOver = closestTimeWithoutGoingOver[v226];
        } else {
            return false;
        }
        if (closestTimeWithoutGoingOver) {
            const v227 = `${ prepath }${ closestTimeWithoutGoingOver }${ suffixPath }`;
            return v227;
        }
        return false;
    }
    return false;
};
const sendImage = async function (req, res, next, relUrlSplit) {
    const v228 = req.query;
    const v229 = v228.composite;
    const v230 = v229 === 'true';
    if (v230) {
        const v231 = relUrlSplit[0];
        const v232 = relUrlSplit[1];
        const v233 = req.query;
        const v234 = v233.time;
        const v235 = req.query;
        const v236 = v235.starttime;
        let compositeUrls = getTimePath(v231, v232, v234, v236, true);
        compositeUrls = await onlyExistingFilepaths(compositeUrls);
        const v237 = -100;
        compositeUrls = compositeUrls.slice(v237);
        const v238 = compositeUrls.length;
        const v239 = v238 > 1;
        if (v239) {
            const outputImage = await compositeImageUrls(compositeUrls);
            const v240 = outputImage === false;
            if (v240) {
                const v241 = res.sendStatus(404);
                v241;
            } else {
                const v242 = res.contentType('image/webp');
                v242;
                const v243 = Buffer.from(outputImage, 'binary');
                const v244 = res.send(v243);
                v244;
            }
        } else {
            const v245 = compositeUrls.length;
            const v246 = v245 === 1;
            const v247 = compositeUrls[0];
            const v248 = v247 != null;
            const v249 = v246 && v248;
            if (v249) {
                const v250 = compositeUrls[0];
                req.url = v250;
                const v251 = next();
                v251;
            } else {
                const v252 = res.sendStatus(404);
                v252;
            }
        }
    } else {
        const v253 = relUrlSplit[0];
        const v254 = relUrlSplit[1];
        const v255 = req.query;
        const v256 = v255.time;
        const v257 = req.query;
        const v258 = v257.starttime;
        const newUrl = getTimePath(v253, v254, v256, v258);
        const v259 = !newUrl;
        if (v259) {
            const v260 = res.sendStatus(404);
            v260;
        } else {
            req.url = newUrl;
            const v261 = next();
            v261;
        }
    }
};
const isPathInsideRoot = function (logicalRootDirName, targetPath) {
    const resolvedTarget = path.resolve(targetPath);
    const v262 = path.sep;
    const pathParts = resolvedTarget.split(v262);
    const rootIndex = pathParts.indexOf(logicalRootDirName);
    const v263 = -1;
    const v264 = rootIndex === v263;
    if (v264) {
        return false;
    }
    const v265 = rootIndex + 1;
    const v266 = pathParts.slice(0, v265);
    const v267 = path.sep;
    const v268 = v266.join(v267);
    const v269 = path.sep;
    const resolvedRoot = v268 + v269;
    const v270 = resolvedTarget.startsWith(resolvedRoot);
    return v270;
};
const v323 = function (ROOT_PATH) {
    const v322 = (req, res, next) => {
        const v271 = req.originalUrl;
        const v272 = v271.split('?');
        const originalUrl = v272[0];
        const v273 = req.url;
        const v274 = v273.split('?');
        const relUrl = v274[0];
        const v275 = `${ ROOT_PATH }/Missions`;
        const v276 = originalUrl.startsWith(v275);
        const v277 = !v276;
        if (v277) {
            const v278 = res.sendStatus(404);
            return v278;
        }
        const v279 = isPathInsideRoot('Missions', originalUrl);
        const v280 = !v279;
        if (v280) {
            const v281 = res.sendStatus(404);
            return v281;
        }
        const v282 = req.query;
        const v283 = v282.time;
        const v284 = v283 != null;
        const v285 = originalUrl.indexOf('_time_');
        const v286 = -1;
        const v287 = v285 > v286;
        const v288 = v284 && v287;
        if (v288) {
            const urlSplit = originalUrl.split('_time_');
            const relUrlSplit = relUrl.split('_time_');
            const v289 = relUrlSplit[0];
            const v290 = dirStore[v289];
            const v291 = v290 == null;
            if (v291) {
                const v292 = relUrlSplit[0];
                const v293 = [];
                const v294 = {};
                v294.lastUpdated = 0;
                v294.dirs = v293;
                dirStore[v292] = v294;
            }
            const v295 = Date.now();
            const v296 = relUrlSplit[0];
            const v297 = dirStore[v296];
            const v298 = v297.lastUpdated;
            const v299 = v295 - v298;
            const v300 = v299 > DIR_STORE_MAX_AGE;
            if (v300) {
                const v301 = urlSplit[0];
                const v302 = path.join(rootDir, v301);
                const v303 = { withFileTypes: true };
                const v318 = (error, files) => {
                    const v304 = !error;
                    if (v304) {
                        const v306 = item => {
                            const v305 = item.isDirectory();
                            return v305;
                        };
                        const v307 = files.filter(v306);
                        const v309 = item => {
                            const v308 = item.name;
                            return v308;
                        };
                        const dirs = v307.map(v309);
                        const v312 = Date.now();
                        v311.lastUpdated = v312;
                        const v315 = dirs.sort();
                        v314.dirs = v315;
                        const v316 = sendImage(req, res, next, relUrlSplit);
                        v316;
                    } else {
                        const v317 = res.sendStatus(404);
                        v317;
                    }
                };
                const v319 = fs.readdir(v302, v303, v318);
                v319;
            } else {
                const v320 = sendImage(req, res, next, relUrlSplit);
                v320;
            }
        } else {
            const v321 = next();
            v321;
        }
    };
    return v322;
};
const middleware = {};
middleware.missions = v323;
const v324 = {};
v324.middleware = middleware;
module.exports = v324;