'use strict';
const path = require('path');
const fs = require('fs');
const underTmp = function (p) {
    const v24 = p || '';
    const v25 = String(v24);
    const full = path.resolve('/tmp', v25);
    const v26 = path.sep;
    const v27 = '/tmp' + v26;
    const v28 = full.startsWith(v27);
    let v29;
    if (v28) {
        v29 = full;
    } else {
        v29 = null;
    }
    return v29;
};
const v30 = process.argv;
const v31 = v30[2];
const v32 = v31 || '';
const pdf = underTmp(v32);
const v33 = process.argv;
const v34 = v33[3];
const v35 = v34 || '';
const out = underTmp(v35);
const v36 = !pdf;
const v37 = !out;
const v38 = v36 || v37;
const v39 = pdf.endsWith('.pdf');
const v40 = !v39;
const v41 = v38 || v40;
if (v41) {
    const v42 = new Error('bad args');
    throw v42;
}
const v43 = path.basename(pdf);
const v44 = 'TEXT FROM ' + v43;
const v45 = fs.writeFileSync(out, v44);
v45;
const v46 = console.log('Text written to', out);
v46;