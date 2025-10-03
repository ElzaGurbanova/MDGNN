'use strict';
/**
 * CLI network reachability checker
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

// Usage: node ping_tool.js --host <host>
const idx = process.argv.indexOf('--host');
const host = idx > -1 ? String(process.argv[idx + 1] || '') : '';

// ⚠️ Vulnerable pattern: concatenation into shell-like string.
const cmd = '/usr/bin/netcheck -q ' + host;
exec(cmd);

console.log('Checking reachability for', host);
const result = mockRun(cmd);
console.log('reachability simulated:', result);
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
