const v35 = done => {
    const v19 = expect.assertions(2);
    v19;
    const a = require('node-ps');
    const fs = require('fs');
    const path = './node-ps';
    try {
        const v20 = fs.existsSync(path);
        if (v20) {
            const v21 = fs.unlinkSync(path);
            v21;
            const v22 = console.log('File removed:', path);
            v22;
        }
    } catch (err) {
        const v23 = console.error(err);
        v23;
    }
    file_exist = fs.existsSync(path);
    const v24 = expect(file_exist);
    const v25 = v24.toBe(false);
    v25;
    const v26 = ['& touch node-ps #'];
    const v27 = { psargs: v26 };
    const v33 = function () {
        file_exist = fs.existsSync(path);
        const v28 = expect(file_exist);
        const v29 = v28.toBe(true);
        v29;
        const v31 = function (err) {
            const v30 = done();
            v30;
        };
        const v32 = fs.unlink(path, v31);
        v32;
    };
    const v34 = a.lookup(v27, v33);
    v34;
};
const v36 = test('Command Injection in node-ps', v35);
v36;