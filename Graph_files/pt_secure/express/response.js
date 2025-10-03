'use strict';
const v365 = require('safe-buffer');
var Buffer = v365.Buffer;
var contentDisposition = require('content-disposition');
const v366 = require('depd');
var deprecate = v366('express');
var encodeUrl = require('encodeurl');
var escapeHtml = require('escape-html');
var http = require('http');
const v367 = require('./utils');
var isAbsolute = v367.isAbsolute;
var onFinished = require('on-finished');
var path = require('path');
var statuses = require('statuses');
var merge = require('utils-merge');
const v368 = require('cookie-signature');
var sign = v368.sign;
const v369 = require('./utils');
var normalizeType = v369.normalizeType;
const v370 = require('./utils');
var normalizeTypes = v370.normalizeTypes;
const v371 = require('./utils');
var setCharset = v371.setCharset;
var cookie = require('cookie');
var send = require('send');
var extname = path.extname;
var mime = send.mime;
var resolve = path.resolve;
var vary = require('vary');
const v372 = http.ServerResponse;
const v373 = v372.prototype;
var res = Object.create(v373);
module.exports = res;
var charsetRegExp = /;\s*charset\s*=/;
const status = function (code) {
    this.statusCode = code;
    return this;
};
res.status = status;
const v386 = function (links) {
    const v374 = this.get('Link');
    var link = v374 || '';
    if (link) {
        link += ', ';
    }
    const v375 = Object.keys(links);
    const v381 = function (rel) {
        const v376 = links[rel];
        const v377 = '<' + v376;
        const v378 = v377 + '>; rel="';
        const v379 = v378 + rel;
        const v380 = v379 + '"';
        return v380;
    };
    const v382 = v375.map(v381);
    const v383 = v382.join(', ');
    const v384 = link + v383;
    const v385 = this.set('Link', v384);
    return v385;
};
res.links = v386;
const send = function (body) {
    var chunk = body;
    var encoding;
    var req = this.req;
    var type;
    var app = this.app;
    const v387 = arguments.length;
    const v388 = v387 === 2;
    if (v388) {
        const v389 = arguments[0];
        const v390 = typeof v389;
        const v391 = v390 !== 'number';
        const v392 = arguments[1];
        const v393 = typeof v392;
        const v394 = v393 === 'number';
        const v395 = v391 && v394;
        if (v395) {
            const v396 = deprecate('res.send(body, status): Use res.status(status).send(body) instead');
            v396;
            const v397 = arguments[1];
            this.statusCode = v397;
        } else {
            const v398 = deprecate('res.send(status, body): Use res.status(status).send(body) instead');
            v398;
            const v399 = arguments[0];
            this.statusCode = v399;
            chunk = arguments[1];
        }
    }
    const v400 = typeof chunk;
    const v401 = v400 === 'number';
    const v402 = arguments.length;
    const v403 = v402 === 1;
    const v404 = v401 && v403;
    if (v404) {
        const v405 = this.get('Content-Type');
        const v406 = !v405;
        if (v406) {
            const v407 = this.type('txt');
            v407;
        }
        const v408 = deprecate('res.send(status): Use res.sendStatus(status) instead');
        v408;
        this.statusCode = chunk;
        chunk = statuses[chunk];
    }
    const v409 = typeof chunk;
    switch (v409) {
    case 'string':
        const v410 = this.get('Content-Type');
        const v411 = !v410;
        if (v411) {
            const v412 = this.type('html');
            v412;
        }
        break;
    case 'boolean':
    case 'number':
    case 'object':
        const v413 = chunk === null;
        if (v413) {
            chunk = '';
        } else {
            const v414 = Buffer.isBuffer(chunk);
            if (v414) {
                const v415 = this.get('Content-Type');
                const v416 = !v415;
                if (v416) {
                    const v417 = this.type('bin');
                    v417;
                }
            } else {
                const v418 = this.json(chunk);
                return v418;
            }
        }
        break;
    }
    const v419 = typeof chunk;
    const v420 = v419 === 'string';
    if (v420) {
        encoding = 'utf8';
        type = this.get('Content-Type');
        const v421 = typeof type;
        const v422 = v421 === 'string';
        if (v422) {
            const v423 = setCharset(type, 'utf-8');
            const v424 = this.set('Content-Type', v423);
            v424;
        }
    }
    var etagFn = app.get('etag fn');
    const v425 = this.get('ETag');
    const v426 = !v425;
    const v427 = typeof etagFn;
    const v428 = v427 === 'function';
    var generateETag = v426 && v428;
    var len;
    const v429 = chunk !== undefined;
    if (v429) {
        const v430 = Buffer.isBuffer(chunk);
        if (v430) {
            len = chunk.length;
        } else {
            const v431 = !generateETag;
            const v432 = chunk.length;
            const v433 = v432 < 1000;
            const v434 = v431 && v433;
            if (v434) {
                len = Buffer.byteLength(chunk, encoding);
            } else {
                chunk = Buffer.from(chunk, encoding);
                encoding = undefined;
                len = chunk.length;
            }
        }
        const v435 = this.set('Content-Length', len);
        v435;
    }
    var etag;
    const v436 = len !== undefined;
    const v437 = generateETag && v436;
    if (v437) {
        if (etag = etagFn(chunk, encoding)) {
            const v438 = this.set('ETag', etag);
            v438;
        }
    }
    const v439 = req.fresh;
    if (v439) {
        this.statusCode = 304;
    }
    const v440 = this.statusCode;
    const v441 = 204 === v440;
    const v442 = this.statusCode;
    const v443 = 304 === v442;
    const v444 = v441 || v443;
    if (v444) {
        const v445 = this.removeHeader('Content-Type');
        v445;
        const v446 = this.removeHeader('Content-Length');
        v446;
        const v447 = this.removeHeader('Transfer-Encoding');
        v447;
        chunk = '';
    }
    const v448 = req.method;
    const v449 = v448 === 'HEAD';
    if (v449) {
        const v450 = this.end();
        v450;
    } else {
        const v451 = this.end(chunk, encoding);
        v451;
    }
    return this;
};
res.send = send;
const json = function (obj) {
    var val = obj;
    const v452 = arguments.length;
    const v453 = v452 === 2;
    if (v453) {
        const v454 = arguments[1];
        const v455 = typeof v454;
        const v456 = v455 === 'number';
        if (v456) {
            const v457 = deprecate('res.json(obj, status): Use res.status(status).json(obj) instead');
            v457;
            const v458 = arguments[1];
            this.statusCode = v458;
        } else {
            const v459 = deprecate('res.json(status, obj): Use res.status(status).json(obj) instead');
            v459;
            const v460 = arguments[0];
            this.statusCode = v460;
            val = arguments[1];
        }
    }
    var app = this.app;
    var escape = app.get('json escape');
    var replacer = app.get('json replacer');
    var spaces = app.get('json spaces');
    var body = stringify(val, replacer, spaces, escape);
    const v461 = this.get('Content-Type');
    const v462 = !v461;
    if (v462) {
        const v463 = this.set('Content-Type', 'application/json');
        v463;
    }
    const v464 = this.send(body);
    return v464;
};
res.json = json;
const jsonp = function (obj) {
    var val = obj;
    const v465 = arguments.length;
    const v466 = v465 === 2;
    if (v466) {
        const v467 = arguments[1];
        const v468 = typeof v467;
        const v469 = v468 === 'number';
        if (v469) {
            const v470 = deprecate('res.jsonp(obj, status): Use res.status(status).json(obj) instead');
            v470;
            const v471 = arguments[1];
            this.statusCode = v471;
        } else {
            const v472 = deprecate('res.jsonp(status, obj): Use res.status(status).jsonp(obj) instead');
            v472;
            const v473 = arguments[0];
            this.statusCode = v473;
            val = arguments[1];
        }
    }
    var app = this.app;
    var escape = app.get('json escape');
    var replacer = app.get('json replacer');
    var spaces = app.get('json spaces');
    var body = stringify(val, replacer, spaces, escape);
    const v474 = this.req;
    const v475 = v474.query;
    const v476 = app.get('jsonp callback name');
    var callback = v475[v476];
    const v477 = this.get('Content-Type');
    const v478 = !v477;
    if (v478) {
        const v479 = this.set('X-Content-Type-Options', 'nosniff');
        v479;
        const v480 = this.set('Content-Type', 'application/json');
        v480;
    }
    const v481 = Array.isArray(callback);
    if (v481) {
        callback = callback[0];
    }
    const v482 = typeof callback;
    const v483 = v482 === 'string';
    const v484 = callback.length;
    const v485 = v484 !== 0;
    const v486 = v483 && v485;
    if (v486) {
        const v487 = this.set('X-Content-Type-Options', 'nosniff');
        v487;
        const v488 = this.set('Content-Type', 'text/javascript');
        v488;
        callback = callback.replace(/[^\[\]\w$.]/g, '');
        const v489 = body.replace(/\u2028/g, '\\u2028');
        body = v489.replace(/\u2029/g, '\\u2029');
        const v490 = '/**/ typeof ' + callback;
        const v491 = v490 + ' === \'function\' && ';
        const v492 = v491 + callback;
        const v493 = v492 + '(';
        const v494 = v493 + body;
        body = v494 + ');';
    }
    const v495 = this.send(body);
    return v495;
};
res.jsonp = jsonp;
const sendStatus = function (statusCode) {
    const v496 = statuses[statusCode];
    const v497 = String(statusCode);
    var body = v496 || v497;
    this.statusCode = statusCode;
    const v498 = this.type('txt');
    v498;
    const v499 = this.send(body);
    return v499;
};
res.sendStatus = sendStatus;
const sendFile = function (path, options, callback) {
    var done = callback;
    var req = this.req;
    var res = this;
    var next = req.next;
    const v500 = {};
    var opts = options || v500;
    const v501 = !path;
    if (v501) {
        const v502 = new TypeError('path argument is required to res.sendFile');
        throw v502;
    }
    const v503 = typeof path;
    const v504 = v503 !== 'string';
    if (v504) {
        const v505 = new TypeError('path must be a string to res.sendFile');
        throw v505;
    }
    const v506 = typeof options;
    const v507 = v506 === 'function';
    if (v507) {
        done = options;
        opts = {};
    }
    const v508 = opts.root;
    const v509 = !v508;
    const v510 = isAbsolute(path);
    const v511 = !v510;
    const v512 = v509 && v511;
    if (v512) {
        const v513 = new TypeError('path must be absolute or specify root to res.sendFile');
        throw v513;
    }
    var pathname = encodeURI(path);
    var file = send(req, pathname, opts);
    const v526 = function (err) {
        if (done) {
            const v514 = done(err);
            return v514;
        }
        const v515 = err.code;
        const v516 = v515 === 'EISDIR';
        const v517 = err && v516;
        if (v517) {
            const v518 = next();
            return v518;
        }
        const v519 = err.code;
        const v520 = v519 !== 'ECONNABORTED';
        const v521 = err && v520;
        const v522 = err.syscall;
        const v523 = v522 !== 'write';
        const v524 = v521 && v523;
        if (v524) {
            const v525 = next(err);
            v525;
        }
    };
    const v527 = sendfile(res, file, opts, v526);
    v527;
};
res.sendFile = sendFile;
const v545 = function (path, options, callback) {
    var done = callback;
    var req = this.req;
    var res = this;
    var next = req.next;
    const v528 = {};
    var opts = options || v528;
    const v529 = typeof options;
    const v530 = v529 === 'function';
    if (v530) {
        done = options;
        opts = {};
    }
    var file = send(req, path, opts);
    const v543 = function (err) {
        if (done) {
            const v531 = done(err);
            return v531;
        }
        const v532 = err.code;
        const v533 = v532 === 'EISDIR';
        const v534 = err && v533;
        if (v534) {
            const v535 = next();
            return v535;
        }
        const v536 = err.code;
        const v537 = v536 !== 'ECONNABORTED';
        const v538 = err && v537;
        const v539 = err.syscall;
        const v540 = v539 !== 'write';
        const v541 = v538 && v540;
        if (v541) {
            const v542 = next(err);
            v542;
        }
    };
    const v544 = sendfile(res, file, opts, v543);
    v544;
};
res.sendfile = v545;
const v546 = res.sendfile;
const v547 = deprecate.function(v546, 'res.sendfile: Use res.sendFile instead');
res.sendfile = v547;
const download = function (path, filename, options, callback) {
    var done = callback;
    var name = filename;
    var opts = options || null;
    const v548 = typeof filename;
    const v549 = v548 === 'function';
    if (v549) {
        done = filename;
        name = null;
        opts = null;
    } else {
        const v550 = typeof options;
        const v551 = v550 === 'function';
        if (v551) {
            done = options;
            opts = null;
        }
    }
    const v552 = name || path;
    const v553 = contentDisposition(v552);
    var headers = {};
    headers['Content-Disposition'] = v553;
    const v554 = opts.headers;
    const v555 = opts && v554;
    if (v555) {
        const v556 = opts.headers;
        var keys = Object.keys(v556);
        var i = 0;
        const v557 = keys.length;
        let v558 = i < v557;
        while (v558) {
            var key = keys[i];
            const v560 = key.toLowerCase();
            const v561 = v560 !== 'content-disposition';
            if (v561) {
                const v562 = opts.headers;
                const v563 = v562[key];
                headers[key] = v563;
            }
            const v559 = i++;
            v558 = i < v557;
        }
    }
    opts = Object.create(opts);
    opts.headers = headers;
    var fullPath = resolve(path);
    const v564 = this.sendFile(fullPath, opts, done);
    return v564;
};
res.download = download;
const contentType = function (type) {
    let ct;
    const v565 = type.indexOf('/');
    const v566 = -1;
    const v567 = v565 === v566;
    const v568 = mime.lookup(type);
    if (v567) {
        ct = v568;
    } else {
        ct = type;
    }
    const v569 = this.set('Content-Type', ct);
    return v569;
};
res.type = contentType;
res.contentType = res.type;
const v586 = function (obj) {
    var req = this.req;
    var next = req.next;
    var fn = obj.default;
    if (fn) {
        const v570 = obj.default;
        const v571 = delete v570;
        v571;
    }
    var keys = Object.keys(obj);
    let key;
    const v572 = keys.length;
    const v573 = v572 > 0;
    const v574 = req.accepts(keys);
    if (v573) {
        key = v574;
    } else {
        key = false;
    }
    const v575 = this.vary('Accept');
    v575;
    if (key) {
        const v576 = normalizeType(key);
        const v577 = v576.value;
        const v578 = this.set('Content-Type', v577);
        v578;
        const v579 = obj[key](req, this, next);
        v579;
    } else {
        if (fn) {
            const v580 = fn();
            v580;
        } else {
            var err = new Error('Not Acceptable');
            err.statusCode = 406;
            err.status = err.statusCode;
            const v581 = normalizeTypes(keys);
            const v583 = function (o) {
                const v582 = o.value;
                return v582;
            };
            const v584 = v581.map(v583);
            err.types = v584;
            const v585 = next(err);
            v585;
        }
    }
    return this;
};
res.format = v586;
const attachment = function (filename) {
    if (filename) {
        const v587 = extname(filename);
        const v588 = this.type(v587);
        v588;
    }
    const v589 = contentDisposition(filename);
    const v590 = this.set('Content-Disposition', v589);
    v590;
    return this;
};
res.attachment = attachment;
const append = function (field, val) {
    var prev = this.get(field);
    var value = val;
    if (prev) {
        const v591 = Array.isArray(prev);
        const v592 = prev.concat(val);
        const v593 = Array.isArray(val);
        const v594 = [prev];
        const v595 = v594.concat(val);
        const v596 = [
            prev,
            val
        ];
        let v597;
        if (v593) {
            v597 = v595;
        } else {
            v597 = v596;
        }
        if (v591) {
            value = v592;
        } else {
            value = v597;
        }
    }
    const v598 = this.set(field, value);
    return v598;
};
res.append = append;
const header = function (field, val) {
    const v599 = arguments.length;
    const v600 = v599 === 2;
    if (v600) {
        let value;
        const v601 = Array.isArray(val);
        const v602 = val.map(String);
        const v603 = String(val);
        if (v601) {
            value = v602;
        } else {
            value = v603;
        }
        const v604 = field.toLowerCase();
        const v605 = v604 === 'content-type';
        if (v605) {
            const v606 = Array.isArray(value);
            if (v606) {
                const v607 = new TypeError('Content-Type cannot be set to an Array');
                throw v607;
            }
            const v608 = charsetRegExp.test(value);
            const v609 = !v608;
            if (v609) {
                const v610 = mime.charsets;
                const v611 = value.split(';');
                const v612 = v611[0];
                var charset = v610.lookup(v612);
                if (charset) {
                    const v613 = charset.toLowerCase();
                    value += '; charset=' + v613;
                }
            }
        }
        const v614 = this.setHeader(field, value);
        v614;
    } else {
        let key;
        for (key in field) {
            const v615 = field[key];
            const v616 = this.set(key, v615);
            v616;
        }
    }
    return this;
};
res.header = header;
res.set = res.header;
const v618 = function (field) {
    const v617 = this.getHeader(field);
    return v617;
};
res.get = v618;
const clearCookie = function (name, options) {
    const v619 = new Date(1);
    const v620 = {
        expires: v619,
        path: '/'
    };
    var opts = merge(v620, options);
    const v621 = this.cookie(name, '', opts);
    return v621;
};
res.clearCookie = clearCookie;
const v642 = function (name, value, options) {
    const v622 = {};
    var opts = merge(v622, options);
    const v623 = this.req;
    var secret = v623.secret;
    var signed = opts.signed;
    const v624 = !secret;
    const v625 = signed && v624;
    if (v625) {
        const v626 = new Error('cookieParser("secret") required for signed cookies');
        throw v626;
    }
    let val;
    const v627 = typeof value;
    const v628 = v627 === 'object';
    const v629 = JSON.stringify(value);
    const v630 = 'j:' + v629;
    const v631 = String(value);
    if (v628) {
        val = v630;
    } else {
        val = v631;
    }
    if (signed) {
        const v632 = sign(val, secret);
        val = 's:' + v632;
    }
    const v633 = 'maxAge' in opts;
    if (v633) {
        const v634 = Date.now();
        const v635 = opts.maxAge;
        const v636 = v634 + v635;
        opts.expires = new Date(v636);
        opts.maxAge /= 1000;
    }
    const v637 = opts.path;
    const v638 = v637 == null;
    if (v638) {
        opts.path = '/';
    }
    const v639 = String(val);
    const v640 = cookie.serialize(name, v639, opts);
    const v641 = this.append('Set-Cookie', v640);
    v641;
    return this;
};
res.cookie = v642;
const location = function (url) {
    var loc = url;
    const v643 = url === 'back';
    if (v643) {
        const v644 = this.req;
        const v645 = v644.get('Referrer');
        loc = v645 || '/';
    }
    const v646 = encodeUrl(loc);
    const v647 = this.set('Location', v646);
    return v647;
};
res.location = location;
const redirect = function (url) {
    var address = url;
    var body;
    var status = 302;
    const v648 = arguments.length;
    const v649 = v648 === 2;
    if (v649) {
        const v650 = arguments[0];
        const v651 = typeof v650;
        const v652 = v651 === 'number';
        if (v652) {
            status = arguments[0];
            address = arguments[1];
        } else {
            const v653 = deprecate('res.redirect(url, status): Use res.redirect(status, url) instead');
            v653;
            status = arguments[1];
        }
    }
    const v654 = this.location(address);
    address = v654.get('Location');
    const v657 = function () {
        const v655 = statuses[status];
        const v656 = v655 + '. Redirecting to ';
        body = v656 + address;
    };
    const v664 = function () {
        var u = escapeHtml(address);
        const v658 = statuses[status];
        const v659 = '<p>' + v658;
        const v660 = v659 + '. Redirecting to <a href="';
        const v661 = v660 + u;
        const v662 = v661 + '">';
        const v663 = v662 + u;
        body = v663 + '</a></p>';
    };
    const v665 = function () {
        body = '';
    };
    const v666 = {
        text: v657,
        html: v664,
        default: v665
    };
    const v667 = this.format(v666);
    v667;
    this.statusCode = status;
    const v668 = Buffer.byteLength(body);
    const v669 = this.set('Content-Length', v668);
    v669;
    const v670 = this.req;
    const v671 = v670.method;
    const v672 = v671 === 'HEAD';
    if (v672) {
        const v673 = this.end();
        v673;
    } else {
        const v674 = this.end(body);
        v674;
    }
};
res.redirect = redirect;
const v683 = function (field) {
    const v675 = !field;
    const v676 = Array.isArray(field);
    const v677 = field.length;
    const v678 = !v677;
    const v679 = v676 && v678;
    const v680 = v675 || v679;
    if (v680) {
        const v681 = deprecate('res.vary(): Provide a field name');
        v681;
        return this;
    }
    const v682 = vary(this, field);
    v682;
    return this;
};
res.vary = v683;
const render = function (view, options, callback) {
    const v684 = this.req;
    var app = v684.app;
    var done = callback;
    const v685 = {};
    var opts = options || v685;
    var req = this.req;
    var self = this;
    const v686 = typeof options;
    const v687 = v686 === 'function';
    if (v687) {
        done = options;
        opts = {};
    }
    const v688 = self.locals;
    opts._locals = v688;
    const v691 = function (err, str) {
        if (err) {
            const v689 = req.next(err);
            return v689;
        }
        const v690 = self.send(str);
        v690;
    };
    done = done || v691;
    const v692 = app.render(view, opts, done);
    v692;
};
res.render = render;
const sendfile = function (res, file, options, callback) {
    var done = false;
    var streaming;
    const onaborted = function () {
        if (done) {
            return;
        }
        done = true;
        var err = new Error('Request aborted');
        err.code = 'ECONNABORTED';
        const v693 = callback(err);
        v693;
    };
    const ondirectory = function () {
        if (done) {
            return;
        }
        done = true;
        var err = new Error('EISDIR, read');
        err.code = 'EISDIR';
        const v694 = callback(err);
        v694;
    };
    const onerror = function (err) {
        if (done) {
            return;
        }
        done = true;
        const v695 = callback(err);
        v695;
    };
    const onend = function () {
        if (done) {
            return;
        }
        done = true;
        const v696 = callback();
        v696;
    };
    const onfile = function () {
        streaming = false;
    };
    const onfinish = function (err) {
        const v697 = err.code;
        const v698 = v697 === 'ECONNRESET';
        const v699 = err && v698;
        if (v699) {
            const v700 = onaborted();
            return v700;
        }
        if (err) {
            const v701 = onerror(err);
            return v701;
        }
        if (done) {
            return;
        }
        const v707 = function () {
            const v702 = streaming !== false;
            const v703 = !done;
            const v704 = v702 && v703;
            if (v704) {
                const v705 = onaborted();
                v705;
                return;
            }
            if (done) {
                return;
            }
            done = true;
            const v706 = callback();
            v706;
        };
        const v708 = setImmediate(v707);
        v708;
    };
    const onstream = function () {
        streaming = true;
    };
    const v709 = file.on('directory', ondirectory);
    v709;
    const v710 = file.on('end', onend);
    v710;
    const v711 = file.on('error', onerror);
    v711;
    const v712 = file.on('file', onfile);
    v712;
    const v713 = file.on('stream', onstream);
    v713;
    const v714 = onFinished(res, onfinish);
    v714;
    const v715 = options.headers;
    if (v715) {
        const v721 = function headers(res) {
            var obj = options.headers;
            var keys = Object.keys(obj);
            var i = 0;
            const v716 = keys.length;
            let v717 = i < v716;
            while (v717) {
                var k = keys[i];
                const v719 = obj[k];
                const v720 = res.setHeader(k, v719);
                v720;
                const v718 = i++;
                v717 = i < v716;
            }
        };
        const v722 = file.on('headers', v721);
        v722;
    }
    const v723 = file.pipe(res);
    v723;
};
const stringify = function (value, replacer, spaces, escape) {
    let json;
    const v724 = replacer || spaces;
    const v725 = JSON.stringify(value, replacer, spaces);
    const v726 = JSON.stringify(value);
    if (v724) {
        json = v725;
    } else {
        json = v726;
    }
    if (escape) {
        const v728 = function (c) {
            const v727 = c.charCodeAt(0);
            switch (v727) {
            case 60:
                return '\\u003c';
            case 62:
                return '\\u003e';
            case 38:
                return '\\u0026';
            default:
                return c;
            }
        };
        json = json.replace(/[<>&]/g, v728);
    }
    return json;
};