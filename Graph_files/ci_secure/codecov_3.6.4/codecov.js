var fs = require('fs');
var path = require('path');
const v477 = require('teeny-request');
var request = v477.teenyRequest;
var urlgrey = require('urlgrey');
var jsYaml = require('js-yaml');
var walk = require('ignore-walk');
const v478 = require('child_process');
var execFileSync = v478.execFileSync;
const v479 = require('child_process');
var execSync = v479.execSync;
var detectProvider = require('./detect');
const v480 = require('../package.json');
const v481 = v480.version;
var version = 'v' + v481;
var patterns = '';
var more_patterns = '';
var winPatterns = '';
const v482 = process.platform;
const v483 = v482.match(/win32/);
const v484 = process.platform;
const v485 = v484.match(/win64/);
var isWindows = v483 || v485;
const v486 = !isWindows;
if (v486) {
    const v487 = '-type f -name \'*coverage.*\' ' + '-or -name \'nosetests.xml\' ';
    const v488 = v487 + '-or -name \'jacoco*.xml\' ';
    const v489 = v488 + '-or -name \'clover.xml\' ';
    const v490 = v489 + '-or -name \'report.xml\' ';
    const v491 = v490 + '-or -name \'cobertura.xml\' ';
    const v492 = v491 + '-or -name \'luacov.report.out\' ';
    const v493 = v492 + '-or -name \'lcov.info\' ';
    const v494 = v493 + '-or -name \'*.lcov\' ';
    const v495 = v494 + '-or -name \'gcov.info\' ';
    const v496 = v495 + '-or -name \'*.gcov\' ';
    const v497 = v496 + '-or -name \'*.lst\' ';
    const v498 = v497 + '-not -name \'*.sh\' ';
    const v499 = v498 + '-not -name \'*.data\' ';
    const v500 = v499 + '-not -name \'*.py\' ';
    const v501 = v500 + '-not -name \'*.class\' ';
    const v502 = v501 + '-not -name \'*.xcconfig\' ';
    const v503 = v502 + '-not -name \'Coverage.profdata\' ';
    const v504 = v503 + '-not -name \'phpunit-code-coverage.xml\' ';
    const v505 = v504 + '-not -name \'coverage.serialized\' ';
    const v506 = v505 + '-not -name \'*.pyc\' ';
    const v507 = v506 + '-not -name \'*.cfg\' ';
    const v508 = v507 + '-not -name \'*.egg\' ';
    const v509 = v508 + '-not -name \'*.whl\' ';
    const v510 = v509 + '-not -name \'*.html\' ';
    const v511 = v510 + '-not -name \'*.js\' ';
    const v512 = v511 + '-not -name \'*.cpp\' ';
    const v513 = v512 + '-not -name \'coverage.jade\' ';
    const v514 = v513 + '-not -name \'include.lst\' ';
    const v515 = v514 + '-not -name \'inputFiles.lst\' ';
    const v516 = v515 + '-not -name \'createdFiles.lst\' ';
    const v517 = v516 + '-not -name \'coverage.html\' ';
    const v518 = v517 + '-not -name \'scoverage.measurements.*\' ';
    const v519 = v518 + '-not -name \'test_*_coverage.txt\' ';
    const v520 = v519 + '-not -path \'*/vendor/*\' ';
    const v521 = v520 + '-not -path \'*/htmlcov/*\' ';
    const v522 = v521 + '-not -path \'*/home/cainus/*\' ';
    const v523 = v522 + '-not -path \'*/virtualenv/*\' ';
    const v524 = v523 + '-not -path \'*/js/generated/coverage/*\' ';
    const v525 = v524 + '-not -path \'*/.virtualenv/*\' ';
    const v526 = v525 + '-not -path \'*/virtualenvs/*\' ';
    const v527 = v526 + '-not -path \'*/.virtualenvs/*\' ';
    const v528 = v527 + '-not -path \'*/.env/*\' ';
    const v529 = v528 + '-not -path \'*/.envs/*\' ';
    const v530 = v529 + '-not -path \'*/env/*\' ';
    const v531 = v530 + '-not -path \'*/envs/*\' ';
    const v532 = v531 + '-not -path \'*/.venv/*\' ';
    const v533 = v532 + '-not -path \'*/.venvs/*\' ';
    const v534 = v533 + '-not -path \'*/venv/*\' ';
    const v535 = v534 + '-not -path \'*/venvs/*\' ';
    const v536 = v535 + '-not -path \'*/.git/*\' ';
    const v537 = v536 + '-not -path \'*/.hg/*\' ';
    const v538 = v537 + '-not -path \'*/.tox/*\' ';
    const v539 = v538 + '-not -path \'*/__pycache__/*\' ';
    const v540 = v539 + '-not -path \'*/.egg-info*\' ';
    const v541 = v540 + '-not -path \'*/$bower_components/*\' ';
    const v542 = v541 + '-not -path \'*/node_modules/*\' ';
    const v543 = v542 + '-not -path \'*/conftest_*.c.gcov\'';
    patterns = v543.split(' ');
} else {
    const v544 = '/a:-d /b /s *coverage.* ' + '/s nosetests.xml ';
    const v545 = v544 + '/s jacoco*.xml ';
    const v546 = v545 + '/s clover.xml ';
    const v547 = v546 + '/s report.xml ';
    const v548 = v547 + '/s cobertura.xml ';
    const v549 = v548 + '/s luacov.report.out ';
    const v550 = v549 + '/s lcov.info ';
    const v551 = v550 + '/s *.lcov ';
    const v552 = v551 + '/s gcov.info ';
    const v553 = v552 + '/s *.gcov ';
    const v554 = v553 + '/s *.lst';
    const v555 = v554 + '| findstr /i /v \\.sh$ ';
    const v556 = v555 + '| findstr /i /v \\.data$ ';
    const v557 = v556 + '| findstr /i /v \\.py$ ';
    const v558 = v557 + '| findstr /i /v \\.class$ ';
    const v559 = v558 + '| findstr /i /v \\.xcconfig$ ';
    const v560 = v559 + '| findstr /i /v Coverage\\.profdata$ ';
    const v561 = v560 + '| findstr /i /v phpunit-code-coverage\\.xml$ ';
    const v562 = v561 + '| findstr /i /v coverage\\.serialized$ ';
    const v563 = v562 + '| findstr /i /v \\.pyc$ ';
    const v564 = v563 + '| findstr /i /v \\.cfg$ ';
    const v565 = v564 + '| findstr /i /v \\.egg$ ';
    const v566 = v565 + '| findstr /i /v \\.whl$ ';
    const v567 = v566 + '| findstr /i /v \\.html$ ';
    const v568 = v567 + '| findstr /i /v \\.js$ ';
    const v569 = v568 + '| findstr /i /v \\.cpp$ ';
    const v570 = v569 + '| findstr /i /v coverage\\.jade$ ';
    const v571 = v570 + '| findstr /i /v include\\.lst$ ';
    const v572 = v571 + '| findstr /i /v inputFiles\\.lst$ ';
    const v573 = v572 + '| findstr /i /v createdFiles\\.lst$ ';
    const v574 = v573 + '| findstr /i /v coverage\\.html$ ';
    const v575 = v574 + '| findstr /i /v scoverage\\.measurements\\..* ';
    const v576 = v575 + '| findstr /i /v test_.*_coverage\\.txt ';
    const v577 = v576 + '| findstr /i /v \\vendor\\ ';
    const v578 = v577 + '| findstr /i /v \\htmlcov\\ ';
    const v579 = v578 + '| findstr /i /v \\home\\cainus\\ ';
    const v580 = v579 + '| findstr /i /v \\js\\generated\\coverage\\ ';
    const v581 = v580 + '| findstr /i /v \\virtualenv\\ ';
    const v582 = v581 + '| findstr /i /v \\virtualenvs\\ ';
    const v583 = v582 + '| findstr /i /v \\\\.virtualenv\\ ';
    const v584 = v583 + '| findstr /i /v \\\\.virtualenvs\\ ';
    const v585 = v584 + '| findstr /i /v \\\\.env\\ ';
    const v586 = v585 + '| findstr /i /v \\\\.envs\\ ';
    const v587 = v586 + '| findstr /i /v \\env\\ ';
    const v588 = v587 + '| findstr /i /v \\envs\\ ';
    const v589 = v588 + '| findstr /i /v \\\\.venv\\ ';
    const v590 = v589 + '| findstr /i /v \\\\.venvs\\ ';
    const v591 = v590 + '| findstr /i /v \\venv\\ ';
    const v592 = v591 + '| findstr /i /v \\venvs\\ ';
    const v593 = v592 + '| findstr /i /v \\\\.git\\ ';
    const v594 = v593 + '| findstr /i /v \\\\.hg\\ ';
    const v595 = v594 + '| findstr /i /v \\\\.tox\\ ';
    const v596 = v595 + '| findstr /i /v \\__pycache__\\ ';
    const v597 = v596 + '| findstr /i /v \\\\.egg-info* ';
    const v598 = v597 + '| findstr /i /v \\\\$bower_components\\ ';
    const v599 = v598 + '| findstr /i /v \\node_modules\\ ';
    const v600 = v599 + '| findstr /i /v \\conftest_.*\\.c\\.gcov ';
    winPatterns = v600.split(' ');
}
var sendToCodecovV2 = function (codecov_endpoint, query, upload_body, on_success, on_failure) {
    const v601 = codecov_endpoint + '/upload/v2';
    const v602 = urlgrey(v601);
    const v603 = v602.query(query);
    const v604 = v603.toString();
    const v605 = {};
    v605['Content-Type'] = 'text/plain';
    v605.Accept = 'text/plain';
    const v606 = {
        uri: v604,
        method: 'POST',
        body: upload_body,
        headers: v605
    };
    const v627 = function (err, response) {
        const v607 = response.statusCode;
        const v608 = v607 !== 200;
        const v609 = err || v608;
        if (v609) {
            const v610 = response.body;
            const v611 = err || v610;
            const v612 = '    ' + v611;
            const v613 = console.log(v612);
            v613;
            const v614 = response.statusCode;
            const v615 = response.body;
            const v616 = on_failure(v614, v615);
            const v617 = err.code;
            const v618 = err.message;
            const v619 = on_failure(v617, v618);
            let v620;
            if (response) {
                v620 = v616;
            } else {
                v620 = v619;
            }
            return v620;
        } else {
            const v621 = console.log('    Success!');
            v621;
            const v622 = response.body;
            const v623 = '    View report at: ' + v622;
            const v624 = console.log(v623);
            v624;
            const v625 = response.body;
            const v626 = on_success(v625);
            return v626;
        }
    };
    const v628 = request(v606, v627);
    v628;
};
var sendToCodecovV3 = function (codecov_endpoint, query, upload_body, on_success, on_failure) {
    const v629 = codecov_endpoint + '/upload/v4';
    const v630 = urlgrey(v629);
    const v631 = v630.query(query);
    const v632 = v631.toString();
    const v633 = {};
    v633['Content-Type'] = 'text/plain';
    v633.Accept = 'text/plain';
    const v634 = {
        uri: v632,
        method: 'POST',
        body: '',
        headers: v633
    };
    const v648 = function (err, response, result) {
        if (err) {
            const v635 = sendToCodecovV2(codecov_endpoint, query, upload_body, on_success, on_failure);
            v635;
        } else {
            const v636 = result.split('\n');
            var codecov_report_url = v636[0];
            const v637 = result.split('\n');
            const v638 = v637[1];
            const v639 = {};
            v639['Content-Type'] = 'text/plain';
            const v640 = {
                uri: v638,
                method: 'PUT',
                body: upload_body,
                headers: v639
            };
            const v646 = function (err) {
                if (err) {
                    const v641 = sendToCodecovV2(codecov_endpoint, query, upload_body, on_success, on_failure);
                    v641;
                } else {
                    const v642 = console.log('    Success!');
                    v642;
                    const v643 = '    View report at: ' + codecov_report_url;
                    const v644 = console.log(v643);
                    v644;
                    const v645 = on_success(codecov_report_url);
                    v645;
                }
            };
            const v647 = request(v640, v646);
            v647;
        }
    };
    const v649 = request(v634, v648);
    v649;
};
var upload = function (args, on_success, on_failure) {
    const v650 = args.options;
    const v651 = v650.url;
    const v652 = process.env;
    const v653 = v652.codecov_url;
    const v654 = v651 || v653;
    const v655 = process.env;
    const v656 = v655.CODECOV_URL;
    const v657 = v654 || v656;
    var codecov_endpoint = v657 || 'https://codecov.io';
    var query = {};
    var debug = [];
    const v658 = args.options;
    const v659 = v658.yml;
    const v660 = process.env;
    const v661 = v660.codecov_yml;
    const v662 = v659 || v661;
    const v663 = process.env;
    const v664 = v663.CODECOV_YML;
    const v665 = v662 || v664;
    var yamlFile = v665 || 'codecov.yml';
    const v666 = '' + '  _____          _  \n';
    const v667 = v666 + ' / ____|        | |  \n';
    const v668 = v667 + '| |     ___   __| | ___  ___ _____   __  \n';
    const v669 = v668 + '| |    / _ \\ / _` |/ _ \\/ __/ _ \\ \\ / /  \n';
    const v670 = v669 + '| |___| (_) | (_| |  __/ (_| (_) \\ V /  \n';
    const v671 = v670 + ' \\_____\\___/ \\__,_|\\___|\\___\\___/ \\_/  \n';
    const v672 = v671 + '                                ';
    const v673 = v672 + version;
    const v674 = console.log(v673);
    v674;
    const v675 = args.options;
    const v676 = v675.disable;
    const v677 = v676 || '';
    const v678 = v677.split(',');
    const v679 = v678.indexOf('detect');
    const v680 = -1;
    const v681 = v679 === v680;
    if (v681) {
        const v682 = console.log('==> Detecting CI Provider');
        v682;
        query = detectProvider();
    } else {
        const v683 = debug.push('disabled detect');
        v683;
    }
    const v684 = [
        yamlFile,
        '.codecov.yml'
    ];
    const v692 = function (result, file) {
        const v685 = process.cwd();
        const v686 = path.resolve(v685, file);
        const v687 = fs.existsSync(v686);
        const v688 = process.cwd();
        const v689 = path.resolve(v688, file);
        let v690;
        if (v687) {
            v690 = v689;
        } else {
            v690 = undefined;
        }
        const v691 = result || v690;
        return v691;
    };
    const v693 = v684.reduce(v692, undefined);
    query.yaml = v693;
    const v694 = args.options;
    const v695 = v694.build;
    if (v695) {
        const v696 = args.options;
        const v697 = v696.build;
        query.build = v697;
    }
    const v698 = args.options;
    const v699 = v698.commit;
    if (v699) {
        const v700 = args.options;
        const v701 = v700.commit;
        query.commit = v701;
    }
    const v702 = args.options;
    const v703 = v702.branch;
    if (v703) {
        const v704 = args.options;
        const v705 = v704.branch;
        query.branch = v705;
    }
    const v706 = args.options;
    const v707 = v706.slug;
    if (v707) {
        const v708 = args.options;
        const v709 = v708.slug;
        query.slug = v709;
    }
    const v710 = args.options;
    const v711 = v710.flags;
    const v712 = process.env;
    const v713 = v712.codecov_flags;
    const v714 = v711 || v713;
    const v715 = process.env;
    const v716 = v715.CODECOV_FLAGS;
    var flags = v714 || v716;
    if (flags) {
        query.flags = flags;
    }
    var yamlToken;
    try {
        const v717 = query.yaml;
        const v718 = fs.readFileSync(v717, 'utf8');
        var loadedYamlFile = jsYaml.safeLoad(v718);
        const v719 = loadedYamlFile.codecov;
        const v720 = loadedYamlFile && v719;
        const v721 = loadedYamlFile.codecov;
        const v722 = v721.token;
        yamlToken = v720 && v722;
    } catch (e) {
    }
    const v723 = args.options;
    const v724 = v723.token;
    const v725 = v724 || yamlToken;
    const v726 = process.env;
    const v727 = v726.codecov_token;
    const v728 = v725 || v727;
    const v729 = process.env;
    const v730 = v729.CODECOV_TOKEN;
    var token = v728 || v730;
    if (token) {
        query.token = token;
    }
    query.package = 'node-' + version;
    const v731 = console.log('==> Configuration: ');
    v731;
    const v732 = '    Endpoint: ' + codecov_endpoint;
    const v733 = console.log(v732);
    v733;
    const v734 = query.commit;
    const v735 = query.branch;
    const v736 = query.package;
    const v737 = {
        commit: v734,
        branch: v735,
        package: v736
    };
    const v738 = console.log(v737);
    v738;
    var upload = '';
    var env_found = false;
    const v739 = args.options;
    const v740 = v739.env;
    const v741 = process.env;
    const v742 = v741.CODECOV_ENV;
    const v743 = v740 || v742;
    const v744 = process.env;
    const v745 = v744.codecov_env;
    const v746 = v743 || v745;
    if (v746) {
        const v747 = args.options;
        const v748 = v747.env;
        const v749 = v748 + ',';
        const v750 = process.env;
        const v751 = v750.CODECOV_ENV;
        const v752 = v751 || '';
        const v753 = v749 + v752;
        const v754 = v753 + ',';
        const v755 = process.env;
        const v756 = v755.codecov_env;
        const v757 = v756 || '';
        const v758 = v754 + v757;
        var env = v758.split(',');
        const v759 = env.length;
        var i = v759 - 1;
        let v760 = i >= 0;
        while (v760) {
            const v762 = env[i];
            if (v762) {
                const v763 = env[i];
                const v764 = v763 + '=';
                const v765 = process.env;
                const v766 = env[i];
                const v767 = v765[v766];
                const v768 = v767 || '';
                const v769 = v768.toString();
                const v770 = v764 + v769;
                upload += v770 + '\n';
                env_found = true;
            }
            const v761 = i--;
            v760 = i >= 0;
        }
        if (env_found) {
            upload += '<<<<<< ENV\n';
        }
    }
    const v771 = args.options;
    const v772 = v771.root;
    const v773 = query.root;
    const v774 = v772 || v773;
    const v775 = v774 || '.';
    var root = path.resolve(v775);
    const v776 = console.log('==> Building file structure');
    v776;
    try {
        const v777 = [
            'ls-files',
            '||',
            'hg',
            'locate'
        ];
        const v778 = { cwd: root };
        const v779 = execFileSync('git', v777, v778);
        const v780 = v779.toString();
        const v781 = v780.trim();
        upload += v781 + '\n<<<<<< network\n';
    } catch (err) {
        const v782 = [
            '.gitignore',
            '.hgignore'
        ];
        const v783 = {
            path: root,
            ignoreFiles: v782
        };
        const v784 = walk.sync(v783);
        const v785 = v784.join('\n');
        const v786 = v785.trim();
        upload += v786 + '\n<<<<<< network\n';
    }
    const v787 = args.options;
    const v788 = v787.disable;
    const v789 = v788 || '';
    const v790 = v789.split(',');
    const v791 = v790.indexOf('gcov');
    const v792 = -1;
    const v793 = v791 === v792;
    if (v793) {
        try {
            const v794 = console.log('==> Generating gcov reports (skip via --disable=gcov)');
            v794;
            const v795 = args.options;
            const v796 = v795['gcov-glob'];
            var gcg = v796 || '';
            if (gcg) {
                const v797 = !isWindows;
                if (v797) {
                    const v798 = gcg.split(' ');
                    const v801 = function (p) {
                        const v799 = '-not -path \'' + p;
                        const v800 = v799 + '\'';
                        return v800;
                    };
                    const v802 = v798.map(v801);
                    gcg = v802.join(' ');
                } else {
                    const v803 = gcg.split(' ');
                    const v805 = function (p) {
                        const v804 = '^| findstr /i /v ' + p;
                        return v804;
                    };
                    const v806 = v803.map(v805);
                    gcg = v806.join(' ');
                }
            }
            var gcov;
            const v807 = !isWindows;
            if (v807) {
                const v808 = args.options;
                const v809 = v808['gcov-root'];
                const v810 = sanitizeVar(v809);
                const v811 = v810 || root;
                const v812 = 'find ' + v811;
                const v813 = v812 + ' -type f -name \'*.gcno\' ';
                const v814 = v813 + gcg;
                const v815 = v814 + ' -exec ';
                const v816 = args.options;
                const v817 = v816['gcov-exec'];
                const v818 = sanitizeVar(v817);
                const v819 = v818 || 'gcov';
                const v820 = v815 + v819;
                const v821 = v820 + ' ';
                const v822 = args.options;
                const v823 = v822['gcov-args'];
                const v824 = sanitizeVar(v823);
                const v825 = v824 || '';
                const v826 = v821 + v825;
                gcov = v826 + ' {} +';
            } else {
                const v827 = 'for /f "delims=" %g in (\'dir /a-d /b /s *.gcno ' + gcg;
                const v828 = v827 + '\') do ';
                const v829 = args.options;
                const v830 = v829['gcov-exec'];
                const v831 = sanitizeVar(v830);
                const v832 = v831 || 'gcov';
                const v833 = v828 + v832;
                const v834 = v833 + ' ';
                const v835 = args.options;
                const v836 = v835['gcov-args'];
                const v837 = sanitizeVar(v836);
                const v838 = v837 || '';
                const v839 = v834 + v838;
                gcov = v839 + ' %g';
            }
            const v840 = debug.push(gcov);
            v840;
            const v841 = '    $ ' + gcov;
            const v842 = console.log(v841);
            v842;
            const v843 = execFileSync(gcov);
            v843;
        } catch (e) {
            const v844 = console.log('    Failed to run gcov command.');
            v844;
        }
    } else {
        const v845 = debug.push('disabled gcov');
        v845;
    }
    var bowerrc;
    const v846 = !isWindows;
    if (v846) {
        const v847 = { cwd: root };
        const v848 = execSync('test -f .bowerrc && cat .bowerrc || echo ""', v847);
        const v849 = v848.toString();
        bowerrc = v849.trim();
    } else {
        bowerrc = fs.existsSync('.bowerrc');
    }
    if (bowerrc) {
        const v850 = JSON.parse(bowerrc);
        bowerrc = v850.directory;
        if (bowerrc) {
            const v851 = !isWindows;
            if (v851) {
                const v852 = bowerrc.toString();
                const v853 = v852.replace(/\/$/, '');
                const v854 = ' -not -path \'*/' + v853;
                const v855 = v854 + '/*\'';
                more_patterns = v855.split(' ');
            } else {
                const v856 = bowerrc.toString();
                const v857 = v856.replace(/\/$/, '');
                const v858 = '| findstr /i /v \\' + v857;
                const v859 = v858 + '\\';
                more_patterns = v859.split(' ');
            }
        }
    }
    var files = [];
    var file = null;
    const v860 = args.options;
    const v861 = v860.pipe;
    if (v861) {
        const v862 = args.options;
        const v863 = v862.pipe;
        const v864 = v863.join('');
        const v865 = '# path=piped\n' + v864;
        upload += v865 + '\n<<<<<< EOF\n';
        const v866 = console.log('==> Reading report from stdin');
        v866;
    } else {
        const v867 = args.options;
        const v868 = v867.file;
        if (v868) {
            const v869 = args.options;
            file = v869.file;
            const v870 = console.log('==> Targeting specific file');
            v870;
            try {
                const v871 = '# path=' + file;
                const v872 = v871 + '\n';
                const v873 = fs.readFileSync(file, 'utf8');
                const v874 = v873.toString();
                const v875 = v872 + v874;
                upload += v875 + '\n<<<<<< EOF\n';
                const v876 = '    + ' + file;
                const v877 = console.log(v876);
                v877;
                const v878 = files.push(file);
                v878;
            } catch (e) {
                const v879 = file.split('/');
                const v880 = v879.pop();
                const v881 = 'failed: ' + v880;
                const v882 = debug.push(v881);
                v882;
                const v883 = '    X Failed to read file at ' + file;
                const v884 = console.log(v883);
                v884;
            }
        } else {
            const v885 = args.options;
            const v886 = v885.disable;
            const v887 = v886 || '';
            const v888 = v887.split(',');
            const v889 = v888.indexOf('search');
            const v890 = -1;
            const v891 = v889 === v890;
            if (v891) {
                const v892 = console.log('==> Scanning for reports');
                v892;
                var _files;
                var _findArgs;
                const v893 = !isWindows;
                if (v893) {
                    const v894 = [root];
                    _findArgs = v894.concat(patterns);
                    if (more_patterns) {
                        const v895 = _findArgs.concat(more_patterns);
                        v895;
                    }
                    const v896 = execFileSync('find', _findArgs);
                    const v897 = v896.toString();
                    const v898 = v897.trim();
                    _files = v898.split('\n');
                } else {
                    const v899 = [root];
                    _findArgs = v899.concat(winPatterns);
                    if (more_patterns) {
                        const v900 = _findArgs.concat(more_patterns);
                        v900;
                    }
                    const v901 = winPatterns.join(' ');
                    const v902 = 'dir ' + v901;
                    const v903 = v902 + more_patterns;
                    const v904 = execSync(v903);
                    const v905 = v904.toString();
                    const v906 = v905.trim();
                    _files = v906.split('\r\n');
                }
                if (_files) {
                    const v907 = _files.length;
                    var i2 = v907 - 1;
                    let v908 = i2 >= 0;
                    while (v908) {
                        file = _files[i2];
                        try {
                            const v910 = '# path=' + file;
                            const v911 = v910 + '\n';
                            const v912 = fs.readFileSync(file, 'utf8');
                            const v913 = v912.toString();
                            const v914 = v911 + v913;
                            upload += v914 + '\n<<<<<< EOF\n';
                            const v915 = '    + ' + file;
                            const v916 = console.log(v915);
                            v916;
                            const v917 = files.push(file);
                            v917;
                        } catch (e) {
                            const v918 = file.split('/');
                            const v919 = v918.pop();
                            const v920 = 'failed: ' + v919;
                            const v921 = debug.push(v920);
                            v921;
                            const v922 = '    X Failed to read file at ' + file;
                            const v923 = console.log(v922);
                            v923;
                        }
                        const v909 = i2--;
                        v908 = i2 >= 0;
                    }
                }
            } else {
                const v924 = debug.push('disabled search');
                v924;
            }
        }
    }
    if (files) {
        const v925 = args.options;
        const v926 = v925.dump;
        if (v926) {
            const v927 = console.log('-------- DEBUG START --------');
            v927;
            const v928 = console.log(upload);
            v928;
            const v929 = console.log('-------- DEBUG END --------');
            v929;
        } else {
            const v930 = console.log('==> Uploading reports');
            v930;
            var _upload;
            const v931 = args.options;
            const v932 = v931.disable;
            const v933 = v932 || '';
            const v934 = v933.split(',');
            const v935 = v934.indexOf('s3');
            const v936 = -1;
            const v937 = v935 === v936;
            if (v937) {
                _upload = sendToCodecovV3;
            } else {
                _upload = sendToCodecovV2;
            }
            const v946 = function () {
                const v938 = args.options;
                const v939 = v938.clear;
                if (v939) {
                    const v940 = files.length;
                    var i = v940 - 1;
                    let v941 = i >= 0;
                    while (v941) {
                        try {
                            const v943 = files[i];
                            const v944 = fs.unlinkSync(v943);
                            v944;
                        } catch (e) {
                        }
                        const v942 = i--;
                        v941 = i >= 0;
                    }
                }
                if (on_success) {
                    const v945 = on_success.apply(this, arguments);
                    v945;
                }
            };
            const v947 = function () {
            };
            const v948 = on_failure || v947;
            const v949 = _upload(codecov_endpoint, query, upload, v946, v948);
            v949;
        }
    }
    const v950 = {};
    v950.body = upload;
    v950.files = files;
    v950.query = query;
    v950.debug = debug;
    v950.url = codecov_endpoint;
    return v950;
};
const sanitizeVar = function (arg) {
    const v951 = arg.replace(/&/g, '');
    return v951;
};
const v952 = {};
v952.sanitizeVar = sanitizeVar;
v952.upload = upload;
v952.version = version;
v952.sendToCodecovV2 = sendToCodecovV2;
v952.sendToCodecovV3 = sendToCodecovV3;
module.exports = v952;