const v25 = async () => {
    const v14 = expect.assertions(2);
    v14;
    const a = require('deferred-exec');
    const fs = require('fs');
    const path = './deferred-exec';
    try {
        const v15 = fs.existsSync(path);
        if (v15) {
            const v16 = fs.unlinkSync(path);
            v16;
        }
    } catch (err) {
        const v17 = console.error(err);
        v17;
    }
    file_exist = fs.existsSync(path);
    const v18 = expect(file_exist);
    const v19 = v18.toBe(false);
    v19;
    const v20 = {};
    await a(' touch deferred-exec ', v20);
    file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(true);
    v22;
    const v23 = function (err) {
    };
    const v24 = fs.unlink(path, v23);
    v24;
};
const v26 = test('Command Injection in deferred-exec', v25);
v26;