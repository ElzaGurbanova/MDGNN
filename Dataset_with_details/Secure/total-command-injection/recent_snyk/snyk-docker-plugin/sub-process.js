'use strict';

const childProcess = require('child_process');
const { quoteAll } = require('shescape');

/**
 * @typedef {Object} CmdOutput
 * @property {string} stdout
 * @property {string} stderr
 */

/**
 * Executes a subprocess and returns { stdout, stderr }.
 * NOTE: Intentionally preserves `shell: true`.
 * @param {string} command
 * @param {string[]} args
 * @param {{cwd?: string}} [options]
 * @returns {Promise<CmdOutput>}
 */
function execute(command, args, options) {
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
      const output = { stdout, stderr };
      if (code !== 0) {
        return reject(output);
      }
      resolve(output);
    });
  });
}

module.exports = { execute };

