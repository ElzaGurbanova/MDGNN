const v75 = require('./reduceStream');
var concat = v75.concat;
const v76 = require('child_process');
var exec = v76.exec;
var Err = require('./errors');
const v94 = function (options, cb) {
    const v77 = options.dependencies;
    const v78 = options.production;
    const v79 = v78 || false;
    const v80 = options.loglevel;
    const v81 = v80 || undefined;
    const v82 = options.save;
    const v83 = v82 || false;
    const v84 = options.saveDev;
    const v85 = v84 || false;
    const v86 = options.saveExact;
    const v87 = v86 || false;
    const v88 = options.prefix;
    const v89 = v88 || undefined;
    const v90 = {};
    v90.production = v79;
    v90.loglevel = v81;
    v90.save = v83;
    v90['save-dev'] = v85;
    v90['save-exact'] = v87;
    v90.prefix = v89;
    const v91 = options.dir;
    const v92 = {
        npmCommand: 'install',
        cmdArgs: v77,
        cmdOptions: v90,
        dir: v91
    };
    const v93 = doNpmCommand(v92, cb);
    return v93;
};
const v108 = function (options, cb) {
    const v95 = options.path;
    const v96 = v95 || '';
    const v97 = [];
    const v98 = options.production;
    const v99 = v98 || false;
    const v100 = options.loglevel;
    const v101 = v100 || undefined;
    const v102 = options.prefix;
    const v103 = v102 || undefined;
    const v104 = {};
    v104.production = v99;
    v104.loglevel = v101;
    v104.prefix = v103;
    const v105 = options.dir;
    const v106 = {
        npmCommand: 'update',
        path: v96,
        cmdArgs: v97,
        cmdOptions: v104,
        dir: v105
    };
    const v107 = doNpmCommand(v106, cb);
    return v107;
};
const v109 = {};
v109.install = v94;
v109.update = v108;
module.exports = v109;
const doNpmCommand = function (options, cb) {
    const v110 = function () {
    };
    cb = cb || v110;
    const v111 = options.npmCommand;
    const v112 = !v111;
    if (v112) {
        const v113 = new Error('`npmCommand` option is required');
        const v114 = cb(v113);
        return v114;
    }
    const v115 = options.cmdOptions;
    const v116 = {};
    options.cmdOptions = v115 || v116;
    const v117 = options.cmdArgs;
    const v118 = [];
    options.cmdArgs = v117 || v118;
    var NPM_V_OUTPUT = /^[0-9]+\.[0-9]+\.[0-9]+/;
    const v119 = exec('npm -v');
    var stdout$npm_v = v119.stdout;
    const v147 = function (err, result) {
        if (err) {
            const v120 = cb(err);
            return v120;
        }
        const v121 = typeof result;
        const v122 = v121 !== 'string';
        const v123 = result.match(NPM_V_OUTPUT);
        const v124 = !v123;
        const v125 = v122 || v124;
        if (v125) {
            const v126 = Err.cantFindNpm(result);
            const v127 = cb(v126);
            return v127;
        }
        var cmd = '';
        const v128 = options.npmCommand;
        const v129 = 'npm ' + v128;
        cmd += v129 + ' ';
        const v130 = options.cmdArgs;
        cmd += v130.join(' ');
        cmd += ' ';
        let key;
        const v131 = options.cmdOptions;
        for (key in v131) {
            const v132 = options.cmdOptions;
            const v133 = v132[key];
            const v134 = v133 !== undefined;
            if (v134) {
                const v135 = '--' + key;
                const v136 = v135 + '=';
                const v137 = options.cmdOptions;
                const v138 = v137[key];
                const v139 = v136 + v138;
                cmd += v139 + ' ';
            }
        }
        cmd += '';
        const v140 = options.dir;
        const v141 = { cwd: v140 };
        var npm = exec(cmd, v141);
        var stderr$npm = npm.stderr;
        var stdout$npm = npm.stdout;
        const v142 = process.stderr;
        const v143 = stderr$npm.pipe(v142);
        v143;
        const v145 = function onSuccess() {
            const v144 = cb();
            v144;
        };
        const v146 = npm.on('exit', v145);
        v146;
    };
    const v148 = concat(stdout$npm_v, v147);
    v148;
};