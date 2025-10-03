const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const path = require('path');
const url = require('url');
const v182 = (req, res, next) => {
    const v174 = res.header('X-Content-Type-Options', 'nosniff');
    v174;
    const v175 = res.header('X-Frame-Options', 'DENY');
    v175;
    const v176 = res.header('X-XSS-Protection', '1; mode=block');
    v176;
    const v177 = res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    v177;
    const v178 = res.header('Content-Security-Policy', 'default-src \'self\'');
    v178;
    const v179 = res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    v179;
    const v180 = res.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    v180;
    const v181 = next();
    v181;
};
const v183 = server.use(v182);
v183;
const v192 = (req, res, next) => {
    const v184 = res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    v184;
    const v185 = res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    v185;
    const v186 = res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    v186;
    const v187 = res.header('Access-Control-Allow-Credentials', 'true');
    v187;
    const v188 = req.method;
    const v189 = v188 === 'OPTIONS';
    if (v189) {
        const v190 = res.sendStatus(200);
        return v190;
    }
    const v191 = next();
    v191;
};
const v193 = server.use(v192);
v193;
const v213 = (req, res, next) => {
    const originalRedirect = res.redirect;
    const v211 = function (url) {
        const v194 = url.startsWith('http://');
        const v195 = !v194;
        const v196 = url.startsWith('https://');
        const v197 = !v196;
        const v198 = v195 && v197;
        if (v198) {
            const v199 = originalRedirect.call(this, url);
            return v199;
        }
        try {
            const parsedUrl = new URL(url);
            const allowedHosts = [
                'localhost:3000',
                'localhost:5000',
                'localhost:5001'
            ];
            const v200 = parsedUrl.host;
            const v201 = allowedHosts.includes(v200);
            const v202 = !v201;
            if (v202) {
                const v203 = parsedUrl.host;
                const v204 = `Blocked redirect to disallowed host: ${ v203 }`;
                const v205 = console.error(v204);
                v205;
                const v206 = res.status(400);
                const v207 = v206.send('Invalid redirect');
                return v207;
            }
        } catch (e) {
            const v208 = res.status(400);
            const v209 = v208.send('Invalid URL');
            return v209;
        }
        const v210 = originalRedirect.call(this, url);
        return v210;
    };
    res.redirect = v211;
    const v212 = next();
    v212;
};
const v214 = server.use(v213);
v214;
const v235 = (req, res, next) => {
    const v215 = req.url;
    const v216 = v215.includes('..');
    const v217 = req.url;
    const v218 = v217.includes('./');
    const v219 = v216 || v218;
    const v220 = req.url;
    const v221 = v220.includes('//');
    const v222 = v219 || v221;
    if (v222) {
        const v223 = res.status(400);
        const v224 = { error: 'Invalid URL path detected' };
        const v225 = v223.json(v224);
        return v225;
    }
    const v226 = req.url;
    const decodedUrl = decodeURIComponent(v226);
    const v227 = req.url;
    const v228 = decodedUrl !== v227;
    const v229 = decodedUrl.includes('%');
    const v230 = v228 && v229;
    if (v230) {
        const v231 = res.status(400);
        const v232 = { error: 'Invalid URL encoding detected' };
        const v233 = v231.json(v232);
        return v233;
    }
    const v234 = next();
    v234;
};
const v236 = server.use(v235);
v236;
const v237 = server.use(middlewares);
v237;
const v238 = jsonServer.bodyParser;
const v239 = server.use(v238);
v239;
const v302 = (req, res, next) => {
    const v240 = req.method;
    const v241 = v240 === 'POST';
    const v242 = req.method;
    const v243 = v242 === 'PATCH';
    const v244 = v241 || v243;
    if (v244) {
        const v245 = req.path;
        const v246 = v245.includes('/projects');
        if (v246) {
            const v247 = req.body;
            const v248 = v247.name;
            const v249 = !v248;
            const v250 = req.body;
            const v251 = v250.name;
            const v252 = typeof v251;
            const v253 = v252 !== 'string';
            const v254 = v249 || v253;
            if (v254) {
                const v255 = res.status(400);
                const v256 = { error: 'Invalid project name' };
                const v257 = v255.json(v256);
                return v257;
            }
            const v258 = req.body;
            const v259 = v258.budget;
            const v260 = req.body;
            const v261 = v260.budget;
            const v262 = isNaN(v261);
            const v263 = req.body;
            const v264 = v263.budget;
            const v265 = parseFloat(v264);
            const v266 = v265 < 0;
            const v267 = v262 || v266;
            const v268 = v259 && v267;
            if (v268) {
                const v269 = res.status(400);
                const v270 = { error: 'Budget must be a positive number' };
                const v271 = v269.json(v270);
                return v271;
            }
            const v272 = req.body;
            const v273 = v272.name;
            if (v273) {
                const v275 = req.body;
                const v276 = v275.name;
                const v277 = v276.replace(/<[^>]*>?/gm, '');
                v274.name = v277;
            }
            const v278 = req.body;
            const v279 = v278.services;
            const v280 = req.body;
            const v281 = v280.services;
            const v282 = Array.isArray(v281);
            const v283 = v279 && v282;
            if (v283) {
                const v285 = req.body;
                const v286 = v285.services;
                const v293 = service => {
                    const v287 = service.name;
                    if (v287) {
                        const v288 = service.name;
                        const v289 = v288.replace(/<[^>]*>?/gm, '');
                        service.name = v289;
                    }
                    const v290 = service.description;
                    if (v290) {
                        const v291 = service.description;
                        const v292 = v291.replace(/<[^>]*>?/gm, '');
                        service.description = v292;
                    }
                    return service;
                };
                const v294 = v286.map(v293);
                v284.services = v294;
            }
        }
    }
    const v295 = req.path;
    const normalizedPath = path.normalize(v295);
    const v296 = req.path;
    const v297 = v296 !== normalizedPath;
    if (v297) {
        const v298 = res.status(400);
        const v299 = { error: 'Invalid URL path' };
        const v300 = v298.json(v299);
        return v300;
    }
    const v301 = next();
    v301;
};
const v303 = server.use(v302);
v303;
const requestCounts = {};
const v320 = (req, res, next) => {
    const v304 = req.ip;
    const v305 = req.headers;
    const v306 = v305['x-forwarded-for'];
    const requestIp = v304 || v306;
    const now = Date.now();
    const v307 = requestCounts[requestIp];
    const v308 = [];
    const requests = v307 || v308;
    const v311 = time => {
        const v309 = now - time;
        const v310 = v309 < 60000;
        return v310;
    };
    const validRequests = requests.filter(v311);
    requestCounts[requestIp] = validRequests;
    const v312 = validRequests.length;
    const v313 = v312 >= 100;
    if (v313) {
        const v314 = res.status(429);
        const v315 = { error: 'Too many requests, please try again later' };
        const v316 = v314.json(v315);
        return v316;
    }
    const v317 = requestCounts[requestIp];
    const v318 = v317.push(now);
    v318;
    const v319 = next();
    v319;
};
const v321 = server.use(v320);
v321;
const v331 = (req, res, next) => {
    const start = Date.now();
    const v328 = () => {
        const v322 = Date.now();
        const duration = v322 - start;
        const v323 = req.method;
        const v324 = req.path;
        const v325 = res.statusCode;
        const v326 = `${ v323 } ${ v324 } - ${ v325 } - ${ duration }ms`;
        const v327 = console.log(v326);
        v327;
    };
    const v329 = res.on('finish', v328);
    v329;
    const v330 = next();
    v330;
};
const v332 = server.use(v331);
v332;
const v333 = server.use(router);
v333;
const v339 = (err, req, res, next) => {
    const v334 = err.stack;
    const v335 = console.error(v334);
    v335;
    const v336 = res.status(500);
    const v337 = { error: 'Internal Server Error' };
    const v338 = v336.json(v337);
    v338;
};
const v340 = server.use(v339);
v340;
const v341 = process.env;
const v342 = v341.PORT;
const PORT = v342 || 5001;
const v345 = () => {
    const v343 = `JSON Server is running with enhanced security on port ${ PORT }`;
    const v344 = console.log(v343);
    v344;
};
const v346 = server.listen(PORT, v345);
v346;