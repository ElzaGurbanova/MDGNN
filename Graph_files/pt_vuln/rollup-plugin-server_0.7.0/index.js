'use strict';
const _interopDefault = function (ex) {
    const v133 = typeof ex;
    const v134 = v133 === 'object';
    const v135 = ex && v134;
    const v136 = 'default' in ex;
    const v137 = v135 && v136;
    const v138 = ex['default'];
    let v139;
    if (v137) {
        v139 = v138;
    } else {
        v139 = ex;
    }
    return v139;
};
var fs = require('fs');
const v140 = require('http');
var http = _interopDefault(v140);
const v141 = require('https');
var https = _interopDefault(v141);
var path = require('path');
const v142 = require('mime');
var mime = _interopDefault(v142);
const v143 = require('opener');
var opener = _interopDefault(v143);
var DEFAULT_SSL_KEY = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAqoaZC9fLT4x5OABaNdzzIhGeeMSsshHYcvicgXYhOfkHdkV8\nzY0PL9Tl4e5URisRe4k4aV1+kiAwK4n74IsX8AR2qfmsopbOItZM1rW7Ok5V5q7a\nuzIYbdgMtokxlEcg8WGSNhCZgXIxf6Y6IhmX9BTtcdAwvbvWElzSvbWJEbpD+Q89\n7a9eWT10X9HAWnOYdJ6FamJHeKj9HQ766QvGlqFdGDSK14DyY3iWzAMO1lHSkmai\nVWHPlkxB58/0VcEcK8Yl4v8wxHgGdwK5r92Rz84nrQ1kG8oGaU39VDVJg9Sg8zBR\n/KFbVfVaOSA4vZaNYcSzXKTJiMztJVVj1WuE3wIDAQABAoIBAF90GoWLlO4BdvVH\nFTgjZyHB9RArH3RKEvxAd/Lr+itmX6vvt62j8UVYChpO+3OPtiiNpjssr6YCSJSG\nl6yYj5y2EuqQrPcSLW9IwBhL//LiWKlZZWz13MDX+D3RTCRxMFqNwHdtEVBpaJXI\nqa/e3bUuZb+Yxz/dvjXnKbwxuvllfTwFEH+OygviYi4SmLYuubnySlWL+sGYaqqa\nVgy4+4ufN+5uDLA07SbW6WlaGbVhYGumV2mEWQTXVZzdSCHnyos2S03ho0W4dly8\n97P936ebDon4HOxE0Y3NxJ5mRKKB2DuivdooFdw96r5GR98+Ou3mdhj9Fa66X/1A\nXxqfv1kCgYEA3lHCHxfqZWr2Hp/Ye5wWitSf4N1CmS352Mk7mmiC43r65a6XXK4d\nAMCAfwdRsEn1cfD4/kyOJzEoVFjIILVfr3Q72d1Q046qLCrBwo2bqN5vqoh4pe44\nqF3mn0U14Sd1/XiuqTx61smKiHgeraOXwhCPaXv0soMBswS+pymAQk0CgYEAxFwf\nIvnPfAjwmdIAEut9QkPKODiHvxzLH4h/g4o02ivpUmxCR5+yW1wjfUQrXTK3dcLC\nKW7mhgEqlQX0u+YbyrGvwMZ/7eHkPRazJEbjwPmAOJg24M1DAICvseGQBPL4/nrF\nlv3PuKAgKIcyh7v9UEgJMUo2fq4W/iTpsWFygdsCgYBjXBLwJpYhoX5CDZqJFCeX\nAJQ7wWeEYmHpm3ZB+jeVR19ey3rmdwKLVX2YSEMgEM3bkKEXtktKBNRLbipzQ9xx\n4/bj1d/LzVUMzEcwlm1dOZyakMerER7NULpDsID2EdbP4+HbzSXxXL3HZDgBzr2C\nhDg0IqwoJBjcU2CKAShLeQKBgBRo7uOXy7U8yKV0aoWM7Kwil7ZYSePXflV8vqRR\njUTQI6RplEoVk1hjr1yp5Uf+qYsX/06HNHbhUCfFQrb1KBZdecMz3sA/JpYi8ePn\namz4ghdf2vRq4Xf/6EM5Cts41iC9aiRTpW+vVShhRSNOqvnZQvtYl2l7dvBbrd6+\nHkTZAoGBANwkGgBr0LQ0rsy4gD/y9yn2mCC9Z9UEd1o3X1fKcXXRVAOSvTCUqA82\noB6BEaM4mG0De44Vp5haHAsjs6h3Twlhs1K7WZvDc/Y6/XngvLKuhFzp9for5/DR\nhIJLvMcAR/Un/CJbO28eGI/Fom/mdd3z3I1JGN4xTdh3+msQrs8X\n-----END RSA PRIVATE KEY-----';
var DEFAULT_SSL_CERT = '-----BEGIN CERTIFICATE-----\nMIIC6DCCAdACCQCgMy/JzfSHEzANBgkqhkiG9w0BAQUFADA2MQswCQYDVQQGEwJB\nVTETMBEGA1UECBMKU29tZS1TdGF0ZTESMBAGA1UEChMJbG9jYWxob3N0MB4XDTE3\nMDgwNDAyMjc0OFoXDTI3MDgwMjAyMjc0OFowNjELMAkGA1UEBhMCQVUxEzARBgNV\nBAgTClNvbWUtU3RhdGUxEjAQBgNVBAoTCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcN\nAQEBBQADggEPADCCAQoCggEBAKqGmQvXy0+MeTgAWjXc8yIRnnjErLIR2HL4nIF2\nITn5B3ZFfM2NDy/U5eHuVEYrEXuJOGldfpIgMCuJ++CLF/AEdqn5rKKWziLWTNa1\nuzpOVeau2rsyGG3YDLaJMZRHIPFhkjYQmYFyMX+mOiIZl/QU7XHQML271hJc0r21\niRG6Q/kPPe2vXlk9dF/RwFpzmHSehWpiR3io/R0O+ukLxpahXRg0iteA8mN4lswD\nDtZR0pJmolVhz5ZMQefP9FXBHCvGJeL/MMR4BncCua/dkc/OJ60NZBvKBmlN/VQ1\nSYPUoPMwUfyhW1X1WjkgOL2WjWHEs1ykyYjM7SVVY9VrhN8CAwEAATANBgkqhkiG\n9w0BAQUFAAOCAQEAHEu6k+Gjdt4f8phRTlMA/1JVqcwcsBeP+EEOlk34HEgfdOma\nPYwPISjUE28YzDvfHyK6R5dTLt3wijbTOAvXU2mDwW10/aR/e+uKsK09cKeFPMY6\nI9fpz+FPeJqKqBXcpkN4qwCzOoEZNm3PV0+l9AP2VKvCjN6i5Hnaq8vlsIe2SPe2\nQUbvUEDSXzBrhr+JT/IM75ytusGAL3iY1toVxHV4sxUvLKqE87Z5dRYV5h3avfQt\nxwVRsytOuj2lP0GeTqx1u0J3txIGAvd981qQx+fM5YuewTJHwyR+FdQKNXBchGOx\nGy3dZ2DCszBrC8Hmzr1t/5FBhy7wi1ihQ0dE4Q==\n-----END CERTIFICATE-----';
var DEFAULT_SSL_CIPHERS = 'ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS';
const server = function (options) {
    const v144 = void 0;
    const v145 = options === v144;
    if (v145) {
        options.contentBase = '';
        options = {};
        options = {};
    }
    const v146 = Array.isArray(options);
    const v147 = typeof options;
    const v148 = v147 === 'string';
    const v149 = v146 || v148;
    if (v149) {
        options.contentBase = options;
        options = {};
        options = {};
    }
    const v150 = options.contentBase;
    const v151 = Array.isArray(v150);
    const v152 = options.contentBase;
    const v153 = options.contentBase;
    const v154 = [v153];
    let v155;
    if (v151) {
        v155 = v152;
    } else {
        v155 = v154;
    }
    options.contentBase = v155;
    const v156 = options.host;
    options.host = v156 || 'localhost';
    const v157 = options.port;
    options.port = v157 || 10001;
    const v158 = options.ssl;
    const v159 = !v158;
    const v160 = !v159;
    options.ssl = v160;
    const v161 = options.ssl;
    if (v161) {
        const v162 = options.ssl_key;
        options.ssl_key = v162 || DEFAULT_SSL_KEY;
        const v163 = options.ssl_cert;
        options.ssl_cert = v163 || DEFAULT_SSL_CERT;
        const v164 = options.ssl_ciphers;
        options.ssl_ciphers = v164 || DEFAULT_SSL_CIPHERS;
    }
    const v165 = options.customResponseHeaders;
    const v166 = {};
    options.customResponseHeaders = v165 || v166;
    mime.default_type = 'text/plain';
    const handler = function (request, response) {
        const v167 = options.customResponseHeaders;
        const v168 = Object.keys(v167);
        const v172 = function (key) {
            const v169 = options.customResponseHeaders;
            const v170 = v169[key];
            const v171 = response.setHeader(key, v170);
            v171;
        };
        const v173 = v168.forEach(v172);
        v173;
        const v174 = request.url;
        const v175 = v174.split('?');
        const v176 = v175[0];
        var urlPath = decodeURI(v176);
        const v177 = options.contentBase;
        const v207 = function (error, content, filePath) {
            const v178 = !error;
            if (v178) {
                const v179 = found(response, filePath, content);
                return v179;
            }
            const v180 = error.code;
            const v181 = v180 !== 'ENOENT';
            if (v181) {
                const v182 = response.writeHead(500);
                v182;
                const v183 = '500 Internal Server Error' + '\n\n';
                const v184 = v183 + filePath;
                const v185 = v184 + '\n\n';
                const v186 = Object.keys(error);
                const v188 = function (k) {
                    const v187 = error[k];
                    return v187;
                };
                const v189 = v186.map(v188);
                const v190 = v189.join('\n');
                const v191 = v185 + v190;
                const v192 = v191 + '\n\n(rollup-plugin-server)';
                const v193 = response.end(v192, 'utf-8');
                v193;
                return;
            }
            const v194 = request.url;
            const v195 = v194 === '/favicon.ico';
            if (v195) {
                filePath = path.resolve(__dirname, '../dist/favicon.ico');
                const v198 = function (error, content) {
                    if (error) {
                        const v196 = notFound(response, filePath);
                        v196;
                    } else {
                        const v197 = found(response, filePath, content);
                        v197;
                    }
                };
                const v199 = fs.readFile(filePath, v198);
                v199;
            } else {
                const v200 = options.historyApiFallback;
                if (v200) {
                    const v201 = options.contentBase;
                    const v204 = function (error, content, filePath) {
                        if (error) {
                            const v202 = notFound(response, filePath);
                            v202;
                        } else {
                            const v203 = found(response, filePath, content);
                            v203;
                        }
                    };
                    const v205 = readFileFromContentBase(v201, '/index.html', v204);
                    v205;
                } else {
                    const v206 = notFound(response, filePath);
                    v206;
                }
            }
        };
        const v208 = readFileFromContentBase(v177, urlPath, v207);
        v208;
    };
    const v209 = options.ssl;
    if (v209) {
        const v210 = options.ssl_key;
        const v211 = options.ssl_cert;
        const v212 = options.ssl_ciphers;
        const v213 = {
            key: v210,
            cert: v211,
            ciphers: v212
        };
        const v214 = https.createServer(v213, handler);
        const v215 = options.port;
        const v216 = v214.listen(v215);
        v216;
    } else {
        const v217 = http.createServer(handler);
        const v218 = options.port;
        const v219 = v217.listen(v218);
        v219;
    }
    const v220 = options.verbose;
    var running = v220 === false;
    const v240 = function ongenerate() {
        const v221 = !running;
        if (v221) {
            running = true;
            const v222 = options.ssl;
            let v223;
            if (v222) {
                v223 = 's';
            } else {
                v223 = '';
            }
            const v224 = 'http' + v223;
            const v225 = v224 + '://';
            const v226 = options.host;
            const v227 = v225 + v226;
            const v228 = v227 + ':';
            const v229 = options.port;
            var url = v228 + v229;
            const v230 = options.contentBase;
            const v236 = function (base) {
                const v231 = green(url);
                const v232 = v231 + ' -> ';
                const v233 = path.resolve(base);
                const v234 = v232 + v233;
                const v235 = console.log(v234);
                v235;
            };
            const v237 = v230.forEach(v236);
            v237;
            const v238 = options.open;
            if (v238) {
                const v239 = opener(url);
                v239;
            }
        }
    };
    const v241 = {};
    v241.name = 'server';
    v241.ongenerate = v240;
    return v241;
};
const readFileFromContentBase = function (contentBase, urlPath, callback) {
    const v242 = contentBase[0];
    const v243 = v242 || '.';
    const v244 = '.' + urlPath;
    var filePath = path.resolve(v243, v244);
    const v245 = urlPath.endsWith('/');
    if (v245) {
        filePath = path.resolve(filePath, 'index.html');
    }
    const v252 = function (error, content) {
        const v246 = contentBase.length;
        const v247 = v246 > 1;
        const v248 = error && v247;
        if (v248) {
            const v249 = contentBase.slice(1);
            const v250 = readFileFromContentBase(v249, urlPath, callback);
            v250;
        } else {
            const v251 = callback(error, content, filePath);
            v251;
        }
    };
    const v253 = fs.readFile(filePath, v252);
    v253;
};
const notFound = function (response, filePath) {
    const v254 = response.writeHead(404);
    v254;
    const v255 = '404 Not Found' + '\n\n';
    const v256 = v255 + filePath;
    const v257 = v256 + '\n\n(rollup-plugin-server)';
    const v258 = response.end(v257, 'utf-8');
    v258;
};
const found = function (response, filePath, content) {
    const v259 = mime.lookup(filePath);
    const v260 = { 'Content-Type': v259 };
    const v261 = response.writeHead(200, v260);
    v261;
    const v262 = response.end(content, 'utf-8');
    v262;
};
const green = function (text) {
    const v263 = '\x1B[1m\x1B[32m' + text;
    const v264 = v263 + '\x1B[39m\x1B[22m';
    return v264;
};
module.exports = server;