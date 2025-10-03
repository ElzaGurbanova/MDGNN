'use strict';
const fs = require('fs');
const v6 = file => {
    const v5 = done => {
        const v4 = fs.readFile(file, done);
        return v4;
    };
    return v5;
};
module.exports = v6;