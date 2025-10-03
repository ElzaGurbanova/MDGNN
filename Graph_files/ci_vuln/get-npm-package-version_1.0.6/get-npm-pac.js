const v20 = function (packageName, {registry = '', timeout = null} = {}) {
    try {
        let version;
        const v11 = [
            'pipe',
            'pipe',
            'ignore'
        ];
        const config = {};
        config.stdio = v11;
        if (timeout) {
            config.timeout = timeout;
        }
        if (registry) {
            const v12 = require('child_process');
            const v13 = `npm view ${ packageName } version --registry ${ registry }`;
            version = v12.execSync(v13, config);
        } else {
            const v14 = require('child_process');
            const v15 = `npm view ${ packageName } version`;
            version = v14.execSync(v15, config);
        }
        if (version) {
            const v16 = version.toString();
            const v17 = v16.trim();
            const v18 = v17.replace(/^\n*/, '');
            const v19 = v18.replace(/\n*$/, '');
            return v19;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
};
module.exports = v20;