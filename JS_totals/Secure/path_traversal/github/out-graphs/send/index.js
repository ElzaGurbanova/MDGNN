'use strict';
var createError = require('http-errors');
const v500 = require('debug');
var debug = v500('send');
var encodeUrl = require('encodeurl');
var escapeHtml = require('escape-html');
var etag = require('etag');
var fresh = require('fresh');
var fs = require('fs');
var mime = require('mime-types');
var ms = require('ms');
var onFinished = require('on-finished');
var parseRange = require('range-parser');
var path = require('path');
var statuses = require('statuses');
var Stream = require('stream');
var util = require('util');
var extname = path.extname;
var join = path.join;
var normalize = path.normalize;
var resolve = path.resolve;
var sep = path.sep;
var BYTES_RANGE_REGEXP = /^ *bytes=/;
const v501 = 60 * 60;
const v502 = v501 * 24;
const v503 = v502 * 365;
var MAX_MAXAGE = v503 * 1000;
var UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
module.exports = send;
const send = function (req, path, options) {
    const v504 = new SendStream(req, path, options);
    return v504;
};
const SendStream = function (req, path, options) {
    const v505 = Stream.call(this);
    v505;
    const v506 = {};
    var opts = options || v506;
    this.options = opts;
    this.path = path;
    this.req = req;
    const v507 = opts.acceptRanges;
    const v508 = v507 !== undefined;
    const v509 = opts.acceptRanges;
    const v510 = Boolean(v509);
    let v511;
    if (v508) {
        v511 = v510;
    } else {
        v511 = true;
    }
    this._acceptRanges = v511;
    const v512 = opts.cacheControl;
    const v513 = v512 !== undefined;
    const v514 = opts.cacheControl;
    const v515 = Boolean(v514);
    let v516;
    if (v513) {
        v516 = v515;
    } else {
        v516 = true;
    }
    this._cacheControl = v516;
    const v517 = opts.etag;
    const v518 = v517 !== undefined;
    const v519 = opts.etag;
    const v520 = Boolean(v519);
    let v521;
    if (v518) {
        v521 = v520;
    } else {
        v521 = true;
    }
    this._etag = v521;
    const v522 = opts.dotfiles;
    const v523 = v522 !== undefined;
    const v524 = opts.dotfiles;
    let v525;
    if (v523) {
        v525 = v524;
    } else {
        v525 = 'ignore';
    }
    this._dotfiles = v525;
    const v526 = this._dotfiles;
    const v527 = v526 !== 'ignore';
    const v528 = this._dotfiles;
    const v529 = v528 !== 'allow';
    const v530 = v527 && v529;
    const v531 = this._dotfiles;
    const v532 = v531 !== 'deny';
    const v533 = v530 && v532;
    if (v533) {
        const v534 = new TypeError('dotfiles option must be "allow", "deny", or "ignore"');
        throw v534;
    }
    const v535 = opts.extensions;
    const v536 = v535 !== undefined;
    const v537 = opts.extensions;
    const v538 = normalizeList(v537, 'extensions option');
    const v539 = [];
    let v540;
    if (v536) {
        v540 = v538;
    } else {
        v540 = v539;
    }
    this._extensions = v540;
    const v541 = opts.immutable;
    const v542 = v541 !== undefined;
    const v543 = opts.immutable;
    const v544 = Boolean(v543);
    let v545;
    if (v542) {
        v545 = v544;
    } else {
        v545 = false;
    }
    this._immutable = v545;
    const v546 = opts.index;
    const v547 = v546 !== undefined;
    const v548 = opts.index;
    const v549 = normalizeList(v548, 'index option');
    const v550 = ['index.html'];
    let v551;
    if (v547) {
        v551 = v549;
    } else {
        v551 = v550;
    }
    this._index = v551;
    const v552 = opts.lastModified;
    const v553 = v552 !== undefined;
    const v554 = opts.lastModified;
    const v555 = Boolean(v554);
    let v556;
    if (v553) {
        v556 = v555;
    } else {
        v556 = true;
    }
    this._lastModified = v556;
    const v557 = opts.maxAge;
    const v558 = opts.maxage;
    this._maxage = v557 || v558;
    const v559 = this._maxage;
    const v560 = typeof v559;
    const v561 = v560 === 'string';
    const v562 = this._maxage;
    const v563 = ms(v562);
    const v564 = this._maxage;
    const v565 = Number(v564);
    let v566;
    if (v561) {
        v566 = v563;
    } else {
        v566 = v565;
    }
    this._maxage = v566;
    const v567 = this._maxage;
    const v568 = isNaN(v567);
    const v569 = !v568;
    const v570 = this._maxage;
    const v571 = Math.max(0, v570);
    const v572 = Math.min(v571, MAX_MAXAGE);
    let v573;
    if (v569) {
        v573 = v572;
    } else {
        v573 = 0;
    }
    this._maxage = v573;
    const v574 = opts.root;
    const v575 = opts.root;
    const v576 = resolve(v575);
    let v577;
    if (v574) {
        v577 = v576;
    } else {
        v577 = null;
    }
    this._root = v577;
};
const v578 = util.inherits(SendStream, Stream);
v578;
const v579 = SendStream.prototype;
const error = function (status, err) {
    const v580 = hasListeners(this, 'error');
    if (v580) {
        const v581 = createHttpError(status, err);
        const v582 = this.emit('error', v581);
        return v582;
    }
    var res = this.res;
    const v583 = statuses.message;
    const v584 = v583[status];
    const v585 = String(status);
    var msg = v584 || v585;
    const v586 = escapeHtml(msg);
    var doc = createHtmlDocument('Error', v586);
    const v587 = clearHeaders(res);
    v587;
    const v588 = err.headers;
    const v589 = err && v588;
    if (v589) {
        const v590 = err.headers;
        const v591 = setHeaders(res, v590);
        v591;
    }
    res.statusCode = status;
    const v592 = res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    v592;
    const v593 = Buffer.byteLength(doc);
    const v594 = res.setHeader('Content-Length', v593);
    v594;
    const v595 = res.setHeader('Content-Security-Policy', 'default-src \'none\'');
    v595;
    const v596 = res.setHeader('X-Content-Type-Options', 'nosniff');
    v596;
    const v597 = res.end(doc);
    v597;
};
v579.error = error;
const v598 = SendStream.prototype;
const hasTrailingSlash = function () {
    const v599 = this.path;
    const v600 = this.path;
    const v601 = v600.length;
    const v602 = v601 - 1;
    const v603 = v599[v602];
    const v604 = v603 === '/';
    return v604;
};
v598.hasTrailingSlash = hasTrailingSlash;
const v605 = SendStream.prototype;
const isConditionalGET = function () {
    const v606 = this.req;
    const v607 = v606.headers;
    const v608 = v607['if-match'];
    const v609 = this.req;
    const v610 = v609.headers;
    const v611 = v610['if-unmodified-since'];
    const v612 = v608 || v611;
    const v613 = this.req;
    const v614 = v613.headers;
    const v615 = v614['if-none-match'];
    const v616 = v612 || v615;
    const v617 = this.req;
    const v618 = v617.headers;
    const v619 = v618['if-modified-since'];
    const v620 = v616 || v619;
    return v620;
};
v605.isConditionalGET = isConditionalGET;
const v621 = SendStream.prototype;
const isPreconditionFailure = function () {
    var req = this.req;
    var res = this.res;
    const v622 = req.headers;
    var match = v622['if-match'];
    if (match) {
        var etag = res.getHeader('ETag');
        const v623 = !etag;
        const v624 = match !== '*';
        const v625 = parseTokenList(match);
        const v633 = function (match) {
            const v626 = match !== etag;
            const v627 = 'W/' + etag;
            const v628 = match !== v627;
            const v629 = v626 && v628;
            const v630 = 'W/' + match;
            const v631 = v630 !== etag;
            const v632 = v629 && v631;
            return v632;
        };
        const v634 = v625.every(v633);
        const v635 = v624 && v634;
        const v636 = v623 || v635;
        return v636;
    }
    const v637 = req.headers;
    const v638 = v637['if-unmodified-since'];
    var unmodifiedSince = parseHttpDate(v638);
    const v639 = isNaN(unmodifiedSince);
    const v640 = !v639;
    if (v640) {
        const v641 = res.getHeader('Last-Modified');
        var lastModified = parseHttpDate(v641);
        const v642 = isNaN(lastModified);
        const v643 = lastModified > unmodifiedSince;
        const v644 = v642 || v643;
        return v644;
    }
    return false;
};
v621.isPreconditionFailure = isPreconditionFailure;
const v645 = SendStream.prototype;
const removeContentHeaderFields = function () {
    var res = this.res;
    const v646 = res.removeHeader('Content-Encoding');
    v646;
    const v647 = res.removeHeader('Content-Language');
    v647;
    const v648 = res.removeHeader('Content-Length');
    v648;
    const v649 = res.removeHeader('Content-Range');
    v649;
    const v650 = res.removeHeader('Content-Type');
    v650;
};
v645.removeContentHeaderFields = removeContentHeaderFields;
const v651 = SendStream.prototype;
const notModified = function () {
    var res = this.res;
    const v652 = debug('not modified');
    v652;
    const v653 = this.removeContentHeaderFields();
    v653;
    res.statusCode = 304;
    const v654 = res.end();
    v654;
};
v651.notModified = notModified;
const v655 = SendStream.prototype;
const headersAlreadySent = function () {
    var err = new Error('Can\'t set headers after they are sent.');
    const v656 = debug('headers already sent');
    v656;
    const v657 = this.error(500, err);
    v657;
};
v655.headersAlreadySent = headersAlreadySent;
const v658 = SendStream.prototype;
const isCachable = function () {
    const v659 = this.res;
    var statusCode = v659.statusCode;
    const v660 = statusCode >= 200;
    const v661 = statusCode < 300;
    const v662 = v660 && v661;
    const v663 = statusCode === 304;
    const v664 = v662 || v663;
    return v664;
};
v658.isCachable = isCachable;
const v665 = SendStream.prototype;
const onStatError = function (error) {
    const v666 = error.code;
    switch (v666) {
    case 'ENAMETOOLONG':
    case 'ENOENT':
    case 'ENOTDIR':
        const v667 = this.error(404, error);
        v667;
        break;
    default:
        const v668 = this.error(500, error);
        v668;
        break;
    }
};
v665.onStatError = onStatError;
const v669 = SendStream.prototype;
const isFresh = function () {
    const v670 = this.req;
    const v671 = v670.headers;
    const v672 = this.res;
    const v673 = v672.getHeader('ETag');
    const v674 = this.res;
    const v675 = v674.getHeader('Last-Modified');
    const v676 = {
        etag: v673,
        'last-modified': v675
    };
    const v677 = fresh(v671, v676);
    return v677;
};
v669.isFresh = isFresh;
const v678 = SendStream.prototype;
const isRangeFresh = function () {
    const v679 = this.req;
    const v680 = v679.headers;
    var ifRange = v680['if-range'];
    const v681 = !ifRange;
    if (v681) {
        return true;
    }
    const v682 = ifRange.indexOf('"');
    const v683 = -1;
    const v684 = v682 !== v683;
    if (v684) {
        const v685 = this.res;
        var etag = v685.getHeader('ETag');
        const v686 = ifRange.indexOf(etag);
        const v687 = -1;
        const v688 = v686 !== v687;
        const v689 = etag && v688;
        const v690 = Boolean(v689);
        return v690;
    }
    const v691 = this.res;
    var lastModified = v691.getHeader('Last-Modified');
    const v692 = parseHttpDate(lastModified);
    const v693 = parseHttpDate(ifRange);
    const v694 = v692 <= v693;
    return v694;
};
v678.isRangeFresh = isRangeFresh;
const v695 = SendStream.prototype;
const redirect = function (path) {
    var res = this.res;
    const v696 = hasListeners(this, 'directory');
    if (v696) {
        const v697 = this.emit('directory', res, path);
        v697;
        return;
    }
    const v698 = this.hasTrailingSlash();
    if (v698) {
        const v699 = this.error(403);
        v699;
        return;
    }
    const v700 = this.path;
    const v701 = v700 + '/';
    const v702 = collapseLeadingSlashes(v701);
    var loc = encodeUrl(v702);
    const v703 = escapeHtml(loc);
    const v704 = 'Redirecting to ' + v703;
    var doc = createHtmlDocument('Redirecting', v704);
    res.statusCode = 301;
    const v705 = res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    v705;
    const v706 = Buffer.byteLength(doc);
    const v707 = res.setHeader('Content-Length', v706);
    v707;
    const v708 = res.setHeader('Content-Security-Policy', 'default-src \'none\'');
    v708;
    const v709 = res.setHeader('X-Content-Type-Options', 'nosniff');
    v709;
    const v710 = res.setHeader('Location', loc);
    v710;
    const v711 = res.end(doc);
    v711;
};
v695.redirect = redirect;
const v712 = SendStream.prototype;
const pipe = function (res) {
    var root = this._root;
    this.res = res;
    const v713 = this.path;
    var path = decode(v713);
    const v714 = -1;
    const v715 = path === v714;
    if (v715) {
        const v716 = this.error(400);
        v716;
        return res;
    }
    const v717 = path.indexOf('\0');
    const v718 = ~v717;
    if (v718) {
        const v719 = this.error(400);
        v719;
        return res;
    }
    var parts;
    const v720 = root !== null;
    if (v720) {
        if (path) {
            const v721 = '.' + sep;
            const v722 = v721 + path;
            path = normalize(v722);
        }
        const v723 = UP_PATH_REGEXP.test(path);
        if (v723) {
            const v724 = debug('malicious path "%s"', path);
            v724;
            const v725 = this.error(403);
            v725;
            return res;
        }
        parts = path.split(sep);
        const v726 = join(root, path);
        path = normalize(v726);
    } else {
        const v727 = UP_PATH_REGEXP.test(path);
        if (v727) {
            const v728 = debug('malicious path "%s"', path);
            v728;
            const v729 = this.error(403);
            v729;
            return res;
        }
        const v730 = normalize(path);
        parts = v730.split(sep);
        path = resolve(path);
    }
    const v731 = containsDotFile(parts);
    if (v731) {
        const v732 = this._dotfiles;
        const v733 = debug('%s dotfile "%s"', v732, path);
        v733;
        const v734 = this._dotfiles;
        switch (v734) {
        case 'allow':
            break;
        case 'deny':
            const v735 = this.error(403);
            v735;
            return res;
        case 'ignore':
        default:
            const v736 = this.error(404);
            v736;
            return res;
        }
    }
    const v737 = this._index;
    const v738 = v737.length;
    const v739 = this.hasTrailingSlash();
    const v740 = v738 && v739;
    if (v740) {
        const v741 = this.sendIndex(path);
        v741;
        return res;
    }
    const v742 = this.sendFile(path);
    v742;
    return res;
};
v712.pipe = pipe;
const v743 = SendStream.prototype;
const send = function (path, stat) {
    var len = stat.size;
    var options = this.options;
    var opts = {};
    var res = this.res;
    var req = this.req;
    const v744 = req.headers;
    var ranges = v744.range;
    const v745 = options.start;
    var offset = v745 || 0;
    const v746 = res.headersSent;
    if (v746) {
        const v747 = this.headersAlreadySent();
        v747;
        return;
    }
    const v748 = debug('pipe "%s"', path);
    v748;
    const v749 = this.setHeader(path, stat);
    v749;
    const v750 = this.type(path);
    v750;
    const v751 = this.isConditionalGET();
    if (v751) {
        const v752 = this.isPreconditionFailure();
        if (v752) {
            const v753 = this.error(412);
            v753;
            return;
        }
        const v754 = this.isCachable();
        const v755 = this.isFresh();
        const v756 = v754 && v755;
        if (v756) {
            const v757 = this.notModified();
            v757;
            return;
        }
    }
    const v758 = len - offset;
    len = Math.max(0, v758);
    const v759 = options.end;
    const v760 = v759 !== undefined;
    if (v760) {
        const v761 = options.end;
        const v762 = v761 - offset;
        var bytes = v762 + 1;
        const v763 = len > bytes;
        if (v763) {
            len = bytes;
        }
    }
    const v764 = this._acceptRanges;
    const v765 = BYTES_RANGE_REGEXP.test(ranges);
    const v766 = v764 && v765;
    if (v766) {
        const v767 = { combine: true };
        ranges = parseRange(len, ranges, v767);
        const v768 = this.isRangeFresh();
        const v769 = !v768;
        if (v769) {
            const v770 = debug('range stale');
            v770;
            const v771 = -2;
            ranges = v771;
        }
        const v772 = -1;
        const v773 = ranges === v772;
        if (v773) {
            const v774 = debug('range unsatisfiable');
            v774;
            const v775 = contentRange('bytes', len);
            const v776 = res.setHeader('Content-Range', v775);
            v776;
            const v777 = res.getHeader('Content-Range');
            const v778 = {};
            v778['Content-Range'] = v777;
            const v779 = { headers: v778 };
            const v780 = this.error(416, v779);
            return v780;
        }
        const v781 = -2;
        const v782 = ranges !== v781;
        const v783 = ranges.length;
        const v784 = v783 === 1;
        const v785 = v782 && v784;
        if (v785) {
            const v786 = debug('range %j', ranges);
            v786;
            res.statusCode = 206;
            const v787 = ranges[0];
            const v788 = contentRange('bytes', len, v787);
            const v789 = res.setHeader('Content-Range', v788);
            v789;
            const v790 = ranges[0];
            offset += v790.start;
            const v791 = ranges[0];
            const v792 = v791.end;
            const v793 = ranges[0];
            const v794 = v793.start;
            const v795 = v792 - v794;
            len = v795 + 1;
        }
    }
    let prop;
    for (prop in options) {
        const v796 = options[prop];
        opts[prop] = v796;
    }
    opts.start = offset;
    const v797 = offset + len;
    const v798 = v797 - 1;
    const v799 = Math.max(offset, v798);
    opts.end = v799;
    const v800 = res.setHeader('Content-Length', len);
    v800;
    const v801 = req.method;
    const v802 = v801 === 'HEAD';
    if (v802) {
        const v803 = res.end();
        v803;
        return;
    }
    const v804 = this.stream(path, opts);
    v804;
};
v743.send = send;
const v805 = SendStream.prototype;
const sendFile = function (path) {
    var i = 0;
    var self = this;
    const v806 = debug('stat "%s"', path);
    v806;
    const v825 = function onstat(err, stat) {
        const v807 = path.length;
        const v808 = v807 - 1;
        const v809 = path[v808];
        var pathEndsWithSep = v809 === sep;
        const v810 = err.code;
        const v811 = v810 === 'ENOENT';
        const v812 = err && v811;
        const v813 = extname(path);
        const v814 = !v813;
        const v815 = v812 && v814;
        const v816 = !pathEndsWithSep;
        const v817 = v815 && v816;
        if (v817) {
            const v818 = next(err);
            return v818;
        }
        if (err) {
            const v819 = self.onStatError(err);
            return v819;
        }
        const v820 = stat.isDirectory();
        if (v820) {
            const v821 = self.redirect(path);
            return v821;
        }
        if (pathEndsWithSep) {
            const v822 = self.error(404);
            return v822;
        }
        const v823 = self.emit('file', path, stat);
        v823;
        const v824 = self.send(path, stat);
        v824;
    };
    const v826 = fs.stat(path, v825);
    v826;
    const next = function (err) {
        const v827 = self._extensions;
        const v828 = v827.length;
        const v829 = v828 <= i;
        if (v829) {
            const v830 = self.onStatError(err);
            const v831 = self.error(404);
            let v832;
            if (err) {
                v832 = v830;
            } else {
                v832 = v831;
            }
            return v832;
        }
        const v833 = path + '.';
        const v834 = self._extensions;
        const v835 = i++;
        const v836 = v834[v835];
        var p = v833 + v836;
        const v837 = debug('stat "%s"', p);
        v837;
        const v843 = function (err, stat) {
            if (err) {
                const v838 = next(err);
                return v838;
            }
            const v839 = stat.isDirectory();
            if (v839) {
                const v840 = next();
                return v840;
            }
            const v841 = self.emit('file', p, stat);
            v841;
            const v842 = self.send(p, stat);
            v842;
        };
        const v844 = fs.stat(p, v843);
        v844;
    };
};
v805.sendFile = sendFile;
const v845 = SendStream.prototype;
const sendIndex = function (path) {
    const v846 = -1;
    var i = v846;
    var self = this;
    const next = function (err) {
        const v847 = ++i;
        const v848 = self._index;
        const v849 = v848.length;
        const v850 = v847 >= v849;
        if (v850) {
            if (err) {
                const v851 = self.onStatError(err);
                return v851;
            }
            const v852 = self.error(404);
            return v852;
        }
        const v853 = self._index;
        const v854 = v853[i];
        var p = join(path, v854);
        const v855 = debug('stat "%s"', p);
        v855;
        const v861 = function (err, stat) {
            if (err) {
                const v856 = next(err);
                return v856;
            }
            const v857 = stat.isDirectory();
            if (v857) {
                const v858 = next();
                return v858;
            }
            const v859 = self.emit('file', p, stat);
            v859;
            const v860 = self.send(p, stat);
            v860;
        };
        const v862 = fs.stat(p, v861);
        v862;
    };
    const v863 = next();
    v863;
};
v845.sendIndex = sendIndex;
const v864 = SendStream.prototype;
const stream = function (path, options) {
    var self = this;
    var res = this.res;
    var stream = fs.createReadStream(path, options);
    const v865 = this.emit('stream', stream);
    v865;
    const v866 = stream.pipe(res);
    v866;
    const cleanup = function () {
        const v867 = stream.destroy();
        v867;
    };
    const v868 = onFinished(res, cleanup);
    v868;
    const v871 = function onerror(err) {
        const v869 = cleanup();
        v869;
        const v870 = self.onStatError(err);
        v870;
    };
    const v872 = stream.on('error', v871);
    v872;
    const v874 = function onend() {
        const v873 = self.emit('end');
        v873;
    };
    const v875 = stream.on('end', v874);
    v875;
};
v864.stream = stream;
const v876 = SendStream.prototype;
const type = function (path) {
    var res = this.res;
    const v877 = res.getHeader('Content-Type');
    if (v877) {
        return;
    }
    var ext = extname(path);
    const v878 = mime.contentType(ext);
    var type = v878 || 'application/octet-stream';
    const v879 = debug('content-type %s', type);
    v879;
    const v880 = res.setHeader('Content-Type', type);
    v880;
};
v876.type = type;
const v881 = SendStream.prototype;
const setHeader = function (path, stat) {
    var res = this.res;
    const v882 = this.emit('headers', res, path, stat);
    v882;
    const v883 = this._acceptRanges;
    const v884 = res.getHeader('Accept-Ranges');
    const v885 = !v884;
    const v886 = v883 && v885;
    if (v886) {
        const v887 = debug('accept ranges');
        v887;
        const v888 = res.setHeader('Accept-Ranges', 'bytes');
        v888;
    }
    const v889 = this._cacheControl;
    const v890 = res.getHeader('Cache-Control');
    const v891 = !v890;
    const v892 = v889 && v891;
    if (v892) {
        const v893 = this._maxage;
        const v894 = v893 / 1000;
        const v895 = Math.floor(v894);
        var cacheControl = 'public, max-age=' + v895;
        const v896 = this._immutable;
        if (v896) {
            cacheControl += ', immutable';
        }
        const v897 = debug('cache-control %s', cacheControl);
        v897;
        const v898 = res.setHeader('Cache-Control', cacheControl);
        v898;
    }
    const v899 = this._lastModified;
    const v900 = res.getHeader('Last-Modified');
    const v901 = !v900;
    const v902 = v899 && v901;
    if (v902) {
        const v903 = stat.mtime;
        var modified = v903.toUTCString();
        const v904 = debug('modified %s', modified);
        v904;
        const v905 = res.setHeader('Last-Modified', modified);
        v905;
    }
    const v906 = this._etag;
    const v907 = res.getHeader('ETag');
    const v908 = !v907;
    const v909 = v906 && v908;
    if (v909) {
        var val = etag(stat);
        const v910 = debug('etag %s', val);
        v910;
        const v911 = res.setHeader('ETag', val);
        v911;
    }
};
v881.setHeader = setHeader;
const clearHeaders = function (res) {
    let header;
    const v912 = res.getHeaderNames();
    for (header of v912) {
        const v913 = res.removeHeader(header);
        v913;
    }
};
const collapseLeadingSlashes = function (str) {
    var i = 0;
    const v914 = str.length;
    let v915 = i < v914;
    while (v915) {
        const v917 = str[i];
        const v918 = v917 !== '/';
        if (v918) {
            break;
        }
        const v916 = i++;
        v915 = i < v914;
    }
    const v919 = i > 1;
    const v920 = str.substr(i);
    const v921 = '/' + v920;
    let v922;
    if (v919) {
        v922 = v921;
    } else {
        v922 = str;
    }
    return v922;
};
const containsDotFile = function (parts) {
    var i = 0;
    const v923 = parts.length;
    let v924 = i < v923;
    while (v924) {
        var part = parts[i];
        const v926 = part.length;
        const v927 = v926 > 1;
        const v928 = part[0];
        const v929 = v928 === '.';
        const v930 = v927 && v929;
        if (v930) {
            return true;
        }
        const v925 = i++;
        v924 = i < v923;
    }
    return false;
};
const contentRange = function (type, size, range) {
    const v931 = type + ' ';
    const v932 = range.start;
    const v933 = v932 + '-';
    const v934 = range.end;
    const v935 = v933 + v934;
    let v936;
    if (range) {
        v936 = v935;
    } else {
        v936 = '*';
    }
    const v937 = v931 + v936;
    const v938 = v937 + '/';
    const v939 = v938 + size;
    return v939;
};
const createHtmlDocument = function (title, body) {
    const v940 = '<!DOCTYPE html>\n' + '<html lang="en">\n';
    const v941 = v940 + '<head>\n';
    const v942 = v941 + '<meta charset="utf-8">\n';
    const v943 = v942 + '<title>';
    const v944 = v943 + title;
    const v945 = v944 + '</title>\n';
    const v946 = v945 + '</head>\n';
    const v947 = v946 + '<body>\n';
    const v948 = v947 + '<pre>';
    const v949 = v948 + body;
    const v950 = v949 + '</pre>\n';
    const v951 = v950 + '</body>\n';
    const v952 = v951 + '</html>\n';
    return v952;
};
const createHttpError = function (status, err) {
    const v953 = !err;
    if (v953) {
        const v954 = createError(status);
        return v954;
    }
    const v955 = err instanceof Error;
    const v956 = { expose: false };
    const v957 = createError(status, err, v956);
    const v958 = createError(status, err);
    let v959;
    if (v955) {
        v959 = v957;
    } else {
        v959 = v958;
    }
    return v959;
};
const decode = function (path) {
    try {
        const v960 = decodeURIComponent(path);
        return v960;
    } catch (err) {
        const v961 = -1;
        return v961;
    }
};
const hasListeners = function (emitter, type) {
    let count;
    const v962 = emitter.listenerCount;
    const v963 = typeof v962;
    const v964 = v963 !== 'function';
    const v965 = emitter.listeners(type);
    const v966 = v965.length;
    const v967 = emitter.listenerCount(type);
    if (v964) {
        count = v966;
    } else {
        count = v967;
    }
    const v968 = count > 0;
    return v968;
};
const normalizeList = function (val, name) {
    const v969 = [];
    const v970 = [];
    const v971 = val || v970;
    var list = v969.concat(v971);
    var i = 0;
    const v972 = list.length;
    let v973 = i < v972;
    while (v973) {
        const v975 = list[i];
        const v976 = typeof v975;
        const v977 = v976 !== 'string';
        if (v977) {
            const v978 = name + ' must be array of strings or false';
            const v979 = new TypeError(v978);
            throw v979;
        }
        const v974 = i++;
        v973 = i < v972;
    }
    return list;
};
const parseHttpDate = function (date) {
    const v980 = Date.parse(date);
    var timestamp = date && v980;
    const v981 = typeof timestamp;
    const v982 = v981 === 'number';
    let v983;
    if (v982) {
        v983 = timestamp;
    } else {
        v983 = NaN;
    }
    return v983;
};
const parseTokenList = function (str) {
    var end = 0;
    var list = [];
    var start = 0;
    var i = 0;
    var len = str.length;
    let v984 = i < len;
    while (v984) {
        const v986 = str.charCodeAt(i);
        switch (v986) {
        case 32:
            const v987 = start === end;
            if (v987) {
                end = i + 1;
                start = end;
            }
            break;
        case 44:
            const v988 = start !== end;
            if (v988) {
                const v989 = str.substring(start, end);
                const v990 = list.push(v989);
                v990;
            }
            end = i + 1;
            start = end;
            break;
        default:
            end = i + 1;
            break;
        }
        const v985 = i++;
        v984 = i < len;
    }
    const v991 = start !== end;
    if (v991) {
        const v992 = str.substring(start, end);
        const v993 = list.push(v992);
        v993;
    }
    return list;
};
const setHeaders = function (res, headers) {
    var keys = Object.keys(headers);
    var i = 0;
    const v994 = keys.length;
    let v995 = i < v994;
    while (v995) {
        var key = keys[i];
        const v997 = headers[key];
        const v998 = res.setHeader(key, v997);
        v998;
        const v996 = i++;
        v995 = i < v994;
    }
};