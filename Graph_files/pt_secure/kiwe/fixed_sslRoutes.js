const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const v27 = app.set('view engine', 'pug');
v27;
const v28 = app.set('views', 'views');
v28;
const v29 = require('fs');
const v30 = path.join(__dirname, '../.well-known');
const WELL_KNOWN_ROOT = v29.realpathSync(v30);
const v51 = (req, res) => {
    const v31 = req.params;
    const v32 = v31.path;
    const v33 = v32 || '';
    const raw = String(v33);
    const name = path.basename(raw);
    const v34 = !name;
    const v35 = name === '.';
    const v36 = v34 || v35;
    const v37 = name === '..';
    const v38 = v36 || v37;
    const v39 = /^[A-Za-z0-9._-]+$/.test(name);
    const v40 = !v39;
    const v41 = v38 || v40;
    if (v41) {
        const v42 = res.status(400);
        const v43 = v42.send('Invalid filename');
        return v43;
    }
    const v44 = { root: WELL_KNOWN_ROOT };
    const v49 = err => {
        if (err) {
            const v45 = err.statusCode;
            const v46 = v45 || 404;
            const v47 = res.status(v46);
            const v48 = v47.end();
            return v48;
        }
    };
    const v50 = res.sendFile(name, v44, v49);
    v50;
};
const v52 = router.get('/:path', v51);
v52;
module.exports = router;