const v26 = function (packageName, {registry = '', timeout = null} = {}) {
    try {
        const v14 = /[`$&{}[;|]/g.test(packageName);
        const v15 = /[`$&{}[;|]/g.test(registry);
        const v16 = v14 || v15;
        if (v16) {
            return null;
        }
        let version;
        const v17 = [
            'pipe',
            'pipe',
            'ignore'
        ];
        const config = {};
        config.stdio = v17;
        if (timeout) {
            config.timeout = timeout;
        }
        if (registry) {
            const v18 = require('child_process');
            const v19 = `npm view ${ packageName } version --registry ${ registry }`;
            version = v18.execSync(v19, config);
        } else {
            const v20 = require('child_process');
            const v21 = `npm view ${ packageName } version`;
            version = v20.execSync(v21, config);
        }
        if (version) {
            const v22 = version.toString();
            const v23 = v22.trim();
            const v24 = v23.replace(/^\n*/, '');
            const v25 = v24.replace(/\n*$/, '');
            return v25;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
};
module.exports = v26;