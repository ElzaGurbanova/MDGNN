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
const v533 = require('os');
const v534 = v533.platform();
const v535 = v534.substring(0, 3);
const v536 = v535.toLowerCase();
const v537 = v536 === 'win';
if (v537) {
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
var CACHE = {};
var middlewares = {};
const v538 = global.framework_utils;
const v539 = !v538;
if (v539) {
    const v540 = require('./utils');
    global.framework_utils = v540;
}
const u16 = function (buf, o) {
    const v541 = buf[o];
    const v542 = v541 << 8;
    const v543 = o + 1;
    const v544 = buf[v543];
    const v545 = v542 | v544;
    return v545;
};
const u32 = function (buf, o) {
    const v546 = buf[o];
    const v547 = v546 << 24;
    const v548 = o + 1;
    const v549 = buf[v548];
    const v550 = v549 << 16;
    const v551 = v547 | v550;
    const v552 = o + 2;
    const v553 = buf[v552];
    const v554 = v553 << 8;
    const v555 = v551 | v554;
    const v556 = o + 3;
    const v557 = buf[v556];
    const v558 = v555 | v557;
    return v558;
};
const v562 = function (buffer) {
    const v559 = buffer[6];
    const v560 = buffer[8];
    const v561 = {};
    v561.width = v559;
    v561.height = v560;
    return v561;
};
exports.measureGIF = v562;
const v582 = function (buffer) {
    var len = buffer.length;
    var o = 0;
    const v563 = buffer[0];
    const v564 = 255 == v563;
    const v565 = buffer[1];
    const v566 = 216 == v565;
    var jpeg = v564 && v566;
    if (jpeg) {
        o += 2;
        let v567 = o < len;
        while (v567) {
            const v568 = buffer[o];
            let v569 = 255 != v568;
            while (v569) {
                const v570 = o++;
                v570;
                v569 = 255 != v568;
            }
            const v571 = buffer[o];
            let v572 = 255 == v571;
            while (v572) {
                const v573 = o++;
                v573;
                v572 = 255 == v571;
            }
            const v574 = buffer[o];
            const v575 = sof[v574];
            if (v575) {
                const v576 = o + 6;
                const v577 = u16(buffer, v576);
                const v578 = o + 4;
                const v579 = u16(buffer, v578);
                const v580 = {};
                v580.width = v577;
                v580.height = v579;
                return v580;
            } else {
                const v581 = ++o;
                o += u16(buffer, v581);
            }
            v567 = o < len;
        }
    }
    return null;
};
exports.measureJPG = v582;
const v587 = function (buffer) {
    const v583 = u32(buffer, 16);
    const v584 = 16 + 4;
    const v585 = u32(buffer, v584);
    const v586 = {};
    v586.width = v583;
    v586.height = v585;
    return v586;
};
exports.measurePNG = v587;
const v602 = function (buffer) {
    const v588 = buffer.toString('utf8');
    var match = v588.match(REGEXP_SVG);
    const v589 = !match;
    if (v589) {
        return;
    }
    var width = 0;
    var height = 0;
    var i = 0;
    var length = match.length;
    let v590 = i < length;
    while (v590) {
        var value = match[i];
        const v592 = width > 0;
        const v593 = height > 0;
        const v594 = v592 && v593;
        if (v594) {
            break;
        }
        const v595 = !width;
        const v596 = value.startsWith('width="');
        const v597 = v595 && v596;
        if (v597) {
            width = value.parseInt2();
        }
        const v598 = !height;
        const v599 = value.startsWith('height="');
        const v600 = v598 && v599;
        if (v600) {
            height = value.parseInt2();
        }
        const v591 = i++;
        v590 = i < length;
    }
    const v601 = {};
    v601.width = width;
    v601.height = height;
    return v601;
};
exports.measureSVG = v602;
const v607 = function (type, buffer) {
    switch (type) {
    case '.jpg':
    case '.jpeg':
    case 'jpg':
    case 'jpeg':
    case 'image/jpeg':
        const v603 = exports.measureJPG(buffer);
        return v603;
    case '.gif':
    case 'gif':
    case 'image/gif':
        const v604 = exports.measureGIF(buffer);
        return v604;
    case '.png':
    case 'png':
    case 'image/png':
        const v605 = exports.measurePNG(buffer);
        return v605;
    case '.svg':
    case 'svg':
    case 'image/svg+xml':
        const v606 = exports.measureSVG(buffer);
        return v606;
    }
};
exports.measure = v607;
const Image = function (filename, cmd, width, height) {
    const v608 = typeof filename;
    var type = v608;
    this.width = width;
    this.height = height;
    this.builder = [];
    const v609 = type === 'string';
    let v610;
    if (v609) {
        v610 = filename;
    } else {
        v610 = null;
    }
    this.filename = v610;
    const v611 = type === 'object';
    let v612;
    if (v611) {
        v612 = filename;
    } else {
        v612 = null;
    }
    this.currentStream = v612;
    const v613 = type === 'string';
    const v614 = framework_utils.getExtension(filename);
    let v615;
    if (v613) {
        v615 = v614;
    } else {
        v615 = 'jpg';
    }
    this.outputType = v615;
    this.islimit = false;
    const v616 = CONF.default_image_converter;
    this.cmdarg = cmd || v616;
};
var ImageProto = Image.prototype;
const v617 = function () {
    var self = this;
    self.builder = [];
    return self;
};
ImageProto.clear = v617;
const v649 = function (callback) {
    var self = this;
    const v618 = self.filename;
    var index = v618.lastIndexOf('.');
    const v619 = self.filename;
    const v620 = !v619;
    if (v620) {
        const v621 = new Error('Measure does not support stream.');
        const v622 = callback(v621);
        v622;
        return;
    }
    const v623 = -1;
    const v624 = index === v623;
    if (v624) {
        const v625 = new Error('This type of file is not supported.');
        const v626 = callback(v625);
        v626;
        return;
    }
    const v627 = F.stats;
    const v628 = v627.performance;
    const v629 = v628.open;
    const v630 = v629++;
    v630;
    const v631 = self.filename;
    const v632 = v631.substring(index);
    var extension = v632.toLowerCase();
    const v633 = require('fs');
    const v634 = self.filename;
    const v635 = extension === '.jpg';
    let v636;
    if (v635) {
        v636 = 40000;
    } else {
        v636 = 24;
    }
    const v637 = {
        start: 0,
        end: v636
    };
    var stream = v633.createReadStream(v634, v637);
    const v646 = function (buffer) {
        switch (extension) {
        case '.jpg':
            const v638 = exports.measureJPG(buffer);
            const v639 = callback(null, v638);
            v639;
            return;
        case '.gif':
            const v640 = exports.measureGIF(buffer);
            const v641 = callback(null, v640);
            v641;
            return;
        case '.png':
            const v642 = exports.measurePNG(buffer);
            const v643 = callback(null, v642);
            v643;
            return;
        }
        const v644 = new Error('This type of file is not supported.');
        const v645 = callback(v644);
        v645;
    };
    const v647 = stream.on('data', v646);
    v647;
    const v648 = stream.on('error', callback);
    v648;
    return self;
};
ImageProto.measure = v649;
const v652 = function () {
    var self = this;
    const v651 = function (callback) {
        const v650 = self.measure(callback);
        v650;
    };
    return v651;
};
ImageProto.$$measure = v652;
const v702 = function (filename, callback, writer) {
    var self = this;
    const v653 = typeof filename;
    const v654 = v653 === 'function';
    if (v654) {
        callback = filename;
        filename = null;
    }
    const v655 = self.builder;
    const v656 = v655.length;
    const v657 = !v656;
    const v658 = self.minify();
    const v659 = v657 && v658;
    v659;
    const v660 = self.filename;
    const v661 = filename || v660;
    filename = v661 || '';
    const v662 = self.filename;
    const v663 = self.filename;
    let v664;
    if (v662) {
        v664 = v663;
    } else {
        v664 = '-';
    }
    var command = self.cmd(v664, filename);
    const v665 = F.isWindows;
    if (v665) {
        command = command.replace(REGEXP_PATH, '\\');
    }
    const v687 = function (err) {
        const v666 = cmd.kill();
        v666;
        cmd = null;
        const v667 = self.clear();
        v667;
        const v668 = !callback;
        if (v668) {
            return;
        }
        if (err) {
            const v669 = callback(err, false);
            v669;
            return;
        }
        const v670 = self.outputType;
        var middleware = middlewares[v670];
        const v671 = !middleware;
        if (v671) {
            const v672 = callback(null, true);
            return v672;
        }
        const v673 = F.stats;
        const v674 = v673.performance;
        const v675 = v674.open;
        const v676 = v675++;
        v676;
        var reader = Fs.createReadStream(filename);
        const v677 = filename + '_';
        var writer = Fs.createWriteStream(v677);
        const v678 = middleware();
        const v679 = reader.pipe(v678);
        const v680 = v679.pipe(writer);
        v680;
        const v685 = () => {
            const v681 = filename + '_';
            const v683 = () => {
                const v682 = callback(null, true);
                return v682;
            };
            const v684 = Fs.rename(v681, filename, v683);
            return v684;
        };
        const v686 = writer.on('finish', v685);
        v686;
    };
    var cmd = exec(command, v687);
    const v688 = self.currentStream;
    if (v688) {
        const v689 = self.currentStream;
        const v690 = v689 instanceof Buffer;
        if (v690) {
            const v691 = cmd.stdin;
            const v692 = self.currentStream;
            const v693 = v691.end(v692);
            v693;
        } else {
            const v694 = self.currentStream;
            const v695 = cmd.stdin;
            const v696 = v694.pipe(v695);
            v696;
        }
    }
    const v697 = cmd.stdin;
    const v698 = CLEANUP(v697);
    v698;
    const v699 = cmd.stdin;
    const v700 = writer(v699);
    const v701 = writer && v700;
    v701;
    return self;
};
ImageProto.save = v702;
const v705 = function (filename, writer) {
    var self = this;
    const v704 = function (callback) {
        const v703 = self.save(filename, callback, writer);
        v703;
    };
    return v704;
};
ImageProto.$$save = v705;
const v759 = function (stream, type, options) {
    var self = this;
    const v706 = typeof type;
    const v707 = v706 === 'object';
    if (v707) {
        options = type;
        type = null;
    }
    const v708 = self.builder;
    const v709 = v708.length;
    const v710 = !v709;
    const v711 = self.minify();
    const v712 = v710 && v711;
    v712;
    const v713 = !type;
    const v714 = v713 && (type = self.outputType);
    v714;
    const v715 = F.stats;
    const v716 = v715.performance;
    const v717 = v716.open;
    const v718 = v717++;
    v718;
    const v719 = self.cmdarg;
    const v720 = CMD_CONVERT[v719];
    const v721 = self.filename;
    const v722 = self.filename;
    const v723 = wrap(v722);
    let v724;
    if (v721) {
        v724 = v723;
    } else {
        v724 = '-';
    }
    const v725 = type + ':';
    let v726;
    if (type) {
        v726 = v725;
    } else {
        v726 = '';
    }
    const v727 = v726 + '-';
    const v728 = self.arg(v724, v727);
    var cmd = spawn(v720, v728, SPAWN_OPT);
    const v729 = cmd.stderr;
    const v730 = stream.emit;
    const v731 = v730.bind(stream, 'error');
    const v732 = v729.on('data', v731);
    v732;
    const v733 = cmd.stdout;
    const v734 = stream.emit;
    const v735 = v734.bind(stream, 'data');
    const v736 = v733.on('data', v735);
    v736;
    const v737 = cmd.stdout;
    const v738 = stream.emit;
    const v739 = v738.bind(stream, 'end');
    const v740 = v737.on('end', v739);
    v740;
    const v741 = stream.emit;
    const v742 = v741.bind(stream, 'error');
    const v743 = cmd.on('error', v742);
    v743;
    var middleware = middlewares[type];
    if (middleware) {
        const v744 = cmd.stdout;
        const v745 = middleware();
        const v746 = v744.pipe(v745);
        const v747 = v746.pipe(stream, options);
        v747;
    } else {
        const v748 = cmd.stdout;
        const v749 = v748.pipe(stream, options);
        v749;
    }
    const v750 = self.currentStream;
    if (v750) {
        const v751 = self.currentStream;
        const v752 = v751 instanceof Buffer;
        if (v752) {
            const v753 = cmd.stdin;
            const v754 = self.currentStream;
            const v755 = v753.end(v754);
            v755;
        } else {
            const v756 = self.currentStream;
            const v757 = cmd.stdin;
            const v758 = v756.pipe(v757);
            v758;
        }
    }
    return self;
};
ImageProto.pipe = v759;
const v797 = function (type, writer) {
    var self = this;
    const v760 = self.builder;
    const v761 = v760.length;
    const v762 = !v761;
    const v763 = self.minify();
    const v764 = v762 && v763;
    v764;
    const v765 = !type;
    if (v765) {
        type = self.outputType;
    }
    const v766 = F.stats;
    const v767 = v766.performance;
    const v768 = v767.open;
    const v769 = v768++;
    v769;
    const v770 = self.cmdarg;
    const v771 = CMD_CONVERT[v770];
    const v772 = self.filename;
    const v773 = self.filename;
    const v774 = wrap(v773);
    let v775;
    if (v772) {
        v775 = v774;
    } else {
        v775 = '-';
    }
    const v776 = type + ':';
    let v777;
    if (type) {
        v777 = v776;
    } else {
        v777 = '';
    }
    const v778 = v777 + '-';
    const v779 = self.arg(v775, v778);
    var cmd = spawn(v771, v779, SPAWN_OPT);
    const v780 = self.currentStream;
    if (v780) {
        const v781 = self.currentStream;
        const v782 = v781 instanceof Buffer;
        if (v782) {
            const v783 = cmd.stdin;
            const v784 = self.currentStream;
            const v785 = v783.end(v784);
            v785;
        } else {
            const v786 = self.currentStream;
            const v787 = cmd.stdin;
            const v788 = v786.pipe(v787);
            v788;
        }
    }
    const v789 = cmd.stdin;
    const v790 = writer(v789);
    const v791 = writer && v790;
    v791;
    var middleware = middlewares[type];
    const v792 = cmd.stdout;
    const v793 = middleware();
    const v794 = v792.pipe(v793);
    const v795 = cmd.stdout;
    let v796;
    if (middleware) {
        v796 = v794;
    } else {
        v796 = v795;
    }
    return v796;
};
ImageProto.stream = v797;
const v823 = function (filenameFrom, filenameTo) {
    var self = this;
    var cmd = '';
    const v798 = self.islimit;
    const v799 = !v798;
    if (v799) {
        var tmp = CONF.default_image_consumption;
        if (tmp) {
            const v800 = 1500 / 100;
            const v801 = v800 * tmp;
            const v802 = self.limit('memory', v801);
            v802;
            const v803 = 3000 / 100;
            const v804 = v803 * tmp;
            const v805 = self.limit('map', v804);
            v805;
        }
    }
    const v806 = self.builder;
    const v807 = v806.sort(sort);
    v807;
    const v808 = self.builder;
    var length = v808.length;
    var i = 0;
    let v809 = i < length;
    while (v809) {
        let v811;
        if (cmd) {
            v811 = ' ';
        } else {
            v811 = '';
        }
        const v812 = self.builder;
        const v813 = v812[i];
        const v814 = v813.cmd;
        cmd += v811 + v814;
        const v810 = i++;
        v809 = i < length;
    }
    const v815 = self.cmdarg;
    const v816 = CMD_CONVERT2[v815];
    const v817 = wrap(filenameFrom, true);
    const v818 = v816 + v817;
    const v819 = v818 + ' ';
    const v820 = v819 + cmd;
    const v821 = wrap(filenameTo, true);
    const v822 = v820 + v821;
    return v822;
};
ImageProto.cmd = v823;
const sort = function (a, b) {
    const v824 = a.priority;
    const v825 = b.priority;
    const v826 = v824 > v825;
    const v827 = -1;
    let v828;
    if (v826) {
        v828 = 1;
    } else {
        v828 = v827;
    }
    return v828;
};
const v863 = function (first, last) {
    var self = this;
    var arr = [];
    const v829 = self.cmdarg;
    const v830 = v829 === 'gm';
    if (v830) {
        const v831 = arr.push('convert');
        v831;
    }
    const v832 = arr.push(first);
    const v833 = first && v832;
    v833;
    const v834 = self.islimit;
    const v835 = !v834;
    if (v835) {
        var tmp = CONF.default_image_consumption;
        if (tmp) {
            const v836 = 1500 / 100;
            const v837 = v836 * tmp;
            const v838 = self.limit('memory', v837);
            v838;
            const v839 = 3000 / 100;
            const v840 = v839 * tmp;
            const v841 = self.limit('map', v840);
            v841;
        }
    }
    const v842 = self.builder;
    const v843 = v842.sort(sort);
    v843;
    const v844 = self.builder;
    var length = v844.length;
    var i = 0;
    let v845 = i < length;
    while (v845) {
        const v847 = self.builder;
        var o = v847[i];
        const v848 = o.cmd;
        var index = v848.indexOf(' ');
        const v849 = -1;
        const v850 = index === v849;
        if (v850) {
            const v851 = o.cmd;
            const v852 = arr.push(v851);
            v852;
        } else {
            const v853 = o.cmd;
            const v854 = v853.substring(0, index);
            const v855 = arr.push(v854);
            v855;
            const v856 = o.cmd;
            const v857 = index + 1;
            const v858 = v856.substring(v857);
            const v859 = v858.replace(/"/g, '');
            const v860 = arr.push(v859);
            v860;
        }
        const v846 = i++;
        v845 = i < length;
    }
    const v861 = arr.push(last);
    const v862 = last && v861;
    v862;
    return arr;
};
ImageProto.arg = v863;
const v885 = function (callback) {
    var self = this;
    const v864 = F.stats;
    const v865 = v864.performance;
    const v866 = v865.open;
    const v867 = v866++;
    v867;
    const v868 = self.cmdarg;
    const v869 = v868 === 'gm';
    let v870;
    if (v869) {
        v870 = 'gm ';
    } else {
        v870 = '';
    }
    const v871 = v870 + 'identify';
    const v872 = self.filename;
    const v873 = wrap(v872, true);
    const v874 = v871 + v873;
    const v883 = function (err, stdout) {
        if (err) {
            const v875 = callback(err, null);
            v875;
            return;
        }
        var arr = stdout.split(' ');
        const v876 = arr[2];
        var size = v876.split('x');
        const v877 = arr[1];
        const v878 = size[0];
        const v879 = framework_utils.parseInt(v878);
        const v880 = size[1];
        const v881 = framework_utils.parseInt(v880);
        var obj = {};
        obj.type = v877;
        obj.width = v879;
        obj.height = v881;
        const v882 = callback(null, obj);
        v882;
    };
    const v884 = exec(v874, v883);
    v884;
    return self;
};
ImageProto.identify = v885;
const v888 = function () {
    var self = this;
    const v887 = function (callback) {
        const v886 = self.identify(callback);
        v886;
    };
    return v887;
};
ImageProto.$$identify = v888;
const v902 = function (key, value, priority, encode) {
    var self = this;
    var cmd = key;
    const v889 = value != null;
    if (v889) {
        const v890 = typeof value;
        const v891 = v890 === 'string';
        const v892 = encode && v891;
        if (v892) {
            const v893 = ' ' + D;
            const v894 = value.replace(REGEXP_ESCAPE, '');
            const v895 = v893 + v894;
            cmd += v895 + D;
        } else {
            cmd += ' ' + value;
        }
    }
    var obj = CACHE[cmd];
    if (obj) {
        obj.priority = priority;
        const v896 = self.builder;
        const v897 = v896.push(obj);
        v897;
    } else {
        const v898 = {};
        v898.cmd = cmd;
        v898.priority = priority;
        CACHE[cmd] = v898;
        const v899 = self.builder;
        const v900 = CACHE[cmd];
        const v901 = v899.push(v900);
        v901;
    }
    return self;
};
ImageProto.push = v902;
const v905 = function (type) {
    var self = this;
    const v903 = type[0];
    const v904 = v903 === '.';
    if (v904) {
        type = type.substring(1);
    }
    self.outputType = type;
    return self;
};
ImageProto.output = v905;
const v914 = function (w, h, options) {
    options = options || '';
    var self = this;
    var size = '';
    const v906 = w && h;
    if (v906) {
        const v907 = w + 'x';
        size = v907 + h;
    } else {
        const v908 = !h;
        const v909 = w && v908;
        if (v909) {
            size = w + 'x';
        } else {
            const v910 = !w;
            const v911 = v910 && h;
            if (v911) {
                size = 'x' + h;
            }
        }
    }
    const v912 = size + options;
    const v913 = self.push('-resize', v912, 1, true);
    return v913;
};
ImageProto.resize = v914;
const v923 = function (w, h, options) {
    options = options || '';
    var self = this;
    var size = '';
    const v915 = w && h;
    if (v915) {
        const v916 = w + 'x';
        size = v916 + h;
    } else {
        const v917 = !h;
        const v918 = w && v917;
        if (v918) {
            size = w;
        } else {
            const v919 = !w;
            const v920 = v919 && h;
            if (v920) {
                size = 'x' + h;
            }
        }
    }
    const v921 = size + options;
    const v922 = self.push('-thumbnail', v921, 1, true);
    return v922;
};
ImageProto.thumbnail = v923;
const v932 = function (w, h, options) {
    options = options || '';
    var self = this;
    var size = '';
    const v924 = w && h;
    if (v924) {
        const v925 = w + 'x';
        size = v925 + h;
    } else {
        const v926 = !h;
        const v927 = w && v926;
        if (v927) {
            size = w;
        } else {
            const v928 = !w;
            const v929 = v928 && h;
            if (v929) {
                size = 'x' + h;
            }
        }
    }
    const v930 = size + options;
    const v931 = self.push('-geometry', v930, 1, true);
    return v931;
};
ImageProto.geometry = v932;
const v934 = function (type) {
    const v933 = this.push('-filter', type, 1, true);
    return v933;
};
ImageProto.filter = v934;
const v936 = function () {
    const v935 = this.push('-trim +repage', 1);
    return v935;
};
ImageProto.trim = v936;
const v940 = function (type, value) {
    this.islimit = true;
    const v937 = type + ' ';
    const v938 = v937 + value;
    const v939 = this.push('-limit', v938, 1);
    return v939;
};
ImageProto.limit = v940;
const v959 = function (w, h, x, y) {
    var self = this;
    var size = '';
    const v941 = w && h;
    if (v941) {
        const v942 = w + 'x';
        size = v942 + h;
    } else {
        const v943 = !h;
        const v944 = w && v943;
        if (v944) {
            size = w;
        } else {
            const v945 = !w;
            const v946 = v945 && h;
            if (v946) {
                size = 'x' + h;
            }
        }
    }
    const v947 = x || y;
    if (v947) {
        const v948 = !x;
        const v949 = v948 && (x = 0);
        v949;
        const v950 = !y;
        const v951 = v950 && (y = 0);
        v951;
        const v952 = x >= 0;
        let v953;
        if (v952) {
            v953 = '+';
        } else {
            v953 = '';
        }
        const v954 = v953 + x;
        const v955 = y >= 0;
        let v956;
        if (v955) {
            v956 = '+';
        } else {
            v956 = '';
        }
        const v957 = v954 + v956;
        size += v957 + y;
    }
    const v958 = self.push('-extent', size, 4, true);
    return v958;
};
ImageProto.extent = v959;
const v967 = function (w, h, color, filter) {
    const v960 = filter || 'Hamming';
    const v961 = this.filter(v960);
    const v962 = v961.thumbnail(w, h);
    let v963;
    if (color) {
        v963 = color;
    } else {
        v963 = 'white';
    }
    const v964 = v962.background(v963);
    const v965 = v964.align('center');
    const v966 = v965.extent(w, h);
    return v966;
};
ImageProto.miniature = v967;
const v973 = function (w, h, color) {
    const v968 = this.resize(w, h, '^');
    let v969;
    if (color) {
        v969 = color;
    } else {
        v969 = 'white';
    }
    const v970 = v968.background(v969);
    const v971 = v970.align('center');
    const v972 = v971.crop(w, h);
    return v972;
};
ImageProto.resize_center = v973;
ImageProto.resizeCenter = ImageProto.resize_center;
const v980 = function (w, h, align, color) {
    const v974 = this.resize(w, h, '^');
    let v975;
    if (color) {
        v975 = color;
    } else {
        v975 = 'white';
    }
    const v976 = v974.background(v975);
    const v977 = align || 'center';
    const v978 = v976.align(v977);
    const v979 = v978.crop(w, h);
    return v979;
};
ImageProto.resize_align = v980;
ImageProto.resizeAlign = ImageProto.resize_align;
const v989 = function (w, h, options) {
    options = options || '';
    var self = this;
    var size = '';
    const v981 = w && h;
    if (v981) {
        const v982 = w + 'x';
        size = v982 + h;
    } else {
        const v983 = !h;
        const v984 = w && v983;
        if (v984) {
            size = w;
        } else {
            const v985 = !w;
            const v986 = v985 && h;
            if (v986) {
                size = 'x' + h;
            }
        }
    }
    const v987 = size + options;
    const v988 = self.push('-scale', v987, 1, true);
    return v988;
};
ImageProto.scale = v989;
const v999 = function (w, h, x, y) {
    const v990 = w + 'x';
    const v991 = v990 + h;
    const v992 = v991 + '+';
    const v993 = x || 0;
    const v994 = v992 + v993;
    const v995 = v994 + '+';
    const v996 = y || 0;
    const v997 = v995 + v996;
    const v998 = this.push('-crop', v997, 4, true);
    return v998;
};
ImageProto.crop = v999;
const v1002 = function (percentage) {
    const v1000 = percentage || 80;
    const v1001 = this.push('-quality', v1000, 5, true);
    return v1001;
};
ImageProto.quality = v1002;
const v1005 = function (type) {
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
    const v1003 = this.push('-gravity', output, 3, true);
    const v1004 = output && v1003;
    v1004;
    return this;
};
ImageProto.align = v1005;
const v1007 = function (type) {
    const v1006 = this.align(type);
    return v1006;
};
ImageProto.gravity = v1007;
const v1009 = function (radius) {
    const v1008 = this.push('-blur', radius, 10, true);
    return v1008;
};
ImageProto.blur = v1009;
const v1011 = function () {
    const v1010 = this.push('-normalize', null, 10);
    return v1010;
};
ImageProto.normalize = v1011;
const v1014 = function (deg) {
    const v1012 = deg || 0;
    const v1013 = this.push('-rotate', v1012, 8, true);
    return v1013;
};
ImageProto.rotate = v1014;
const v1016 = function () {
    const v1015 = this.push('-flip', null, 10);
    return v1015;
};
ImageProto.flip = v1016;
const v1018 = function () {
    const v1017 = this.push('-flop', null, 10);
    return v1017;
};
ImageProto.flop = v1018;
const v1020 = function (value) {
    const v1019 = this.push('-define', value, 10, true);
    return v1019;
};
ImageProto.define = v1020;
const v1022 = function () {
    const v1021 = this.push('+profile', '*', null, 10, true);
    return v1021;
};
ImageProto.minify = v1022;
const v1024 = function () {
    const v1023 = this.push('-colorspace', 'Gray', 10, true);
    return v1023;
};
ImageProto.grayscale = v1024;
const v1026 = function (value) {
    const v1025 = this.push('-depth', value, 10, true);
    return v1025;
};
ImageProto.bitdepth = v1026;
const v1028 = function (value) {
    const v1027 = this.push('-colors', value, 10, true);
    return v1027;
};
ImageProto.colors = v1028;
const v1031 = function (color) {
    const v1029 = this.push('-background', color, 2, true);
    const v1030 = v1029.push('-extent 0x0', null, 2);
    return v1030;
};
ImageProto.background = v1031;
const v1033 = function (color) {
    const v1032 = this.push('-fill', color, 2, true);
    return v1032;
};
ImageProto.fill = v1033;
const v1036 = function () {
    const v1034 = this.push('-modulate', '115,0,100', 4);
    const v1035 = v1034.push('-colorize', '7,21,50', 5);
    return v1035;
};
ImageProto.sepia = v1036;
const v1043 = function (filename, x, y, w, h) {
    const v1037 = x || 0;
    const v1038 = y || 0;
    const v1039 = w || 0;
    const v1040 = h || 0;
    const v1041 = 'image over {1},{2} {3},{4} {5}{0}{5}'.format(filename, v1037, v1038, v1039, v1040, D);
    const v1042 = this.push('-draw', v1041, 6, true);
    return v1042;
};
ImageProto.watermark = v1043;
const v1045 = function (fn) {
    const v1044 = fn.call(this, this);
    v1044;
    return this;
};
ImageProto.make = v1045;
const v1049 = function (key, value, priority, esc) {
    const v1046 = priority === true;
    if (v1046) {
        priority = 0;
        esc = true;
    }
    const v1047 = priority || 10;
    const v1048 = this.push(key, value, v1047, esc);
    return v1048;
};
ImageProto.command = v1049;
const wrap = function (command, empty) {
    let v1050;
    if (empty) {
        v1050 = ' ';
    } else {
        v1050 = '';
    }
    const v1051 = command === '-';
    const v1052 = command.replace(REGEXP_ESCAPE, '');
    const v1053 = D + v1052;
    const v1054 = v1053 + D;
    let v1055;
    if (v1051) {
        v1055 = command;
    } else {
        v1055 = v1054;
    }
    const v1056 = v1050 + v1055;
    return v1056;
};
exports.Image = Image;
exports.Picture = Image;
const v1058 = function (filename, cmd, width, height) {
    const v1057 = new Image(filename, cmd, width, height);
    return v1057;
};
exports.init = v1058;
const v1060 = function (filename, cmd, width, height) {
    const v1059 = new Image(filename, cmd, width, height);
    return v1059;
};
exports.load = v1060;
const v1063 = function (type, fn) {
    const v1061 = type[0];
    const v1062 = v1061 === '.';
    if (v1062) {
        type = type.substring(1);
    }
    middlewares[type] = fn;
};
exports.middleware = v1063;
const v1064 = function () {
    CACHE = {};
};
exports.clear = v1064;
global.Image = exports;