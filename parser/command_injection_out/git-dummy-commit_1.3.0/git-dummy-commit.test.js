const v27 = () => {
    const v15 = expect.assertions(2);
    v15;
    const gitDummyCommit = require('git-dummy-commit');
    const fs = require('fs');
    const path = './git-dummy-commit';
    try {
        const v16 = fs.existsSync(path);
        if (v16) {
            const v17 = fs.unlinkSync(path);
            v17;
            const v18 = console.log('File removed:', path);
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
    const v22 = gitDummyCommit('";touch git-dummy-commit;"');
    v22;
    file_exist = fs.existsSync(path);
    const v23 = expect(file_exist);
    const v24 = v23.toBe(true);
    v24;
    const v25 = function (err) {
    };
    const v26 = fs.unlink(path, v25);
    v26;
};
const v28 = test('Command Injection in git-dummy-commit', v27);
v28;