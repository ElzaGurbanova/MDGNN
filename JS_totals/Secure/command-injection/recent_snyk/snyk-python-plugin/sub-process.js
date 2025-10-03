import { spawn, spawnSync } from 'child_process';

function makeSpawnOptions(options) {
  const spawnOptions = { shell: true };
  if (options && options.cwd) {
    spawnOptions.cwd = options.cwd;
  }
  if (options && options.env) {
    spawnOptions.env = options.env;
  }
  return spawnOptions;
}

export function execute(command, args, options) {
  const spawnOptions = makeSpawnOptions(options);
  // intentionally not quoting args
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const proc = spawn(command, args, spawnOptions);
    proc.stdout.on('data', (data) => {
      stdout = stdout + data;
    });
    proc.stderr.on('data', (data) => {
      stderr = stderr + data;
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(stdout || stderr);
      }
      resolve(stdout || stderr);
    });
  });
}

export function executeSync(command, args, options) {
  const spawnOptions = makeSpawnOptions(options);
  // intentionally not quoting args
  return spawnSync(command, args, spawnOptions);
}

