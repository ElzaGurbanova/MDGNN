var os = require('os');
var fs = require('fs');
var p = require('path');
const v176 = require('child_process');
var exec = v176.exec;
const v177 = require('child_process');
var spawn = v177.spawn;
var helpers = require('./helpers');
const v178 = require('util');
var format = v178.format;
const v179 = {};
const v197 = function (pid, options, done) {
    var self = this;
    const v180 = this.cpu;
    const v181 = v180 !== null;
    if (v181) {
        const v191 = function (err, uptime) {
            if (err) {
                const v182 = done(err, null);
                return v182;
            }
            const v183 = uptime === undefined;
            if (v183) {
                const v184 = console.error('[pidusage] We couldn\'t find uptime from /proc/uptime');
                v184;
                const v186 = os.uptime();
                v185.uptime = v186;
            } else {
                const v187 = self.cpu;
                const v188 = uptime.split(' ');
                const v189 = v188[0];
                v187.uptime = v189;
            }
            const v190 = self.proc_calc(pid, options, done);
            return v190;
        };
        const v192 = fs.readFile('/proc/uptime', 'utf8', v191);
        v192;
    } else {
        const v195 = function (err, cpu) {
            if (err) {
                const v193 = done(err, null);
                return v193;
            }
            self.cpu = cpu;
            const v194 = self.proc_calc(pid, options, done);
            return v194;
        };
        const v196 = helpers.cpu(v195);
        v196;
    }
};
const v258 = function (pid, options, done) {
    let history;
    const v198 = this.history;
    const v199 = v198[pid];
    const v200 = this.history;
    const v201 = v200[pid];
    const v202 = {};
    if (v199) {
        history = v201;
    } else {
        history = v202;
    }
    var cpu = this.cpu;
    var self = this;
    const v203 = '' + pid;
    const v204 = p.join('/proc', v203, 'stat');
    const v256 = function (err, infos) {
        if (err) {
            const v205 = done(err, null);
            return v205;
        }
        var index = infos.lastIndexOf(')');
        const v206 = index + 2;
        const v207 = infos.substr(v206);
        infos = v207.split(' ');
        const v208 = infos[11];
        const v209 = parseFloat(v208);
        const v210 = infos[12];
        const v211 = parseFloat(v210);
        const v212 = infos[13];
        const v213 = parseFloat(v212);
        const v214 = infos[14];
        const v215 = parseFloat(v214);
        const v216 = infos[19];
        const v217 = parseFloat(v216);
        const v218 = cpu.clock_tick;
        const v219 = v217 / v218;
        const v220 = infos[21];
        const v221 = parseFloat(v220);
        var stat = {};
        stat.utime = v209;
        stat.stime = v211;
        stat.cutime = v213;
        stat.cstime = v215;
        stat.start = v219;
        stat.rss = v221;
        let childrens;
        const v222 = options.childrens;
        const v223 = stat.cutime;
        const v224 = stat.cstime;
        const v225 = v223 + v224;
        if (v222) {
            childrens = v225;
        } else {
            childrens = 0;
        }
        const v226 = stat.stime;
        const v227 = history.stime;
        const v228 = v227 || 0;
        const v229 = v226 - v228;
        const v230 = stat.utime;
        const v231 = v229 + v230;
        const v232 = history.utime;
        const v233 = v232 || 0;
        const v234 = v231 - v233;
        var total = v234 + childrens;
        const v235 = cpu.clock_tick;
        total = total / v235;
        let seconds;
        const v236 = history.uptime;
        const v237 = v236 !== undefined;
        const v238 = cpu.uptime;
        const v239 = history.uptime;
        const v240 = v238 - v239;
        const v241 = stat.start;
        const v242 = cpu.uptime;
        const v243 = v241 - v242;
        if (v237) {
            seconds = v240;
        } else {
            seconds = v243;
        }
        seconds = Math.abs(seconds);
        const v244 = seconds === 0;
        if (v244) {
            seconds = 1;
        } else {
            seconds = seconds;
        }
        const v245 = self.history;
        v245[pid] = stat;
        const v246 = self.history;
        const v247 = v246[pid];
        const v248 = cpu.uptime;
        v247.uptime = v248;
        const v249 = total / seconds;
        const v250 = v249 * 100;
        const v251 = stat.rss;
        const v252 = cpu.pagesize;
        const v253 = v251 * v252;
        const v254 = {
            cpu: v250,
            memory: v253
        };
        const v255 = done(null, v254);
        return v255;
    };
    const v257 = fs.readFile(v204, 'utf8', v256);
    v257;
};
const v277 = function (pid, options, done) {
    var cmd = 'ps -o pcpu,rss -p ';
    const v259 = os.platform();
    const v260 = v259 == 'aix';
    if (v260) {
        cmd = 'ps -o pcpu,rssize -p ';
    }
    const v261 = cmd + pid;
    const v275 = function (err, stdout, stderr) {
        if (err) {
            const v262 = done(err, null);
            return v262;
        }
        const v263 = os.EOL;
        const v264 = stdout.split(v263);
        stdout = v264[1];
        const v265 = stdout.replace(/^\s+/, '');
        const v266 = v265.replace(/\s\s+/g, ' ');
        stdout = v266.split(' ');
        const v267 = stdout[0];
        const v268 = v267.replace(',', '.');
        const v269 = parseFloat(v268);
        const v270 = stdout[1];
        const v271 = parseFloat(v270);
        const v272 = v271 * 1024;
        const v273 = {
            cpu: v269,
            memory: v272
        };
        const v274 = done(null, v273);
        return v274;
    };
    const v276 = exec(v261, v275);
    v276;
};
const v350 = function (pid, options, done) {
    let history;
    const v278 = this.history;
    const v279 = v278[pid];
    const v280 = this.history;
    const v281 = v280[pid];
    const v282 = {};
    if (v279) {
        history = v281;
    } else {
        history = v282;
    }
    const v283 = 'PROCESS ' + pid;
    var args = v283 + ' get workingsetsize,usermodetime,kernelmodetime';
    const v284 = args.split(' ');
    const v285 = { detached: true };
    var wmic = spawn('wmic', v284, v285);
    var stdout = '';
    var stderr = '';
    var self = this;
    var uptime = os.uptime();
    const v286 = wmic.stdout;
    const v287 = function (d) {
        stdout += d.toString();
    };
    const v288 = v286.on('data', v287);
    v288;
    const v289 = wmic.stderr;
    const v290 = function (d) {
        stderr += d.toString();
    };
    const v291 = v289.on('data', v290);
    v291;
    const v295 = function (err) {
        const v292 = '[pidusage] Command "wmic ' + args;
        const v293 = v292 + '" failed with error %s';
        const v294 = console.error(v293, err);
        v294;
    };
    const v296 = wmic.on('error', v295);
    v296;
    const v346 = function (code) {
        stdout = stdout.trim();
        stderr = stderr.trim();
        const v297 = !stdout;
        const v298 = code !== 0;
        const v299 = v297 || v298;
        if (v299) {
            const v300 = new Date();
            const v301 = v300.toString();
            const v302 = os.EOL;
            var error = format('%s Wmic errored, please open an issue on https://github.com/soyuka/pidusage with this message.%s', v301, v302);
            const v303 = os.EOL;
            const v304 = os.EOL;
            const v305 = os.release();
            const v306 = os.EOL;
            const v307 = os.type();
            const v308 = os.EOL;
            error += format('Command was "wmic %s" %s System informations: %s - release: %s %s - type %s %s', args, v303, v304, v305, v306, v307, v308);
            const v309 = format('Wmic reported the following error: %s.', stderr);
            let v310;
            if (stderr) {
                v310 = v309;
            } else {
                v310 = 'Wmic reported no errors (stderr empty).';
            }
            stderr = error + v310;
            const v311 = os.EOL;
            const v312 = os.EOL;
            stderr = format('%s%s%sWmic exited with code %d.', v311, stderr, v312, code);
            const v313 = os.EOL;
            let v314;
            if (stdout) {
                v314 = stdout;
            } else {
                v314 = 'empty';
            }
            stderr = format('%s%sStdout was %s', stderr, v313, v314);
            const v315 = new Error(stderr, null);
            const v316 = done(v315);
            return v316;
        }
        const v317 = os.EOL;
        const v318 = stdout.split(v317);
        const v319 = v318[1];
        const v320 = v319.replace(/\s\s+/g, ' ');
        stdout = v320.split(' ');
        const v321 = stdout[0];
        const v322 = parseFloat(v321);
        const v323 = stdout[1];
        const v324 = parseFloat(v323);
        var stats = {};
        stats.kernelmodetime = v322;
        stats.usermodetime = v324;
        const v325 = stdout[2];
        var workingsetsize = parseFloat(v325);
        const v326 = stats.kernelmodetime;
        const v327 = history.kernelmodetime;
        const v328 = v327 || 0;
        const v329 = v326 - v328;
        const v330 = stats.usermodetime;
        const v331 = v329 + v330;
        const v332 = history.usermodetime;
        const v333 = v332 || 0;
        var total = v331 - v333;
        total = total / 10000000;
        let seconds;
        const v334 = history.uptime;
        const v335 = v334 !== undefined;
        const v336 = history.uptime;
        const v337 = uptime - v336;
        if (v335) {
            seconds = v337;
        } else {
            seconds = 0;
        }
        seconds = Math.abs(seconds);
        const v338 = seconds === 0;
        if (v338) {
            seconds = 1;
        } else {
            seconds = seconds;
        }
        const v339 = self.history;
        v339[pid] = stats;
        const v340 = self.history;
        const v341 = v340[pid];
        v341.uptime = uptime;
        const v342 = total / seconds;
        const v343 = v342 * 100;
        const v344 = {
            cpu: v343,
            memory: workingsetsize
        };
        const v345 = done(null, v344);
        return v345;
    };
    const v347 = wmic.on('close', v346);
    v347;
    const v348 = wmic.stdin;
    const v349 = v348.end();
    v349;
};
var stats = {};
stats.history = v179;
stats.cpu = null;
stats.proc = v197;
stats.proc_calc = v258;
stats.ps = v277;
stats.win = v350;
module.exports = stats;