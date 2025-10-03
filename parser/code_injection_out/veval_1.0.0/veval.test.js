const v25 = () => {
    const v14 = expect.assertions(2);
    v14;
    const ve = require('veval');
    const v15 = {};
    const v16 = v15.polluted;
    const v17 = expect(v16);
    const v18 = v17.toBe(undefined);
    v18;
    try {
        const v19 = { hi: 0 };
        const v20 = ve(v19, '1 + (this.constructor.prototype.polluted = `yes`);');
        v20;
    } catch (error) {
    }
    const v21 = {};
    const v22 = v21.polluted;
    const v23 = expect(v22);
    const v24 = v23.toBe('yes');
    v24;
};
const v26 = test('Arbitrary code execution in veval', v25);
v26;