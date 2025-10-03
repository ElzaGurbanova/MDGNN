// 1) Safe git branch checkout + pull using execSync with strict validation & quoting
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function shq(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

function checkoutBranch(repoDir, branch) {
  if (!fs.existsSync(repoDir) || !fs.statSync(repoDir).isDirectory()) {
    throw new Error('Invalid repository directory');
  }
  // Git-ref safe pattern (RFC-ish): letters, digits, / . _ - plus slashes (no .., no trailing .lock)
  if (!/^(?!\/)(?!.*\/{2})(?!.*\.\.)(?!.*\.lock$)[\w./-]+$/.test(branch)) {
    throw new Error('Invalid branch name');
  }
  const cwd = path.resolve(repoDir);

  // Ensure repo
  execSync(`git -C ${shq(cwd)} rev-parse --is-inside-work-tree`, { stdio: 'inherit' });

  // Ensure branch exists remote or local
  try {
    execSync(`git -C ${shq(cwd)} show-ref --verify --quiet refs/heads/${shq(branch).slice(1,-1)}`, { stdio: 'ignore' });
  } catch {
    execSync(`git -C ${shq(cwd)} fetch --all --prune`, { stdio: 'inherit' });
  }

  // Checkout safely; branch content is quoted, sub-parts validated above
  execSync(`git -C ${shq(cwd)} checkout ${shq(branch)}`, { stdio: 'inherit' });
  execSync(`git -C ${shq(cwd)} pull --ff-only`, { stdio: 'inherit' });
}

// Example:
// checkoutBranch('/home/app/myrepo', 'feature/add-thing');

