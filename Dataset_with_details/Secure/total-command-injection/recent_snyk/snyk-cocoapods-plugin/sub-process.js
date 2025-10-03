'use strict';

const childProcess = require('child_process');
const { quoteAll } = require('shescape');

/**
 * Executes a subprocess. Resolves with stdout (or stderr) if exit code is 0.
 * NOTE: Intentionally preserves `shell: true`.
 */
function execute(command, args = [], options) {
  const spawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }

  args = quoteAll(args, spawnOptions);

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = childProcess.spawn(command, args, spawnOptions);

    proc.stdout.on('data', (data) => {
      stdout += data;
    });

    proc.stderr.on('data', (data) => {
      stderr += data;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stdout || stderr));
      }
      resolve(stdout || stderr);
    });
  });
}

module.exports = { execute };

