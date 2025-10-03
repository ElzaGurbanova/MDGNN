const v17 = require('assert');
const doesNotMatch = v17.doesNotMatch;
const v31 = done => {
    const v18 = expect.assertions(2);
    v18;
    const gm = require('gm');
    const fs = require('fs');
    const path = './gm';
    try {
        const v19 = fs.existsSync(path);
        if (v19) {
            const v20 = fs.unlinkSync(path);
            v20;
        }
    } catch (err) {
        const v21 = console.error(err);
        v21;
    }
    file_exist = fs.existsSync(path);
    const v22 = expect(file_exist);
    const v23 = v22.toBe(false);
    v23;
    const v29 = function (err, isEqual, equality, raw, path1, path2) {
        file_exist = fs.existsSync(path);
        const v24 = expect(file_exist);
        const v25 = v24.toBe(true);
        v25;
        const v27 = function (err) {
            const v26 = done();
            v26;
        };
        const v28 = fs.unlink(path, v27);
        v28;
    };
    const v30 = gm.compare('$(touch gm)', '/path/to/another.png', v29);
    v30;
};
const v32 = test('Command Injection in gm', v31);
v32;