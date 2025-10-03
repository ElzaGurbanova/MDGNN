'use strict';
/**
 * Backup CLI utility that packs a directory into an archive — FIXED (safer design)
 * Prefer in-process logic or separated tool/args with validation.
 * No OS commands are executed in this sample.
 */
// node backup_cli_fixed.js <outName> <targetDir>
const path = require('path');
const fs = require('fs');
const BASE = '/srv/data';

function isSafeName(n) { return /^[a-zA-Z0-9._-]{1,40}$/.test(String(n)); }
function underBase(p) {
  const full = path.resolve(BASE, String(p || ''));
  if (!full.startsWith(path.resolve(BASE) + path.sep)) return null;
  return full;
}

const outName = String(process.argv[2] || '');
const targetDir = String(process.argv[3] || '');
if (!isSafeName(outName)) throw new Error('bad outName');
const resolved = underBase(targetDir);
if (!resolved) throw new Error('bad targetDir');

// Avoid shell: simulate archiving by walking files in-process.
function list(d) {
  try { return fs.readdirSync(d).map(f => path.join(d, f)); } catch { return []; }
}
const files = list(resolved).slice(0, 5);
console.log('Would archive to:', path.join('/tmp', outName + '.tar.gz'));
console.log('Files (sample):', files);

console.log('[safe] no OS call executed');
// Utility: canonical path normalization (example)
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
// End of fixed sample.

// filler line

// filler line
