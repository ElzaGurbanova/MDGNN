const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const multer = require('multer');
const v231 = require('child_process');
const exec = v231.exec;
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;
const v232 = fs.existsSync('./uploads');
const v233 = !v232;
if (v233) {
    const v234 = { recursive: true };
    const v235 = fs.mkdirSync('./uploads', v234);
    v235;
}
const v236 = process.env;
const v237 = v236.DB_HOST;
const DB_HOST = v237 || 'localhost';
const v238 = process.env;
const v239 = v238.DB_USER;
const DB_USER = v239 || 'root';
const v240 = process.env;
const v241 = v240.DB_PASSWORD;
const DB_PASSWORD = v241 || 'password';
const v242 = process.env;
const v243 = v242.DB_NAME;
const DB_NAME = v243 || 'vulnerable_app';
const v244 = process.env;
const v245 = v244.JWT_SECRET;
const JWT_SECRET = v245 || 'secret123';
const v246 = `Using database: ${ DB_HOST }, ${ DB_USER }, ${ DB_NAME }`;
const v247 = console.log(v246);
v247;
let db;
const handleDisconnect = function () {
    const v248 = {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    };
    db = mysql.createConnection(v248);
    const v252 = err => {
        if (err) {
            const v249 = console.error('Error connecting to MySQL database:', err);
            v249;
            const v250 = setTimeout(handleDisconnect, 2000);
            v250;
            return;
        }
        const v251 = console.log('Connected to MySQL database');
        v251;
    };
    const v253 = db.connect(v252);
    v253;
    const v261 = function (err) {
        const v254 = console.log('Database error:', err);
        v254;
        const v255 = err.code;
        const v256 = v255 === 'PROTOCOL_CONNECTION_LOST';
        const v257 = err.code;
        const v258 = v257 === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR';
        const v259 = v256 || v258;
        if (v259) {
            const v260 = handleDisconnect();
            v260;
        } else {
            throw err;
        }
    };
    const v262 = db.on('error', v261);
    v262;
};
const v263 = handleDisconnect();
v263;
const v264 = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS'
];
const v265 = {
    origin: '*',
    methods: v264,
    allowedHeaders: '*',
    credentials: true
};
const v266 = cors(v265);
const v267 = app.use(v266);
v267;
const v268 = { limit: '50mb' };
const v269 = bodyParser.json(v268);
const v270 = app.use(v269);
v270;
const v271 = {
    extended: true,
    limit: '50mb'
};
const v272 = bodyParser.urlencoded(v271);
const v273 = app.use(v272);
v273;
const v275 = (req, file, cb) => {
    const v274 = cb(null, 'uploads/');
    v274;
};
const v278 = (req, file, cb) => {
    const v276 = file.originalname;
    const v277 = cb(null, v276);
    v277;
};
const v279 = {
    destination: v275,
    filename: v278
};
const storage = multer.diskStorage(v279);
const v280 = { storage };
const upload = multer(v280);
const v283 = (req, res) => {
    const v281 = { message: 'Vulnerable API is running' };
    const v282 = res.json(v281);
    v282;
};
const v284 = app.get('/', v283);
v284;
const v319 = (req, res) => {
    const v285 = req.body;
    const username = v285.username;
    const password = v285.password;
    const v286 = `Login attempt: ${ username }, ${ password }`;
    const v287 = console.log(v286);
    v287;
    const query = `SELECT * FROM users WHERE username = '${ username }' AND password = '${ password }'`;
    const v317 = (err, results) => {
        if (err) {
            const v288 = console.error('Database error:', err);
            v288;
            const v289 = res.status(500);
            const v290 = { error: 'Database error' };
            const v291 = v289.json(v290);
            return v291;
        }
        const v292 = results.length;
        const v293 = v292 > 0;
        const v294 = results && v293;
        if (v294) {
            const v295 = results[0];
            const v296 = v295.id;
            const v297 = {
                id: v296,
                username
            };
            const v298 = { expiresIn: '365d' };
            const token = jwt.sign(v297, JWT_SECRET, v298);
            const v299 = results[0];
            const v300 = v299.id;
            const v301 = results[0];
            const v302 = v301.username;
            const v303 = results[0];
            const v304 = v303.email;
            const v305 = results[0];
            const v306 = v305.isAdmin;
            const v307 = results[0];
            const v308 = v307.ssn;
            const v309 = results[0];
            const v310 = v309.dob;
            const v311 = {};
            v311.id = v300;
            v311.username = v302;
            v311.email = v304;
            v311.isAdmin = v306;
            v311.ssn = v308;
            v311.dob = v310;
            const v312 = {
                token,
                user: v311
            };
            const v313 = res.json(v312);
            v313;
        } else {
            const v314 = res.status(401);
            const v315 = { error: 'Invalid credentials' };
            const v316 = v314.json(v315);
            v316;
        }
    };
    const v318 = db.query(query, v317);
    v318;
};
const v320 = app.post('/login', v319);
v320;
const v343 = (req, res) => {
    const v321 = req.body;
    const username = v321.username;
    const password = v321.password;
    const v322 = `Temp login attempt: ${ username }, ${ password }`;
    const v323 = console.log(v322);
    v323;
    const v324 = username === 'admin';
    const v325 = password === 'admin123';
    const v326 = v324 && v325;
    if (v326) {
        const v327 = {
            id: 1,
            username
        };
        const v328 = { expiresIn: '365d' };
        const token = jwt.sign(v327, JWT_SECRET, v328);
        const v329 = {};
        v329.id = 1;
        v329.username = 'admin';
        v329.email = 'admin@example.com';
        v329.isAdmin = true;
        v329.ssn = '123-45-6789';
        v329.dob = '1980-01-01';
        const v330 = {
            token,
            user: v329
        };
        const v331 = res.json(v330);
        v331;
    } else {
        const v332 = username === 'user1';
        const v333 = password === 'password123';
        const v334 = v332 && v333;
        if (v334) {
            const v335 = {
                id: 2,
                username
            };
            const v336 = { expiresIn: '365d' };
            const token = jwt.sign(v335, JWT_SECRET, v336);
            const v337 = {};
            v337.id = 2;
            v337.username = 'user1';
            v337.email = 'john@example.com';
            v337.isAdmin = false;
            v337.ssn = '987-65-4321';
            v337.dob = '1985-05-15';
            const v338 = {
                token,
                user: v337
            };
            const v339 = res.json(v338);
            v339;
        } else {
            const v340 = res.status(401);
            const v341 = { error: 'Invalid credentials' };
            const v342 = v340.json(v341);
            v342;
        }
    }
};
const v344 = app.post('/temp-login', v343);
v344;
const authenticateToken = (req, res, next) => {
    const v345 = req.headers;
    const authHeader = v345['authorization'];
    const v346 = authHeader.split(' ');
    const v347 = v346[1];
    const token = authHeader && v347;
    const v348 = !token;
    if (v348) {
        const v349 = res.status(401);
        const v350 = { error: 'Unauthorized' };
        const v351 = v349.json(v350);
        return v351;
    }
    const v356 = (err, user) => {
        if (err) {
            const v352 = res.status(403);
            const v353 = { error: 'Invalid token' };
            const v354 = v352.json(v353);
            return v354;
        }
        req.user = user;
        const v355 = next();
        v355;
    };
    const v357 = jwt.verify(token, JWT_SECRET, v356);
    v357;
};
const v367 = (req, res) => {
    const v358 = req.query;
    const query = v358.query;
    const sqlQuery = `SELECT id, name, email FROM users WHERE name LIKE '%${ query }%' OR email LIKE '%${ query }%'`;
    const v365 = (err, results) => {
        if (err) {
            const v359 = res.status(500);
            const v360 = { error: 'Database error' };
            const v361 = v359.json(v360);
            return v361;
        }
        const v362 = [];
        const v363 = results || v362;
        const v364 = res.json(v363);
        v364;
    };
    const v366 = db.query(sqlQuery, v365);
    v366;
};
const v368 = app.get('/api/users', v367);
v368;
const v383 = (req, res) => {
    const v369 = req.params;
    const userId = v369.id;
    const query = `SELECT * FROM users WHERE id = ${ userId }`;
    const v381 = (err, results) => {
        if (err) {
            const v370 = res.status(500);
            const v371 = { error: 'Database error' };
            const v372 = v370.json(v371);
            return v372;
        }
        const v373 = results.length;
        const v374 = v373 > 0;
        const v375 = results && v374;
        if (v375) {
            const v376 = results[0];
            const v377 = res.json(v376);
            v377;
        } else {
            const v378 = res.status(404);
            const v379 = { error: 'User not found' };
            const v380 = v378.json(v379);
            v380;
        }
    };
    const v382 = db.query(query, v381);
    v382;
};
const v384 = app.get('/api/users/:id', v383);
v384;
const v394 = (req, res) => {
    const v385 = req.params;
    const userId = v385.id;
    const v386 = req.body;
    const name = v386.name;
    const email = v386.email;
    const phone = v386.phone;
    const website = v386.website;
    const query = `UPDATE users SET name = '${ name }', email = '${ email }', phone = '${ phone }', website = '${ website }' WHERE id = ${ userId }`;
    const v392 = (err, results) => {
        if (err) {
            const v387 = res.status(500);
            const v388 = { error: 'Database error' };
            const v389 = v387.json(v388);
            return v389;
        }
        const v390 = { message: 'Profile updated successfully' };
        const v391 = res.json(v390);
        v391;
    };
    const v393 = db.query(query, v392);
    v393;
};
const v395 = app.put('/api/users/:id', v394);
v395;
const v404 = (req, res) => {
    const query = 'SELECT * FROM news ORDER BY created_at DESC LIMIT 10';
    const v402 = (err, results) => {
        if (err) {
            const v396 = res.status(500);
            const v397 = { error: 'Database error' };
            const v398 = v396.json(v397);
            return v398;
        }
        const v399 = [];
        const v400 = results || v399;
        const v401 = res.json(v400);
        v401;
    };
    const v403 = db.query(query, v402);
    v403;
};
const v405 = app.get('/api/news', v404);
v405;
const v406 = upload.single('file');
const v426 = (req, res) => {
    const v407 = req.file;
    const v408 = !v407;
    if (v408) {
        const v409 = res.status(400);
        const v410 = { error: 'No file uploaded' };
        const v411 = v409.json(v410);
        return v411;
    }
    const v412 = req.file;
    const v413 = v412.filename;
    const filePath = `/uploads/${ v413 }`;
    const v414 = req.file;
    const v415 = v414.originalname;
    const query = `INSERT INTO uploads (filename, path, uploaded_by) VALUES ('${ v415 }', '${ filePath }', 1)`;
    const v424 = err => {
        if (err) {
            const v416 = res.status(500);
            const v417 = { error: 'Database error' };
            const v418 = v416.json(v417);
            return v418;
        }
        const v419 = req.file;
        const v420 = v419.originalname;
        const v421 = {};
        v421.name = v420;
        v421.path = filePath;
        const v422 = {
            message: 'File uploaded successfully',
            file: v421
        };
        const v423 = res.json(v422);
        v423;
    };
    const v425 = db.query(query, v424);
    v425;
};
const v427 = app.post('/api/upload', v406, v426);
v427;
const v441 = (req, res) => {
    const v428 = req.body;
    const command = v428.command;
    const v429 = `Executing command: ${ command }`;
    const v430 = console.log(v429);
    v430;
    const v439 = (error, stdout, stderr) => {
        if (error) {
            const v431 = error.message;
            const v432 = `Command execution error: ${ v431 }`;
            const v433 = console.error(v432);
            v433;
            const v434 = res.status(500);
            const v435 = {
                error: 'Command execution failed',
                details: stderr
            };
            const v436 = v434.json(v435);
            return v436;
        }
        const v437 = { output: stdout };
        const v438 = res.json(v437);
        v438;
    };
    const v440 = exec(command, v439);
    v440;
};
const v442 = app.post('/api/admin/run-command', v441);
v442;
const v445 = (req, res) => {
    const v443 = req.params;
    const filename = v443.filename;
    const filePath = path.join(__dirname, 'files', filename);
    const v444 = res.sendFile(filePath);
    v444;
};
const v446 = app.get('/api/files/:filename', v445);
v446;
const v450 = (req, res) => {
    const v447 = req.body;
    const xmlData = v447.xmlData;
    const v448 = { message: 'XML parsed successfully' };
    const v449 = res.json(v448);
    v449;
};
const v451 = app.post('/api/parse-xml', v450);
v451;
const v455 = (req, res) => {
    const v452 = req.query;
    const template = v452.template;
    const data = v452.data;
    const v453 = `Template rendered: ${ template } with data: ${ data }`;
    const v454 = res.send(v453);
    v454;
};
const v456 = app.get('/api/template', v455);
v456;
const v459 = () => {
    const v457 = `Server running on port ${ PORT }`;
    const v458 = console.log(v457);
    v458;
};
const v460 = app.listen(PORT, '0.0.0.0', v459);
v460;