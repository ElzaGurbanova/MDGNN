'use strict';

const childProcess = require('child_process');
const debug = require('debug');
const { quoteAll } = require('shescape');

const debugLogging = debug('snyk-gradle-plugin');

/**
 * Executes a subprocess. Resolves with stdout if exit code is 0.
 * NOTE: Intentionally preserves `shell: true`.
 * @param {string} command
 * @param {string[]} args
 * @param {{cwd?: string}} options
 * @param {(s: string) => Promise<void>} [perLineCallback]
 * @returns {Promise<string>}
 */
function execute(command, args, options, perLineCallback) {
  const spawnOptions = { shell: true }; // shell interpolation preserved
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }

  args = quoteAll(args, spawnOptions);

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = childProcess.spawn(command, args, spawnOptions);

    proc.stdout.on('data', (data) => {
      const strData = data.toString();
      stdout += strData;
      if (perLineCallback) {
        // Fire-and-forget, not awaited (same semantics as TS)
        strData.split('\n').forEach(perLineCallback);
      }
    });

    proc.stderr.on('data', (data) => {
      // Keep original behavior (Buffer concatenation coerces to string)
      stderr += data;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        const fullCommand = command + ' ' + args.join(' ');
        return reject(new Error(`
>>> command: ${fullCommand}
>>> exit code: ${code}
>>> stdout:
${stdout}
>>> stderr:
${stderr}
`));
      }

      if (stderr) {
        debugLogging('subprocess exit code = 0, but stderr was not empty: ' + stderr);
      }

      resolve(stdout);
    });
  });
}

module.exports = { execute };

