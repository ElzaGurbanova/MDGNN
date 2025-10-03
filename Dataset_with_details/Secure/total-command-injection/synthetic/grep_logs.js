'use strict';
/**
 * CLI log search utility — FIXED (safer design)
 * Prefer in-process logic or separated tool/args with validation.
 * No OS commands are executed in this sample.
 */
// node grep_logs_fixed.js <pattern> <dir>
const fs = require('fs');
const path = require('path');
const BASE = '/var/log';

const pattern = String(process.argv[2] || '');
const dirArg = String(process.argv[3] || '');
if (pattern.length < 1 || pattern.length > 64) throw new Error('bad pattern');

const dir = path.resolve(BASE, dirArg);
if (!dir.startsWith(path.resolve(BASE) + path.sep)) throw new Error('bad dir');

// Implement search in-process, no shell.
const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
let matches = [];
for (const f of fs.readdirSync(dir).slice(0, 20)) {{
  const p = path.join(dir, f);
  try {{
    const data = fs.readFileSync(p, 'utf8');
    if (regex.test(data)) matches.push(p);
  }} catch {{}}
}}
console.log('Matches (simulated):', matches.slice(0, 5));
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
