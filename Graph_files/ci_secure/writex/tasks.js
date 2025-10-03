var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var utils = require('./utils');
const v100 = require('child_process');
var spawn = v100.spawn;
var async = require('async');
var lodashStreamer = require('lodash-template-stream');
const v198 = function (config) {
    const v101 = function (c) {
        config = c;
    };
    const v123 = function (sourceFile, callback) {
        const v102 = chalk.yellow(sourceFile);
        const v103 = '...' + v102;
        const v104 = console.log(v103);
        v104;
        const v105 = config.contentFolder;
        const v106 = path.join(v105, sourceFile);
        const v107 = config.tmpFolder;
        const v108 = utils.mdToTex(sourceFile);
        const v109 = path.join(v107, v108);
        const v110 = [
            '--section',
            '--no-tex-ligatures',
            '--normalize',
            '--biblatex',
            v106,
            '-o',
            v109
        ];
        var compile = spawn('pandoc', v110);
        const v116 = function (code) {
            const v111 = code !== 0;
            if (v111) {
                const v112 = 'pandoc failed with error code ' + code;
                const v113 = new Error(v112);
                const v114 = callback(v113);
                v114;
            } else {
                const v115 = callback(null, true);
                v115;
            }
        };
        const v117 = compile.on('close', v116);
        v117;
        const v118 = compile.stderr;
        const v121 = function (data) {
            const v119 = '' + data;
            const v120 = console.log(v119);
            v120;
        };
        const v122 = v118.on('data', v121);
        v122;
    };
    const v136 = function (sourceFile, callback) {
        const v124 = chalk.yellow(sourceFile);
        const v125 = '...' + v124;
        const v126 = console.log(v125);
        v126;
        const v127 = config.tmpFolder;
        const v128 = path.join(v127, sourceFile);
        var out = fs.createWriteStream(v128);
        const v129 = out.on('finish', callback);
        v129;
        const v130 = config.templateFolder;
        const v131 = path.join(v130, sourceFile);
        const v132 = fs.createReadStream(v131);
        const v133 = lodashStreamer(config);
        const v134 = v132.pipe(v133);
        const v135 = v134.pipe(out);
        v135;
    };
    const v146 = function (sourceFile, callback) {
        const v137 = chalk.yellow(sourceFile);
        const v138 = '...' + v137;
        const v139 = console.log(v138);
        v139;
        const v140 = config.tmpFolder;
        const v141 = path.join(v140, sourceFile);
        var out = fs.createWriteStream(v141);
        const v142 = out.on('finish', callback);
        v142;
        const v143 = path.join('packages/', sourceFile);
        const v144 = fs.createReadStream(v143);
        const v145 = v144.pipe(out);
        v145;
    };
    const v162 = function (callback) {
        const v147 = chalk.magenta('LaTeX');
        const v148 = '...' + v147;
        const v149 = console.log(v148);
        v149;
        const v150 = config.engine;
        const v151 = [
            '-shell-escape',
            '-interaction',
            'nonstopmode',
            'template.tex'
        ];
        const v152 = config.tmpFolder;
        const v153 = { cwd: v152 };
        var compile = spawn(v150, v151, v153);
        const v155 = function (code) {
            const v154 = callback(null, true);
            v154;
        };
        const v156 = compile.on('close', v155);
        v156;
        const v157 = compile.stderr;
        const v160 = function (data) {
            const v158 = '' + data;
            const v159 = console.log(v158);
            v159;
        };
        const v161 = v157.on('data', v160);
        v161;
    };
    const v196 = function (callback) {
        const copyBibliography = function (cb) {
            const v163 = chalk.magenta('cp references.bib');
            const v164 = '...' + v163;
            const v165 = console.log(v164);
            v165;
            const v166 = config.tmpFolder;
            const v167 = path.join(v166, 'references.bib');
            var out = fs.createWriteStream(v167);
            const v168 = out.on('finish', cb);
            v168;
            const v169 = config.contentFolder;
            const v170 = path.join(v169, 'references.bib');
            const v171 = fs.createReadStream(v170);
            const v172 = v171.pipe(out);
            v172;
        };
        ;
        const latex = function (cb) {
            const v173 = chalk.magenta('LaTeX');
            const v174 = '...' + v173;
            const v175 = console.log(v174);
            v175;
            const v176 = config.engine;
            const v177 = [
                '-shell-escape',
                '-interaction',
                'nonstopmode',
                'template.tex'
            ];
            const v178 = config.tmpFolder;
            const v179 = { cwd: v178 };
            var compile = spawn(v176, v177, v179);
            const v181 = function (code) {
                const v180 = cb(null, true);
                v180;
            };
            const v182 = compile.on('close', v181);
            v182;
        };
        ;
        const bibtex = function (cb) {
            const v183 = chalk.magenta('BibTeX');
            const v184 = '...' + v183;
            const v185 = console.log(v184);
            v185;
            const v186 = ['template'];
            const v187 = config.tmpFolder;
            const v188 = { cwd: v187 };
            var compile = spawn('biber', v186, v188);
            const v190 = function (code) {
                const v189 = cb(null, true);
                v189;
            };
            const v191 = compile.on('close', v190);
            v191;
        };
        ;
        const v192 = [
            copyBibliography,
            latex,
            bibtex,
            latex,
            latex
        ];
        const v194 = function (err) {
            const v193 = callback(null);
            v193;
        };
        const v195 = async.series(v192, v194);
        v195;
    };
    const v197 = {};
    v197.updateConfig = v101;
    v197.pandoc = v123;
    v197.template = v136;
    v197.sty = v146;
    v197.latex = v162;
    v197.bibtex = v196;
    return v197;
};
module.exports = v198;