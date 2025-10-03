var through2 = require('through2');
var tmp = require('temp-write');
var fs = require('fs');
var path = require('path');
var stream = require('stream');
const v132 = require('child_process');
var exec = v132.exec;
var merge = function (obj1, obj2) {
    let k;
    for (k in obj2) {
        const v133 = obj2.hasOwnProperty(k);
        if (v133) {
            const v134 = obj2[k];
            obj1[k] = v134;
        }
    }
    return obj1;
};
var flattenFlags = function (flags) {
    var str = [];
    var k;
    var v;
    var flatten = function (_k, _v) {
        const v135 = _v === null;
        if (v135) {
            const v136 = '--' + _k;
            const v137 = str.push(v136);
            v137;
            return;
        }
        const v138 = typeof _v;
        const v139 = v138 === 'string';
        if (v139) {
            const v140 = '--' + _k;
            const v141 = v140 + '="';
            const v142 = v141 + _v;
            const v143 = v142 + '"';
            const v144 = str.push(v143);
            v144;
            return;
        }
        const v145 = _v.length;
        const v146 = _v.slice;
        const v147 = v145 && v146;
        if (v147) {
            const v149 = function (flag) {
                const v148 = flatten(_k, flag);
                v148;
            };
            const v150 = _v.forEach(v149);
            v150;
            return;
        }
        const v151 = '--' + _k;
        const v152 = v151 + '=';
        const v153 = v152 + _v;
        const v154 = str.push(v153);
        v154;
    };
    for (k in flags) {
        v = flags[k];
        const v155 = flatten(k, v);
        v155;
    }
    const v156 = str.join(' ');
    return v156;
};
var flattenModules = function (modules) {
    var str = [];
    const v163 = function (files) {
        const v157 = files.shift();
        const v158 = '--module ' + v157;
        const v159 = str.push(v158);
        v159;
        const v160 = files.join(' --js ');
        const v161 = '--js ' + v160;
        const v162 = str.push(v161);
        v162;
    };
    const v164 = modules.forEach(v163);
    v164;
    const v165 = str.join(' ');
    return v165;
};
const v262 = function (options) {
    var files = [];
    const v168 = function (file, enc, cb) {
        const v166 = this.push(file);
        v166;
        const v167 = cb();
        v167;
    };
    var proxy = through2.obj(v168);
    var target = options.js_output_file;
    const v169 = options.module;
    const v170 = [];
    var modules = v169 || v170;
    var rootDir;
    var transform;
    const v171 = options.js_output_file;
    const v172 = delete v171;
    v172;
    const v173 = options.module;
    const v174 = delete v173;
    v174;
    const v194 = function (file, enc, cb) {
        var dir;
        const v175 = !file;
        const v176 = file.contents;
        const v177 = v176 === null;
        const v178 = v175 || v177;
        if (v178) {
            const v179 = this.push(file);
            v179;
            const v180 = cb();
            return v180;
        }
        const v181 = file.contents;
        const v182 = stream.Stream;
        const v183 = v181 instanceof v182;
        if (v183) {
            const v184 = this.emit('error', 'streaming not supported');
            v184;
            const v185 = cb();
            return v185;
        }
        const v186 = file.path;
        dir = path.dirname(v186);
        const v187 = dir.length;
        const v188 = rootDir.length;
        const v189 = v187 < v188;
        let v190;
        if (v189) {
            v190 = dir;
        } else {
            v190 = rootDir;
        }
        if (rootDir) {
            rootDir = v190;
        } else {
            rootDir = dir;
        }
        const v191 = file.path;
        const v192 = files.push(v191);
        v192;
        const v193 = cb();
        v193;
    };
    const v258 = function () {
        var args = [];
        const v195 = modules.length;
        const v196 = {};
        const v197 = { js: files };
        let v198;
        if (v195) {
            v198 = v196;
        } else {
            v198 = v197;
        }
        var opts = merge(v198, options);
        const v199 = args.push('java');
        v199;
        const v200 = args.push('-jar');
        v200;
        const v201 = opts.jar;
        const v202 = opts.jar;
        const v203 = path.join(__dirname, 'lib/compiler.jar');
        let v204;
        if (v201) {
            v204 = v202;
        } else {
            v204 = v203;
        }
        const v205 = args.push(v204);
        v205;
        const v206 = opts.jar;
        const v207 = delete v206;
        v207;
        const v208 = opts.create_source_map;
        const v209 = !v208;
        if (v209) {
            const v210 = tmp.sync('');
            opts.create_source_map = v210;
        }
        const v211 = opts.source_map_format;
        const v212 = !v211;
        if (v212) {
            opts.source_map_format = 'V3';
        }
        const v213 = flattenFlags(opts);
        const v214 = args.push(v213);
        v214;
        const v215 = flattenModules(modules);
        const v216 = args.push(v215);
        v216;
        const v217 = args.join(' ');
        const v218 = 1024 * 500;
        const v219 = { maxBuffer: v218 };
        const v256 = function (err, stdout, stderr) {
            var filename;
            var file;
            var pathParts;
            if (err) {
                const v220 = proxy.emit('error', err);
                v220;
                return;
            }
            const v221 = console.log('%s', stderr);
            v221;
            const v222 = tmp.sync(stdout);
            filename = target || v222;
            const v223 = fs.existsSync(filename);
            const v224 = fs.lstatSync(filename);
            const v225 = {};
            if (v223) {
                file = v224;
            } else {
                file = v225;
            }
            pathParts = filename.split('/');
            file.path = filename;
            const v226 = process.cwd();
            file.cwd = v226;
            const v227 = pathParts.pop();
            file.relative = v227;
            const v228 = pathParts.join('/');
            const v229 = file.cwd;
            let v230;
            if (target) {
                v230 = v228;
            } else {
                v230 = v229;
            }
            file.base = v230;
            const v231 = stdout instanceof Buffer;
            const v232 = new Buffer(stdout);
            let v233;
            if (v231) {
                v233 = stdout;
            } else {
                v233 = v232;
            }
            file.contents = v233;
            try {
                const v234 = opts.create_source_map;
                const v235 = fs.readFileSync(v234);
                const v236 = JSON.parse(v235);
                file.sourceMap = v236;
                const v238 = file.sourceMap;
                const v239 = v238.sources;
                const v242 = function (src) {
                    const v240 = rootDir + '/';
                    const v241 = src.replace(v240, '');
                    return v241;
                };
                const v243 = v239.map(v242);
                v237.sources = v243;
            } catch (e) {
            }
            const v244 = function () {
                return false;
            };
            file.isDirectory = v244;
            file.isStream = file.isDirectory;
            const v247 = function () {
                const v245 = file.contents;
                const v246 = v245 instanceof Buffer;
                return v246;
            };
            file.isBuffer = v247;
            const v250 = function () {
                const v248 = file.contents;
                const v249 = v248 === null;
                return v249;
            };
            file.isNull = v250;
            if (target) {
                const v251 = path.resolve(target);
                const v252 = fs.createWriteStream(v251);
                const v253 = file.contents;
                const v254 = v252.end(v253);
                v254;
            }
            const v255 = proxy.end(file);
            v255;
        };
        const v257 = exec(v217, v219, v256);
        v257;
    };
    transform = through2.obj(v194, v258);
    const v261 = function () {
        const v259 = proxy.pipe;
        const v260 = v259.apply(proxy, arguments);
        return v260;
    };
    transform.pipe = v261;
    return transform;
};
module.exports = v262;