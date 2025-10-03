const v35 = done => {
    const v19 = expect.assertions(2);
    v19;
    const fs = require('fs');
    const path = './open';
    try {
        const v20 = fs.existsSync(path);
        if (v20) {
            const v21 = fs.unlinkSync(path);
            v21;
            const v22 = console.log('File removed:', path);
            v22;
        }
    } catch (err) {
        const v23 = console.error(err);
        v23;
    }
    file_exist = fs.existsSync(path);
    const v24 = expect(file_exist);
    const v25 = v24.toBe(false);
    v25;
    const v26 = require('open');
    const v27 = v26('""`touch open`');
    v27;
    const v33 = () => {
        file_exist = fs.existsSync(path);
        const v28 = expect(file_exist);
        const v29 = v28.toBe(true);
        v29;
        const v31 = () => {
            const v30 = done();
            v30;
        };
        const v32 = fs.unlink(path, v31);
        v32;
    };
    const v34 = setTimeout(v33, 500);
    v34;
};
const v36 = test('Command Injection in open', v35);
v36;