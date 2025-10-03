const v156 = require('child_process');
var spawn = v156.spawn;
var fs = require('fs');
var path = require('path');
const v157 = fs.existsSync;
const v158 = path.existsSync;
var exists = v157 || v158;
var os = require('os');
var cmd;
const which = function (name) {
    const v159 = process.env;
    const v160 = v159.PATH;
    var paths = v160.split(':');
    var loc;
    var i = 0;
    var len = paths.length;
    let v161 = i < len;
    while (v161) {
        const v163 = paths[i];
        loc = path.join(v163, name);
        const v164 = exists(loc);
        if (v164) {
            return loc;
        }
        const v162 = ++i;
        v161 = i < len;
    }
};
const v165 = os.type();
switch (v165) {
case 'Darwin':
    const v166 = which('terminal-notifier');
    if (v166) {
        const v167 = [];
        const v168 = {};
        v168.cmd = '-execute';
        v168.range = v167;
        cmd.type = 'Darwin-NotificationCenter';
        cmd.pkg = 'terminal-notifier';
        cmd.msg = '-message';
        cmd.title = '-title';
        cmd.subtitle = '-subtitle';
        cmd.icon = '-appIcon';
        cmd.sound = '-sound';
        cmd.url = '-open';
        cmd.priority = v168;
        cmd = {};
        cmd = {};
    } else {
        const v169 = -2;
        const v170 = -1;
        const v171 = [
            v169,
            v170,
            0,
            1,
            2,
            'Very Low',
            'Moderate',
            'Normal',
            'High',
            'Emergency'
        ];
        const v172 = {};
        v172.cmd = '--priority';
        v172.range = v171;
        cmd.type = 'Darwin-Growl';
        cmd.pkg = 'growlnotify';
        cmd.msg = '-m';
        cmd.sticky = '--sticky';
        cmd.priority = v172;
        cmd = {};
        cmd = {};
    }
    break;
case 'Linux':
    const v173 = which('growl');
    if (v173) {
        const v174 = {};
        v174.cmd = '-H';
        v174.hostname = '192.168.33.1';
        cmd.type = 'Linux-Growl';
        cmd.pkg = 'growl';
        cmd.msg = '-m';
        cmd.title = '-title';
        cmd.subtitle = '-subtitle';
        cmd.host = v174;
        cmd = {};
        cmd = {};
    } else {
        const v175 = [
            'low',
            'normal',
            'critical'
        ];
        const v176 = {};
        v176.cmd = '-u';
        v176.range = v175;
        cmd.type = 'Linux';
        cmd.pkg = 'notify-send';
        cmd.msg = '';
        cmd.sticky = '-t 0';
        cmd.icon = '-i';
        cmd.priority = v176;
        cmd = {};
        cmd = {};
    }
    break;
case 'Windows_NT':
    const v177 = -2;
    const v178 = -1;
    const v179 = [
        v177,
        v178,
        0,
        1,
        2
    ];
    const v180 = {};
    v180.cmd = '/p:';
    v180.range = v179;
    cmd.type = 'Windows';
    cmd.pkg = 'growlnotify';
    cmd.msg = '';
    cmd.sticky = '/s:true';
    cmd.title = '/t:';
    cmd.icon = '/i:';
    cmd.url = '/cu:';
    cmd.priority = v180;
    cmd = {};
    cmd = {};
    break;
}
module.exports = growl;
exports = module.exports;
exports.version = '1.9.3';
const growl = function (msg, options, fn) {
    var image;
    var args;
    const v181 = {};
    var options = options || v181;
    const v182 = function () {
    };
    var fn = fn || v182;
    const v183 = options.exec;
    if (v183) {
        const v184 = options.exec;
        const v185 = [];
        cmd.type = 'Custom';
        cmd.pkg = v184;
        cmd.range = v185;
        cmd = {};
        cmd = {};
    }
    const v186 = !cmd;
    if (v186) {
        const v187 = new Error('growl not supported on this platform');
        const v188 = fn(v187);
        return v188;
    }
    const v189 = cmd.pkg;
    args = [v189];
    if (image = options.image) {
        const v190 = cmd.type;
        switch (v190) {
        case 'Darwin-Growl':
            var flag;
            const v191 = path.extname(image);
            var ext = v191.substr(1);
            const v192 = ext == 'icns';
            const v193 = v192 && 'iconpath';
            flag = flag || v193;
            const v194 = /^[A-Z]/.test(image);
            const v195 = v194 && 'appIcon';
            flag = flag || v195;
            const v196 = /^png|gif|jpe?g$/.test(ext);
            const v197 = v196 && 'image';
            flag = flag || v197;
            const v198 = ext && (image = ext);
            const v199 = v198 && 'icon';
            flag = flag || v199;
            flag = flag || 'icon';
            const v200 = '--' + flag;
            const v201 = args.push(v200, image);
            v201;
            break;
        case 'Darwin-NotificationCenter':
            const v202 = cmd.icon;
            const v203 = args.push(v202, image);
            v203;
            break;
        case 'Linux':
            const v204 = cmd.icon;
            const v205 = args.push(v204, image);
            v205;
            const v206 = options.sticky;
            const v207 = !v206;
            if (v207) {
                const v208 = args.push('--hint=int:transient:1');
                v208;
            }
            break;
        case 'Windows':
            const v209 = cmd.icon;
            const v210 = v209 + image;
            const v211 = args.push(v210);
            v211;
            break;
        }
    }
    const v212 = options.sticky;
    if (v212) {
        const v213 = cmd.sticky;
        const v214 = args.push(v213);
        v214;
    }
    const v215 = options.priority;
    if (v215) {
        const v216 = options.priority;
        var priority = v216 + '';
        const v217 = cmd.priority;
        const v218 = v217.range;
        var checkindexOf = v218.indexOf(priority);
        const v219 = cmd.priority;
        const v220 = v219.range;
        const v221 = v220.indexOf(priority);
        const v222 = ~v221;
        if (v222) {
            const v223 = cmd.priority;
            const v224 = options.priority;
            const v225 = args.push(v223, v224);
            v225;
        }
    }
    const v226 = options.sound;
    const v227 = cmd.type;
    const v228 = v227 === 'Darwin-NotificationCenter';
    const v229 = v226 && v228;
    if (v229) {
        const v230 = cmd.sound;
        const v231 = options.sound;
        const v232 = args.push(v230, v231);
        v232;
    }
    const v233 = options.name;
    const v234 = cmd.type;
    const v235 = v234 === 'Darwin-Growl';
    const v236 = v233 && v235;
    if (v236) {
        const v237 = options.name;
        const v238 = args.push('--name', v237);
        v238;
    }
    const v239 = cmd.type;
    switch (v239) {
    case 'Darwin-Growl':
        const v240 = cmd.msg;
        const v241 = args.push(v240);
        v241;
        const v242 = msg.replace(/\\n/g, '\n');
        const v243 = args.push(v242);
        v243;
        const v244 = options.title;
        if (v244) {
            const v245 = options.title;
            const v246 = args.push(v245);
            v246;
        }
        break;
    case 'Darwin-NotificationCenter':
        const v247 = cmd.msg;
        const v248 = args.push(v247);
        v248;
        var stringifiedMsg = msg;
        var escapedMsg = stringifiedMsg.replace(/\\n/g, '\n');
        const v249 = args.push(escapedMsg);
        v249;
        const v250 = options.title;
        if (v250) {
            const v251 = cmd.title;
            const v252 = args.push(v251);
            v252;
            const v253 = options.title;
            const v254 = args.push(v253);
            v254;
        }
        const v255 = options.subtitle;
        if (v255) {
            const v256 = cmd.subtitle;
            const v257 = args.push(v256);
            v257;
            const v258 = options.subtitle;
            const v259 = args.push(v258);
            v259;
        }
        const v260 = options.url;
        if (v260) {
            const v261 = cmd.url;
            const v262 = args.push(v261);
            v262;
            const v263 = options.url;
            const v264 = args.push(v263);
            v264;
        }
        break;
    case 'Linux-Growl':
        const v265 = cmd.msg;
        const v266 = args.push(v265);
        v266;
        const v267 = msg.replace(/\\n/g, '\n');
        const v268 = args.push(v267);
        v268;
        const v269 = options.title;
        if (v269) {
            const v270 = options.title;
            const v271 = args.push(v270);
            v271;
        }
        const v272 = cmd.host;
        if (v272) {
            const v273 = cmd.host;
            const v274 = v273.cmd;
            const v275 = cmd.host;
            const v276 = v275.hostname;
            const v277 = args.push(v274, v276);
            v277;
        }
        break;
    case 'Linux':
        const v278 = options.title;
        if (v278) {
            const v279 = options.title;
            const v280 = args.push(v279);
            v280;
            const v281 = cmd.msg;
            const v282 = args.push(v281);
            v282;
            const v283 = msg.replace(/\\n/g, '\n');
            const v284 = args.push(v283);
            v284;
        } else {
            const v285 = msg.replace(/\\n/g, '\n');
            const v286 = args.push(v285);
            v286;
        }
        break;
    case 'Windows':
        const v287 = msg.replace(/\\n/g, '\n');
        const v288 = args.push(v287);
        v288;
        const v289 = options.title;
        if (v289) {
            const v290 = cmd.title;
            const v291 = options.title;
            const v292 = v290 + v291;
            const v293 = args.push(v292);
            v293;
        }
        const v294 = options.url;
        if (v294) {
            const v295 = cmd.url;
            const v296 = options.url;
            const v297 = v295 + v296;
            const v298 = args.push(v297);
            v298;
        }
        break;
    case 'Custom':
        const v306 = function (origCommand) {
            let message;
            const v299 = options.title;
            const v300 = options.title;
            const v301 = v300 + ': ';
            const v302 = v301 + msg;
            if (v299) {
                message = v302;
            } else {
                message = msg;
            }
            const v303 = '$1' + message;
            var command = origCommand.replace(/(^|[^%])%s/g, v303);
            const v304 = command === origCommand;
            if (v304) {
                const v305 = args.push(message);
                v305;
            }
            return command;
        };
        const v307 = args[0];
        const v308 = v306(v307);
        args[0] = v308;
        break;
    }
    var cmd_to_exec = args[0];
    const v309 = args.shift();
    v309;
    const v310 = spawn(cmd_to_exec, args);
    v310;
};
;