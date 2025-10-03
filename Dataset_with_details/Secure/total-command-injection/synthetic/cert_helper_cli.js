'use strict';
/**
 * CLI certificate helper — FIXED (safer design)
 * Avoids shell concatenation; uses validation and in-process logic; no OS commands executed.
 */
// node cert_helper_cli_fixed.js <cn> <days> <out>
const fs = require('fs'); const path = require('path');
function isCN(c){ return /^(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/.test(String(c)); }
function isDays(d){ const n=Number(d); return Number.isInteger(n) && n>=1 && n<=825; }
function safeName(n){ return /^[a-zA-Z0-9._-]{1,40}$/.test(String(n)); }

const cn = String(process.argv[2]||''); const days = String(process.argv[3]||''); const out = String(process.argv[4]||'');
if (!isCN(cn) || !isDays(days) || !safeName(out)) throw new Error('bad args');

// No shell: simulate cert by writing a JSON certificate object
const cert = { subject: { CN: cn }, validDays: Number(days), serial: Date.now().toString(16) };
fs.writeFileSync(path.resolve('/tmp', out), JSON.stringify(cert, null, 2));
console.log('Cert simulated ->', out);


// Extra utility
function normalizeSafe(p){ try{return require('path').normalize(String(p||''));}catch{return '';} }

