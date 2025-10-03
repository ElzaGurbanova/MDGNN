var crypto = require('crypto');
var request = require('request');
var config = require('../../config');
var db = require('./db');
var wxSign = require('./lib/wxsign');
var tss = require('./lib/tss');
var url = require('url');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
const v206 = {};
module.exports = v206;
var wx = module.exports;
const v208 = function (url, cb) {
    const v207 = reqShortUrl(url, cb);
    v207;
};
wx.getShortUrl = v208;
const v210 = function (type, offset, cb) {
    const v209 = reqMaterialList(type, offset, cb);
    v209;
};
wx.getMaterialList = v210;
const v212 = function (type, buf, cb) {
    const v211 = reqPostMaterial(type, buf, cb);
    v211;
};
wx.postMaterial = v212;
const v214 = function (mediaid, cb) {
    const v213 = reqMaterial(mediaid, cb);
    v213;
};
wx.getMaterial = v214;
const v216 = function (mediaid, cb) {
    const v215 = reqMedia(mediaid, cb);
    v215;
};
wx.getMedia = v216;
const v234 = function (req, cb) {
    const v217 = req.get('referer');
    var referer = v217 || '';
    const v218 = url.parse(referer);
    var refhost = v218.hostname;
    const v219 = config.wxm;
    const v220 = v219.trustedhosts;
    const v222 = function (host) {
        const v221 = isOf(host, refhost);
        return v221;
    };
    const v223 = _.any(v220, v222);
    const v224 = !v223;
    if (v224) {
        const v225 = new Error('host not trusted');
        const v226 = cb(v225);
        return v226;
    }
    const v232 = function (e, d) {
        if (e) {
            const v227 = cb(e);
            return v227;
        }
        const v228 = d.jsapi_ticket;
        var sign = wxSign(v228, referer);
        const v229 = config.wxm;
        const v230 = v229.appid;
        sign.appId = v230;
        const v231 = cb(null, sign);
        v231;
    };
    const v233 = wx.getJsApiTicket(v232);
    v233;
};
wx.getJsApiSign = v234;
const v252 = function (cb) {
    var dbJsApiTicket = db('jsapi_ticket');
    var item = dbJsApiTicket.first();
    const v235 = item.deadline;
    const v236 = tss();
    const v237 = v235 - v236;
    const v238 = v237 > 60;
    const v239 = item && v238;
    if (v239) {
        const v240 = cb(null, item);
        return v240;
    }
    const v250 = function (e, d) {
        if (e) {
            const v241 = cb(e);
            return v241;
        }
        const v242 = d.ticket;
        const v243 = d.expires_in;
        const v244 = tss();
        const v245 = v243 + v244;
        item.jsapi_ticket = v242;
        item.deadline = v245;
        item = {};
        item = {};
        const v246 = dbJsApiTicket.remove();
        v246;
        const v247 = dbJsApiTicket.push(item);
        v247;
        const v248 = db.save();
        v248;
        const v249 = cb(null, item);
        v249;
    };
    const v251 = reqJsApiTicket(v250);
    v251;
};
wx.getJsApiTicket = v252;
const v270 = function (cb) {
    var dbAccessToken = db('access_token');
    var item = dbAccessToken.first();
    const v253 = item.deadline;
    const v254 = tss();
    const v255 = v253 - v254;
    const v256 = v255 > 60;
    const v257 = item && v256;
    if (v257) {
        const v258 = cb(null, item);
        return v258;
    }
    const v268 = function (e, d) {
        if (e) {
            const v259 = cb(e);
            return v259;
        }
        const v260 = d.access_token;
        const v261 = d.expires_in;
        const v262 = tss();
        const v263 = v261 + v262;
        item.access_token = v260;
        item.deadline = v263;
        item = {};
        item = {};
        const v264 = dbAccessToken.remove();
        v264;
        const v265 = dbAccessToken.push(item);
        v265;
        const v266 = db.save();
        v266;
        const v267 = cb(null, item);
        v267;
    };
    const v269 = reqAccessToken(v268);
    v269;
};
wx.getAccessToken = v270;
const reqShortUrl = function (longurl, cb) {
    const v288 = function (e, d) {
        if (e) {
            const v271 = cb(e);
            return v271;
        }
        const v272 = 'https://api.weixin.qq.com/cgi-bin/shorturl' + '?access_token=';
        const v273 = d.access_token;
        var requrl = v272 + v273;
        const v274 = {
            action: 'long2short',
            long_url: longurl
        };
        const v275 = JSON.stringify(v274);
        const v276 = {
            method: 'POST',
            url: requrl,
            form: v275,
            json: true
        };
        const v286 = function (e, r, d) {
            if (e) {
                const v277 = cb(e);
                return v277;
            }
            const v278 = d.errcode;
            if (v278) {
                const v279 = d.errcode;
                const v280 = v279 + ': ';
                const v281 = d.errmsg;
                const v282 = v280 + v281;
                const v283 = new Error(v282);
                const v284 = cb(v283);
                return v284;
            }
            const v285 = cb(null, d);
            v285;
        };
        const v287 = request(v276, v286);
        v287;
    };
    const v289 = wx.getAccessToken(v288);
    v289;
};
const reqPostMaterial = function (type, file, cb) {
    const v309 = function (e, d) {
        if (e) {
            const v290 = cb(e);
            return v290;
        }
        const v291 = 'https://api.weixin.qq.com/cgi-bin/material/add_material' + '?access_token=';
        const v292 = d.access_token;
        var url = v291 + v292;
        const v293 = 'curl "' + url;
        const v294 = v293 + '" -F media=@"';
        const v295 = v294 + file;
        const v296 = v295 + '"';
        const v307 = function (e, sout, serr) {
            if (e) {
                const v297 = cb(e);
                return v297;
            }
            try {
                var d = JSON.parse(sout);
            } catch (e) {
                const v298 = cb(e);
                return v298;
            }
            const v299 = d.errcode;
            if (v299) {
                const v300 = d.errcode;
                const v301 = v300 + ': ';
                const v302 = d.errmsg;
                const v303 = v301 + v302;
                const v304 = new Error(v303);
                const v305 = cb(v304);
                return v305;
            }
            const v306 = cb(null, d);
            v306;
        };
        const v308 = cp.exec(v296, v307);
        v308;
    };
    const v310 = wx.getAccessToken(v309);
    v310;
};
const reqMaterial = function (mediaid, cb) {
    const v325 = function (e, d) {
        if (e) {
            const v311 = cb(e);
            return v311;
        }
        const v312 = 'https://api.weixin.qq.com/cgi-bin/material/get_material' + '?access_token=';
        const v313 = d.access_token;
        var url = v312 + v313;
        const v314 = { media_id: mediaid };
        const v315 = JSON.stringify(v314);
        const v316 = {
            method: 'POST',
            url: url,
            form: v315,
            encoding: null
        };
        const v323 = function (e, r, b) {
            if (e) {
                const v317 = cb(e);
                return v317;
            }
            const v318 = r.statusCode;
            const v319 = v318 >= 400;
            if (v319) {
                const v320 = new Error('4xx or 5xx');
                const v321 = cb(v320);
                return v321;
            }
            const v322 = cb(null, b);
            v322;
        };
        const v324 = request(v316, v323);
        v324;
    };
    const v326 = wx.getAccessToken(v325);
    v326;
};
const reqMedia = function (mediaid, cb) {
    const v341 = function (e, d) {
        if (e) {
            const v327 = cb(e);
            return v327;
        }
        const v328 = 'https://api.weixin.qq.com/cgi-bin/media/get' + '?access_token=';
        const v329 = d.access_token;
        const v330 = v328 + v329;
        const v331 = v330 + '&media_id=';
        var url = v331 + mediaid;
        const v332 = {
            url: url,
            encoding: null
        };
        const v339 = function (e, r, b) {
            if (e) {
                const v333 = cb(e);
                return v333;
            }
            const v334 = r.statusCode;
            const v335 = v334 >= 400;
            if (v335) {
                const v336 = new Error('4xx or 5xx');
                const v337 = cb(v336);
                return v337;
            }
            const v338 = cb(null, b);
            v338;
        };
        const v340 = request(v332, v339);
        v340;
    };
    const v342 = wx.getAccessToken(v341);
    v342;
};
const reqMaterialList = function (type, offset, cb) {
    const v360 = function (e, d) {
        if (e) {
            const v343 = cb(e);
            return v343;
        }
        const v344 = 'https://api.weixin.qq.com/cgi-bin/material/batchget_material' + '?access_token=';
        const v345 = d.access_token;
        var url = v344 + v345;
        const v346 = {
            type: type,
            offset: offset,
            count: 20
        };
        const v347 = JSON.stringify(v346);
        const v348 = {
            method: 'POST',
            url: url,
            form: v347,
            json: true
        };
        const v358 = function (e, r, d) {
            if (e) {
                const v349 = cb(e);
                return v349;
            }
            const v350 = d.errcode;
            if (v350) {
                const v351 = d.errcode;
                const v352 = v351 + ': ';
                const v353 = d.errmsg;
                const v354 = v352 + v353;
                const v355 = new Error(v354);
                const v356 = cb(v355);
                return v356;
            }
            const v357 = cb(null, d);
            v357;
        };
        const v359 = request(v348, v358);
        v359;
    };
    const v361 = wx.getAccessToken(v360);
    v361;
};
const reqJsApiTicket = function (cb) {
    const v378 = function (e, d) {
        if (e) {
            const v362 = cb(e);
            return v362;
        }
        const v363 = 'https://api.weixin.qq.com/cgi-bin/ticket' + '/getticket?access_token=';
        const v364 = d.access_token;
        const v365 = v363 + v364;
        var reqJsApiTicketUrl = v365 + '&type=jsapi';
        const v366 = {
            url: reqJsApiTicketUrl,
            json: true
        };
        const v376 = function (e, r, d) {
            if (e) {
                const v367 = cb(e);
                return v367;
            }
            const v368 = d.errcode;
            if (v368) {
                const v369 = d.errcode;
                const v370 = v369 + ': ';
                const v371 = d.errmsg;
                const v372 = v370 + v371;
                const v373 = new Error(v372);
                const v374 = cb(v373);
                return v374;
            }
            const v375 = cb(null, d);
            v375;
        };
        const v377 = request(v366, v376);
        v377;
    };
    const v379 = wx.getAccessToken(v378);
    v379;
};
const reqAccessToken = function (cb) {
    const v380 = 'https://api.weixin.qq.com/cgi-bin/token' + '?grant_type=client_credential&appid=';
    const v381 = config.wxm;
    const v382 = v381.appid;
    const v383 = v380 + v382;
    const v384 = v383 + '&secret=';
    const v385 = config.wxm;
    const v386 = v385.appsecret;
    var reqAccessTokenUrl = v384 + v386;
    const v387 = {
        url: reqAccessTokenUrl,
        json: true
    };
    const v397 = function (e, r, d) {
        if (e) {
            const v388 = cb(e);
            return v388;
        }
        const v389 = d.errcode;
        if (v389) {
            const v390 = d.errcode;
            const v391 = v390 + ': ';
            const v392 = d.errmsg;
            const v393 = v391 + v392;
            const v394 = new Error(v393);
            const v395 = cb(v394);
            return v395;
        }
        const v396 = cb(null, d);
        v396;
    };
    const v398 = request(v387, v397);
    v398;
};
const isOf = function (sub, str) {
    var i = str.indexOf(sub);
    const v399 = str.length;
    const v400 = sub.length;
    const v401 = v399 - v400;
    const v402 = i === v401;
    const v403 = i - 1;
    const v404 = str[v403];
    const v405 = v404 == null;
    const v406 = i - 1;
    const v407 = str[v406];
    const v408 = v407 === '.';
    const v409 = v405 || v408;
    const v410 = v402 && v409;
    return v410;
};