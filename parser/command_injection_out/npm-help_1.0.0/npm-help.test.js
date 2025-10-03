const v29 = () => {
    const v16 = expect.assertions(2);
    v16;
    const root = require('npm-help');
    const fs = require('fs');
    const path = './npm-help';
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
    file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(false);
    v22;
    var module = '& touch npm-help';
    const v23 = root.latestVersion(module);
    v23;
    file_exist = fs.existsSync(path);
    const v24 = expect(file_exist);
    const v25 = v24.toBe(true);
    v25;
    const v26 = fs.unlinkSync('./version');
    v26;
    const v27 = function (err) {
    };
    const v28 = fs.unlink(path, v27);
    v28;
};
const v30 = test('Command Injection in npm-help', v29);
v30;