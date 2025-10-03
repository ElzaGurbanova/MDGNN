const express = require('express');
const router = express.Router();
const axios = require('axios');
const v51 = async (req, res) => {
    try {
        const v27 = req.params;
        const size = v27.size;
        const id = v27.id;
        const v28 = [
            'w500',
            'original',
            'w300',
            'w780'
        ];
        const v29 = v28.includes(size);
        const v30 = !v29;
        if (v30) {
            const v31 = res.status(400);
            const v32 = {
                success: false,
                error: 'Invalid size parameter'
            };
            const v33 = v31.json(v32);
            return v33;
        }
        const v34 = id.match(/^[a-zA-Z0-9\/]+\.[a-zA-Z]{3,4}$/);
        const v35 = !v34;
        if (v35) {
            const v36 = res.status(400);
            const v37 = {
                success: false,
                error: 'Invalid image id format'
            };
            const v38 = v36.json(v37);
            return v38;
        }
        const imageUrl = `https://image.tmdb.org/t/p/${ size }/${ id }`;
        const v39 = {
            method: 'get',
            url: imageUrl,
            responseType: 'stream'
        };
        const response = await axios(v39);
        const v40 = response.headers;
        const v41 = v40['content-type'];
        const v42 = res.set('Content-Type', v41);
        v42;
        const v43 = res.set('Cache-Control', 'public, max-age=86400');
        v43;
        const v44 = response.data;
        const v45 = v44.pipe(res);
        v45;
    } catch (error) {
        const v46 = error.message;
        const v47 = console.error('Error fetching image:', v46);
        v47;
        const v48 = res.status(500);
        const v49 = {
            success: false,
            error: 'Failed to load image'
        };
        const v50 = v48.json(v49);
        v50;
    }
};
const v52 = router.get('/tmdb/:size/:id', v51);
v52;
module.exports = router;