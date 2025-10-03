'use strict';
/**
 * CLI archive lister
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

// Usage: node zip_list.js <zipPath>
const zipPath = String(process.argv[2] || '');

// ⚠️ Vulnerable pattern: untrusted path concatenated.
const cmd = '/usr/bin/archiver --list ' + zipPath;
exec(cmd);

console.log('Listing archive (simulated):', zipPath);
const result = mockRun(cmd);
console.log('list simulated:', result);
// Utility helpers to make the sample more realistic:
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
function readConfigSafe(file) {
  try { return JSON.parse(require('fs').readFileSync(file, 'utf8')); } catch { return {}; }
}
// End of sample.

// filler line

// filler line

// filler line
