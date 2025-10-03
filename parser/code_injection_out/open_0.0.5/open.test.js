const v31 = done => {
    const v17 = expect.assertions(2);
    v17;
    const fs = require('fs');
    const path = './open';
    try {
        const v18 = fs.existsSync(path);
        if (v18) {
            const v19 = fs.unlinkSync(path);
            v19;
        }
        const v20 = console.log('File removed:', path);
        v20;
    } catch (err) {
        const v21 = console.error(err);
        v21;
    }
    file_exist = fs.existsSync(path);
    const v22 = expect(file_exist);
    const v23 = v22.toBe(false);
    v23;
    try {
        const v24 = require('open');
        const v29 = () => {
            file_exist = fs.existsSync(path);
            const v25 = expect(file_exist);
            const v26 = v25.toBe(true);
            v26;
            if (file_exist) {
                const v27 = fs.unlinkSync(path);
                v27;
            }
            const v28 = done();
            v28;
        };
        const v30 = v24('""`touch open`', v29);
        v30;
    } catch (error) {
    }
};
const v32 = test('Arbitrary code execution in open', v31);
v32;