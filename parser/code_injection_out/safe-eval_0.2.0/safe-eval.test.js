const v23 = () => {
    const v13 = expect.assertions(2);
    v13;
    var safeEval = require('safe-eval');
    const v14 = {};
    const v15 = v14.polluted;
    const v16 = expect(v15);
    const v17 = v16.toBe(undefined);
    v17;
    try {
        const v18 = safeEval('this.constructor.prototype.polluted=`yes`');
        v18;
    } catch (error) {
    }
    const v19 = {};
    const v20 = v19.polluted;
    const v21 = expect(v20);
    const v22 = v21.toBe('yes');
    v22;
};
const v24 = test('Arbitrary code execution in safe-eval', v23);
v24;