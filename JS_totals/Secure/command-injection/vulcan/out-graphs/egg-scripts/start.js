'use strict';
const path = require('path');
const Command = require('../command');
const v162 = require('debug');
const debug = v162('egg-script:start');
const v163 = require('mz/child_process');
const execFile = v163.execFile;
const fs = require('mz/fs');
const homedir = require('node-homedir');
const mkdirp = require('mz-modules/mkdirp');
const moment = require('moment');
const sleep = require('mz-modules/sleep');
const v164 = require('child_process');
const spawn = v164.spawn;
const utils = require('egg-utils');
const StartCommand = function StartCommand(rawArgv) {
    const v165 = super(rawArgv);
    v165;
    this.usage = 'Usage: egg-scripts start [options] [baseDir]';
    const v166 = path.join(__dirname, '../start-cluster');
    this.serverBin = v166;
    const v167 = {};
    v167.description = 'process title description, use for kill grep, default to `egg-server-${APP_NAME}`';
    v167.type = 'string';
    const v168 = [
        'c',
        'cluster'
    ];
    const v169 = process.env;
    const v170 = v169.EGG_WORKERS;
    const v171 = {};
    v171.description = 'numbers of app workers, default to `os.cpus().length`';
    v171.type = 'number';
    v171.alias = v168;
    v171.default = v170;
    const v172 = process.env;
    const v173 = v172.PORT;
    const v174 = {};
    v174.description = 'listening port, default to `process.env.PORT`';
    v174.type = 'number';
    v174.alias = 'p';
    v174.default = v173;
    const v175 = process.env;
    const v176 = v175.EGG_SERVER_ENV;
    const v177 = {};
    v177.description = 'server env, default to `process.env.EGG_SERVER_ENV`';
    v177.default = v176;
    const v178 = {};
    v178.description = 'specify framework that can be absolute path or npm package';
    v178.type = 'string';
    const v179 = {};
    v179.description = 'whether run at background daemon mode';
    v179.type = 'boolean';
    const v180 = {};
    v180.description = 'customize stdout file';
    v180.type = 'string';
    const v181 = {};
    v181.description = 'customize stderr file';
    v181.type = 'string';
    const v182 = 300 * 1000;
    const v183 = {};
    v183.description = 'the maximum timeout when app starts';
    v183.type = 'number';
    v183.default = v182;
    const v184 = {};
    v184.description = 'whether ignore stderr when app starts';
    v184.type = 'boolean';
    const v185 = {};
    v185.title = v167;
    v185.workers = v171;
    v185.port = v174;
    v185.env = v177;
    v185.framework = v178;
    v185.daemon = v179;
    v185.stdout = v180;
    v185.stderr = v181;
    v185.timeout = v183;
    v185['ignore-stderr'] = v184;
    this.options = v185;
};
const description = function description() {
    return 'Start server at prod mode';
};
StartCommand.description = description;
const run = function* run(context) {
    const v186 = context;
    const argv = v186.argv;
    const env = v186.env;
    const cwd = v186.cwd;
    const execArgv = v186.execArgv;
    const HOME = homedir();
    const logDir = path.join(HOME, 'logs');
    const v187 = argv._;
    const v188 = v187[0];
    let baseDir = v188 || cwd;
    const v189 = path.isAbsolute(baseDir);
    const v190 = !v189;
    if (v190) {
        baseDir = path.join(cwd, baseDir);
    }
    argv.baseDir = baseDir;
    const isDaemon = argv.daemon;
    const v191 = argv.framework;
    const v192 = {
        framework: v191,
        baseDir
    };
    const v193 = this.getFrameworkPath(v192);
    argv.framework = yield v193;
    const v194 = argv.framework;
    const v195 = this.getFrameworkName(v194);
    this.frameworkName = yield v195;
    const v196 = path.join(baseDir, 'package.json');
    const pkgInfo = require(v196);
    const v197 = argv.title;
    const v198 = pkgInfo.name;
    argv.title = v197 || `egg-server-${ v198 }`;
    const v199 = argv.stdout;
    const v200 = path.join(logDir, 'master-stdout.log');
    argv.stdout = v199 || v200;
    const v201 = argv.stderr;
    const v202 = path.join(logDir, 'master-stderr.log');
    argv.stderr = v201 || v202;
    env.HOME = HOME;
    env.NODE_ENV = 'production';
    const v203 = path.join(baseDir, 'node_modules/.bin');
    const v204 = path.join(baseDir, '.node/bin');
    const v205 = env.PATH;
    const v206 = env.Path;
    const v207 = v205 || v206;
    const v208 = [
        v203,
        v204,
        v207
    ];
    const v211 = x => {
        const v209 = !x;
        const v210 = !v209;
        return v210;
    };
    const v212 = v208.filter(v211);
    const v213 = path.delimiter;
    const v214 = v212.join(v213);
    env.PATH = v214;
    env.ENABLE_NODE_LOG = 'YES';
    const v215 = env.NODE_LOG_DIR;
    const v216 = path.join(logDir, 'alinode');
    env.NODE_LOG_DIR = v215 || v216;
    const v217 = env.NODE_LOG_DIR;
    const v218 = mkdirp(v217);
    yield v218;
    const v219 = argv.env;
    if (v219) {
        const v220 = argv.env;
        env.EGG_SERVER_ENV = v220;
    }
    const options = {};
    options.execArgv = execArgv;
    options.env = env;
    options.stdio = 'inherit';
    options.detached = false;
    const v221 = this.logger;
    const v222 = this.frameworkName;
    const v223 = v221.info('Starting %s application at %s', v222, baseDir);
    v223;
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
    const v224 = [];
    const v225 = execArgv || v224;
    const v226 = this.serverBin;
    const v227 = argv.title;
    const eggArgs = [
        ...v225,
        v226,
        clusterOptions,
        `--title=${ v227 }`
    ];
    const v228 = this.logger;
    const v229 = eggArgs.join(' ');
    const v230 = v228.info('Run node %s', v229);
    v230;
    if (isDaemon) {
        const v231 = this.logger;
        const v232 = `Save log file to ${ logDir }`;
        const v233 = v231.info(v232);
        v233;
        const v234 = argv.stdout;
        const v235 = getRotatelog(v234);
        const v236 = argv.stderr;
        const v237 = getRotatelog(v236);
        const v238 = [
            v235,
            v237
        ];
        const stdout = (yield v238)[0];
        const stderr = (yield v238)[1];
        options.stdio = [
            'ignore',
            stdout,
            stderr,
            'ipc'
        ];
        options.detached = true;
        const v239 = spawn('node', eggArgs, options);
        this.child = v239;
        const child = this.child;
        this.isReady = false;
        const v251 = msg => {
            const v240 = msg.action;
            const v241 = v240 === 'egg-ready';
            const v242 = msg && v241;
            if (v242) {
                this.isReady = true;
                const v243 = this.logger;
                const v244 = this.frameworkName;
                const v245 = msg.data;
                const v246 = v245.address;
                const v247 = v243.info('%s started on %s', v244, v246);
                v247;
                const v248 = child.unref();
                v248;
                const v249 = child.disconnect();
                v249;
                const v250 = this.exit(0);
                v250;
            }
        };
        const v252 = child.on('message', v251);
        v252;
        const v253 = this.checkStatus(argv);
        yield v253;
    } else {
        const v254 = options.stdio;
        options.stdio = v254 || 'inherit';
        const v255 = eggArgs.join(' ');
        const v256 = debug('Run spawn `node %s`', v255);
        v256;
        const v257 = spawn('node', eggArgs, options);
        this.child = v257;
        const child = this.child;
        const v262 = code => {
            const v258 = code !== 0;
            if (v258) {
                const v259 = eggArgs.join(' ');
                const v260 = new Error(`spawn node ${ v259 } fail, exit code: ${ code }`);
                const v261 = child.emit('error', v260);
                v261;
            }
        };
        const v263 = child.once('exit', v262);
        v263;
        let signal;
        const v264 = [
            'SIGINT',
            'SIGQUIT',
            'SIGTERM'
        ];
        const v268 = event => {
            const v266 = () => {
                signal = event;
                const v265 = this.exit(0);
                v265;
            };
            const v267 = process.once(event, v266);
            v267;
        };
        const v269 = v264.forEach(v268);
        v269;
        const v273 = () => {
            const v270 = child.pid;
            const v271 = debug('Kill child %s with %s', v270, signal);
            v271;
            const v272 = child.kill(signal);
            v272;
        };
        const v274 = process.once('exit', v273);
        v274;
    }
};
StartCommand.run = run;
const getFrameworkPath = function* getFrameworkPath(params) {
    const v275 = utils.getFrameworkPath(params);
    return v275;
};
StartCommand.getFrameworkPath = getFrameworkPath;
const getFrameworkName = function* getFrameworkName(framework) {
    const pkgPath = path.join(framework, 'package.json');
    let name = 'egg';
    try {
        const pkg = require(pkgPath);
        const v276 = pkg.name;
        if (v276) {
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
    const v277 = this.isReady;
    let v278 = !v277;
    while (v278) {
        try {
            const v279 = fs.stat(stderr);
            const stat = yield v279;
            const v280 = stat.size;
            const v281 = v280 > 0;
            const v282 = stat && v281;
            if (v282) {
                hasError = true;
                break;
            }
        } catch (_) {
        }
        const v283 = count >= timeout;
        if (v283) {
            const v284 = this.logger;
            const v285 = v284.error('Start failed, %ds timeout', timeout);
            v285;
            isSuccess = false;
            break;
        }
        const v286 = sleep(1000);
        yield v286;
        const v287 = this.logger;
        const v288 = ++count;
        const v289 = v287.log('Wait Start: %d...', v288);
        v289;
        v278 = !v277;
    }
    if (hasError) {
        try {
            const args = [
                '-n',
                '100',
                stderr
            ];
            const v290 = this.logger;
            const v291 = args.join(' ');
            const v292 = v290.error('tail %s', v291);
            v292;
            const v293 = execFile('tail', args);
            const stdout = (yield v293)[0];
            const v294 = this.logger;
            const v295 = v294.error('Got error when startup: ');
            v295;
            const v296 = this.logger;
            const v297 = v296.error(stdout);
            v297;
        } catch (err) {
            const v298 = this.logger;
            const v299 = v298.error('ignore tail error: %s', err);
            v299;
        }
        isSuccess = ignoreStdErr;
        const v300 = this.logger;
        const v301 = v300.error('Start got error, see %s', stderr);
        v301;
        const v302 = this.logger;
        const v303 = v302.error('Or use `--ignore-stderr` to ignore stderr at startup.');
        v303;
    }
    const v304 = !isSuccess;
    if (v304) {
        const v305 = this.child;
        const v306 = v305.kill('SIGTERM');
        v306;
        const v307 = sleep(1000);
        yield v307;
        const v308 = this.exit(1);
        v308;
    }
};
StartCommand.checkStatus = checkStatus;
StartCommand['is_class'] = true;
const getRotatelog = function* (logfile) {
    const v309 = path.dirname(logfile);
    const v310 = mkdirp(v309);
    yield v310;
    const v311 = fs.exists(logfile);
    if (yield v311) {
        const v312 = moment();
        const timestamp = v312.format('.YYYYMMDD.HHmmss');
        const v313 = logfile + timestamp;
        const v314 = fs.rename(logfile, v313);
        yield v314;
    }
    const v315 = fs.open(logfile, 'a');
    return yield v315;
};
const stringify = function (obj, ignore) {
    const result = {};
    const v316 = Object.keys(obj);
    const v320 = key => {
        const v317 = ignore.includes(key);
        const v318 = !v317;
        if (v318) {
            const v319 = obj[key];
            result[key] = v319;
        }
    };
    const v321 = v316.forEach(v320);
    v321;
    const v322 = JSON.stringify(result);
    return v322;
};
module.exports = StartCommand;