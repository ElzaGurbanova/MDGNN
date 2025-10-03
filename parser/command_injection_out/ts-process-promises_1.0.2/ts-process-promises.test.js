const v33 = () => {
    const v18 = expect.assertions(2);
    v18;
    const a = require('ts-process-promises');
    const fs = require('fs');
    const path = './ts-process-promises';
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
    const v25 = {};
    const v26 = a.exec('touch ts-process-promises', v25);
    const v31 = () => {
        file_exist = fs.existsSync(path);
        const v27 = expect(file_exist);
        const v28 = v27.toBe(true);
        v28;
        const v29 = function (err) {
        };
        const v30 = fs.unlink(path, v29);
        v30;
    };
    const v32 = v26.finally(v31);
    return v32;
};
const v34 = test('Command Injection in ts-process-promises', v33);
v34;