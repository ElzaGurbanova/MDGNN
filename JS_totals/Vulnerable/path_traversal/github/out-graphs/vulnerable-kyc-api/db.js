const multer = require('multer');
const path = require('path');
const v29 = require('sqlite3');
const sqlite3 = v29.verbose();
const db = new sqlite3.Database(':memory:');
const v46 = () => {
    const v30 = `CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountId INTEGER,
    date TEXT,
    amount REAL,
    pan TEXT,
    card_number TEXT,
    description TEXT
  )`;
    const v31 = db.run(v30);
    v31;
    const v32 = `INSERT INTO transactions 
    (accountId, date, amount, pan, card_number, description)
    VALUES (?, ?, ?, ?, ?, ?)`;
    const stmt = db.prepare(v32);
    const v33 = stmt.run(123, '2024-01-01', 200, 'ABCDE1234F', '4111111111111111', 'SBI Holder');
    const v34 = stmt.run(321, '2024-01-02', 150, 'ABCDE1234F', '4222222222222222', 'CDAC Account');
    const v35 = stmt.run(456, '2024-01-03', 99, 'XYZDE5678L', '4333333333333333', 'PNB');
    const v36 = stmt.run(145, '2024-01-02', 125, 'ABCDE1234F', '4111111111111111', 'Electricity bill');
    const v37 = stmt.run(156, '2024-01-03', 300, 'ABCDE1234F', '4111111111111111', 'Online shopping');
    const v38 = stmt.run(345, '2024-01-04', 150, 'FGHIJ5678K', '4222222222222222', 'Fuel refill');
    const v39 = stmt.run(678, '2024-01-05', 100, 'FGHIJ5678K', '4222222222222222', 'Dinner at restaurant');
    const v40 = stmt.run(789, '2024-01-06', 500, 'KLMNO9012P', '4333333333333333', 'Flight booking');
    const v41 = stmt.run(987, '2024-01-07', 90, 'KLMNO9012P', '4333333333333333', 'Taxi ride');
    const v42 = stmt.run(999, '2024-01-08', 450, 'QRSTU3456V', '4444444444444444', 'Gaming console');
    const v43 = stmt.run(456, '2024-01-09', 120, 'QRSTU3456V', '4444444444444444', 'Streaming subscription');
    const v44 = stmt.run(679, '2024-01-10', 300, 'ZXCVB6789Q', '4555555555555555', 'Groceries and supplies');
    v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44;
    const v45 = stmt.finalize();
    v45;
};
const v47 = db.serialize(v46);
v47;
module.exports = db;
const v49 = function (req, file, cb) {
    const v48 = cb(null, 'uploads/');
    v48;
};
const v55 = function (req, file, cb) {
    const v50 = req.body;
    const v51 = v50.filename;
    const v52 = file.originalname;
    const unsafePath = v51 || v52;
    const fullPath = path.join(__dirname, 'uploads', unsafePath);
    const v53 = console.log('\uD83D\uDEA8 Saving file to:', fullPath);
    v53;
    const v54 = cb(null, unsafePath);
    v54;
};
const v56 = {
    destination: v49,
    filename: v55
};
const storage = multer.diskStorage(v56);