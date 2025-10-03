const v27 = () => {
    const v15 = expect.assertions(2);
    v15;
    const a = require('connection-tester');
    const fs = require('fs');
    const path = './connection-tester';
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
    try {
        const v21 = a.test('& touch connection-tester', 123, 1000);
        v21;
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v22 = expect(file_exist);
    const v23 = v22.toBe(true);
    v23;
    const v24 = fs.unlinkSync(path);
    v24;
    const v25 = fs.unlinkSync('1000');
    v25;
    const v26 = fs.unlinkSync('123');
    v26;
};
const v28 = test('Command Injection in connection-tester', v27);
v28;