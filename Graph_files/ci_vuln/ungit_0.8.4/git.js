var child_process = require('child_process');
var gitParser = require('./git-parser');
var async = require('async');
var path = require('path');
var fs = require('fs');
var config = require('./config');
var winston = require('winston');
const v458 = require('util');
var inherits = v458.inherits;
var addressParser = require('./address-parser');
var GitTask = require('./git-task');
var gitConfigNoColors = '-c color.ui=false';
var gitConfigNoSlashesInFiles = '-c core.quotepath=false';
var gitConfigCliPager = '-c core.pager=cat';
const v459 = process.platform;
var isWindows = /^win/.test(v459);
var git = function (command, repoPath) {
    const v460 = 'git ' + gitConfigNoColors;
    const v461 = v460 + ' ';
    const v462 = v461 + gitConfigNoSlashesInFiles;
    const v463 = v462 + ' ';
    const v464 = v463 + gitConfigCliPager;
    const v465 = v464 + ' ';
    command = v465 + command;
    const v466 = new GitExecutionTask(command, repoPath);
    return v466;
};
var GitExecutionTask = function (command, repoPath) {
    const v467 = GitTask.call(this);
    v467;
    var self = this;
    this.repoPath = repoPath;
    this.command = command;
    const v468 = 2 * 60;
    this._timeout = v468 * 1000;
    this.potentialError = new Error();
    const v470 = function () {
        const v469 = git.queueTask(self);
        v469;
    };
    this.start = v470;
};
const v471 = inherits(GitExecutionTask, GitTask);
v471;
const v472 = GitExecutionTask.prototype;
const v473 = function (parser, parseArgs) {
    this._parser = parser;
    this.parseArgs = parseArgs;
    return this;
};
v472.parser = v473;
const v474 = GitExecutionTask.prototype;
const v475 = function (encoding) {
    this._encoding = encoding;
    return this;
};
v474.encoding = v475;
const v476 = GitExecutionTask.prototype;
const v477 = function (timeout) {
    this._timeout = timeout;
    return this;
};
v476.timeout = v477;
git.runningTasks = [];
const v604 = function (task, callback) {
    const v478 = config.logGitCommands;
    if (v478) {
        const v479 = task.repoPath;
        const v480 = 'git executing: ' + v479;
        const v481 = v480 + ' ';
        const v482 = task.command;
        const v483 = v481 + v482;
        const v484 = winston.info(v483);
        v484;
    }
    const v485 = git.runningTasks;
    const v486 = v485.push(task);
    v486;
    const v487 = Date.now();
    task.startTime = v487;
    const v488 = task.command;
    const v489 = task.repoPath;
    const v490 = 1024 * 1024;
    const v491 = v490 * 100;
    const v492 = task._encoding;
    const v493 = task._timeout;
    const v494 = {
        cwd: v489,
        maxBuffer: v491,
        encoding: v492,
        timeout: v493
    };
    const v602 = function (error, stdout, stderr) {
        const v495 = git.runningTasks;
        const v496 = git.runningTasks;
        const v497 = v496.indexOf(task);
        const v498 = v495.splice(v497, 1);
        v498;
        stdout = stdout.toString();
        stderr = stderr.toString();
        const v499 = config.logGitOutput;
        if (v499) {
            const v500 = task.command;
            const v501 = 'git result (first 400 bytes): ' + v500;
            const v502 = v501 + '\n';
            const v503 = stderr.slice(0, 400);
            const v504 = v502 + v503;
            const v505 = v504 + '\n';
            const v506 = stdout.slice(0, 400);
            const v507 = v505 + v506;
            const v508 = winston.info(v507);
            v508;
        }
        const v509 = error !== null;
        if (v509) {
            var err = {};
            err.isGitError = true;
            err.errorCode = 'unknown';
            const v510 = task.potentialError;
            const v511 = v510.stack;
            err.stackAtCall = v511;
            const v512 = task.potentialError;
            const v513 = v512.lineNumber;
            err.lineAtCall = v513;
            const v514 = task.command;
            err.command = v514;
            const v515 = task.repoPath;
            err.workingDirectory = v515;
            const v516 = error.toString();
            err.error = v516;
            const v517 = err.error;
            const v518 = v517.split('\n');
            const v519 = v518[0];
            err.message = v519;
            err.stderr = stderr;
            err.stdout = stdout;
            const v520 = stderr.indexOf('Not a git repository');
            const v521 = v520 >= 0;
            if (v521) {
                err.errorCode = 'not-a-repository';
            } else {
                const v522 = err.stderr;
                const v523 = v522.indexOf('Connection timed out');
                const v524 = -1;
                const v525 = v523 != v524;
                if (v525) {
                    err.errorCode = 'remote-timeout';
                } else {
                    const v526 = err.stderr;
                    const v527 = v526.indexOf('Permission denied (publickey)');
                    const v528 = -1;
                    const v529 = v527 != v528;
                    if (v529) {
                        err.errorCode = 'permision-denied-publickey';
                    } else {
                        const v530 = err.stderr;
                        const v531 = v530.indexOf('ssh: connect to host');
                        const v532 = -1;
                        const v533 = v531 != v532;
                        const v534 = err.stderr;
                        const v535 = v534.indexOf('Bad file number');
                        const v536 = -1;
                        const v537 = v535 != v536;
                        const v538 = v533 && v537;
                        if (v538) {
                            err.errorCode = 'ssh-bad-file-number';
                        } else {
                            const v539 = err.stderr;
                            const v540 = v539.indexOf('No remote configured to list refs from.');
                            const v541 = -1;
                            const v542 = v540 != v541;
                            if (v542) {
                                err.errorCode = 'no-remote-configured';
                            } else {
                                const v543 = err.stderr;
                                const v544 = v543.indexOf('unable to access');
                                const v545 = -1;
                                const v546 = v544 != v545;
                                const v547 = err.stderr;
                                const v548 = v547.indexOf('Could not resolve host:');
                                const v549 = -1;
                                const v550 = v548 != v549;
                                const v551 = v546 && v550;
                                const v552 = err.stderr;
                                const v553 = v552.indexOf('Could not resolve hostname');
                                const v554 = -1;
                                const v555 = v553 != v554;
                                const v556 = v551 || v555;
                                if (v556) {
                                    err.errorCode = 'offline';
                                } else {
                                    const v557 = err.stderr;
                                    const v558 = v557.indexOf('Proxy Authentication Required');
                                    const v559 = -1;
                                    const v560 = v558 != v559;
                                    if (v560) {
                                        err.errorCode = 'proxy-authentication-required';
                                    } else {
                                        const v561 = err.stderr;
                                        const v562 = v561.indexOf('Please tell me who you are');
                                        const v563 = -1;
                                        const v564 = v562 != v563;
                                        if (v564) {
                                            err.errorCode = 'no-git-name-email-configured';
                                        } else {
                                            const v565 = err.stderr;
                                            const v566 = v565.indexOf('FATAL ERROR: Disconnected: No supported authentication methods available (server sent: publickey)');
                                            const v567 = v566 == 0;
                                            if (v567) {
                                                err.errorCode = 'no-supported-authentication-provided';
                                            } else {
                                                const v568 = stderr.indexOf('fatal: No remote repository specified.');
                                                const v569 = v568 == 0;
                                                if (v569) {
                                                    err.errorCode = 'no-remote-specified';
                                                } else {
                                                    const v570 = err.stderr;
                                                    const v571 = v570.indexOf('non-fast-forward');
                                                    const v572 = -1;
                                                    const v573 = v571 != v572;
                                                    if (v573) {
                                                        err.errorCode = 'non-fast-forward';
                                                    } else {
                                                        const v574 = err.stderr;
                                                        const v575 = v574.indexOf('Failed to merge in the changes.');
                                                        const v576 = v575 == 0;
                                                        const v577 = err.stdout;
                                                        const v578 = v577.indexOf('CONFLICT (content): Merge conflict in');
                                                        const v579 = -1;
                                                        const v580 = v578 != v579;
                                                        const v581 = v576 || v580;
                                                        const v582 = err.stderr;
                                                        const v583 = v582.indexOf('after resolving the conflicts');
                                                        const v584 = -1;
                                                        const v585 = v583 != v584;
                                                        const v586 = v581 || v585;
                                                        if (v586) {
                                                            err.errorCode = 'merge-failed';
                                                        } else {
                                                            const v587 = err.stderr;
                                                            const v588 = v587.indexOf('This operation must be run in a work tree');
                                                            const v589 = -1;
                                                            const v590 = v588 != v589;
                                                            if (v590) {
                                                                err.errorCode = 'must-be-in-working-tree';
                                                            } else {
                                                                const v591 = err.stderr;
                                                                const v592 = v591.indexOf('Your local changes to the following files would be overwritten by checkout');
                                                                const v593 = -1;
                                                                const v594 = v592 != v593;
                                                                if (v594) {
                                                                    err.errorCode = 'local-changes-would-be-overwritten';
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const v595 = task.setResult(err);
            v595;
            const v596 = callback(err);
            v596;
        } else {
            let result;
            const v597 = task._parser;
            const v598 = task.parseArgs;
            const v599 = task._parser(stdout, v598);
            if (v597) {
                result = v599;
            } else {
                result = stdout;
            }
            const v600 = task.setResult(null, result);
            v600;
            const v601 = callback();
            v601;
        }
    };
    var process = child_process.exec(v488, v494, v602);
    task.process = process;
    const v603 = task.setStarted();
    v603;
};
const v605 = config.maxConcurrentGitOperations;
var gitQueue = async.queue(v604, v605);
const v607 = function (task) {
    const v606 = gitQueue.push(task);
    v606;
};
git.queueTask = v607;
const v631 = function (repoPath, file) {
    var task = new GitTask();
    const v608 = '"' + file;
    const v609 = v608 + '"';
    let v610;
    if (file) {
        v610 = v609;
    } else {
        v610 = '';
    }
    const v611 = 'status -s -b -u ' + v610;
    const v612 = git(v611, repoPath);
    const v613 = gitParser.parseGitStatus;
    const v614 = v612.parser(v613);
    const v615 = task.setResult;
    const v616 = v614.fail(v615);
    const v628 = function (status) {
        const v617 = path.join(repoPath, '.git', 'rebase-merge');
        const v618 = fs.existsSync(v617);
        const v619 = path.join(repoPath, '.git', 'rebase-apply');
        const v620 = fs.existsSync(v619);
        status.inRebase = v618 || v620;
        const v621 = path.join(repoPath, '.git', 'MERGE_HEAD');
        const v622 = fs.existsSync(v621);
        status.inMerge = v622;
        const v623 = status.inMerge;
        if (v623) {
            const v624 = path.join(repoPath, '.git', 'MERGE_MSG');
            const v625 = { encoding: 'utf8' };
            const v626 = fs.readFileSync(v624, v625);
            status.commitMessage = v626;
        }
        const v627 = task.setResult(null, status);
        v627;
    };
    var gitTask = v616.done(v628);
    const v629 = gitTask.start;
    const v630 = task.started(v629);
    v630;
    return task;
};
git.status = v631;
const v640 = function (repoPath, remoteName) {
    const v632 = 'config --get remote.' + remoteName;
    const v633 = v632 + '.url';
    const v634 = git(v633, repoPath);
    const v638 = function (text) {
        const v635 = text.split('\n');
        const v636 = v635[0];
        const v637 = addressParser.parseAddress(v636);
        return v637;
    };
    const v639 = v634.parser(v638);
    return v639;
};
git.getRemoteAddress = v640;
const v661 = function (repoPath, wrappedTask) {
    var task = new GitTask();
    const v641 = git('stash', repoPath);
    const v658 = function (err, res) {
        var hadLocalChanges = true;
        if (err) {
            const v642 = err.stderr;
            const v643 = v642.indexOf('You do not have the initial commit yet');
            const v644 = -1;
            const v645 = v643 != v644;
            if (v645) {
                hadLocalChanges = false;
            } else {
                const v646 = task.setResult(err, res);
                v646;
                return;
            }
        } else {
            const v647 = res.indexOf('No local changes to save');
            const v648 = -1;
            const v649 = v647 != v648;
            if (v649) {
                hadLocalChanges = false;
            }
        }
        if (hadLocalChanges) {
            const v650 = git('stash pop', repoPath);
            const v651 = task.setResult;
            var popTask = v650.always(v651);
            const v653 = function () {
                const v652 = popTask.start();
                v652;
            };
            const v654 = wrappedTask.always(v653);
            v654;
        } else {
            const v655 = task.setResult;
            const v656 = wrappedTask.always(v655);
            v656;
        }
        const v657 = wrappedTask.start();
        v657;
    };
    var gitTask = v641.always(v658);
    const v659 = gitTask.start;
    const v660 = task.started(v659);
    v660;
    return task;
};
git.stashAndPop = v661;
const v667 = function (repoPath, filename, version) {
    const v662 = 'show ' + version;
    const v663 = v662 + ':';
    const v664 = v663 + filename;
    const v665 = git(v664, repoPath);
    const v666 = v665.encoding('binary');
    return v666;
};
git.binaryFileContent = v667;
const v718 = function (repoPath, filename, sha1, maxNLines) {
    var task = new GitTask();
    const v668 = git.status(repoPath);
    const v669 = task.setResult;
    const v670 = v668.fail(v669);
    const v715 = function (status) {
        const v671 = status.files;
        var file = v671[filename];
        var filePath = path.join(repoPath, filename);
        const v672 = !file;
        const v673 = !sha1;
        const v674 = v672 && v673;
        if (v674) {
            const v675 = path.join(repoPath, filename);
            const v676 = fs.existsSync(v675);
            if (v676) {
                const v677 = [];
                const v678 = task.setResult(null, v677);
                v678;
            } else {
                const v679 = 'No such file: ' + filename;
                const v680 = {
                    error: v679,
                    errorCode: 'no-such-file'
                };
                const v681 = task.setResult(v680);
                v681;
            }
        } else {
            const v682 = file.isNew;
            const v683 = !v682;
            const v684 = sha1 || v683;
            const v685 = fs.lstatSync(filePath);
            const v686 = v685.isDirectory();
            const v687 = v684 || v686;
            if (v687) {
                var gitCommand;
                if (sha1) {
                    const v688 = 'diff ' + sha1;
                    let v689;
                    if (isWindows) {
                        v689 = '^^';
                    } else {
                        v689 = '^';
                    }
                    const v690 = v688 + v689;
                    const v691 = v690 + '! -- "';
                    const v692 = filename.trim();
                    const v693 = v691 + v692;
                    gitCommand = v693 + '"';
                } else {
                    const v694 = filename.trim();
                    const v695 = 'diff HEAD -- "' + v694;
                    gitCommand = v695 + '"';
                }
                const v696 = git(gitCommand, repoPath);
                const v697 = gitParser.parseGitDiff;
                const v698 = { maxNLines: maxNLines };
                const v699 = v696.parser(v697, v698);
                const v700 = task.setResult;
                const v701 = v699.always(v700);
                const v702 = v701.start();
                v702;
            } else {
                const v703 = { encoding: 'utf8' };
                const v713 = function (err, text) {
                    if (err) {
                        const v704 = { error: err };
                        const v705 = task.setResult(v704);
                        return v705;
                    }
                    var diffs = [];
                    var diff = {};
                    text = text.toString();
                    var lines = text.split('\n');
                    const v706 = lines.length;
                    diff.totalNumberOfLines = v706;
                    if (maxNLines) {
                        lines = lines.slice(0, maxNLines);
                    }
                    const v709 = function (line, i) {
                        const v707 = '+' + line;
                        const v708 = [
                            null,
                            i,
                            v707
                        ];
                        return v708;
                    };
                    const v710 = lines.map(v709);
                    diff.lines = v710;
                    const v711 = diffs.push(diff);
                    v711;
                    const v712 = task.setResult(null, diffs);
                    v712;
                };
                const v714 = fs.readFile(filePath, v703, v713);
                v714;
            }
        }
    };
    var statusTask = v670.done(v715);
    const v716 = statusTask.start;
    const v717 = task.started(v716);
    v717;
    return task;
};
git.diffFile = v718;
const v729 = function (repoPath) {
    var task = new GitTask();
    const v719 = git('reset --hard HEAD', repoPath);
    const v720 = task.setResult;
    const v721 = v719.fail(v720);
    const v726 = function () {
        const v722 = git('clean -fd', repoPath);
        const v723 = task.setResult;
        const v724 = v722.always(v723);
        const v725 = v724.start();
        v725;
    };
    var gitTask = v721.done(v726);
    const v727 = gitTask.start;
    const v728 = task.started(v727);
    v728;
    return task;
};
git.discardAllChanges = v729;
const v767 = function (repoPath, filename) {
    var task = new GitTask();
    var filePath = path.join(repoPath, filename);
    const v730 = git.status(repoPath, filename);
    const v731 = task.setResult;
    const v732 = v730.fail(v731);
    const v764 = function (status) {
        const v733 = status.files;
        const v734 = Object.keys(v733);
        const v735 = v734.length;
        const v736 = v735 == 0;
        if (v736) {
            const v737 = 'No files in status in discard, filename: ' + filename;
            const v738 = new Error(v737);
            throw v738;
        }
        const v739 = status.files;
        const v740 = status.files;
        const v741 = Object.keys(v740);
        const v742 = v741[0];
        var fileStatus = v739[v742];
        const v743 = fileStatus.staged;
        const v744 = !v743;
        if (v744) {
            const v745 = fileStatus.isNew;
            if (v745) {
                const v749 = function (err) {
                    if (err) {
                        const v746 = {
                            command: 'unlink',
                            error: err
                        };
                        const v747 = task.setResult(v746);
                        v747;
                    } else {
                        const v748 = task.setResult();
                        v748;
                    }
                };
                const v750 = fs.unlink(filePath, v749);
                v750;
            } else {
                const v751 = filename.trim();
                const v752 = 'checkout HEAD -- "' + v751;
                const v753 = v752 + '"';
                const v754 = git(v753, repoPath);
                const v755 = task.setResult;
                const v756 = v754.always(v755);
                const v757 = v756.start();
                v757;
            }
        } else {
            const v758 = 'rm -f "' + filename;
            const v759 = v758 + '"';
            const v760 = git(v759, repoPath);
            const v761 = task.setResult;
            const v762 = v760.always(v761);
            const v763 = v762.start();
            v763;
        }
    };
    var statusTask = v732.done(v764);
    const v765 = statusTask.start;
    const v766 = task.started(v765);
    v766;
    return task;
};
git.discardChangesInFile = v767;
const v821 = function (repoPath, files) {
    var task = new GitTask();
    const v768 = git.status(repoPath);
    const v769 = task.setResult;
    const v770 = v768.fail(v769);
    const v818 = function (status) {
        var toAdd = [];
        var toRemove = [];
        let v;
        for (v in files) {
            var file = files[v];
            const v771 = status.files;
            const v772 = v771[file];
            const v773 = status.files;
            const v774 = path.relative(repoPath, file);
            const v775 = v773[v774];
            var fileStatus = v772 || v775;
            const v776 = !fileStatus;
            if (v776) {
                const v777 = 'No such file in staging: ' + file;
                const v778 = { error: v777 };
                const v779 = task.setResult(v778);
                v779;
                return;
            }
            const v780 = fileStatus.removed;
            if (v780) {
                const v781 = toRemove.push(file);
                v781;
            } else {
                const v782 = toAdd.push(file);
                v782;
            }
        }
        const v797 = function (done) {
            const v783 = toAdd.length;
            const v784 = v783 == 0;
            if (v784) {
                const v785 = done();
                v785;
            } else {
                const v786 = git('update-index --add --stdin', repoPath);
                const v787 = v786.always(done);
                const v794 = function () {
                    const v789 = function (file) {
                        const v788 = file.trim();
                        return v788;
                    };
                    const v790 = toAdd.map(v789);
                    var filesToAdd = v790.join('\n');
                    const v791 = this.process;
                    const v792 = v791.stdin;
                    const v793 = v792.end(filesToAdd);
                    v793;
                };
                const v795 = v787.started(v794);
                const v796 = v795.start();
                v796;
            }
        };
        const v812 = function (done) {
            const v798 = toRemove.length;
            const v799 = v798 == 0;
            if (v799) {
                const v800 = done();
                v800;
            } else {
                const v801 = git('update-index --remove --stdin', repoPath);
                const v802 = v801.always(done);
                const v809 = function () {
                    const v804 = function (file) {
                        const v803 = file.trim();
                        return v803;
                    };
                    const v805 = toRemove.map(v804);
                    var filesToRemove = v805.join('\n');
                    const v806 = this.process;
                    const v807 = v806.stdin;
                    const v808 = v807.end(filesToRemove);
                    v808;
                };
                const v810 = v802.started(v809);
                const v811 = v810.start();
                v811;
            }
        };
        const v813 = [
            v797,
            v812
        ];
        const v816 = function (err) {
            if (err) {
                const v814 = task.setResult(err);
                return v814;
            }
            const v815 = task.setResult();
            v815;
        };
        const v817 = async.series(v813, v816);
        v817;
    };
    var statusTask = v770.done(v818);
    const v819 = statusTask.start;
    const v820 = task.started(v819);
    v820;
    return task;
};
git.updateIndexFromFileList = v821;
const v852 = function (repoPath, amend, message, files) {
    var task = new GitTask();
    const v822 = message === undefined;
    if (v822) {
        const v823 = { error: 'Must specify commit message' };
        const v824 = task.setResult(v823);
        return v824;
    }
    const v825 = files instanceof Array;
    const v826 = !v825;
    const v827 = files.length;
    const v828 = v827 == 0;
    const v829 = v826 || v828;
    const v830 = !amend;
    const v831 = v829 && v830;
    if (v831) {
        const v832 = { error: 'Must specify files or amend to commit' };
        const v833 = task.setResult(v832);
        return v833;
    }
    const v834 = git.updateIndexFromFileList(repoPath, files);
    const v835 = task.setResult;
    const v836 = v834.fail(v835);
    const v849 = function () {
        let v837;
        if (amend) {
            v837 = '--amend';
        } else {
            v837 = '';
        }
        const v838 = 'commit ' + v837;
        const v839 = v838 + ' --file=- ';
        const v840 = git(v839, repoPath);
        const v841 = task.setResult;
        const v842 = v840.always(v841);
        const v846 = function () {
            const v843 = this.process;
            const v844 = v843.stdin;
            const v845 = v844.end(message);
            v845;
        };
        const v847 = v842.started(v846);
        const v848 = v847.start();
        v848;
    };
    var updateIndexTask = v836.done(v849);
    const v850 = updateIndexTask.start;
    const v851 = task.started(v850);
    v851;
    return task;
};
git.commit = v852;
const v894 = function (repoPath, files) {
    var task = new GitTask();
    const v893 = function () {
        var toAdd = [];
        var toRemove = [];
        const v859 = function (file, callback) {
            const v853 = path.join(repoPath, file);
            const v857 = function (exists) {
                if (exists) {
                    const v854 = toAdd.push(file);
                    v854;
                } else {
                    const v855 = toRemove.push(file);
                    v855;
                }
                const v856 = callback();
                v856;
            };
            const v858 = fs.exists(v853, v857);
            v858;
        };
        const v890 = function () {
            const v872 = function (done) {
                const v860 = toAdd.length;
                const v861 = v860 == 0;
                if (v861) {
                    const v862 = done();
                    return v862;
                }
                const v865 = function (file) {
                    const v863 = '"' + file;
                    const v864 = v863 + '"';
                    return v864;
                };
                const v866 = toAdd.map(v865);
                const v867 = v866.join(' ');
                const v868 = 'add ' + v867;
                const v869 = git(v868, repoPath);
                const v870 = v869.always(done);
                const v871 = v870.start();
                v871;
            };
            const v885 = function (done) {
                const v873 = toRemove.length;
                const v874 = v873 == 0;
                if (v874) {
                    const v875 = done();
                    return v875;
                }
                const v878 = function (file) {
                    const v876 = '"' + file;
                    const v877 = v876 + '"';
                    return v877;
                };
                const v879 = toRemove.map(v878);
                const v880 = v879.join(' ');
                const v881 = 'rm ' + v880;
                const v882 = git(v881, repoPath);
                const v883 = v882.always(done);
                const v884 = v883.start();
                v884;
            };
            const v886 = [
                v872,
                v885
            ];
            const v888 = function (err) {
                const v887 = task.setResult(err);
                v887;
            };
            const v889 = async.parallel(v886, v888);
            v889;
        };
        const v891 = async.map(files, v859, v890);
        v891;
        const v892 = task.setStarted();
        v892;
    };
    task.start = v893;
    return task;
};
git.resolveConflicts = v894;
const v914 = function (repoPath) {
    var task = new GitTask();
    const v895 = git('rev-parse --show-toplevel', repoPath);
    const v896 = task.setResult;
    const v897 = v895.fail(v896);
    const v911 = function (rootRepoPath) {
        const v898 = rootRepoPath.trim();
        var HEADFile = path.join(v898, '.git', 'HEAD');
        const v899 = fs.existsSync(HEADFile);
        const v900 = !v899;
        if (v900) {
            const v901 = 'No such file: ' + HEADFile;
            const v902 = {
                errorCode: 'not-a-repository',
                error: v901
            };
            const v903 = task.setResult(v902);
            return v903;
        }
        const v904 = { encoding: 'utf8' };
        const v909 = function (err, text) {
            if (err) {
                const v905 = task.setResult(err);
                return v905;
            }
            text = text.toString();
            var rows = text.split('\n');
            const v906 = rows[0];
            const v907 = 'ref: refs/heads/'.length;
            var branch = v906.slice(v907);
            const v908 = task.setResult(null, branch);
            v908;
        };
        const v910 = fs.readFile(HEADFile, v904, v909);
        v910;
    };
    var gitTask = v897.done(v911);
    const v912 = gitTask.start;
    const v913 = task.started(v912);
    v913;
    return task;
};
git.getCurrentBranch = v914;
module.exports = git;