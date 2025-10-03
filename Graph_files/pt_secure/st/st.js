const mime = require('mime');
const path = require('path');
let fs;
try {
    fs = require('graceful-fs');
} catch (e) {
    fs = require('fs');
}
const zlib = require('zlib');
const Neg = require('negotiator');
const http = require('http');
const v582 = require('lru-cache');
const LRUCache = v582.LRUCache;
const FD = require('fd');
const bl = require('bl');
const v583 = http;
const STATUS_CODES = v583.STATUS_CODES;
const v584 = 1000 * 60;
const v585 = v584 * 60;
const v586 = {};
v586.max = 1000;
v586.maxAge = v585;
v586.ignoreFetchAbort = true;
const v587 = 1000 * 60;
const v588 = {};
v588.max = 5000;
v588.maxAge = v587;
v588.ignoreFetchAbort = true;
const v589 = 1024 * 1024;
const v590 = v589 * 64;
const v592 = n => {
    const v591 = n.length;
    return v591;
};
const v593 = 1000 * 60;
const v594 = v593 * 10;
const v595 = {};
v595.maxSize = v590;
v595.sizeCalculation = v592;
v595.maxAge = v594;
v595.ignoreFetchAbort = true;
const v596 = 1024 * 8;
const v598 = n => {
    const v597 = n.length;
    return v597;
};
const v599 = 1000 * 60;
const v600 = v599 * 10;
const v601 = {};
v601.maxSize = v596;
v601.sizeCalculation = v598;
v601.maxAge = v600;
v601.ignoreFetchAbort = true;
const v604 = n => {
    const v602 = Object.keys(n);
    const v603 = v602.length;
    return v603;
};
const v605 = 1000 * 60;
const v606 = v605 * 10;
const v607 = {};
v607.maxSize = 1000;
v607.sizeCalculation = v604;
v607.maxAge = v606;
v607.ignoreFetchAbort = true;
const defaultCacheOptions = {};
defaultCacheOptions.fd = v586;
defaultCacheOptions.stat = v588;
defaultCacheOptions.content = v595;
defaultCacheOptions.index = v601;
defaultCacheOptions.readdir = v607;
const v609 = () => {
    const v608 = Number.MAX_SAFE_INTEGER;
    return v608;
};
const none = {};
none.maxSize = 1;
none.sizeCalculation = v609;
const noCaching = {};
noCaching.fd = none;
noCaching.stat = none;
noCaching.index = none;
noCaching.readdir = none;
noCaching.content = none;
const st = function (opt) {
    let p;
    let u;
    const v610 = typeof opt;
    const v611 = v610 === 'string';
    if (v611) {
        p = opt;
        opt = arguments[1];
        const v612 = typeof opt;
        const v613 = v612 === 'string';
        if (v613) {
            u = opt;
            opt = arguments[2];
        }
    }
    const v614 = !opt;
    if (v614) {
        opt = {};
    } else {
        const v615 = {};
        opt = Object.assign(v615, opt);
    }
    const v616 = !p;
    if (v616) {
        p = opt.path;
    }
    const v617 = typeof p;
    const v618 = v617 !== 'string';
    if (v618) {
        const v619 = new Error('no path specified');
        throw v619;
    }
    p = path.resolve(p);
    const v620 = !u;
    if (v620) {
        u = opt.url;
    }
    const v621 = !u;
    if (v621) {
        u = '';
    }
    const v622 = u.charAt(0);
    const v623 = v622 !== '/';
    if (v623) {
        u = '/' + u;
    }
    opt.url = u;
    opt.path = p;
    const m = new Mount(opt);
    const v624 = m.serve;
    const fn = v624.bind(m);
    fn._this = m;
    return fn;
};
const Mount = function Mount(opt) {
    const v625 = !opt;
    if (v625) {
        const v626 = new Error('no options provided');
        throw v626;
    }
    const v627 = typeof opt;
    const v628 = v627 !== 'object';
    if (v628) {
        const v629 = new Error('invalid options');
        throw v629;
    }
    const v630 = this instanceof Mount;
    const v631 = !v630;
    if (v631) {
        const v632 = new Mount(opt);
        return v632;
    }
    this.opt = opt;
    const v633 = opt.url;
    this.url = v633;
    const v634 = opt.path;
    this.path = v634;
    const v635 = opt.index;
    const v636 = v635 === false;
    const v637 = opt.index;
    const v638 = typeof v637;
    const v639 = v638 === 'string';
    const v640 = opt.index;
    let v641;
    if (v639) {
        v641 = v640;
    } else {
        v641 = true;
    }
    let v642;
    if (v636) {
        v642 = false;
    } else {
        v642 = v641;
    }
    this._index = v642;
    const v643 = FD();
    this.fdman = v643;
    const c = this.getCacheOptions(opt);
    const v644 = c.fd;
    const v645 = new LRUCache(v644);
    const v646 = c.stat;
    const v647 = new LRUCache(v646);
    const v648 = c.index;
    const v649 = new LRUCache(v648);
    const v650 = c.readdir;
    const v651 = new LRUCache(v650);
    const v652 = c.content;
    const v653 = new LRUCache(v652);
    const v654 = {};
    v654.fd = v645;
    v654.stat = v647;
    v654.index = v649;
    v654.readdir = v651;
    v654.content = v653;
    this.cache = v654;
    const v655 = c.content;
    const v656 = v655.maxAge;
    const v657 = v656 === false;
    const v658 = c.content;
    const v659 = v658.cacheControl;
    const v660 = typeof v659;
    const v661 = v660 === 'string';
    const v662 = c.content;
    const v663 = v662.cacheControl;
    const v664 = opt.cache;
    const v665 = v664 === false;
    const v666 = c.content;
    const v667 = v666.maxAge;
    const v668 = v667 / 1000;
    const v669 = 'public, max-age=' + v668;
    let v670;
    if (v665) {
        v670 = 'no-cache';
    } else {
        v670 = v669;
    }
    let v671;
    if (v661) {
        v671 = v663;
    } else {
        v671 = v670;
    }
    let v672;
    if (v657) {
        v672 = undefined;
    } else {
        v672 = v671;
    }
    this._cacheControl = v672;
};
const getCacheOptions = function getCacheOptions(opt) {
    let o = opt.cache;
    const set = key => {
        const v673 = o[key];
        const v674 = v673 === false;
        const v675 = {};
        const v676 = Object.assign(v675, none);
        const v677 = {};
        const v678 = d[key];
        const v679 = Object.assign(v677, v678);
        const v680 = o[key];
        const v681 = Object.assign(v679, v680);
        let v682;
        if (v674) {
            v682 = v676;
        } else {
            v682 = v681;
        }
        return v682;
    };
    const v683 = o === false;
    if (v683) {
        o = noCaching;
    } else {
        const v684 = !o;
        if (v684) {
            o = {};
        }
    }
    const d = defaultCacheOptions;
    const v685 = set('fd');
    const v686 = set('stat');
    const v687 = set('index');
    const v688 = set('readdir');
    const v689 = set('content');
    const c = {};
    c.fd = v685;
    c.stat = v686;
    c.index = v687;
    c.readdir = v688;
    c.content = v689;
    const v690 = c.fd;
    const v693 = key => {
        const v691 = this.fdman;
        const v692 = v691.close(key);
        return v692;
    };
    v690.dispose = v693;
    const v694 = c.fd;
    const v703 = key => {
        const v701 = (resolve, reject) => {
            const v695 = this.fdman;
            const v699 = (err, fd) => {
                const v696 = reject(err);
                const v697 = resolve(fd);
                let v698;
                if (err) {
                    v698 = v696;
                } else {
                    v698 = v697;
                }
                return v698;
            };
            const v700 = v695.open(key, v699);
            return v700;
        };
        const v702 = new Promise(v701);
        return v702;
    };
    v694.fetchMethod = v703;
    const v704 = c.stat;
    const v712 = key => {
        const v710 = (resolve, reject) => {
            const v708 = (err, fd) => {
                const v705 = reject(err);
                const v706 = resolve(fd);
                let v707;
                if (err) {
                    v707 = v705;
                } else {
                    v707 = v706;
                }
                return v707;
            };
            const v709 = this._loadStat(key, v708);
            return v709;
        };
        const v711 = new Promise(v710);
        return v711;
    };
    v704.fetchMethod = v712;
    const v713 = c.index;
    const v721 = key => {
        const v719 = (resolve, reject) => {
            const v717 = (err, fd) => {
                const v714 = reject(err);
                const v715 = resolve(fd);
                let v716;
                if (err) {
                    v716 = v714;
                } else {
                    v716 = v715;
                }
                return v716;
            };
            const v718 = this._loadIndex(key, v717);
            return v718;
        };
        const v720 = new Promise(v719);
        return v720;
    };
    v713.fetchMethod = v721;
    const v722 = c.readdir;
    const v730 = key => {
        const v728 = (resolve, reject) => {
            const v726 = (err, fd) => {
                const v723 = reject(err);
                const v724 = resolve(fd);
                let v725;
                if (err) {
                    v725 = v723;
                } else {
                    v725 = v724;
                }
                return v725;
            };
            const v727 = this._loadReaddir(key, v726);
            return v727;
        };
        const v729 = new Promise(v728);
        return v729;
    };
    v722.fetchMethod = v730;
    const v731 = c.content;
    const v739 = key => {
        const v737 = (resolve, reject) => {
            const v735 = (err, fd) => {
                const v732 = reject(err);
                const v733 = resolve(fd);
                let v734;
                if (err) {
                    v734 = v732;
                } else {
                    v734 = v733;
                }
                return v734;
            };
            const v736 = this._loadContent(key, v735);
            return v736;
        };
        const v738 = new Promise(v737);
        return v738;
    };
    v731.fetchMethod = v739;
    return c;
};
Mount.getCacheOptions = getCacheOptions;
const getUriPath = function getUriPath(u) {
    const v740 = new URL(u, 'http://base');
    let p = v740.pathname;
    p = p.replace(/\\/g, '/');
    const v741 = /[/\\]\.\.([/\\]|$)/.test(p);
    if (v741) {
        return 403;
    }
    const v742 = path.normalize(p);
    u = v742.replace(/\\/g, '/');
    const v743 = this.url;
    const v744 = u.indexOf(v743);
    const v745 = v744 !== 0;
    if (v745) {
        return false;
    }
    try {
        const decoded = decodeURIComponent(u);
        const v746 = decoded !== u;
        if (v746) {
            u = decoded;
        }
    } catch (e) {
        return false;
    }
    const v747 = this.url;
    const v748 = v747.length;
    u = u.substr(v748);
    const v749 = u.charAt(0);
    const v750 = v749 !== '/';
    if (v750) {
        u = '/' + u;
    }
    return u;
};
Mount.getUriPath = getUriPath;
const getPath = function getPath(u) {
    const v751 = u.length;
    const v752 = v751 > 0;
    const v753 = u.length;
    const v754 = v753 - 1;
    const v755 = u[v754];
    const v756 = v755 === '/';
    let v757 = v752 && v756;
    while (v757) {
        const v758 = -1;
        u = u.slice(0, v758);
        v757 = v752 && v756;
    }
    const v759 = this.path;
    const v760 = path.join(v759, u);
    return v760;
};
Mount.getPath = getPath;
const getUrl = function getUrl(p) {
    p = path.resolve(p);
    const v761 = this.path;
    const v762 = p.indexOf(v761);
    const v763 = v762 !== 0;
    if (v763) {
        return false;
    }
    const v764 = this.path;
    const v765 = v764.length;
    const v766 = p.substr(v765);
    p = path.join('/', v766);
    const v767 = this.url;
    const v768 = path.join(v767, p);
    const u = v768.replace(/\\/g, '/');
    return u;
};
Mount.getUrl = getUrl;
const serve = function serve(req, res, next) {
    const v769 = req.method;
    const v770 = v769 !== 'HEAD';
    const v771 = req.method;
    const v772 = v771 !== 'GET';
    const v773 = v770 && v772;
    if (v773) {
        const v774 = typeof next;
        const v775 = v774 === 'function';
        if (v775) {
            const v776 = next();
            v776;
        }
        return false;
    }
    const v777 = req.sturl;
    const v778 = !v777;
    if (v778) {
        const v779 = req.url;
        const v780 = this.getUriPath(v779);
        req.sturl = v780;
    }
    const v781 = req.sturl;
    const v782 = v781 === 403;
    const v783 = this.opt;
    const v784 = v783.dot;
    const v785 = !v784;
    const v786 = req.sturl;
    const v787 = /(^|\/)\./.test(v786);
    const v788 = v785 && v787;
    const v789 = v782 || v788;
    if (v789) {
        res.statusCode = 403;
        const v790 = res.statusCode;
        const v791 = STATUS_CODES[v790];
        const v792 = res.end(v791);
        v792;
        return true;
    }
    const v793 = req.sturl;
    const v794 = typeof v793;
    const v795 = v794 !== 'string';
    const v796 = req.sturl;
    const v797 = v796 === '';
    const v798 = v795 || v797;
    if (v798) {
        const v799 = typeof next;
        const v800 = v799 === 'function';
        if (v800) {
            const v801 = next();
            v801;
        }
        return false;
    }
    const v802 = req.sturl;
    const p = this.getPath(v802);
    const v803 = this.cache;
    const v804 = v803.fd;
    const v805 = v804.fetch(p);
    const v866 = fd => {
        const v806 = this.fdman;
        const v807 = v806.checkout(p, fd);
        v807;
        const v808 = this.fdman;
        const end = v808.checkinfn(p, fd);
        const v809 = this.cache;
        const v810 = v809.stat;
        const v811 = fd + ':';
        const v812 = v811 + p;
        const v813 = v810.fetch(v812);
        const v853 = stat => {
            const isDirectory = stat.isDirectory();
            if (isDirectory) {
                const v814 = end();
                v814;
                const v815 = this.opt;
                const v816 = v815.passthrough;
                const v817 = v816 === true;
                const v818 = next && v817;
                const v819 = this._index;
                const v820 = v819 === false;
                const v821 = v818 && v820;
                if (v821) {
                    const v822 = next();
                    return v822;
                }
            }
            const v823 = req.headers;
            let ims = v823['if-modified-since'];
            if (ims) {
                const v824 = new Date(ims);
                ims = v824.getTime();
            }
            const v825 = stat.mtime;
            const v826 = v825.getTime();
            const v827 = ims >= v826;
            const v828 = ims && v827;
            if (v828) {
                res.statusCode = 304;
                const v829 = res.end();
                v829;
                const v830 = end();
                return v830;
            }
            const etag = getEtag(stat);
            const v831 = req.headers;
            const v832 = v831['if-none-match'];
            const v833 = v832 === etag;
            if (v833) {
                res.statusCode = 304;
                const v834 = res.end();
                v834;
                const v835 = end();
                return v835;
            }
            const v836 = res.getHeader('cache-control');
            const v837 = !v836;
            const v838 = this._cacheControl;
            const v839 = v837 && v838;
            if (v839) {
                const v840 = this._cacheControl;
                const v841 = res.setHeader('cache-control', v840);
                v841;
            }
            const v842 = stat.mtime;
            const v843 = v842.toUTCString();
            const v844 = res.setHeader('last-modified', v843);
            v844;
            const v845 = res.setHeader('etag', etag);
            v845;
            const v846 = this.opt;
            const v847 = v846.cors;
            if (v847) {
                const v848 = res.setHeader('Access-Control-Allow-Origin', '*');
                v848;
                const v849 = res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
                v849;
            }
            const v850 = this.index(p, req, res);
            const v851 = this.file(p, fd, stat, etag, req, res, end);
            let v852;
            if (isDirectory) {
                v852 = v850;
            } else {
                v852 = v851;
            }
            return v852;
        };
        const v864 = er => {
            const v854 = this.opt;
            const v855 = v854.passthrough;
            const v856 = v855 === true;
            const v857 = next && v856;
            const v858 = this._index;
            const v859 = v858 === false;
            const v860 = v857 && v859;
            if (v860) {
                const v861 = next();
                return v861;
            }
            const v862 = end();
            v862;
            const v863 = this.error(er, res);
            return v863;
        };
        const v865 = v813.then(v853, v864);
        v865;
    };
    const v876 = er => {
        const v867 = this.opt;
        const v868 = v867.passthrough;
        const v869 = v868 === true;
        const v870 = er.code;
        const v871 = v870 === 'ENOENT';
        const v872 = v869 && v871;
        const v873 = v872 && next;
        if (v873) {
            const v874 = next();
            return v874;
        }
        const v875 = this.error(er, res);
        return v875;
    };
    const v877 = v805.then(v866, v876);
    v877;
    return true;
};
Mount.serve = serve;
const error = function error(er, res) {
    const v878 = typeof er;
    const v879 = v878 === 'number';
    const v880 = er.code;
    const v881 = v880 === 'ENOENT';
    const v882 = er.code;
    const v883 = v882 === 'EISDIR';
    const v884 = v881 || v883;
    const v885 = er.code;
    const v886 = v885 === 'EPERM';
    const v887 = er.code;
    const v888 = v887 === 'EACCES';
    const v889 = v886 || v888;
    let v890;
    if (v889) {
        v890 = 403;
    } else {
        v890 = 500;
    }
    let v891;
    if (v884) {
        v891 = 404;
    } else {
        v891 = v890;
    }
    let v892;
    if (v879) {
        v892 = er;
    } else {
        v892 = v891;
    }
    res.statusCode = v892;
    const v893 = res.error;
    const v894 = typeof v893;
    const v895 = v894 === 'function';
    if (v895) {
        const v896 = res.statusCode;
        const v897 = res.error(v896, er);
        return v897;
    }
    const v898 = res.setHeader('content-type', 'text/plain');
    v898;
    const v899 = res.statusCode;
    const v900 = STATUS_CODES[v899];
    const v901 = v900 + '\n';
    const v902 = res.end(v901);
    v902;
};
Mount.error = error;
const index = function index(p, req, res) {
    const v903 = this._index;
    const v904 = v903 === true;
    if (v904) {
        const v905 = this.autoindex(p, req, res);
        return v905;
    }
    const v906 = this._index;
    const v907 = typeof v906;
    const v908 = v907 === 'string';
    if (v908) {
        const v909 = req.sturl;
        const v910 = /\/$/.test(v909);
        const v911 = !v910;
        if (v911) {
            req.sturl += '/';
        }
        const v912 = this._index;
        req.sturl += v912;
        const v913 = this.serve(req, res);
        return v913;
    }
    const v914 = this.error(404, res);
    return v914;
};
Mount.index = index;
const autoindex = function autoindex(p, req, res) {
    const v915 = req.sturl;
    const v916 = /\/$/.exec(v915);
    const v917 = !v916;
    if (v917) {
        res.statusCode = 301;
        const v918 = req.sturl;
        const v919 = v918 + '/';
        const v920 = res.setHeader('location', v919);
        v920;
        const v921 = req.sturl;
        const v922 = 'Moved: ' + v921;
        const v923 = v922 + '/';
        const v924 = res.end(v923);
        v924;
        return;
    }
    const v925 = this.cache;
    const v926 = v925.index;
    const v927 = v926.fetch(p);
    const v932 = html => {
        res.statusCode = 200;
        const v928 = res.setHeader('content-type', 'text/html');
        v928;
        const v929 = html.length;
        const v930 = res.setHeader('content-length', v929);
        v930;
        const v931 = res.end(html);
        v931;
    };
    const v934 = er => {
        const v933 = this.error(er, res);
        return v933;
    };
    const v935 = v927.then(v932, v934);
    v935;
};
Mount.autoindex = autoindex;
const file = function file(p, fd, stat, etag, req, res, end) {
    const v936 = stat.size;
    const v937 = v936 + ':';
    const key = v937 + etag;
    const v938 = path.extname(p);
    const mt = mime.getType(v938);
    const v939 = mt !== 'application/octet-stream';
    if (v939) {
        const v940 = res.setHeader('content-type', mt);
        v940;
    }
    const v941 = this.cache;
    const v942 = v941.content;
    const v943 = v942.has(key);
    if (v943) {
        const v944 = end();
        v944;
        const v945 = this.cachedFile(p, stat, etag, req, res);
        v945;
    } else {
        const v946 = this.streamFile(p, fd, stat, etag, req, res, end);
        v946;
    }
};
Mount.file = file;
const cachedFile = function cachedFile(p, stat, etag, req, res) {
    const v947 = stat.size;
    const v948 = v947 + ':';
    const key = v948 + etag;
    const v949 = this.opt;
    const v950 = v949.gzip;
    const v951 = v950 !== false;
    const v952 = getGz(p, req);
    const gz = v951 && v952;
    const v953 = this.cache;
    const v954 = v953.content;
    const content = v954.get(key);
    res.statusCode = 200;
    const v955 = this.opt;
    const v956 = v955.cachedHeader;
    if (v956) {
        const v957 = res.setHeader('x-from-cache', 'true');
        v957;
    }
    const v958 = content.gz;
    const v959 = gz && v958;
    if (v959) {
        const v960 = res.setHeader('content-encoding', 'gzip');
        v960;
        const v961 = content.gz;
        const v962 = v961.length;
        const v963 = res.setHeader('content-length', v962);
        v963;
        const v964 = content.gz;
        const v965 = res.end(v964);
        v965;
    } else {
        const v966 = content.length;
        const v967 = res.setHeader('content-length', v966);
        v967;
        const v968 = res.end(content);
        v968;
    }
};
Mount.cachedFile = cachedFile;
const streamFile = function streamFile(p, fd, stat, etag, req, res, end) {
    const v969 = stat.size;
    const streamOpt = {};
    streamOpt.fd = fd;
    streamOpt.start = 0;
    streamOpt.end = v969;
    let stream = fs.createReadStream(p, streamOpt);
    const v970 = () => {
    };
    stream.destroy = v970;
    const v971 = this.opt;
    const v972 = v971.gzip;
    const gzOpt = v972 !== false;
    const v973 = getGz(p, req);
    const gz = gzOpt && v973;
    const v974 = this.cache;
    const v975 = v974.content;
    const v976 = v975.maxSize;
    const v977 = stat.size;
    const cachable = v976 > v977;
    let gzstr;
    const v978 = gzOpt && cachable;
    const v979 = gz || v978;
    if (v979) {
        gzstr = zlib.createGzip();
    }
    const v987 = e => {
        const v980 = e.stack;
        const v981 = e.message;
        const v982 = v980 || v981;
        const v983 = console.error('Error serving %s fd=%d\n%s', p, fd, v982);
        v983;
        const v984 = res.socket;
        const v985 = v984.destroy();
        v985;
        const v986 = end();
        v986;
    };
    const v988 = stream.on('error', v987);
    v988;
    const v989 = res.filter;
    if (v989) {
        const v990 = res.filter;
        stream = stream.pipe(v990);
    }
    res.statusCode = 200;
    if (gz) {
        const v991 = res.setHeader('content-encoding', 'gzip');
        v991;
        const v992 = stream.pipe(gzstr);
        const v993 = v992.pipe(res);
        v993;
    } else {
        const v994 = res.filter;
        const v995 = !v994;
        if (v995) {
            const v996 = stat.size;
            const v997 = res.setHeader('content-length', v996);
            v997;
        }
        const v998 = stream.pipe(res);
        v998;
        if (gzstr) {
            const v999 = stream.pipe(gzstr);
            v999;
        }
    }
    const v1001 = () => {
        const v1000 = process.nextTick(end);
        return v1000;
    };
    const v1002 = stream.on('end', v1001);
    v1002;
    if (cachable) {
        let calls = 0;
        const collectEnd = () => {
            const v1003 = ++calls;
            let v1004;
            if (gzOpt) {
                v1004 = 2;
            } else {
                v1004 = 1;
            }
            const v1005 = v1003 === v1004;
            if (v1005) {
                const content = bufs.slice();
                const v1006 = gzbufs.slice();
                content.gz = gzbufs && v1006;
                const v1007 = this.cache;
                const v1008 = v1007.content;
                const v1009 = v1008.set(key, content);
                v1009;
            }
        };
        const v1010 = stat.size;
        const v1011 = v1010 + ':';
        const key = v1011 + etag;
        const bufs = bl(collectEnd);
        let gzbufs;
        const v1012 = stream.pipe(bufs);
        v1012;
        if (gzstr) {
            gzbufs = bl(collectEnd);
            const v1013 = gzstr.pipe(gzbufs);
            v1013;
        }
    }
};
Mount.streamFile = streamFile;
const _loadIndex = function _loadIndex(p, cb) {
    const v1014 = this.path;
    const v1015 = v1014.length;
    const v1016 = p.substr(v1015);
    const url = v1016.replace(/\\/g, '/');
    const v1017 = url.replace(/"/g, '&quot;');
    const v1018 = v1017.replace(/</g, '&lt;');
    const v1019 = v1018.replace(/>/g, '&gt;');
    const t = v1019.replace(/'/g, '&#39;');
    const v1020 = '<!doctype html>' + '<html>';
    const v1021 = v1020 + '<head><title>Index of ';
    const v1022 = v1021 + t;
    const v1023 = v1022 + '</title></head>';
    const v1024 = v1023 + '<body>';
    const v1025 = v1024 + '<h1>Index of ';
    const v1026 = v1025 + t;
    const v1027 = v1026 + '</h1>';
    let str = v1027 + '<hr><pre><a href="../">../</a>\n';
    const v1028 = this.cache;
    const v1029 = v1028.readdir;
    const v1030 = v1029.fetch(p);
    const v1104 = data => {
        let nameLen = 0;
        let sizeLen = 0;
        const v1031 = Object.keys(data);
        const v1051 = f => {
            const d = data[f];
            const v1032 = f.replace(/"/g, '&quot;');
            const v1033 = v1032.replace(/</g, '&lt;');
            const v1034 = v1033.replace(/>/g, '&gt;');
            let name = v1034.replace(/'/g, '&#39;');
            const v1035 = d.size;
            const v1036 = v1035 === '-';
            if (v1036) {
                name += '/';
            }
            const showName = name.replace(/^(.{40}).{3,}$/, '$1..>');
            const v1037 = encodeURIComponent(name);
            const v1038 = v1037.replace(/%2e/ig, '.');
            const v1039 = v1038.replace(/%2f|%5c/ig, '/');
            const linkName = v1039.replace(/[/\\]/g, '/');
            const v1040 = showName.length;
            nameLen = Math.max(nameLen, v1040);
            const v1041 = d.size;
            const v1042 = '' + v1041;
            const v1043 = v1042.length;
            sizeLen = Math.max(sizeLen, v1043);
            const v1044 = '<a href="' + linkName;
            const v1045 = v1044 + '">';
            const v1046 = v1045 + showName;
            const v1047 = v1046 + '</a>';
            const v1048 = d.mtime;
            const v1049 = d.size;
            const v1050 = [
                v1047,
                v1048,
                v1049,
                showName
            ];
            return v1050;
        };
        const v1052 = v1031.map(v1051);
        const v1079 = (a, b) => {
            const v1053 = a[2];
            const v1054 = v1053 === '-';
            const v1055 = b[2];
            const v1056 = v1055 !== '-';
            const v1057 = v1054 && v1056;
            const v1058 = -1;
            const v1059 = a[2];
            const v1060 = v1059 !== '-';
            const v1061 = b[2];
            const v1062 = v1061 === '-';
            const v1063 = v1060 && v1062;
            const v1064 = a[0];
            const v1065 = v1064.toLowerCase();
            const v1066 = b[0];
            const v1067 = v1066.toLowerCase();
            const v1068 = v1065 < v1067;
            const v1069 = -1;
            const v1070 = a[0];
            const v1071 = v1070.toLowerCase();
            const v1072 = b[0];
            const v1073 = v1072.toLowerCase();
            const v1074 = v1071 > v1073;
            let v1075;
            if (v1074) {
                v1075 = 1;
            } else {
                v1075 = 0;
            }
            let v1076;
            if (v1068) {
                v1076 = v1069;
            } else {
                v1076 = v1075;
            }
            let v1077;
            if (v1063) {
                v1077 = 1;
            } else {
                v1077 = v1076;
            }
            let v1078;
            if (v1057) {
                v1078 = v1058;
            } else {
                v1078 = v1077;
            }
            return v1078;
        };
        const v1080 = v1052.sort(v1079);
        const v1100 = line => {
            const v1081 = 8 + nameLen;
            const v1082 = line[3];
            const v1083 = v1082.length;
            const v1084 = v1081 - v1083;
            const v1085 = new Array(v1084);
            const namePad = v1085.join(' ');
            const v1086 = 8 + sizeLen;
            const v1087 = line[2];
            const v1088 = '' + v1087;
            const v1089 = v1088.length;
            const v1090 = v1086 - v1089;
            const v1091 = new Array(v1090);
            const sizePad = v1091.join(' ');
            const v1092 = line[0];
            const v1093 = v1092 + namePad;
            const v1094 = line[1];
            const v1095 = v1094.toISOString();
            const v1096 = v1093 + v1095;
            const v1097 = v1096 + sizePad;
            const v1098 = line[2];
            const v1099 = v1097 + v1098;
            str += v1099 + '\n';
        };
        const v1101 = v1080.forEach(v1100);
        v1101;
        str += '</pre><hr></body></html>';
        const v1102 = Buffer.from(str);
        const v1103 = cb(null, v1102);
        v1103;
    };
    const v1106 = er => {
        const v1105 = cb(er);
        return v1105;
    };
    const v1107 = v1030.then(v1104, v1106);
    v1107;
};
Mount._loadIndex = _loadIndex;
const _loadReaddir = function _loadReaddir(p, cb) {
    let len;
    let data;
    const v1129 = (er, files) => {
        if (er) {
            const v1108 = cb(er);
            return v1108;
        }
        const v1117 = f => {
            const v1109 = this.opt;
            const v1110 = v1109.dot;
            const v1111 = !v1110;
            if (v1111) {
                const v1112 = /^\./.test(f);
                const v1113 = !v1112;
                return v1113;
            } else {
                const v1114 = f !== '.';
                const v1115 = f !== '..';
                const v1116 = v1114 && v1115;
                return v1116;
            }
        };
        files = files.filter(v1117);
        len = files.length;
        data = {};
        const v1127 = file => {
            const pf = path.join(p, file);
            const v1118 = this.cache;
            const v1119 = v1118.stat;
            const v1120 = v1119.fetch(pf);
            const v1123 = stat => {
                const v1121 = stat.isDirectory();
                if (v1121) {
                    stat.size = '-';
                }
                data[file] = stat;
                const v1122 = next();
                v1122;
            };
            const v1125 = er => {
                const v1124 = cb(er);
                return v1124;
            };
            const v1126 = v1120.then(v1123, v1125);
            v1126;
        };
        const v1128 = files.forEach(v1127);
        v1128;
    };
    const v1130 = fs.readdir(p, v1129);
    v1130;
    const next = () => {
        const v1131 = --len;
        const v1132 = v1131 === 0;
        if (v1132) {
            const v1133 = cb(null, data);
            v1133;
        }
    };
};
Mount._loadReaddir = _loadReaddir;
const _loadStat = function _loadStat(key, cb) {
    const fdp = key.match(/^(\d+):(.*)/);
    if (fdp) {
        const v1134 = fdp[1];
        const v1135 = +v1134;
        const fd = v1135;
        const p = fdp[2];
        const v1141 = (er, stat) => {
            if (er) {
                const v1136 = cb(er);
                return v1136;
            }
            const v1137 = this.cache;
            const v1138 = v1137.stat;
            const v1139 = v1138.set(p, stat);
            v1139;
            const v1140 = cb(null, stat);
            v1140;
        };
        const v1142 = fs.fstat(fd, v1141);
        v1142;
    } else {
        const v1143 = fs.stat(key, cb);
        v1143;
    }
};
Mount._loadStat = _loadStat;
const _loadContent = function _loadContent(_, cb) {
    const v1144 = new Error('This should never happen');
    const v1145 = cb(v1144);
    return v1145;
};
Mount._loadContent = _loadContent;
Mount['is_class'] = true;
const getEtag = function (s) {
    const v1146 = s.dev;
    const v1147 = '"' + v1146;
    const v1148 = v1147 + '-';
    const v1149 = s.ino;
    const v1150 = v1148 + v1149;
    const v1151 = v1150 + '-';
    const v1152 = s.mtime;
    const v1153 = v1152.getTime();
    const v1154 = v1151 + v1153;
    const v1155 = v1154 + '"';
    return v1155;
};
const getGz = function (p, req) {
    let gz = false;
    const v1156 = /\.t?gz$/.exec(p);
    const v1157 = !v1156;
    if (v1157) {
        const v1158 = req.negotiator;
        const v1159 = new Neg(req);
        const neg = v1158 || v1159;
        const v1160 = [
            'gzip',
            'identity'
        ];
        const v1161 = neg.preferredEncoding(v1160);
        gz = v1161 === 'gzip';
    }
    return gz;
};
module.exports = st;
const v1162 = module.exports;
v1162.Mount = Mount;