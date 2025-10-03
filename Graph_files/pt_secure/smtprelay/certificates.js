const express = require('express');
const router = express.Router();
const multer = require('multer');
const v397 = require('fs');
const fs = v397.promises;
const path = require('path');
const crypto = require('crypto');
const v398 = require('child_process');
const spawn = v398.spawn;
const v399 = require('../middleware/auth');
const authenticate = v399.authenticate;
const authorize = v399.authorize;
const rateLimit = require('express-rate-limit');
const v400 = 15 * 60;
const v401 = v400 * 1000;
const v402 = {
    windowMs: v401,
    max: 5,
    message: 'Too many certificate operations, please try again later',
    standardHeaders: true,
    legacyHeaders: false
};
const certRateLimit = rateLimit(v402);
const fileLocks = new Map();
const acquireLock = async resource => {
    const v403 = crypto.randomBytes(16);
    const lockId = v403.toString('hex');
    let v404 = fileLocks.has(resource);
    while (v404) {
        const v406 = resolve => {
            const v405 = setTimeout(resolve, 100);
            return v405;
        };
        await new Promise(v406);
        v404 = fileLocks.has(resource);
    }
    const v407 = fileLocks.set(resource, lockId);
    v407;
    return lockId;
};
const releaseLock = (resource, lockId) => {
    const v408 = fileLocks.get(resource);
    const v409 = v408 === lockId;
    if (v409) {
        const v410 = fileLocks.delete(resource);
        v410;
    }
};
const execCommand = (command, args = [], options = {}) => {
    const v437 = (resolve, reject) => {
        const v411 = options.timeout;
        const timeout = v411 || 5000;
        const v412 = process.getuid;
        const v413 = process.getuid();
        let v414;
        if (v412) {
            v414 = v413;
        } else {
            v414 = undefined;
        }
        const v415 = process.getgid;
        const v416 = process.getgid();
        let v417;
        if (v415) {
            v417 = v416;
        } else {
            v417 = undefined;
        }
        const v418 = {
            timeout,
            shell: false,
            uid: v414,
            gid: v417
        };
        const proc = spawn(command, args, v418);
        let stdout = '';
        let stderr = '';
        let dataSize = 0;
        const maxOutput = 50 * 1024;
        const v419 = proc.stdout;
        const v424 = data => {
            dataSize += data.length;
            const v420 = dataSize > maxOutput;
            if (v420) {
                const v421 = proc.kill();
                v421;
                const v422 = new Error('Command output too large');
                const v423 = reject(v422);
                v423;
                return;
            }
            stdout += data.toString();
        };
        const v425 = v419.on('data', v424);
        v425;
        const v426 = proc.stderr;
        const v427 = data => {
            stderr += data.toString();
        };
        const v428 = v426.on('data', v427);
        v428;
        const v434 = code => {
            const v429 = code === 0;
            if (v429) {
                const v430 = resolve(stdout);
                v430;
            } else {
                const v431 = stderr || 'Unknown error';
                const v432 = new Error(`Command failed: ${ v431 }`);
                const v433 = reject(v432);
                v433;
            }
        };
        const v435 = proc.on('close', v434);
        v435;
        const v436 = proc.on('error', reject);
        v436;
    };
    const v438 = new Promise(v437);
    return v438;
};
const sanitizePath = async filepath => {
    const allowedFiles = [
        'cert.pem',
        'key.pem',
        'chain.pem',
        'ca.pem'
    ];
    const basename = path.basename(filepath);
    const v439 = allowedFiles.includes(basename);
    const v440 = !v439;
    if (v440) {
        const v441 = new Error('Invalid filename');
        throw v441;
    }
    const certsDir = path.resolve(__dirname, '../../../certs');
    const resolved = path.join(certsDir, basename);
    const v442 = fs.realpath(certsDir);
    const v443 = () => {
        return certsDir;
    };
    const realCertsDir = await v442.catch(v443);
    const resolvedParent = path.dirname(resolved);
    const v444 = resolvedParent !== realCertsDir;
    const v445 = resolvedParent !== certsDir;
    const v446 = v444 && v445;
    if (v446) {
        const v447 = new Error('Invalid path');
        throw v447;
    }
    try {
        const stats = await fs.lstat(resolved);
        const v448 = stats.isSymbolicLink();
        if (v448) {
            const realPath = await fs.realpath(resolved);
            const v449 = realPath.startsWith(realCertsDir);
            const v450 = !v449;
            if (v450) {
                const v451 = new Error('Symlinks must point within certs directory');
                throw v451;
            }
        }
    } catch (e) {
        const v452 = e.code;
        const v453 = v452 !== 'ENOENT';
        if (v453) {
            throw e;
        }
    }
    return resolved;
};
const validateCertificateSecurity = async certPath => {
    try {
        const v454 = [
            'x509',
            '-in',
            certPath,
            '-noout',
            '-text'
        ];
        const sigAlg = await execCommand('openssl', v454);
        const v455 = /md5|sha1/i.test(sigAlg);
        if (v455) {
            const v456 = new Error('Certificate uses weak signature algorithm');
            throw v456;
        }
        const v457 = /RSA Public-Key: \((\d+) bit\)/.test(sigAlg);
        if (v457) {
            const v458 = RegExp.$1;
            const keySize = parseInt(v458);
            const v459 = keySize < 2048;
            if (v459) {
                const v460 = new Error('RSA key size must be at least 2048 bits');
                throw v460;
            }
        }
        return true;
    } catch (error) {
        const v461 = error.message;
        const v462 = new Error(`Certificate validation failed: ${ v461 }`);
        throw v462;
    }
};
const cleanOldBackups = async () => {
    const certsDir = path.resolve(__dirname, '../../../certs');
    const backupDir = path.join(certsDir, 'backup');
    const maxBackups = 10;
    const v463 = 30 * 24;
    const v464 = v463 * 60;
    const v465 = v464 * 60;
    const maxAge = v465 * 1000;
    try {
        const backups = await fs.readdir(backupDir);
        const now = Date.now();
        const v468 = async name => {
            const fullPath = path.join(backupDir, name);
            const stats = await fs.stat(fullPath);
            const v466 = stats.mtimeMs;
            const v467 = {};
            v467.name = name;
            v467.path = fullPath;
            v467.time = v466;
            return v467;
        };
        const v469 = backups.map(v468);
        const backupStats = await Promise.all(v469);
        const v473 = (a, b) => {
            const v470 = b.time;
            const v471 = a.time;
            const v472 = v470 - v471;
            return v472;
        };
        const v474 = backupStats.sort(v473);
        v474;
        let i = 0;
        const v475 = backupStats.length;
        let v476 = i < v475;
        while (v476) {
            const backup = backupStats[i];
            const v478 = i < maxBackups;
            const v479 = backup.time;
            const v480 = now - v479;
            const v481 = v480 < maxAge;
            const v482 = v478 && v481;
            if (v482) {
                continue;
            }
            const v483 = backup.path;
            const v484 = {
                recursive: true,
                force: true
            };
            await fs.rm(v483, v484);
            const v477 = i++;
            v476 = i < v475;
        }
    } catch (e) {
    }
};
const validatePEMContent = (content, type = 'CERTIFICATE') => {
    const v485 = content.length;
    const v486 = 100 * 1024;
    const v487 = v485 > v486;
    if (v487) {
        const v488 = new Error(`${ type } file too large`);
        throw v488;
    }
    let pemRegex;
    const v489 = type === 'CERTIFICATE';
    if (v489) {
        pemRegex = /^-----BEGIN (CERTIFICATE|TRUSTED CERTIFICATE)-----\r?\n[\s\S]+?\r?\n-----END (CERTIFICATE|TRUSTED CERTIFICATE)-----\r?\n?$/m;
    } else {
        pemRegex = /^-----BEGIN (RSA |EC |ENCRYPTED |)?PRIVATE KEY-----\r?\n[\s\S]+?\r?\n-----END (RSA |EC |ENCRYPTED |)?PRIVATE KEY-----\r?\n?$/m;
    }
    const v490 = pemRegex.test(content);
    const v491 = !v490;
    if (v491) {
        const v492 = new Error(`Invalid ${ type } format`);
        throw v492;
    }
    const suspiciousPatterns = [
        /[;&|`$(){}[\]<>\\]/,
        /\.\.\//,
        /\\x[0-9a-f]{2}/i,
        /<\?xml/i,
        /<!DOCTYPE/i
    ];
    let pattern;
    for (pattern of suspiciousPatterns) {
        const v493 = pattern.test(content);
        if (v493) {
            const v494 = new Error(`Invalid ${ type } content`);
            throw v494;
        }
    }
    const v495 = content.replace(/-----[^-]+-----/g, '');
    const base64Content = v495.replace(/[\r\n\s]/g, '');
    const v496 = /^[A-Za-z0-9+/]+=*$/.test(base64Content);
    const v497 = !v496;
    if (v497) {
        const v498 = new Error(`Invalid base64 in ${ type }`);
        throw v498;
    }
    return true;
};
const v499 = path.join(__dirname, '../../../.temp/');
const v500 = 500 * 1024;
const v501 = {};
v501.fileSize = v500;
v501.files = 3;
v501.fields = 5;
v501.parts = 10;
const v513 = async (req, file, cb) => {
    const v502 = file.originalname;
    const v503 = /^[a-zA-Z0-9_-]+\.(pem|crt|key|cer)$/i.test(v502);
    const v504 = !v503;
    if (v504) {
        const v505 = new Error('Invalid filename');
        const v506 = cb(v505);
        return v506;
    }
    const allowedMimes = [
        'application/x-pem-file',
        'application/x-x509-ca-cert',
        'application/pkix-cert',
        'text/plain'
    ];
    const v507 = file.mimetype;
    const v508 = allowedMimes.includes(v507);
    const v509 = !v508;
    if (v509) {
        const v510 = new Error('Invalid file type');
        const v511 = cb(v510);
        return v511;
    }
    const v512 = cb(null, true);
    v512;
};
const v514 = {
    dest: v499,
    limits: v501,
    fileFilter: v513
};
const upload = multer(v514);
const v515 = authorize('admin');
const v560 = async (req, res) => {
    try {
        const certPath = await sanitizePath('cert.pem');
        const keyPath = await sanitizePath('key.pem');
        const status = {};
        status.hasCertificate = false;
        status.hasPrivateKey = false;
        status.expiryDate = null;
        status.daysUntilExpiry = null;
        status.issuer = null;
        status.subject = null;
        status.isValid = false;
        status.isSelfSigned = false;
        const v516 = fs.access(certPath);
        const v517 = () => {
            return true;
        };
        const v518 = v516.then(v517);
        const v519 = () => {
            return false;
        };
        const v520 = v518.catch(v519);
        const v521 = fs.access(keyPath);
        const v522 = () => {
            return true;
        };
        const v523 = v521.then(v522);
        const v524 = () => {
            return false;
        };
        const v525 = v523.catch(v524);
        const v526 = [
            v520,
            v525
        ];
        const certExists = (await Promise.all(v526))[0];
        const keyExists = (await Promise.all(v526))[1];
        status.hasCertificate = certExists;
        status.hasPrivateKey = keyExists;
        const v527 = status.hasCertificate;
        if (v527) {
            try {
                const v528 = [
                    'x509',
                    '-in',
                    certPath,
                    '-noout',
                    '-enddate'
                ];
                const v529 = execCommand('openssl', v528);
                const v530 = [
                    'x509',
                    '-in',
                    certPath,
                    '-noout',
                    '-issuer'
                ];
                const v531 = execCommand('openssl', v530);
                const v532 = [
                    'x509',
                    '-in',
                    certPath,
                    '-noout',
                    '-subject'
                ];
                const v533 = execCommand('openssl', v532);
                const v534 = [
                    'x509',
                    '-in',
                    certPath,
                    '-noout',
                    '-fingerprint',
                    '-sha256'
                ];
                const v535 = execCommand('openssl', v534);
                const v536 = [
                    v529,
                    v531,
                    v533,
                    v535
                ];
                const enddate = (await Promise.all(v536))[0];
                const issuer = (await Promise.all(v536))[1];
                const subject = (await Promise.all(v536))[2];
                const fingerprint = (await Promise.all(v536))[3];
                const v537 = enddate.replace('notAfter=', '');
                const v538 = v537.trim();
                const expiryDate = new Date(v538);
                const v539 = expiryDate.toISOString();
                status.expiryDate = v539;
                const v540 = Date.now();
                const v541 = expiryDate - v540;
                const v542 = 1000 * 60;
                const v543 = v542 * 60;
                const v544 = v543 * 24;
                const v545 = v541 / v544;
                const v546 = Math.floor(v545);
                status.daysUntilExpiry = v546;
                const v547 = issuer.replace('issuer=', '');
                const v548 = v547.trim();
                status.issuer = v548;
                const v549 = subject.replace('subject=', '');
                const v550 = v549.trim();
                status.subject = v550;
                const v551 = fingerprint.replace(/.*=/, '');
                const v552 = v551.trim();
                status.fingerprint = v552;
                const v553 = status.issuer;
                const v554 = status.subject;
                status.isSelfSigned = v553 === v554;
                const v555 = status.daysUntilExpiry;
                status.isValid = v555 > 0;
            } catch (error) {
                status.error = 'Failed to parse certificate';
            }
        }
        const v556 = res.json(status);
        v556;
    } catch (error) {
        const v557 = res.status(500);
        const v558 = { error: 'Internal server error' };
        const v559 = v557.json(v558);
        v559;
    }
};
const v561 = router.get('/status', authenticate, v515, v560);
v561;
const v562 = authorize('admin');
const v563 = {
    name: 'certificate',
    maxCount: 1
};
const v564 = {
    name: 'privateKey',
    maxCount: 1
};
const v565 = {
    name: 'chain',
    maxCount: 1
};
const v566 = [
    v563,
    v564,
    v565
];
const v567 = upload.fields(v566);
const v653 = async (req, res) => {
    let tempFiles = [];
    let lockId = null;
    try {
        lockId = await acquireLock('certificates');
        const files = req.files;
        const v568 = files.certificate;
        const v569 = !v568;
        const v570 = files.privateKey;
        const v571 = !v570;
        const v572 = v569 || v571;
        if (v572) {
            const v573 = res.status(400);
            const v574 = { error: 'Both certificate and private key are required' };
            const v575 = v573.json(v574);
            return v575;
        }
        const v576 = files.certificate;
        const certFile = v576[0];
        const v577 = files.privateKey;
        const keyFile = v577[0];
        let chainFile;
        const v578 = files.chain;
        const v579 = files.chain;
        const v580 = v579[0];
        if (v578) {
            chainFile = v580;
        } else {
            chainFile = null;
        }
        const tempDir = path.resolve(__dirname, '../../../.temp/');
        const v581 = certFile.path;
        const v582 = v581.startsWith(tempDir);
        const v583 = !v582;
        const v584 = keyFile.path;
        const v585 = v584.startsWith(tempDir);
        const v586 = !v585;
        const v587 = v583 || v586;
        const v588 = chainFile.path;
        const v589 = v588.startsWith(tempDir);
        const v590 = !v589;
        const v591 = chainFile && v590;
        const v592 = v587 || v591;
        if (v592) {
            const v593 = new Error('Invalid upload path');
            throw v593;
        }
        const v594 = certFile.path;
        const v595 = keyFile.path;
        tempFiles = [
            v594,
            v595
        ];
        if (chainFile) {
            const v596 = chainFile.path;
            const v597 = tempFiles.push(v596);
            v597;
        }
        const v598 = certFile.path;
        const v599 = path.basename(v598);
        const safeCertPath = path.resolve(tempDir, v599);
        const certContent = await fs.readFile(safeCertPath, 'utf8');
        const v600 = validatePEMContent(certContent, 'CERTIFICATE');
        v600;
        const v601 = keyFile.path;
        const v602 = path.basename(v601);
        const safeKeyPath = path.resolve(tempDir, v602);
        const keyContent = await fs.readFile(safeKeyPath, 'utf8');
        const v603 = validatePEMContent(keyContent, 'PRIVATE KEY');
        v603;
        await validateCertificateSecurity(safeCertPath);
        const v604 = [
            'x509',
            '-in',
            safeCertPath,
            '-noout'
        ];
        await execCommand('openssl', v604);
        try {
            const v605 = [
                'rsa',
                '-in',
                safeKeyPath,
                '-check',
                '-noout'
            ];
            await execCommand('openssl', v605);
        } catch (rsaError) {
            try {
                const v606 = [
                    'ec',
                    '-in',
                    safeKeyPath,
                    '-check',
                    '-noout'
                ];
                await execCommand('openssl', v606);
            } catch (ecError) {
                const v607 = new Error('Invalid private key');
                throw v607;
            }
        }
        const v608 = [
            'x509',
            '-in',
            safeCertPath,
            '-noout',
            '-pubkey'
        ];
        const certPubKey = await execCommand('openssl', v608);
        const v609 = [
            'rsa',
            '-in',
            safeKeyPath,
            '-pubout'
        ];
        const v610 = execCommand('openssl', v609);
        const v613 = () => {
            const v611 = [
                'ec',
                '-in',
                safeKeyPath,
                '-pubout'
            ];
            const v612 = execCommand('openssl', v611);
            return v612;
        };
        const keyPubKey = await v610.catch(v613);
        const v614 = Buffer.from(certPubKey);
        const v615 = Buffer.from(keyPubKey);
        const v616 = crypto.timingSafeEqual(v614, v615);
        const v617 = !v616;
        if (v617) {
            const v618 = new Error('Certificate and key do not match');
            throw v618;
        }
        const certsDir = path.resolve(__dirname, '../../../certs');
        const v619 = crypto.randomBytes(16);
        const v620 = v619.toString('hex');
        const backupId = v620.replace(/[^a-f0-9]/gi, '');
        const v621 = /^[a-f0-9]{32}$/i.test(backupId);
        const v622 = !v621;
        if (v622) {
            const v623 = new Error('Invalid backup ID generated');
            throw v623;
        }
        const backupDir = path.join(certsDir, 'backup', backupId);
        const v624 = fs.realpath(certsDir);
        const v625 = () => {
            return certsDir;
        };
        const realCertsDir = await v624.catch(v625);
        const v626 = backupDir.startsWith(realCertsDir);
        const v627 = !v626;
        const v628 = backupDir.startsWith(certsDir);
        const v629 = !v628;
        const v630 = v627 && v629;
        if (v630) {
            const v631 = new Error('Invalid backup directory');
            throw v631;
        }
        const v632 = {
            recursive: true,
            mode: 448
        };
        await fs.mkdir(backupDir, v632);
        try {
            const existingCert = await sanitizePath('cert.pem');
            const existingKey = await sanitizePath('key.pem');
            const v633 = path.join(backupDir, 'cert.pem');
            const v634 = fs.copyFile(existingCert, v633);
            const v635 = path.join(backupDir, 'key.pem');
            const v636 = fs.copyFile(existingKey, v635);
            const v637 = [
                v634,
                v636
            ];
            await Promise.all(v637);
        } catch (e) {
        }
        const newCertPath = await sanitizePath('cert.pem');
        const newKeyPath = await sanitizePath('key.pem');
        const tempCertPath = `${ newCertPath }.tmp`;
        const tempKeyPath = `${ newKeyPath }.tmp`;
        const v638 = { mode: 420 };
        await fs.writeFile(tempCertPath, certContent, v638);
        const v639 = { mode: 384 };
        await fs.writeFile(tempKeyPath, keyContent, v639);
        const v640 = fs.rename(tempCertPath, newCertPath);
        const v641 = fs.rename(tempKeyPath, newKeyPath);
        const v642 = [
            v640,
            v641
        ];
        await Promise.all(v642);
        if (chainFile) {
            const v643 = chainFile.path;
            const v644 = path.basename(v643);
            const safeChainPath = path.resolve(tempDir, v644);
            const chainContent = await fs.readFile(safeChainPath, 'utf8');
            const v645 = validatePEMContent(chainContent, 'CERTIFICATE');
            v645;
            const newChainPath = await sanitizePath('chain.pem');
            const tempChainPath = `${ newChainPath }.tmp`;
            const v646 = { mode: 420 };
            await fs.writeFile(tempChainPath, chainContent, v646);
            await fs.rename(tempChainPath, newChainPath);
        }
        await cleanOldBackups();
        const v647 = {
            success: true,
            message: 'Certificates uploaded successfully'
        };
        const v648 = res.json(v647);
        v648;
    } catch (error) {
        const v649 = res.status(400);
        const v650 = { error: 'Upload failed' };
        const v651 = v649.json(v650);
        v651;
    } finally {
        if (lockId) {
            const v652 = releaseLock('certificates', lockId);
            v652;
        }
        let file;
        for (file of tempFiles) {
            try {
                await fs.unlink(file);
            } catch (e) {
            }
        }
    }
};
const v654 = router.post('/upload', authenticate, v562, certRateLimit, v567, v653);
v654;
const v655 = authorize('admin');
const v731 = async (req, res) => {
    let lockId = null;
    try {
        lockId = await acquireLock('certificates');
        const v656 = req.body;
        const commonName = v656.commonName;
        const country = v656.country;
        const state = v656.state;
        const locality = v656.locality;
        const organization = v656.organization;
        const days = v656.days;
        const v657 = !commonName;
        const v658 = typeof commonName;
        const v659 = v658 !== 'string';
        const v660 = v657 || v659;
        if (v660) {
            const v661 = res.status(400);
            const v662 = { error: 'Common Name is required' };
            const v663 = v661.json(v662);
            return v663;
        }
        const sanitize = (input, maxLen = 64) => {
            const v664 = !input;
            if (v664) {
                return '';
            }
            const v665 = String(input);
            const v666 = v665.substring(0, maxLen);
            const v667 = v666.replace(/[^a-zA-Z0-9 .\-]/g, '');
            return v667;
        };
        const sanitizedCN = sanitize(commonName);
        const v668 = !sanitizedCN;
        const v669 = sanitizedCN.length;
        const v670 = v669 < 3;
        const v671 = v668 || v670;
        const v672 = sanitizedCN.length;
        const v673 = v672 > 64;
        const v674 = v671 || v673;
        if (v674) {
            const v675 = res.status(400);
            const v676 = { error: 'Invalid Common Name' };
            const v677 = v675.json(v676);
            return v677;
        }
        const v678 = /^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]$/.test(sanitizedCN);
        const v679 = !v678;
        if (v679) {
            const v680 = res.status(400);
            const v681 = { error: 'Invalid Common Name format' };
            const v682 = v680.json(v681);
            return v682;
        }
        let sanitizedCountry;
        const v683 = sanitize(country, 2);
        const v684 = v683.toUpperCase();
        if (country) {
            sanitizedCountry = v684;
        } else {
            sanitizedCountry = '';
        }
        const sanitizedState = sanitize(state);
        const sanitizedLocality = sanitize(locality);
        const sanitizedOrg = sanitize(organization);
        const v685 = parseInt(days);
        const v686 = v685 || 365;
        const v687 = Math.max(v686, 1);
        const validDays = Math.min(v687, 825);
        const certsDir = path.resolve(__dirname, '../../../certs');
        const v688 = crypto.randomBytes(16);
        const v689 = v688.toString('hex');
        const backupId = v689.replace(/[^a-f0-9]/gi, '');
        const v690 = /^[a-f0-9]{32}$/i.test(backupId);
        const v691 = !v690;
        if (v691) {
            const v692 = new Error('Invalid backup ID generated');
            throw v692;
        }
        const backupDir = path.join(certsDir, 'backup', backupId);
        const v693 = fs.realpath(certsDir);
        const v694 = () => {
            return certsDir;
        };
        const realCertsDir = await v693.catch(v694);
        const v695 = backupDir.startsWith(realCertsDir);
        const v696 = !v695;
        const v697 = backupDir.startsWith(certsDir);
        const v698 = !v697;
        const v699 = v696 && v698;
        if (v699) {
            const v700 = new Error('Invalid backup directory');
            throw v700;
        }
        const v701 = {
            recursive: true,
            mode: 448
        };
        await fs.mkdir(backupDir, v701);
        try {
            const v702 = path.join(backupDir, 'cert.pem');
            const v703 = fs.copyFile(await sanitizePath('cert.pem'), v702);
            const v704 = path.join(backupDir, 'key.pem');
            const v705 = fs.copyFile(await sanitizePath('key.pem'), v704);
            const v706 = [
                v703,
                v705
            ];
            await Promise.all(v706);
        } catch (e) {
        }
        const certPath = await sanitizePath('cert.pem');
        const keyPath = await sanitizePath('key.pem');
        const tempCertPath = `${ certPath }.tmp`;
        const tempKeyPath = `${ keyPath }.tmp`;
        const subjectComponents = [];
        const v707 = /^[A-Z]{2}$/.test(sanitizedCountry);
        const v708 = sanitizedCountry && v707;
        if (v708) {
            const v709 = `C=${ sanitizedCountry }`;
            const v710 = subjectComponents.push(v709);
            v710;
        }
        if (sanitizedState) {
            const v711 = `ST=${ sanitizedState }`;
            const v712 = subjectComponents.push(v711);
            v712;
        }
        if (sanitizedLocality) {
            const v713 = `L=${ sanitizedLocality }`;
            const v714 = subjectComponents.push(v713);
            v714;
        }
        if (sanitizedOrg) {
            const v715 = `O=${ sanitizedOrg }`;
            const v716 = subjectComponents.push(v715);
            v716;
        }
        const v717 = `CN=${ sanitizedCN }`;
        const v718 = subjectComponents.push(v717);
        v718;
        const v719 = subjectComponents.join('/');
        const subject = `/${ v719 }`;
        const v720 = String(validDays);
        const v721 = [
            'req',
            '-x509',
            '-newkey',
            'rsa:4096',
            '-keyout',
            tempKeyPath,
            '-out',
            tempCertPath,
            '-days',
            v720,
            '-nodes',
            '-sha256',
            '-subj',
            subject
        ];
        await execCommand('openssl', v721);
        await fs.chmod(tempKeyPath, 384);
        await fs.chmod(tempCertPath, 420);
        const v722 = fs.rename(tempCertPath, certPath);
        const v723 = fs.rename(tempKeyPath, keyPath);
        const v724 = [
            v722,
            v723
        ];
        await Promise.all(v724);
        await cleanOldBackups();
        const v725 = {
            success: true,
            message: 'Certificate generated successfully'
        };
        const v726 = res.json(v725);
        v726;
    } catch (error) {
        const v727 = res.status(500);
        const v728 = { error: 'Generation failed' };
        const v729 = v727.json(v728);
        v729;
    } finally {
        if (lockId) {
            const v730 = releaseLock('certificates', lockId);
            v730;
        }
    }
};
const v732 = router.post('/generate-self-signed', authenticate, v655, certRateLimit, v731);
v732;
const v733 = authorize('admin');
const v734 = 60 * 1000;
const v735 = {
    windowMs: v734,
    max: 10
};
const v736 = rateLimit(v735);
const v762 = async (req, res) => {
    try {
        const v737 = req.body;
        const hostname = v737.hostname;
        const port = v737.port;
        const v738 = parseInt(port);
        const v739 = v738 || 443;
        const v740 = Math.max(v739, 1);
        const testPort = Math.min(v740, 65535);
        const blockedPatterns = [
            /^127\./,
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[01])\./,
            /^192\.168\./,
            /^169\.254\./,
            /^0\./,
            /^224\./,
            /^::/,
            /^fe80:/i,
            /metadata/i,
            /localhost/i
        ];
        const v741 = hostname || '';
        const v742 = String(v741);
        const testHost = v742.trim();
        let pattern;
        for (pattern of blockedPatterns) {
            const v743 = pattern.test(testHost);
            if (v743) {
                const v744 = res.status(400);
                const v745 = { error: 'Invalid hostname' };
                const v746 = v744.json(v745);
                return v746;
            }
        }
        const v747 = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(testHost);
        const v748 = !v747;
        const v749 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(testHost);
        const v750 = !v749;
        const v751 = v748 && v750;
        if (v751) {
            const v752 = res.status(400);
            const v753 = { error: 'Invalid hostname format' };
            const v754 = v752.json(v753);
            return v754;
        }
        const v755 = [
            '3',
            'openssl',
            's_client',
            '-connect',
            `${ testHost }:${ testPort }`,
            '-servername',
            testHost,
            '-brief'
        ];
        const v756 = { timeout: 4000 };
        const result = await execCommand('timeout', v755, v756);
        const v757 = result.substring(0, 200);
        const v758 = {
            success: true,
            message: 'Connection test completed',
            summary: v757
        };
        const v759 = res.json(v758);
        v759;
    } catch (error) {
        const v760 = {
            success: false,
            message: 'Connection test failed'
        };
        const v761 = res.json(v760);
        v761;
    }
};
const v763 = router.post('/test', authenticate, v733, v736, v762);
v763;
const v764 = authorize('admin');
const v765 = 60 * 1000;
const v766 = {
    windowMs: v765,
    max: 10
};
const v767 = rateLimit(v766);
const v791 = async (req, res) => {
    try {
        const v768 = req.params;
        const type = v768.type;
        const v769 = [
            'certificate',
            'chain'
        ];
        const v770 = v769.includes(type);
        const v771 = !v770;
        if (v771) {
            const v772 = res.status(400);
            const v773 = { error: 'Invalid type' };
            const v774 = v772.json(v773);
            return v774;
        }
        let filename;
        const v775 = type === 'certificate';
        if (v775) {
            filename = 'cert.pem';
        } else {
            filename = 'chain.pem';
        }
        const filepath = await sanitizePath(filename);
        const content = await fs.readFile(filepath, 'utf8');
        const v776 = validatePEMContent(content, 'CERTIFICATE');
        v776;
        const v777 = res.setHeader('Content-Type', 'application/x-pem-file');
        v777;
        const v778 = `attachment; filename="${ filename }"`;
        const v779 = res.setHeader('Content-Disposition', v778);
        v779;
        const v780 = res.setHeader('X-Content-Type-Options', 'nosniff');
        v780;
        const v781 = res.setHeader('Cache-Control', 'no-store');
        v781;
        const v782 = res.send(content);
        v782;
    } catch (error) {
        const v783 = error.code;
        const v784 = v783 === 'ENOENT';
        if (v784) {
            const v785 = res.status(404);
            const v786 = { error: 'Not found' };
            const v787 = v785.json(v786);
            v787;
        } else {
            const v788 = res.status(500);
            const v789 = { error: 'Download failed' };
            const v790 = v788.json(v789);
            v790;
        }
    }
};
const v792 = router.get('/download/:type', authenticate, v764, v767, v791);
v792;
module.exports = router;