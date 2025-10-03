const v945 = function () {
    'use strict';
    var express = require('express');
    var router = express.Router();
    var fs = require('fs');
    var path = require('path');
    const v474 = require('./tools.js');
    const v475 = v474();
    v475;
    const v476 = require('./configuration.js');
    const v477 = v476();
    v477;
    var jConf = getConfigurationJson();
    var runningFBPName;
    const v487 = function (req, res) {
        const v478 = current_user(req);
        const v479 = tmp_dir(v478);
        const v485 = function () {
            const v480 = current_user(req);
            const v481 = tmp_dir(v480);
            const v482 = 'Accessed tmp dir -> ' + v481;
            const v483 = console.log(v482);
            v483;
            const v484 = res.render('index');
            v484;
        };
        const v486 = fs.mkdir(v479, v485);
        v486;
    };
    const v488 = router.get('/', v487);
    v488;
    const v500 = function (req, res) {
        var _p;
        const v489 = req.query;
        const v490 = v489.id;
        const v491 = v490 == 1;
        if (v491) {
            const v492 = current_user(req);
            _p = home_dir(v492);
            const v493 = processReq(_p, res);
            v493;
        } else {
            const v494 = req.query;
            const v495 = v494.id;
            if (v495) {
                const v496 = req.query;
                _p = v496.id;
                const v497 = processReq(_p, res);
                v497;
            } else {
                const v498 = ['No valid data found'];
                const v499 = res.json(v498);
                v499;
            }
        }
    };
    const v501 = router.get('/api/tree', v500);
    v501;
    const v506 = function (req, res) {
        const v502 = req.query;
        const v503 = v502.resource;
        const v504 = fs.readFileSync(v503, 'UTF-8');
        const v505 = res.send(v504);
        v505;
    };
    const v507 = router.get('/api/resource', v506);
    v507;
    const v536 = function (req, res) {
        const v508 = jConf.journal_access;
        const v509 = v508 === true;
        if (v509) {
            const v510 = req.query;
            var service = v510.service;
            if (service) {
                const v511 = require('child_process');
                var exec = v511.exec;
                var stdout = '';
                const v512 = scripts_dir();
                const v513 = v512 + 'systemctl-unit.sh ';
                const v514 = v513 + service;
                const v515 = v514 + ' ';
                const v516 = current_user(req);
                const v517 = env_file(v516);
                const v518 = v515 + v517;
                var child = exec(v518);
                const v519 = !child;
                if (v519) {
                    const v520 = res.send('Failed to run command on server');
                    v520;
                }
                const v521 = child.stdout;
                const v522 = function (data) {
                    stdout += data;
                };
                const v523 = v521.on('data', v522);
                v523;
                const v524 = child.stderr;
                const v527 = function (data) {
                    const v525 = 'Err: ' + data;
                    const v526 = console.log(v525);
                    v526;
                    stdout = 'Failed to run command on server';
                };
                const v528 = v524.on('data', v527);
                v528;
                const v532 = function (code) {
                    const v529 = stdout.replace(/Active:/, '');
                    stdout = v529.trim();
                    if (runningFBPName) {
                        const v530 = runningFBPName + ' - ';
                        stdout = v530 + stdout;
                    }
                    const v531 = res.send(stdout);
                    v531;
                };
                const v533 = child.on('close', v532);
                v533;
            }
        } else {
            const v534 = res.status(404);
            const v535 = v534.send('Unsupported api');
            v535;
        }
    };
    const v537 = router.get('/api/service/status', v536);
    v537;
    const v568 = function (req, res) {
        const v538 = require('child_process');
        var spawn = v538.spawn;
        const v539 = req.query;
        var code = v539.code;
        var stdout = '';
        if (code) {
            const v540 = current_user(req);
            const v541 = tmp_dir(v540);
            const v542 = v541 + 'fbp_svg.fbp';
            const v543 = writeFile(v542, code);
            v543;
            const v544 = current_user(req);
            const v545 = tmp_dir(v544);
            const v546 = v545 + 'fbp_svg.fbp';
            const v547 = current_user(req);
            const v548 = tmp_dir(v547);
            const v549 = v548 + 'fbp_runner.dot';
            const v550 = [
                '--fbp',
                v546,
                '--dot',
                v549
            ];
            var child_dot = spawn('sol-fbp-to-dot', v550);
            const v564 = function (code) {
                const v551 = current_user(req);
                const v552 = tmp_dir(v551);
                const v553 = v552 + 'fbp_runner.dot';
                const v554 = [
                    '-Tsvg',
                    v553
                ];
                var child_svg = spawn('dot', v554);
                const v555 = child_svg.stdout;
                const v556 = function (data) {
                    stdout += data;
                };
                const v557 = v555.on('data', v556);
                v557;
                const v558 = child_svg.stderr;
                const v559 = function (data) {
                    stdout = 'Failed to run dot command';
                };
                const v560 = v558.on('data', v559);
                v560;
                const v562 = function (code) {
                    const v561 = res.send(stdout);
                    v561;
                };
                const v563 = child_svg.on('close', v562);
                v563;
            };
            const v565 = child_dot.on('close', v564);
            v565;
        } else {
            const v566 = res.status(400);
            const v567 = v566.send('ERROR: fbp code should not be null');
            v567;
        }
    };
    const v569 = router.get('/api/gen-svg', v568);
    v569;
    const v610 = function (req, res) {
        const v570 = jConf.journal_access;
        const v571 = v570 === true;
        if (v571) {
            const v572 = require('child_process');
            var spawn = v572.spawn;
            var stdout = '';
            var error = false;
            const v573 = req.query;
            var unit_name = v573.unit_name;
            var child;
            const v574 = !unit_name;
            if (v574) {
                const v575 = [
                    '-o',
                    'json-pretty',
                    '-n',
                    '100',
                    '--no-pager'
                ];
                child = spawn('journalctl', v575);
                const v576 = function (err) {
                    error = true;
                };
                const v577 = child.on('error', v576);
                v577;
                const v578 = child.stdout;
                const v579 = function (data) {
                    stdout += data;
                };
                const v580 = v578.on('data', v579);
                v580;
                const v581 = child.stderr;
                const v582 = function (data) {
                    error = true;
                };
                const v583 = v581.on('data', v582);
                v583;
                const v588 = function (code) {
                    const v584 = !error;
                    if (v584) {
                        const v585 = current_user(req);
                        var parsed = parseJournaldToJSON(v585, stdout);
                        const v586 = res.send(parsed);
                        v586;
                    } else {
                        const v587 = res.send('Unable to get journald, it may be empty.');
                        v587;
                    }
                };
                const v589 = child.on('close', v588);
                v589;
            } else {
                const v590 = scripts_dir();
                var script = v590 + '/journalctl-unit.sh';
                const v591 = current_user(req);
                const v592 = env_file(v591);
                const v593 = [v592];
                child = spawn(script, v593);
                const v594 = function (err) {
                    error = true;
                };
                const v595 = child.on('error', v594);
                v595;
                const v596 = child.stdout;
                const v597 = function (data) {
                    stdout += data;
                };
                const v598 = v596.on('data', v597);
                v598;
                const v599 = child.stderr;
                const v600 = function (data) {
                    error = true;
                };
                const v601 = v599.on('data', v600);
                v601;
                const v606 = function (code) {
                    const v602 = !error;
                    if (v602) {
                        const v603 = current_user(req);
                        var parsed = parseJournaldToJSON(v603, stdout);
                        const v604 = res.send(parsed);
                        v604;
                    } else {
                        const v605 = res.send('Unable to get journald, it may be empty.');
                        v605;
                    }
                };
                const v607 = child.on('close', v606);
                v607;
            }
        } else {
            const v608 = res.status(404);
            const v609 = v608.send('Unsupported api');
            v609;
        }
    };
    const v611 = router.get('/api/journald', v610);
    v611;
    const v636 = function (req, res) {
        const v612 = req.query;
        var file_path = v612.file_path;
        const v613 = req.query;
        var file_body = v613.file_body;
        const v614 = isInsideRepo(file_path);
        const v615 = !v614;
        const v616 = !file_body;
        const v617 = v615 || v616;
        if (v617) {
            const v618 = res.status(400);
            const v619 = v618.send('Failed to get file path or its body');
            v619;
        } else {
            var hidden_fbp = generateHiddenPath(file_path);
            if (hidden_fbp) {
                const v620 = writeFile(file_path, file_body);
                const v621 = !v620;
                if (v621) {
                    const v622 = 'rm -f ' + hidden_fbp;
                    const v624 = function (returns) {
                        const v623 = res.sendStatus(0);
                        v623;
                    };
                    const v625 = execOnServer(v622, v624);
                    v625;
                } else {
                    const v626 = res.status(400);
                    const v627 = file_path.split('/');
                    const v628 = v627.pop();
                    const v629 = 'Failed to write file ' + v628;
                    const v630 = v626.send(v629);
                    v630;
                }
            } else {
                const v631 = res.status(400);
                const v632 = file_path.split('/');
                const v633 = v632.pop();
                const v634 = 'Failed to write file ' + v633;
                const v635 = v631.send(v634);
                v635;
            }
        }
    };
    const v637 = router.get('/api/file/write', v636);
    v637;
    const v696 = function (req, res) {
        const v638 = jConf.run_fbp_access;
        const v639 = v638 === true;
        if (v639) {
            const v640 = require('child_process');
            var exec = v640.exec;
            const v641 = req.body;
            const v642 = v641.params;
            var path = v642.fbp_path;
            const v643 = req.body;
            const v644 = v643.params;
            var code = v644.code;
            const v645 = req.body;
            const v646 = v645.params;
            var conf = v646.conf;
            const v647 = isInsideRepo(path);
            const v648 = !v647;
            const v649 = !code;
            const v650 = v648 || v649;
            if (v650) {
                const v651 = res.sendStatus(1);
                v651;
            } else {
                var child;
                var err;
                var stdout = '';
                const v652 = scripts_dir();
                var script = v652 + '/fbp-runner.sh';
                var fbp_path = generateHiddenPath(path);
                if (fbp_path) {
                    err = writeFile(fbp_path, code);
                    const v653 = script + ' start ';
                    const v654 = current_user(req);
                    const v655 = env_file(v654);
                    const v656 = v653 + v655;
                    const v657 = v656 + ' ';
                    script = v657 + fbp_path;
                    if (conf) {
                        const v658 = current_user(req);
                        const v659 = env_file(v658);
                        const v660 = 'FBP_FILE="' + fbp_path;
                        const v661 = v660 + '"\n';
                        const v662 = v661 + 'SOL_FLOW_MODULE_RESOLVER_CONFFILE="';
                        const v663 = v662 + conf;
                        const v664 = v663 + '"';
                        err = writeFile(v659, v664);
                    } else {
                        const v665 = current_user(req);
                        const v666 = env_file(v665);
                        const v667 = 'FBP_FILE="' + fbp_path;
                        const v668 = v667 + '"\n';
                        const v669 = v668 + 'SOL_FLOW_MODULE_RESOLVER_CONFFILE=""';
                        err = writeFile(v666, v669);
                    }
                    const v670 = !err;
                    if (v670) {
                        const v671 = current_user(req);
                        const v688 = function (error) {
                            const v672 = 'sh ' + script;
                            child = exec(v672);
                            const v673 = child.stdout;
                            const v676 = function (data) {
                                stdout += data;
                                const v674 = 'stdout: ' + data;
                                const v675 = console.log(v674);
                                v675;
                            };
                            const v677 = v673.on('data', v676);
                            v677;
                            const v678 = child.stderr;
                            const v681 = function (data) {
                                const v679 = 'stderr: ' + data;
                                const v680 = console.log(v679);
                                v680;
                            };
                            const v682 = v678.on('data', v681);
                            v682;
                            const v686 = function (code) {
                                const v683 = 'closing code: ' + code;
                                const v684 = console.log(v683);
                                v684;
                                var array_path = fbp_path.split('/');
                                runningFBPName = array_path.pop();
                                const v685 = res.sendStatus(code);
                                v685;
                            };
                            const v687 = child.on('close', v686);
                            v687;
                        };
                        const v689 = getConfigureFile(v671, conf, v688);
                        v689;
                    } else {
                        const v690 = res.status(404);
                        const v691 = v690.send('Failed to write envrioment file');
                        v691;
                    }
                } else {
                    const v692 = res.status(404);
                    const v693 = v692.send('Failed to get FBP file');
                    v693;
                }
            }
        } else {
            const v694 = res.status(404);
            const v695 = v694.send('Unsupported api');
            v695;
        }
    };
    const v697 = router.post('/api/fbp/run', v696);
    v697;
    const v735 = function (req, res) {
        const v698 = require('child_process');
        var spawn = v698.spawn;
        const v699 = req.query;
        var path = v699.fbp_path;
        const v700 = req.query;
        var code = v700.code;
        const v701 = req.query;
        var conf = v701.conf;
        const v702 = isInsideRepo(path);
        const v703 = !v702;
        const v704 = !code;
        const v705 = v703 || v704;
        if (v705) {
            const v706 = res.send('Error: FBP path or code is not valid');
            v706;
        } else {
            var child;
            var error;
            var stdout = '';
            var fbp_path = generateHiddenPath(path);
            if (fbp_path) {
                var err = writeFile(fbp_path, code);
                if (err) {
                    const v707 = console.log('Write File error');
                    v707;
                    const v708 = res.send(err);
                    v708;
                }
                const v709 = 'Running command sol-fbp-runner -c ' + fbp_path;
                const v710 = console.log(v709);
                v710;
                if (conf) {
                    const v711 = [
                        '-c',
                        fbp_path
                    ];
                    const v712 = {};
                    v712.SOL_FLOW_MODULE_RESOLVER_CONFFILE = conf;
                    const v713 = { env: v712 };
                    child = spawn('sol-fbp-runner', v711, v713);
                } else {
                    const v714 = [
                        '-c',
                        fbp_path
                    ];
                    child = spawn('sol-fbp-runner', v714);
                }
                const v715 = function (err) {
                    error = true;
                };
                const v716 = child.on('error', v715);
                v716;
                const v717 = child.stdout;
                const v720 = function (data) {
                    stdout += 'Syntax OK';
                    const v718 = 'stdout: ' + data;
                    const v719 = console.log(v718);
                    v719;
                };
                const v721 = v717.on('data', v720);
                v721;
                const v722 = child.stderr;
                const v725 = function (data) {
                    const v723 = 'stderr: ' + data;
                    const v724 = console.log(v723);
                    v724;
                    if (data) {
                        if (stdout) {
                            stdout += data;
                        } else {
                            stdout += '\n' + data;
                        }
                    } else {
                        stdout = 'Unidentified error.';
                    }
                };
                const v726 = v722.on('data', v725);
                v726;
                const v732 = function (code) {
                    const v727 = !error;
                    if (v727) {
                        const v728 = 'closing code: ' + code;
                        const v729 = console.log(v728);
                        v729;
                        const v730 = res.sendStatus(stdout);
                        v730;
                    } else {
                        const v731 = res.sendStatus('Failed to run command on server');
                        v731;
                    }
                };
                const v733 = child.on('close', v732);
                v733;
            } else {
                const v734 = res.sendStatus('Invalid FBP file or path.');
                v734;
            }
        }
    };
    const v736 = router.get('/api/check/fbp', v735);
    v736;
    const v780 = function (req, res) {
        const v737 = req.body;
        const v738 = v737.params;
        var repo_url = v738.repo_url;
        const v739 = !repo_url;
        if (v739) {
            const v740 = res.status(400);
            const v741 = 'Failed to get repository owner  or ' + 'repository names or its path.';
            const v742 = v740.send(v741);
            v742;
        } else {
            var fs = require('fs');
            var repo_name = getRepoName(repo_url);
            var server_name = getServerName(repo_url);
            const v743 = current_user(req);
            const v744 = home_dir(v743);
            const v745 = v744 + server_name;
            const v746 = v745 + '/';
            var repo_path = v746 + repo_name;
            const v747 = current_user(req);
            const v748 = tmp_dir(v747);
            const v749 = v748 + server_name;
            const v750 = v749 + '/';
            var tmp_path = v750 + repo_name;
            const v751 = 'rm -rf ' + tmp_path;
            const v778 = function (returns) {
                const v752 = returns.error;
                const v753 = v752 === true;
                if (v753) {
                    const v754 = res.status(400);
                    const v755 = returns.message;
                    const v756 = v754.send(v755);
                    v756;
                } else {
                    const v757 = 'git clone --quiet ' + repo_url;
                    const v758 = v757 + ' ';
                    const v759 = v758 + tmp_path;
                    const v776 = function (returns) {
                        const v760 = returns.error;
                        const v761 = v760 === true;
                        if (v761) {
                            const v762 = res.status(400);
                            const v763 = returns.message;
                            const v764 = v762.send(v763);
                            v764;
                        } else {
                            const v765 = 'mkdir -p ' + repo_path;
                            const v766 = v765 + ' && cp -r ';
                            const v767 = v766 + tmp_path;
                            const v768 = v767 + '/* ';
                            const v769 = v768 + repo_path;
                            const v770 = v769 + ' && rm -rf /tmp/';
                            const v771 = v770 + server_name;
                            const v774 = function (returns) {
                                const v772 = returns.message;
                                const v773 = res.send(v772);
                                v773;
                            };
                            const v775 = execOnServer(v771, v774);
                            v775;
                        }
                    };
                    const v777 = execOnServer(v759, v776);
                    v777;
                }
            };
            const v779 = execOnServer(v751, v778);
            v779;
        }
    };
    const v781 = router.post('/api/git/repo/sync', v780);
    v781;
    const v844 = function (req, res) {
        const v782 = req.body;
        const v783 = v782.params;
        var commit_message = v783.commit_message;
        const v784 = req.body;
        const v785 = v784.params;
        var branch = v785.branch;
        const v786 = req.body;
        const v787 = v786.params;
        var user = v787.user;
        const v788 = req.body;
        const v789 = v788.params;
        var pass = v789.password;
        const v790 = req.body;
        const v791 = v790.params;
        var repo = v791.repo;
        const v792 = req.body;
        const v793 = v792.params;
        var repo_owner = v793.repo_owner;
        var github = require('octonode');
        var path = require('path');
        const v794 = current_user(req);
        var _p = home_dir(v794);
        const v795 = _p + '/';
        const v796 = v795 + repo_owner;
        const v797 = v796 + '/';
        var git_dir = v797 + repo;
        const v798 = {
            username: user,
            password: pass
        };
        var client = github.client(v798);
        const v842 = function (err, status, body) {
            const v799 = typeof status;
            const v800 = v799 === 'undefined';
            if (v800) {
                const v801 = res.status(400);
                const v802 = v801.send('Verify login or password');
                v802;
            } else {
                const v803 = typeof status;
                const v804 = v803 === 'undefined';
                if (v804) {
                    const v805 = res.status(404);
                    const v806 = v805.send('Error: File not found on github');
                    v806;
                } else {
                    const v807 = 'git --git-dir=' + git_dir;
                    const v808 = v807 + '/.git add .';
                    const v840 = function (returns) {
                        const v809 = returns.error;
                        const v810 = v809 === true;
                        if (v810) {
                            const v811 = res.status(400);
                            const v812 = v811.send('Failed to run command on server');
                            v812;
                        } else {
                            const v813 = 'git --git-dir=' + git_dir;
                            const v814 = v813 + '/.git commit -m "';
                            const v815 = v814 + commit_message;
                            const v816 = v815 + '"';
                            const v838 = function (returns) {
                                const v817 = returns.error;
                                const v818 = v817 === true;
                                if (v818) {
                                    const v819 = res.status(400);
                                    const v820 = v819.send('Failed to run command on server');
                                    v820;
                                } else {
                                    const v821 = 'git --git-dir=' + git_dir;
                                    const v822 = v821 + '/.git push https://';
                                    const v823 = v822 + user;
                                    const v824 = v823 + ':';
                                    const v825 = v824 + pass;
                                    const v826 = v825 + '@github.com/';
                                    const v827 = v826 + repo_owner;
                                    const v828 = v827 + '/';
                                    const v829 = v828 + repo;
                                    const v830 = v829 + '.git';
                                    const v836 = function (returns) {
                                        const v831 = returns.error;
                                        const v832 = v831 === true;
                                        if (v832) {
                                            const v833 = res.status(400);
                                            const v834 = v833.send('Failed to run command on server');
                                            v834;
                                        } else {
                                            const v835 = res.sendStatus(0);
                                            v835;
                                        }
                                    };
                                    const v837 = execOnServer(v830, v836);
                                    v837;
                                }
                            };
                            const v839 = execOnServer(v816, v838);
                            v839;
                        }
                    };
                    const v841 = execOnServer(v808, v840);
                    v841;
                }
            }
        };
        const v843 = client.get('/user', v842);
        v843;
    };
    const v845 = router.post('/api/git/repo/commit', v844);
    v845;
    const v863 = function (req, res) {
        const v846 = req.body;
        const v847 = v846.params;
        var project_name = v847.project_name;
        const v848 = !project_name;
        if (v848) {
            const v849 = res.status(400);
            const v850 = v849.send('Failed to get project name');
            v850;
        }
        const v851 = current_user(req);
        const v852 = home_dir(v851);
        const v853 = 'mkdir ' + v852;
        const v854 = v853 + project_name;
        const v861 = function (returns) {
            const v855 = returns.error;
            const v856 = v855 === true;
            if (v856) {
                const v857 = res.status(400);
                const v858 = v857.send('Failed to run command on server');
                v858;
            } else {
                const v859 = returns.message;
                const v860 = res.send(v859);
                v860;
            }
        };
        const v862 = execOnServer(v854, v861);
        v862;
    };
    const v864 = router.post('/api/git/repo/create/project', v863);
    v864;
    const v882 = function (req, res) {
        const v865 = req.body;
        const v866 = v865.params;
        var folder_path = v866.folder_path;
        const v867 = !folder_path;
        if (v867) {
            const v868 = res.status(400);
            const v869 = v868.send('Failed to get folder path and its name');
            v869;
        }
        const v870 = isInsideRepo(folder_path);
        if (v870) {
            const v871 = 'mkdir ' + folder_path;
            const v878 = function (returns) {
                const v872 = returns.error;
                const v873 = v872 === true;
                if (v873) {
                    const v874 = res.status(400);
                    const v875 = v874.send('Failed to run command on server');
                    v875;
                } else {
                    const v876 = returns.message;
                    const v877 = res.send(v876);
                    v877;
                }
            };
            const v879 = execOnServer(v871, v878);
            v879;
        } else {
            const v880 = res.status(400);
            const v881 = v880.send('Error: folder path is not valid.');
            v881;
        }
    };
    const v883 = router.post('/api/git/repo/create/folder', v882);
    v883;
    const v901 = function (req, res) {
        const v884 = req.body;
        const v885 = v884.params;
        var file_path = v885.file_path;
        const v886 = !file_path;
        if (v886) {
            const v887 = res.status(400);
            const v888 = v887.send('Failed to get file path and its name');
            v888;
        }
        const v889 = isInsideRepo(file_path);
        if (v889) {
            const v890 = 'touch ' + file_path;
            const v897 = function (returns) {
                const v891 = returns.error;
                const v892 = v891 === true;
                if (v892) {
                    const v893 = res.status(400);
                    const v894 = v893.send('Failed to run command on server');
                    v894;
                } else {
                    const v895 = returns.message;
                    const v896 = res.send(v895);
                    v896;
                }
            };
            const v898 = execOnServer(v890, v897);
            v898;
        } else {
            const v899 = res.status(400);
            const v900 = v899.send('Error: file path is not valid.');
            v900;
        }
    };
    const v902 = router.post('/api/git/repo/create/file', v901);
    v902;
    const v920 = function (req, res) {
        const v903 = req.body;
        const v904 = v903.params;
        var file_path = v904.file_path;
        const v905 = !file_path;
        if (v905) {
            const v906 = res.status(400);
            const v907 = v906.send('Failed to get file path and its name');
            v907;
        } else {
            const v908 = isInsideRepo(file_path);
            if (v908) {
                const v909 = 'rm -rf ' + file_path;
                const v916 = function (returns) {
                    const v910 = returns.error;
                    const v911 = v910 === true;
                    if (v911) {
                        const v912 = res.status(400);
                        const v913 = v912.send('Failed to run command on server');
                        v913;
                    } else {
                        const v914 = returns.message;
                        const v915 = res.send(v914);
                        v915;
                    }
                };
                const v917 = execOnServer(v909, v916);
                v917;
            } else {
                const v918 = res.status(400);
                const v919 = v918.send('Failed to run command on server');
                v919;
            }
        }
    };
    const v921 = router.post('/api/git/repo/delete/file', v920);
    v921;
    const v926 = function (req, res) {
        try {
            const v922 = getConfigurationJson();
            const v923 = res.send(v922);
            v923;
        } catch (err) {
            const v924 = res.status(400);
            const v925 = v924.send(err);
            v925;
        }
    };
    const v927 = router.get('/api/configuration', v926);
    v927;
    const v943 = function (req, res) {
        const v928 = jConf.run_fbp_access;
        const v929 = v928 === true;
        if (v929) {
            const v930 = require('child_process');
            var exec = v930.exec;
            var child;
            const v931 = scripts_dir();
            var script = v931 + '/fbp-runner.sh';
            const v932 = script + ' stop ';
            const v933 = current_user(req);
            const v934 = env_file(v933);
            script = v932 + v934;
            const v935 = 'sh ' + script;
            child = exec(v935);
            const v939 = function (code) {
                const v936 = 'closing code: ' + code;
                const v937 = console.log(v936);
                v937;
                const v938 = res.sendStatus(code);
                v938;
            };
            const v940 = child.on('close', v939);
            v940;
        } else {
            const v941 = res.status(404);
            const v942 = v941.send('Unsupported api');
            v942;
        }
    };
    const v944 = router.post('/api/fbp/stop', v943);
    v944;
    module.exports = router;
};
const v946 = v945();
v946;