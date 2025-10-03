'use strict';
/**
 * CLI image converter wrapper — FIXED (safer design)
 * Prefer in-process logic or separated tool/args with validation.
 * No OS commands are executed in this sample.
 */
// node image_convert_fixed.js <input> <output> <fmt> <quality>
const path = require('path');
const fs = require('fs');
const BASE = '/srv/images';
const ALLOWED_FMT = new Set(['png', 'jpg', 'webp']);

function underBase(p) { const full = path.resolve(BASE, p); return full.startsWith(path.resolve(BASE) + path.sep) ? full : null; }
function isIntIn(x, lo, hi) { const n = Number(x); return Number.isInteger(n) && n >= lo && n <= hi; }

const input = underBase(String(process.argv[2] || ''));
const output = underBase(String(process.argv[3] || ''));
const fmt = String(process.argv[4] || '').toLowerCase();
const quality = String(process.argv[5] || '');

if (!input || !output) throw new Error('bad path');
if (!ALLOWED_FMT.has(fmt)) throw new Error('bad fmt');
if (!isIntIn(quality, 1, 100)) throw new Error('bad quality');

// Avoid shell: pretend to transform by copying a few bytes.
try { const buf = Buffer.from('SIMULATED'); fs.writeFileSync(output, buf); } catch {{}}
console.log('Converted (simulated):', {{ input, output, fmt, quality }});
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
