const fs = require('fs');
const v14 = file => {
    const v12 = (resolve, reject) => {
        const v10 = (err, content) => {
            if (err) {
                const v8 = reject(err);
                v8;
            } else {
                const v9 = resolve(content);
                v9;
            }
        };
        const v11 = fs.readFile(file, v10);
        return v11;
    };
    const v13 = new Promise(v12);
    return v13;
};
module.exports = v14;