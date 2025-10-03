const v31 = () => {
    const v17 = expect.assertions(2);
    v17;
    const root = require('apiconnect-cli-plugins');
    const fs = require('fs');
    const path = './apiconnect-cli-plugins';
    try {
        const v18 = fs.existsSync(path);
        if (v18) {
            const v19 = fs.unlinkSync(path);
            v19;
        }
    } catch (err) {
        const v20 = console.error(err);
        v20;
    }
    file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(false);
    v22;
    let payload = '& touch apiconnect-cli-plugins &';
    const v23 = root.pluginLoader;
    const v24 = v23.installPlugin(payload, '');
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
    const v30 = v24.catch(v29);
    return v30;
};
const v32 = test('Command Injection in apiconnect-cli-plugins', v31);
v32;