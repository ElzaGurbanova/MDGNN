'use strict';
const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const v339 = `${ __dirname }/Config.js`;
const Config = require(v339);
const Server = function Server(userConfig) {
    this.config = new this.Config(userConfig);
};
const deploy = function deploy() {
    return deploy;
};
Server.deploy = deploy;
const onRawRequest = function onRawRequest(request, response, serve) {
};
Server.onRawRequest = onRawRequest;
const onRequest = function onRequest(request, response, serve) {
};
Server.onRequest = onRequest;
const beforeServe = function beforeServe(request, response, body, encoding, serve) {
};
Server.beforeServe = beforeServe;
const afterServe = function afterServe(request) {
};
Server.afterServe = afterServe;
const serve = function serve() {
    return serve;
};
Server.serve = serve;
const serveFile = function serveFile() {
    return serveFile;
};
Server.serveFile = serveFile;
const Config = function Config() {
    return Config;
};
Server.Config = Config;
const Server = function Server() {
    return Server;
};
Server.Server = Server;
Server['is_class'] = true;
const deploy = function (userConfig, readyCallback = function () {
}) {
    const v340 = requestRecieved.bind(this);
    const v341 = http.createServer(v340);
    const v342 = {
        value: v341,
        writable: false,
        enumerable: true
    };
    const v343 = Object.defineProperty(this, 'server', v342);
    v343;
    if (userConfig) {
        const v344 = this.config;
        const v345 = Object.assign(v344, userConfig);
        v345;
    }
    const v346 = this.config;
    const v347 = v346.https;
    const v348 = this.config;
    const v349 = v348.https;
    const v350 = v349.privateKey;
    const v351 = v347 && v350;
    const v352 = this.config;
    const v353 = v352.https;
    const v354 = v353.certificate;
    const v355 = v351 && v354;
    if (v355) {
        const v356 = this.config;
        const v357 = v356.https;
        const v358 = v357.port;
        const v359 = !v358;
        if (v359) {
            const v360 = this.config;
            const v361 = v360.https;
            v361.port = 443;
        }
        const v362 = this.config;
        const v363 = this.config;
        const v364 = v363.https;
        const v365 = v364.privateKey;
        const v366 = fs.readFileSync(v365);
        const v367 = this.config;
        const v368 = v367.https;
        const v369 = v368.certificate;
        const v370 = fs.readFileSync(v369);
        const v371 = this.config;
        const v372 = v371.https;
        const v373 = v372.passphrase;
        const v374 = {};
        v374.key = v366;
        v374.cert = v370;
        v374.passphrase = v373;
        v362.httpsOptions = v374;
        const v375 = this.config;
        const v376 = v375.https;
        const v377 = v376.ca;
        if (v377) {
            const v380 = this.config;
            const v381 = v380.https;
            const v382 = v381.ca;
            const v383 = fs.readFileSync(v382);
            v379.ca = v383;
        }
        const v384 = this.config;
        const v385 = v384.httpsOptions;
        const v386 = requestRecieved.bind(this);
        const v387 = https.createServer(v385, v386);
        const v388 = {
            value: v387,
            writable: false,
            enumerable: true
        };
        const v389 = Object.defineProperty(this, 'secureServer', v388);
        v389;
    } else {
        const v390 = this.config;
        const v391 = {};
        v391.only = false;
        v390.https = v391;
    }
    const v392 = this.config;
    const v393 = this.config;
    const v394 = v393.domain;
    v392.logID = `### ${ v394 } server`;
    const v395 = this.config;
    const v396 = v395.verbose;
    if (v396) {
        const v397 = this.config;
        const v398 = v397.logID;
        const v399 = `${ v398 } configured with ###\n\n`;
        const v400 = this.config;
        const v401 = console.log(v399, v400);
        v401;
    }
    const v402 = this.server;
    const v403 = this.config;
    const v404 = v403.server;
    const v405 = v404.timeout;
    v402.timeout = v405;
    const v406 = this.config;
    const v407 = v406.https;
    const v408 = v407.only;
    const v409 = !v408;
    if (v409) {
        const v410 = this.server;
        const v411 = this.config;
        const v412 = v411.port;
        const v422 = function () {
            const v413 = this.config;
            const v414 = v413.verbose;
            if (v414) {
                const v415 = this.config;
                const v416 = v415.logID;
                const v417 = this.config;
                const v418 = v417.port;
                const v419 = `${ v416 } listening on port ${ v418 } ###\n\n`;
                const v420 = console.log(v419);
                v420;
            }
            const v421 = readyCallback(this);
            v421;
        };
        const v423 = v422.bind(this);
        const v424 = v410.listen(v412, v423);
        v424;
    }
    const v425 = this.config;
    const v426 = v425.httpsOptions;
    if (v426) {
        const v427 = this.secureServer;
        const v428 = this.config;
        const v429 = v428.https;
        const v430 = v429.port;
        const v441 = function () {
            const v431 = this.config;
            const v432 = v431.verbose;
            if (v432) {
                const v433 = this.config;
                const v434 = v433.logID;
                const v435 = this.config;
                const v436 = v435.https;
                const v437 = v436.port;
                const v438 = `HTTPS: ${ v434 } listening on port ${ v437 } ###\n\n`;
                const v439 = console.log(v438);
                v439;
            }
            const v440 = readyCallback(this);
            v440;
        };
        const v442 = v441.bind(this);
        const v443 = v427.listen(v430, v442);
        v443;
    }
};
const setHeaders = function (response, headers) {
    const keys = Object.keys(headers);
    let i;
    for (i in keys) {
        const v444 = keys[i];
        const v445 = keys[i];
        const v446 = headers[v445];
        const v447 = response.setHeader(v444, v446);
        v447;
    }
};
const serveFile = function (filename, exists, request, response) {
    const v448 = !exists;
    if (v448) {
        const v449 = this.config;
        const v450 = v449.verbose;
        if (v450) {
            const v451 = this.config;
            const v452 = v451.logID;
            const v453 = `${ v452 } 404 ###\n\n`;
            const v454 = console.log(v453);
            v454;
        }
        const v455 = !response;
        if (v455) {
            return false;
        }
        response.statusCode = 404;
        const v456 = this.config;
        const v457 = v456.errors;
        const v458 = v457.headers;
        const v459 = setHeaders(response, v458);
        v459;
        const v460 = this.config;
        const v461 = v460.errors;
        const v462 = v461['404'];
        const v463 = this.serve(request, response, v462);
        v463;
        return;
    }
    const v464 = path.extname(filename);
    const contentType = v464.slice(1);
    const v465 = this.config;
    const v466 = v465.contentType;
    const v467 = v466[contentType];
    const v468 = !v467;
    if (v468) {
        const v469 = this.config;
        const v470 = v469.verbose;
        if (v470) {
            const v471 = this.config;
            const v472 = v471.logID;
            const v473 = `${ v472 } 415 ###\n\n`;
            const v474 = console.log(v473);
            v474;
        }
        response.statusCode = 415;
        const v475 = this.config;
        const v476 = v475.errors;
        const v477 = v476.headers;
        const v478 = setHeaders(response, v477);
        v478;
        const v479 = this.config;
        const v480 = v479.errors;
        const v481 = v480['415'];
        const v482 = this.serve(request, response, v481);
        v482;
        return;
    }
    const v483 = fs.statSync(filename);
    const v484 = v483.isDirectory();
    if (v484) {
        const v485 = this.config;
        const v486 = v485.server;
        const v487 = v486.index;
        filename += `/${ v487 }`;
    }
    const v488 = this.config;
    const v489 = v488.restrictedType;
    const v490 = v489[contentType];
    if (v490) {
        const v491 = this.config;
        const v492 = v491.verbose;
        if (v492) {
            const v493 = this.config;
            const v494 = v493.logID;
            const v495 = `${ v494 } 403 ###\n\n`;
            const v496 = console.log(v495);
            v496;
        }
        response.statusCode = 403;
        const v497 = this.config;
        const v498 = v497.errors;
        const v499 = v498.headers;
        const v500 = setHeaders(response, v499);
        v500;
        const v501 = this.config;
        const v502 = v501.errors;
        const v503 = v502['403'];
        const v504 = this.serve(request, response, v503);
        v504;
        return;
    }
    const v535 = function (err, file) {
        if (err) {
            const v505 = this.config;
            const v506 = v505.verbose;
            if (v506) {
                const v507 = this.config;
                const v508 = v507.logID;
                const v509 = `${ v508 } 500 ###\n\n`;
                const v510 = console.log(v509, err, '\n\n');
                v510;
            }
            response.statusCode = 500;
            const v511 = this.config;
            const v512 = v511.errors;
            const v513 = v512.headers;
            const v514 = setHeaders(response, v513);
            v514;
            const v515 = this.config;
            const v516 = v515.errors;
            const v517 = v516['500'];
            const v518 = v517.replace(/\{\{err\}\}/g, err);
            const v519 = this.serve(request, response, v518);
            v519;
            return;
        }
        const v520 = this.config;
        const v521 = v520.contentType;
        const v522 = v521[contentType];
        const v523 = response.setHeader('Content-Type', v522);
        v523;
        const v524 = this.config;
        const v525 = v524.server;
        const v526 = v525.noCache;
        if (v526) {
            const v527 = response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            v527;
        }
        response.statusCode = 200;
        const v528 = this.serve(request, response, file, 'binary');
        v528;
        const v529 = this.config;
        const v530 = v529.verbose;
        if (v530) {
            const v531 = this.config;
            const v532 = v531.logID;
            const v533 = `${ v532 } 200 ###\n\n`;
            const v534 = console.log(v533);
            v534;
        }
        return;
    };
    const v536 = v535.bind(this);
    const v537 = fs.readFile(filename, 'binary', v536);
    v537;
};
const serve = function (request, response, body, encoding) {
    const v538 = response.statusCode;
    const v539 = !v538;
    if (v539) {
        response.statusCode = 200;
    }
    const v540 = response.getHeader('Content-Type');
    const v541 = !v540;
    if (v541) {
        const v542 = response.setHeader('Content-Type', 'text/plain');
        v542;
        const v543 = this.config;
        const v544 = v543.verbose;
        if (v544) {
            const v545 = this.config;
            const v546 = v545.logID;
            const v547 = `${ v546 } response content-type header not specified ###\n\nContent-Type set to: text/plain\n\n`;
            const v548 = console.log(v547);
            v548;
        }
    }
    const v549 = !encoding;
    if (v549) {
        encoding = 'utf8';
        const v550 = this.config;
        const v551 = v550.verbose;
        if (v551) {
            const v552 = this.config;
            const v553 = v552.logID;
            const v554 = `${ v553 } encoding not specified ###\nencoding set to:\n`;
            const v555 = console.log(v554, encoding, '\n\n');
            v555;
        }
    }
    const refBody = new RefString();
    const refEncoding = new RefString();
    refBody.value = body;
    refEncoding.value = encoding;
    const v556 = completeServing.bind(this);
    const v557 = this.beforeServe(request, response, refBody, refEncoding, v556);
    if (v557) {
        return;
    }
    ;
    const v558 = completeServing.bind(this);
    const v559 = v558(request, response, refBody, encoding);
    v559;
    return;
};
const completeServing = function (request, response, refBody, refEncoding) {
    const v560 = refBody instanceof RefString;
    const v561 = !v560;
    if (v561) {
        refBody = new RefString(refBody);
    }
    const v562 = refEncoding instanceof RefString;
    const v563 = !v562;
    if (v563) {
        const v564 = refEncoding || 'binary';
        refEncoding = new RefString(v564);
    }
    const v565 = response.finished;
    if (v565) {
        const v566 = this.afterServe(request);
        v566;
        return;
    }
    const v567 = refBody.value;
    const v568 = refEncoding.value;
    const v569 = this.afterServe;
    const v570 = v569.bind(this, request);
    const v571 = response.end(v567, v568, v570);
    v571;
};
const RefString = function RefString(value) {
    if (value) {
        this._string = value;
    }
};
const value = function value() {
    const v572 = this._string;
    return v572;
};
RefString.value = value;
const value = function value(value) {
    this._string = value;
    const v573 = this._string;
    return v573;
};
RefString.value = value;
RefString['is_class'] = true;
const requestRecieved = function (request, response) {
    const v574 = this.config;
    const v575 = v574.log;
    if (v575) {
        const v576 = request.method;
        const v577 = request.url;
        const v578 = request.headers;
        const logData = {};
        logData.method = v576;
        logData.url = v577;
        logData.headers = v578;
        const v579 = this.config;
        const v580 = v579.logFunction(logData);
        v580;
    }
    const v581 = request.url;
    let uri = url.parse(v581);
    uri.protocol = 'http';
    const v582 = request.headers;
    const v583 = v582.host;
    uri.hostname = v583;
    uri.host = uri.hostname;
    uri.port = 80;
    const v584 = uri.query;
    const v585 = querystring.parse(v584);
    uri.query = v585;
    const v586 = request.connection;
    const v587 = v586.encrypted;
    if (v587) {
        uri.protocol = 'https';
        uri.port = 443;
    }
    const v595 = function () {
        const v588 = uri.host;
        const v589 = !v588;
        if (v589) {
            return;
        }
        const v590 = uri.host;
        const host = v590.split(':');
        const v591 = host[1];
        const v592 = !v591;
        if (v592) {
            return;
        }
        const v593 = host[0];
        uri.hostname = v593;
        uri.host = uri.hostname;
        const v594 = host[1];
        uri.port = v594;
    };
    const v596 = v595();
    v596;
    let key;
    for (key in uri) {
        const v597 = uri[key];
        const v598 = v597 !== null;
        if (v598) {
            continue;
        }
        uri[key] = '';
    }
    request.uri = uri;
    const v599 = completeServing.bind(this);
    const v600 = this.onRawRequest(request, response, v599);
    if (v600) {
        return;
    }
    ;
    uri = uri.pathname;
    const v601 = uri == '/';
    if (v601) {
        const v602 = this.config;
        const v603 = v602.server;
        const v604 = v603.index;
        uri = `/${ v604 }`;
    }
    let hostname = [];
    const v605 = request.headers;
    const v606 = v605.host;
    const v607 = v606 !== undefined;
    if (v607) {
        const v608 = request.headers;
        const v609 = v608.host;
        hostname = v609.split(':');
    }
    const v610 = this.config;
    let root = v610.root;
    const v611 = this.config;
    const v612 = v611.verbose;
    if (v612) {
        const v613 = this.config;
        const v614 = v613.logID;
        const v615 = `${ v614 } REQUEST ###\n\n`;
        const v616 = request.headers;
        const v617 = console.log(v615, v616, '\n', uri, '\n\n', hostname, '\n\n');
        v617;
    }
    const v618 = this.config;
    const v619 = v618.domain;
    const v620 = v619 != '0.0.0.0';
    const v621 = hostname.length;
    const v622 = v621 > 0;
    const v623 = v620 && v622;
    const v624 = hostname[0];
    const v625 = this.config;
    const v626 = v625.domain;
    const v627 = v624 != v626;
    const v628 = v623 && v627;
    if (v628) {
        const v629 = this.config;
        const v630 = v629.domains;
        const v631 = hostname[0];
        const v632 = v630[v631];
        const v633 = !v632;
        if (v633) {
            const v634 = this.config;
            const v635 = v634.verbose;
            if (v635) {
                const v636 = this.config;
                const v637 = v636.logID;
                const v638 = `${ v637 } INVALID HOST ###\n\n`;
                const v639 = console.log(v638);
                v639;
            }
            const v640 = hostname[0];
            const v641 = this.serveFile(v640, false, response);
            v641;
            return;
        }
        const v642 = this.config;
        const v643 = v642.domains;
        const v644 = hostname[0];
        root = v643[v644];
    }
    const v645 = this.config;
    const v646 = v645.verbose;
    if (v646) {
        const v647 = this.config;
        const v648 = v647.logID;
        const v649 = `${ v648 } USING ROOT : ${ root }###\n\n`;
        const v650 = console.log(v649);
        v650;
    }
    const v651 = -1;
    const v652 = uri.slice(v651);
    const v653 = v652 == '/';
    if (v653) {
        const v654 = this.config;
        const v655 = v654.server;
        uri += v655.index;
    }
    request.url = uri;
    request.serverRoot = root;
    request.body = '';
    const v656 = function (chunk) {
        request.body += chunk;
    };
    const v657 = v656.bind(this);
    const v658 = request.on('data', v657);
    const v666 = function () {
        const v659 = this.config;
        const v660 = v659.verbose;
        if (v660) {
            const v661 = request.body;
            const v662 = `###REQUEST BODY :
${ v661 }
###
            `;
            const v663 = console.log(v662);
            v663;
        }
        const v664 = requestBodyComplete.bind(this, request, response);
        const v665 = v664();
        v665;
    };
    const v667 = v666.bind(this);
    const v668 = v658.on('end', v667);
    v668;
};
const requestBodyComplete = function (request, response) {
    const v669 = completeServing.bind(this);
    const v670 = this.onRequest(request, response, v669);
    if (v670) {
        return;
    }
    ;
    const v671 = request.serverRoot;
    const v672 = request.url;
    const filename = path.join(v671, v672);
    const v674 = function fileExists(exists) {
        const v673 = this.serveFile(filename, exists, request, response);
        v673;
    };
    const v675 = v674.bind(this);
    const v676 = fs.exists(filename, v675);
    v676;
};
module.exports = new Server();