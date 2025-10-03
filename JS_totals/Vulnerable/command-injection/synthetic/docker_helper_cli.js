'use strict';
/**
 * CLI docker helper wrapper
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

// node docker_helper_cli.js <image> [flags...]
const image = String(process.argv[2]||'');
const flags = process.argv.slice(3).join(' ');
// ⚠️ Vulnerable: concatenated docker run string
const cmd = 'docker run ' + flags + ' ' + image;
exec(cmd);
console.log('Docker run (simulated):', { image, flags });
const result = mockRun(cmd);
console.log('docker simulated:', result.code);


// Utility to lengthen realism
function previewDir(d) {
  try { return fs.readdirSync(d).slice(0,3); } catch { return []; }
}
console.log('preview:', previewDir('/tmp'));
