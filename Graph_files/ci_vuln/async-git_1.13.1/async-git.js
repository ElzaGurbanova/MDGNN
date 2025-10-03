const exec = require('async-execute');
const v30 = async function (destination, {
    hard = true
} = {}) {
    const v16 = typeof destination;
    const v17 = v16 === 'string';
    const v18 = destination && v17;
    if (v18) {
        const v19 = JSON.stringify(destination);
        let v20;
        if (hard) {
            v20 = '--hard';
        } else {
            v20 = '';
        }
        const v21 = `git reset ${ v19 } ${ v20 }`;
        return await exec(v21);
    }
    const v22 = typeof destination;
    const v23 = v22 === 'number';
    const v24 = destination && v23;
    if (v24) {
        const v25 = Math.abs(destination);
        let v26;
        if (hard) {
            v26 = '--hard';
        } else {
            v26 = '';
        }
        const v27 = `git reset HEAD~${ v25 } ${ v26 }`;
        return await exec(v27);
    }
    const v28 = typeof destination;
    const v29 = new TypeError(`No case for handling destination ${ destination } (${ v28 })`);
    throw v29;
};
module.exports = v30;