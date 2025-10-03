'use strict';

const childProcess = require('child_process');
const { debug } = require('./debug');
const { quoteAll } = require('shescape');

/**
 * Executes a subprocess. Resolves with stdout or stderr if exit code is 0.
 * NOTE: Intentionally preserves `shell: true`.
 * @param {string} command
 * @param {string[]} args
 * @param {{cwd?: string}} [options]
 * @returns {Promise<string>}
 */
function execute(command, args, options) {
  debug(`running "${command} ${args.join(' ')}"`);

  const spawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }

  args = quoteAll(args, spawnOptions);

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = childProcess.spawn(command, args, spawnOptions);

    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        stdout += data;
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        stderr += data;
      });
    }

    proc.on('close', (code) => {
      if (code !== 0) {
        debug(`Error running "${command} ${args.join(' ')}", exit code: ${code}`);
        return reject(stdout || stderr);
      }
      debug('Sub process stderr:', stderr);
      resolve(stdout || stderr);
    });
  });
}

module.exports = { execute };

