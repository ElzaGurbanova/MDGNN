const v175 = require('child_process');
var exec = v175.exec;
var fs = require('fs');
var path = require('path');
const v176 = fs.existsSync;
const v177 = path.existsSync;
var exists = v176 || v177;
var os = require('os');
var quote = JSON.stringify;
var cmd;
const which = function (name) {
    const v178 = process.env;
    const v179 = v178.PATH;
    var paths = v179.split(':');
    var loc;
    var i = 0;
    var len = paths.length;
    let v180 = i < len;
    while (v180) {
        const v182 = paths[i];
        loc = path.join(v182, name);
        const v183 = exists(loc);
        if (v183) {
            return loc;
        }
        const v181 = ++i;
        v180 = i < len;
    }
};
const v184 = os.type();
switch (v184) {
case 'Darwin':
    const v185 = which('terminal-notifier');
    if (v185) {
        const v186 = [];
        const v187 = {};
        v187.cmd = '-execute';
        v187.range = v186;
        cmd.type = 'Darwin-NotificationCenter';
        cmd.pkg = 'terminal-notifier';
        cmd.msg = '-message';
        cmd.title = '-title';
        cmd.subtitle = '-subtitle';
        cmd.icon = '-appIcon';
        cmd.sound = '-sound';
        cmd.url = '-open';
        cmd.priority = v187;
        cmd = {};
        cmd = {};
    } else {
        const v188 = -2;
        const v189 = -1;
        const v190 = [
            v188,
            v189,
            0,
            1,
            2,
            'Very Low',
            'Moderate',
            'Normal',
            'High',
            'Emergency'
        ];
        const v191 = {};
        v191.cmd = '--priority';
        v191.range = v190;
        cmd.type = 'Darwin-Growl';
        cmd.pkg = 'growlnotify';
        cmd.msg = '-m';
        cmd.sticky = '--sticky';
        cmd.priority = v191;
        cmd = {};
        cmd = {};
    }
    break;
case 'Linux':
    const v192 = which('growl');
    if (v192) {
        const v193 = {};
        v193.cmd = '-H';
        v193.hostname = '192.168.33.1';
        cmd.type = 'Linux-Growl';
        cmd.pkg = 'growl';
        cmd.msg = '-m';
        cmd.title = '-title';
        cmd.subtitle = '-subtitle';
        cmd.host = v193;
        cmd = {};
        cmd = {};
    } else {
        const v194 = [
            'low',
            'normal',
            'critical'
        ];
        const v195 = {};
        v195.cmd = '-u';
        v195.range = v194;
        cmd.type = 'Linux';
        cmd.pkg = 'notify-send';
        cmd.msg = '';
        cmd.sticky = '-t 0';
        cmd.icon = '-i';
        cmd.priority = v195;
        cmd = {};
        cmd = {};
    }
    break;
case 'Windows_NT':
    const v196 = -2;
    const v197 = -1;
    const v198 = [
        v196,
        v197,
        0,
        1,
        2
    ];
    const v199 = {};
    v199.cmd = '/p:';
    v199.range = v198;
    cmd.type = 'Windows';
    cmd.pkg = 'growlnotify';
    cmd.msg = '';
    cmd.sticky = '/s:true';
    cmd.title = '/t:';
    cmd.icon = '/i:';
    cmd.url = '/cu:';
    cmd.priority = v199;
    cmd = {};
    cmd = {};
    break;
}
module.exports = growl;
exports = module.exports;
exports.version = '1.4.1';
const growl = function (msg, options, fn) {
    var image;
    var args;
    const v200 = {};
    var options = options || v200;
    const v201 = function () {
    };
    var fn = fn || v201;
    const v202 = options.exec;
    if (v202) {
        const v203 = options.exec;
        const v204 = [];
        cmd.type = 'Custom';
        cmd.pkg = v203;
        cmd.range = v204;
        cmd = {};
        cmd = {};
    }
    const v205 = !cmd;
    if (v205) {
        const v206 = new Error('growl not supported on this platform');
        const v207 = fn(v206);
        return v207;
    }
    const v208 = cmd.pkg;
    args = [v208];
    if (image = options.image) {
        const v209 = cmd.type;
        switch (v209) {
        case 'Darwin-Growl':
            var flag;
            const v210 = path.extname(image);
            var ext = v210.substr(1);
            const v211 = ext == 'icns';
            const v212 = v211 && 'iconpath';
            flag = flag || v212;
            const v213 = /^[A-Z]/.test(image);
            const v214 = v213 && 'appIcon';
            flag = flag || v214;
            const v215 = /^png|gif|jpe?g$/.test(ext);
            const v216 = v215 && 'image';
            flag = flag || v216;
            const v217 = ext && (image = ext);
            const v218 = v217 && 'icon';
            flag = flag || v218;
            flag = flag || 'icon';
            const v219 = '--' + flag;
            const v220 = quote(image);
            const v221 = args.push(v219, v220);
            v221;
            break;
        case 'Darwin-NotificationCenter':
            const v222 = cmd.icon;
            const v223 = quote(image);
            const v224 = args.push(v222, v223);
            v224;
            break;
        case 'Linux':
            const v225 = cmd.icon;
            const v226 = quote(image);
            const v227 = args.push(v225, v226);
            v227;
            const v228 = options.sticky;
            const v229 = !v228;
            if (v229) {
                const v230 = args.push('--hint=int:transient:1');
                v230;
            }
            break;
        case 'Windows':
            const v231 = cmd.icon;
            const v232 = quote(image);
            const v233 = v231 + v232;
            const v234 = args.push(v233);
            v234;
            break;
        }
    }
    const v235 = options.sticky;
    if (v235) {
        const v236 = cmd.sticky;
        const v237 = args.push(v236);
        v237;
    }
    const v238 = options.priority;
    if (v238) {
        const v239 = options.priority;
        var priority = v239 + '';
        const v240 = cmd.priority;
        const v241 = v240.range;
        var checkindexOf = v241.indexOf(priority);
        const v242 = cmd.priority;
        const v243 = v242.range;
        const v244 = v243.indexOf(priority);
        const v245 = ~v244;
        if (v245) {
            const v246 = cmd.priority;
            const v247 = options.priority;
            const v248 = args.push(v246, v247);
            v248;
        }
    }
    const v249 = options.sound;
    const v250 = cmd.type;
    const v251 = v250 === 'Darwin-NotificationCenter';
    const v252 = v249 && v251;
    if (v252) {
        const v253 = cmd.sound;
        const v254 = options.sound;
        const v255 = args.push(v253, v254);
        v255;
    }
    const v256 = options.name;
    const v257 = cmd.type;
    const v258 = v257 === 'Darwin-Growl';
    const v259 = v256 && v258;
    if (v259) {
        const v260 = options.name;
        const v261 = args.push('--name', v260);
        v261;
    }
    const v262 = cmd.type;
    switch (v262) {
    case 'Darwin-Growl':
        const v263 = cmd.msg;
        const v264 = args.push(v263);
        v264;
        const v265 = quote(msg);
        const v266 = v265.replace(/\\n/g, '\n');
        const v267 = args.push(v266);
        v267;
        const v268 = options.title;
        if (v268) {
            const v269 = options.title;
            const v270 = quote(v269);
            const v271 = args.push(v270);
            v271;
        }
        break;
    case 'Darwin-NotificationCenter':
        const v272 = cmd.msg;
        const v273 = args.push(v272);
        v273;
        var stringifiedMsg = quote(msg);
        var escapedMsg = stringifiedMsg.replace(/\\n/g, '\n');
        const v274 = args.push(escapedMsg);
        v274;
        const v275 = options.title;
        if (v275) {
            const v276 = cmd.title;
            const v277 = args.push(v276);
            v277;
            const v278 = options.title;
            const v279 = quote(v278);
            const v280 = args.push(v279);
            v280;
        }
        const v281 = options.subtitle;
        if (v281) {
            const v282 = cmd.subtitle;
            const v283 = args.push(v282);
            v283;
            const v284 = options.subtitle;
            const v285 = quote(v284);
            const v286 = args.push(v285);
            v286;
        }
        const v287 = options.url;
        if (v287) {
            const v288 = cmd.url;
            const v289 = args.push(v288);
            v289;
            const v290 = options.url;
            const v291 = quote(v290);
            const v292 = args.push(v291);
            v292;
        }
        break;
    case 'Linux-Growl':
        const v293 = cmd.msg;
        const v294 = args.push(v293);
        v294;
        const v295 = quote(msg);
        const v296 = v295.replace(/\\n/g, '\n');
        const v297 = args.push(v296);
        v297;
        const v298 = options.title;
        if (v298) {
            const v299 = options.title;
            const v300 = quote(v299);
            const v301 = args.push(v300);
            v301;
        }
        const v302 = cmd.host;
        if (v302) {
            const v303 = cmd.host;
            const v304 = v303.cmd;
            const v305 = cmd.host;
            const v306 = v305.hostname;
            const v307 = args.push(v304, v306);
            v307;
        }
        break;
    case 'Linux':
        const v308 = options.title;
        if (v308) {
            const v309 = options.title;
            const v310 = quote(v309);
            const v311 = args.push(v310);
            v311;
            const v312 = cmd.msg;
            const v313 = args.push(v312);
            v313;
            const v314 = quote(msg);
            const v315 = v314.replace(/\\n/g, '\n');
            const v316 = args.push(v315);
            v316;
        } else {
            const v317 = quote(msg);
            const v318 = v317.replace(/\\n/g, '\n');
            const v319 = args.push(v318);
            v319;
        }
        break;
    case 'Windows':
        const v320 = quote(msg);
        const v321 = v320.replace(/\\n/g, '\n');
        const v322 = args.push(v321);
        v322;
        const v323 = options.title;
        if (v323) {
            const v324 = cmd.title;
            const v325 = options.title;
            const v326 = quote(v325);
            const v327 = v324 + v326;
            const v328 = args.push(v327);
            v328;
        }
        const v329 = options.url;
        if (v329) {
            const v330 = cmd.url;
            const v331 = options.url;
            const v332 = quote(v331);
            const v333 = v330 + v332;
            const v334 = args.push(v333);
            v334;
        }
        break;
    case 'Custom':
        const v344 = function (origCommand) {
            let message;
            const v335 = options.title;
            const v336 = options.title;
            const v337 = v336 + ': ';
            const v338 = v337 + msg;
            if (v335) {
                message = v338;
            } else {
                message = msg;
            }
            const v339 = quote(message);
            const v340 = '$1' + v339;
            var command = origCommand.replace(/(^|[^%])%s/g, v340);
            const v341 = command === origCommand;
            if (v341) {
                const v342 = quote(message);
                const v343 = args.push(v342);
                v343;
            }
            return command;
        };
        const v345 = args[0];
        const v346 = v344(v345);
        args[0] = v346;
        break;
    }
    const v347 = args.join(' ');
    const v348 = exec(v347, fn);
    v348;
};
;