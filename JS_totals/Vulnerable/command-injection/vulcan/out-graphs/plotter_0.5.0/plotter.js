const v182 = require('child_process');
var exec = v182.exec;
var _ = require('underscore');
const moving_average = function (array, n) {
    var nums = [];
    for (i in array) {
        const v183 = array[i];
        const v184 = _.isNumber(v183);
        if (v184) {
            const v185 = array[i];
            const v186 = nums.push(v185);
            v186;
            const v187 = nums.length;
            const v188 = v187 > n;
            if (v188) {
                const v189 = nums.splice(0, 1);
                v189;
            }
            const v191 = function (memo, num) {
                const v190 = memo + num;
                return v190;
            };
            var sum = _.reduce(nums, v191, 0);
            const v192 = nums.length;
            array[i] = sum / v192;
        }
    }
    return array;
};
const moving_maximum = function (array, n) {
    var nums = [];
    for (i in array) {
        const v193 = array[i];
        const v194 = _.isNumber(v193);
        if (v194) {
            const v195 = array[i];
            const v196 = nums.push(v195);
            v196;
            const v197 = nums.length;
            const v198 = v197 > n;
            if (v198) {
                const v199 = nums.splice(0, 1);
                v199;
            }
            var maximum = _.max(nums);
            array[i] = maximum;
        }
    }
    return array;
};
const apply_moving_filter = function (set, filter, n) {
    const v200 = _.isNumber(n);
    const v201 = !v200;
    if (v201) {
        n = 3;
    }
    for (series in set) {
        const v202 = set[series];
        const v203 = filter(v202, n);
        set[series] = v203;
    }
    return set;
};
const time_format = function (options) {
    const v204 = options.time;
    const v205 = _.isString(v204);
    if (v205) {
        const v206 = options.time;
        switch (v206) {
        case 'days':
        case 'Days':
            return '%d/%m';
        case 'hours':
        case 'Hours':
            return '%H:%M';
        default:
            const v207 = options.time;
            return v207;
        }
    } else {
        return '%H:%M';
    }
};
const setup_gnuplot = function (gnuplot, options) {
    const v208 = options.format;
    const v209 = v208 === 'svg';
    if (v209) {
        const v210 = gnuplot.stdin;
        const v211 = v210.write('set term svg fname "Helvetica" fsize 14\n');
        v211;
    } else {
        const v212 = options.format;
        const v213 = v212 == 'pdf';
        if (v213) {
            const v214 = gnuplot.stdin;
            const v215 = 'set term postscript landscape enhanced color dashed' + '"Helvetica" 14\n';
            const v216 = v214.write(v215);
            v216;
        } else {
            const v217 = gnuplot.stdin;
            const v218 = v217.write('set term png\n');
            v218;
        }
    }
    const v219 = options.time;
    if (v219) {
        const v220 = gnuplot.stdin;
        const v221 = v220.write('set xdata time\n');
        v221;
        const v222 = gnuplot.stdin;
        const v223 = v222.write('set timefmt "%s"\n');
        v223;
        const v224 = gnuplot.stdin;
        const v225 = options.time;
        const v226 = time_format(v225);
        const v227 = 'set format x "' + v226;
        const v228 = v227 + '"\n';
        const v229 = v224.write(v228);
        v229;
        const v230 = gnuplot.stdin;
        const v231 = v230.write('set xlabel "time"\n');
        v231;
    }
    const v232 = options.title;
    if (v232) {
        const v233 = gnuplot.stdin;
        const v234 = options.title;
        const v235 = 'set title "' + v234;
        const v236 = v235 + '"\n';
        const v237 = v233.write(v236);
        v237;
    }
    const v238 = options.logscale;
    if (v238) {
        const v239 = gnuplot.stdin;
        const v240 = v239.write('set logscale y\n');
        v240;
    }
    const v241 = options.xlabel;
    if (v241) {
        const v242 = gnuplot.stdin;
        const v243 = options.xlabel;
        const v244 = 'set xlabel "' + v243;
        const v245 = v244 + '"\n';
        const v246 = v242.write(v245);
        v246;
    }
    const v247 = options.ylabel;
    if (v247) {
        const v248 = gnuplot.stdin;
        const v249 = options.ylabel;
        const v250 = 'set ylabel "' + v249;
        const v251 = v250 + '"\n';
        const v252 = v248.write(v251);
        v252;
    }
    const v253 = gnuplot.stdin;
    const v254 = v253.write('set grid xtics ytics mxtics\n');
    v254;
    const v255 = gnuplot.stdin;
    const v256 = v255.write('set mxtics\n');
    v256;
    const v257 = options.nokey;
    if (v257) {
        const v258 = gnuplot.stdin;
        const v259 = v258.write('set nokey\n');
        v259;
    }
};
const post_gnuplot_processing = function (error, stdout, stderr) {
    const v260 = 'stdout: ' + stdout;
    const v261 = console.log(v260);
    v261;
    const v262 = 'stderr: ' + stderr;
    const v263 = console.log(v262);
    v263;
    const v264 = error !== null;
    if (v264) {
        const v265 = 'exec error: ' + error;
        const v266 = console.log(v265);
        v266;
    }
};
const plot = function (options) {
    const v267 = options.data;
    const v268 = !v267;
    const v269 = options.filename;
    const v270 = !v269;
    const v271 = v268 || v270;
    if (v271) {
        throw 'The options object must have \'data\' and \'filename\' properties!';
        return;
    }
    const v272 = options.data;
    const v273 = _.isArray(v272);
    if (v273) {
        const v274 = options.data;
        const v275 = _.flatten(v274);
        const v276 = options.data;
        const v277 = _.isEqual(v275, v276);
        if (v277) {
            const v278 = options.data;
            const v279 = {};
            v279['Series 1'] = v278;
            options.data = v279;
        }
    }
    const v280 = options.style;
    const v281 = !v280;
    if (v281) {
        options.style = 'lines';
    }
    const v282 = options.moving_avg;
    if (v282) {
        const v283 = options.data;
        const v284 = options.moving_avg;
        const v285 = apply_moving_filter(v283, moving_average, v284);
        options.data = v285;
    }
    const v286 = options.moving_max;
    if (v286) {
        const v287 = options.data;
        const v288 = options.moving_max;
        const v289 = apply_moving_filter(v287, moving_maximum, v288);
        options.data = v289;
    }
    const v290 = options.format;
    const v291 = v290 === 'pdf';
    if (v291) {
        const v292 = options.filename;
        const v293 = 'gnuplot | ps2pdf - ' + v292;
        const v294 = options.exec;
        const v295 = options.exec;
        const v296 = {};
        let v297;
        if (v294) {
            v297 = v295;
        } else {
            v297 = v296;
        }
        const v298 = options.finish;
        const v299 = v298 || post_gnuplot_processing;
        gnuplot = exec(v293, v297, v299);
    } else {
        const v300 = options.filename;
        const v301 = 'gnuplot > ' + v300;
        const v302 = options.exec;
        const v303 = options.exec;
        const v304 = {};
        let v305;
        if (v302) {
            v305 = v303;
        } else {
            v305 = v304;
        }
        const v306 = options.finish;
        const v307 = v306 || post_gnuplot_processing;
        gnuplot = exec(v301, v305, v307);
    }
    const v308 = setup_gnuplot(gnuplot, options);
    v308;
    const v309 = options.data;
    var series = _.keys(v309);
    var i;
    (i = 0)
    const v310 = series.length;
    let v311 = i < v310;
    while (v311) {
        const v312 = options.data;
        const v313 = series[i];
        const v314 = v312.hasOwnProperty(v313);
        const v315 = !v314;
        const v316 = options.data;
        const v317 = series[i];
        const v318 = v316[v317];
        const v319 = typeof v318;
        const v320 = v319 === 'function';
        const v321 = v315 || v320;
        if (v321) {
            const v322 = series[i];
            const v323 = delete v322;
            v323;
        }
        v311 = i < v310;
    }
    const v324 = function () {
        return true;
    };
    series = _.filter(series, v324);
    const v325 = gnuplot.stdin;
    const v326 = v325.write('plot');
    v326;
    (i = 1)
    const v327 = series.length;
    let v328 = i <= v327;
    while (v328) {
        const v329 = gnuplot.stdin;
        const v330 = i - 1;
        const v331 = series[v330];
        const v332 = '\'-\' using 1:2 title\'' + v331;
        const v333 = v332 + '\' with ';
        const v334 = options.style;
        const v335 = v333 + v334;
        const v336 = v335 + ' lt 1 lc ';
        const v337 = v336 + i;
        const v338 = v329.write(v337);
        v338;
        const v339 = series.length;
        const v340 = i < v339;
        if (v340) {
            const v341 = gnuplot.stdin;
            const v342 = v341.write(',');
            v342;
        }
        v328 = i <= v327;
    }
    const v343 = gnuplot.stdin;
    const v344 = v343.write('\n');
    v344;
    (i = 0)
    const v345 = series.length;
    let v346 = i < v345;
    while (v346) {
        const v347 = options.data;
        const v348 = series[i];
        const v349 = v347[v348];
        for (key in v349) {
            const v350 = gnuplot.stdin;
            const v351 = key + ' ';
            const v352 = options.data;
            const v353 = series[i];
            const v354 = v352[v353];
            const v355 = v354[key];
            const v356 = v351 + v355;
            const v357 = v356 + '\n';
            const v358 = v350.write(v357);
            v358;
        }
        const v359 = gnuplot.stdin;
        const v360 = v359.write('e\n');
        v360;
        v346 = i < v345;
    }
    const v361 = gnuplot.stdin;
    const v362 = v361.end();
    v362;
};
exports.plot = plot;