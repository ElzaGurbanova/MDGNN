const v35 = done => {
    const v19 = expect.assertions(2);
    v19;
    const v20 = require('child_process');
    exec = v20.exec;
    const fs = require('fs');
    const path = './jison';
    try {
        const v21 = fs.existsSync(path);
        if (v21) {
            const v22 = fs.unlinkSync(path);
            v22;
            const v23 = console.log('File removed:', path);
            v23;
        }
    } catch (err) {
        const v24 = console.error(err);
        v24;
    }
    file_exist = fs.existsSync(path);
    const v25 = expect(file_exist);
    const v26 = v25.toBe(false);
    v26;
    let command = '; touch jison';
    const v27 = 'jison ' + command;
    const v33 = function (error) {
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
    const v34 = exec(v27, v33);
    v34;
};
const v36 = test('Command Injection in jison', v35);
v36;