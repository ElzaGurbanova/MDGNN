'use strict';
const fs = require('fs');
const path = require('path');
const safeName = function (n) {
    const v21 = String(n);
    const v22 = /^[a-zA-Z0-9_.-]{1,40}$/.test(v21);
    return v22;
};
const v23 = process.argv;
const v24 = v23[2];
const v25 = v24 || '';
const db = String(v25);
const v26 = process.argv;
const v27 = v26[3];
const v28 = v27 || '';
const out = String(v28);
const v29 = /^[a-zA-Z0-9_]+$/.test(db);
const v30 = !v29;
const v31 = safeName(out);
const v32 = !v31;
const v33 = v30 || v32;
if (v33) {
    const v34 = new Error('bad args');
    throw v34;
}
const v35 = [
    't1',
    't2'
];
const v36 = Date.now();
const dump = {};
dump.database = db;
dump.tables = v35;
dump.ts = v36;
const v37 = path.resolve('/tmp', out);
const v38 = JSON.stringify(dump, null, 2);
const v39 = fs.writeFileSync(v37, v38);
v39;
const v40 = console.log('Dump simulated ->', out);
v40;