const v33 = done => {
    const v18 = expect.assertions(2);
    v18;
    const a = require('theme-core');
    const fs = require('fs');
    const path = './theme-core';
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
    const v25 = a.utils;
    const v31 = function () {
        file_exist = fs.existsSync(path);
        const v26 = expect(file_exist);
        const v27 = v26.toBe(true);
        v27;
        const v28 = function (err) {
        };
        const v29 = fs.unlink(path, v28);
        v29;
        const v30 = done();
        v30;
    };
    const v32 = v25.sh('touch theme-core', true, v31);
    v32;
};
const v34 = test('Command Injection in theme-core', v33);
v34;