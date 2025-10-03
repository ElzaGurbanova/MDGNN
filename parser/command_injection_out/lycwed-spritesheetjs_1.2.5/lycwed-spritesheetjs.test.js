const v33 = done => {
    const v18 = expect.assertions(2);
    v18;
    let spritesheet = require('lycwed-spritesheetjs');
    const fs = require('fs');
    const path = './lycwed-spritesheetjs';
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
    let file_exist = fs.existsSync(path);
    const v23 = expect(file_exist);
    const v24 = v23.toBe(false);
    v24;
    const v25 = {
        fuzz: '& touch lycwed-spritesheetjs #',
        ext: 'json'
    };
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
    const v32 = spritesheet('./', v25, v31);
    v32;
};
const v34 = test('Command Injection in lycwed-spritesheetjs', v33);
v34;