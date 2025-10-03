var fs = require('fs');
var path = require('path');
var urllib = require('url');
var budo = require('budo');
var shell = require('shelljs');
var yonder = require('yonder');
const v127 = path.resolve(__dirname, 'public');
const v128 = {};
v128.strict = true;
v128.cwd = v127;
v128.include = '**/*';
v128.ignore = '**/*.html';
v128.nonull = true;
const v129 = path.resolve(__dirname, 'public');
const v130 = path.resolve(__dirname, '_prod');
const v131 = {};
v131.glob = v128;
v131.inputDir = v129;
v131.outputDir = v130;
const v132 = {};
v132.include = '**/*.html';
const v133 = path.resolve(__dirname, 'nunjucks-helpers.js');
const v134 = path.resolve(__dirname, 'public');
const v135 = path.resolve(__dirname, '_prod');
const v136 = {};
v136.glob = v132;
v136.extensionsFile = v133;
v136.inputDir = v134;
v136.outputDir = v135;
var OPTS = {};
OPTS.assets = v131;
OPTS.nunjucks = v136;
const v137 = OPTS.assets;
const v138 = v137.inputDir;
const v139 = path.join(v138, 'ROUTER');
OPTS.routerPath = v139;
const staticMiddlewareForFilesWithoutTrailingSlashes = function (req, res, next) {
    const v140 = req.url;
    var parsedUrl = urllib.parse(v140);
    const v141 = parsedUrl.pathname;
    var pathname = v141 || '/';
    var ext = path.extname(pathname);
    const v142 = -1;
    const v143 = pathname.substr(v142);
    const v144 = v143 === '/';
    const v145 = ext || v144;
    if (v145) {
        const v146 = next();
        v146;
        return;
    }
    var decoded;
    try {
        decoded = decodeURIComponent(pathname);
    } catch (_) {
        decoded = pathname;
    }
    const v147 = decoded.replace(/\\/g, '/');
    var rel = v147.replace(/^\/+/, '');
    const v148 = !rel;
    const v149 = rel.split('/');
    const v155 = function (seg) {
        const v150 = seg === '';
        const v151 = seg === '.';
        const v152 = v150 || v151;
        const v153 = seg === '..';
        const v154 = v152 || v153;
        return v154;
    };
    const v156 = v149.some(v155);
    const v157 = v148 || v156;
    if (v157) {
        const v158 = next();
        v158;
        return;
    }
    const v159 = OPTS.assets;
    const v160 = v159.inputDir;
    const v161 = rel + '.html';
    var candidate = path.resolve(v160, v161);
    const v162 = OPTS.assets;
    const v163 = v162.inputDir;
    var relCheck = path.relative(v163, candidate);
    const v164 = relCheck.startsWith('..');
    const v165 = !v164;
    const v166 = relCheck && v165;
    const v167 = path.isAbsolute(relCheck);
    const v168 = !v167;
    var inside = v166 && v168;
    const v169 = fs.existsSync(candidate);
    const v170 = inside && v169;
    if (v170) {
        const v171 = '/' + rel;
        const v172 = v171 + '.html';
        const v173 = parsedUrl.search;
        const v174 = v173 || '';
        const v175 = v172 + v174;
        const v176 = parsedUrl.hash;
        const v177 = v176 || '';
        req.url = v175 + v177;
    }
    const v178 = next();
    v178;
};
var budoLiveOpts = {};
budoLiveOpts.cache = false;
budoLiveOpts.debug = true;
budoLiveOpts.live = true;
var budoMiddleware = [staticMiddlewareForFilesWithoutTrailingSlashes];
const v179 = OPTS.routerPath;
const v180 = fs.existsSync(v179);
if (v180) {
    const v181 = OPTS.routerPath;
    const v182 = yonder.middleware(v181);
    const v183 = budoMiddleware.push(v182);
    v183;
}
const regenerateAllNunjucksTemplates = function () {
    const v184 = OPTS.nunjucks;
    const v185 = v184.glob;
    const v186 = v185.include;
    const v187 = OPTS.nunjucks;
    const v188 = v187.inputDir;
    const v189 = OPTS.nunjucks;
    const v190 = v189.extensionsFile;
    const v191 = OPTS.nunjucks;
    const v192 = v191.outputDir;
    const v193 = `node ./node_modules/.bin/nunjucks "${ v186 }" --path ${ v188 } --unsafe --extensions ${ v190 } --out ${ v192 }`;
    const v194 = shell.exec(v193);
    return v194;
};
const v195 = process.argv;
const v196 = v195.slice(2);
const v197 = {
    live: budoLiveOpts,
    middleware: budoMiddleware
};
const v198 = budo.cli(v196, v197);
const v213 = function (evt) {
    var wss = evt.webSocketServer;
    const v200 = function (socket) {
        const v199 = console.log('[LiveReload] Client Connected');
        v199;
    };
    const v201 = wss.on('connection', v200);
    v201;
    const v202 = OPTS.assets;
    const v203 = v202.outputDir;
    const v204 = OPTS.nunjucks;
    const v205 = v204.outputDir;
    const v206 = shell.rm('-rf', v203, v205);
    v206;
    const v207 = OPTS.assets;
    const v208 = v207.inputDir;
    const v209 = OPTS.assets;
    const v210 = v209.outputDir;
    const v211 = shell.cp('-R', v208, v210);
    v211;
    const v212 = regenerateAllNunjucksTemplates();
    v212;
};
const v214 = v198.on('connect', v213);
const v252 = function (file) {
    const v215 = path.sep;
    const v216 = file.split(v215);
    var parentDir = v216[0];
    if (parentDir) {
        const v217 = parentDir.toLowerCase();
        parentDir = path.join(__dirname, v217);
    }
    const v218 = !parentDir;
    const v219 = OPTS.assets;
    const v220 = v219.outputDir;
    const v221 = parentDir === v220;
    const v222 = v218 || v221;
    const v223 = OPTS.nunjucks;
    const v224 = v223.outputDir;
    const v225 = parentDir === v224;
    const v226 = v222 || v225;
    if (v226) {
        return;
    }
    const v227 = console.log('File reloaded:', file);
    v227;
    const v228 = path.extname(file);
    var ext = v228.toLowerCase();
    var fileRelative;
    const v229 = ext === '.html';
    if (v229) {
        const v230 = OPTS.nunjucks;
        const v231 = v230.inputDir;
        fileRelative = path.relative(v231, file);
        const v232 = fileRelative[0];
        const v233 = v232 === '_';
        if (v233) {
            const v234 = regenerateAllNunjucksTemplates();
            v234;
            return;
        }
        const v235 = OPTS.nunjucks;
        const v236 = v235.inputDir;
        const v237 = OPTS.nunjucks;
        const v238 = v237.extensionsFile;
        const v239 = OPTS.nunjucks;
        const v240 = v239.outputDir;
        const v241 = `node ./node_modules/.bin/nunjucks ${ fileRelative } --path ${ v236 } --unsafe --extensions ${ v238 } --out ${ v240 }`;
        const v242 = shell.exec(v241);
        v242;
        return;
    }
    const v243 = ext === '.json';
    if (v243) {
        const v244 = regenerateAllNunjucksTemplates();
        v244;
        return;
    }
    const v245 = OPTS.assets;
    const v246 = v245.inputDir;
    fileRelative = path.relative(v246, file);
    const v247 = OPTS.assets;
    const v248 = v247.outputDir;
    var fileOutput = path.join(v248, fileRelative);
    var fileOutputDir = path.dirname(fileOutput);
    const v249 = console.log('Copying: %s', fileRelative);
    v249;
    const v250 = shell.mkdir('-p', fileOutputDir);
    v250;
    const v251 = shell.cp(file, fileOutput);
    v251;
};
var app = v214.on('reload', v252);
module.exports = app;