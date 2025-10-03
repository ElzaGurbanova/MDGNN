'use strict';
const sof = {};
sof[192] = true;
sof[193] = true;
sof[194] = true;
sof[195] = true;
sof[197] = true;
sof[198] = true;
sof[199] = true;
sof[201] = true;
sof[202] = true;
sof[203] = true;
sof[205] = true;
sof[206] = true;
sof[207] = true;
const child = require('child_process');
const exec = child.exec;
const spawn = child.spawn;
const Fs = require('fs');
const REGEXP_SVG = /(width="\d+")+|(height="\d+")+/g;
const REGEXP_PATH = /\//g;
const REGEXP_ESCAPE = /'/g;
const SPAWN_OPT = {};
SPAWN_OPT.shell = true;
let D;
const v536 = require('os');
const v537 = v536.platform();
const v538 = v537.substring(0, 3);
const v539 = v538.toLowerCase();
const v540 = v539 === 'win';
if (v540) {
    D = '"';
} else {
    D = '\'';
}
const CMD_CONVERT = {};
CMD_CONVERT.gm = 'gm';
CMD_CONVERT.im = 'convert';
CMD_CONVERT.magick = 'magick';
const CMD_CONVERT2 = {};
CMD_CONVERT2.gm = 'gm convert';
CMD_CONVERT2.im = 'convert';
CMD_CONVERT2.magick = 'magick';
const SUPPORTEDIMAGES = {};
SUPPORTEDIMAGES.jpg = 1;
SUPPORTEDIMAGES.png = 1;
SUPPORTEDIMAGES.gif = 1;
SUPPORTEDIMAGES.apng = 1;
SUPPORTEDIMAGES.jpeg = 1;
SUPPORTEDIMAGES.heif = 1;
SUPPORTEDIMAGES.heic = 1;
SUPPORTEDIMAGES.webp = 1;
SUPPORTEDIMAGES.ico = 1;
var CACHE = {};
var middlewares = {};
const v541 = global.framework_utils;
const v542 = !v541;
if (v542) {
    const v543 = require('./utils');
    global.framework_utils = v543;
}
const u16 = function (buf, o) {
    const v544 = buf[o];
    const v545 = v544 << 8;
    const v546 = o + 1;
    const v547 = buf[v546];
    const v548 = v545 | v547;
    return v548;
};
const u32 = function (buf, o) {
    const v549 = buf[o];
    const v550 = v549 << 24;
    const v551 = o + 1;
    const v552 = buf[v551];
    const v553 = v552 << 16;
    const v554 = v550 | v553;
    const v555 = o + 2;
    const v556 = buf[v555];
    const v557 = v556 << 8;
    const v558 = v554 | v557;
    const v559 = o + 3;
    const v560 = buf[v559];
    const v561 = v558 | v560;
    return v561;
};
const v565 = function (buffer) {
    const v562 = buffer[6];
    const v563 = buffer[8];
    const v564 = {};
    v564.width = v562;
    v564.height = v563;
    return v564;
};
exports.measureGIF = v565;
const v585 = function (buffer) {
    var len = buffer.length;
    var o = 0;
    const v566 = buffer[0];
    const v567 = 255 == v566;
    const v568 = buffer[1];
    const v569 = 216 == v568;
    var jpeg = v567 && v569;
    if (jpeg) {
        o += 2;
        let v570 = o < len;
        while (v570) {
            const v571 = buffer[o];
            let v572 = 255 != v571;
            while (v572) {
                const v573 = o++;
                v573;
                v572 = 255 != v571;
            }
            const v574 = buffer[o];
            let v575 = 255 == v574;
            while (v575) {
                const v576 = o++;
                v576;
                v575 = 255 == v574;
            }
            const v577 = buffer[o];
            const v578 = sof[v577];
            if (v578) {
                const v579 = o + 6;
                const v580 = u16(buffer, v579);
                const v581 = o + 4;
                const v582 = u16(buffer, v581);
                const v583 = {};
                v583.width = v580;
                v583.height = v582;
                return v583;
            } else {
                const v584 = ++o;
                o += u16(buffer, v584);
            }
            v570 = o < len;
        }
    }
    return null;
};
exports.measureJPG = v585;
const v590 = function (buffer) {
    const v586 = u32(buffer, 16);
    const v587 = 16 + 4;
    const v588 = u32(buffer, v587);
    const v589 = {};
    v589.width = v586;
    v589.height = v588;
    return v589;
};
exports.measurePNG = v590;
const v605 = function (buffer) {
    const v591 = buffer.toString('utf8');
    var match = v591.match(REGEXP_SVG);
    const v592 = !match;
    if (v592) {
        return;
    }
    var width = 0;
    var height = 0;
    var i = 0;
    var length = match.length;
    let v593 = i < length;
    while (v593) {
        var value = match[i];
        const v595 = width > 0;
        const v596 = height > 0;
        const v597 = v595 && v596;
        if (v597) {
            break;
        }
        const v598 = !width;
        const v599 = value.startsWith('width="');
        const v600 = v598 && v599;
        if (v600) {
            width = value.parseInt2();
        }
        const v601 = !height;
        const v602 = value.startsWith('height="');
        const v603 = v601 && v602;
        if (v603) {
            height = value.parseInt2();
        }
        const v594 = i++;
        v593 = i < length;
    }
    const v604 = {};
    v604.width = width;
    v604.height = height;
    return v604;
};
exports.measureSVG = v605;
const v610 = function (type, buffer) {
    switch (type) {
    case '.jpg':
    case '.jpeg':
    case 'jpg':
    case 'jpeg':
    case 'image/jpeg':
        const v606 = exports.measureJPG(buffer);
        return v606;
    case '.gif':
    case 'gif':
    case 'image/gif':
        const v607 = exports.measureGIF(buffer);
        return v607;
    case '.png':
    case 'png':
    case 'image/png':
        const v608 = exports.measurePNG(buffer);
        return v608;
    case '.svg':
    case 'svg':
    case 'image/svg+xml':
        const v609 = exports.measureSVG(buffer);
        return v609;
    }
};
exports.measure = v610;
const Image = function (filename, cmd, width, height) {
    const v611 = typeof filename;
    var type = v611;
    this.width = width;
    this.height = height;
    this.builder = [];
    const v612 = type === 'string';
    let v613;
    if (v612) {
        v613 = filename;
    } else {
        v613 = null;
    }
    this.filename = v613;
    const v614 = type === 'object';
    let v615;
    if (v614) {
        v615 = filename;
    } else {
        v615 = null;
    }
    this.currentStream = v615;
    const v616 = type === 'string';
    const v617 = framework_utils.getExtension(filename);
    let v618;
    if (v616) {
        v618 = v617;
    } else {
        v618 = 'jpg';
    }
    this.outputType = v618;
    this.islimit = false;
    const v619 = CONF.default_image_converter;
    this.cmdarg = cmd || v619;
};
var ImageProto = Image.prototype;
const v620 = function () {
    var self = this;
    self.builder = [];
    return self;
};
ImageProto.clear = v620;
const v652 = function (callback) {
    var self = this;
    const v621 = self.filename;
    var index = v621.lastIndexOf('.');
    const v622 = self.filename;
    const v623 = !v622;
    if (v623) {
        const v624 = new Error('Measure does not support stream.');
        const v625 = callback(v624);
        v625;
        return;
    }
    const v626 = -1;
    const v627 = index === v626;
    if (v627) {
        const v628 = new Error('This type of file is not supported.');
        const v629 = callback(v628);
        v629;
        return;
    }
    const v630 = F.stats;
    const v631 = v630.performance;
    const v632 = v631.open;
    const v633 = v632++;
    v633;
    const v634 = self.filename;
    const v635 = v634.substring(index);
    var extension = v635.toLowerCase();
    const v636 = require('fs');
    const v637 = self.filename;
    const v638 = extension === '.jpg';
    let v639;
    if (v638) {
        v639 = 40000;
    } else {
        v639 = 24;
    }
    const v640 = {
        start: 0,
        end: v639
    };
    var stream = v636.createReadStream(v637, v640);
    const v649 = function (buffer) {
        switch (extension) {
        case '.jpg':
            const v641 = exports.measureJPG(buffer);
            const v642 = callback(null, v641);
            v642;
            return;
        case '.gif':
            const v643 = exports.measureGIF(buffer);
            const v644 = callback(null, v643);
            v644;
            return;
        case '.png':
            const v645 = exports.measurePNG(buffer);
            const v646 = callback(null, v645);
            v646;
            return;
        }
        const v647 = new Error('This type of file is not supported.');
        const v648 = callback(v647);
        v648;
    };
    const v650 = stream.on('data', v649);
    v650;
    const v651 = stream.on('error', callback);
    v651;
    return self;
};
ImageProto.measure = v652;
const v655 = function () {
    var self = this;
    const v654 = function (callback) {
        const v653 = self.measure(callback);
        v653;
    };
    return v654;
};
ImageProto.$$measure = v655;
const v705 = function (filename, callback, writer) {
    var self = this;
    const v656 = typeof filename;
    const v657 = v656 === 'function';
    if (v657) {
        callback = filename;
        filename = null;
    }
    const v658 = self.builder;
    const v659 = v658.length;
    const v660 = !v659;
    const v661 = self.minify();
    const v662 = v660 && v661;
    v662;
    const v663 = self.filename;
    const v664 = filename || v663;
    filename = v664 || '';
    const v665 = self.filename;
    const v666 = self.filename;
    let v667;
    if (v665) {
        v667 = v666;
    } else {
        v667 = '-';
    }
    var command = self.cmd(v667, filename);
    const v668 = F.isWindows;
    if (v668) {
        command = command.replace(REGEXP_PATH, '\\');
    }
    const v690 = function (err) {
        const v669 = cmd.kill();
        v669;
        cmd = null;
        const v670 = self.clear();
        v670;
        const v671 = !callback;
        if (v671) {
            return;
        }
        if (err) {
            const v672 = callback(err, false);
            v672;
            return;
        }
        const v673 = self.outputType;
        var middleware = middlewares[v673];
        const v674 = !middleware;
        if (v674) {
            const v675 = callback(null, true);
            return v675;
        }
        const v676 = F.stats;
        const v677 = v676.performance;
        const v678 = v677.open;
        const v679 = v678++;
        v679;
        var reader = Fs.createReadStream(filename);
        const v680 = filename + '_';
        var writer = Fs.createWriteStream(v680);
        const v681 = middleware();
        const v682 = reader.pipe(v681);
        const v683 = v682.pipe(writer);
        v683;
        const v688 = () => {
            const v684 = filename + '_';
            const v686 = () => {
                const v685 = callback(null, true);
                return v685;
            };
            const v687 = Fs.rename(v684, filename, v686);
            return v687;
        };
        const v689 = writer.on('finish', v688);
        v689;
    };
    var cmd = exec(command, v690);
    const v691 = self.currentStream;
    if (v691) {
        const v692 = self.currentStream;
        const v693 = v692 instanceof Buffer;
        if (v693) {
            const v694 = cmd.stdin;
            const v695 = self.currentStream;
            const v696 = v694.end(v695);
            v696;
        } else {
            const v697 = self.currentStream;
            const v698 = cmd.stdin;
            const v699 = v697.pipe(v698);
            v699;
        }
    }
    const v700 = cmd.stdin;
    const v701 = CLEANUP(v700);
    v701;
    const v702 = cmd.stdin;
    const v703 = writer(v702);
    const v704 = writer && v703;
    v704;
    return self;
};
ImageProto.save = v705;
const v708 = function (filename, writer) {
    var self = this;
    const v707 = function (callback) {
        const v706 = self.save(filename, callback, writer);
        v706;
    };
    return v707;
};
ImageProto.$$save = v708;
const v762 = function (stream, type, options) {
    var self = this;
    const v709 = typeof type;
    const v710 = v709 === 'object';
    if (v710) {
        options = type;
        type = null;
    }
    const v711 = self.builder;
    const v712 = v711.length;
    const v713 = !v712;
    const v714 = self.minify();
    const v715 = v713 && v714;
    v715;
    const v716 = !type;
    const v717 = v716 && (type = self.outputType);
    v717;
    const v718 = F.stats;
    const v719 = v718.performance;
    const v720 = v719.open;
    const v721 = v720++;
    v721;
    const v722 = self.cmdarg;
    const v723 = CMD_CONVERT[v722];
    const v724 = self.filename;
    const v725 = self.filename;
    const v726 = wrap(v725);
    let v727;
    if (v724) {
        v727 = v726;
    } else {
        v727 = '-';
    }
    const v728 = type + ':';
    let v729;
    if (type) {
        v729 = v728;
    } else {
        v729 = '';
    }
    const v730 = v729 + '-';
    const v731 = self.arg(v727, v730);
    var cmd = spawn(v723, v731, SPAWN_OPT);
    const v732 = cmd.stderr;
    const v733 = stream.emit;
    const v734 = v733.bind(stream, 'error');
    const v735 = v732.on('data', v734);
    v735;
    const v736 = cmd.stdout;
    const v737 = stream.emit;
    const v738 = v737.bind(stream, 'data');
    const v739 = v736.on('data', v738);
    v739;
    const v740 = cmd.stdout;
    const v741 = stream.emit;
    const v742 = v741.bind(stream, 'end');
    const v743 = v740.on('end', v742);
    v743;
    const v744 = stream.emit;
    const v745 = v744.bind(stream, 'error');
    const v746 = cmd.on('error', v745);
    v746;
    var middleware = middlewares[type];
    if (middleware) {
        const v747 = cmd.stdout;
        const v748 = middleware();
        const v749 = v747.pipe(v748);
        const v750 = v749.pipe(stream, options);
        v750;
    } else {
        const v751 = cmd.stdout;
        const v752 = v751.pipe(stream, options);
        v752;
    }
    const v753 = self.currentStream;
    if (v753) {
        const v754 = self.currentStream;
        const v755 = v754 instanceof Buffer;
        if (v755) {
            const v756 = cmd.stdin;
            const v757 = self.currentStream;
            const v758 = v756.end(v757);
            v758;
        } else {
            const v759 = self.currentStream;
            const v760 = cmd.stdin;
            const v761 = v759.pipe(v760);
            v761;
        }
    }
    return self;
};
ImageProto.pipe = v762;
const v803 = function (type, writer) {
    var self = this;
    const v763 = self.builder;
    const v764 = v763.length;
    const v765 = !v764;
    const v766 = self.minify();
    const v767 = v765 && v766;
    v767;
    const v768 = !type;
    const v769 = SUPPORTEDIMAGES[type];
    const v770 = !v769;
    const v771 = v768 || v770;
    if (v771) {
        type = self.outputType;
    }
    const v772 = F.stats;
    const v773 = v772.performance;
    const v774 = v773.open;
    const v775 = v774++;
    v775;
    const v776 = self.cmdarg;
    const v777 = CMD_CONVERT[v776];
    const v778 = self.filename;
    const v779 = self.filename;
    const v780 = wrap(v779);
    let v781;
    if (v778) {
        v781 = v780;
    } else {
        v781 = '-';
    }
    const v782 = type + ':';
    let v783;
    if (type) {
        v783 = v782;
    } else {
        v783 = '';
    }
    const v784 = v783 + '-';
    const v785 = self.arg(v781, v784);
    var cmd = spawn(v777, v785, SPAWN_OPT);
    const v786 = self.currentStream;
    if (v786) {
        const v787 = self.currentStream;
        const v788 = v787 instanceof Buffer;
        if (v788) {
            const v789 = cmd.stdin;
            const v790 = self.currentStream;
            const v791 = v789.end(v790);
            v791;
        } else {
            const v792 = self.currentStream;
            const v793 = cmd.stdin;
            const v794 = v792.pipe(v793);
            v794;
        }
    }
    const v795 = cmd.stdin;
    const v796 = writer(v795);
    const v797 = writer && v796;
    v797;
    var middleware = middlewares[type];
    const v798 = cmd.stdout;
    const v799 = middleware();
    const v800 = v798.pipe(v799);
    const v801 = cmd.stdout;
    let v802;
    if (middleware) {
        v802 = v800;
    } else {
        v802 = v801;
    }
    return v802;
};
ImageProto.stream = v803;
const v829 = function (filenameFrom, filenameTo) {
    var self = this;
    var cmd = '';
    const v804 = self.islimit;
    const v805 = !v804;
    if (v805) {
        var tmp = CONF.default_image_consumption;
        if (tmp) {
            const v806 = 1500 / 100;
            const v807 = v806 * tmp;
            const v808 = self.limit('memory', v807);
            v808;
            const v809 = 3000 / 100;
            const v810 = v809 * tmp;
            const v811 = self.limit('map', v810);
            v811;
        }
    }
    const v812 = self.builder;
    const v813 = v812.sort(sort);
    v813;
    const v814 = self.builder;
    var length = v814.length;
    var i = 0;
    let v815 = i < length;
    while (v815) {
        let v817;
        if (cmd) {
            v817 = ' ';
        } else {
            v817 = '';
        }
        const v818 = self.builder;
        const v819 = v818[i];
        const v820 = v819.cmd;
        cmd += v817 + v820;
        const v816 = i++;
        v815 = i < length;
    }
    const v821 = self.cmdarg;
    const v822 = CMD_CONVERT2[v821];
    const v823 = wrap(filenameFrom, true);
    const v824 = v822 + v823;
    const v825 = v824 + ' ';
    const v826 = v825 + cmd;
    const v827 = wrap(filenameTo, true);
    const v828 = v826 + v827;
    return v828;
};
ImageProto.cmd = v829;
const sort = function (a, b) {
    const v830 = a.priority;
    const v831 = b.priority;
    const v832 = v830 > v831;
    const v833 = -1;
    let v834;
    if (v832) {
        v834 = 1;
    } else {
        v834 = v833;
    }
    return v834;
};
const v869 = function (first, last) {
    var self = this;
    var arr = [];
    const v835 = self.cmdarg;
    const v836 = v835 === 'gm';
    if (v836) {
        const v837 = arr.push('convert');
        v837;
    }
    const v838 = arr.push(first);
    const v839 = first && v838;
    v839;
    const v840 = self.islimit;
    const v841 = !v840;
    if (v841) {
        var tmp = CONF.default_image_consumption;
        if (tmp) {
            const v842 = 1500 / 100;
            const v843 = v842 * tmp;
            const v844 = self.limit('memory', v843);
            v844;
            const v845 = 3000 / 100;
            const v846 = v845 * tmp;
            const v847 = self.limit('map', v846);
            v847;
        }
    }
    const v848 = self.builder;
    const v849 = v848.sort(sort);
    v849;
    const v850 = self.builder;
    var length = v850.length;
    var i = 0;
    let v851 = i < length;
    while (v851) {
        const v853 = self.builder;
        var o = v853[i];
        const v854 = o.cmd;
        var index = v854.indexOf(' ');
        const v855 = -1;
        const v856 = index === v855;
        if (v856) {
            const v857 = o.cmd;
            const v858 = arr.push(v857);
            v858;
        } else {
            const v859 = o.cmd;
            const v860 = v859.substring(0, index);
            const v861 = arr.push(v860);
            v861;
            const v862 = o.cmd;
            const v863 = index + 1;
            const v864 = v862.substring(v863);
            const v865 = v864.replace(/"/g, '');
            const v866 = arr.push(v865);
            v866;
        }
        const v852 = i++;
        v851 = i < length;
    }
    const v867 = arr.push(last);
    const v868 = last && v867;
    v868;
    return arr;
};
ImageProto.arg = v869;
const v891 = function (callback) {
    var self = this;
    const v870 = F.stats;
    const v871 = v870.performance;
    const v872 = v871.open;
    const v873 = v872++;
    v873;
    const v874 = self.cmdarg;
    const v875 = v874 === 'gm';
    let v876;
    if (v875) {
        v876 = 'gm ';
    } else {
        v876 = '';
    }
    const v877 = v876 + 'identify';
    const v878 = self.filename;
    const v879 = wrap(v878, true);
    const v880 = v877 + v879;
    const v889 = function (err, stdout) {
        if (err) {
            const v881 = callback(err, null);
            v881;
            return;
        }
        var arr = stdout.split(' ');
        const v882 = arr[2];
        var size = v882.split('x');
        const v883 = arr[1];
        const v884 = size[0];
        const v885 = framework_utils.parseInt(v884);
        const v886 = size[1];
        const v887 = framework_utils.parseInt(v886);
        var obj = {};
        obj.type = v883;
        obj.width = v885;
        obj.height = v887;
        const v888 = callback(null, obj);
        v888;
    };
    const v890 = exec(v880, v889);
    v890;
    return self;
};
ImageProto.identify = v891;
const v894 = function () {
    var self = this;
    const v893 = function (callback) {
        const v892 = self.identify(callback);
        v892;
    };
    return v893;
};
ImageProto.$$identify = v894;
const v908 = function (key, value, priority, encode) {
    var self = this;
    var cmd = key;
    const v895 = value != null;
    if (v895) {
        const v896 = typeof value;
        const v897 = v896 === 'string';
        const v898 = encode && v897;
        if (v898) {
            const v899 = ' ' + D;
            const v900 = value.replace(REGEXP_ESCAPE, '');
            const v901 = v899 + v900;
            cmd += v901 + D;
        } else {
            cmd += ' ' + value;
        }
    }
    var obj = CACHE[cmd];
    if (obj) {
        obj.priority = priority;
        const v902 = self.builder;
        const v903 = v902.push(obj);
        v903;
    } else {
        const v904 = {};
        v904.cmd = cmd;
        v904.priority = priority;
        CACHE[cmd] = v904;
        const v905 = self.builder;
        const v906 = CACHE[cmd];
        const v907 = v905.push(v906);
        v907;
    }
    return self;
};
ImageProto.push = v908;
const v911 = function (type) {
    var self = this;
    const v909 = type[0];
    const v910 = v909 === '.';
    if (v910) {
        type = type.substring(1);
    }
    self.outputType = type;
    return self;
};
ImageProto.output = v911;
const v920 = function (w, h, options) {
    options = options || '';
    var self = this;
    var size = '';
    const v912 = w && h;
    if (v912) {
        const v913 = w + 'x';
        size = v913 + h;
    } else {
        const v914 = !h;
        const v915 = w && v914;
        if (v915) {
            size = w + 'x';
        } else {
            const v916 = !w;
            const v917 = v916 && h;
            if (v917) {
                size = 'x' + h;
            }
        }
    }
    const v918 = size + options;
    const v919 = self.push('-resize', v918, 1, true);
    return v919;
};
ImageProto.resize = v920;
const v929 = function (w, h, options) {
    options = options || '';
    var self = this;
    var size = '';
    const v921 = w && h;
    if (v921) {
        const v922 = w + 'x';
        size = v922 + h;
    } else {
        const v923 = !h;
        const v924 = w && v923;
        if (v924) {
            size = w;
        } else {
            const v925 = !w;
            const v926 = v925 && h;
            if (v926) {
                size = 'x' + h;
            }
        }
    }
    const v927 = size + options;
    const v928 = self.push('-thumbnail', v927, 1, true);
    return v928;
};
ImageProto.thumbnail = v929;
const v938 = function (w, h, options) {
    options = options || '';
    var self = this;
    var size = '';
    const v930 = w && h;
    if (v930) {
        const v931 = w + 'x';
        size = v931 + h;
    } else {
        const v932 = !h;
        const v933 = w && v932;
        if (v933) {
            size = w;
        } else {
            const v934 = !w;
            const v935 = v934 && h;
            if (v935) {
                size = 'x' + h;
            }
        }
    }
    const v936 = size + options;
    const v937 = self.push('-geometry', v936, 1, true);
    return v937;
};
ImageProto.geometry = v938;
const v940 = function (type) {
    const v939 = this.push('-filter', type, 1, true);
    return v939;
};
ImageProto.filter = v940;
const v942 = function () {
    const v941 = this.push('-trim +repage', 1);
    return v941;
};
ImageProto.trim = v942;
const v946 = function (type, value) {
    this.islimit = true;
    const v943 = type + ' ';
    const v944 = v943 + value;
    const v945 = this.push('-limit', v944, 1);
    return v945;
};
ImageProto.limit = v946;
const v965 = function (w, h, x, y) {
    var self = this;
    var size = '';
    const v947 = w && h;
    if (v947) {
        const v948 = w + 'x';
        size = v948 + h;
    } else {
        const v949 = !h;
        const v950 = w && v949;
        if (v950) {
            size = w;
        } else {
            const v951 = !w;
            const v952 = v951 && h;
            if (v952) {
                size = 'x' + h;
            }
        }
    }
    const v953 = x || y;
    if (v953) {
        const v954 = !x;
        const v955 = v954 && (x = 0);
        v955;
        const v956 = !y;
        const v957 = v956 && (y = 0);
        v957;
        const v958 = x >= 0;
        let v959;
        if (v958) {
            v959 = '+';
        } else {
            v959 = '';
        }
        const v960 = v959 + x;
        const v961 = y >= 0;
        let v962;
        if (v961) {
            v962 = '+';
        } else {
            v962 = '';
        }
        const v963 = v960 + v962;
        size += v963 + y;
    }
    const v964 = self.push('-extent', size, 4, true);
    return v964;
};
ImageProto.extent = v965;
const v973 = function (w, h, color, filter) {
    const v966 = filter || 'Hamming';
    const v967 = this.filter(v966);
    const v968 = v967.thumbnail(w, h);
    let v969;
    if (color) {
        v969 = color;
    } else {
        v969 = 'white';
    }
    const v970 = v968.background(v969);
    const v971 = v970.align('center');
    const v972 = v971.extent(w, h);
    return v972;
};
ImageProto.miniature = v973;
const v979 = function (w, h, color) {
    const v974 = this.resize(w, h, '^');
    let v975;
    if (color) {
        v975 = color;
    } else {
        v975 = 'white';
    }
    const v976 = v974.background(v975);
    const v977 = v976.align('center');
    const v978 = v977.crop(w, h);
    return v978;
};
ImageProto.resize_center = v979;
ImageProto.resizeCenter = ImageProto.resize_center;
const v986 = function (w, h, align, color) {
    const v980 = this.resize(w, h, '^');
    let v981;
    if (color) {
        v981 = color;
    } else {
        v981 = 'white';
    }
    const v982 = v980.background(v981);
    const v983 = align || 'center';
    const v984 = v982.align(v983);
    const v985 = v984.crop(w, h);
    return v985;
};
ImageProto.resize_align = v986;
ImageProto.resizeAlign = ImageProto.resize_align;
const v995 = function (w, h, options) {
    options = options || '';
    var self = this;
    var size = '';
    const v987 = w && h;
    if (v987) {
        const v988 = w + 'x';
        size = v988 + h;
    } else {
        const v989 = !h;
        const v990 = w && v989;
        if (v990) {
            size = w;
        } else {
            const v991 = !w;
            const v992 = v991 && h;
            if (v992) {
                size = 'x' + h;
            }
        }
    }
    const v993 = size + options;
    const v994 = self.push('-scale', v993, 1, true);
    return v994;
};
ImageProto.scale = v995;
const v1005 = function (w, h, x, y) {
    const v996 = w + 'x';
    const v997 = v996 + h;
    const v998 = v997 + '+';
    const v999 = x || 0;
    const v1000 = v998 + v999;
    const v1001 = v1000 + '+';
    const v1002 = y || 0;
    const v1003 = v1001 + v1002;
    const v1004 = this.push('-crop', v1003, 4, true);
    return v1004;
};
ImageProto.crop = v1005;
const v1008 = function (percentage) {
    const v1006 = percentage || 80;
    const v1007 = this.push('-quality', v1006, 5, true);
    return v1007;
};
ImageProto.quality = v1008;
const v1011 = function (type) {
    var output;
    switch (type) {
    case 'left top':
    case 'top left':
        output = 'NorthWest';
        break;
    case 'left bottom':
    case 'bottom left':
        output = 'SouthWest';
        break;
    case 'right top':
    case 'top right':
        output = 'NorthEast';
        break;
    case 'right bottom':
    case 'bottom right':
        output = 'SouthEast';
        break;
    case 'left center':
    case 'center left':
    case 'left':
        output = 'West';
        break;
    case 'right center':
    case 'center right':
    case 'right':
        output = 'East';
        break;
    case 'bottom center':
    case 'center bottom':
    case 'bottom':
        output = 'South';
        break;
    case 'top center':
    case 'center top':
    case 'top':
        output = 'North';
        break;
    case 'center center':
    case 'center':
    case 'middle':
        output = 'Center';
        break;
    default:
        output = type;
        break;
    }
    const v1009 = this.push('-gravity', output, 3, true);
    const v1010 = output && v1009;
    v1010;
    return this;
};
ImageProto.align = v1011;
const v1013 = function (type) {
    const v1012 = this.align(type);
    return v1012;
};
ImageProto.gravity = v1013;
const v1015 = function (radius) {
    const v1014 = this.push('-blur', radius, 10, true);
    return v1014;
};
ImageProto.blur = v1015;
const v1017 = function () {
    const v1016 = this.push('-normalize', null, 10);
    return v1016;
};
ImageProto.normalize = v1017;
const v1020 = function (deg) {
    const v1018 = deg || 0;
    const v1019 = this.push('-rotate', v1018, 8, true);
    return v1019;
};
ImageProto.rotate = v1020;
const v1022 = function () {
    const v1021 = this.push('-flip', null, 10);
    return v1021;
};
ImageProto.flip = v1022;
const v1024 = function () {
    const v1023 = this.push('-flop', null, 10);
    return v1023;
};
ImageProto.flop = v1024;
const v1026 = function (value) {
    const v1025 = this.push('-define', value, 10, true);
    return v1025;
};
ImageProto.define = v1026;
const v1028 = function () {
    const v1027 = this.push('+profile', '*', null, 10, true);
    return v1027;
};
ImageProto.minify = v1028;
const v1030 = function () {
    const v1029 = this.push('-colorspace', 'Gray', 10, true);
    return v1029;
};
ImageProto.grayscale = v1030;
const v1032 = function (value) {
    const v1031 = this.push('-depth', value, 10, true);
    return v1031;
};
ImageProto.bitdepth = v1032;
const v1034 = function (value) {
    const v1033 = this.push('-colors', value, 10, true);
    return v1033;
};
ImageProto.colors = v1034;
const v1037 = function (color) {
    const v1035 = this.push('-background', color, 2, true);
    const v1036 = v1035.push('-extent 0x0', null, 2);
    return v1036;
};
ImageProto.background = v1037;
const v1039 = function (color) {
    const v1038 = this.push('-fill', color, 2, true);
    return v1038;
};
ImageProto.fill = v1039;
const v1042 = function () {
    const v1040 = this.push('-modulate', '115,0,100', 4);
    const v1041 = v1040.push('-colorize', '7,21,50', 5);
    return v1041;
};
ImageProto.sepia = v1042;
const v1049 = function (filename, x, y, w, h) {
    const v1043 = x || 0;
    const v1044 = y || 0;
    const v1045 = w || 0;
    const v1046 = h || 0;
    const v1047 = 'image over {1},{2} {3},{4} {5}{0}{5}'.format(filename, v1043, v1044, v1045, v1046, D);
    const v1048 = this.push('-draw', v1047, 6, true);
    return v1048;
};
ImageProto.watermark = v1049;
const v1051 = function (fn) {
    const v1050 = fn.call(this, this);
    v1050;
    return this;
};
ImageProto.make = v1051;
const v1055 = function (key, value, priority, esc) {
    const v1052 = priority === true;
    if (v1052) {
        priority = 0;
        esc = true;
    }
    const v1053 = priority || 10;
    const v1054 = this.push(key, value, v1053, esc);
    return v1054;
};
ImageProto.command = v1055;
const wrap = function (command, empty) {
    let v1056;
    if (empty) {
        v1056 = ' ';
    } else {
        v1056 = '';
    }
    const v1057 = command === '-';
    const v1058 = command.replace(REGEXP_ESCAPE, '');
    const v1059 = D + v1058;
    const v1060 = v1059 + D;
    let v1061;
    if (v1057) {
        v1061 = command;
    } else {
        v1061 = v1060;
    }
    const v1062 = v1056 + v1061;
    return v1062;
};
exports.Image = Image;
exports.Picture = Image;
const v1064 = function (filename, cmd, width, height) {
    const v1063 = new Image(filename, cmd, width, height);
    return v1063;
};
exports.init = v1064;
const v1066 = function (filename, cmd, width, height) {
    const v1065 = new Image(filename, cmd, width, height);
    return v1065;
};
exports.load = v1066;
const v1069 = function (type, fn) {
    const v1067 = type[0];
    const v1068 = v1067 === '.';
    if (v1068) {
        type = type.substring(1);
    }
    middlewares[type] = fn;
};
exports.middleware = v1069;
const v1070 = function () {
    CACHE = {};
};
exports.clear = v1070;
global.Image = exports;