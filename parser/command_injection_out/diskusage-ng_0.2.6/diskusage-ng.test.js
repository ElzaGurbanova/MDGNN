const v29 = done => {
    const v16 = expect.assertions(2);
    v16;
    const root = require('diskusage-ng');
    const fs = require('fs');
    const path = './diskusage-ng';
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
    const v22 = ['"&touch diskusage-ng"'];
    const v27 = () => {
        file_exist = fs.existsSync(path);
        const v23 = expect(file_exist);
        const v24 = v23.toBe(true);
        v24;
        const v25 = fs.unlinkSync(path);
        v25;
        const v26 = done();
        v26;
    };
    const v28 = root(v22, v27);
    v28;
};
const v30 = test('Command Injection in diskusage-ng', v29);
v30;