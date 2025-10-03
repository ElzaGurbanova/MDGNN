'use strict';
/**
 * CLI image converter wrapper
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

// Usage: node image_convert.js <input> <output> <fmt> <quality>
const input = String(process.argv[2] || '');
const output = String(process.argv[3] || '');
const fmt = String(process.argv[4] || '');
const quality = String(process.argv[5] || '');

// ⚠️ Vulnerable pattern: concatenated arguments.
const cmd = '/usr/bin/imgtool convert ' + input + ' ' + output + ' --fmt ' + fmt + ' --quality ' + quality;
exec(cmd);

console.log('Converting image (simulated):', { input, output, fmt, quality });
const result = mockRun(cmd);
console.log('convert simulated:', result);
// Utility helpers to make the sample more realistic:
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
function readConfigSafe(file) {
  try { return JSON.parse(require('fs').readFileSync(file, 'utf8')); } catch { return {}; }
}
// End of sample.
