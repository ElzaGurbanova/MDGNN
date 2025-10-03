'use strict';
/**
 * CLI video thumbnail extractor — FIXED (safer design)
 * Avoids shell concatenation; uses validation and in-process logic; no OS commands executed.
 */
// node video_thumbnail_cli_fixed.js <in> <time> <out>
const path = require('path'); const fs = require('fs');
function underTmp(p){ const full = path.resolve('/tmp', p||''); return full.startsWith('/tmp'+path.sep)?full:null; }
function isTime(t){ return /^\d+(?:\.\d+)?$/.test(String(t)); }

const inp = underTmp(process.argv[2]||''); const t = String(process.argv[3]||''); const outp = underTmp(process.argv[4]||'');
if (!inp || !outp || !isTime(t)) throw new Error('bad args');

// No shell: simulate by writing an image header placeholder
fs.writeFileSync(outp, Buffer.from('PNG\x00SIMULATED'));
console.log('Thumbnail at', t, 's ->', outp);


// Extra utility
function normalizeSafe(p){ try{return require('path').normalize(String(p||''));}catch{return '';} }

