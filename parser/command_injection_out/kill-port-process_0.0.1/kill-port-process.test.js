const v45 = () => {
    const v24 = expect.assertions(2);
    v24;
    const killPortProcess = require('kill-port-process');
    const fs = require('fs');
    const path = './kill-port-process';
    const PORT = '$(touch kill-port-process)';
    try {
        const v25 = fs.existsSync(path);
        if (v25) {
            const v26 = fs.unlinkSync(path);
            v26;
            const v27 = console.log('File removed:', path);
            v27;
        }
    } catch (err) {
        const v28 = console.error(err);
        v28;
    }
    file_exist = fs.existsSync(path);
    const v29 = expect(file_exist);
    const v30 = v29.toBe(false);
    v30;
    const v31 = killPortProcess(PORT);
    const v35 = () => {
        const v32 = console.log('here!');
        v32;
        file_exist = fs.existsSync(path);
        const v33 = expect(file_exist);
        const v34 = v33.toBe(true);
        v34;
    };
    const v36 = v31.then(v35);
    const v37 = err => {
    };
    const v38 = v36.catch(v37);
    const v43 = () => {
        const v39 = console.log('here!!!!');
        v39;
        const v40 = fs.existsSync(path);
        if (v40) {
            const v41 = fs.unlinkSync(path);
            v41;
            const v42 = console.log('File removed!:', path);
            v42;
        }
    };
    const v44 = v38.finally(v43);
    return v44;
};
const v46 = test('Command Injection in kill-port-process', v45);
v46;