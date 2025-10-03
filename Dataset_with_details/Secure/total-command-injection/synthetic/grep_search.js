// 10) Safe grep search over project: validated pattern & controlled includes; execSync
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

function safeSearch(projectDir, term, glob = '*.js') {
  const root = path.resolve(projectDir);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error('Bad project dir');
  // Limit the search term to printable without metacharacters that change grep behavior
  if (!/^[\w .,:@#%+=/()-]{1,80}$/.test(term)) throw new Error('Invalid search term');
  if (!/^[\w.*?-]{1,40}$/.test(glob)) throw new Error('Invalid glob');

  const cmd = `grep -R --line-number --color=never --include=${shq(glob)} ${shq(term)} ${shq(root)}`;
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return out;
  } catch (e) {
    // grep non-zero when no matches; treat as empty result
    if (e.status === 1) return '';
    throw e;
  }
}

// Example:
// console.log(safeSearch('.', 'TODO', '*.ts'));

