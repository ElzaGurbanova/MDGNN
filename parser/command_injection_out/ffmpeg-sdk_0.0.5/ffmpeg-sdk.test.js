const v39 = () => {
    const v21 = expect.assertions(2);
    v21;
    const root = require('ffmpeg-sdk');
    const fs = require('fs');
    const path = './ffmpeg-sdk';
    try {
        const v22 = fs.existsSync(path);
        if (v22) {
            const v23 = fs.unlinkSync(path);
            v23;
            const v24 = console.log('File removed:', path);
            v24;
        }
    } catch (err) {
        const v25 = console.error(err);
        v25;
    }
    file_exist = fs.existsSync(path);
    const v26 = expect(file_exist);
    const v27 = v26.toBe(false);
    v27;
    const v28 = root.execute('touch ffmpeg-sdk');
    const v29 = () => {
    };
    const v30 = v28.then(v29);
    const v31 = err => {
    };
    const v32 = v30.catch(v31);
    const v37 = () => {
        file_exist = fs.existsSync(path);
        const v33 = expect(file_exist);
        const v34 = v33.toBe(true);
        v34;
        const v35 = function (err) {
        };
        const v36 = fs.unlink(path, v35);
        v36;
    };
    const v38 = v32.finally(v37);
    return v38;
};
const v40 = test('Command Injection in ffmpeg-sdk', v39);
v40;