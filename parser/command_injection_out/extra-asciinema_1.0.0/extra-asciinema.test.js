const v27 = done => {
    const v15 = expect.assertions(2);
    v15;
    const asciinema = require('extra-asciinema');
    const fs = require('fs');
    const path = './extra-asciinema';
    try {
        const v16 = fs.existsSync(path);
        if (v16) {
            const v17 = fs.unlinkSync(path);
            v17;
        }
    } catch (err) {
        const v18 = console.error(err);
        v18;
    }
    file_exist = fs.existsSync(path);
    const v19 = expect(file_exist);
    const v20 = v19.toBe(false);
    v20;
    const v21 = asciinema.uploadSync('; touch extra-asciinema');
    v21;
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
const v28 = test('Command Injection in extra-asciinema', v27);
v28;