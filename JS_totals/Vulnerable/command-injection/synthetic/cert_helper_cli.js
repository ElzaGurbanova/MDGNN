'use strict';
/**
 * CLI certificate helper
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

// node cert_helper_cli.js <cn> <days> <out> <key>
const cn = String(process.argv[2]||'');
const days = String(process.argv[3]||'');
const out = String(process.argv[4]||'');
const key = String(process.argv[5]||'');
// ⚠️ Vulnerable: concatenated openssl-like command
const cmd = 'openssl req -new -x509 -subj /CN=' + cn + ' -days ' + days + ' -out ' + out + ' -keyout ' + key;
exec(cmd);
console.log('Cert (simulated):', { cn, days, out, key });
const result = mockRun(cmd);
console.log('cert simulated:', result.code);


// Utility to lengthen realism
function previewDir(d) {
  try { return fs.readdirSync(d).slice(0,3); } catch { return []; }
}
console.log('preview:', previewDir('/tmp'));
