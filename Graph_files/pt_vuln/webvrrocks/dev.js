var fs = require('fs');
var path = require('path');
var urllib = require('url');
var budo = require('budo');
var shell = require('shelljs');
var yonder = require('yonder');
const v106 = path.resolve(__dirname, 'public');
const v107 = {};
v107.strict = true;
v107.cwd = v106;
v107.include = '**/*';
v107.ignore = '**/*.html';
v107.nonull = true;
const v108 = path.resolve(__dirname, 'public');
const v109 = path.resolve(__dirname, '_prod');
const v110 = {};
v110.glob = v107;
v110.inputDir = v108;
v110.outputDir = v109;
const v111 = {};
v111.include = '**/*.html';
const v112 = path.resolve(__dirname, 'nunjucks-helpers.js');
const v113 = path.resolve(__dirname, 'public');
const v114 = path.resolve(__dirname, '_prod');
const v115 = {};
v115.glob = v111;
v115.extensionsFile = v112;
v115.inputDir = v113;
v115.outputDir = v114;
var OPTS = {};
OPTS.assets = v110;
OPTS.nunjucks = v115;
const v116 = OPTS.assets;
const v117 = v116.inputDir;
const v118 = path.join(v117, 'ROUTER');
OPTS.routerPath = v118;
const staticMiddlewareForFilesWithoutTrailingSlashes = function (req, res, next) {
    const v119 = req.url;
    var parsedUrl = urllib.parse(v119);
    var pathname = parsedUrl.pathname;
    var ext = path.extname(pathname);
    const v120 = -1;
    const v121 = pathname.substr(v120);
    const v122 = v121 === '/';
    const v123 = ext || v122;
    if (v123) {
        const v124 = next();
        v124;
        return;
    }
    const v125 = OPTS.assets;
    const v126 = v125.inputDir;
    const v127 = pathname + '.html';
    var fileRelative = path.join(v126, v127);
    const v135 = function (exists) {
        if (exists) {
            const v128 = pathname + '.html';
            const v129 = parsedUrl.search;
            const v130 = v129 || '';
            const v131 = v128 + v130;
            const v132 = parsedUrl.hash;
            const v133 = v132 || '';
            req.url = v131 + v133;
        }
        const v134 = next();
        v134;
    };
    const v136 = fs.exists(fileRelative, v135);
    v136;
};
var budoLiveOpts = {};
budoLiveOpts.cache = false;
budoLiveOpts.debug = true;
budoLiveOpts.live = true;
var budoMiddleware = [staticMiddlewareForFilesWithoutTrailingSlashes];
const v137 = OPTS.routerPath;
const v138 = fs.existsSync(v137);
if (v138) {
    const v139 = OPTS.routerPath;
    const v140 = yonder.middleware(v139);
    const v141 = budoMiddleware.push(v140);
    v141;
}
const regenerateAllNunjucksTemplates = function () {
    const v142 = OPTS.nunjucks;
    const v143 = v142.glob;
    const v144 = v143.include;
    const v145 = OPTS.nunjucks;
    const v146 = v145.inputDir;
    const v147 = OPTS.nunjucks;
    const v148 = v147.extensionsFile;
    const v149 = OPTS.nunjucks;
    const v150 = v149.outputDir;
    const v151 = `node ./node_modules/.bin/nunjucks "${ v144 }" --path ${ v146 } --unsafe --extensions ${ v148 } --out ${ v150 }`;
    const v152 = shell.exec(v151);
    return v152;
};
const v153 = process.argv;
const v154 = v153.slice(2);
const v155 = {
    live: budoLiveOpts,
    middleware: budoMiddleware
};
const v156 = budo.cli(v154, v155);
const v171 = function (evt) {
    var wss = evt.webSocketServer;
    const v158 = function (socket) {
        const v157 = console.log('[LiveReload] Client Connected');
        v157;
    };
    const v159 = wss.on('connection', v158);
    v159;
    const v160 = OPTS.assets;
    const v161 = v160.outputDir;
    const v162 = OPTS.nunjucks;
    const v163 = v162.outputDir;
    const v164 = shell.rm('-rf', v161, v163);
    v164;
    const v165 = OPTS.assets;
    const v166 = v165.inputDir;
    const v167 = OPTS.assets;
    const v168 = v167.outputDir;
    const v169 = shell.cp('-R', v166, v168);
    v169;
    const v170 = regenerateAllNunjucksTemplates();
    v170;
};
const v172 = v156.on('connect', v171);
const v210 = function (file) {
    const v173 = path.sep;
    const v174 = file.split(v173);
    var parentDir = v174[0];
    if (parentDir) {
        const v175 = parentDir.toLowerCase();
        parentDir = path.join(__dirname, v175);
    }
    const v176 = !parentDir;
    const v177 = OPTS.assets;
    const v178 = v177.outputDir;
    const v179 = parentDir === v178;
    const v180 = v176 || v179;
    const v181 = OPTS.nunjucks;
    const v182 = v181.outputDir;
    const v183 = parentDir === v182;
    const v184 = v180 || v183;
    if (v184) {
        return;
    }
    const v185 = console.log('File reloaded:', file);
    v185;
    const v186 = path.extname(file);
    var ext = v186.toLowerCase();
    var fileRelative;
    const v187 = ext === '.html';
    if (v187) {
        const v188 = OPTS.nunjucks;
        const v189 = v188.inputDir;
        fileRelative = path.relative(v189, file);
        const v190 = fileRelative[0];
        const v191 = v190 === '_';
        if (v191) {
            const v192 = regenerateAllNunjucksTemplates();
            v192;
            return;
        }
        const v193 = OPTS.nunjucks;
        const v194 = v193.inputDir;
        const v195 = OPTS.nunjucks;
        const v196 = v195.extensionsFile;
        const v197 = OPTS.nunjucks;
        const v198 = v197.outputDir;
        const v199 = `node ./node_modules/.bin/nunjucks ${ fileRelative } --path ${ v194 } --unsafe --extensions ${ v196 } --out ${ v198 }`;
        const v200 = shell.exec(v199);
        v200;
        return;
    }
    const v201 = ext === '.json';
    if (v201) {
        const v202 = regenerateAllNunjucksTemplates();
        v202;
        return;
    }
    const v203 = OPTS.assets;
    const v204 = v203.inputDir;
    fileRelative = path.relative(v204, file);
    const v205 = OPTS.assets;
    const v206 = v205.outputDir;
    var fileOutput = path.join(v206, fileRelative);
    var fileOutputDir = path.dirname(fileOutput);
    const v207 = console.log('Copying: %s', fileRelative);
    v207;
    const v208 = shell.mkdir('-p', fileOutputDir);
    v208;
    const v209 = shell.cp(file, fileOutput);
    v209;
};
var app = v172.on('reload', v210);
module.exports = app;