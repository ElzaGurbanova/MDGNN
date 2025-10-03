const v27 = () => {
    const v15 = expect.assertions(1);
    v15;
    const find = require('find-process');
    const fs = require('fs');
    const path = './find-process';
    const command = '$(touch find-process)';
    const v16 = find('pid', command);
    const v21 = function (list) {
        file_exist = fs.existsSync(path);
        const v17 = expect(file_exist);
        const v18 = v17.toBe(true);
        v18;
        const v19 = function (err) {
        };
        const v20 = fs.unlink(path, v19);
        v20;
    };
    const v25 = function (err) {
        const v22 = err.stack;
        const v23 = v22 || err;
        const v24 = console.log(v23);
        v24;
    };
    const v26 = v16.then(v21, v25);
    return v26;
};
const v28 = test('Command Injection in find-process', v27);
v28;