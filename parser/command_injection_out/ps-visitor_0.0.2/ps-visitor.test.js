const v31 = () => {
    const v17 = expect.assertions(2);
    v17;
    const ps_visitor = require('ps-visitor');
    const fs = require('fs');
    const path = './ps-visitor';
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
    let file_exist = fs.existsSync(path);
    const v22 = expect(file_exist);
    const v23 = v22.toBe(false);
    v23;
    const v24 = ps_visitor.kill('$(touch ps-visitor)');
    const v29 = () => {
        file_exist = fs.existsSync(path);
        const v25 = expect(file_exist);
        const v26 = v25.toBe(true);
        v26;
        const v27 = () => {
        };
        const v28 = fs.unlink(path, v27);
        v28;
    };
    const v30 = v24.catch(v29);
    return v30;
};
const v32 = test('Command Injection in ps-visitor', v31);
v32;