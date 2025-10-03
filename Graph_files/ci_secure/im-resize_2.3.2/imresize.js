const v129 = require('child_process');
var exec = v129.exec;
var aspect = require('aspectratio');
const v130 = require('path');
var dirname = v130.dirname;
const v131 = require('path');
var basename = v131.basename;
const v132 = require('path');
var extname = v132.extname;
const v133 = require('path');
var join = v133.join;
const v134 = require('util');
var sprintf = v134.format;
const v147 = function (image, output, cb) {
    const v135 = JSON.stringify(image);
    const v136 = /;|&|`|\$|\(|\)|\|\||\||!|>|<|\?|\${/g.test(v135);
    if (v136) {
        const v137 = console.log('Input Validation failed, Suspicious Characters found');
        v137;
    } else {
        const v138 = module.exports;
        var cmd = v138.cmd(image, output);
        const v139 = { timeout: 30000 };
        const v145 = function (e, stdout, stderr) {
            if (e) {
                const v140 = cb(e);
                return v140;
            }
            if (stderr) {
                const v141 = new Error(stderr);
                const v142 = cb(v141);
                return v142;
            }
            const v143 = output.versions;
            const v144 = cb(null, v143);
            return v144;
        };
        const v146 = exec(cmd, v139, v145);
        v146;
    }
};
module.exports = v147;
const v148 = module.exports;
const v171 = function (image, ratio) {
    const v149 = !ratio;
    if (v149) {
        const v150 = image.width;
        const v151 = image.height;
        const v152 = {};
        v152.geometry = null;
        v152.width = v150;
        v152.height = v151;
        return v152;
    }
    const v153 = image.width;
    const v154 = image.height;
    var g = aspect.crop(v153, v154, ratio);
    const v155 = g[0];
    const v156 = v155 === 0;
    const v157 = g[1];
    const v158 = v157 === 0;
    const v159 = v156 && v158;
    if (v159) {
        const v160 = image.width;
        const v161 = image.height;
        const v162 = {};
        v162.geometry = null;
        v162.width = v160;
        v162.height = v161;
        return v162;
    } else {
        const v163 = g[2];
        const v164 = g[3];
        const v165 = g[0];
        const v166 = g[1];
        const v167 = sprintf('%dx%d+%d+%d', v163, v164, v165, v166);
        const v168 = g[2];
        const v169 = g[3];
        const v170 = {};
        v170.geometry = v167;
        v170.width = v168;
        v170.height = v169;
        return v170;
    }
};
v148.crop = v171;
const v172 = module.exports;
const v182 = function (crop, version) {
    var maxW = version.maxWidth;
    var maxH = version.maxHeight;
    const v173 = crop.width;
    const v174 = crop.height;
    var resize = aspect.resize(v173, v174, maxW, maxH);
    const v175 = resize[0];
    version.width = v175;
    const v176 = resize[1];
    version.height = v176;
    const v177 = maxW && maxH;
    if (v177) {
        const v178 = maxW + 'x';
        const v179 = v178 + maxH;
        return v179;
    } else {
        if (maxW) {
            const v180 = '' + maxW;
            return v180;
        } else {
            if (maxH) {
                const v181 = 'x' + maxH;
                return v181;
            } else {
                return null;
            }
        }
    }
};
v172.resize = v182;
const v183 = module.exports;
const v194 = function (src, opts) {
    const v184 = opts.path;
    const v185 = dirname(src);
    var dir = v184 || v185;
    var ext = extname(src);
    var base = basename(src, ext);
    const v186 = opts.format;
    if (v186) {
        const v187 = opts.format;
        ext = '.' + v187;
    }
    const v188 = opts.prefix;
    const v189 = v188 + base;
    const v190 = opts.suffix;
    const v191 = v189 + v190;
    const v192 = v191 + ext;
    const v193 = join(dir, v192);
    return v193;
};
v183.path = v194;
const v195 = module.exports;
const v226 = function (image, output) {
    const v196 = image.path;
    const v197 = image.path;
    const v198 = sprintf('convert %s -auto-orient -strip -write mpr:%s +delete', v196, v197);
    var cmd = [v198];
    var i = 0;
    const v199 = output.versions;
    const v200 = v199.length;
    let v201 = i < v200;
    while (v201) {
        const v203 = output.versions;
        var version = v203[i];
        const v204 = output.versions;
        const v205 = v204.length;
        const v206 = v205 - 1;
        var last = i === v206;
        const v207 = version.quality;
        const v208 = output.quality;
        const v209 = v207 || v208;
        version.quality = v209 || 80;
        const v210 = module.exports;
        const v211 = image.path;
        const v212 = version.format;
        const v213 = output.path;
        const v214 = version.prefix;
        const v215 = output.prefix;
        const v216 = v214 || v215;
        const v217 = v216 || '';
        const v218 = version.suffix;
        const v219 = v218 || '';
        const v220 = {
            format: v212,
            path: v213,
            prefix: v217,
            suffix: v219
        };
        const v221 = v210.path(v211, v220);
        version.path = v221;
        const v222 = module.exports;
        const v223 = v222.cmdVersion(image, version, last);
        const v224 = cmd.push(v223);
        v224;
        const v202 = i++;
        v201 = i < v200;
    }
    const v225 = cmd.join(' ');
    return v225;
};
v195.cmd = v226;
const v227 = module.exports;
const v256 = function (image, version, last) {
    var cmd = [];
    const v228 = image.path;
    const v229 = sprintf('mpr:%s', v228);
    const v230 = cmd.push(v229);
    v230;
    const v231 = version.quality;
    if (v231) {
        const v232 = version.quality;
        const v233 = sprintf('-quality %d', v232);
        const v234 = cmd.push(v233);
        v234;
    }
    const v235 = version.background;
    if (v235) {
        const v236 = version.background;
        const v237 = sprintf('-background "%s"', v236);
        const v238 = cmd.push(v237);
        v238;
    }
    const v239 = version.flatten;
    if (v239) {
        const v240 = cmd.push('-flatten');
        v240;
    }
    const v241 = module.exports;
    const v242 = version.aspect;
    var crop = v241.crop(image, v242);
    const v243 = crop.geometry;
    if (v243) {
        const v244 = crop.geometry;
        const v245 = sprintf('-crop "%s"', v244);
        const v246 = cmd.push(v245);
        v246;
    }
    const v247 = module.exports;
    var resize = v247.resize(crop, version);
    if (resize) {
        const v248 = sprintf('-resize "%s"', resize);
        const v249 = cmd.push(v248);
        v249;
    }
    if (last) {
        const v250 = version.path;
        const v251 = cmd.push(v250);
        v251;
    } else {
        const v252 = version.path;
        const v253 = sprintf('-write %s +delete', v252);
        const v254 = cmd.push(v253);
        v254;
    }
    const v255 = cmd.join(' ');
    return v255;
};
v227.cmdVersion = v256;