const v19 = () => {
    const v11 = expect.assertions(2);
    v11;
    const fs = require('fs');
    const sea = require('modjs/lib/utils/sea');
    const path = './modjs';
    file_exist = fs.existsSync(path);
    const v12 = expect(file_exist);
    const v13 = v12.toBe(false);
    v13;
    try {
        const v14 = sea.findSeajsConfig('seajs.config({a: require(\'fs\').writeFileSync(\'./modjs\', \'\')})');
        v14;
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v15 = expect(file_exist);
    const v16 = v15.toBe(true);
    v16;
    const v17 = function (err) {
    };
    const v18 = fs.unlink(path, v17);
    v18;
};
const v20 = test('Arbitrary code execution in modjs', v19);
v20;