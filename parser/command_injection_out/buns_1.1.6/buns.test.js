const v25 = () => {
    const v14 = expect.assertions(2);
    v14;
    var root = require('buns');
    const fs = require('fs');
    const path = './buns';
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
    var name = '& touch buns';
    try {
        const v20 = root.install(name);
        v20;
    } catch (error) {
    } finally {
        file_exist = fs.existsSync(path);
        const v21 = expect(file_exist);
        const v22 = v21.toBe(true);
        v22;
        const v23 = function (err) {
        };
        const v24 = fs.unlink(path, v23);
        v24;
    }
};
const v26 = test('Command Injection in buns', v25);
v26;