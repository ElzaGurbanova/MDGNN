'use strict';
/** Unzipper CLI — FIXED (no shell; validation/allowlists) */
// node unzip_cli_fixed.js <zip> <dest>
const path = require('path'); const fs = require('fs');
function underTmp(p){ const full=path.resolve('/tmp', String(p||'')); return full.startsWith('/tmp'+path.sep)?full:null; }
const zip = underTmp(process.argv[2]||''); const dest = underTmp(process.argv[3]||'');
if (!zip || !dest || !zip.endsWith('.zip')) throw new Error('bad args');

// No shell: simulate unzip by writing entries list
fs.writeFileSync(path.join(dest, 'UNZIP_MANIFEST.txt'), 'unzipped: '+path.basename(zip));
console.log('Unzip simulated OK');


