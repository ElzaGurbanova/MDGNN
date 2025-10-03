const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Joi = require('joi');
const fs = require('fs');
const crypto = require('crypto');
const db = require('../database');
const v319 = [
    255,
    216,
    255
];
const v320 = [
    'image/jpeg',
    v319
];
const v321 = [
    137,
    80,
    78,
    71
];
const v322 = [
    'image/png',
    v321
];
const v323 = [
    71,
    73,
    70
];
const v324 = [
    'image/gif',
    v323
];
const v325 = [
    v320,
    v322,
    v324
];
const allowedMimeTypes = new Map(v325);
const generateSecureFilename = originalName => {
    const v326 = path.extname(originalName);
    const ext = v326.toLowerCase();
    const secureId = crypto.randomUUID();
    const v327 = `plant-${ secureId }${ ext }`;
    return v327;
};
const validateFileContent = (buffer, mimetype) => {
    const signature = allowedMimeTypes.get(mimetype);
    const v328 = !signature;
    if (v328) {
        return false;
    }
    const v331 = (byte, index) => {
        const v329 = buffer[index];
        const v330 = v329 === byte;
        return v330;
    };
    const v332 = signature.every(v331);
    return v332;
};
const v339 = (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    const normalizedPath = path.normalize(uploadPath);
    const v333 = path.join(__dirname, '../uploads');
    const v334 = normalizedPath.startsWith(v333);
    const v335 = !v334;
    if (v335) {
        const v336 = new Error('Invalid upload path');
        const v337 = cb(v336, null);
        return v337;
    }
    const v338 = cb(null, normalizedPath);
    v338;
};
const v342 = (req, file, cb) => {
    const v340 = file.originalname;
    const secureFilename = generateSecureFilename(v340);
    const v341 = cb(null, secureFilename);
    v341;
};
const v343 = {
    destination: v339,
    filename: v342
};
const storage = multer.diskStorage(v343);
const v344 = 5 * 1024;
const v345 = v344 * 1024;
const v346 = {};
v346.fileSize = v345;
v346.files = 1;
const v355 = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const v347 = file.originalname;
    const v348 = path.extname(v347);
    const v349 = v348.toLowerCase();
    const extname = allowedTypes.test(v349);
    const v350 = file.mimetype;
    const mimetype = allowedMimeTypes.has(v350);
    const v351 = mimetype && extname;
    if (v351) {
        const v352 = cb(null, true);
        return v352;
    } else {
        const v353 = new Error('Only JPEG, PNG, and GIF image files are allowed');
        const v354 = cb(v353);
        v354;
    }
};
const v356 = {
    storage: storage,
    limits: v346,
    fileFilter: v355
};
const upload = multer(v356);
const v357 = Joi.number();
const v358 = v357.integer();
const v359 = v358.required();
const v360 = Joi.string();
const v361 = v360.valid('watering', 'feeding', 'environmental', 'observation', 'training', 'transplant', 'pest_disease', 'deficiency', 'measurement', 'photo');
const v362 = v361.required();
const v363 = Joi.string();
const v364 = v363.max(1000);
const v365 = v364.allow(null, '');
const v366 = Joi.number();
const v367 = v366.allow(null, '');
const v368 = Joi.string();
const v369 = v368.max(20);
const v370 = v369.allow(null, '');
const v371 = Joi.string();
const v372 = v371.max(2000);
const v373 = v372.allow(null, '');
const v374 = Joi.number();
const v375 = v374.min(0);
const v376 = v375.max(14);
const v377 = v376.allow(null, '');
const v378 = Joi.number();
const v379 = v378.min(0);
const v380 = v379.allow(null, '');
const v381 = Joi.number();
const v382 = v381.allow(null, '');
const v383 = Joi.number();
const v384 = v383.min(0);
const v385 = v384.max(100);
const v386 = v385.allow(null, '');
const v387 = Joi.number();
const v388 = v387.min(0);
const v389 = v388.allow(null, '');
const v390 = Joi.number();
const v391 = v390.min(0);
const v392 = v391.allow(null, '');
const v393 = Joi.number();
const v394 = v393.min(0);
const v395 = v394.allow(null, '');
const v396 = Joi.string();
const v397 = v396.max(500);
const v398 = v397.allow(null, '');
const v399 = Joi.number();
const v400 = v399.min(0);
const v401 = v400.allow(null, '');
const v402 = Joi.date();
const v403 = v402.iso();
const v404 = v403.allow(null, '');
const v405 = {
    plant_id: v359,
    type: v362,
    description: v365,
    value: v367,
    unit: v370,
    notes: v373,
    ph_level: v377,
    ec_tds: v380,
    temperature: v382,
    humidity: v386,
    light_intensity: v389,
    co2_level: v392,
    water_amount: v395,
    nutrient_info: v398,
    height_cm: v401,
    logged_at: v404
};
const logSchema = Joi.object(v405);
const v420 = (req, res) => {
    const database = db.getDb();
    const v406 = req.query;
    const plant_id = v406.plant_id;
    const type = v406.type;
    const limit = v406.undefined;
    const offset = v406.undefined;
    let sql = `
    SELECT l.*, p.name as plant_name 
    FROM logs l 
    LEFT JOIN plants p ON l.plant_id = p.id 
    WHERE 1=1
  `;
    const params = [];
    if (plant_id) {
        sql += ' AND l.plant_id = ?';
        const v407 = parseInt(plant_id);
        const v408 = params.push(v407);
        v408;
    }
    if (type) {
        sql += ' AND l.type = ?';
        const v409 = params.push(type);
        v409;
    }
    sql += ' ORDER BY l.logged_at DESC LIMIT ? OFFSET ?';
    const v410 = parseInt(limit);
    const v411 = parseInt(offset);
    const v412 = params.push(v410, v411);
    v412;
    const v418 = (err, rows) => {
        if (err) {
            const v413 = console.error('Error fetching logs:', err);
            v413;
            const v414 = res.status(500);
            const v415 = { error: 'Failed to fetch logs' };
            const v416 = v414.json(v415);
            return v416;
        }
        const v417 = res.json(rows);
        v417;
    };
    const v419 = database.all(sql, params, v418);
    v419;
};
const v421 = router.get('/', v420);
v421;
const v440 = (req, res) => {
    const database = db.getDb();
    const v422 = req.params;
    const v423 = v422.id;
    const logId = parseInt(v423);
    const v424 = isNaN(logId);
    if (v424) {
        const v425 = res.status(400);
        const v426 = { error: 'Invalid log ID' };
        const v427 = v425.json(v426);
        return v427;
    }
    const sql = `
    SELECT l.*, p.name as plant_name 
    FROM logs l 
    LEFT JOIN plants p ON l.plant_id = p.id 
    WHERE l.id = ?
  `;
    const v428 = [logId];
    const v438 = (err, row) => {
        if (err) {
            const v429 = console.error('Error fetching log:', err);
            v429;
            const v430 = res.status(500);
            const v431 = { error: 'Failed to fetch log' };
            const v432 = v430.json(v431);
            return v432;
        }
        const v433 = !row;
        if (v433) {
            const v434 = res.status(404);
            const v435 = { error: 'Log not found' };
            const v436 = v434.json(v435);
            return v436;
        }
        const v437 = res.json(row);
        v437;
    };
    const v439 = database.get(sql, v428, v438);
    v439;
};
const v441 = router.get('/:id', v440);
v441;
const v482 = (req, res) => {
    const v443 = req.body;
    const v442 = logSchema.validate(v443);
    const error = v442.error;
    const value = v442.value;
    if (error) {
        const v444 = res.status(400);
        const v445 = error.details;
        const v446 = v445[0];
        const v447 = v446.message;
        const v448 = { error: v447 };
        const v449 = v444.json(v448);
        return v449;
    }
    const database = db.getDb();
    const v450 = value;
    const plant_id = v450.plant_id;
    const type = v450.type;
    const description = v450.description;
    const value = v450.logValue;
    const unit = v450.unit;
    const notes = v450.notes;
    const ph_level = v450.ph_level;
    const ec_tds = v450.ec_tds;
    const temperature = v450.temperature;
    const humidity = v450.humidity;
    const light_intensity = v450.light_intensity;
    const co2_level = v450.co2_level;
    const water_amount = v450.water_amount;
    const nutrient_info = v450.nutrient_info;
    const height_cm = v450.height_cm;
    const logged_at = v450.logged_at;
    const v451 = [plant_id];
    const v480 = (err, plant) => {
        if (err) {
            const v452 = console.error('Error checking plant:', err);
            v452;
            const v453 = res.status(500);
            const v454 = { error: 'Failed to verify plant' };
            const v455 = v453.json(v454);
            return v455;
        }
        const v456 = !plant;
        if (v456) {
            const v457 = res.status(404);
            const v458 = { error: 'Plant not found' };
            const v459 = v457.json(v458);
            return v459;
        }
        const sql = `
      INSERT INTO logs (
        plant_id, type, description, value, unit, notes,
        ph_level, ec_tds, temperature, humidity, light_intensity,
        co2_level, water_amount, nutrient_info, height_cm, logged_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const v460 = new Date();
        const v461 = v460.toISOString();
        const v462 = logged_at || v461;
        const v463 = [
            plant_id,
            type,
            description,
            logValue,
            unit,
            notes,
            ph_level,
            ec_tds,
            temperature,
            humidity,
            light_intensity,
            co2_level,
            water_amount,
            nutrient_info,
            height_cm,
            v462
        ];
        const v478 = function (err) {
            if (err) {
                const v464 = console.error('Error creating log:', err);
                v464;
                const v465 = res.status(500);
                const v466 = { error: 'Failed to create log' };
                const v467 = v465.json(v466);
                return v467;
            }
            const fetchSql = `
        SELECT l.*, p.name as plant_name 
        FROM logs l 
        LEFT JOIN plants p ON l.plant_id = p.id 
        WHERE l.id = ?
      `;
            const v468 = this.lastID;
            const v469 = [v468];
            const v476 = (err, row) => {
                if (err) {
                    const v470 = console.error('Error fetching created log:', err);
                    v470;
                    const v471 = res.status(500);
                    const v472 = { error: 'Log created but failed to fetch' };
                    const v473 = v471.json(v472);
                    return v473;
                }
                const v474 = res.status(201);
                const v475 = v474.json(row);
                v475;
            };
            const v477 = database.get(fetchSql, v469, v476);
            v477;
        };
        const v479 = database.run(sql, v463, v478);
        v479;
    };
    const v481 = database.get('SELECT id FROM plants WHERE id = ?', v451, v480);
    v481;
};
const v483 = router.post('/', v482);
v483;
const v484 = upload.single('photo');
const v546 = (req, res) => {
    const v485 = req.file;
    const v486 = !v485;
    if (v486) {
        const v487 = res.status(400);
        const v488 = { error: 'No photo uploaded' };
        const v489 = v487.json(v488);
        return v489;
    }
    const v490 = req.file;
    const v491 = v490.path;
    const filePath = path.resolve(v491);
    const uploadDir = path.resolve('./uploads');
    const v492 = filePath.startsWith(uploadDir);
    const v493 = !v492;
    if (v493) {
        const v494 = res.status(400);
        const v495 = { error: 'Invalid file path' };
        const v496 = v494.json(v495);
        return v496;
    }
    const buffer = fs.readFileSync(filePath);
    const v497 = req.file;
    const v498 = v497.mimetype;
    const v499 = validateFileContent(buffer, v498);
    const v500 = !v499;
    if (v500) {
        const v501 = fs.unlinkSync(filePath);
        v501;
        const v502 = res.status(400);
        const v503 = { error: 'Invalid file content. File does not match expected image format.' };
        const v504 = v502.json(v503);
        return v504;
    }
    const v505 = req.body;
    const plant_id = v505.plant_id;
    const description = v505.description;
    const v506 = !plant_id;
    if (v506) {
        const v507 = fs.unlinkSync(filePath);
        v507;
        const v508 = res.status(400);
        const v509 = { error: 'Plant ID is required' };
        const v510 = v508.json(v509);
        return v510;
    }
    const database = db.getDb();
    const v511 = req.file;
    const v512 = v511.filename;
    const photoUrl = `/uploads/${ v512 }`;
    const v513 = parseInt(plant_id);
    const v514 = [v513];
    const v544 = (err, plant) => {
        if (err) {
            const v515 = console.error('Error checking plant:', err);
            v515;
            const v516 = res.status(500);
            const v517 = { error: 'Failed to verify plant' };
            const v518 = v516.json(v517);
            return v518;
        }
        const v519 = !plant;
        if (v519) {
            const v520 = res.status(404);
            const v521 = { error: 'Plant not found' };
            const v522 = v520.json(v521);
            return v522;
        }
        const sql = `
      INSERT INTO logs (plant_id, type, description, photo_url, logged_at)
      VALUES (?, 'photo', ?, ?, ?)
    `;
        const v523 = parseInt(plant_id);
        const v524 = description || 'Photo upload';
        const v525 = new Date();
        const v526 = v525.toISOString();
        const v527 = [
            v523,
            v524,
            photoUrl,
            v526
        ];
        const v542 = function (err) {
            if (err) {
                const v528 = console.error('Error creating photo log:', err);
                v528;
                const v529 = res.status(500);
                const v530 = { error: 'Failed to create photo log' };
                const v531 = v529.json(v530);
                return v531;
            }
            const fetchSql = `
        SELECT l.*, p.name as plant_name 
        FROM logs l 
        LEFT JOIN plants p ON l.plant_id = p.id 
        WHERE l.id = ?
      `;
            const v532 = this.lastID;
            const v533 = [v532];
            const v540 = (err, row) => {
                if (err) {
                    const v534 = console.error('Error fetching created photo log:', err);
                    v534;
                    const v535 = res.status(500);
                    const v536 = { error: 'Photo log created but failed to fetch' };
                    const v537 = v535.json(v536);
                    return v537;
                }
                const v538 = res.status(201);
                const v539 = v538.json(row);
                v539;
            };
            const v541 = database.get(fetchSql, v533, v540);
            v541;
        };
        const v543 = database.run(sql, v527, v542);
        v543;
    };
    const v545 = database.get('SELECT id FROM plants WHERE id = ?', v514, v544);
    v545;
};
const v547 = router.post('/photo', v484, v546);
v547;
const v597 = (req, res) => {
    const v548 = req.params;
    const v549 = v548.id;
    const logId = parseInt(v549);
    const v550 = isNaN(logId);
    if (v550) {
        const v551 = res.status(400);
        const v552 = { error: 'Invalid log ID' };
        const v553 = v551.json(v552);
        return v553;
    }
    const v555 = req.body;
    const v554 = logSchema.validate(v555);
    const error = v554.error;
    const value = v554.value;
    if (error) {
        const v556 = res.status(400);
        const v557 = error.details;
        const v558 = v557[0];
        const v559 = v558.message;
        const v560 = { error: v559 };
        const v561 = v556.json(v560);
        return v561;
    }
    const database = db.getDb();
    const v562 = value;
    const plant_id = v562.plant_id;
    const type = v562.type;
    const description = v562.description;
    const value = v562.logValue;
    const unit = v562.unit;
    const notes = v562.notes;
    const ph_level = v562.ph_level;
    const ec_tds = v562.ec_tds;
    const temperature = v562.temperature;
    const humidity = v562.humidity;
    const light_intensity = v562.light_intensity;
    const co2_level = v562.co2_level;
    const water_amount = v562.water_amount;
    const nutrient_info = v562.nutrient_info;
    const height_cm = v562.height_cm;
    const logged_at = v562.logged_at;
    const v563 = [plant_id];
    const v595 = (err, plant) => {
        if (err) {
            const v564 = console.error('Error checking plant:', err);
            v564;
            const v565 = res.status(500);
            const v566 = { error: 'Failed to verify plant' };
            const v567 = v565.json(v566);
            return v567;
        }
        const v568 = !plant;
        if (v568) {
            const v569 = res.status(404);
            const v570 = { error: 'Plant not found' };
            const v571 = v569.json(v570);
            return v571;
        }
        const sql = `
      UPDATE logs SET 
        plant_id = ?, type = ?, description = ?, value = ?, unit = ?, notes = ?,
        ph_level = ?, ec_tds = ?, temperature = ?, humidity = ?, light_intensity = ?,
        co2_level = ?, water_amount = ?, nutrient_info = ?, height_cm = ?, logged_at = ?
      WHERE id = ?
    `;
        const v572 = new Date();
        const v573 = v572.toISOString();
        const v574 = logged_at || v573;
        const v575 = [
            plant_id,
            type,
            description,
            logValue,
            unit,
            notes,
            ph_level,
            ec_tds,
            temperature,
            humidity,
            light_intensity,
            co2_level,
            water_amount,
            nutrient_info,
            height_cm,
            v574,
            logId
        ];
        const v593 = function (err) {
            if (err) {
                const v576 = console.error('Error updating log:', err);
                v576;
                const v577 = res.status(500);
                const v578 = { error: 'Failed to update log' };
                const v579 = v577.json(v578);
                return v579;
            }
            const v580 = this.changes;
            const v581 = v580 === 0;
            if (v581) {
                const v582 = res.status(404);
                const v583 = { error: 'Log not found' };
                const v584 = v582.json(v583);
                return v584;
            }
            const fetchSql = `
        SELECT l.*, p.name as plant_name 
        FROM logs l 
        LEFT JOIN plants p ON l.plant_id = p.id 
        WHERE l.id = ?
      `;
            const v585 = [logId];
            const v591 = (err, row) => {
                if (err) {
                    const v586 = console.error('Error fetching updated log:', err);
                    v586;
                    const v587 = res.status(500);
                    const v588 = { error: 'Log updated but failed to fetch' };
                    const v589 = v587.json(v588);
                    return v589;
                }
                const v590 = res.json(row);
                v590;
            };
            const v592 = database.get(fetchSql, v585, v591);
            v592;
        };
        const v594 = database.run(sql, v575, v593);
        v594;
    };
    const v596 = database.get('SELECT id FROM plants WHERE id = ?', v563, v595);
    v596;
};
const v598 = router.put('/:id', v597);
v598;
const v619 = (req, res) => {
    const v599 = req.params;
    const v600 = v599.id;
    const logId = parseInt(v600);
    const v601 = isNaN(logId);
    if (v601) {
        const v602 = res.status(400);
        const v603 = { error: 'Invalid log ID' };
        const v604 = v602.json(v603);
        return v604;
    }
    const database = db.getDb();
    const v605 = [logId];
    const v617 = function (err) {
        if (err) {
            const v606 = console.error('Error deleting log:', err);
            v606;
            const v607 = res.status(500);
            const v608 = { error: 'Failed to delete log' };
            const v609 = v607.json(v608);
            return v609;
        }
        const v610 = this.changes;
        const v611 = v610 === 0;
        if (v611) {
            const v612 = res.status(404);
            const v613 = { error: 'Log not found' };
            const v614 = v612.json(v613);
            return v614;
        }
        const v615 = { message: 'Log deleted successfully' };
        const v616 = res.json(v615);
        v616;
    };
    const v618 = database.run('DELETE FROM logs WHERE id = ?', v605, v617);
    v618;
};
const v620 = router.delete('/:id', v619);
v620;
const v635 = (req, res) => {
    const v621 = req.params;
    const v622 = v621.plant_id;
    const plantId = parseInt(v622);
    const v623 = isNaN(plantId);
    if (v623) {
        const v624 = res.status(400);
        const v625 = { error: 'Invalid plant ID' };
        const v626 = v624.json(v625);
        return v626;
    }
    const database = db.getDb();
    const sql = `
    SELECT 
      type,
      COUNT(*) as count,
      MAX(logged_at) as last_logged,
      AVG(value) as avg_value
    FROM logs 
    WHERE plant_id = ? 
    GROUP BY type
    ORDER BY count DESC
  `;
    const v627 = [plantId];
    const v633 = (err, rows) => {
        if (err) {
            const v628 = console.error('Error fetching log stats:', err);
            v628;
            const v629 = res.status(500);
            const v630 = { error: 'Failed to fetch log statistics' };
            const v631 = v629.json(v630);
            return v631;
        }
        const v632 = res.json(rows);
        v632;
    };
    const v634 = database.all(sql, v627, v633);
    v634;
};
const v636 = router.get('/stats/:plant_id', v635);
v636;
module.exports = router;