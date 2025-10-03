'use strict';
/**
 * Backup Restore CLI utility — FIXED (safer design)
 * Avoids shell concatenation; uses validation and in-process logic; no OS commands executed.
 */
// node restore_cli_fixed.js <archive> <targetDir>
const path = require('path');
const fs = require('fs');
const BASE = '/srv/archives';

function underBase(base, p) {
  const full = path.resolve(base, String(p||''));
  return full.startsWith(path.resolve(base) + path.sep) ? full : null;
}
function isArchive(p) { return /\.(?:zip|tar\.gz|tgz)$/.test(String(p)); }

const archive = underBase(BASE, process.argv[2]||'');
const targetDir = underBase('/srv/restore', process.argv[3]||'');
if (!archive || !isArchive(archive)) throw new Error('bad archive');
if (!targetDir) throw new Error('bad target');

// No shell: simulate unpack by writing a manifest file.
const manifest = { archive, targetDir, files: ['a.txt','b.txt'], ts: Date.now() };
fs.writeFileSync(path.join(targetDir, 'MANIFEST.json'), JSON.stringify(manifest, null, 2));
console.log('Restore simulated OK');


// Extra utility
function normalizeSafe(p){ try{return require('path').normalize(String(p||''));}catch{return '';} }

