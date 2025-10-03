'use strict';

var Transform = require('stream').Transform;
var log = require('fancy-log');
var execFile = require('child_process').execFile;
var path = require('path');

// Basic argv splitter that respects simple single/double quotes
function toArgv(str) {
  if (!str || typeof str !== 'string') return [];
  var r = [];
  var m;
  var re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  while ((m = re.exec(str))) {
    r.push(m[1] || m[2] || m[3]);
  }
  return r;
}

// want to get the current git hash instead?
// git.revParse({args:'--short HEAD'})

module.exports = function (message, opt) {
  if (!opt) opt = {};
  if (!message) {
    if (opt.args && opt.args.indexOf('--amend') === -1 && opt.disableMessageRequirement !== true) {
      throw new Error('gulp-git: Commit message is required git.commit("commit message") or --amend arg must be given');
    }
  }
  if (!opt.cwd) opt.cwd = process.cwd();
  if (!opt.maxBuffer) opt.maxBuffer = 200 * 1024; // Default for child_process.exec
  if (!opt.args) opt.args = ' ';

  var files = [];
  var paths = [];

  var write = function (file, enc, cb) {
    files.push(file);
    paths.push(path.relative(opt.cwd, file.path).replace('\\', '/'));
    cb();
  };

  var flush = function (cb) {
    var writeStdin = false;
    var gitArgs = ['commit'];

    // Allow delayed execution to determine the message
    if (typeof message === 'function') {
      message = message();
    }

    var userArgs = toArgv(opt.args);

    // Determine if amending
    var isAmend = userArgs.indexOf('--amend') !== -1;

    if (message && !isAmend) {
      if (Array.isArray(message)) {
        if (opt.multiline) {
          writeStdin = true;
          message = message.join('\n');
        } else {
          for (var i = 0; i < message.length; i++) {
            gitArgs.push('-m', String(message[i]));
          }
        }
        if (!opt.disableAppendPaths && paths.length) {
          gitArgs = gitArgs.concat(paths);
        }
      } else {
        if (String(message).indexOf('\n') !== -1) {
          writeStdin = true;
        } else {
          gitArgs.push('-m', String(message));
        }
        if (!opt.disableAppendPaths && paths.length) {
          gitArgs = gitArgs.concat(paths);
        }
      }
    } else if (opt.disableMessageRequirement === true) {
      // no message; just use args below
    } else {
      // Amending: add -a and avoid editor, preserving any user args
      gitArgs.push('-a');
      if (userArgs.indexOf('--no-edit') === -1) {
        userArgs = userArgs.concat(['--no-edit']);
      }
    }

    // Append user-provided args safely (parsed into argv)
    if (userArgs.length) {
      gitArgs = gitArgs.concat(userArgs);
    }

    // Original behavior appended '.' when not disabling path appends
    if (!opt.disableAppendPaths) {
      gitArgs.push('.');
    }

    var self = this;

    // Execute without a shell; pass message via stdin when needed
    var child = execFile('git', gitArgs, { cwd: opt.cwd, maxBuffer: opt.maxBuffer, shell: false }, function (err, stdout, stderr) {
      // Preserve original special-case handling
      var outStr = String(stdout || '');
      if (err && outStr.indexOf('no changes added to commit') === 0) {
        return cb(err);
      }
      if (!opt.quiet) log(stdout, stderr);
      files.forEach(self.push.bind(self));
      self.emit('end');
      return cb();
    });

    if (writeStdin) {
      child.stdin.write(String(message));
      child.stdin.end();
    }

    if (opt.emitData) {
      child.stdout.on('data', function (data) {
        self.emit('data', data);
      });
      child.stderr.on('data', function (data) {
        self.emit('data', data);
      });
    }
  };

  return new Transform({
    objectMode: true,
    transform: write,
    flush
  });
};

