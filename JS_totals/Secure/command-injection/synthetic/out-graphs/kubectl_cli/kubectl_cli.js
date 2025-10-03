'use strict';
const isVerb = function (v) {
    const v28 = [
        'get',
        'describe',
        'logs'
    ];
    const v29 = String(v);
    const v30 = v28.includes(v29);
    return v30;
};
const isRes = function (r) {
    const v31 = [
        'pods',
        'deployments',
        'services'
    ];
    const v32 = String(r);
    const v33 = v31.includes(v32);
    return v33;
};
const v34 = process.argv;
const v35 = v34[2];
const v36 = v35 || '';
const verb = String(v36);
const v37 = process.argv;
const v38 = v37[3];
const v39 = v38 || '';
const res = String(v39);
const v40 = process.argv;
const v41 = v40[4];
const v42 = v41 || '';
const name = String(v42);
const v43 = isVerb(verb);
const v44 = !v43;
const v45 = isRes(res);
const v46 = !v45;
const v47 = v44 || v46;
const v48 = /^[a-z0-9-]{1,40}$/.test(name);
const v49 = !v48;
const v50 = v47 || v49;
if (v50) {
    const v51 = new Error('bad args');
    throw v51;
}
const v52 = {
    verb,
    res,
    name,
    out: 'simulated'
};
const v53 = JSON.stringify(v52, null, 2);
const v54 = console.log(v53);
v54;