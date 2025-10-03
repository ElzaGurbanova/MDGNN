'use strict';
const path = require('path');
const v19 = process.argv;
const v20 = v19[2];
const v21 = v20 || '';
const src = String(v21);
const v22 = process.argv;
const v23 = v22[3];
const v24 = v23 || '';
const dest = String(v24);
const v25 = process.argv;
const v26 = v25.slice(4);
const v29 = f => {
    const v27 = [
        '--archive',
        '--delete'
    ];
    const v28 = v27.includes(f);
    return v28;
};
const flags = v26.filter(v29);
const v30 = !src;
const v31 = !dest;
const v32 = v30 || v31;
if (v32) {
    const v33 = new Error('src/dest required');
    throw v33;
}
const v34 = {
    action: 'sync',
    src,
    dest,
    flags
};
const v35 = JSON.stringify(v34, null, 2);
const v36 = console.log(v35);
v36;