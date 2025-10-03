let haveAVX = true;
let cpuInfo = 'No CPU Info';
const fs = require('fs');
const v348 = process.platform;
const isLinux = v348 === 'linux';
let err = undefined;
if (isLinux) {
    const v349 = fs.readFileSync('/proc/cpuinfo');
    cpuInfo = String(v349);
    haveAVX = cpuInfo.includes('avx');
}
const v350 = !haveAVX;
if (v350) {
    const v351 = console.error('WARNING!!!!!!!! AVX instruction set not detected');
    v351;
}
const axios = require('axios');
const Path = require('path');
const crypto = require('crypto');
const v352 = process.env;
const v353 = v352.CACHE_IMAGE_HASH_FILE;
const v354 = !v353;
const v355 = !v354;
if (v355) {
    const v356 = process.env;
    const v357 = v356.CACHE_IMAGE_HASH_FILE;
    const v358 = v357.endsWith('/');
    const v359 = !v358;
    if (v359) {
        const v360 = process.env;
        const v361 = process.env;
        const v362 = v361.CACHE_IMAGE_HASH_FILE;
        v360.CACHE_IMAGE_HASH_FILE = v362 + '/';
    }
    const v363 = process.env;
    const cacheFolder = v363.CACHE_IMAGE_HASH_FILE;
    const v364 = fs.existsSync(cacheFolder);
    const v365 = !v364;
    if (v365) {
        const v366 = 'Creating cache folder: ' + cacheFolder;
        const v367 = console.log(v366);
        v367;
        const v368 = { recursive: true };
        const v369 = fs.mkdirSync(cacheFolder, v368);
        v369;
    }
    try {
        const v370 = process.env;
        const v371 = v370.CACHE_IMAGE_HASH_FILE;
        const v372 = fs.constants;
        const v373 = v372.R_OK;
        const v374 = fs.constants;
        const v375 = v374.W_OK;
        const v376 = v373 | v375;
        const v377 = fs.accessSync(v371, v376);
        v377;
    } catch (e) {
        const v378 = console.log('Cache folder is not readable and writable, disabling cache');
        v378;
        const v379 = e.message;
        const v380 = console.log(v379);
        v380;
        const v381 = process.env;
        v381.CACHE_IMAGE_HASH_FILE = undefined;
    }
}
let tf;
let nsfw = {};
const v382 = process.env;
const v383 = v382.GPU;
if (v383) {
    tf = require('@tensorflow/tfjs-node-gpu');
    const v384 = console.log('Using GPU');
    v384;
} else {
    tf = require('@tensorflow/tfjs-node');
}
nsfw = require('nsfwjs');
const v385 = tf.enableProdMode();
v385;
let v3_NSFWModel;
let currentModel = {};
currentModel.url = 'Default';
currentModel.size = 'Default';
const v386 = process.env;
const supportGIF = v386.SUPPORT_GIF_CLASSIFICATION;
if (supportGIF) {
    const v387 = console.log('SUPPORT_GIF_CLASSIFICATION');
    v387;
}
const v388 = {};
v388.Hentai = 'Anime';
v388.Sexy = 'ArtificialProvocative';
v388.Neutral = 'DigitalDrawing';
const v389 = {};
v389.n1 = 'NaturallyProvocative';
const v390 = {};
v390.n1 = 'Disturbing';
const v391 = {};
v391.n1 = 'SeductiveArt';
const v392 = {};
v392.Drawing = 'Digital';
v392.Sexy = v389;
v392.Porn = v390;
v392.Hentai = v391;
const v393 = {};
v393.Neutral = 'SexuallyProvocative';
v393.Porn = 'SeductivePorn';
const v394 = {};
v394.n1 = 'PornSeductive';
const v395 = {};
v395.n1 = 'HentaiClips';
const v396 = {};
v396.n1 = 'SoftPorn';
const v397 = {};
v397.Sexy = v394;
v397.Hentai = v395;
v397.Neutral = v396;
const v398 = {};
v398.n1 = 'R34';
const v399 = {};
v399.Porn = 'Doujin18';
v399.Drawing = v398;
const categories = {};
categories.Drawing = v388;
categories.Neutral = v392;
categories.Sexy = v393;
categories.Porn = v397;
categories.Hentai = v399;
const assignReport = function (t1, t2, reportPrediction) {
    let v2;
    let c2;
    let v1;
    let c1;
    c1 = t1.className;
    v1 = t1.probability;
    c2 = t2.className;
    v2 = t2.probability;
    const v400 = categories[c1];
    const v401 = v400[c2];
    if (v401) {
        const v402 = categories[c1];
        let c3 = v402[c2];
        const v403 = c3.n1;
        if (v403) {
            const v404 = c3.n1;
            reportPrediction[v404] = v1 - v2;
            const v405 = c3.n1;
            const v406 = c3.n1;
            const v407 = reportPrediction[v406];
            reportPrediction[v405] = 1 - v407;
        } else {
            reportPrediction[c3] = v1 - v2;
        }
    } else {
        const v408 = t1.className;
        const v409 = 'Not implemented: ' + v408;
        const v410 = v409 + ':';
        const v411 = t2.className;
        const v412 = v410 + v411;
        const v413 = console.log(v412);
        v413;
    }
    return reportPrediction;
};
const classify = async function (image) {
    const v414 = !v3_NSFWModel;
    if (v414) {
        const v415 = module.exports;
        await v415.init();
    }
    const prediction = await v3_NSFWModel.classify(image);
    let reportPrediction = {};
    let t1 = prediction[0];
    let t2 = prediction[1];
    let t3 = prediction[2];
    let t4 = prediction[4];
    reportPrediction = assignReport(t1, t2, reportPrediction);
    let predictionKey1;
    for (predictionKey1 in prediction) {
        const v416 = prediction[predictionKey1];
        let c1 = v416.className;
        const v417 = prediction[predictionKey1];
        const v418 = v417.probability;
        reportPrediction[c1] = v418;
    }
    return reportPrediction;
};
const getImageType = function (content) {
    const v419 = content instanceof Buffer;
    const v420 = !v419;
    const v421 = content instanceof Uint8Array;
    const v422 = !v421;
    const v423 = v420 && v422;
    if (v423) {
        const v424 = typeof content;
        const v425 = 'Expected image buffer or Uint8Array, got ' + v424;
        const v426 = new Error(v425);
        throw v426;
    }
    const v427 = content.length;
    const v428 = v427 > 3;
    const v429 = content[0];
    const v430 = v429 === 255;
    const v431 = v428 && v430;
    const v432 = content[1];
    const v433 = v432 === 216;
    const v434 = v431 && v433;
    const v435 = content[2];
    const v436 = v435 === 255;
    const v437 = v434 && v436;
    if (v437) {
        return 'JPEG';
    } else {
        const v438 = content.length;
        const v439 = v438 > 4;
        const v440 = content[0];
        const v441 = v440 === 71;
        const v442 = v439 && v441;
        const v443 = content[1];
        const v444 = v443 === 73;
        const v445 = v442 && v444;
        const v446 = content[2];
        const v447 = v446 === 70;
        const v448 = v445 && v447;
        const v449 = content[3];
        const v450 = v449 === 56;
        const v451 = v448 && v450;
        if (v451) {
            return 'GIF';
        } else {
            const v452 = content.length;
            const v453 = v452 > 8;
            const v454 = content[0];
            const v455 = v454 === 137;
            const v456 = v453 && v455;
            const v457 = content[1];
            const v458 = v457 === 80;
            const v459 = v456 && v458;
            const v460 = content[2];
            const v461 = v460 === 78;
            const v462 = v459 && v461;
            const v463 = content[3];
            const v464 = v463 === 71;
            const v465 = v462 && v464;
            const v466 = content[4];
            const v467 = v466 === 13;
            const v468 = v465 && v467;
            const v469 = content[5];
            const v470 = v469 === 10;
            const v471 = v468 && v470;
            const v472 = content[6];
            const v473 = v472 === 26;
            const v474 = v471 && v473;
            const v475 = content[7];
            const v476 = v475 === 10;
            const v477 = v474 && v476;
            if (v477) {
                return 'PNG';
            } else {
                const v478 = content.length;
                const v479 = v478 > 3;
                const v480 = content[0];
                const v481 = v480 === 66;
                const v482 = v479 && v481;
                const v483 = content[1];
                const v484 = v483 === 77;
                const v485 = v482 && v484;
                if (v485) {
                    return 'BMP';
                } else {
                    const v486 = 'Expected image (BMP, JPEG, PNG, or GIF), but got unsupported ' + 'image type';
                    const v487 = new Error(v486);
                    throw v487;
                }
            }
        }
    }
};
const hostsFilter = function () {
    const v488 = process.env;
    const v489 = v488.ALLOWED_HOST;
    const v490 = v489 || 'cdn.discordapp.com;media.discordapp.net;github.com';
    const allowedHost = v490.split(';');
    const v491 = process.env;
    const v492 = v491.BLOCKED_HOST;
    const v493 = v492 || 'localhost;127.0.0.1;::1';
    const blockedHost = v493.split(';');
    const v494 = process.env;
    const v495 = v494.ALLOW_ALL_HOST;
    const v496 = !v495;
    const v497 = !v496;
    const allowedAll = v497;
    const v498 = {};
    v498.allowedHost = allowedHost;
    v498.blockedHost = blockedHost;
    v498.allowedAll = allowedAll;
    return v498;
};
const hostAllowed = function (host) {
    const filter = hostsFilter();
    const v499 = filter.blockedHost;
    const v500 = v499.includes(host);
    if (v500) {
        return false;
    }
    const v501 = filter.allowedAll;
    if (v501) {
        return true;
    }
    const v502 = filter.allowedHost;
    const v503 = v502.includes(host);
    return v503;
};
const hashData = function (data) {
    const v504 = !data;
    if (v504) {
        return data;
    }
    const v505 = Buffer.isBuffer(data);
    const v506 = typeof data;
    const v507 = v506 === 'Uint8Array';
    const v508 = v505 || v507;
    if (v508) {
        const v509 = crypto.createHash('sha256');
        const v510 = v509.update(data);
        const v511 = v510.digest('hex');
        return v511;
    }
    const v512 = data.length;
    const v513 = v512 === 64;
    const v514 = data.match(/^[0-9a-fA-F]+$/);
    const v515 = v513 && v514;
    if (v515) {
        return data;
    }
    const v516 = data + '';
    data = v516.replace(/[^a-zA-Z0-9]/g, '.');
    data = data.replace(/\.+/g, '.');
    data = data.replace(/^\.+|\.+$/g, '');
    const v517 = crypto.createHash('sha256');
    const v518 = v517.update(data);
    const v519 = v518.digest('hex');
    return v519;
};
const selfTestHashData = function () {
    let i = 0;
    let v520 = i < 100;
    while (v520) {
        const v522 = Math.random();
        const v523 = v522.toString(36);
        const v524 = v523.substring(2, 15);
        const v525 = Math.random();
        const v526 = v525.toString(36);
        const v527 = v526.substring(2, 15);
        let data = v524 + v527;
        let hash = hashData(data);
        const v528 = hash.length;
        const v529 = v528 !== 64;
        if (v529) {
            const v530 = new Error('Hash length is not 64');
            throw v530;
        }
        const v531 = hashData(data);
        const v532 = hash !== v531;
        if (v532) {
            const v533 = 'Hash is not deterministic: ' + hash;
            const v534 = v533 + ' != ';
            const v535 = hashData(data);
            const v536 = v534 + v535;
            const v537 = new Error(v536);
            throw v537;
        }
        const v521 = i++;
        v520 = i < 100;
    }
    const v538 = process.env;
    const v539 = v538.NODE_ENV;
    const v540 = v539 === 'test';
    if (v540) {
        const v541 = console.log('Hash data self test passed');
        v541;
    }
};
const v542 = selfTestHashData();
v542;
const hashCache = require('../config/cache');
let averageTimeToProcess = 0;
let ivebeenhere = false;
let initResolve = [];
const v543 = process.env;
const v544 = v543.TEST_URL;
const v545 = v544 || 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/SIPI_Jelly_Beans_4.1.07.tiff/lossy-page1-256px-SIPI_Jelly_Beans_4.1.07.tiff.jpg';
const v570 = async function () {
    if (v3_NSFWModel) {
        return;
    }
    if (ivebeenhere) {
        const v547 = resolve => {
            const v546 = initResolve.push(resolve);
            v546;
        };
        const waitIPromise = new Promise(v547);
        await waitIPromise;
        return;
    } else {
        ivebeenhere = true;
    }
    if (v3_NSFWModel) {
        return;
    }
    const v548 = process.env;
    const model_url = v548.NSFW_MODEL_URL;
    const v549 = process.env;
    const shape_size = v549.NSFW_MODEL_SHAPE_SIZE;
    try {
        const v550 = !model_url;
        const v551 = !shape_size;
        const v552 = v550 || v551;
        if (v552) {
            v3_NSFWModel = await nsfw.load();
        } else {
            v3_NSFWModel = {};
            const v553 = parseInt(shape_size);
            const v554 = { size: v553 };
            v3_NSFWModel = await nsfw.load(model_url, v554);
            currentModel.size = shape_size;
            currentModel.url = model_url;
            const v555 = process.env;
            const v556 = v555.NODE_ENV;
            const v557 = v556 !== 'test';
            if (v557) {
                const v558 = 'Loaded: ' + model_url;
                const v559 = v558 + ':';
                const v560 = v559 + shape_size;
                const v561 = console.info(v560);
                v561;
            }
        }
        const v562 = process.env;
        const v563 = v562.NODE_ENV;
        const v564 = v563 !== 'test';
        if (v564) {
            const v565 = console.info('The NSFW Model was loaded successfully!');
            v565;
        }
    } catch (err) {
        const v566 = console.error(err);
        v566;
    }
    const v568 = resolve => {
        const v567 = resolve();
        return v567;
    };
    const v569 = initResolve.forEach(v568);
    v569;
};
const v586 = async function (data, hash) {
    const v571 = process.env;
    const v572 = v571.CACHE_IMAGE_HASH_FILE;
    const v573 = !v572;
    if (v573) {
        return false;
    }
    const v574 = !hash;
    if (v574) {
        hash = this.hashData(data);
    }
    const v575 = hash.indexOf('/');
    const v576 = -1;
    const v577 = v575 !== v576;
    if (v577) {
        hash = hash.replace(/\//g, '.');
    }
    const v578 = hash.indexOf('\\');
    const v579 = -1;
    const v580 = v578 !== v579;
    if (v580) {
        hash = hash.replace(/\\/g, '.');
    }
    const v581 = process.env;
    const v582 = v581.CACHE_IMAGE_HASH_FILE;
    const path = Path.resolve(v582, hash);
    const v583 = fs.existsSync(path);
    if (v583) {
        return false;
    }
    const v584 = { flag: 'w' };
    const v585 = fs.writeFileSync(path, data, v584);
    v585;
    return true;
};
const v640 = async function (data, url = undefined) {
    let hexed = {};
    hexed.binaryHash = undefined;
    hexed.stringHash = undefined;
    if (hashCache) {
        const v587 = this.hashData(data);
        hexed.binaryHash = v587;
        const v588 = this.hashData(url);
        hexed.stringHash = v588;
        const v589 = hexed.stringHash;
        const v590 = !v589;
        if (v590) {
            const v591 = hexed.binaryHash;
            hexed.stringHash = v591;
        }
        const v592 = hexed.stringHash;
        let cached = await hashCache.get(v592);
        if (cached) {
            return cached;
        }
        const v593 = hexed.binaryHash;
        cached = await hashCache.get(v593);
        if (cached) {
            return cached;
        }
    }
    if (err) {
        const v594 = err.toString();
        const v595 = {};
        v595.error = v594;
        v595.status = 500;
        return v595;
    }
    const v596 = hexed.binaryHash;
    const v597 = this.saveImage(data, v596);
    const v601 = r => {
        if (r) {
            const v598 = hexed.binaryHash;
            const v599 = 'Saved image: ' + v598;
            const v600 = console.log(v599);
            v600;
        }
    };
    const v602 = v597.then(v601);
    v602;
    let reportPrediction = {};
    let image = {};
    const v603 = function () {
    };
    image.dispose = v603;
    let gif = false;
    try {
        const v604 = getImageType(data);
        gif = v604 === 'GIF';
    } catch (e) {
        const v605 = e.toString();
        const v606 = {};
        v606.error = v605;
        v606.status = 415;
        return v606;
    }
    const v607 = process.env;
    const v608 = v607.EXPERIMENTAL_RATELIMIT;
    if (v608) {
        const v613 = (resolve, reject) => {
            const v610 = () => {
                const v609 = resolve();
                v609;
            };
            const v611 = averageTimeToProcess / 2;
            const v612 = setTimeout(v610, v611);
            v612;
        };
        await new Promise(v613);
    }
    const startTime = Date.now();
    if (gif) {
        const v614 = !supportGIF;
        if (v614) {
            const v615 = {};
            v615.error = 'GIF support is not enabled';
            v615.status = 415;
            return v615;
        }
        reportPrediction.data = await v3_NSFWModel.classifyGif(data);
        const v616 = reportPrediction.data;
        const v621 = item => {
            let newItem = {};
            const v619 = item2 => {
                const v617 = item2.className;
                const v618 = item2.probability;
                newItem[v617] = v618;
            };
            const v620 = item.forEach(v619);
            v620;
            return newItem;
        };
        const v622 = v616.map(v621);
        reportPrediction.data = v622;
    } else {
        const v623 = tf.node;
        image = await v623.decodeImage(data, 3);
        reportPrediction.data = [await classify(image)];
    }
    const v624 = image.dispose();
    v624;
    reportPrediction.model = currentModel;
    const v625 = new Date();
    const v626 = v625.getTime();
    reportPrediction.timestamp = v626;
    const v627 = hexed.stringHash;
    const v628 = hexed.binaryHash;
    let v629;
    if (url) {
        v629 = v627;
    } else {
        v629 = v628;
    }
    reportPrediction.hex = v629;
    const v630 = Date.now();
    reportPrediction.time = v630 - startTime;
    const v631 = process.env;
    const v632 = v631.TEST_MODE;
    if (v632) {
        reportPrediction.cache = 'miss';
        reportPrediction.average_time = averageTimeToProcess;
    }
    if (hashCache) {
        const v633 = hexed.binaryHash;
        await hashCache.set(v633, reportPrediction);
        const v634 = hexed.stringHash;
        const v635 = hexed.binaryHash;
        const v636 = v634 !== v635;
        if (v636) {
            const v637 = hexed.stringHash;
            await hashCache.set(v637, reportPrediction);
        }
    }
    const v638 = reportPrediction.time;
    const v639 = averageTimeToProcess + v638;
    averageTimeToProcess = v639 / 2;
    return reportPrediction;
};
const v691 = async function (url) {
    if (hashCache) {
        const v641 = this.hashData(url);
        const data = await hashCache.get(v641);
        if (data) {
            return data;
        }
    }
    let pic;
    let result = {};
    let redirectCounter = 0;
    while (true) {
        const v642 = redirectCounter > 5;
        if (v642) {
            const v643 = {};
            v643.error = 'Too many redirects';
            v643.status = 400;
            return v643;
        }
        try {
            const v644 = new URL(url);
            const host = v644.hostname;
            const v645 = hostAllowed(host);
            if (v645) {
                const v649 = function (status) {
                    const v646 = status >= 200;
                    const v647 = status < 400;
                    const v648 = v646 && v647;
                    return v648;
                };
                const v650 = {
                    responseType: 'arraybuffer',
                    maxContentLength: 150000000,
                    maxRedirects: 0,
                    validateStatus: v649
                };
                pic = await axios.get(url, v650);
                const v651 = pic.status;
                const v652 = v651 >= 300;
                const v653 = pic.status;
                const v654 = v653 < 400;
                const v655 = v652 && v654;
                const v656 = pic.headers;
                const v657 = v656.location;
                const v658 = v655 && v657;
                if (v658) {
                    const v659 = pic.headers;
                    const v660 = v659.location;
                    const v661 = v660.startsWith('http');
                    if (v661) {
                        const v662 = pic.headers;
                        url = v662.location;
                        const v663 = redirectCounter++;
                        v663;
                        continue;
                    } else {
                        const v664 = new URL(url);
                        const v665 = v664.origin;
                        const v666 = pic.headers;
                        const v667 = v666.location;
                        url = v665 + v667;
                    }
                    const v668 = redirectCounter++;
                    v668;
                } else {
                    break;
                }
            } else {
                const v669 = 'Host not allowed: ' + host;
                const v670 = {
                    message: v669,
                    status: 403
                };
                throw v670;
            }
        } catch (err) {
            const v671 = 'Download Image Error for "' + url;
            const v672 = v671 + '": ';
            const v673 = err.message;
            const v674 = err.message;
            const v675 = v674 + ' ';
            const v676 = err.status;
            const v677 = v675 + v676;
            let v678;
            if (v673) {
                v678 = v677;
            } else {
                v678 = err;
            }
            let v679;
            if (err) {
                v679 = v678;
            } else {
                v679 = 'Unknown Error';
            }
            result.message = v672 + v679;
            const v680 = result.message;
            const v681 = console.error(v680);
            v681;
            const v682 = err.response;
            const v683 = err.response;
            const v684 = v683.status;
            const v685 = err.status;
            const v686 = v685 || 500;
            let v687;
            if (v682) {
                v687 = v684;
            } else {
                v687 = v686;
            }
            result.status = v687;
            throw result;
        }
    }
    try {
        const v688 = pic.data;
        result = await this.digest(v688, url);
    } catch (err) {
        const v689 = console.error('Prediction Error: ', err);
        v689;
        const v690 = err.toString();
        result.error = v690;
        result.status = 500;
        throw result;
    }
    return result;
};
const v693 = function () {
    const v692 = v3_NSFWModel !== undefined;
    return v692;
};
const v694 = {};
v694.categories = categories;
v694.hostsFilter = hostsFilter;
v694.hostAllowed = hostAllowed;
v694.hashData = hashData;
v694.TEST_URL = v545;
v694.init = v570;
v694.saveImage = v586;
v694.digest = v640;
v694.classify = v691;
v694.available = v693;
module.exports = v694;