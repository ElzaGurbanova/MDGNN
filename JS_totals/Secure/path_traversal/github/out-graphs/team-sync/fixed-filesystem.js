const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const v299 = require('uuid');
const v4 = v299.uuidv4;
const authenticate = require('../middlewares/authenticate');
const uploadsRoot = path.resolve(__dirname, '../uploads');
const assertProjectId = function (id) {
    const v300 = id || 'default-project';
    const pid = String(v300);
    const v301 = /^[A-Za-z0-9_-]+$/.test(pid);
    const v302 = !v301;
    if (v302) {
        const v303 = new Error('Invalid project id');
        throw v303;
    }
    return pid;
};
const safeResolve = function (base, seg = '') {
    const target = path.resolve(base, seg);
    const rel = path.relative(base, target);
    const v304 = rel.startsWith('..');
    const v305 = path.isAbsolute(rel);
    const v306 = v304 || v305;
    if (v306) {
        const v307 = new Error('Invalid path');
        throw v307;
    }
    return target;
};
const ensureDir = function (p) {
    const v308 = fs.existsSync(p);
    const v309 = !v308;
    if (v309) {
        const v310 = { recursive: true };
        const v311 = fs.mkdirSync(p, v310);
        v311;
    }
};
const v323 = function (req, file, cb) {
    try {
        const v312 = req.params;
        const v313 = v312.projectId;
        const projectId = assertProjectId(v313);
        const projectDir = safeResolve(uploadsRoot, projectId);
        const v314 = ensureDir(projectDir);
        v314;
        let bodyDir;
        const v315 = req.body;
        const v316 = v315.directory;
        const v317 = req.body;
        const v318 = v317.directory;
        if (v316) {
            bodyDir = v318;
        } else {
            bodyDir = '';
        }
        let targetDir = projectDir;
        if (bodyDir) {
            targetDir = safeResolve(projectDir, bodyDir);
            const v319 = ensureDir(targetDir);
            v319;
        }
        const v320 = cb(null, targetDir);
        v320;
    } catch (e) {
        const v321 = new Error('Invalid upload directory');
        const v322 = cb(v321);
        v322;
    }
};
const v326 = function (req, file, cb) {
    const v324 = file.originalname;
    const v325 = cb(null, v324);
    v325;
};
const v327 = {
    destination: v323,
    filename: v326
};
const storage = multer.diskStorage(v327);
const v328 = { storage: storage };
const upload = multer(v328);
const getFileInfo = (filePath, basePath) => {
    const stats = fs.statSync(filePath);
    const v329 = path.relative(basePath, filePath);
    const relativePath = v329.replace(/\\/g, '/');
    const name = path.basename(filePath);
    const v330 = relativePath || name;
    const v331 = stats.isDirectory();
    const v332 = stats.size;
    const v333 = stats.mtime;
    const v334 = {};
    v334.name = name;
    v334.path = v330;
    v334.isDirectory = v331;
    v334.size = v332;
    v334.modified = v333;
    return v334;
};
const readDirRecursive = (dirPath, basePath, maxDepth = 3, currentDepth = 0) => {
    const v335 = currentDepth > maxDepth;
    if (v335) {
        const v336 = [];
        return v336;
    }
    const items = [];
    const v337 = { withFileTypes: true };
    const entries = fs.readdirSync(dirPath, v337);
    let entry;
    for (entry of entries) {
        const v338 = entry.name;
        const fullPath = path.join(dirPath, v338);
        const fileInfo = getFileInfo(fullPath, basePath);
        const v339 = entry.isDirectory();
        if (v339) {
            const v340 = currentDepth < maxDepth;
            const v341 = currentDepth + 1;
            const v342 = readDirRecursive(fullPath, basePath, maxDepth, v341);
            const v343 = [];
            let v344;
            if (v340) {
                v344 = v342;
            } else {
                v344 = v343;
            }
            fileInfo.children = v344;
        }
        const v345 = items.push(fileInfo);
        v345;
    }
    return items;
};
const v364 = (req, res) => {
    try {
        const v346 = req.params;
        const v347 = v346.projectId;
        const projectId = assertProjectId(v347);
        const v348 = req.query;
        const v349 = v348.dir;
        const v350 = v349 || '';
        const dir = String(v350);
        const projectDir = safeResolve(uploadsRoot, projectId);
        const targetDir = safeResolve(projectDir, dir);
        const v351 = fs.existsSync(targetDir);
        const v352 = !v351;
        if (v352) {
            const v353 = res.status(404);
            const v354 = {
                success: false,
                message: 'Directory not found'
            };
            const v355 = v353.json(v354);
            return v355;
        }
        const files = readDirRecursive(targetDir, projectDir);
        const v356 = {
            success: true,
            currentDir: dir,
            files
        };
        const v357 = res.json(v356);
        v357;
    } catch (error) {
        const v358 = console.error('Error listing files:', error);
        v358;
        const v359 = res.status(500);
        const v360 = error.message;
        const v361 = 'Failed to list files: ' + v360;
        const v362 = {
            success: false,
            message: v361
        };
        const v363 = v359.json(v362);
        v363;
    }
};
const v365 = router.get('/list/:projectId', authenticate, v364);
v365;
const v387 = (req, res) => {
    try {
        const v366 = req.params;
        const v367 = v366.projectId;
        const projectId = assertProjectId(v367);
        const v368 = req.query;
        const v369 = v368.path;
        const v370 = v369 || '';
        const relPath = String(v370);
        const projectDir = safeResolve(uploadsRoot, projectId);
        const fullPath = safeResolve(projectDir, relPath);
        const v371 = fs.existsSync(fullPath);
        const v372 = !v371;
        const v373 = fs.statSync(fullPath);
        const v374 = v373.isDirectory();
        const v375 = v372 || v374;
        if (v375) {
            const v376 = res.status(404);
            const v377 = {
                success: false,
                message: 'File not found'
            };
            const v378 = v376.json(v377);
            return v378;
        }
        const content = fs.readFileSync(fullPath, 'utf8');
        const v379 = {
            success: true,
            content
        };
        const v380 = res.json(v379);
        v380;
    } catch (error) {
        const v381 = console.error('Error reading file:', error);
        v381;
        const v382 = res.status(500);
        const v383 = error.message;
        const v384 = 'Failed to read file: ' + v383;
        const v385 = {
            success: false,
            message: v384
        };
        const v386 = v382.json(v385);
        v386;
    }
};
const v388 = router.get('/content/:projectId', authenticate, v387);
v388;
const v412 = (req, res) => {
    try {
        const v389 = req.params;
        const v390 = v389.projectId;
        const projectId = assertProjectId(v390);
        const v391 = req.body;
        const v392 = v391.path;
        const v393 = v392 || '';
        const relPath = String(v393);
        const v394 = req.body;
        const content = v394.content;
        const v395 = relPath === '';
        const v396 = content === undefined;
        const v397 = v395 || v396;
        if (v397) {
            const v398 = res.status(400);
            const v399 = {
                success: false,
                message: 'File path and content are required'
            };
            const v400 = v398.json(v399);
            return v400;
        }
        const projectDir = safeResolve(uploadsRoot, projectId);
        const fullPath = safeResolve(projectDir, relPath);
        const v401 = path.dirname(fullPath);
        const v402 = ensureDir(v401);
        v402;
        const v403 = fs.writeFileSync(fullPath, content, 'utf8');
        v403;
        const v404 = {
            success: true,
            message: 'File saved successfully'
        };
        const v405 = res.json(v404);
        v405;
    } catch (error) {
        const v406 = console.error('Error saving file:', error);
        v406;
        const v407 = res.status(500);
        const v408 = error.message;
        const v409 = 'Failed to save file: ' + v408;
        const v410 = {
            success: false,
            message: v409
        };
        const v411 = v407.json(v410);
        v411;
    }
};
const v413 = router.put('/save/:projectId', authenticate, v412);
v413;
const v414 = upload.single('file');
const v442 = (req, res) => {
    try {
        const v415 = req.file;
        const v416 = !v415;
        if (v416) {
            const v417 = res.status(400);
            const v418 = {
                success: false,
                message: 'No file uploaded'
            };
            const v419 = v417.json(v418);
            return v419;
        }
        const v420 = req.file;
        const v421 = v420.originalname;
        const v422 = req.body;
        const v423 = v422.directory;
        const v424 = req.body;
        const v425 = v424.directory;
        const v426 = req.file;
        const v427 = v426.originalname;
        const v428 = req.file;
        const v429 = v428.originalname;
        let v430;
        if (v423) {
            v430 = `${ v425 }/${ v427 }`;
        } else {
            v430 = v429;
        }
        const v431 = req.file;
        const v432 = v431.size;
        const v433 = {};
        v433.name = v421;
        v433.path = v430;
        v433.size = v432;
        const v434 = {
            success: true,
            message: 'File uploaded successfully',
            file: v433
        };
        const v435 = res.json(v434);
        v435;
    } catch (error) {
        const v436 = console.error('Error uploading file:', error);
        v436;
        const v437 = res.status(500);
        const v438 = error.message;
        const v439 = 'Failed to upload file: ' + v438;
        const v440 = {
            success: false,
            message: v439
        };
        const v441 = v437.json(v440);
        v441;
    }
};
const v443 = router.post('/upload/:projectId', authenticate, v414, v442);
v443;
const v514 = (req, res) => {
    try {
        const v444 = req.params;
        const v445 = v444.projectId;
        const projectId = assertProjectId(v445);
        const baseDir = safeResolve(uploadsRoot, projectId);
        const v446 = ensureDir(baseDir);
        v446;
        const v473 = function (req, file, cb) {
            try {
                let filePath = file.originalname;
                const v447 = req.body;
                const filePaths = v447.filePaths;
                let idx;
                const v448 = Array.isArray(filePaths);
                const v451 = p => {
                    const v449 = file.originalname;
                    const v450 = p.endsWith(v449);
                    return v450;
                };
                const v452 = filePaths.findIndex(v451);
                const v453 = String(filePaths);
                const v454 = file.originalname;
                const v455 = v453.endsWith(v454);
                const v456 = -1;
                let v457;
                if (v455) {
                    v457 = 0;
                } else {
                    v457 = v456;
                }
                let v458;
                if (v448) {
                    v458 = v452;
                } else {
                    v458 = v457;
                }
                const v459 = -1;
                if (filePaths) {
                    idx = v458;
                } else {
                    idx = v459;
                }
                const v460 = -1;
                const v461 = idx !== v460;
                if (v461) {
                    const v462 = Array.isArray(filePaths);
                    const v463 = filePaths[idx];
                    if (v462) {
                        filePath = v463;
                    } else {
                        filePath = filePaths;
                    }
                }
                const directory = path.dirname(filePath);
                const v464 = req.body;
                const v465 = v464.directory;
                const v466 = v465 || '';
                const v467 = directory === '.';
                let v468;
                if (v467) {
                    v468 = '';
                } else {
                    v468 = directory;
                }
                const combined = path.join(v466, v468);
                const targetDir = safeResolve(baseDir, combined);
                const v469 = ensureDir(targetDir);
                v469;
                const v470 = cb(null, targetDir);
                v470;
            } catch (e) {
                const v471 = new Error('Invalid upload path');
                const v472 = cb(v471);
                v472;
            }
        };
        const v476 = function (req, file, cb) {
            const v474 = file.originalname;
            const v475 = cb(null, v474);
            v475;
        };
        const v477 = {
            destination: v473,
            filename: v476
        };
        const customStorage = multer.diskStorage(v477);
        const v478 = { storage: customStorage };
        const v479 = multer(v478);
        const upload = v479.array('files');
        const v506 = function (err) {
            if (err) {
                const v480 = console.error('Error in multer upload:', err);
                v480;
                const v481 = res.status(500);
                const v482 = err.message;
                const v483 = 'Failed to upload files: ' + v482;
                const v484 = {
                    success: false,
                    message: v483
                };
                const v485 = v481.json(v484);
                return v485;
            }
            const v486 = req.files;
            const v487 = !v486;
            const v488 = req.files;
            const v489 = v488.length;
            const v490 = v489 === 0;
            const v491 = v487 || v490;
            if (v491) {
                const v492 = res.status(400);
                const v493 = {
                    success: false,
                    message: 'No files uploaded'
                };
                const v494 = v492.json(v493);
                return v494;
            }
            const v495 = req.files;
            const v501 = file => {
                const v496 = file.path;
                const v497 = path.relative(baseDir, v496);
                const relativePath = v497.replace(/\\/g, '/');
                const v498 = file.originalname;
                const v499 = file.size;
                const v500 = {};
                v500.name = v498;
                v500.path = relativePath;
                v500.size = v499;
                return v500;
            };
            const uploadedFiles = v495.map(v501);
            const v502 = req.files;
            const v503 = v502.length;
            const v504 = {
                success: true,
                message: `${ v503 } files uploaded successfully`,
                files: uploadedFiles
            };
            const v505 = res.json(v504);
            v505;
        };
        const v507 = upload(req, res, v506);
        v507;
    } catch (error) {
        const v508 = console.error('Error uploading files:', error);
        v508;
        const v509 = res.status(500);
        const v510 = error.message;
        const v511 = 'Failed to upload files: ' + v510;
        const v512 = {
            success: false,
            message: v511
        };
        const v513 = v509.json(v512);
        v513;
    }
};
const v515 = router.post('/upload-multiple/:projectId', authenticate, v514);
v515;
const v536 = (req, res) => {
    try {
        const v516 = req.params;
        const v517 = v516.projectId;
        const projectId = assertProjectId(v517);
        const v518 = req.body;
        const v519 = v518.path;
        const v520 = v519 || '';
        const relDir = String(v520);
        const v521 = safeResolve(uploadsRoot, projectId);
        const fullPath = safeResolve(v521, relDir);
        const v522 = fs.existsSync(fullPath);
        if (v522) {
            const v523 = res.status(400);
            const v524 = {
                success: false,
                message: 'Directory already exists'
            };
            const v525 = v523.json(v524);
            return v525;
        }
        const v526 = { recursive: true };
        const v527 = fs.mkdirSync(fullPath, v526);
        v527;
        const v528 = {
            success: true,
            message: 'Directory created successfully',
            path: relDir
        };
        const v529 = res.json(v528);
        v529;
    } catch (error) {
        const v530 = console.error('Error creating directory:', error);
        v530;
        const v531 = res.status(500);
        const v532 = error.message;
        const v533 = 'Failed to create directory: ' + v532;
        const v534 = {
            success: false,
            message: v533
        };
        const v535 = v531.json(v534);
        v535;
    }
};
const v537 = router.post('/mkdir/:projectId', authenticate, v536);
v537;
const v565 = (req, res) => {
    try {
        const v538 = req.params;
        const v539 = v538.projectId;
        const projectId = assertProjectId(v539);
        const v540 = req.body;
        const v541 = v540.path;
        const v542 = v541 || '';
        const relPath = String(v542);
        const v543 = req.body;
        const v544 = v543.isDirectory;
        const v545 = !v544;
        const v546 = !v545;
        const isDirectory = v546;
        const v547 = safeResolve(uploadsRoot, projectId);
        const fullPath = safeResolve(v547, relPath);
        const v548 = fs.existsSync(fullPath);
        const v549 = !v548;
        if (v549) {
            const v550 = res.status(404);
            const v551 = {
                success: false,
                message: 'Item not found'
            };
            const v552 = v550.json(v551);
            return v552;
        }
        if (isDirectory) {
            const v553 = { recursive: true };
            const v554 = fs.rmdirSync(fullPath, v553);
            v554;
        } else {
            const v555 = fs.unlinkSync(fullPath);
            v555;
        }
        let v556;
        if (isDirectory) {
            v556 = 'Directory';
        } else {
            v556 = 'File';
        }
        const v557 = {
            success: true,
            message: `${ v556 } deleted successfully`
        };
        const v558 = res.json(v557);
        v558;
    } catch (error) {
        const v559 = console.error('Error deleting item:', error);
        v559;
        const v560 = res.status(500);
        const v561 = error.message;
        const v562 = 'Failed to delete item: ' + v561;
        const v563 = {
            success: false,
            message: v562
        };
        const v564 = v560.json(v563);
        v564;
    }
};
const v566 = router.delete('/:projectId', authenticate, v565);
v566;
const v595 = (req, res) => {
    try {
        const v567 = req.params;
        const v568 = v567.projectId;
        const projectId = assertProjectId(v568);
        const v569 = req.body;
        const v570 = v569.oldPath;
        const v571 = v570 || '';
        const oldRel = String(v571);
        const v572 = req.body;
        const v573 = v572.newPath;
        const v574 = v573 || '';
        const newRel = String(v574);
        const base = safeResolve(uploadsRoot, projectId);
        const fullOldPath = safeResolve(base, oldRel);
        const fullNewPath = safeResolve(base, newRel);
        const v575 = fs.existsSync(fullOldPath);
        const v576 = !v575;
        if (v576) {
            const v577 = res.status(404);
            const v578 = {
                success: false,
                message: 'Source item not found'
            };
            const v579 = v577.json(v578);
            return v579;
        }
        const v580 = fs.existsSync(fullNewPath);
        if (v580) {
            const v581 = res.status(400);
            const v582 = {
                success: false,
                message: 'Destination already exists'
            };
            const v583 = v581.json(v582);
            return v583;
        }
        const v584 = path.dirname(fullNewPath);
        const v585 = ensureDir(v584);
        v585;
        const v586 = fs.renameSync(fullOldPath, fullNewPath);
        v586;
        const v587 = {
            success: true,
            message: 'Item renamed successfully',
            oldPath: oldRel,
            newPath: newRel
        };
        const v588 = res.json(v587);
        v588;
    } catch (error) {
        const v589 = console.error('Error renaming item:', error);
        v589;
        const v590 = res.status(500);
        const v591 = error.message;
        const v592 = 'Failed to rename item: ' + v591;
        const v593 = {
            success: false,
            message: v592
        };
        const v594 = v590.json(v593);
        v594;
    }
};
const v596 = router.put('/rename/:projectId', authenticate, v595);
v596;
module.exports = router;