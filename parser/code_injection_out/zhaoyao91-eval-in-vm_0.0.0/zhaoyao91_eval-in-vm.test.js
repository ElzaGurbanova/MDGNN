const v21 = () => {
    const v12 = expect.assertions(2);
    v12;
    const eval1 = require('@zhaoyao91/eval-in-vm');
    const v13 = {};
    const v14 = v13.polluted;
    const v15 = expect(v14);
    const v16 = v15.toBe(undefined);
    v16;
    try {
        'use strict';
        const result = eval1('1 + (this.constructor.prototype.polluted = `yes`);');
    } catch (error) {
    }
    const v17 = {};
    const v18 = v17.polluted;
    const v19 = expect(v18);
    const v20 = v19.toBe('yes');
    v20;
};
const v22 = test('Arbitrary code execution in @zhaoyao91/eval-in-vm', v21);
v22;