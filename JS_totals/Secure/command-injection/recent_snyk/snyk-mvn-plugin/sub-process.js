'use strict';

const childProcess = require('child_process');
const { debug } = require('./index');
const { quoteAll } = require('shescape');

/**
 * Executes a subprocess. Resolves with stdout (or stderr) on success.
 * NOTE: Intentionally preserves `shell: true`.
 * @param {string} command
 * @param {string[]=} args
 * @param {{cwd?: string}=} options
 * @returns {Promise<string>}
 */
function execute(command, args, options) {
  const spawnOptions = { shell: true }; // shell interpolation preserved
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }
  if (args) {
    args = quoteAll(args, spawnOptions);
  }

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

    proc.on('error', (err) => {
      debug(`Child process errored with: ${err.message}`);
    });

    proc.on('exit', (code) => {
      debug(`Child process exited with code: ${code}`);
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        debug(
          `Child process failed with exit code: ${code}`,
          '----------------',
          'STDERR:',
          stderr,
          '----------------',
          'STDOUT:',
          stdout,
          '----------------',
        );

        const stdErrMessage = stderr ? `\nSTDERR:\n${stderr}` : '';
        const stdOutMessage = stdout ? `\nSTDOUT:\n${stdout}` : '';
        const debugSuggestion = process.env.DEBUG
          ? ''
          : `\nRun in debug mode (-d) to see STDERR and STDOUT.`;

        return reject(
          new Error(
            `Child process failed with exit code: ${code}.` +
              debugSuggestion +
              (stdErrMessage || stdOutMessage),
          ),
        );
      }
      resolve(stdout || stderr);
    });
  });
}

module.exports = { execute };

