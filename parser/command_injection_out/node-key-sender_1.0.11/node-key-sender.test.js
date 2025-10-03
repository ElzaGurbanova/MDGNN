const v31 = () => {
    const v17 = expect.assertions(2);
    v17;
    const root = require('node-key-sender');
    const fs = require('fs');
    const path = './node-key-sender';
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
    let attack_code = [
        '&touch',
        'node-key-sender'
    ];
    const v24 = root.execute(attack_code);
    const v29 = () => {
        file_exist = fs.existsSync(path);
        const v25 = expect(file_exist);
        const v26 = v25.toBe(true);
        v26;
        const v27 = function (err) {
        };
        const v28 = fs.unlink(path, v27);
        v28;
    };
    const v30 = v24.then(v29);
    return v30;
};
const v32 = test('Command Injection in node-key-sender', v31);
v32;