const v31 = done => {
    const v17 = expect.assertions(2);
    v17;
    const fs = require('fs');
    const pathM = require('path');
    const resize = require('mobile-icon-resizer');
    const path = './mobile-icon-resizer';
    file_exist = fs.existsSync(path);
    const v18 = expect(file_exist);
    const v19 = v18.toBe(false);
    v19;
    const v20 = pathM.resolve(__dirname, './config');
    let options = {};
    options.config = v20;
    try {
        const v21 = function (err) {
        };
        const v22 = resize(options, v21);
        v22;
    } catch (e) {
        const v23 = console.log(e);
        v23;
    }
    file_exist = fs.existsSync(path);
    const v29 = () => {
        const v24 = expect(file_exist);
        const v25 = v24.toBe(true);
        v25;
        const v26 = function (err) {
        };
        const v27 = fs.unlink(path, v26);
        v27;
        const v28 = done();
        v28;
    };
    const v30 = setTimeout(v29, 500);
    v30;
};
const v32 = test('Arbitrary code execution in mobile-icon-resizer', v31);
v32;