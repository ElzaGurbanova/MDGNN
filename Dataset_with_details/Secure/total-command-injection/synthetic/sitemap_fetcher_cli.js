'use strict';
/**
 * CLI sitemap fetcher — FIXED (safer design)
 * Avoids shell concatenation; uses validation and in-process logic; no OS commands executed.
 */
// node sitemap_fetcher_cli_fixed.js <url> <out>
const url = require('url'); const fs = require('fs'); const path = require('path');
function isHttp(u){ try{ const p=new url.URL(u); return ['http:','https:'].includes(p.protocol); } catch{{ return false; }} }
const u = String(process.argv[2]||''); const out = String(process.argv[3]||'');
if (!isHttp(u) || !/^[\w./-]{1,80}$/.test(out)) throw new Error('bad args');

// No shell: simulate fetch by writing a placeholder XML
const xml = '<?xml version="1.0"?><urlset><url><loc>'+u+'</loc></url></urlset>';
fs.writeFileSync(path.resolve('/tmp', out), xml);
console.log('Sitemap simulated to', out);


// Extra utility
function normalizeSafe(p){ try{return require('path').normalize(String(p||''));}catch{return '';} }

