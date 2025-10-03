'use strict';
/** MySQL dump CLI — FIXED (no shell; validation/allowlists) */
// node mysqldump_cli_fixed.js <db> <outFile>
const fs = require('fs'); const path = require('path');
function safeName(n){ return /^[a-zA-Z0-9_.-]{1,40}$/.test(String(n)); }
const db = String(process.argv[2]||''); const out = String(process.argv[3]||'');
if (!/^[a-zA-Z0-9_]+$/.test(db) || !safeName(out)) throw new Error('bad args');

// No shell: write a logical dump placeholder
const dump = { database: db, tables: ['t1','t2'], ts: Date.now() };
fs.writeFileSync(path.resolve('/tmp', out), JSON.stringify(dump, null, 2));
console.log('Dump simulated ->', out);

