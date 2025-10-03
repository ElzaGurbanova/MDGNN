'use strict';
/**
 * CLI network reachability checker — FIXED (safer design)
 * Prefer in-process logic or separated tool/args with validation.
 * No OS commands are executed in this sample.
 */
// node ping_tool_fixed.js --host <host>
const idx = process.argv.indexOf('--host');
const host = idx > -1 ? String(process.argv[idx + 1] || '') : '';

// Validate host (hostname or IPv4)
function isHost(h) {
  return /^(?:[a-zA-Z0-9-]{1,63}\.)*[a-zA-Z0-9-]{1,63}$/.test(h) ||
         /^(?:\d{1,3}\.){3}\d{1,3}$/.test(h);
}
if (!isHost(host)) throw new Error('bad host');

// Avoid shell entirely: attempt a TCP connect on port 80 (simulated only).
const net = require('net');
const socket = new net.Socket();
socket.setTimeout(200);
socket.connect(80, host, () => { console.log('connect OK (simulated)'); socket.destroy(); });
socket.on('error', () => {{ console.log('connect fail (simulated)'); }});
socket.on('timeout', () => {{ console.log('timeout (simulated)'); socket.destroy(); }});
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
