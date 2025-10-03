'use strict';
/**
 * CLI wrapper around npm installs — FIXED (safer design)
 * Avoids shell concatenation; uses validation and in-process logic; no OS commands executed.
 */
// node npm_proxy_cli_fixed.js <package> <version>
const fs = require('fs');
function isPkg(n) { return /^(?:@?[a-z0-9][a-z0-9-_.]{0,213})$/.test(String(n)); }
function isSemver(v){ return /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(String(v)); }

const pkg = String(process.argv[2]||''); const version = String(process.argv[3]||'');
if (!isPkg(pkg)) throw new Error('bad package');
if (version && !isSemver(version)) throw new Error('bad version');

// No shell: simulate install by writing to a local lock file.
const lock = { deps: { [pkg]: version || 'latest' }, ts: Date.now() };
fs.writeFileSync('/tmp/npm_lock_sim.json', JSON.stringify(lock, null, 2));
console.log('Install simulated:', lock);


// Extra utility
function normalizeSafe(p){ try{return require('path').normalize(String(p||''));}catch{return '';} }

