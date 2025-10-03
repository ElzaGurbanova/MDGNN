'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var _ = require('lodash');
var _shell = require('shelljs');
var esc = require('shell-escape');
var VError = require('verror');
var core = require('../core.js');
var Promise = require('../promise.js');

function getEnvironment(opts) {
  if (opts && opts.app) {
    var processEnv = _.cloneDeep(process.env);
    var appEnv = opts.app.env.getEnv();
    return _.merge(processEnv, appEnv);
  } else {
    return process.env;
  }
}

function trollStdout(opts, msg) {
  var app = _.get(opts, 'app');
  if (app && msg) {
    app.trollForStatus(msg);
  }
}

function splitArgs(str) {
  if (!str) return [];
  var out = [];
  var re = /"([^"]*)"|'([^']*)'|(\S+)/g, m;
  while ((m = re.exec(str))) out.push(m[1] || m[2] || m[3]);
  return out;
}

/**
 * Executes a command safely (no shell).
 * @arg {string|Array} cmd - Program & args, e.g. "git status" or ["git","status"].
 * @arg {Object} opts
 */
exports.exec = function(cmd, opts) {
  var defaults = { silent: true };
  var options = (opts) ? _.extend(defaults, opts) : defaults;

  options.env = getEnvironment(options);

  var execLog = core.log.make('UTIL EXEC');
  execLog.debug([cmd, opts]);

  return new Promise(function(resolve, reject) {
    var argv = Array.isArray(cmd) ? cmd.slice() : splitArgs(String(cmd));
    if (argv.length === 0) return reject(new VError('Empty command'));

    var entrypoint = argv.shift();
    var child = spawn(entrypoint, argv, {
      env: options.env,
      cwd: options.cwd,
      stdio: 'pipe',
      shell: false
    });

    var stdout = '', stderr = '';

    child.stdout.on('data', function (buf) {
      var s = String(buf);
      if (!options.silent) process.stdout.write(s);
      stdout += s;
      trollStdout(options, _.trim(s));
    });

    child.stderr.on('data', function (buf) {
      var s = String(buf);
      if (!options.silent) process.stderr.write(s);
      stderr += s;
    });

    child.on('error', function (err) {
      reject(new VError(err, 'spawn failed'));
    });

    child.on('close', function (code) {
      if (code !== 0) {
        reject(new VError('code: ' + code + 'err:' + stderr));
      } else {
        resolve(stdout);
      }
    });
  });
};

/**
 * Spawns a shell command (already safe: argv, no shell)
 */
exports.spawn = function(cmd, opts) {
  return new Promise(function(resolve, reject) {
    var defaults = {stdio: ['pipe', 'pipe', 'pipe']};
    var options = (opts) ? _.extend(defaults, opts) : defaults;

    options.env = getEnvironment(opts);

    var entrypoint = cmd.shift();
    var run = spawn(entrypoint, cmd, options);

    var spawnLog = core.log.make(path.basename(entrypoint).toUpperCase());
    spawnLog.debug([entrypoint, cmd, options]);

    var stdOut = '';
    var stdErr = '';

    if (options.stdio === 'pipe' || options.stdio[1] === 'pipe') {
      run.stdout.on('data', function(buffer) {
        spawnLog.info(_.trim(String(buffer)));
        stdOut = stdOut + String(buffer);
        trollStdout(options, _.trim(String(buffer)));
      });
    }

    run.on('error', function(buffer) {
      spawnLog.info(_.trim(String(buffer)));
      stdErr = stdErr + String(buffer);
    });

    run.on('close', function(code) {
      spawnLog.info('Run exited with code: ' + code);
      if (code !== 0) {
        reject(new VError('code' + code + 'err:' + stdErr + 'more:' + stdOut));
      }
      else {
        resolve(stdOut);
      }
    });

  });
};

exports.escSpaces = function(s, platform) {
  var p = platform || process.platform;
  if (_.isArray(s)) s = s.join(' ');
  if (p === 'win32') return s.replace(/ /g, '^ ');
  else return s.replace(/ /g, '\ ');
};

exports.esc = esc;
exports.which = _shell.which;

