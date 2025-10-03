const spawn = require('../../helpers/spawn');
const v32 = async function (destination, {
    hard = true
} = {}) {
    const v17 = typeof destination;
    const v18 = v17 === 'string';
    const v19 = destination && v18;
    if (v19) {
        try {
            const v20 = `check-ref-format ${ destination }`;
            await spawn(v20);
        } catch (error) {
            const v21 = new RangeError('can not reset to illegal ref "${destination}"');
            throw v21;
        }
        let v22;
        if (hard) {
            v22 = '--hard';
        } else {
            v22 = '';
        }
        const v23 = `reset ${ destination } ${ v22 }`;
        return await spawn(v23);
    }
    const v24 = typeof destination;
    const v25 = v24 === 'number';
    const v26 = destination && v25;
    if (v26) {
        const v27 = Math.abs(destination);
        let v28;
        if (hard) {
            v28 = '--hard';
        } else {
            v28 = '';
        }
        const v29 = `reset HEAD~${ v27 } ${ v28 }`;
        return await spawn(v29);
    }
    const v30 = typeof destination;
    const v31 = new TypeError(`No case for handling destination ${ destination } (${ v30 })`);
    throw v31;
};
module.exports = v32;