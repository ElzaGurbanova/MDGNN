// 9) Safe npm publish with allowlisted dist-tag and validated package dir; execSync
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

function npmPublish(pkgDir, tag = 'latest') {
  const tags = new Set(['latest', 'next', 'beta', 'alpha', 'rc']);
  if (!tags.has(tag)) throw new Error('Invalid tag');
  const dir = path.resolve(pkgDir);
  if (!fs.existsSync(path.join(dir, 'package.json'))) throw new Error('package.json not found');

  const cmd = `npm publish --tag ${shq(tag)}`;
  execSync(cmd, { cwd: dir, stdio: 'inherit' });
}

// Example:
// npmPublish('./packages/core', 'next');

