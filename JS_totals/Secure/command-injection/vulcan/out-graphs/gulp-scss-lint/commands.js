'use strict';
var Promise = require('bluebird');
var checkstyle = require('./checkstyle');
var dargs = require('dargs');
var child_process = require('child_process');
var scssLintCodes = {};
scssLintCodes['64'] = 'Command line usage error';
scssLintCodes['66'] = 'Input file did not exist or was not readable';
scssLintCodes['69'] = 'You need to have the scss_lint_reporter_checkstyle gem installed';
scssLintCodes['70'] = 'Internal software error';
scssLintCodes['78'] = 'Configuration error';
scssLintCodes['127'] = 'You need to have Ruby and scss-lint gem installed';
const generateCommand = function (filePaths, options) {
    var commandParts = ['scss-lint'];
    var excludes = [
        'bundleExec',
        'filePipeOutput',
        'reporterOutput',
        'endlessReporter',
        'src',
        'shell',
        'reporterOutputFormat',
        'customReport',
        'maxBuffer',
        'endless',
        'verbose',
        'sync'
    ];
    const v86 = options.bundleExec;
    if (v86) {
        const v87 = commandParts.unshift('bundle', 'exec');
        v87;
        const v88 = excludes.push('bundleExec');
        v88;
    }
    const v89 = { excludes: excludes };
    var optionsArgs = dargs(options, v89);
    const v90 = commandParts.concat(filePaths, optionsArgs);
    const v91 = v90.join(' ');
    return v91;
};
const execCommand = function (command, options) {
    const v114 = function (resolve, reject) {
        const v92 = process.env;
        const v93 = process.cwd();
        const v94 = options.maxBuffer;
        const v95 = 300 * 1024;
        const v96 = v94 || v95;
        const v97 = options.shell;
        var commandOptions = {};
        commandOptions.env = v92;
        commandOptions.cwd = v93;
        commandOptions.maxBuffer = v96;
        commandOptions.shell = v97;
        command = command.split(' ');
        const v98 = options.sync;
        const v99 = options.endless;
        const v100 = v98 || v99;
        if (v100) {
            const v101 = command[0];
            const v102 = command.slice(1);
            var commandResult = child_process.execFileSync(v101, v102);
            var error = null;
            const v103 = commandResult.status;
            if (v103) {
                const v104 = commandResult.status;
                error.code = v104;
                error = {};
                error = {};
            }
            const v105 = commandResult.stdout;
            const v106 = {
                error: error,
                report: v105
            };
            const v107 = resolve(v106);
            v107;
        } else {
            const v108 = command[0];
            const v109 = command.slice(1);
            const v112 = function (error, report) {
                const v110 = {
                    error: error,
                    report: report
                };
                const v111 = resolve(v110);
                v111;
            };
            const v113 = child_process.execFile(v108, v109, commandOptions, v112);
            v113;
        }
    };
    const v115 = new Promise(v114);
    return v115;
};
const configFileReadError = function (report, options) {
    const v116 = options.config;
    const v117 = 'No such file or directory(.*)' + v116;
    var re = new RegExp(v117, 'g');
    const v118 = re.test(report);
    return v118;
};
const execLintCommand = function (command, options) {
    const v165 = function (resolve, reject) {
        const v119 = execCommand(command, options);
        const v163 = function (result) {
            var error = result.error;
            var report = result.report;
            const v120 = error.code;
            const v121 = v120 !== 1;
            const v122 = error && v121;
            const v123 = error.code;
            const v124 = v123 !== 2;
            const v125 = v122 && v124;
            const v126 = error.code;
            const v127 = v126 !== 65;
            const v128 = v125 && v127;
            if (v128) {
                const v129 = error.code;
                const v130 = scssLintCodes[v129];
                if (v130) {
                    const v131 = error.code;
                    const v132 = v131 === 66;
                    const v133 = configFileReadError(report, options);
                    const v134 = v132 && v133;
                    if (v134) {
                        const v135 = reject('Config file did not exist or was not readable');
                        v135;
                    } else {
                        const v136 = error.code;
                        const v137 = scssLintCodes[v136];
                        const v138 = reject(v137);
                        v138;
                    }
                } else {
                    const v139 = error.code;
                    if (v139) {
                        const v140 = error.code;
                        const v141 = 'Error code ' + v140;
                        const v142 = v141 + '\n';
                        const v143 = v142 + error;
                        const v144 = reject(v143);
                        v144;
                    } else {
                        const v145 = reject(error);
                        v145;
                    }
                }
            } else {
                const v146 = error.code;
                const v147 = v146 === 1;
                const v148 = error && v147;
                const v149 = report.length;
                const v150 = v149 === 0;
                const v151 = v148 && v150;
                if (v151) {
                    const v152 = error.code;
                    const v153 = 'Error code ' + v152;
                    const v154 = v153 + '\n';
                    const v155 = v154 + error;
                    const v156 = reject(v155);
                    v156;
                } else {
                    const v157 = options.format;
                    const v158 = v157 === 'JSON';
                    if (v158) {
                        const v159 = JSON.parse(report);
                        const v160 = [v159];
                        const v161 = resolve(v160);
                        v161;
                    } else {
                        const v162 = checkstyle.toJSON(report, resolve);
                        v162;
                    }
                }
            }
        };
        const v164 = v119.then(v163);
        v164;
    };
    const v166 = new Promise(v165);
    return v166;
};
const v170 = function (filePaths, options) {
    var command = generateCommand(filePaths, options);
    const v167 = options.verbose;
    if (v167) {
        const v168 = console.log(command);
        v168;
    }
    const v169 = execLintCommand(command, options);
    return v169;
};
module.exports = v170;