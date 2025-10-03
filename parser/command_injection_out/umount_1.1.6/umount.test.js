const v31 = done => {
    const v17 = expect.assertions(2);
    v17;
    const root = require('umount');
    const fs = require('fs');
    const path = './umount';
    try {
        const v18 = fs.existsSync(path);
        if (v18) {
            const v19 = fs.unlinkSync(path);
            v19;
            const v20 = console.log('File removed:', path);
            v20;
        }
    } catch (err) {
        const v21 = console.error(err);
        v21;
    }
    file_exist = fs.existsSync(path);
    const v22 = expect(file_exist);
    const v23 = v22.toBe(false);
    v23;
    let device = '" $(touch umount) "';
    const v29 = function () {
        file_exist = fs.existsSync(path);
        const v24 = expect(file_exist);
        const v25 = v24.toBe(true);
        v25;
        const v27 = function (err) {
            const v26 = done();
            v26;
        };
        const v28 = fs.unlink(path, v27);
        v28;
    };
    const v30 = root.umount(device, v29);
    v30;
};
const v32 = test('Command Injection in umount', v31);
v32;