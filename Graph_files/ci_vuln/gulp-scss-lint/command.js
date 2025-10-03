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
    const v82 = options.bundleExec;
    if (v82) {
        const v83 = commandParts.unshift('bundle', 'exec');
        v83;
        const v84 = excludes.push('bundleExec');
        v84;
    }
    const v85 = { excludes: excludes };
    var optionsArgs = dargs(options, v85);
    const v86 = commandParts.concat(filePaths, optionsArgs);
    const v87 = v86.join(' ');
    return v87;
};
const execCommand = function (command, options) {
    const v106 = function (resolve, reject) {
        const v88 = process.env;
        const v89 = process.cwd();
        const v90 = options.maxBuffer;
        const v91 = 300 * 1024;
        const v92 = v90 || v91;
        const v93 = options.shell;
        var commandOptions = {};
        commandOptions.env = v88;
        commandOptions.cwd = v89;
        commandOptions.maxBuffer = v92;
        commandOptions.shell = v93;
        const v94 = options.sync;
        const v95 = options.endless;
        const v96 = v94 || v95;
        if (v96) {
            var commandResult = child_process.execSync(command);
            var error = null;
            const v97 = commandResult.status;
            if (v97) {
                const v98 = commandResult.status;
                error.code = v98;
                error = {};
                error = {};
            }
            const v99 = commandResult.stdout;
            const v100 = {
                error: error,
                report: v99
            };
            const v101 = resolve(v100);
            v101;
        } else {
            const v104 = function (error, report) {
                const v102 = {
                    error: error,
                    report: report
                };
                const v103 = resolve(v102);
                v103;
            };
            const v105 = child_process.exec(command, commandOptions, v104);
            v105;
        }
    };
    const v107 = new Promise(v106);
    return v107;
};
const configFileReadError = function (report, options) {
    const v108 = options.config;
    const v109 = 'No such file or directory(.*)' + v108;
    var re = new RegExp(v109, 'g');
    const v110 = re.test(report);
    return v110;
};
const execLintCommand = function (command, options) {
    const v157 = function (resolve, reject) {
        const v111 = execCommand(command, options);
        const v155 = function (result) {
            var error = result.error;
            var report = result.report;
            const v112 = error.code;
            const v113 = v112 !== 1;
            const v114 = error && v113;
            const v115 = error.code;
            const v116 = v115 !== 2;
            const v117 = v114 && v116;
            const v118 = error.code;
            const v119 = v118 !== 65;
            const v120 = v117 && v119;
            if (v120) {
                const v121 = error.code;
                const v122 = scssLintCodes[v121];
                if (v122) {
                    const v123 = error.code;
                    const v124 = v123 === 66;
                    const v125 = configFileReadError(report, options);
                    const v126 = v124 && v125;
                    if (v126) {
                        const v127 = reject('Config file did not exist or was not readable');
                        v127;
                    } else {
                        const v128 = error.code;
                        const v129 = scssLintCodes[v128];
                        const v130 = reject(v129);
                        v130;
                    }
                } else {
                    const v131 = error.code;
                    if (v131) {
                        const v132 = error.code;
                        const v133 = 'Error code ' + v132;
                        const v134 = v133 + '\n';
                        const v135 = v134 + error;
                        const v136 = reject(v135);
                        v136;
                    } else {
                        const v137 = reject(error);
                        v137;
                    }
                }
            } else {
                const v138 = error.code;
                const v139 = v138 === 1;
                const v140 = error && v139;
                const v141 = report.length;
                const v142 = v141 === 0;
                const v143 = v140 && v142;
                if (v143) {
                    const v144 = error.code;
                    const v145 = 'Error code ' + v144;
                    const v146 = v145 + '\n';
                    const v147 = v146 + error;
                    const v148 = reject(v147);
                    v148;
                } else {
                    const v149 = options.format;
                    const v150 = v149 === 'JSON';
                    if (v150) {
                        const v151 = JSON.parse(report);
                        const v152 = [v151];
                        const v153 = resolve(v152);
                        v153;
                    } else {
                        const v154 = checkstyle.toJSON(report, resolve);
                        v154;
                    }
                }
            }
        };
        const v156 = v111.then(v155);
        v156;
    };
    const v158 = new Promise(v157);
    return v158;
};
const v162 = function (filePaths, options) {
    var command = generateCommand(filePaths, options);
    const v159 = options.verbose;
    if (v159) {
        const v160 = console.log(command);
        v160;
    }
    const v161 = execLintCommand(command, options);
    return v161;
};
module.exports = v162;