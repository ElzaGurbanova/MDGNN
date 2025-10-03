const v21 = () => {
    const v12 = expect.assertions(2);
    v12;
    const fs = require('fs');
    const log = require('m-log');
    const path = './m-log';
    file_exist = fs.existsSync(path);
    const v13 = expect(file_exist);
    const v14 = v13.toBe(false);
    v14;
    try {
        const v15 = { silly: 'yellow"}); require(`fs`).writeFileSync(`m-log`,``); 23//' };
        const v16 = log.setColorTheme(v15);
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
const v22 = test('Arbitrary code execution in m-log', v21);
v22;