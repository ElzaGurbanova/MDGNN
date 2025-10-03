const v43 = done => {
    const v23 = expect.assertions(2);
    v23;
    const Root = require('effect');
    const fs = require('fs');
    const path = './effect';
    var options = {};
    options.image = '& touch effect';
    try {
        const v24 = fs.existsSync(path);
        if (v24) {
            const v25 = fs.unlinkSync(path);
            v25;
            const v26 = console.log('File removed:', path);
            v26;
        }
    } catch (err) {
        const v27 = console.error(err);
        v27;
    }
    file_exist = fs.existsSync(path);
    const v28 = expect(file_exist);
    const v29 = v28.toBe(false);
    v29;
    const v41 = () => {
        file_exist = fs.existsSync(path);
        const v30 = expect(file_exist);
        const v31 = v30.toBe(true);
        v31;
        try {
            const v32 = fs.unlinkSync('-colorspace');
            v32;
            const v33 = fs.unlinkSync('-edge');
            v33;
            const v34 = fs.unlinkSync('-negate');
            v34;
            const v35 = fs.unlinkSync('-resize');
            v35;
            const v36 = fs.unlinkSync('5');
            v36;
            const v37 = fs.unlinkSync('100%');
            v37;
            const v38 = fs.unlinkSync('Gray');
            v38;
            const v39 = fs.unlinkSync(path);
            v39;
        } catch (err) {
        }
        const v40 = done();
        v40;
    };
    const v42 = Root.edge(options, v41);
    v42;
};
const v44 = test('Command Injection in effect', v43);
v44;