const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Vulnerable to Path Traversal
// Example: /file?name=../../../../etc/passwd
router.get('/file', (req, res) => {
  const fileName = req.query.name;
  const filePath = path.join(__dirname, '../public/', fileName);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.send(data);
  });
});

module.exports = router;
