const path = require('path');
const util = require('util');
const os = require('os');
const asar = require('@electron/asar');
const fs = require('fs-extra');
const spawn = require('await-spawn');
const tar = require('tar');
const uglify = require('uglify-js');
const v145 = require('stream');
const PassThrough = v145.PassThrough;
const Transform = v145.Transform;
const v146 = require('./filters');
const fixedFilterList = v146.fixedFilterList;
const stockFilterList = v146.stockFilterList;
const v147 = require('./util');
const ignoreError = v147.ignoreError;
const cat = v147.cat;
const getYode = v147.getYode;
const v148 = require('license-checker-rseidelsohn');
const v149 = v148.init;
const checkLicense = util.promisify(v149);
const transform = function (rootDir, p) {
    const v150 = p.endsWith('.js');
    const v151 = !v150;
    if (v151) {
        const v152 = new PassThrough();
        return v152;
    }
    let data = '';
    const v154 = function (chunk, encoding, callback) {
        data += chunk;
        const v153 = callback(null);
        v153;
    };
    const v169 = function (callback) {
        const v155 = {};
        v155.bare_returns = true;
        const v156 = { parse: v155 };
        const result = uglify.minify(data, v156);
        const v157 = result.error;
        if (v157) {
            const rp = path.relative(rootDir, p);
            const v158 = result.error;
            const v159 = v158.message;
            const v160 = result.error;
            const v161 = v160.line;
            const v162 = result.error;
            const v163 = v162.col;
            const message = `${ v159 } at line ${ v161 } col ${ v163 }`;
            const v164 = `Failed to minify ${ rp }:`;
            const v165 = console.error(v164, message);
            v165;
            const v166 = callback(null, data);
            v166;
        } else {
            const v167 = result.code;
            const v168 = callback(null, v167);
            v168;
        }
    };
    const v170 = {
        transform: v154,
        flush: v169
    };
    const v171 = new Transform(v170);
    return v171;
};
const getAppInfo = function (packageJson) {
    const v172 = packageJson.name;
    const v173 = packageJson.version;
    const v174 = packageJson.description;
    const v175 = packageJson.name;
    const v176 = packageJson.name;
    const v177 = packageJson.build;
    const v178 = v177.productName;
    const appInfo = {};
    appInfo.name = v172;
    appInfo.version = v173;
    appInfo.description = v174;
    appInfo.appId = `com.${ v175 }.${ v176 }`;
    appInfo.productName = v178;
    const v179 = packageJson.build;
    if (v179) {
        const v180 = packageJson.build;
        const v181 = Object.assign(appInfo, v180);
        v181;
    }
    const v182 = appInfo.copyright;
    const v183 = !v182;
    if (v183) {
        const v184 = new Date();
        const v185 = v184.getYear();
        const v186 = appInfo.productName;
        appInfo.copyright = `Copyright © ${ v185 } ${ v186 }`;
    }
    return appInfo;
};
const installApp = async function (appDir, platform, arch) {
    const v187 = os.tmpdir();
    const v188 = path.join(v187, 'yacakge-');
    const immediateDir = await fs.mkdtemp(v188);
    const freshDir = path.join(immediateDir, 'package');
    try {
        const v189 = ['pack'];
        const v190 = {
            shell: true,
            cwd: appDir
        };
        const pack = await spawn('npm', v189, v190);
        const v191 = pack.toString();
        const v192 = v191.trim();
        const v193 = v192.split('\n');
        const v194 = v193.pop();
        const tarball = path.join(appDir, v194);
        try {
            const v195 = {
                file: tarball,
                cwd: immediateDir
            };
            await tar.x(v195);
        } finally {
            const v196 = fs.remove(tarball);
            await ignoreError(v196);
        }
        const v197 = process.env;
        const env = Object.create(v197);
        env.npm_config_platform = platform;
        env.npm_config_arch = arch;
        try {
            const v198 = [
                'install',
                '--production'
            ];
            const v199 = {
                shell: true,
                cwd: freshDir,
                env
            };
            await spawn('npm', v198, v199);
        } catch (error) {
            const v200 = error.stderr;
            const v201 = `Failed to install app: \n${ v200 }`;
            const v202 = Error(v201);
            throw v202;
        }
    } catch (error) {
        const v203 = console.error('Package dir left for debug:', freshDir);
        v203;
        throw error;
    }
    return freshDir;
};
const appendMeta = async function (target) {
    const stat = await fs.stat(target);
    const v204 = 8 + 1;
    const v205 = v204 + 4;
    const meta = Buffer.alloc(v205);
    const v206 = stat.size;
    const v207 = meta.length;
    const asarSize = v206 + v207;
    const v208 = meta.writeDoubleLE(asarSize, 0);
    v208;
    const v209 = meta.writeUInt8(2, 8);
    v209;
    const v210 = meta.write('ASAR', 9);
    v210;
    await fs.appendFile(target, meta);
};
const createAsarArchive = async function (appDir, outputDir, target, appInfo) {
    const v211 = appInfo.minify;
    const v212 = transform.bind(this, appDir);
    let v213;
    if (v211) {
        v213 = v212;
    } else {
        v213 = null;
    }
    const v214 = appInfo.unpack;
    const v215 = appInfo.unpackDir;
    const v216 = fixedFilterList.concat(stockFilterList);
    const v217 = {};
    v217.cwd = appDir;
    v217.noDir = true;
    v217.ignore = v216;
    const asarOpts = {};
    asarOpts.pattern = '**/*';
    asarOpts.transform = v213;
    asarOpts.unpack = v214;
    asarOpts.unpackDir = v215;
    asarOpts.globOptions = v217;
    let relativeOutputDir;
    const v218 = path.isAbsolute(outputDir);
    const v219 = path.relative(appDir, outputDir);
    if (v218) {
        relativeOutputDir = v219;
    } else {
        relativeOutputDir = outputDir;
    }
    const v220 = asarOpts.globOptions;
    const v221 = v220.ignore;
    const v222 = v221.push(outputDir);
    v222;
    const v223 = asarOpts.globOptions;
    const v224 = v223.ignore;
    const v225 = outputDir + '/*';
    const v226 = v224.push(v225);
    v226;
    const v227 = appInfo.ignore;
    if (v227) {
        const v228 = asarOpts.globOptions;
        const v229 = v228.ignore;
        const v230 = appInfo.ignore;
        const v231 = v229.push(...v230);
        v231;
    }
    const cwd = process.cwd();
    try {
        const v232 = process.chdir(appDir);
        v232;
        await asar.createPackageWithOptions('', target, asarOpts);
    } finally {
        const v233 = process.chdir(cwd);
        v233;
    }
    await appendMeta(target);
};
const replaceOffsetPlaceholder = async function (target) {
    const mark = '/* REPLACE_WITH_OFFSET */';
    const data = await fs.readFile(target);
    const v234 = Buffer.from(mark);
    const pos = data.indexOf(v234);
    const v235 = pos <= 0;
    if (v235) {
        return false;
    }
    const stat = await fs.stat(target);
    const v236 = stat.size;
    const v237 = mark.length;
    const replace = `, ${ v236 }`.padEnd(v237, ' ');
    const v238 = data.write(replace, pos);
    v238;
    await fs.writeFile(target, data);
    return true;
};
const writeLicenseFile = async function (outputDir, appDir) {
    let license = '';
    const v239 = { start: appDir };
    const data = await checkLicense(v239);
    let name;
    for (name in data) {
        const info = data[name];
        const v240 = info.licenseFile;
        const v241 = !v240;
        if (v241) {
            continue;
        }
        license += name + '\n';
        const v242 = info.publisher;
        if (v242) {
            const v243 = info.publisher;
            license += v243 + '\n';
        }
        const v244 = info.email;
        if (v244) {
            const v245 = info.email;
            license += v245 + '\n';
        }
        const v246 = info.url;
        if (v246) {
            const v247 = info.url;
            license += v247 + '\n';
        }
        const v248 = info.licenseFile;
        const content = await fs.readFile(v248);
        const v249 = content.toString();
        const v250 = v249.replace(/\r\n/g, '\n');
        license += '\n' + v250;
        const v251 = '-'.repeat(70);
        const v252 = '\n' + v251;
        license += v252 + '\n\n';
    }
    const v253 = path.join(outputDir, 'LICENSE');
    await fs.writeFile(v253, license);
};
const packageApp = async function (outputDir, appDir, options, platform, arch) {
    const v254 = path.join(appDir, 'package.json');
    const appInfo = getAppInfo(await fs.readJson(v254));
    const v255 = Object.assign(appInfo, options);
    v255;
    await fs.emptyDir(outputDir);
    const v256 = platform === 'win32';
    const v257 = appInfo.name;
    const v258 = appInfo.name;
    let v259;
    if (v256) {
        v259 = `${ v257 }.exe`;
    } else {
        v259 = v258;
    }
    let target = path.join(outputDir, v259);
    const intermediateAsar = path.resolve(outputDir, 'app.ear');
    const v260 = getYode(appDir);
    const srcYodePath = v260.path;
    const v261 = path.basename(srcYodePath);
    const yodePath = path.resolve(outputDir, v261);
    try {
        const v262 = createAsarArchive(appDir, outputDir, intermediateAsar, appInfo);
        const v263 = fs.copy(srcYodePath, yodePath);
        const v264 = [
            v262,
            v263
        ];
        await Promise.all(v264);
        const v265 = platform === 'darwin';
        if (v265) {
            const v266 = [
                '--remove-signature',
                yodePath
            ];
            await spawn('codesign', v266);
        } else {
            const v267 = platform === 'win32';
            if (v267) {
                const v268 = require('./win');
                await v268.modifyExe(yodePath, appInfo, appDir);
            }
        }
        await replaceOffsetPlaceholder(yodePath);
        await cat(target, yodePath, intermediateAsar);
        const v269 = platform === 'darwin';
        if (v269) {
            const v270 = require('./mac');
            await v270.extendStringTableSize(target);
        }
        const v271 = fs.chmod(target, 493);
        const v272 = writeLicenseFile(outputDir, appDir);
        const v276 = async () => {
            const resDir = path.join(outputDir, 'res');
            const v273 = fs.remove(resDir);
            await ignoreError(v273);
            const v274 = `${ intermediateAsar }.unpacked`;
            const v275 = fs.rename(v274, resDir);
            await ignoreError(v275);
        };
        const v277 = v276();
        const v278 = [
            v271,
            v272,
            v277
        ];
        await Promise.all(v278);
    } finally {
        const v279 = fs.remove(yodePath);
        const v280 = fs.remove(intermediateAsar);
        const v281 = `${ intermediateAsar }.unpacked`;
        const v282 = fs.remove(v281);
        const v283 = [
            v279,
            v280,
            v282
        ];
        await ignoreError(v283);
    }
    const v284 = platform === 'darwin';
    if (v284) {
        const v285 = require('./mac');
        target = await v285.createBundle(appInfo, appDir, outputDir, target);
        const v286 = require('./mac');
        await v286.codeSign(appInfo, target);
    }
    return target;
};
const packageCleanApp = async function (outputDir, appDir, options, platform, arch) {
    const freshDir = await installApp(appDir, platform, arch);
    try {
        return await packageApp(outputDir, freshDir, options, platform, arch);
    } finally {
        const v287 = fs.remove(freshDir);
        await ignoreError(v287);
    }
};
const v288 = {};
v288.packageApp = packageApp;
v288.packageCleanApp = packageCleanApp;
module.exports = v288;