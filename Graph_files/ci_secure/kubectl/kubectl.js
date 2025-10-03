const v25 = require('child_process');
const execSync = v25.execSync;
const shq = function (s) {
    const v26 = String(s);
    const v27 = `'\\''`;
    const v28 = v26.replace(/'/g, v27);
    const v29 = `'${ v28 }'`;
    return v29;
};
const labelNamespace = function (ns, key, value, context) {
    const v30 = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(ns);
    const v31 = !v30;
    if (v31) {
        const v32 = new Error('Invalid namespace');
        throw v32;
    }
    const keyPattern = /^(?:[a-z0-9]([-a-z0-9]*[a-z0-9])?\.)*[a-z0-9]([-a-z0-9/]*[a-z0-9])?$/;
    const v33 = keyPattern.test(key);
    const v34 = !v33;
    if (v34) {
        const v35 = new Error('Invalid label key');
        throw v35;
    }
    const v36 = /^[A-Za-z0-9._-]{1,63}$/.test(value);
    const v37 = !v36;
    if (v37) {
        const v38 = new Error('Invalid label value');
        throw v38;
    }
    const v39 = /^[\w.-]+$/.test(context);
    const v40 = !v39;
    const v41 = context && v40;
    if (v41) {
        const v42 = new Error('Invalid context');
        throw v42;
    }
    let ctxArg;
    const v43 = shq(context);
    if (context) {
        ctxArg = `--context ${ v43 }`;
    } else {
        ctxArg = '';
    }
    const v44 = shq(ns);
    const v45 = `${ key }=${ value }`;
    const v46 = shq(v45);
    const cmd = `kubectl ${ ctxArg } label ns ${ v44 } ${ v46 } --overwrite`;
    const v47 = { stdio: 'inherit' };
    const v48 = execSync(cmd, v47);
    v48;
};