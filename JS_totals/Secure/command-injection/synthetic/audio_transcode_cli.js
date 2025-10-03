'use strict';
/**
 * CLI audio transcoder wrapper — FIXED (safer design)
 * Avoids shell concatenation; uses validation and in-process logic; no OS commands executed.
 */
// node audio_transcode_cli_fixed.js <in> <out> <codec> <bitrate>
const path = require('path'); const fs = require('fs');
const ALLOWED = new Set(['aac','mp3','opus']); 
function underTmp(p){ const full = path.resolve('/tmp', p||''); return full.startsWith('/tmp'+path.sep)?full:null; }
function isKbps(x){ const n = Number(x); return Number.isInteger(n) && n>=32 && n<=512; }

const inp = underTmp(process.argv[2]||''); const outp = underTmp(process.argv[3]||'');
const codec = String(process.argv[4]||'').toLowerCase(); const bitrate = String(process.argv[5]||'');
if (!inp || !outp || !ALLOWED.has(codec) || !isKbps(bitrate)) throw new Error('bad args');

// No shell: simulate transcode by writing metadata
const meta = { input: inp, output: outp, codec, bitrate: Number(bitrate), ts: Date.now() };
fs.writeFileSync(outp + '.json', JSON.stringify(meta, null, 2));
console.log('Transcode simulated OK');


// Extra utility
function normalizeSafe(p){ try{return require('path').normalize(String(p||''));}catch{return '';} }


