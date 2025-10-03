var os = require('os');
var fs = require('fs');
var p = require('path');
const v169 = require('child_process');
var exec = v169.exec;
const v170 = require('child_process');
var spawn = v170.spawn;
var helpers = require('./helpers');
const v171 = require('util');
var format = v171.format;
const v172 = {};
const v190 = function (pid, options, done) {
    var self = this;
    const v173 = this.cpu;
    const v174 = v173 !== null;
    if (v174) {
        const v184 = function (err, uptime) {
            if (err) {
                const v175 = done(err, null);
                return v175;
            }
            const v176 = uptime === undefined;
            if (v176) {
                const v177 = console.error('[pidusage] We couldn\'t find uptime from /proc/uptime');
                v177;
                const v179 = os.uptime();
                v178.uptime = v179;
            } else {
                const v180 = self.cpu;
                const v181 = uptime.split(' ');
                const v182 = v181[0];
                v180.uptime = v182;
            }
            const v183 = self.proc_calc(pid, options, done);
            return v183;
        };
        const v185 = fs.readFile('/proc/uptime', 'utf8', v184);
        v185;
    } else {
        const v188 = function (err, cpu) {
            if (err) {
                const v186 = done(err, null);
                return v186;
            }
            self.cpu = cpu;
            const v187 = self.proc_calc(pid, options, done);
            return v187;
        };
        const v189 = helpers.cpu(v188);
        v189;
    }
};
const v251 = function (pid, options, done) {
    let history;
    const v191 = this.history;
    const v192 = v191[pid];
    const v193 = this.history;
    const v194 = v193[pid];
    const v195 = {};
    if (v192) {
        history = v194;
    } else {
        history = v195;
    }
    var cpu = this.cpu;
    var self = this;
    const v196 = '' + pid;
    const v197 = p.join('/proc', v196, 'stat');
    const v249 = function (err, infos) {
        if (err) {
            const v198 = done(err, null);
            return v198;
        }
        var index = infos.lastIndexOf(')');
        const v199 = index + 2;
        const v200 = infos.substr(v199);
        infos = v200.split(' ');
        const v201 = infos[11];
        const v202 = parseFloat(v201);
        const v203 = infos[12];
        const v204 = parseFloat(v203);
        const v205 = infos[13];
        const v206 = parseFloat(v205);
        const v207 = infos[14];
        const v208 = parseFloat(v207);
        const v209 = infos[19];
        const v210 = parseFloat(v209);
        const v211 = cpu.clock_tick;
        const v212 = v210 / v211;
        const v213 = infos[21];
        const v214 = parseFloat(v213);
        var stat = {};
        stat.utime = v202;
        stat.stime = v204;
        stat.cutime = v206;
        stat.cstime = v208;
        stat.start = v212;
        stat.rss = v214;
        let childrens;
        const v215 = options.childrens;
        const v216 = stat.cutime;
        const v217 = stat.cstime;
        const v218 = v216 + v217;
        if (v215) {
            childrens = v218;
        } else {
            childrens = 0;
        }
        const v219 = stat.stime;
        const v220 = history.stime;
        const v221 = v220 || 0;
        const v222 = v219 - v221;
        const v223 = stat.utime;
        const v224 = v222 + v223;
        const v225 = history.utime;
        const v226 = v225 || 0;
        const v227 = v224 - v226;
        var total = v227 + childrens;
        const v228 = cpu.clock_tick;
        total = total / v228;
        let seconds;
        const v229 = history.uptime;
        const v230 = v229 !== undefined;
        const v231 = cpu.uptime;
        const v232 = history.uptime;
        const v233 = v231 - v232;
        const v234 = stat.start;
        const v235 = cpu.uptime;
        const v236 = v234 - v235;
        if (v230) {
            seconds = v233;
        } else {
            seconds = v236;
        }
        seconds = Math.abs(seconds);
        const v237 = seconds === 0;
        if (v237) {
            seconds = 1;
        } else {
            seconds = seconds;
        }
        const v238 = self.history;
        v238[pid] = stat;
        const v239 = self.history;
        const v240 = v239[pid];
        const v241 = cpu.uptime;
        v240.uptime = v241;
        const v242 = total / seconds;
        const v243 = v242 * 100;
        const v244 = stat.rss;
        const v245 = cpu.pagesize;
        const v246 = v244 * v245;
        const v247 = {
            cpu: v243,
            memory: v246
        };
        const v248 = done(null, v247);
        return v248;
    };
    const v250 = fs.readFile(v197, 'utf8', v249);
    v250;
};
const v270 = function (pid, options, done) {
    var cmd = 'ps -o pcpu,rss -p ';
    const v252 = os.platform();
    const v253 = v252 == 'aix';
    if (v253) {
        cmd = 'ps -o pcpu,rssize -p ';
    }
    const v254 = cmd + pid;
    const v268 = function (err, stdout, stderr) {
        if (err) {
            const v255 = done(err, null);
            return v255;
        }
        const v256 = os.EOL;
        const v257 = stdout.split(v256);
        stdout = v257[1];
        const v258 = stdout.replace(/^\s+/, '');
        const v259 = v258.replace(/\s\s+/g, ' ');
        stdout = v259.split(' ');
        const v260 = stdout[0];
        const v261 = v260.replace(',', '.');
        const v262 = parseFloat(v261);
        const v263 = stdout[1];
        const v264 = parseFloat(v263);
        const v265 = v264 * 1024;
        const v266 = {
            cpu: v262,
            memory: v265
        };
        const v267 = done(null, v266);
        return v267;
    };
    const v269 = exec(v254, v268);
    v269;
};
const v336 = function (pid, options, done) {
    let history;
    const v271 = this.history;
    const v272 = v271[pid];
    const v273 = this.history;
    const v274 = v273[pid];
    const v275 = {};
    if (v272) {
        history = v274;
    } else {
        history = v275;
    }
    const v276 = 'path win32_perfformatteddata_perfproc_process where (IDProcess = ' + pid;
    var args = v276 + ') get Name, Caption, PercentProcessorTime, WorkingSetPeak, IDProcess /format:list';
    const v277 = args.split(' ');
    const v278 = { detached: true };
    var wmic = spawn('wmic', v277, v278);
    var stdout = '';
    var stderr = '';
    var self = this;
    var uptime = os.uptime();
    const v279 = wmic.stdout;
    const v280 = function (d) {
        stdout += d.toString();
    };
    const v281 = v279.on('data', v280);
    v281;
    const v282 = wmic.stderr;
    const v283 = function (d) {
        stderr += d.toString();
    };
    const v284 = v282.on('data', v283);
    v284;
    const v288 = function (err) {
        const v285 = '[pidusage] Command "wmic ' + args;
        const v286 = v285 + '" failed with error %s';
        const v287 = console.error(v286, err);
        v287;
    };
    const v289 = wmic.on('error', v288);
    v289;
    const v332 = function (code) {
        stdout = stdout.trim();
        stderr = stderr.trim();
        const v290 = !stdout;
        const v291 = code !== 0;
        const v292 = v290 || v291;
        if (v292) {
            const v293 = new Date();
            const v294 = v293.toString();
            const v295 = os.EOL;
            var error = format('%s Wmic errored, please open an issue on https://github.com/soyuka/pidusage with this message.%s', v294, v295);
            const v296 = os.EOL;
            const v297 = os.EOL;
            const v298 = os.release();
            const v299 = os.EOL;
            const v300 = os.type();
            const v301 = os.EOL;
            error += format('Command was "wmic %s" %s System informations: %s - release: %s %s - type %s %s', args, v296, v297, v298, v299, v300, v301);
            const v302 = format('Wmic reported the following error: %s.', stderr);
            let v303;
            if (stderr) {
                v303 = v302;
            } else {
                v303 = 'Wmic reported no errors (stderr empty).';
            }
            stderr = error + v303;
            const v304 = os.EOL;
            const v305 = os.EOL;
            stderr = format('%s%s%sWmic exited with code %d.', v304, stderr, v305, code);
            const v306 = os.EOL;
            let v307;
            if (stdout) {
                v307 = stdout;
            } else {
                v307 = 'empty';
            }
            stderr = format('%s%sStdout was %s', stderr, v306, v307);
            const v308 = new Error(stderr, null);
            const v309 = done(v308);
            return v309;
        }
        const v310 = os.EOL;
        stdout = stdout.split(v310);
        var stats = {};
        stats.cpu = 0;
        stats.workingsetsize = 0;
        const v323 = function (line) {
            const v311 = line.indexOf('PercentProcessorTime');
            const v312 = v311 === 0;
            if (v312) {
                const v313 = line.split('=');
                const v314 = v313[1];
                const v315 = v314.trim();
                const v316 = +v315;
                stats.cpu = v316;
            } else {
                const v317 = line.indexOf('WorkingSetPeak');
                const v318 = v317 === 0;
                if (v318) {
                    const v319 = line.split('=');
                    const v320 = v319[1];
                    const v321 = v320.trim();
                    const v322 = +v321;
                    stats.workingsetsize = v322;
                }
            }
        };
        const v324 = stdout.forEach(v323);
        v324;
        const v325 = self.history;
        v325[pid] = stats;
        const v326 = self.history;
        const v327 = v326[pid];
        v327.uptime = uptime;
        const v328 = stats.cpu;
        const v329 = stats.workingsetsize;
        const v330 = {
            cpu: v328,
            memory: v329
        };
        const v331 = done(null, v330);
        return v331;
    };
    const v333 = wmic.on('close', v332);
    v333;
    const v334 = wmic.stdin;
    const v335 = v334.end();
    v335;
};
var stats = {};
stats.history = v172;
stats.cpu = null;
stats.proc = v190;
stats.proc_calc = v251;
stats.ps = v270;
stats.win = v336;
module.exports = stats;