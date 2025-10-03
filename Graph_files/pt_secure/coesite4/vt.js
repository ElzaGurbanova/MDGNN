var express = require('express');
var router = express.Router();
const config = require('config');
const fs = require('fs');
const cors = require('cors');
const MBTiles = require('@mapbox/mbtiles');
const TimeFormat = require('hh-mm-ss');
const defaultZ = config.get('defaultZ');
const mbtilesDir = config.get('mbtilesDir');
let mbtilesPool = {};
let tz = config.get('tz');
let sTileName = config.get('sTileName');
let busy = false;
var app = express();
const v156 = cors();
const v157 = app.use(v156);
v157;
const getMBTiles = async (t, z, x, y) => {
    let mbtilesPath = '';
    let mbtilesPath2 = '';
    let mbtilesPath3 = '';
    const v158 = tz[t];
    const v159 = !v158;
    if (v159) {
        tz[t] = defaultZ;
    }
    const v160 = tz[t];
    let tz2 = v160 - 1;
    const v161 = tz[t];
    let tz3 = v161 - 2;
    const v162 = tz[t];
    const v163 = z < v162;
    if (v163) {
        const v164 = sTileName[t];
        if (v164) {
            let stname = sTileName[t];
            mbtilesPath = `${ mbtilesDir }/${ t }/${ stname }.mbtiles`;
            mbtilesPath2 = `${ mbtilesDir }/${ t }/${ stname }.mbtiles`;
            mbtilesPath3 = `${ mbtilesDir }/${ t }/${ stname }.mbtiles`;
        } else {
            mbtilesPath = `${ mbtilesDir }/${ t }/0-0-0.mbtiles`;
            mbtilesPath2 = `${ mbtilesDir }/${ t }/0-0-0.mbtiles`;
            mbtilesPath3 = `${ mbtilesDir }/${ t }/0-0-0.mbtiles`;
        }
    } else {
        const v165 = tz[t];
        const v166 = tz[t];
        const v167 = z - v166;
        const v168 = x >> v167;
        const v169 = tz[t];
        const v170 = z - v169;
        const v171 = y >> v170;
        mbtilesPath = `${ mbtilesDir }/${ t }/${ v165 }-${ v168 }-${ v171 }.mbtiles`;
        const v172 = z - tz2;
        const v173 = x >> v172;
        const v174 = z - tz2;
        const v175 = y >> v174;
        mbtilesPath2 = `${ mbtilesDir }/${ t }/${ tz2 }-${ v173 }-${ v175 }.mbtiles`;
        const v176 = z - tz3;
        const v177 = x >> v176;
        const v178 = z - tz3;
        const v179 = y >> v178;
        mbtilesPath3 = `${ mbtilesDir }/${ t }/${ tz3 }-${ v177 }-${ v179 }.mbtiles`;
    }
    const v224 = (resolve, reject) => {
        const v180 = mbtilesPool[mbtilesPath];
        if (v180) {
            const v181 = mbtilesPool[mbtilesPath];
            const v182 = v181.mbtiles;
            const v183 = resolve(v182);
            v183;
        } else {
            const v184 = mbtilesPool[mbtilesPath2];
            if (v184) {
                const v185 = mbtilesPool[mbtilesPath2];
                const v186 = v185.mbtiles;
                const v187 = resolve(v186);
                v187;
            } else {
                const v188 = mbtilesPool[mbtilesPath3];
                if (v188) {
                    const v189 = mbtilesPool[mbtilesPath3];
                    const v190 = v189.mbtiles;
                    const v191 = resolve(v190);
                    v191;
                } else {
                    const v192 = fs.existsSync(mbtilesPath);
                    if (v192) {
                        const v200 = (err, mbtiles) => {
                            if (err) {
                                const v193 = new Error(`${ mbtilesPath } could not open.`);
                                const v194 = reject(v193);
                                v194;
                            } else {
                                const v195 = new Date();
                                const v196 = {};
                                v196.mbtiles = mbtiles;
                                v196.openTime = v195;
                                mbtilesPool[mbtilesPath] = v196;
                                const v197 = mbtilesPool[mbtilesPath];
                                const v198 = v197.mbtiles;
                                const v199 = resolve(v198);
                                v199;
                            }
                        };
                        const v201 = new MBTiles(`${ mbtilesPath }?mode=ro`, v200);
                        v201;
                    } else {
                        const v202 = fs.existsSync(mbtilesPath2);
                        if (v202) {
                            const v210 = (err, mbtiles) => {
                                if (err) {
                                    const v203 = new Error(`${ mbtilesPath2 } could not open.`);
                                    const v204 = reject(v203);
                                    v204;
                                } else {
                                    const v205 = new Date();
                                    const v206 = {};
                                    v206.mbtiles = mbtiles;
                                    v206.openTime = v205;
                                    mbtilesPool[mbtilesPath2] = v206;
                                    const v207 = mbtilesPool[mbtilesPath2];
                                    const v208 = v207.mbtiles;
                                    const v209 = resolve(v208);
                                    v209;
                                }
                            };
                            const v211 = new MBTiles(`${ mbtilesPath2 }?mode=ro`, v210);
                            v211;
                        } else {
                            const v212 = fs.existsSync(mbtilesPath3);
                            if (v212) {
                                const v220 = (err, mbtiles) => {
                                    if (err) {
                                        const v213 = new Error(`${ mbtilesPath3 } could not open.`);
                                        const v214 = reject(v213);
                                        v214;
                                    } else {
                                        const v215 = new Date();
                                        const v216 = {};
                                        v216.mbtiles = mbtiles;
                                        v216.openTime = v215;
                                        mbtilesPool[mbtilesPath3] = v216;
                                        const v217 = mbtilesPool[mbtilesPath3];
                                        const v218 = v217.mbtiles;
                                        const v219 = resolve(v218);
                                        v219;
                                    }
                                };
                                const v221 = new MBTiles(`${ mbtilesPath3 }?mode=ro`, v220);
                                v221;
                            } else {
                                const v222 = new Error(`${ mbtilesPath } was not found.`);
                                const v223 = reject(v222);
                                v223;
                            }
                        }
                    }
                }
            }
        }
    };
    const v225 = new Promise(v224);
    return v225;
};
const getTile = async (mbtiles, z, x, y) => {
    const v231 = (resolve, reject) => {
        const v229 = (err, tile, headers) => {
            if (err) {
                const v226 = reject();
                v226;
            } else {
                const v227 = {
                    tile: tile,
                    headers: headers
                };
                const v228 = resolve(v227);
                v228;
            }
        };
        const v230 = mbtiles.getTile(z, x, y, v229);
        v230;
    };
    const v232 = new Promise(v231);
    return v232;
};
const v233 = `/zxy/:t/:z/:x/:y.pbf`;
const v309 = async function (req, res) {
    busy = true;
    const v234 = req.params;
    const tilesetName = v234.t;
    const v235 = req.params;
    const v236 = v235.z;
    const z = parseInt(v236);
    const v237 = req.params;
    const v238 = v237.x;
    const x = parseInt(v238);
    const v239 = req.params;
    const v240 = v239.y;
    const y = parseInt(v240);
    const v241 = !tilesetName;
    const v242 = typeof tilesetName;
    const v243 = v242 !== 'string';
    const v244 = v241 || v243;
    const v245 = /^[a-zA-Z0-9_-]+$/.test(tilesetName);
    const v246 = !v245;
    const v247 = v244 || v246;
    if (v247) {
        const v248 = res.status(400);
        const v249 = v248.send('Invalid tileset name');
        v249;
        busy = false;
        return;
    }
    const v250 = isNaN(z);
    const v251 = z < 0;
    const v252 = v250 || v251;
    const v253 = z > 30;
    const v254 = v252 || v253;
    if (v254) {
        const v255 = res.status(400);
        const v256 = v255.send('Invalid zoom level');
        v256;
        busy = false;
        return;
    }
    const v257 = isNaN(x);
    const v258 = x < 0;
    const v259 = v257 || v258;
    const v260 = Math.pow(2, z);
    const v261 = x >= v260;
    const v262 = v259 || v261;
    if (v262) {
        const v263 = res.status(400);
        const v264 = v263.send('Invalid x coordinate');
        v264;
        busy = false;
        return;
    }
    const v265 = isNaN(y);
    const v266 = y < 0;
    const v267 = v265 || v266;
    const v268 = Math.pow(2, z);
    const v269 = y >= v268;
    const v270 = v267 || v269;
    if (v270) {
        const v271 = res.status(400);
        const v272 = v271.send('Invalid y coordinate');
        v272;
        busy = false;
        return;
    }
    const v273 = req.session;
    const v274 = v273.userId;
    const v275 = !v274;
    if (v275) {
        const v276 = res.status(401);
        const v277 = `Please log in to get: /zxy/${ tilesetName }/${ z }/${ x }/${ y }.pbf`;
        const v278 = v276.send(v277);
        v278;
    } else {
        const v279 = getMBTiles(tilesetName, z, x, y);
        const v302 = mbtiles => {
            const v280 = getTile(mbtiles, z, x, y);
            const v295 = r => {
                const v281 = r.tile;
                if (v281) {
                    const v282 = res.set('content-type', 'application/vnd.mapbox-vector-tile');
                    v282;
                    const v283 = res.set('content-encoding', 'gzip');
                    v283;
                    const v284 = r.headers;
                    const v285 = v284['Last-Modified'];
                    const v286 = res.set('last-modified', v285);
                    v286;
                    const v287 = r.headers;
                    const v288 = v287['ETag'];
                    const v289 = res.set('etag', v288);
                    v289;
                    const v290 = r.tile;
                    const v291 = res.send(v290);
                    v291;
                    busy = false;
                } else {
                    const v292 = res.status(404);
                    const v293 = `tile not found: /zxy/${ tilesetName }/${ z }/${ x }/${ y }.pbf`;
                    const v294 = v292.send(v293);
                    v294;
                    busy = false;
                }
            };
            const v296 = v280.then(v295);
            const v300 = e => {
                const v297 = res.status(404);
                const v298 = `tile not found (getTile error): /zxy/${ tilesetName }/${ z }/${ x }/${ y }.pbf`;
                const v299 = v297.send(v298);
                v299;
                busy = false;
            };
            const v301 = v296.catch(v300);
            v301;
        };
        const v303 = v279.then(v302);
        const v307 = e => {
            const v304 = res.status(404);
            const v305 = `mbtiles not found for /zxy/${ tilesetName }/${ z }/${ x }/${ y }.pbf`;
            const v306 = v304.send(v305);
            v306;
        };
        const v308 = v303.catch(v307);
        v308;
    }
    ;
};
const v310 = router.get(v233, v309);
v310;
module.exports = router;