const v31 = done => {
    const killing = require('killing');
    const fs = require('fs');
    const path = './killing';
    try {
        const v17 = fs.existsSync(path);
        if (v17) {
            const v18 = fs.unlinkSync(path);
            v18;
            const v19 = console.log('File removed:', path);
            v19;
        }
    } catch (err) {
        const v20 = console.error(err);
        v20;
    }
    let file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(false);
    v22;
    const v23 = killing('$(touch killing & exit 1)');
    v23;
    const v29 = () => {
        file_exist = fs.existsSync(path);
        const v24 = expect(file_exist);
        const v25 = v24.toBe(true);
        v25;
        const v27 = () => {
            const v26 = done();
            v26;
        };
        const v28 = fs.unlink(path, v27);
        v28;
    };
    const v30 = setTimeout(v29, 500);
    v30;
};
const v32 = test('Command Injection in killing', v31);
v32;