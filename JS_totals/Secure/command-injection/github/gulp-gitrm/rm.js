var map = require('map-stream');
var gutil = require('gulp-util');
var execFile = require('child_process').execFile;

module.exports = function (opt) {
  if (!opt) opt = {};
  if (!opt.args) opt.args = ' ';

  function rm(file, cb) {
    if (!file.path) throw new Error('gulp-git: file is required');

    // Parse extra args to an argv array (simple split is fine for git options)
    var extra = String(opt.args || '').trim();
    var extraArgs = extra ? extra.split(/\s+/).filter(Boolean) : [];

    // git rm -- <file> [extra args]
    var argv = ['rm', '--', file.path].concat(extraArgs);

    execFile('git', argv, { cwd: file.cwd }, function (err, stdout, stderr) {
      if (err && cb) return cb(err);
      gutil.log(stdout || '', stderr || '');
      if (cb) cb(null, file);
    });
  }

  // Return a stream
  return map(rm);
};

