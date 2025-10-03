// 7) Safe openssl digest check: allowlisted algorithm & validated filename, execSync
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

function calcDigest(filePath, algo = 'sha256') {
  const ALGO = new Set(['sha256', 'sha512']);
  if (!ALGO.has(algo)) throw new Error('Unsupported algorithm');
  const fp = path.resolve(filePath);
  if (!fs.existsSync(fp)) throw new Error('File not found');

  const cmd = `openssl dgst -${algo} ${shq(fp)}`;
  const out = execSync(cmd, { encoding: 'utf8' });
  return out.trim();
}

// Example:
// console.log(calcDigest('./dist/app.tgz', 'sha512'));

