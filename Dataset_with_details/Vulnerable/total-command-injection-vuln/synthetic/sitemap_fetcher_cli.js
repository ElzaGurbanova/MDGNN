'use strict';
/**
 * CLI sitemap fetcher
 * REDACTED VULNERABLE-PATTERN — DOES NOT EXECUTE OS COMMANDS.
 * Constructs a shell-like string from untrusted input and passes to mockRun().
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); 

function mockRun(cmd) {
  console.log('[mockRun] would run:', cmd);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function unusedHelper(x) { return String(x||'').trim(); } // intentionally unused

// node sitemap_fetcher_cli.js <url> <out>
const urlArg = String(process.argv[2]||'');
const out = String(process.argv[3]||'');
// ⚠️ Vulnerable: concatenated curl-like command
const cmd = 'curl -L ' + urlArg + ' -o ' + out;
exec(cmd);
console.log('Fetch sitemap (simulated):', { url: urlArg, out });
const result = mockRun(cmd);
console.log('fetch simulated:', result.code);


// Utility to lengthen realism
function previewDir(d) {
  try { return fs.readdirSync(d).slice(0,3); } catch { return []; }
}
console.log('preview:', previewDir('/tmp'));
