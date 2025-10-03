var fs = require('fs');
const v20 = function (path) {
    const v19 = function (req, res, next) {
        const v11 = req.url;
        var filePath = path + v11;
        const v12 = console.log(filePath);
        v12;
        const v17 = function (error, data) {
            const v13 = !error;
            if (v13) {
                const v14 = console.log('sent');
                v14;
                const v15 = res.end(data);
                v15;
            }
            const v16 = next();
            v16;
        };
        const v18 = fs.readFile(filePath, v17);
        v18;
    };
    return v19;
};
module.exports = v20;