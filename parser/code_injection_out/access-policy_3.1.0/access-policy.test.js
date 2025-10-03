const v21 = () => {
    const v12 = expect.assertions(2);
    v12;
    const fs = require('fs');
    let a = require('access-policy');
    const path = './access-policy';
    const v13 = '`; require(`fs`).writeFileSync(`' + path;
    let statements = v13 + '`,``);//';
    data = {};
    file_exist = fs.existsSync(path);
    const v14 = expect(file_exist);
    const v15 = v14.toBe(false);
    v15;
    try {
        const v16 = a.encode(statements, data);
        v16;
    } catch (e) {
    }
    file_exist = fs.existsSync(path);
    const v17 = expect(file_exist);
    const v18 = v17.toBe(true);
    v18;
    const v19 = function (err) {
    };
    const v20 = fs.unlink(path, v19);
    v20;
};
const v22 = test('Arbitrary code execution in access-policy', v21);
v22;