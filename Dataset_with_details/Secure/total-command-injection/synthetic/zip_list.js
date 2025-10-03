'use strict';
/**
 * CLI archive lister — FIXED (safer design)
 * Prefer in-process logic or separated tool/args with validation.
 * No OS commands are executed in this sample.
 */
// node zip_list_fixed.js <zipPath>
const fs = require('fs');
const path = require('path');
const BASE = '/srv/data';

const zipPath = path.resolve(BASE, String(process.argv[2] || ''));
if (!zipPath.startsWith(path.resolve(BASE) + path.sep)) throw new Error('bad path');
if (!zipPath.endsWith('.zip')) throw new Error('must be .zip');

// No shell: just read header bytes (simulated listing).
try { const bytes = fs.readFileSync(zipPath).slice(0, 16); console.log('zip header (sim):', bytes.toString('hex')); }} catch {{ console.log('unreadable (sim)'); }}
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

// filler line
