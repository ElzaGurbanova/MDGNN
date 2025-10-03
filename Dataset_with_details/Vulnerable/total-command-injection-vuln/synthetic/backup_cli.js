'use strict';
/**
 * Backup CLI utility that packs a directory into an archive
 * REDACTED VULNERABLE-PATTERN SAMPLE — DOES NOT EXECUTE OS COMMANDS.
 * Demonstrates constructing a shell-like string from untrusted input.
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function mockRun(cmd) {
  // Harmless logger. This is *not* an executor.
  console.log('[mockRun] would run:', cmd);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function maybeSanitize(v) {
  // Not used to highlight the problem.
  return String(v || '').trim();
}

// Read CLI args: node backup_cli.js <outName> <targetDir>
const outName = String(process.argv[2] || '');
const targetDir = String(process.argv[3] || '');

// ⚠️ Vulnerable pattern: build a shell-like string by concatenation.
const cmd = '/usr/bin/packer --out ' + outName + ' ' + targetDir;
exec(cmd);

const meta = { started: Date.now(), tag: 'backup' };
console.log('Preparing backup with meta:', meta);

const result = mockRun(cmd);
console.log('backup simulated:', result);
// Utility helpers to make the sample more realistic:
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
function readConfigSafe(file) {
  try { return JSON.parse(require('fs').readFileSync(file, 'utf8')); } catch { return {}; }
}
// End of sample.
