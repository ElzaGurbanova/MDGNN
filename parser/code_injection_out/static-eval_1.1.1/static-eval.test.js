const v31 = () => {
    const v17 = expect.assertions(2);
    v17;
    const evaluate = require('static-eval');
    const v18 = require('esprima');
    const parse = v18.parse;
    const v19 = {};
    const v20 = v19.polluted;
    const v21 = expect(v20);
    const v22 = v21.toBe(undefined);
    v22;
    let src = '(function(){1 + (Object.prototype.polluted = `yes`)}())';
    try {
        const v23 = parse(src);
        const v24 = v23.body;
        const v25 = v24[0];
        let ast = v25.expression;
        const v26 = {};
        let res = evaluate(ast, v26);
    } catch (error) {
    }
    const v27 = {};
    const v28 = v27.polluted;
    const v29 = expect(v28);
    const v30 = v29.toBe('yes');
    v30;
};
const v32 = test('Arbitrary code execution in static-eval', v31);
v32;