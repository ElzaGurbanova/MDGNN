'use strict';
const v135 = { value: true };
const v136 = Object.defineProperty(exports, '__esModule', v135);
v136;
const errors = require('restify-errors');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const addSwaggerUiConfig = function (content, variableName, value) {
    const line = 'layout: "StandaloneLayout"';
    const v137 = ' '.repeat(8);
    const v138 = JSON.stringify(value);
    const v139 = `${ line },\n${ v137 }${ variableName }: ${ v138 }`;
    const v140 = content.replace(line, v139);
    return v140;
};
const trimTrailingChar = function (data, char = '/') {
    const v141 = new RegExp(`${ char }+$`);
    const v142 = data.replace(v141, '');
    return v142;
};
const fileNotFound = function (file, next) {
    const v143 = new errors.NotFoundError(`File ${ file } does not exist`);
    const v144 = next(v143);
    return v144;
};
const createSwaggerPage = function (options) {
    const v145 = options.title;
    const v146 = !v145;
    if (v146) {
        const v147 = new Error('options.title is required');
        throw v147;
    } else {
        const v148 = options.version;
        const v149 = !v148;
        if (v149) {
            const v150 = new Error('options.version is required');
            throw v150;
        } else {
            const v151 = options.server;
            const v152 = !v151;
            if (v152) {
                const v153 = new Error('options.server is required');
                throw v153;
            } else {
                const v154 = options.path;
                const v155 = !v154;
                if (v155) {
                    const v156 = new Error('options.path is required');
                    throw v156;
                }
            }
        }
    }
    const v157 = require.resolve('swagger-ui-dist');
    const v158 = path.dirname(v157);
    const v159 = path.sep;
    const v160 = trimTrailingChar(v158, v159);
    const v161 = path.sep;
    const swaggerUiPath = `${ v160 }${ v161 }`;
    const v162 = options.title;
    const v163 = options.version;
    const v164 = options.description;
    const v165 = typeof v164;
    const v166 = v165 === 'string';
    const v167 = options.description;
    let v168;
    if (v166) {
        v168 = v167;
    } else {
        v168 = undefined;
    }
    const v169 = {};
    v169.title = v162;
    v169.version = v163;
    v169.description = v168;
    const v170 = options.host;
    const v171 = typeof v170;
    const v172 = v171 === 'string';
    const v173 = options.host;
    const v174 = trimTrailingChar(v173);
    let v175;
    if (v172) {
        v175 = v174;
    } else {
        v175 = undefined;
    }
    const v176 = options.routePrefix;
    const v177 = typeof v176;
    const v178 = v177 === 'string';
    const v179 = options.routePrefix;
    const v180 = v179.replace(/^\/+/, '');
    let v181;
    if (v178) {
        v181 = `/${ v180 }`;
    } else {
        v181 = '/';
    }
    const v182 = options.schemes;
    const v183 = Array.isArray(v182);
    const v184 = options.schemes;
    let v185;
    if (v183) {
        v185 = v184;
    } else {
        v185 = undefined;
    }
    const v186 = options.tags;
    const v187 = Array.isArray(v186);
    const v188 = options.tags;
    const v189 = [];
    let v190;
    if (v187) {
        v190 = v188;
    } else {
        v190 = v189;
    }
    const v191 = {};
    v191.info = v169;
    v191.host = v175;
    v191.basePath = v181;
    v191.schemes = v185;
    v191.tags = v190;
    const v192 = options.apis;
    const v193 = Array.isArray(v192);
    const v194 = options.apis;
    const v195 = [];
    let v196;
    if (v193) {
        v196 = v194;
    } else {
        v196 = v195;
    }
    const v197 = {
        swaggerDefinition: v191,
        apis: v196
    };
    const swaggerSpec = swaggerJSDoc(v197);
    const v198 = options.definitions;
    if (v198) {
        const v199 = options.definitions;
        const v200 = Object.keys(v199);
        const v204 = key => {
            const v201 = swaggerSpec.definitions;
            const v202 = options.definitions;
            const v203 = v202[key];
            v201[key] = v203;
        };
        const v205 = v200.forEach(v204);
        v205;
    }
    const v206 = options.securityDefinitions;
    const v207 = options.securityDefinitions;
    const v208 = Object.keys(v207);
    const v209 = v208.length;
    const v210 = v209 > 0;
    const v211 = v206 && v210;
    if (v211) {
        let k;
        const v212 = options.securityDefinitions;
        const v213 = Object.keys(v212);
        for (k of v213) {
            const v214 = swaggerSpec.securityDefinitions;
            const v215 = options.securityDefinitions;
            const v216 = v215[k];
            v214[k] = v216;
        }
    } else {
        const v217 = swaggerSpec.securityDefinitions;
        const v218 = delete v217;
        v218;
    }
    const v219 = options.path;
    const publicPath = trimTrailingChar(v219);
    const v220 = options.server;
    const v221 = `${ publicPath }/swagger.json`;
    const v225 = (req, res, next) => {
        const v222 = res.setHeader('Content-type', 'application/json');
        v222;
        const v223 = res.send(swaggerSpec);
        v223;
        const v224 = next();
        return v224;
    };
    const v226 = v220.get(v221, v225);
    v226;
    const v227 = options.server;
    const v232 = (req, res, next) => {
        const v228 = `${ publicPath }/index.html`;
        const v229 = res.setHeader('Location', v228);
        v229;
        const v230 = res.send(302);
        v230;
        const v231 = next();
        return v231;
    };
    const v233 = v227.get(publicPath, v232);
    v233;
    const v234 = options.server;
    const v235 = `${ publicPath }/*`;
    const v266 = (req, res, next) => {
        const v236 = req.params;
        const file = v236['*'];
        const filePath = path.resolve(swaggerUiPath, file);
        const v237 = filePath.indexOf(swaggerUiPath);
        const v238 = v237 !== 0;
        if (v238) {
            const v239 = fileNotFound(file, next);
            return v239;
        }
        const v264 = (err, content) => {
            if (err) {
                const v240 = fileNotFound(file, next);
                return v240;
            }
            const v241 = file === 'index.html';
            if (v241) {
                const v242 = options.forceSecure;
                const v243 = req.isSecure();
                const isReqSecure = v242 || v243;
                let v244;
                if (isReqSecure) {
                    v244 = 'https';
                } else {
                    v244 = 'http';
                }
                const v245 = req.headers;
                const v246 = v245.host;
                const jsonFileUrl = `${ v244 }://${ v246 }${ publicPath }/swagger.json`;
                const v247 = content.toString();
                const v248 = `url: "${ jsonFileUrl }"`;
                let localContent = v247.replace('url: "https://petstore.swagger.io/v2/swagger.json"', v248);
                const v249 = options.validatorUrl;
                const v250 = v249 === null;
                const v251 = options.validatorUrl;
                const v252 = typeof v251;
                const v253 = v252 === 'string';
                const v254 = v250 || v253;
                if (v254) {
                    const v255 = options.validatorUrl;
                    localContent = addSwaggerUiConfig(localContent, 'validatorUrl', v255);
                }
                const v256 = options.supportedSubmitMethods;
                const v257 = Array.isArray(v256);
                if (v257) {
                    const v258 = options.supportedSubmitMethods;
                    localContent = addSwaggerUiConfig(localContent, 'supportedSubmitMethods', v258);
                }
                content = Buffer.from(localContent);
            }
            const contentType = mime.lookup(file);
            const v259 = contentType !== false;
            if (v259) {
                const v260 = res.setHeader('Content-Type', contentType);
                v260;
            }
            const v261 = res.write(content);
            v261;
            const v262 = res.end();
            v262;
            const v263 = next();
            return v263;
        };
        const v265 = fs.readFile(filePath, v264);
        v265;
    };
    const v267 = v234.get(v235, v266);
    v267;
};
exports.createSwaggerPage = createSwaggerPage;
const v268 = {};
v268.createSwaggerPage = createSwaggerPage;
exports.default = v268;