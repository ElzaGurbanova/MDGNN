const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const v15 = (req, res) => {
    const v9 = req.query;
    const fileName = v9.name;
    const filePath = path.join(__dirname, '../public/', fileName);
    const v13 = (err, data) => {
        if (err) {
            const v10 = res.status(404);
            const v11 = v10.send('File not found');
            return v11;
        }
        const v12 = res.send(data);
        v12;
    };
    const v14 = fs.readFile(filePath, v13);
    v14;
};
const v16 = router.get('/file', v15);
v16;
module.exports = router;