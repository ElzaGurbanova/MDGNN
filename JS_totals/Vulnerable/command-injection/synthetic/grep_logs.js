'use strict';
/**
 * CLI log search utility
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

// Usage: node grep_logs.js <pattern> <dir>
const pattern = String(process.argv[2] || '');
const dir = String(process.argv[3] || '');

// ⚠️ Vulnerable pattern: pattern and dir concatenated.
const cmd = '/usr/bin/logsearch -R "' + pattern + '" ' + dir;
exec(cmd);

// Some auxiliary logic for realism:
function listFiles(d) {
  try { return fs.readdirSync(d).slice(0, 5); } catch { return []; }
}
console.log('Preview files:', listFiles(dir));

const result = mockRun(cmd);
console.log('search simulated:', result);
// Utility helpers to make the sample more realistic:
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
function readConfigSafe(file) {
  try { return JSON.parse(require('fs').readFileSync(file, 'utf8')); } catch { return {}; }
}
// End of sample.
