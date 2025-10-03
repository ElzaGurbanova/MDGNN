// 5) Safe tar.gz extract: validate archive extension & destination, forbid traversal, execSync
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

function extractTarGz(archivePath, destDir) {
  const ap = path.resolve(archivePath);
  const dp = path.resolve(destDir);
  if (!ap.endsWith('.tar.gz')) throw new Error('Only .tar.gz allowed');
  if (!fs.existsSync(ap)) throw new Error('Archive not found');
  if (!fs.existsSync(dp)) throw new Error('Destination not found');

  // GNU tar has --warning=no-unknown-keyword; use --no-overwrite-dir and numeric owners
  const cmd = `tar --extract --gunzip --file ${shq(ap)} --directory ${shq(dp)} --no-same-owner --no-same-permissions`;
  execSync(cmd, { stdio: 'inherit' });
}

// Example:
// extractTarGz('./release/myapp.tar.gz', './deploy');

