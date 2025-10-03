const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const router = express.Router();

module.exports = (db) => {
    router.get('/login', (req, res) => {
        if (req.session.user) {
            // If the user is already logged in, redirect to the home page
            return res.redirect('/');
        }
        const html = fs.readFileSync('./views/login.html', 'utf8');
        res.send(html);
    });

    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        const sanitizedUsername = username.replace(/\.\./g, '').trim();

        db.get('SELECT * FROM users WHERE username = ?', [sanitizedUsername], (err, row) => {
            if (err || !row) return res.send('Invalid username or password');

            bcrypt.compare(password, row.password, (err, isMatch) => {
                if (err || !isMatch) return res.send('Invalid username or password');
                req.session.user = { id: row.id, username: row.username };
                res.redirect('/');
            });
        });
    });


    router.get('/register', (req, res) => {
        const html = fs.readFileSync('./views/register.html', 'utf8');
        res.send(html);
    });

    router.post('/register', (req, res) => {
        const { username, password } = req.body;

        // Sanitize the username to prevent path traversal
        const sanitizedUsername = username.replace(/\.\./g, '').trim();

        // Hash the password securely
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.send('Error hashing password');

            // Prepared statement to prevent SQL injections
            const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.run(query, [sanitizedUsername, hashedPassword], function(err) {
                if (err) return res.send('Error creating user');
                req.session.user = { id: this.lastID, username: sanitizedUsername };
                res.redirect('/');
            });
        });
    });

    router.get('/logout', (req, res) => {
        req.session.destroy(() => res.redirect('/login'));
    });


    return router;
};
