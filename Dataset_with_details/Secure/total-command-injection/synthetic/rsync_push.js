// 8) Safe rsync push to predefined hosts; strict path validation; execSync
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

const ALLOWED_HOSTS = new Set(['web1', 'web2', 'backup']);
function rsyncUpload(localDir, hostAlias, remoteDir) {
  if (!ALLOWED_HOSTS.has(hostAlias)) throw new Error('Host not allowed');
  const ld = path.resolve(localDir);
  if (!fs.existsSync(ld) || !fs.statSync(ld).isDirectory()) throw new Error('Local dir invalid');
  if (!/^\/[A-Za-z0-9/_-]+$/.test(remoteDir)) throw new Error('Bad remote dir');

  const cmd = `rsync -az --delete ${shq(ld + path.sep)} ${shq(`${hostAlias}:${remoteDir}`)}`;
  execSync(cmd, { stdio: 'inherit' });
}

// Example:
// rsyncUpload('./build', 'web1', '/var/www/app');

