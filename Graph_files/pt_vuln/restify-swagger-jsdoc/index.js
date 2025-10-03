'use strict';
const v127 = { value: true };
const v128 = Object.defineProperty(exports, '__esModule', v127);
v128;
const errors = require('restify-errors');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const addSwaggerUiConfig = function (content, variableName, value) {
    const line = 'layout: "StandaloneLayout"';
    const v129 = ' '.repeat(8);
    const v130 = JSON.stringify(value);
    const v131 = `${ line },\n${ v129 }${ variableName }: ${ v130 }`;
    const v132 = content.replace(line, v131);
    return v132;
};
const trimTrailingSlash = function (data) {
    const v133 = data.replace(/\/+$/, '');
    return v133;
};
const createSwaggerPage = function (options) {
    const v134 = options.title;
    const v135 = !v134;
    if (v135) {
        const v136 = new Error('options.title is required');
        throw v136;
    } else {
        const v137 = options.version;
        const v138 = !v137;
        if (v138) {
            const v139 = new Error('options.version is required');
            throw v139;
        } else {
            const v140 = options.server;
            const v141 = !v140;
            if (v141) {
                const v142 = new Error('options.server is required');
                throw v142;
            } else {
                const v143 = options.path;
                const v144 = !v143;
                if (v144) {
                    const v145 = new Error('options.path is required');
                    throw v145;
                }
            }
        }
    }
    const v146 = require.resolve('swagger-ui-dist');
    const swaggerUiPath = path.dirname(v146);
    const v147 = options.title;
    const v148 = options.version;
    const v149 = options.description;
    const v150 = typeof v149;
    const v151 = v150 === 'string';
    const v152 = options.description;
    let v153;
    if (v151) {
        v153 = v152;
    } else {
        v153 = undefined;
    }
    const v154 = {};
    v154.title = v147;
    v154.version = v148;
    v154.description = v153;
    const v155 = options.host;
    const v156 = typeof v155;
    const v157 = v156 === 'string';
    const v158 = options.host;
    const v159 = trimTrailingSlash(v158);
    let v160;
    if (v157) {
        v160 = v159;
    } else {
        v160 = undefined;
    }
    const v161 = options.routePrefix;
    const v162 = typeof v161;
    const v163 = v162 === 'string';
    const v164 = options.routePrefix;
    const v165 = v164.replace(/^\/+/, '');
    let v166;
    if (v163) {
        v166 = `/${ v165 }`;
    } else {
        v166 = '/';
    }
    const v167 = options.schemes;
    const v168 = Array.isArray(v167);
    const v169 = options.schemes;
    let v170;
    if (v168) {
        v170 = v169;
    } else {
        v170 = undefined;
    }
    const v171 = options.tags;
    const v172 = Array.isArray(v171);
    const v173 = options.tags;
    const v174 = [];
    let v175;
    if (v172) {
        v175 = v173;
    } else {
        v175 = v174;
    }
    const v176 = {};
    v176.info = v154;
    v176.host = v160;
    v176.basePath = v166;
    v176.schemes = v170;
    v176.tags = v175;
    const v177 = options.apis;
    const v178 = Array.isArray(v177);
    const v179 = options.apis;
    const v180 = [];
    let v181;
    if (v178) {
        v181 = v179;
    } else {
        v181 = v180;
    }
    const v182 = {
        swaggerDefinition: v176,
        apis: v181
    };
    const swaggerSpec = swaggerJSDoc(v182);
    const v183 = options.definitions;
    if (v183) {
        const v184 = options.definitions;
        const v185 = Object.keys(v184);
        const v189 = key => {
            const v186 = swaggerSpec.definitions;
            const v187 = options.definitions;
            const v188 = v187[key];
            v186[key] = v188;
        };
        const v190 = v185.forEach(v189);
        v190;
    }
    const v191 = options.securityDefinitions;
    const v192 = options.securityDefinitions;
    const v193 = Object.keys(v192);
    const v194 = v193.length;
    const v195 = v194 > 0;
    const v196 = v191 && v195;
    if (v196) {
        let k;
        const v197 = options.securityDefinitions;
        const v198 = Object.keys(v197);
        for (k of v198) {
            const v199 = swaggerSpec.securityDefinitions;
            const v200 = options.securityDefinitions;
            const v201 = v200[k];
            v199[k] = v201;
        }
    } else {
        const v202 = swaggerSpec.securityDefinitions;
        const v203 = delete v202;
        v203;
    }
    const v204 = options.path;
    const publicPath = trimTrailingSlash(v204);
    const v205 = options.server;
    const v206 = `${ publicPath }/swagger.json`;
    const v210 = (req, res, next) => {
        const v207 = res.setHeader('Content-type', 'application/json');
        v207;
        const v208 = res.send(swaggerSpec);
        v208;
        const v209 = next();
        return v209;
    };
    const v211 = v205.get(v206, v210);
    v211;
    const v212 = options.server;
    const v217 = (req, res, next) => {
        const v213 = `${ publicPath }/index.html`;
        const v214 = res.setHeader('Location', v213);
        v214;
        const v215 = res.send(302);
        v215;
        const v216 = next();
        return v216;
    };
    const v218 = v212.get(publicPath, v217);
    v218;
    const v219 = options.server;
    const v220 = `${ publicPath }/*`;
    const v250 = (req, res, next) => {
        const v221 = req.params;
        const file = v221['*'];
        const v222 = path.resolve(swaggerUiPath, file);
        const v248 = (err, content) => {
            if (err) {
                const v223 = new errors.NotFoundError(`File ${ file } does not exist`);
                const v224 = next(v223);
                return v224;
            }
            const v225 = file === 'index.html';
            if (v225) {
                const v226 = options.forceSecure;
                const v227 = req.isSecure();
                const isReqSecure = v226 || v227;
                let v228;
                if (isReqSecure) {
                    v228 = 'https';
                } else {
                    v228 = 'http';
                }
                const v229 = req.headers;
                const v230 = v229.host;
                const jsonFileUrl = `${ v228 }://${ v230 }${ publicPath }/swagger.json`;
                const v231 = content.toString();
                const v232 = `url: "${ jsonFileUrl }"`;
                let localContent = v231.replace('url: "https://petstore.swagger.io/v2/swagger.json"', v232);
                const v233 = options.validatorUrl;
                const v234 = v233 === null;
                const v235 = options.validatorUrl;
                const v236 = typeof v235;
                const v237 = v236 === 'string';
                const v238 = v234 || v237;
                if (v238) {
                    const v239 = options.validatorUrl;
                    localContent = addSwaggerUiConfig(localContent, 'validatorUrl', v239);
                }
                const v240 = options.supportedSubmitMethods;
                const v241 = Array.isArray(v240);
                if (v241) {
                    const v242 = options.supportedSubmitMethods;
                    localContent = addSwaggerUiConfig(localContent, 'supportedSubmitMethods', v242);
                }
                content = Buffer.from(localContent);
            }
            const contentType = mime.lookup(file);
            const v243 = contentType !== false;
            if (v243) {
                const v244 = res.setHeader('Content-Type', contentType);
                v244;
            }
            const v245 = res.write(content);
            v245;
            const v246 = res.end();
            v246;
            const v247 = next();
            return v247;
        };
        const v249 = fs.readFile(v222, v248);
        v249;
    };
    const v251 = v219.get(v220, v250);
    v251;
};
exports.createSwaggerPage = createSwaggerPage;
const v252 = {};
v252.createSwaggerPage = createSwaggerPage;
exports.default = v252;