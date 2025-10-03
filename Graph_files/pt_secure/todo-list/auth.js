const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const router = express.Router();
const v104 = db => {
    const v57 = (req, res) => {
        const v53 = req.session;
        const v54 = v53.user;
        if (v54) {
            const v55 = res.redirect('/');
            return v55;
        }
        const html = fs.readFileSync('./views/login.html', 'utf8');
        const v56 = res.send(html);
        v56;
    };
    const v58 = router.get('/login', v57);
    v58;
    const v78 = (req, res) => {
        const v59 = req.body;
        const username = v59.username;
        const password = v59.password;
        const v60 = username.replace(/\.\./g, '');
        const sanitizedUsername = v60.trim();
        const v61 = [sanitizedUsername];
        const v76 = (err, row) => {
            const v62 = !row;
            const v63 = err || v62;
            if (v63) {
                const v64 = res.send('Invalid username or password');
                return v64;
            }
            const v65 = row.password;
            const v74 = (err, isMatch) => {
                const v66 = !isMatch;
                const v67 = err || v66;
                if (v67) {
                    const v68 = res.send('Invalid username or password');
                    return v68;
                }
                const v69 = req.session;
                const v70 = row.id;
                const v71 = row.username;
                const v72 = {};
                v72.id = v70;
                v72.username = v71;
                v69.user = v72;
                const v73 = res.redirect('/');
                v73;
            };
            const v75 = bcrypt.compare(password, v65, v74);
            v75;
        };
        const v77 = db.get('SELECT * FROM users WHERE username = ?', v61, v76);
        v77;
    };
    const v79 = router.post('/login', v78);
    v79;
    const v81 = (req, res) => {
        const html = fs.readFileSync('./views/register.html', 'utf8');
        const v80 = res.send(html);
        v80;
    };
    const v82 = router.get('/register', v81);
    v82;
    const v96 = (req, res) => {
        const v83 = req.body;
        const username = v83.username;
        const password = v83.password;
        const v84 = username.replace(/\.\./g, '');
        const sanitizedUsername = v84.trim();
        const v94 = (err, hashedPassword) => {
            if (err) {
                const v85 = res.send('Error hashing password');
                return v85;
            }
            const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
            const v86 = [
                sanitizedUsername,
                hashedPassword
            ];
            const v92 = function (err) {
                if (err) {
                    const v87 = res.send('Error creating user');
                    return v87;
                }
                const v88 = req.session;
                const v89 = this.lastID;
                const v90 = {};
                v90.id = v89;
                v90.username = sanitizedUsername;
                v88.user = v90;
                const v91 = res.redirect('/');
                v91;
            };
            const v93 = db.run(query, v86, v92);
            v93;
        };
        const v95 = bcrypt.hash(password, 10, v94);
        v95;
    };
    const v97 = router.post('/register', v96);
    v97;
    const v102 = (req, res) => {
        const v98 = req.session;
        const v100 = () => {
            const v99 = res.redirect('/login');
            return v99;
        };
        const v101 = v98.destroy(v100);
        v101;
    };
    const v103 = router.get('/logout', v102);
    v103;
    return router;
};
module.exports = v104;