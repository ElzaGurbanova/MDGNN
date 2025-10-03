var formidable = Npm.require('formidable');
var http = Npm.require('http');
var sys = Npm.require('util');
var url = Npm.require('url');
var path = Npm.require('path');
var fs = Npm.require('fs');
var Fiber = Npm.require('fibers');
const v429 = fs.existsSync;
const v430 = path.existsSync;
var _existsSync = v429 || v430;
var imageMagick = Npm.require('imagemagick');
const v431 = {};
v431.width = 200;
v431.height = 200;
const v432 = {};
v432.thumbnail = v431;
const v433 = function (fileInfo, formData) {
    return '';
};
const v435 = function (fileInfo, formData) {
    const v434 = fileInfo.name;
    return v434;
};
const v436 = function () {
};
const v437 = function () {
    return null;
};
const v438 = function () {
    return null;
};
const v439 = {};
v439.allowOrigin = '*';
v439.allowMethods = 'OPTIONS, HEAD, GET, POST, PUT, DELETE';
v439.allowHeaders = 'Content-Type, Content-Range, Content-Disposition';
const v440 = {};
v440['html'] = 'text/html';
v440['jpeg'] = 'image/jpeg';
v440['jpg'] = 'image/jpeg';
v440['png'] = 'image/png';
v440['gif'] = 'image/gif';
v440['js'] = 'text/javascript';
v440['css'] = 'text/css';
v440['pdf'] = 'application/pdf';
v440['doc'] = 'application/msword';
v440['docx'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
v440['zip'] = 'application/zip, application/x-compressed-zip';
v440['txt'] = 'text/plain';
var options = {};
options.tmpDir = null;
options.uploadDir = null;
options.uploadUrl = '/upload/';
options.checkCreateDirectories = false;
options.maxPostSize = 11000000000;
options.minFileSize = 1;
options.maxFileSize = 10000000000;
options.acceptFileTypes = /.+/i;
options.inlineFileTypes = /\.(gif|jpe?g|png)$/i;
options.imageTypes = /\.(gif|jpe?g|png)$/i;
options.imageVersions = v432;
options.crop = false;
options.overwrite = false;
options.cacheTime = 86400;
options.getDirectory = v433;
options.getFileName = v435;
options.finished = v436;
options.validateRequest = v437;
options.validateFile = v438;
options.accessControl = v439;
options.mimeTypes = v440;
const v441 = function () {
    return options;
};
const v522 = function (opts) {
    const v442 = opts.checkCreateDirectories;
    const v443 = v442 != null;
    if (v443) {
        const v444 = opts.checkCreateDirectories;
        options.checkCreateDirectories = v444;
    }
    const v445 = opts.tmpDir;
    const v446 = v445 == null;
    if (v446) {
        const v447 = new Meteor.Error('Temporary directory needs to be assigned!');
        throw v447;
    } else {
        const v448 = opts.tmpDir;
        options.tmpDir = v448;
    }
    const v449 = opts.cacheTime;
    const v450 = v449 != null;
    if (v450) {
        const v451 = opts.cacheTime;
        options.cacheTime = v451;
    }
    const v452 = opts.mimeTypes;
    const v453 = v452 != null;
    if (v453) {
        let key;
        const v454 = opts.mimeTypes;
        for (key in v454) {
            const v455 = options.mimeTypes;
            const v456 = opts.mimeTypes;
            const v457 = v456[key];
            v455[key] = v457;
        }
    }
    const v458 = opts.checkCreateDirectories;
    if (v458) {
        const v459 = options.tmpDir;
        const v460 = checkCreateDirectory(v459);
        v460;
    }
    const v461 = opts.uploadDir;
    const v462 = v461 == null;
    if (v462) {
        const v463 = new Meteor.Error('Upload directory needs to be assigned!');
        throw v463;
    } else {
        const v464 = opts.uploadDir;
        options.uploadDir = v464;
    }
    const v465 = opts.uploadUrl;
    if (v465) {
        const v466 = opts.uploadUrl;
        options.uploadUrl = v466;
    }
    const v467 = options.checkCreateDirectories;
    if (v467) {
        const v468 = options.uploadDir;
        const v469 = checkCreateDirectory(v468);
        v469;
    }
    const v470 = opts.maxPostSize;
    const v471 = v470 != null;
    if (v471) {
        const v472 = opts.maxPostSize;
        options.maxPostSize = v472;
    }
    const v473 = opts.minFileSize;
    const v474 = v473 != null;
    if (v474) {
        const v475 = opts.minFileSize;
        options.minFileSize = v475;
    }
    const v476 = opts.maxFileSize;
    const v477 = v476 != null;
    if (v477) {
        const v478 = opts.maxFileSize;
        options.maxFileSize = v478;
    }
    const v479 = opts.acceptFileTypes;
    const v480 = v479 != null;
    if (v480) {
        const v481 = opts.acceptFileTypes;
        options.acceptFileTypes = v481;
    }
    const v482 = opts.imageTypes;
    const v483 = v482 != null;
    if (v483) {
        const v484 = opts.imageTypes;
        options.imageTypes = v484;
    }
    const v485 = opts.crop;
    const v486 = v485 != null;
    if (v486) {
        const v487 = opts.crop;
        options.crop = v487;
    }
    const v488 = opts.validateRequest;
    const v489 = v488 != null;
    if (v489) {
        const v490 = opts.validateRequest;
        options.validateRequest = v490;
    }
    const v491 = opts.validateFile;
    const v492 = v491 != null;
    if (v492) {
        const v493 = opts.validateFile;
        options.validateFile = v493;
    }
    const v494 = opts.getDirectory;
    const v495 = v494 != null;
    if (v495) {
        const v496 = opts.getDirectory;
        options.getDirectory = v496;
    }
    const v497 = opts.getFileName;
    const v498 = v497 != null;
    if (v498) {
        const v499 = opts.getFileName;
        options.getFileName = v499;
    }
    const v500 = opts.finished;
    const v501 = v500 != null;
    if (v501) {
        const v502 = opts.finished;
        options.finished = v502;
    }
    const v503 = opts.overwrite;
    const v504 = v503 != null;
    if (v504) {
        const v505 = opts.overwrite;
        options.overwrite = v505;
    }
    const v506 = opts.uploadUrl;
    if (v506) {
        const v507 = opts.uploadUrl;
        options.uploadUrl = v507;
    }
    const v508 = opts.imageVersions;
    const v509 = v508 != null;
    if (v509) {
        const v510 = opts.imageVersions;
        options.imageVersions = v510;
    } else {
        options.imageVersions = [];
    }
    const v511 = options.uploadUrl;
    const v512 = v511 != '/upload/';
    if (v512) {
        const v513 = options.uploadUrl;
        const v514 = 'Custom upload url setup to: ' + v513;
        const v515 = console.log(v514);
        v515;
    }
    const v516 = options.uploadUrl;
    const v517 = RoutePolicy.declare(v516, 'network');
    v517;
    const v518 = WebApp.connectHandlers;
    const v519 = options.uploadUrl;
    const v520 = UploadServer.serve;
    const v521 = v518.use(v519, v520);
    v521;
};
const v535 = function (filePath) {
    const v523 = options.uploadDir;
    const v524 = path.join(v523, filePath);
    const v525 = fs.unlinkSync(v524);
    v525;
    const v526 = options.imageVersions;
    if (v526) {
        const v527 = options.imageVersions;
        var subFolders = Object.keys(v527);
        var i = 0;
        const v528 = subFolders.length;
        let v529 = i < v528;
        while (v529) {
            const v531 = options.uploadDir;
            const v532 = subFolders[i];
            const v533 = path.join(v531, v532, filePath);
            const v534 = fs.unlinkSync(v533);
            v534;
            const v530 = i++;
            v529 = i < v528;
        }
    }
};
const v614 = function (req, res) {
    const v536 = options.tmpDir;
    const v537 = v536 == null;
    const v538 = options.uploadDir;
    const v539 = v538 == null;
    const v540 = v537 || v539;
    if (v540) {
        const v541 = new Meteor.Error('Upload component not initialised!');
        throw v541;
    }
    const v542 = options.accessControl;
    const v543 = v542.allowOrigin;
    const v544 = res.setHeader('Access-Control-Allow-Origin', v543);
    v544;
    const v545 = options.accessControl;
    const v546 = v545.allowMethods;
    const v547 = res.setHeader('Access-Control-Allow-Methods', v546);
    v547;
    const v548 = options.accessControl;
    const v549 = v548.allowHeaders;
    const v550 = res.setHeader('Access-Control-Allow-Headers', v549);
    v550;
    var handleResult = function (result, redirect) {
        if (redirect) {
            const v551 = JSON.stringify(result);
            const v552 = encodeURIComponent(v551);
            const v553 = redirect.replace(/%s/, v552);
            const v554 = { 'Location': v553 };
            const v555 = res.writeHead(302, v554);
            v555;
            const v556 = res.end();
            v556;
        } else {
            const v557 = result.error;
            if (v557) {
                const v558 = { 'Content-Type': 'text/plain' };
                const v559 = res.writeHead(403, v558);
                v559;
                const v560 = result.error;
                const v561 = res.write(v560);
                v561;
                const v562 = res.end();
                v562;
            } else {
                const v563 = JSON.stringify(result);
                const v564 = res.end(v563);
                v564;
            }
        }
    };
    var setNoCacheHeaders = function () {
        const v565 = options.cacheTime;
        if (v565) {
            const v566 = options.cacheTime;
            const v567 = 'public, max-age=' + v566;
            const v568 = res.setHeader('Cache-Control', v567);
            v568;
        } else {
            const v569 = res.setHeader('Pragma', 'no-cache');
            v569;
            const v570 = res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            v570;
        }
    };
    var handler = new UploadHandler(req, res, handleResult);
    var error = options.validateRequest(req, res);
    const v571 = error == false;
    const v572 = error != true;
    const v573 = error != null;
    const v574 = v572 && v573;
    const v575 = v571 || v574;
    if (v575) {
        const v576 = { 'Content-Type': 'text/plain' };
        const v577 = res.writeHead(403, v576);
        v577;
        const v578 = error.toString();
        const v579 = res.write(v578);
        v579;
        const v580 = res.end();
        v580;
        return;
    }
    const v581 = req.method;
    switch (v581) {
    case 'OPTIONS':
        const v582 = res.end();
        v582;
        break;
    case 'HEAD':
    case 'GET':
        const v583 = setNoCacheHeaders();
        v583;
        const v584 = req.url;
        const v585 = url.parse(v584);
        var uri = v585.pathname;
        const v586 = options.uploadDir;
        const v587 = decodeURIComponent(uri);
        var filename = path.join(v586, v587);
        var stats;
        try {
            stats = fs.lstatSync(filename);
        } catch (e) {
            const v588 = { 'Content-Type': 'text/plain' };
            const v589 = res.writeHead(404, v588);
            v589;
            const v590 = res.write('404 Not Found\n');
            v590;
            const v591 = res.end();
            v591;
            return;
        }
        const v592 = stats.isFile();
        if (v592) {
            const v593 = options.mimeTypes;
            const v594 = path.extname(filename);
            const v595 = v594.split('.');
            const v596 = v595.reverse();
            const v597 = v596[0];
            var mimeType = v593[v597];
            const v598 = !mimeType;
            if (v598) {
                mimeType = 'application/octet-stream';
            }
            const v599 = { 'Content-Type': mimeType };
            const v600 = res.writeHead(200, v599);
            v600;
            var fileStream = fs.createReadStream(filename);
            const v601 = fileStream.pipe(res);
            v601;
        } else {
            const v602 = stats.isDirectory();
            if (v602) {
                const v603 = { 'Content-Type': 'text/plain' };
                const v604 = res.writeHead(403, v603);
                v604;
                const v605 = res.write('Access denied');
                v605;
                const v606 = res.end();
                v606;
            } else {
                const v607 = { 'Content-Type': 'text/plain' };
                const v608 = res.writeHead(500, v607);
                v608;
                const v609 = res.write('500 Internal server error\n');
                v609;
                const v610 = res.end();
                v610;
            }
        }
        break;
    case 'POST':
        const v611 = setNoCacheHeaders();
        v611;
        const v612 = handler.post();
        v612;
        break;
    default:
        res.statusCode = 405;
        const v613 = res.end();
        v613;
    }
};
UploadServer.getOptions = v441;
UploadServer.init = v522;
UploadServer.delete = v535;
UploadServer.serve = v614;
UploadServer = {};
UploadServer = {};
var utf8encode = function (str) {
    const v615 = encodeURIComponent(str);
    const v616 = unescape(v615);
    return v616;
};
var nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/;
var nameCountFunc = function (s, index, ext) {
    const v617 = parseInt(index, 10);
    const v618 = v617 || 0;
    const v619 = v618 + 1;
    const v620 = ' (' + v619;
    const v621 = v620 + ')';
    const v622 = ext || '';
    const v623 = v621 + v622;
    return v623;
};
var FileInfo = function (file, req, form) {
    const v624 = file.name;
    this.name = v624;
    const v625 = file.name;
    this.path = v625;
    const v626 = file.size;
    this.size = v626;
    const v627 = file.type;
    this.type = v627;
    const v628 = form.formFields;
    const v629 = options.getDirectory(this, v628);
    this.subDirectory = v629;
    const v630 = options.ssl;
    let v631;
    if (v630) {
        v631 = 'https:';
    } else {
        v631 = 'http:';
    }
    const v632 = v631 + '//';
    const v633 = req.headers;
    const v634 = v633.host;
    const v635 = v632 + v634;
    const v636 = options.uploadUrl;
    this.baseUrl = v635 + v636;
    const v637 = this.baseUrl;
    const v638 = this.subDirectory;
    const v639 = this.subDirectory;
    const v640 = v639 + '/';
    let v641;
    if (v638) {
        v641 = v640;
    } else {
        v641 = '';
    }
    const v642 = v637 + v641;
    const v643 = this.name;
    const v644 = encodeURIComponent(v643);
    this.url = v642 + v644;
};
const v645 = FileInfo.prototype;
const v661 = function () {
    this.error = null;
    const v646 = options.minFileSize;
    const v647 = options.minFileSize;
    const v648 = this.size;
    const v649 = v647 > v648;
    const v650 = v646 && v649;
    if (v650) {
        this.error = 'File is too small';
    } else {
        const v651 = options.maxFileSize;
        const v652 = options.maxFileSize;
        const v653 = this.size;
        const v654 = v652 < v653;
        const v655 = v651 && v654;
        if (v655) {
            this.error = 'File is too big';
        } else {
            const v656 = options.acceptFileTypes;
            const v657 = this.name;
            const v658 = v656.test(v657);
            const v659 = !v658;
            if (v659) {
                this.error = 'Filetype not allowed';
            }
        }
    }
    const v660 = this.error;
    return v660;
};
v645.validate = v661;
const v662 = FileInfo.prototype;
const v682 = function (req, form) {
    const v663 = this.error;
    const v664 = !v663;
    if (v664) {
        var that = this;
        const v665 = options.imageVersions;
        const v666 = Object.keys(v665);
        const v680 = function (version) {
            const v667 = options.uploadDir;
            const v668 = v667 + '/';
            const v669 = v668 + version;
            const v670 = v669 + '/';
            const v671 = that.name;
            const v672 = v670 + v671;
            const v673 = _existsSync(v672);
            if (v673) {
                const v674 = version + 'Url';
                const v675 = that.baseUrl;
                const v676 = v675 + version;
                const v677 = v676 + '/';
                const v678 = that.name;
                const v679 = encodeURIComponent(v678);
                that[v674] = v677 + v679;
            }
        };
        const v681 = v666.forEach(v680);
        v681;
    }
};
v662.initUrls = v682;
var UploadHandler = function (req, res, callback) {
    this.req = req;
    this.res = res;
    this.callback = callback;
};
const v683 = UploadHandler.prototype;
const v802 = function () {
    var handler = this;
    var form = new formidable.IncomingForm();
    var tmpFiles = [];
    var files = [];
    var map = {};
    var counter = 1;
    var redirect;
    var finish = function (err, stdout) {
        if (err) {
            throw err;
        }
        counter -= 1;
        const v684 = !counter;
        if (v684) {
            const v687 = function (fileInfo) {
                const v685 = handler.req;
                const v686 = fileInfo.initUrls(v685, form);
                v686;
            };
            const v688 = files.forEach(v687);
            v688;
            const v689 = { files: files };
            const v690 = handler.callback(v689, redirect);
            v690;
        }
    };
    const v691 = options.tmpDir;
    form.uploadDir = v691;
    const v698 = function (name, file) {
        const v692 = file.path;
        const v693 = tmpFiles.push(v692);
        v693;
        const v694 = handler.req;
        var fileInfo = new FileInfo(file, v694, form);
        const v695 = file.path;
        const v696 = path.basename(v695);
        map[v696] = fileInfo;
        const v697 = files.push(fileInfo);
        v697;
    };
    const v699 = form.on('fileBegin', v698);
    const v705 = function (name, value) {
        const v700 = name === 'redirect';
        if (v700) {
            redirect = value;
        }
        const v701 = this.formFields;
        const v702 = v701 == null;
        if (v702) {
            const v703 = {};
            this.formFields = v703;
        }
        const v704 = this.formFields;
        v704[name] = value;
    };
    const v706 = v699.on('field', v705);
    const v781 = function (name, file) {
        const v707 = file.path;
        const v708 = path.basename(v707);
        var fileInfo = map[v708];
        const v709 = file.size;
        fileInfo.size = v709;
        const v710 = handler.req;
        var error = options.validateFile(file, v710);
        const v711 = error == false;
        const v712 = error != true;
        const v713 = error != null;
        const v714 = v712 && v713;
        const v715 = v711 || v714;
        if (v715) {
            const v716 = handler.res;
            const v717 = { 'Content-Type': 'text/plain' };
            const v718 = v716.writeHead(403, v717);
            v718;
            const v719 = handler.res;
            const v720 = error == false;
            let v721;
            if (v720) {
                v721 = 'validationFailed';
            } else {
                v721 = error;
            }
            const v722 = v719.write(v721);
            v722;
            const v723 = handler.res;
            const v724 = v723.end();
            v724;
            const v725 = file.path;
            const v726 = fs.unlinkSync(v725);
            v726;
            return;
        }
        error = fileInfo.validate();
        if (error) {
            const v727 = file.path;
            const v728 = fs.unlinkSync(v727);
            v728;
            const v729 = { error: error };
            const v730 = handler.callback(v729);
            v730;
            return;
        }
        const v731 = this.formFields;
        var folder = options.getDirectory(fileInfo, v731);
        const v732 = folder.replace(/\./g, '');
        v732;
        var subFolders = folder.split('/');
        var currentFolder = options.uploadDir;
        var i = 0;
        const v733 = subFolders.length;
        let v734 = i < v733;
        while (v734) {
            const v736 = subFolders[i];
            currentFolder += '/' + v736;
            const v737 = fs.existsSync(currentFolder);
            const v738 = !v737;
            if (v738) {
                const v739 = fs.mkdirSync(currentFolder);
                v739;
            }
            const v735 = i++;
            v734 = i < v733;
        }
        const v740 = this.formFields;
        var newFileName = options.getFileName(fileInfo, v740);
        newFileName = getSafeName(currentFolder, newFileName);
        fileInfo.name = newFileName;
        const v741 = path.join(folder, newFileName);
        fileInfo.path = v741;
        var imageVersionsFunc = function () {
            const v742 = options.imageTypes;
            const v743 = fileInfo.name;
            const v744 = v742.test(v743);
            if (v744) {
                const v745 = options.imageVersions;
                const v746 = Object.keys(v745);
                const v764 = function (version) {
                    counter += 1;
                    const v747 = options.imageVersions;
                    var opts = v747[version];
                    const v748 = currentFolder + version;
                    const v749 = fs.existsSync(v748);
                    const v750 = !v749;
                    if (v750) {
                        const v751 = currentFolder + version;
                        const v752 = fs.mkdirSync(v751);
                        v752;
                    }
                    const v753 = currentFolder + newFileName;
                    const v754 = currentFolder + version;
                    const v755 = v754 + '/';
                    const v756 = v755 + newFileName;
                    var ioptions = {};
                    ioptions.srcPath = v753;
                    ioptions.dstPath = v756;
                    const v757 = opts.width;
                    if (v757) {
                        const v758 = opts.width;
                        ioptions.width = v758;
                    }
                    const v759 = opts.height;
                    if (v759) {
                        const v760 = opts.height;
                        ioptions.height = v760;
                    }
                    const v761 = options.crop;
                    if (v761) {
                        ioptions.quality = 1;
                        ioptions.gravity = 'Center';
                        const v762 = imageMagick.crop(ioptions, finish);
                        v762;
                    } else {
                        const v763 = imageMagick.resize(ioptions, finish);
                        v763;
                    }
                };
                const v765 = v746.forEach(v764);
                v765;
            }
        };
        const v766 = currentFolder + '/';
        var destinationFile = v766 + newFileName;
        try {
            const v767 = file.path;
            const v768 = fs.renameSync(v767, destinationFile);
            v768;
            const v769 = imageVersionsFunc();
            v769;
        } catch (exception) {
            const v770 = file.path;
            var is = fs.createReadStream(v770);
            var os = fs.createWriteStream(destinationFile);
            const v771 = is.pipe(os);
            v771;
            const v775 = function () {
                const v772 = file.path;
                const v773 = fs.unlinkSync(v772);
                v773;
                const v774 = imageVersionsFunc();
                v774;
            };
            const v776 = is.on('end', v775);
            v776;
        }
        var formFields = this.formFields;
        const v778 = function () {
            const v777 = options.finished(fileInfo, formFields);
            v777;
        };
        const v779 = Fiber(v778);
        const v780 = v779.run();
        v780;
    };
    const v782 = v706.on('file', v781);
    const v786 = function () {
        const v784 = function (file) {
            const v783 = fs.unlink(file);
            v783;
        };
        const v785 = tmpFiles.forEach(v784);
        v785;
    };
    const v787 = v782.on('aborted', v786);
    const v790 = function (e) {
        const v788 = console.log('ERROR');
        v788;
        const v789 = console.log(e);
        v789;
    };
    const v791 = v787.on('error', v790);
    const v797 = function (bytesReceived, bytesExpected) {
        const v792 = options.maxPostSize;
        const v793 = bytesReceived > v792;
        if (v793) {
            const v794 = handler.req;
            const v795 = v794.connection;
            const v796 = v795.destroy();
            v796;
        }
    };
    const v798 = v791.on('progress', v797);
    const v799 = v798.on('end', finish);
    const v800 = handler.req;
    const v801 = v799.parse(v800);
    v801;
};
v683.post = v802;
const v803 = UploadHandler.prototype;
const v836 = function () {
    var handler = this;
    var fileName;
    const v804 = handler.req;
    const v805 = v804.url;
    const v806 = options.uploadUrl;
    const v807 = v806.length;
    const v808 = v805.slice(0, v807);
    const v809 = options.uploadUrl;
    const v810 = v808 === v809;
    if (v810) {
        const v811 = handler.req;
        const v812 = v811.url;
        const v813 = decodeURIComponent(v812);
        fileName = path.basename(v813);
        const v814 = fileName[0];
        const v815 = v814 !== '.';
        if (v815) {
            const v816 = options.uploadDir;
            const v817 = v816 + '/';
            const v818 = v817 + fileName;
            const v832 = function (ex) {
                const v819 = options.imageVersions;
                const v820 = Object.keys(v819);
                const v827 = function (version) {
                    const v821 = options.uploadDir;
                    const v822 = v821 + '/';
                    const v823 = v822 + version;
                    const v824 = v823 + '/';
                    const v825 = v824 + fileName;
                    const v826 = fs.unlink(v825);
                    v826;
                };
                const v828 = v820.forEach(v827);
                v828;
                const v829 = !ex;
                const v830 = { success: v829 };
                const v831 = handler.callback(v830);
                v831;
            };
            const v833 = fs.unlink(v818, v832);
            v833;
            return;
        }
    }
    const v834 = { success: false };
    const v835 = handler.callback(v834);
    v835;
};
v803.destroy = v836;
var checkCreateDirectory = function (dir) {
    const v837 = !dir;
    if (v837) {
        return;
    }
    const v838 = process.platform;
    const v839 = /^win/.test(v838);
    if (v839) {
        dir = dir.replace(/([A-Z]:[\\\/]).*?/gi, '');
    }
    var dirParts = dir.split('/');
    var currentDir = '/';
    var i = 0;
    const v840 = dirParts.length;
    let v841 = i < v840;
    while (v841) {
        const v843 = dirParts[i];
        const v844 = !v843;
        if (v844) {
            continue;
        }
        const v845 = dirParts[i];
        currentDir += v845 + '/';
        const v846 = fs.existsSync(currentDir);
        const v847 = !v846;
        if (v847) {
            const v848 = fs.mkdirSync(currentDir);
            v848;
            const v849 = 'Created directory: ' + currentDir;
            const v850 = console.log(v849);
            v850;
        }
        const v842 = i++;
        v841 = i < v840;
    }
};
var getSafeName = function (directory, fileName) {
    var n = fileName;
    const v851 = path.basename(n);
    n = v851.replace(/^\.+/, '');
    const v852 = options.overwrite;
    const v853 = !v852;
    if (v853) {
        const v854 = directory + '/';
        const v855 = v854 + n;
        let v856 = _existsSync(v855);
        while (v856) {
            n = n.replace(nameCountRegexp, nameCountFunc);
            v856 = _existsSync(v855);
        }
    }
    return n;
};