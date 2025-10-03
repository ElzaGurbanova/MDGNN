const v31 = done => {
    const v17 = expect.assertions(2);
    v17;
    const kill_process_by_name = require('kill-process-by-name');
    const fs = require('fs');
    const path = './kill-process-by-name';
    try {
        const v18 = fs.existsSync(path);
        if (v18) {
            const v19 = fs.unlinkSync(path);
            v19;
        }
    } catch (err) {
        const v20 = console.error(err);
        v20;
    }
    file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(false);
    v22;
    const v23 = kill_process_by_name('$(touch kill-process-by-name)');
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
const v32 = test('Command Injection in kill-process-by-name', v31);
v32;