const v33 = () => {
    const v18 = expect.assertions(2);
    v18;
    const v19 = require('onion-oled-js');
    const OLEDExp = v19.OLEDExp;
    const fs = require('fs');
    const path = './onion-oled-js';
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
    let file_exist = fs.existsSync(path);
    const v24 = expect(file_exist);
    const v25 = v24.toBe(false);
    v25;
    const v26 = OLEDExp.scroll(';touch onion-oled-js #');
    const v31 = () => {
        file_exist = fs.existsSync(path);
        const v27 = expect(file_exist);
        const v28 = v27.toBe(true);
        v28;
        const v29 = function (err) {
        };
        const v30 = fs.unlink(path, v29);
        v30;
    };
    const v32 = v26.finally(v31);
    return v32;
};
const v34 = test('Command Injection in onion-oled-js', v33);
v34;