const v126 = require('child_process');
var exec = v126.exec;
var aspect = require('aspectratio');
const v127 = require('path');
var dirname = v127.dirname;
const v128 = require('path');
var basename = v128.basename;
const v129 = require('path');
var extname = v129.extname;
const v130 = require('path');
var join = v130.join;
const v131 = require('util');
var sprintf = v131.format;
const v141 = function (image, output, cb) {
    const v132 = module.exports;
    var cmd = v132.cmd(image, output);
    const v133 = { timeout: 30000 };
    const v139 = function (e, stdout, stderr) {
        if (e) {
            const v134 = cb(e);
            return v134;
        }
        if (stderr) {
            const v135 = new Error(stderr);
            const v136 = cb(v135);
            return v136;
        }
        const v137 = output.versions;
        const v138 = cb(null, v137);
        return v138;
    };
    const v140 = exec(cmd, v133, v139);
    v140;
};
module.exports = v141;
const v142 = module.exports;
const v165 = function (image, ratio) {
    const v143 = !ratio;
    if (v143) {
        const v144 = image.width;
        const v145 = image.height;
        const v146 = {};
        v146.geometry = null;
        v146.width = v144;
        v146.height = v145;
        return v146;
    }
    const v147 = image.width;
    const v148 = image.height;
    var g = aspect.crop(v147, v148, ratio);
    const v149 = g[0];
    const v150 = v149 === 0;
    const v151 = g[1];
    const v152 = v151 === 0;
    const v153 = v150 && v152;
    if (v153) {
        const v154 = image.width;
        const v155 = image.height;
        const v156 = {};
        v156.geometry = null;
        v156.width = v154;
        v156.height = v155;
        return v156;
    } else {
        const v157 = g[2];
        const v158 = g[3];
        const v159 = g[0];
        const v160 = g[1];
        const v161 = sprintf('%dx%d+%d+%d', v157, v158, v159, v160);
        const v162 = g[2];
        const v163 = g[3];
        const v164 = {};
        v164.geometry = v161;
        v164.width = v162;
        v164.height = v163;
        return v164;
    }
};
v142.crop = v165;
const v166 = module.exports;
const v176 = function (crop, version) {
    var maxW = version.maxWidth;
    var maxH = version.maxHeight;
    const v167 = crop.width;
    const v168 = crop.height;
    var resize = aspect.resize(v167, v168, maxW, maxH);
    const v169 = resize[0];
    version.width = v169;
    const v170 = resize[1];
    version.height = v170;
    const v171 = maxW && maxH;
    if (v171) {
        const v172 = maxW + 'x';
        const v173 = v172 + maxH;
        return v173;
    } else {
        if (maxW) {
            const v174 = '' + maxW;
            return v174;
        } else {
            if (maxH) {
                const v175 = 'x' + maxH;
                return v175;
            } else {
                return null;
            }
        }
    }
};
v166.resize = v176;
const v177 = module.exports;
const v188 = function (src, opts) {
    const v178 = opts.path;
    const v179 = dirname(src);
    var dir = v178 || v179;
    var ext = extname(src);
    var base = basename(src, ext);
    const v180 = opts.format;
    if (v180) {
        const v181 = opts.format;
        ext = '.' + v181;
    }
    const v182 = opts.prefix;
    const v183 = v182 + base;
    const v184 = opts.suffix;
    const v185 = v183 + v184;
    const v186 = v185 + ext;
    const v187 = join(dir, v186);
    return v187;
};
v177.path = v188;
const v189 = module.exports;
const v220 = function (image, output) {
    const v190 = image.path;
    const v191 = image.path;
    const v192 = sprintf('convert %s -auto-orient -strip -write mpr:%s +delete', v190, v191);
    var cmd = [v192];
    var i = 0;
    const v193 = output.versions;
    const v194 = v193.length;
    let v195 = i < v194;
    while (v195) {
        const v197 = output.versions;
        var version = v197[i];
        const v198 = output.versions;
        const v199 = v198.length;
        const v200 = v199 - 1;
        var last = i === v200;
        const v201 = version.quality;
        const v202 = output.quality;
        const v203 = v201 || v202;
        version.quality = v203 || 80;
        const v204 = module.exports;
        const v205 = image.path;
        const v206 = version.format;
        const v207 = output.path;
        const v208 = version.prefix;
        const v209 = output.prefix;
        const v210 = v208 || v209;
        const v211 = v210 || '';
        const v212 = version.suffix;
        const v213 = v212 || '';
        const v214 = {
            format: v206,
            path: v207,
            prefix: v211,
            suffix: v213
        };
        const v215 = v204.path(v205, v214);
        version.path = v215;
        const v216 = module.exports;
        const v217 = v216.cmdVersion(image, version, last);
        const v218 = cmd.push(v217);
        v218;
        const v196 = i++;
        v195 = i < v194;
    }
    const v219 = cmd.join(' ');
    return v219;
};
v189.cmd = v220;
const v221 = module.exports;
const v250 = function (image, version, last) {
    var cmd = [];
    const v222 = image.path;
    const v223 = sprintf('mpr:%s', v222);
    const v224 = cmd.push(v223);
    v224;
    const v225 = version.quality;
    if (v225) {
        const v226 = version.quality;
        const v227 = sprintf('-quality %d', v226);
        const v228 = cmd.push(v227);
        v228;
    }
    const v229 = version.background;
    if (v229) {
        const v230 = version.background;
        const v231 = sprintf('-background "%s"', v230);
        const v232 = cmd.push(v231);
        v232;
    }
    const v233 = version.flatten;
    if (v233) {
        const v234 = cmd.push('-flatten');
        v234;
    }
    const v235 = module.exports;
    const v236 = version.aspect;
    var crop = v235.crop(image, v236);
    const v237 = crop.geometry;
    if (v237) {
        const v238 = crop.geometry;
        const v239 = sprintf('-crop "%s"', v238);
        const v240 = cmd.push(v239);
        v240;
    }
    const v241 = module.exports;
    var resize = v241.resize(crop, version);
    if (resize) {
        const v242 = sprintf('-resize "%s"', resize);
        const v243 = cmd.push(v242);
        v243;
    }
    if (last) {
        const v244 = version.path;
        const v245 = cmd.push(v244);
        v245;
    } else {
        const v246 = version.path;
        const v247 = sprintf('-write %s +delete', v246);
        const v248 = cmd.push(v247);
        v248;
    }
    const v249 = cmd.join(' ');
    return v249;
};
v221.cmdVersion = v250;