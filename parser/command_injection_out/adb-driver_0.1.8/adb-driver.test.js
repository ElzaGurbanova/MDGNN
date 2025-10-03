const v29 = () => {
    const v16 = expect.assertions(2);
    v16;
    const root = require('adb-driver');
    const fs = require('fs');
    const path = './adb-driver';
    try {
        const v17 = fs.existsSync(path);
        if (v17) {
            const v18 = fs.unlinkSync(path);
            v18;
        }
    } catch (err) {
        const v19 = console.error(err);
        v19;
    }
    file_exist = fs.existsSync(path);
    const v20 = expect(file_exist);
    const v21 = v20.toBe(false);
    v21;
    const v22 = root.execADBCommand(' & touch adb-driver');
    const v27 = () => {
        file_exist = fs.existsSync(path);
        const v23 = expect(file_exist);
        const v24 = v23.toBe(true);
        v24;
        const v25 = function (err) {
        };
        const v26 = fs.unlink(path, v25);
        v26;
    };
    const v28 = v22.finally(v27);
    return v28;
};
const v30 = test('Command Injection in adb-driver', v29);
v30;