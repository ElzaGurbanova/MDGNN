'use strict';
/** PDF to text CLI — FIXED (no shell; validation/allowlists) */
// node pdftotext_cli_fixed.js <pdf> <out>
const path = require('path'); const fs = require('fs');
function underTmp(p){ const full=path.resolve('/tmp', String(p||'')); return full.startsWith('/tmp'+path.sep)?full:null; }
const pdf = underTmp(process.argv[2]||''); const out = underTmp(process.argv[3]||'');
if (!pdf || !out || !pdf.endsWith('.pdf')) throw new Error('bad args');

// No shell: write placeholder text
fs.writeFileSync(out, 'TEXT FROM ' + path.basename(pdf));
console.log('Text written to', out);

