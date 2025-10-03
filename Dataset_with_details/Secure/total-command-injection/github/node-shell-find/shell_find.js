var execFile = require('child_process').execFile;
var exec = require('child_process').exec; // kept for command() users outside
var escape = require('shell-escape');
var path = require('path');

var shellFind = {

  name: function(pattern) {
    this._command.push('-name', pattern);
    return this;
  },

  prune: function(pattern) {
    this._command.unshift('-name', pattern, '-prune', '-o');
    return this;
  },

  newer: function(filepath) {
    this._command.push('-newer', filepath);
    return this;
  },

  type: function(filetype) {
    this._command.push('-type', filetype[0]);
    return this;
  },

  // Build a shell-escaped string (legacy; keep for compatibility)
  command: function() {
    return escape(['find', this.rootDir].concat(this._command, '-print'));
  },

  // Build argv for execFile (no shell)
  _argv: function() {
    var root = this.rootDir;
    if (typeof root !== 'string' || !root) root = '.';
    // Avoid option-like root dirs
    if (path.basename(root).startsWith('-')) {
      root = './' + root;
    }
    return [root].concat(this._command).concat(['-print']);
  },
  
  follow: function() {
    this._command.push('-follow');
    return this;
  },

  exec: function(callback) {
    var args = this._argv(); // no shell
    execFile('find', args, this.options || {}, function(err, stdout, stderr) {
      if (err) {
        // Mimic previous behavior (stderr-first error)
        return callback(stderr || err.message);
      }
      var files = stdout.split('\n');
      if(files[files.length-1] === '') {
        files.pop(); // trailing newline
      }
      callback(null, files);
    });
  }
};

module.exports = function(rootDir, options) {
  var finder = Object.create(shellFind);
  finder._command = [];
  finder.rootDir = '.';
  finder.options = options;
  switch (typeof rootDir) {
    case 'string':
      finder.rootDir = rootDir;
      break;
    case 'object':
      finder.options = rootDir;
      break;
  }
  return finder;
};

