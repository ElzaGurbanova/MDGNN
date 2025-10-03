const v33 = done => {
    const v18 = expect.assertions(2);
    v18;
    const SamsungRemote = require('samsung-remote');
    const fs = require('fs');
    const path = './samsung-remote';
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
    const v25 = { ip: '127.0.0.1; touch samsung-remote;' };
    var remote = new SamsungRemote(v25);
    const v31 = function (err) {
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
    const v32 = remote.isAlive(v31);
    v32;
};
const v34 = test('Command Injection in samsung-remote', v33);
v34;