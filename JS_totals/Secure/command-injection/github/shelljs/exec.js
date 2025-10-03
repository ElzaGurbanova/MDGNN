var path = require('path');
var fs = require('fs');
var child = require('child_process');
var common = require('./common');
var _tempDir = require('./tempdir').tempDir;
var _pwd = require('./pwd');

var DEFAULT_MAXBUFFER_SIZE = 20 * 1024 * 1024;
var DEFAULT_ERROR_CODE = 1;

common.register('exec', _exec, {
  unix: false,
  canReceivePipe: true,
  wrapOutput: false,
  handlesFatalDynamically: true,
});

// We use this function to run `exec` synchronously while also providing realtime
// output.
function execSync(cmd, opts, pipe) {
  // If the caller provides an array form [file, ...args], avoid shell entirely
  if (Array.isArray(cmd)) {
    opts = common.extend({
      silent: common.config.silent,
      fatal: common.config.fatal,
      cwd: _pwd().toString(),
      env: process.env,
      maxBuffer: DEFAULT_MAXBUFFER_SIZE,
      encoding: 'utf8',
    }, opts);

    // Normalize cwd for both sync/async paths
    opts.cwd = path.resolve(opts.cwd);

    var file = cmd[0];
    var args = cmd.slice(1);

    // Run safely without a shell; capture output
    var res = child.spawnSync(file, args, {
      cwd: opts.cwd,
      env: opts.env,
      input: pipe,
      encoding: opts.encoding === 'buffer' ? undefined : opts.encoding,
      maxBuffer: opts.maxBuffer,
      shell: false,
    });

    var code = res.status;
    if (res.error) {
      code = res.status || DEFAULT_ERROR_CODE;
    }

    var stdout = (opts.encoding === 'buffer') ? (res.stdout || Buffer.alloc(0)) : (res.stdout || '');
    var stderr = (opts.encoding === 'buffer') ? (res.stderr || Buffer.alloc(0)) : (res.stderr || '');

    if (!opts.silent) {
      // Not realtime, but mirrors prior behavior of printing output when not silent
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
    }

    if (code !== 0) {
      // Avoid double printing
      common.error(stderr, code, { continue: true, silent: true, fatal: opts.fatal });
    }
    return common.ShellString(stdout, stderr, code);
  }

  // ---- existing string-command path (uses helper child script) ----

  if (!common.config.execPath) {
    try {
      common.error('Unable to find a path to the node binary. Please manually set config.execPath');
    } catch (e) {
      if (opts && opts.fatal) {
        throw e;
      }
      return;
    }
  }

  var tempDir = _tempDir();
  var paramsFile = path.join(tempDir, common.randomFileName());
  var stderrFile = path.join(tempDir, common.randomFileName());
  var stdoutFile = path.join(tempDir, common.randomFileName());

  opts = common.extend({
    silent: common.config.silent,
    fatal: common.config.fatal, // TODO(nfischer): this and the line above are probably unnecessary
    cwd: _pwd().toString(),
    env: process.env,
    maxBuffer: DEFAULT_MAXBUFFER_SIZE,
    encoding: 'utf8',
  }, opts);

  if (fs.existsSync(paramsFile)) common.unlinkSync(paramsFile);
  if (fs.existsSync(stderrFile)) common.unlinkSync(stderrFile);
  if (fs.existsSync(stdoutFile)) common.unlinkSync(stdoutFile);

  opts.cwd = path.resolve(opts.cwd);

  var paramsToSerialize = {
    command: cmd,
    execOptions: opts,
    pipe,
    stdoutFile,
    stderrFile,
  };

  // Create the files and ensure these are locked down (for read and write) to
  // the current user. The main concerns here are:
  //
  // * If we execute a command which prints sensitive output, then
  //   stdoutFile/stderrFile must not be readable by other users.
  // * paramsFile must not be readable by other users, or else they can read it
  //   to figure out the path for stdoutFile/stderrFile and create these first
  //   (locked down to their own access), which will crash exec() when it tries
  //   to write to the files.
  function writeFileLockedDown(filePath, data) {
    fs.writeFileSync(filePath, data, {
      encoding: 'utf8',
      mode: parseInt('600', 8),
    });
  }
  writeFileLockedDown(stdoutFile, '');
  writeFileLockedDown(stderrFile, '');
  writeFileLockedDown(paramsFile, JSON.stringify(paramsToSerialize));

  var execArgs = [
    path.join(__dirname, 'exec-child.js'),
    paramsFile,
  ];

  /* istanbul ignore else */
  if (opts.silent) {
    opts.stdio = 'ignore';
  } else {
    opts.stdio = [0, 1, 2];
  }

  var code = 0;

  // Welcome to the future
  try {
    // Bad things if we pass in a `shell` option to child_process.execFileSync,
    // so we need to explicitly remove it here.
    delete opts.shell;

    child.execFileSync(common.config.execPath, execArgs, opts);
  } catch (e) {
    // Commands with non-zero exit code raise an exception.
    code = e.status || DEFAULT_ERROR_CODE;
  }

  // fs.readFileSync uses buffer encoding by default, so call
  // it without the encoding option if the encoding is 'buffer'.
  // Also, if the exec timeout is too short for node to start up,
  // the files will not be created, so these calls will throw.
  var stdout = '';
  var stderr = '';
  if (opts.encoding === 'buffer') {
    stdout = fs.readFileSync(stdoutFile);
    stderr = fs.readFileSync(stderrFile);
  } else {
    stdout = fs.readFileSync(stdoutFile, opts.encoding);
    stderr = fs.readFileSync(stderrFile, opts.encoding);
  }

  // No biggie if we can't erase the files now -- they're in a temp dir anyway
  // and we locked down permissions (see the note above).
  try { common.unlinkSync(paramsFile); } catch (e) {}
  try { common.unlinkSync(stderrFile); } catch (e) {}
  try { common.unlinkSync(stdoutFile); } catch (e) {}

  if (code !== 0) {
    // Note: `silent` should be unconditionally true to avoid double-printing
    // the command's stderr, and to avoid printing any stderr when the user has
    // set `shell.config.silent`.
    common.error(stderr, code, { continue: true, silent: true, fatal: opts.fatal });
  }
  var obj = common.ShellString(stdout, stderr, code);
  return obj;
} // execSync()

// Wrapper around exec() to enable echoing output to console in real time
function execAsync(cmd, opts, pipe, callback) {
  // If array form is used, avoid shell and run safely
  if (Array.isArray(cmd)) {
    opts = common.extend({
      silent: common.config.silent,
      fatal: common.config.fatal, // TODO(nfischer): this and the line above are probably unnecessary
      cwd: _pwd().toString(),
      env: process.env,
      maxBuffer: DEFAULT_MAXBUFFER_SIZE,
      encoding: 'utf8',
   

