const v29 = done => {
    const v16 = expect.assertions(2);
    v16;
    const a = require('gitblame');
    const fs = require('fs');
    const path = './gitblame';
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
    const v27 = function () {
        file_exist = fs.existsSync(path);
        const v22 = expect(file_exist);
        const v23 = v22.toBe(true);
        v23;
        const v25 = function (err) {
            const v24 = done();
            v24;
        };
        const v26 = fs.unlink(path, v25);
        v26;
    };
    const v28 = a('& touch gitblame', v27);
    v28;
};
const v30 = test('Command Injection in gitblame', v29);
v30;