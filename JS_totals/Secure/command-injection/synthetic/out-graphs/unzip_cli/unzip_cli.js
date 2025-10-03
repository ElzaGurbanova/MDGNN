'use strict';
const path = require('path');
const fs = require('fs');
const underTmp = function (p) {
    const v25 = p || '';
    const v26 = String(v25);
    const full = path.resolve('/tmp', v26);
    const v27 = path.sep;
    const v28 = '/tmp' + v27;
    const v29 = full.startsWith(v28);
    let v30;
    if (v29) {
        v30 = full;
    } else {
        v30 = null;
    }
    return v30;
};
const v31 = process.argv;
const v32 = v31[2];
const v33 = v32 || '';
const zip = underTmp(v33);
const v34 = process.argv;
const v35 = v34[3];
const v36 = v35 || '';
const dest = underTmp(v36);
const v37 = !zip;
const v38 = !dest;
const v39 = v37 || v38;
const v40 = zip.endsWith('.zip');
const v41 = !v40;
const v42 = v39 || v41;
if (v42) {
    const v43 = new Error('bad args');
    throw v43;
}
const v44 = path.join(dest, 'UNZIP_MANIFEST.txt');
const v45 = path.basename(zip);
const v46 = 'unzipped: ' + v45;
const v47 = fs.writeFileSync(v44, v46);
v47;
const v48 = console.log('Unzip simulated OK');
v48;