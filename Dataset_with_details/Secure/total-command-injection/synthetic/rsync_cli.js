'use strict';
/** Rsync wrapper CLI — FIXED (no shell; validation/allowlists) */
// node rsync_cli_fixed.js <src> <dest> [--archive] [--delete]
const path = require('path');
const src = String(process.argv[2]||''); const dest = String(process.argv[3]||'');
const flags = process.argv.slice(4).filter(f => ['--archive','--delete'].includes(f));

if (!src || !dest) throw new Error('src/dest required');
// No shell: simulate sync by logging planned action
console.log(JSON.stringify({ action:'sync', src, dest, flags }, null, 2));

