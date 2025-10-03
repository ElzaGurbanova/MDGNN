'use strict';
/**
 * CLI wrapper around npm installs
 * REDACTED VULNERABLE-PATTERN — DOES NOT EXECUTE OS COMMANDS.
 * Constructs a shell-like string from untrusted input and passes to mockRun().
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); 

function mockRun(cmd) {
  console.log('[mockRun] would run:', cmd);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function unusedHelper(x) { return String(x||'').trim(); } // intentionally unused

// node npm_proxy_cli.js <package> <version>
const pkg = String(process.argv[2]||'');
const version = String(process.argv[3]||'');
// ⚠️ Vulnerable: concatenation into npm command
const cmd = 'npm install ' + pkg + (version ? '@' + version : '');
exec(cmd);
console.log('Installing (simulated):', { pkg, version });
const result = mockRun(cmd);
console.log('install simulated:', result.code);


// Utility to lengthen realism
function previewDir(d) {
  try { return fs.readdirSync(d).slice(0,3); } catch { return []; }
}
console.log('preview:', previewDir('/tmp'));
