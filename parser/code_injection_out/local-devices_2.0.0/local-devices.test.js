const v23 = () => {
    const v13 = expect.assertions(2);
    v13;
    const fs = require('fs');
    const find = require('local-devices');
    const path = './local-devices';
    file_exist = fs.existsSync(path);
    const v14 = expect(file_exist);
    const v15 = v14.toBe(false);
    v15;
    let userInput = '127.0.0.1 | touch local-devices';
    const v16 = find(userInput);
    const v21 = () => {
        file_exist = fs.existsSync(path);
        const v17 = expect(file_exist);
        const v18 = v17.toBe(true);
        v18;
        const v19 = function (err) {
        };
        const v20 = fs.unlink(path, v19);
        v20;
    };
    const v22 = v16.then(v21);
    return v22;
};
const v24 = test('Arbitrary code execution in local-devices', v23);
v24;