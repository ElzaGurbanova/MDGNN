const v33 = done => {
    const v18 = expect.assertions(2);
    v18;
    const root = require('im-resize');
    const fs = require('fs');
    const path = './im-resize';
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
    let image = {};
    image.path = '& touch im-resize &';
    const v25 = [];
    let output = {};
    output.versions = v25;
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
    const v32 = root(image, output, v31);
    v32;
};
const v34 = test('Command Injection in im-resize', v33);
v34;