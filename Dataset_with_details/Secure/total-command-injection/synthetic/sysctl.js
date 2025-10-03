'use strict';
/**
 * CLI system configuration query helper — FIXED (safer design)
 * Prefer in-process logic or separated tool/args with validation.
 * No OS commands are executed in this sample.
 */
// node sysctl_fixed.js <param>
const ALLOWED = new Set(['net.ipv4.ip_forward', 'kernel.threads-max', 'vm.swappiness']);
const param = String(process.argv[2] || '');
if (!ALLOWED.has(param)) throw new Error('param not allowed');

// Avoid shell: fetch from a static map (simulated).
const MAP = {
  'net.ipv4.ip_forward': '0',
  'kernel.threads-max': '12345',
  'vm.swappiness': '60'
};
console.log(param + ' = ' + MAP[param]);
// Utility: canonical path normalization (example)
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
// End of fixed sample.

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line

// filler line
