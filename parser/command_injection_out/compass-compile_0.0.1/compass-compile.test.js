const v37 = () => {
    const v20 = expect.assertions(2);
    v20;
    const Root = require('compass-compile');
    let root = new Root();
    const fs = require('fs');
    const path = './compass-compile';
    try {
        const v21 = fs.existsSync(path);
        if (v21) {
            const v22 = fs.unlinkSync(path);
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
    let options = {};
    options.compassCommand = 'touch compass-compile';
    const v26 = root.compile(options);
    const v27 = () => {
    };
    const v28 = v26.then(v27);
    const v29 = err => {
    };
    const v30 = v28.catch(v29);
    const v35 = () => {
        file_exist = fs.existsSync(path);
        const v31 = expect(file_exist);
        const v32 = v31.toBe(true);
        v32;
        const v33 = function (err) {
        };
        const v34 = fs.unlink(path, v33);
        v34;
    };
    const v36 = v30.finally(v35);
    return v36;
};
const v38 = test('Command Injection in compass-compile', v37);
v38;