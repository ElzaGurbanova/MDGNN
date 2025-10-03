var fs = require('fs');
var http = require('http');
var url = require('url');
var yaml = require('js-yaml');
var PostIdx;
var PutIdx;
const v174 = fs.existsSync('post');
const v175 = !v174;
if (v175) {
    const v176 = fs.mkdirSync('post', 511);
    v176;
}
;
const v177 = fs.existsSync('post/index.yaml');
if (v177) {
    const v178 = fs.readFileSync('post/index.yaml', 'utf8');
    PostIdx = yaml.safeLoad(v178);
} else {
    PostIdx = new Object();
    const v179 = new Date();
    const v180 = v179.toLocaleString();
    PostIdx.update = v180;
    const v181 = yaml.safeDump(PostIdx);
    const v182 = fs.writeFileSync('post/index.yaml', v181);
    v182;
}
;
const v183 = fs.existsSync('put');
const v184 = !v183;
if (v184) {
    const v185 = fs.mkdirSync('put', 511);
    v185;
}
;
const v186 = fs.existsSync('put/index.yaml');
if (v186) {
    const v187 = fs.readFileSync('put/index.yaml', 'utf8');
    PutIdx = yaml.safeLoad(v187);
} else {
    PutIdx = new Object();
    const v188 = new Date();
    const v189 = v188.toLocaleString();
    PutIdx.update = v189;
    const v190 = yaml.safeDump(PutIdx);
    const v191 = fs.writeFileSync('put/index.yaml', v190);
    v191;
}
;
const v345 = function (req, res) {
    var chunk = '';
    const v192 = function (data) {
        chunk += data;
    };
    const v193 = req.on('data', v192);
    v193;
    const v343 = function () {
        const v194 = req.method;
        const v195 = v194 == 'POST';
        if (v195) {
            const v196 = 'BODY: ' + chunk;
            const v197 = console.log(v196);
            v197;
            const v198 = chunk.length;
            const v199 = 'BODY length: ' + v198;
            const v200 = console.log(v199);
            v200;
            var body = yaml.load(chunk);
            const v201 = body.hasOwnProperty('cod');
            if (v201) {
                const v202 = body.cod;
                const v203 = v202 + '.';
                const v204 = body.tag;
                const v205 = v203 + v204;
                const v206 = v205 + '.';
                const v207 = body.author;
                key = v206 + v207;
            } else {
                const v208 = body.tag;
                const v209 = v208 + '.';
                const v210 = body.author;
                key = v209 + v210;
            }
            const v211 = PostIdx.hasOwnProperty(key);
            const v212 = !v211;
            if (v212) {
                PostIdx[key] = 0;
                const v213 = new Date();
                const v214 = v213.toLocaleString();
                PostIdx.update = v214;
                const v215 = yaml.safeDump(PostIdx);
                const v219 = function (err) {
                    const v216 = 'post notify: create a new key [' + key;
                    const v217 = v216 + '].\n';
                    const v218 = console.log(v217);
                    v218;
                };
                const v220 = fs.writeFile('post/index.yaml', v215, v219);
                v220;
            }
            var filename;
            const v221 = PostIdx[key];
            PostIdx[key] = v221 + 1;
            const v222 = body.hasOwnProperty('cod');
            if (v222) {
                const v223 = body.cod;
                const v224 = 'post/' + v223;
                const v225 = v224 + '.';
                const v226 = body.tag;
                const v227 = v225 + v226;
                const v228 = v227 + '.';
                const v229 = body.author;
                const v230 = v228 + v229;
                const v231 = v230 + '.';
                const v232 = PostIdx[key];
                const v233 = v231 + v232;
                filename = v233 + '.yaml';
            } else {
                const v234 = body.tag;
                const v235 = 'post/' + v234;
                const v236 = v235 + '.';
                const v237 = body.author;
                const v238 = v236 + v237;
                const v239 = v238 + '.';
                const v240 = PostIdx[key];
                const v241 = v239 + v240;
                filename = v241 + '.yaml';
            }
            const v271 = function (exists) {
                if (exists) {
                    const v242 = { 'Content-Type': 'text/plain' };
                    const v243 = res.writeHead(400, v242);
                    v243;
                    const v244 = 'post fail: file ' + filename;
                    const v245 = v244 + ' exist.';
                    const v246 = res.write(v245);
                    v246;
                    const v247 = res.end();
                    v247;
                    const v248 = 'post fail: file ' + filename;
                    const v249 = v248 + ' exist.';
                    const v250 = console.log(v249);
                    v250;
                } else {
                    const v251 = new Date();
                    const v252 = v251.getTime();
                    body.createat = v252;
                    const v253 = yaml.safeDump(body);
                    const v269 = function (err) {
                        if (err) {
                            throw err;
                        }
                        const v254 = { 'Content-Type': 'text/plain' };
                        const v255 = res.writeHead(201, v254);
                        v255;
                        const v256 = key + '.';
                        const v257 = PostIdx[key];
                        const v258 = v257 + 1;
                        const v259 = v256 + v258;
                        const v260 = res.write(v259);
                        v260;
                        const v261 = res.end();
                        v261;
                        const v262 = 'post: ' + filename;
                        const v263 = v262 + ' saved.';
                        const v264 = console.log(v263);
                        v264;
                        const v265 = new Date();
                        const v266 = v265.toLocaleString();
                        PostIdx.update = v266;
                        const v267 = yaml.safeDump(PostIdx);
                        const v268 = fs.writeFileSync('post/index.yaml', v267);
                        v268;
                    };
                    const v270 = fs.writeFile(filename, v253, v269);
                    v270;
                }
            };
            const v272 = fs.exists(filename, v271);
            v272;
        }
        const v273 = req.method;
        const v274 = v273 == 'PUT';
        if (v274) {
            const v275 = 'BODY: ' + chunk;
            const v276 = console.log(v275);
            v276;
            var body = yaml.load(chunk);
            var filename;
            const v277 = body.hasOwnProperty('cod');
            if (v277) {
                const v278 = body.cod;
                const v279 = v278 + '.';
                const v280 = body.tag;
                const v281 = v279 + v280;
                const v282 = v281 + '.';
                const v283 = body.author;
                filename = v282 + v283;
            } else {
                const v284 = body.tag;
                const v285 = v284 + '.';
                const v286 = body.author;
                filename = v285 + v286;
            }
            const v287 = body.hasOwnProperty('index');
            if (v287) {
                const v288 = filename + '.';
                const v289 = body.index;
                const v290 = v288 + v289;
                filename = v290 + '.yaml';
            } else {
                filename = filename + '.yaml';
            }
            const v309 = function (exists) {
                if (exists) {
                    const v291 = { 'Content-Type': 'text/plain' };
                    const v292 = res.writeHead(202, v291);
                    v292;
                    const v293 = 'put: ' + filename;
                    const v294 = v293 + ' updated.';
                    const v295 = res.write(v294);
                    v295;
                    const v296 = res.end();
                    v296;
                    const v297 = 'put: ' + filename;
                    const v298 = v297 + ' updated.';
                    const v299 = console.log(v298);
                    v299;
                } else {
                    const v300 = { 'Content-Type': 'text/plain' };
                    const v301 = res.writeHead(201, v300);
                    v301;
                    const v302 = 'put: ' + filename;
                    const v303 = v302 + ' saved.';
                    const v304 = res.write(v303);
                    v304;
                    const v305 = 'put: ' + filename;
                    const v306 = v305 + ' saved.';
                    const v307 = console.log(v306);
                    v307;
                    const v308 = res.end();
                    v308;
                }
            };
            const v310 = fs.exists(filename, v309);
            v310;
            const v311 = 'put/' + filename;
            const v312 = yaml.safeDump(body);
            const v319 = function (err) {
                if (err) {
                    throw err;
                }
                const v313 = new Date();
                const v314 = v313.toLocaleString();
                PutIdx[filename] = v314;
                const v315 = new Date();
                const v316 = v315.toLocaleString();
                PutIdx.update = v316;
                const v317 = yaml.safeDump(PutIdx);
                const v318 = fs.writeFileSync('put/index.yaml', v317);
                v318;
            };
            const v320 = fs.writeFile(v311, v312, v319);
            v320;
        }
        const v321 = req.method;
        const v322 = v321 == 'GET';
        if (v322) {
            const v323 = req.url;
            const v324 = url.parse(v323);
            var pathname = v324.pathname;
            var realPath = pathname.substring(1);
            const v325 = console.log(realPath);
            v325;
            const v341 = function (exists) {
                const v326 = !exists;
                if (v326) {
                    const v327 = { 'Content-Type': 'text/plain' };
                    const v328 = res.writeHead(404, v327);
                    v328;
                    const v329 = res.write('\uFFFD\uFFFD\uFFFD\uFFFD\xB7\uFFFD\uFFFDû\uFFFD\uFFFD\uFFFDҵ\uFFFD\uFFFD\uFFFD', 'utf8');
                    v329;
                    const v330 = res.end();
                    v330;
                } else {
                    var options = {};
                    options.encoding = 'utf8';
                    const v339 = function (err, file) {
                        if (err) {
                            const v331 = { 'Content-Type': 'text/plain' };
                            const v332 = res.writeHead(500, v331);
                            v332;
                            const v333 = res.end();
                            v333;
                        } else {
                            const v334 = console.log(file);
                            v334;
                            const v335 = { 'Content-Type': 'text/plain' };
                            const v336 = res.writeHead(200, v335);
                            v336;
                            const v337 = res.write(file);
                            v337;
                            const v338 = res.end();
                            v338;
                        }
                    };
                    const v340 = fs.readFile(realPath, options, v339);
                    v340;
                }
            };
            const v342 = fs.exists(realPath, v341);
            v342;
        }
    };
    const v344 = req.on('end', v343);
    v344;
};
var server = http.createServer(v345);
const v346 = server.listen(46372);
v346;