const v175 = require('child_process');
var spawn = v175.spawn;
const v176 = require('child_process');
var exec = v176.execSync;
const v177 = require('events');
var eventEmitter = v177.EventEmitter;
var _ = require('lodash');
var commandModule = require('./_commands');
var controlModule = require('./_controls');
var playlistModule = require('./_playlist');
var audioModule = require('./_audio');
var videoModule = require('./_video');
var subtitleModule = require('./_subtitle');
var socket = require('../ipcInterface');
const mpv = function (options, mpv_args) {
    const v178 = eventEmitter.call(this);
    v178;
    var ipcCommand = '';
    const v179 = options.ipc_command;
    if (v179) {
        const v180 = options.ipc_command;
        const v181 = v180 == '--input-ipc-server';
        const v182 = options.ipc_command;
        const v183 = v182 == '--input-unix-socket';
        const v184 = v181 || v183;
        const v185 = !v184;
        if (v185) {
            const v186 = console.log('Warning: ipcCommand was neither "--input-unix-socket" nor "--input-ipc-server"');
            v186;
        }
        ipcCommand = options.ipc_command;
    } else {
        const v187 = options.binary;
        const v188 = options.binary;
        const v189 = v188 + ' --version';
        let v190;
        if (v187) {
            v190 = v189;
        } else {
            v190 = 'mpv --version';
        }
        const v191 = { encoding: 'utf8' };
        var output = exec(v190, v191);
        const v192 = output.match(/UNKNOWN/);
        const v193 = v192 == null;
        if (v193) {
            const v194 = output.match(/\d\.*\.*/);
            var start = v194.index;
            const v195 = output.match(/\(C\)/);
            var end = v195.index;
            const v196 = output.substr(start, end);
            const v197 = v196.split('.');
            const v198 = v197[1];
            var versionNumber = parseInt(v198);
            const v199 = isNaN(versionNumber);
            if (v199) {
                ipcCommand = '--input-unix-socket';
            } else {
                const v200 = versionNumber >= 17;
                if (v200) {
                    ipcCommand = '--input-ipc-server';
                } else {
                    ipcCommand = '--input-unix-socket';
                }
            }
        } else {
            ipcCommand = '--input-ipc-server';
        }
    }
    const v201 = {};
    v201['debug'] = false;
    v201['verbose'] = false;
    v201['socket'] = '/tmp/node-mpv.sock';
    v201['audio_only'] = false;
    v201['time_update'] = 1;
    v201['binary'] = null;
    this.options = v201;
    const v202 = {};
    const v203 = options || v202;
    const v204 = this.options;
    const v205 = _.defaults(v203, v204);
    this.options = v205;
    const v206 = {};
    v206['mute'] = false;
    v206['pause'] = false;
    v206['duration'] = null;
    v206['volume'] = 100;
    v206['filename'] = null;
    v206['path'] = null;
    v206['media-title'] = null;
    v206['playlist-pos'] = null;
    v206['playlist-count'] = null;
    v206['loop'] = 'no';
    this.observed = v206;
    var observedVideo = {};
    observedVideo['fullscreen'] = false;
    observedVideo['sub-visibility'] = false;
    const v207 = {};
    this.observedIDs = v207;
    var currentTimePos = null;
    const v208 = ipcCommand + '=';
    const v209 = this.options;
    const v210 = v209.socket;
    const v211 = v208 + v210;
    var defaultArgs = [
        v211,
        '--idle',
        '--quiet'
    ];
    const v212 = this.options;
    const v213 = v212.audio_only;
    if (v213) {
        const v214 = [
            '--no-video',
            '--no-audio-display'
        ];
        defaultArgs = _.concat(defaultArgs, v214);
    } else {
        const v215 = this.observed;
        const v216 = _.merge(v215, observedVideo);
        v216;
    }
    if (mpv_args) {
        defaultArgs = _.union(defaultArgs, mpv_args);
    }
    const v217 = options.binary;
    if (v217) {
        const v218 = options.binary;
        const v219 = spawn(v218, defaultArgs);
        this.mpvPlayer = v219;
    } else {
        const v220 = spawn('mpv', defaultArgs);
        this.mpvPlayer = v220;
    }
    const v221 = this.options;
    this.socket = new ipcInterface(v221);
    const v222 = this.socket;
    const v223 = [
        0,
        'time-pos'
    ];
    const v224 = v222.command('observe_property', v223);
    v224;
    const v234 = function () {
        const v225 = this.observed;
        const v226 = v225.filename;
        const v227 = this.observed;
        const v228 = v227.pause;
        const v229 = !v228;
        const v230 = v226 && v229;
        const v231 = currentTimePos != null;
        const v232 = v230 && v231;
        if (v232) {
            const v233 = this.emit('timeposition', currentTimePos);
            v233;
        }
    };
    const v235 = v234.bind(this);
    const v236 = this.options;
    const v237 = v236.time_update;
    const v238 = v237 * 1000;
    const v239 = setInterval(v235, v238);
    v239;
    const v249 = function () {
        var id = 1;
        const v240 = this.observed;
        const v241 = Object.keys(v240);
        const v246 = function (property) {
            const v242 = this.observed;
            const v243 = v242.hasOwnProperty(property);
            if (v243) {
                const v244 = this.observeProperty(property, id);
                v244;
                const v245 = this.observedIDs;
                v245[id] = property;
                id += 1;
            }
        };
        const v247 = v246.bind(this);
        const v248 = v241.forEach(v247);
        v248;
    };
    var observeProperties = v249.bind(this);
    const v250 = observeProperties();
    v250;
    const v251 = this.mpvPlayer;
    const v266 = function () {
        const v252 = this.options;
        const v253 = v252.debug;
        if (v253) {
            const v254 = console.log('MPV Player seems to have died. Restarting...');
            v254;
        }
        const v255 = options.binary;
        if (v255) {
            const v256 = options.binary;
            const v257 = spawn(v256, defaultArgs);
            this.mpvPlayer = v257;
        } else {
            const v258 = spawn('mpv', defaultArgs);
            this.mpvPlayer = v258;
        }
        currentTimePos = null;
        const v263 = function () {
            const v259 = observeProperties();
            v259;
            const v260 = this.socket;
            const v261 = [
                0,
                'time-pos'
            ];
            const v262 = v260.command('observe_property', v261);
            v262;
        };
        const v264 = v263.bind(this);
        const v265 = setTimeout(v264, 1000);
        v265;
    };
    const v267 = v266.bind(this);
    const v268 = v251.on('close', v267);
    v268;
    const v269 = this.mpvPlayer;
    const v273 = function (error) {
        const v270 = this.options;
        const v271 = v270.debug;
        if (v271) {
            const v272 = console.log(error);
            v272;
        }
    };
    const v274 = v273.bind(this);
    const v275 = v269.on('error', v274);
    v275;
    const v276 = this.socket;
    const v335 = function (data) {
        const v277 = data.hasOwnProperty('event');
        if (v277) {
            const v278 = this.options;
            const v279 = v278.verbose;
            if (v279) {
                const v280 = data.hasOwnProperty('event');
                if (v280) {
                    const v281 = data.event;
                    const v282 = v281 === 'property-change';
                    const v283 = !v282;
                    if (v283) {
                        const v284 = JSON.stringify(data);
                        const v285 = 'Message received: ' + v284;
                        const v286 = console.log(v285);
                        v286;
                    }
                } else {
                    const v287 = JSON.stringify(data);
                    const v288 = 'Message received: ' + v287;
                    const v289 = console.log(v288);
                    v289;
                }
            }
            const v290 = data.event;
            switch (v290) {
            case 'idle':
                const v291 = this.options;
                const v292 = v291.verbose;
                if (v292) {
                    const v293 = console.log('Event: stopped');
                    v293;
                }
                ;
                const v294 = this.emit('stopped');
                v294;
                break;
            case 'playback-restart':
                const v295 = this.options;
                const v296 = v295.verbose;
                if (v296) {
                    const v297 = console.log('Event: start');
                    v297;
                }
                ;
                const v298 = this.emit('started');
                v298;
                break;
            case 'pause':
                const v299 = this.options;
                const v300 = v299.verbose;
                if (v300) {
                    const v301 = console.log('Event: pause');
                    v301;
                }
                ;
                const v302 = this.emit('paused');
                v302;
                break;
            case 'unpause':
                const v303 = this.options;
                const v304 = v303.verbose;
                if (v304) {
                    const v305 = console.log('Event: unpause');
                    v305;
                }
                ;
                const v306 = this.emit('resumed');
                v306;
                break;
            case 'property-change':
                const v307 = data.name;
                const v308 = v307 === 'time-pos';
                if (v308) {
                    currentTimePos = data.data;
                    break;
                } else {
                    const v309 = this.observed;
                    const v310 = data.name;
                    const v311 = data.data;
                    v309[v310] = v311;
                    const v312 = this.observed;
                    const v313 = this.emit('statuschange', v312);
                    v313;
                    const v314 = this.options;
                    const v315 = v314.verbose;
                    if (v315) {
                        const v316 = console.log('Event: statuschange');
                        v316;
                        const v317 = data.name;
                        const v318 = 'Property change: ' + v317;
                        const v319 = v318 + ' - ';
                        const v320 = data.data;
                        const v321 = v319 + v320;
                        const v322 = console.log(v321);
                        v322;
                    }
                    break;
                }
            default:
            }
        } else {
            const v323 = data.hasOwnProperty('request_id');
            if (v323) {
                const v324 = this.options;
                const v325 = v324.verbose;
                if (v325) {
                    const v326 = data.request_id;
                    const v327 = 'Get Request: ' + v326;
                    const v328 = v327 + ' - ';
                    const v329 = data.data;
                    const v330 = v328 + v329;
                    const v331 = console.log(v330);
                    v331;
                }
                const v332 = data.request_id;
                const v333 = data.data;
                const v334 = this.emit('getrequest', v332, v333);
                v334;
            }
        }
    };
    const v336 = v335.bind(this);
    const v337 = v276.on('message', v336);
    v337;
};
const v341 = function (file, mode) {
    mode = mode || 'replace';
    const v338 = this.socket;
    const v339 = [
        file,
        mode
    ];
    const v340 = v338.command('loadfile', v339);
    v340;
};
const v345 = function (url, mode) {
    mode = mode || 'replace';
    const v342 = this.socket;
    const v343 = [
        url,
        mode
    ];
    const v344 = v342.command('loadfile', v343);
    v344;
};
const v346 = {
    constructor: mpv,
    loadFile: v341,
    loadStream: v345
};
const v347 = eventEmitter.prototype;
const v348 = _.extend(v346, controlModule, commandModule, playlistModule, audioModule, videoModule, subtitleModule, v347);
mpv.prototype = v348;
module.exports = mpv;