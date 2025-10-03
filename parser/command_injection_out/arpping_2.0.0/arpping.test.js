const v41 = () => {
    const v22 = expect.assertions(2);
    v22;
    const Arpping = require('arpping');
    const fs = require('fs');
    const path = './arpping';
    let arpping = new Arpping();
    try {
        const v23 = fs.existsSync(path);
        if (v23) {
            const v24 = fs.unlinkSync(path);
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
    const v28 = [';touch arpping;'];
    const v29 = arpping.ping(v28);
    const v30 = () => {
    };
    const v31 = v29.then(v30);
    const v33 = err => {
        const v32 = console.log(err);
        return v32;
    };
    const v34 = v31.catch(v33);
    const v39 = () => {
        file_exist = fs.existsSync(path);
        const v35 = expect(file_exist);
        const v36 = v35.toBe(true);
        v36;
        const v37 = function (err) {
        };
        const v38 = fs.unlink(path, v37);
        v38;
    };
    const v40 = v34.finally(v39);
    return v40;
};
const v42 = test('Remote code execution in arpping', v41);
v42;