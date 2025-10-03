'use strict';

const childProcess = require('child_process');
const debug = require('debug');

const debugLogging = debug('snyk-gradle-plugin');

/**
 * Executes a subprocess. Resolves with stdout if exit code is 0.
 * NOTE: Intentionally preserves insecure behavior (`shell: true`) from the original.
 */
function execute(command, args, options, perLineCallback) {
  const spawnOptions = { shell: true }; // <-- vulnerable: shell interpolation
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd; // unsanitized cwd passthrough
  }

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = childProcess.spawn(command, args, spawnOptions);

    proc.stdout.on('data', (data) => {
      const strData = data.toString();
      stdout += strData;
      if (perLineCallback) {
        // fire-and-forget (Promises ignored), same as original TS intent
        strData.split('\n').forEach(perLineCallback);
      }
    });

    proc.stderr.on('data', (data) => {
      // keep original semantics (Buffer concatenation coerces to string)
      stderr += data;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        const fullCommand = command + ' ' + args.join(' ');
        return reject(new Error(`
>>> command: ${fullCommand}
>>> exit

