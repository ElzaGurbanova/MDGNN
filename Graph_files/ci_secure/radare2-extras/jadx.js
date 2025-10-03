const v152 = require('child_process');
const execFileSync = v152.execFileSync;
const path = require('path');
const fs = require('fs');
const toPaddedHexString = function (num, len) {
    const v153 = parseInt(num);
    const str = v153.toString(16);
    const v154 = str.length;
    const v155 = len - v154;
    const v156 = '0'.repeat(v155);
    const v157 = v156 + str;
    const v158 = '0x' + v157;
    return v158;
};
const walkSync = function (dir, arr) {
    const v159 = arguments.length;
    const v160 = v159 === 1;
    if (v160) {
        arr = [];
    }
    const v161 = fs.lstatSync(dir);
    const v162 = v161.isDirectory();
    const v163 = !v162;
    if (v163) {
        return dir;
    }
    const v164 = fs.readdirSync(dir);
    const v167 = f => {
        const v165 = path.join(dir, f);
        const v166 = walkSync(v165, arr);
        return v166;
    };
    const files = v164.map(v167);
    const v168 = arr.push(...files);
    v168;
    return arr;
};
const walk = async (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    let file;
    for (file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        const v169 = stat.isDirectory();
        if (v169) {
            filelist = await walk(filepath, filelist);
        } else {
            const v170 = filelist.push(file);
            v170;
        }
    }
    return filelist;
};
const processMethod = function (data, mode, offset, method) {
    const comment = function (addr, line) {
        const v171 = mode === 'c';
        const v172 = mode === 'cat';
        const v173 = v171 || v172;
        if (v173) {
            const v174 = data.source;
            const v175 = !v174;
            if (v175) {
                return '';
            }
            const v176 = method.offset;
            let lastOffset = parseInt(v176);
            const v177 = mode === 'cat';
            const v178 = mode === 'c';
            const v179 = addr === lastOffset;
            const v180 = v178 && v179;
            const v181 = v177 || v180;
            if (v181) {
                const v182 = data.source;
                const source = v182.replace('.json', '.java');
                const fileData = fs.readFileSync(source);
                const v183 = fileData.toString('utf8');
                return v183;
            }
            return '';
        }
        const v184 = mode === 'f';
        if (v184) {
            const v185 = method.offset;
            let lastOffset = parseInt(v185);
            const v186 = addr === lastOffset;
            if (v186) {
                const v187 = toPaddedHexString(addr, 8);
                const v188 = v187 + '  ';
                const v189 = v188 + line;
                const v190 = v189 + '\n';
                return v190;
            }
            return '';
        }
        const v191 = Buffer.from(line);
        const b64line = v191.toString('base64');
        const v192 = b64line.length;
        const v193 = v192 > 2048;
        if (v193) {
            const v194 = 'CCu toolong @ ' + addr;
            const v195 = v194 + '\n';
            return v195;
        }
        const v196 = 'CCu base64:' + b64line;
        const v197 = v196 + ' @ ';
        const v198 = v197 + addr;
        const v199 = v198 + '\n';
        return v199;
    };
    const v200 = method.offset;
    let lastOffset = parseInt(v200);
    const v201 = mode === 'all';
    const v202 = mode === 'ahl';
    const v203 = v201 || v202;
    if (v203) {
        const v204 = method.offset;
        const v205 = toPaddedHexString(v204, 8);
        const v206 = '\n' + v205;
        const v207 = v206 + '  ';
        const v208 = method.name;
        const v209 = v207 + v208;
        let res = v209 + ':\n';
        let line;
        const v210 = method.lines;
        for (line of v210) {
            const v211 = line.offset;
            const v212 = v211 || lastOffset;
            const v213 = toPaddedHexString(v212, 8);
            const v214 = v213 + '  ';
            const v215 = line.code;
            const v216 = v214 + v215;
            res += v216 + '\n';
            const v217 = line.offset;
            if (v217) {
                lastOffset = line.offset;
            }
        }
        return res;
    }
    const v218 = mode === 'r';
    if (v218) {
        offset = 0;
        mode = 'r2';
    }
    const v219 = mode === 'll';
    const v220 = mode === 'hl';
    const v221 = v219 || v220;
    if (v221) {
        let res = '';
        const v222 = offset === lastOffset;
        if (v222) {
            const v223 = processMethod(data, 'r2', offset, method);
            return v223;
        }
        let line;
        const v224 = method.lines;
        for (line of v224) {
            const v225 = line.offset;
            const v226 = parseInt(v225);
            const v227 = offset - 16;
            const v228 = v226 === v227;
            if (v228) {
                res += processMethod(data, 'r2', offset, method);
            }
        }
        return res;
    }
    const v229 = method.offset;
    const v230 = parseInt(v229);
    const v231 = v230 + 16;
    const v232 = method.name;
    let res = comment(v231, v232);
    let line;
    const v233 = method.lines;
    for (line of v233) {
        const v234 = line.offset;
        const v235 = v234 || lastOffset;
        const addr = parseInt(v235);
        const v236 = line.code;
        const v237 = v236.trim();
        res += comment(addr, v237);
        const v238 = line.offset;
        if (v238) {
            lastOffset = line.offset;
        }
    }
    return res;
};
const processClass = function (data, mode, offset) {
    offset = parseInt(offset);
    let res = '';
    const v239 = data.methods;
    if (v239) {
        let method;
        const v240 = data.methods;
        for (method of v240) {
            switch (mode) {
            case 'a':
            case 'c':
            case 'f':
            case 'cat':
            case 'r':
            case 'r2':
            case 'all':
            case 'ahl':
            case 'll':
            case 'hl':
                res += processMethod(data, mode, offset, method);
                break;
            default:
                const v241 = 'Invalid mode ' + mode;
                res += v241 + '\n';
                break;
            }
        }
    }
    return res;
};
const dex2path = function (target) {
    const v242 = target + '.d';
    return v242;
};
const crawl = async function (target, mode, arg) {
    switch (mode) {
    case 'f':
        const v243 = path.join(target, 'hl');
        const v244 = crawlFiles(v243, mode, arg);
        return v244;
    case 'c':
        const v245 = path.join(target, 'hl');
        const v246 = crawlFiles(v245, 'c', arg);
        return v246;
    case 'a':
        const v247 = path.join(target, 'hl');
        const v248 = crawlFiles(v247, 'cat', arg);
        return v248;
    case 'r':
        const v249 = path.join(target, 'll');
        const v250 = crawlFiles(v249, mode, arg);
        return v250;
    case 'r2':
        const v251 = path.join(target, 'hl');
        const v252 = crawlFiles(v251, mode, arg);
        return v252;
    case 'll':
        const v253 = path.join(target, 'll');
        const v254 = crawlFiles(v253, mode, arg);
        return v254;
    case 'hl':
        const v255 = path.join(target, 'hl');
        const v256 = crawlFiles(v255, mode, arg);
        return v256;
    case 'ahl':
        const v257 = path.join(target, 'hl');
        const v258 = crawlFiles(v257, mode, arg);
        return v258;
    case 'all':
        const v259 = path.join(target, 'll');
        const v260 = crawlFiles(v259, mode, arg);
        return v260;
    case 'cat':
        const v261 = path.join(target, 'cat');
        const v262 = crawlFiles(v261, mode, arg);
        return v262;
    case '?':
    case 'h':
    case 'help':
    default:
        return 'Usage: !*r2jadx ([filename])[ll,hl,all,ahl,cat,help]';
    }
};
const crawlFiles = async function (target, mode, arg) {
    const ext = 'json';
    const v263 = walkSync(target);
    const v267 = _ => {
        const v264 = _.endsWith;
        const v265 = _.endsWith(ext);
        const v266 = v264 && v265;
        return v266;
    };
    const files = v263.filter(v267);
    let res = '';
    let fileName;
    for (fileName of files) {
        try {
            const v268 = mode === 'cat';
            if (v268) {
                const v269 = fileName.replace('.json', '.java');
                const fileData = fs.readFileSync(v269);
                res += fileData;
            } else {
                const fileData = fs.readFileSync(fileName);
                const data = JSON.parse(fileData);
                res += processClass(data, mode, arg);
                const v270 = data['inner-classes'];
                if (v270) {
                    let klass;
                    const v271 = data['inner-classes'];
                    for (klass of v271) {
                        klass.source = fileName;
                        res += processClass(klass, mode, arg);
                    }
                }
            }
        } catch (e) {
            const v272 = '' + fileName;
            const v273 = v272 + ': ';
            const v274 = v273 + e;
            const v275 = console.error(v274);
            v275;
        }
    }
    return res;
};
const decompile = async function (target, mode, arg) {
    const outdir = dex2path(target);
    const v276 = fs.existsSync(outdir);
    const v277 = !v276;
    if (v277) {
        const v278 = check();
        const v279 = !v278;
        if (v279) {
            const v280 = console.error('Invalid version of jadx. We need >= 1.x');
            v280;
            const v281 = process.exit(1);
            v281;
        }
        const options = {};
        try {
            const v282 = console.error('jadx: Performing the low level decompilation...');
            v282;
            const v283 = path.join(outdir, 'll');
            const cmd = [
                'r2pm',
                '-r',
                'jadx',
                '--output-format',
                'json',
                '-f',
                '-d',
                v283,
                target
            ];
            const v284 = cmd[0];
            const v285 = cmd.slice(1);
            const v286 = execFileSync(v284, v285, options);
            v286;
        } catch (e) {
        }
        try {
            const v287 = console.error('jadx: Performing the high level decompilation...');
            v287;
            const v288 = path.join(outdir, 'hl');
            const cmd = [
                'r2pm',
                '-r',
                'jadx',
                '--show-bad-code',
                '--output-format',
                'java',
                '-d',
                v288,
                target
            ];
            const v289 = cmd[0];
            const v290 = cmd.slice(1);
            const v291 = execFileSync(v289, v290, options);
            v291;
        } catch (e) {
        }
        try {
            const v292 = console.error('jadx: Constructing the high level jsons...');
            v292;
            const v293 = path.join(outdir, 'hl');
            const cmd = [
                'r2pm',
                '-r',
                'jadx',
                '--show-bad-code',
                '--output-format',
                'json',
                '-d',
                v293,
                target
            ];
            const v294 = cmd[0];
            const v295 = cmd.slice(1);
            const v296 = execFileSync(v294, v295, options);
            v296;
        } catch (e) {
        }
    }
    const v297 = crawl(outdir, mode, arg);
    return v297;
};
const check = function () {
    const cmd = [
        'r2pm',
        '-r',
        'jadx',
        '--version'
    ];
    const v298 = cmd[0];
    const v299 = cmd.slice(1);
    const v300 = { encoding: 'utf8' };
    const res = execFileSync(v298, v299, v300);
    const v301 = res.startsWith('1');
    return v301;
};
const v302 = {};
v302.crawl = crawl;
v302.dex2path = dex2path;
v302.decompile = decompile;
v302.check = check;
module.exports = v302;