'use strict';
/**
 * CLI system configuration query helper
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

// Usage: node sysctl.js <param>
const param = String(process.argv[2] || '');

// ⚠️ Vulnerable pattern: concatenation into control query.
const cmd = '/usr/sbin/sysquery ' + param;
exec(cmd);

console.log('Querying system config (simulated):', param);
const result = mockRun(cmd);
console.log('query simulated:', result);
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
