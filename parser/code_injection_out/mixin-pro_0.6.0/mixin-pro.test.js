const v25 = () => {
    const v14 = expect.assertions(2);
    v14;
    const fs = require('fs');
    const v15 = require('mixin-pro');
    const Class = v15.createClass;
    const path = './mixin-pro';
    file_exist = fs.existsSync(path);
    const v16 = expect(file_exist);
    const v17 = v16.toBe(false);
    v17;
    try {
        const Foo = function () {
        };
        const v18 = {
            enumerable: false,
            configurable: false,
            writable: true,
            value: 'static'
        };
        const v19 = Object.defineProperty(Foo, 'name', v18);
        v19;
        Foo.name = 'test2()\n{}; require(`fs`).writeFileSync(\'mixin-pro\', \'\'); function __ctor';
        const v20 = { constructor: Foo };
        let Bar1 = Class(Foo, v20);
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(true);
    v22;
    const v23 = function (err) {
    };
    const v24 = fs.unlink(path, v23);
    v24;
};
const v26 = test('Arbitrary code execution in mixin-pro', v25);
v26;