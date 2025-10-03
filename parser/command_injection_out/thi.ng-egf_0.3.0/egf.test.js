const v33 = () => {
    const v18 = expect.assertions(2);
    v18;
    const egf = require('@thi.ng/egf');
    const fs = require('fs');
    const path = './egf';
    try {
        const v19 = fs.existsSync(path);
        if (v19) {
            const v20 = fs.unlinkSync(path);
            v20;
            const v21 = console.log('File removed:', path);
            v21;
        }
    } catch (err) {
        const v22 = console.error(err);
        v22;
    }
    file_exist = fs.existsSync(path);
    const v23 = expect(file_exist);
    const v24 = v23.toBe(false);
    v24;
    try {
        const v25 = egf.BUILTINS;
        const v26 = {};
        v26.decrypt = true;
        const v27 = { opts: v26 };
        const v28 = v25.gpg('foo', 'bar`touch egf`', v27);
        v28;
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v29 = expect(file_exist);
    const v30 = v29.toBe(true);
    v30;
    const v31 = function (err) {
    };
    const v32 = fs.unlink(path, v31);
    v32;
};
const v34 = test('Command Injection in @thi.ng/egf', v33);
v34;