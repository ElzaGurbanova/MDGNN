'use strict';
const path = require('path');
const Command = require('../command');
const v158 = require('debug');
const debug = v158('egg-script:start');
const v159 = require('mz/child_process');
const exec = v159.exec;
const fs = require('mz/fs');
const homedir = require('node-homedir');
const mkdirp = require('mz-modules/mkdirp');
const moment = require('moment');
const sleep = require('mz-modules/sleep');
const v160 = require('child_process');
const spawn = v160.spawn;
const utils = require('egg-utils');
const StartCommand = function StartCommand(rawArgv) {
    const v161 = super(rawArgv);
    v161;
    this.usage = 'Usage: egg-scripts start [options] [baseDir]';
    const v162 = path.join(__dirname, '../start-cluster');
    this.serverBin = v162;
    const v163 = {};
    v163.description = 'process title description, use for kill grep, default to `egg-server-${APP_NAME}`';
    v163.type = 'string';
    const v164 = [
        'c',
        'cluster'
    ];
    const v165 = process.env;
    const v166 = v165.EGG_WORKERS;
    const v167 = {};
    v167.description = 'numbers of app workers, default to `os.cpus().length`';
    v167.type = 'number';
    v167.alias = v164;
    v167.default = v166;
    const v168 = process.env;
    const v169 = v168.PORT;
    const v170 = {};
    v170.description = 'listening port, default to `process.env.PORT`';
    v170.type = 'number';
    v170.alias = 'p';
    v170.default = v169;
    const v171 = process.env;
    const v172 = v171.EGG_SERVER_ENV;
    const v173 = {};
    v173.description = 'server env, default to `process.env.EGG_SERVER_ENV`';
    v173.default = v172;
    const v174 = {};
    v174.description = 'specify framework that can be absolute path or npm package';
    v174.type = 'string';
    const v175 = {};
    v175.description = 'whether run at background daemon mode';
    v175.type = 'boolean';
    const v176 = {};
    v176.description = 'customize stdout file';
    v176.type = 'string';
    const v177 = {};
    v177.description = 'customize stderr file';
    v177.type = 'string';
    const v178 = 300 * 1000;
    const v179 = {};
    v179.description = 'the maximum timeout when app starts';
    v179.type = 'number';
    v179.default = v178;
    const v180 = {};
    v180.description = 'whether ignore stderr when app starts';
    v180.type = 'boolean';
    const v181 = {};
    v181.title = v163;
    v181.workers = v167;
    v181.port = v170;
    v181.env = v173;
    v181.framework = v174;
    v181.daemon = v175;
    v181.stdout = v176;
    v181.stderr = v177;
    v181.timeout = v179;
    v181['ignore-stderr'] = v180;
    this.options = v181;
};
const description = function description() {
    return 'Start server at prod mode';
};
StartCommand.description = description;
const run = function* run(context) {
    const v182 = context;
    const argv = v182.argv;
    const env = v182.env;
    const cwd = v182.cwd;
    const execArgv = v182.execArgv;
    const HOME = homedir();
    const logDir = path.join(HOME, 'logs');
    const v183 = argv._;
    const v184 = v183[0];
    let baseDir = v184 || cwd;
    const v185 = path.isAbsolute(baseDir);
    const v186 = !v185;
    if (v186) {
        baseDir = path.join(cwd, baseDir);
    }
    argv.baseDir = baseDir;
    const isDaemon = argv.daemon;
    const v187 = argv.framework;
    const v188 = {
        framework: v187,
        baseDir
    };
    const v189 = this.getFrameworkPath(v188);
    argv.framework = yield v189;
    const v190 = argv.framework;
    const v191 = this.getFrameworkName(v190);
    this.frameworkName = yield v191;
    const v192 = path.join(baseDir, 'package.json');
    const pkgInfo = require(v192);
    const v193 = argv.title;
    const v194 = pkgInfo.name;
    argv.title = v193 || `egg-server-${ v194 }`;
    const v195 = argv.stdout;
    const v196 = path.join(logDir, 'master-stdout.log');
    argv.stdout = v195 || v196;
    const v197 = argv.stderr;
    const v198 = path.join(logDir, 'master-stderr.log');
    argv.stderr = v197 || v198;
    env.HOME = HOME;
    env.NODE_ENV = 'production';
    const v199 = path.join(baseDir, 'node_modules/.bin');
    const v200 = path.join(baseDir, '.node/bin');
    const v201 = env.PATH;
    const v202 = env.Path;
    const v203 = v201 || v202;
    const v204 = [
        v199,
        v200,
        v203
    ];
    const v207 = x => {
        const v205 = !x;
        const v206 = !v205;
        return v206;
    };
    const v208 = v204.filter(v207);
    const v209 = path.delimiter;
    const v210 = v208.join(v209);
    env.PATH = v210;
    env.ENABLE_NODE_LOG = 'YES';
    const v211 = env.NODE_LOG_DIR;
    const v212 = path.join(logDir, 'alinode');
    env.NODE_LOG_DIR = v211 || v212;
    const v213 = env.NODE_LOG_DIR;
    const v214 = mkdirp(v213);
    yield v214;
    const v215 = argv.env;
    if (v215) {
        const v216 = argv.env;
        env.EGG_SERVER_ENV = v216;
    }
    const options = {};
    options.execArgv = execArgv;
    options.env = env;
    options.stdio = 'inherit';
    options.detached = false;
    const v217 = this.logger;
    const v218 = this.frameworkName;
    const v219 = v217.info('Starting %s application at %s', v218, baseDir);
    v219;
    const ignoreKeys = [
        '_',
        '$0',
        'env',
        'daemon',
        'stdout',
        'stderr',
        'timeout',
        'ignore-stderr'
    ];
    const clusterOptions = stringify(argv, ignoreKeys);
    const v220 = [];
    const v221 = execArgv || v220;
    const v222 = this.serverBin;
    const v223 = argv.title;
    const eggArgs = [
        ...v221,
        v222,
        clusterOptions,
        `--title=${ v223 }`
    ];
    const v224 = this.logger;
    const v225 = eggArgs.join(' ');
    const v226 = v224.info('Run node %s', v225);
    v226;
    if (isDaemon) {
        const v227 = this.logger;
        const v228 = `Save log file to ${ logDir }`;
        const v229 = v227.info(v228);
        v229;
        const v230 = argv.stdout;
        const v231 = getRotatelog(v230);
        const v232 = argv.stderr;
        const v233 = getRotatelog(v232);
        const v234 = [
            v231,
            v233
        ];
        const stdout = (yield v234)[0];
        const stderr = (yield v234)[1];
        options.stdio = [
            'ignore',
            stdout,
            stderr,
            'ipc'
        ];
        options.detached = true;
        const v235 = spawn('node', eggArgs, options);
        this.child = v235;
        const child = this.child;
        this.isReady = false;
        const v247 = msg => {
            const v236 = msg.action;
            const v237 = v236 === 'egg-ready';
            const v238 = msg && v237;
            if (v238) {
                this.isReady = true;
                const v239 = this.logger;
                const v240 = this.frameworkName;
                const v241 = msg.data;
                const v242 = v241.address;
                const v243 = v239.info('%s started on %s', v240, v242);
                v243;
                const v244 = child.unref();
                v244;
                const v245 = child.disconnect();
                v245;
                const v246 = this.exit(0);
                v246;
            }
        };
        const v248 = child.on('message', v247);
        v248;
        const v249 = this.checkStatus(argv);
        yield v249;
    } else {
        const v250 = options.stdio;
        options.stdio = v250 || 'inherit';
        const v251 = eggArgs.join(' ');
        const v252 = debug('Run spawn `node %s`', v251);
        v252;
        const v253 = spawn('node', eggArgs, options);
        this.child = v253;
        const child = this.child;
        const v258 = code => {
            const v254 = code !== 0;
            if (v254) {
                const v255 = eggArgs.join(' ');
                const v256 = new Error(`spawn node ${ v255 } fail, exit code: ${ code }`);
                const v257 = child.emit('error', v256);
                v257;
            }
        };
        const v259 = child.once('exit', v258);
        v259;
        let signal;
        const v260 = [
            'SIGINT',
            'SIGQUIT',
            'SIGTERM'
        ];
        const v264 = event => {
            const v262 = () => {
                signal = event;
                const v261 = this.exit(0);
                v261;
            };
            const v263 = process.once(event, v262);
            v263;
        };
        const v265 = v260.forEach(v264);
        v265;
        const v269 = () => {
            const v266 = child.pid;
            const v267 = debug('Kill child %s with %s', v266, signal);
            v267;
            const v268 = child.kill(signal);
            v268;
        };
        const v270 = process.once('exit', v269);
        v270;
    }
};
StartCommand.run = run;
const getFrameworkPath = function* getFrameworkPath(params) {
    const v271 = utils.getFrameworkPath(params);
    return v271;
};
StartCommand.getFrameworkPath = getFrameworkPath;
const getFrameworkName = function* getFrameworkName(framework) {
    const pkgPath = path.join(framework, 'package.json');
    let name = 'egg';
    try {
        const pkg = require(pkgPath);
        const v272 = pkg.name;
        if (v272) {
            name = pkg.name;
        }
    } catch (_) {
    }
    return name;
};
StartCommand.getFrameworkName = getFrameworkName;
const checkStatus = function* checkStatus({
    stderr,
    timeout,
    'ignore-stderr': ignoreStdErr
}) {
    let count = 0;
    let hasError = false;
    let isSuccess = true;
    timeout = timeout / 1000;
    const v273 = this.isReady;
    let v274 = !v273;
    while (v274) {
        try {
            const v275 = fs.stat(stderr);
            const stat = yield v275;
            const v276 = stat.size;
            const v277 = v276 > 0;
            const v278 = stat && v277;
            if (v278) {
                hasError = true;
                break;
            }
        } catch (_) {
        }
        const v279 = count >= timeout;
        if (v279) {
            const v280 = this.logger;
            const v281 = v280.error('Start failed, %ds timeout', timeout);
            v281;
            isSuccess = false;
            break;
        }
        const v282 = sleep(1000);
        yield v282;
        const v283 = this.logger;
        const v284 = ++count;
        const v285 = v283.log('Wait Start: %d...', v284);
        v285;
        v274 = !v273;
    }
    if (hasError) {
        try {
            const v286 = 'tail -n 100 ' + stderr;
            const v287 = exec(v286);
            const stdout = (yield v287)[0];
            const v288 = this.logger;
            const v289 = v288.error('Got error when startup: ');
            v289;
            const v290 = this.logger;
            const v291 = v290.error(stdout);
            v291;
        } catch (_) {
        }
        isSuccess = ignoreStdErr;
        const v292 = this.logger;
        const v293 = v292.error('Start got error, see %s', stderr);
        v293;
        const v294 = this.logger;
        const v295 = v294.error('Or use `--ignore-stderr` to ignore stderr at startup.');
        v295;
    }
    const v296 = !isSuccess;
    if (v296) {
        const v297 = this.child;
        const v298 = v297.kill('SIGTERM');
        v298;
        const v299 = sleep(1000);
        yield v299;
        const v300 = this.exit(1);
        v300;
    }
};
StartCommand.checkStatus = checkStatus;
StartCommand['is_class'] = true;
const getRotatelog = function* (logfile) {
    const v301 = path.dirname(logfile);
    const v302 = mkdirp(v301);
    yield v302;
    const v303 = fs.exists(logfile);
    if (yield v303) {
        const v304 = moment();
        const timestamp = v304.format('.YYYYMMDD.HHmmss');
        const v305 = logfile + timestamp;
        const v306 = fs.rename(logfile, v305);
        yield v306;
    }
    const v307 = fs.open(logfile, 'a');
    return yield v307;
};
const stringify = function (obj, ignore) {
    const result = {};
    const v308 = Object.keys(obj);
    const v312 = key => {
        const v309 = ignore.includes(key);
        const v310 = !v309;
        if (v310) {
            const v311 = obj[key];
            result[key] = v311;
        }
    };
    const v313 = v308.forEach(v312);
    v313;
    const v314 = JSON.stringify(result);
    return v314;
};
module.exports = StartCommand;