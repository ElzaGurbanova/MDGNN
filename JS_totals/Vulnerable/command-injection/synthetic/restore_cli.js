'use strict';
/**
 * Backup Restore CLI utility
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

// node restore_cli.js <archive> <targetDir>
const archive = String(process.argv[2]||'');
const targetDir = String(process.argv[3]||'');
// ⚠️ Vulnerable: concatenated command string
const cmd = '/usr/bin/unpacker -o ' + targetDir + ' ' + archive;
exec(cmd);
console.log('Restoring (simulated):', { archive, targetDir });
const result = mockRun(cmd);
console.log('restore simulated:', result.code);


// Utility to lengthen realism
function previewDir(d) {
  try { return fs.readdirSync(d).slice(0,3); } catch { return []; }
}
console.log('preview:', previewDir('/tmp'));

