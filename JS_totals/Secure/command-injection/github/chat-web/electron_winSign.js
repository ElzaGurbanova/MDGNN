const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

// Very small quoted-arg splitter for env strings like: -ts "http://tsa" -nest
function splitArgs(str) {
  if (!str) return [];
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(str))) out.push(m[1] || m[2] || m[3]);
  return out;
}

exports.default = async function (options) {
  const inPath = options.path;
  const appOutDir = path.dirname(inPath);

  // get the token passphrase from the keychain
  const tokenPassphrase = await new Promise((resolve, reject) => {
    execFile(
      'security',
      ['find-generic-password', '-s', 'riot_signing_token', '-w'],
      {},
      (err, stdout) => {
        if (err) {
          console.error("Couldn't find signing token in keychain", err);
          reject(err);
        } else {
          resolve(stdout.trim());
        }
      },
    );
  });

  return new Promise((resolve, reject) => {
    const tmpFile = path.join(
      appOutDir,
      'tmp_' + Math.random().toString(36).substring(2, 15) + '.exe',
    );

    // Build argv for osslsigncode safely
    const envArgs = splitArgs(process.env.OSSLSIGNCODE_SIGNARGS || '');
    const baseArgs = [
      'sign',
      '-h', options.hash,
      '-pass', tokenPassphrase,
      '-in', inPath,
      '-out', tmpFile,
    ];
    if (options.isNest) baseArgs.push('-nest');

    const finalArgs = baseArgs.slice(0, 1) // 'sign'
      .concat(envArgs)                     // optional extra flags from env
      .concat(baseArgs.slice(1));          // rest of fixed args

    execFile('osslsigncode', finalArgs, {}, (error, stdout) => {
      if (error) {
        console.log("Running: osslsigncode " + finalArgs.join(' '));
        console.log(stdout || '');
        console.error("osslsigncode failed with code " + (error.code || 'unknown'));
        reject("osslsigncode failed with code " + (error.code || 'unknown'));
        return;
      }
      fs.rename(tmpFile, inPath, (err) => {
        if (err) {
          console.error("Error renaming file", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

