var fs = require('fs');
var path = require('path');
const v473 = require('teeny-request');
var request = v473.teenyRequest;
var urlgrey = require('urlgrey');
var jsYaml = require('js-yaml');
var walk = require('ignore-walk');
const v474 = require('child_process');
var execSync = v474.execSync;
var detectProvider = require('./detect');
const v475 = require('../package.json');
const v476 = v475.version;
var version = 'v' + v476;
var patterns;
var more_patterns = '';
const v477 = process.platform;
const v478 = v477.match(/win32/);
const v479 = process.platform;
const v480 = v479.match(/win64/);
var isWindows = v478 || v480;
const v481 = !isWindows;
if (v481) {
    const v482 = '-type f \\( -name \'*coverage.*\' ' + '-or -name \'nosetests.xml\' ';
    const v483 = v482 + '-or -name \'jacoco*.xml\' ';
    const v484 = v483 + '-or -name \'clover.xml\' ';
    const v485 = v484 + '-or -name \'report.xml\' ';
    const v486 = v485 + '-or -name \'cobertura.xml\' ';
    const v487 = v486 + '-or -name \'luacov.report.out\' ';
    const v488 = v487 + '-or -name \'lcov.info\' ';
    const v489 = v488 + '-or -name \'*.lcov\' ';
    const v490 = v489 + '-or -name \'gcov.info\' ';
    const v491 = v490 + '-or -name \'*.gcov\' ';
    const v492 = v491 + '-or -name \'*.lst\' \\) ';
    const v493 = v492 + '-not -name \'*.sh\' ';
    const v494 = v493 + '-not -name \'*.data\' ';
    const v495 = v494 + '-not -name \'*.py\' ';
    const v496 = v495 + '-not -name \'*.class\' ';
    const v497 = v496 + '-not -name \'*.xcconfig\' ';
    const v498 = v497 + '-not -name \'Coverage.profdata\' ';
    const v499 = v498 + '-not -name \'phpunit-code-coverage.xml\' ';
    const v500 = v499 + '-not -name \'coverage.serialized\' ';
    const v501 = v500 + '-not -name \'*.pyc\' ';
    const v502 = v501 + '-not -name \'*.cfg\' ';
    const v503 = v502 + '-not -name \'*.egg\' ';
    const v504 = v503 + '-not -name \'*.whl\' ';
    const v505 = v504 + '-not -name \'*.html\' ';
    const v506 = v505 + '-not -name \'*.js\' ';
    const v507 = v506 + '-not -name \'*.cpp\' ';
    const v508 = v507 + '-not -name \'coverage.jade\' ';
    const v509 = v508 + '-not -name \'include.lst\' ';
    const v510 = v509 + '-not -name \'inputFiles.lst\' ';
    const v511 = v510 + '-not -name \'createdFiles.lst\' ';
    const v512 = v511 + '-not -name \'coverage.html\' ';
    const v513 = v512 + '-not -name \'scoverage.measurements.*\' ';
    const v514 = v513 + '-not -name \'test_*_coverage.txt\' ';
    const v515 = v514 + '-not -path \'*/vendor/*\' ';
    const v516 = v515 + '-not -path \'*/htmlcov/*\' ';
    const v517 = v516 + '-not -path \'*/home/cainus/*\' ';
    const v518 = v517 + '-not -path \'*/virtualenv/*\' ';
    const v519 = v518 + '-not -path \'*/js/generated/coverage/*\' ';
    const v520 = v519 + '-not -path \'*/.virtualenv/*\' ';
    const v521 = v520 + '-not -path \'*/virtualenvs/*\' ';
    const v522 = v521 + '-not -path \'*/.virtualenvs/*\' ';
    const v523 = v522 + '-not -path \'*/.env/*\' ';
    const v524 = v523 + '-not -path \'*/.envs/*\' ';
    const v525 = v524 + '-not -path \'*/env/*\' ';
    const v526 = v525 + '-not -path \'*/envs/*\' ';
    const v527 = v526 + '-not -path \'*/.venv/*\' ';
    const v528 = v527 + '-not -path \'*/.venvs/*\' ';
    const v529 = v528 + '-not -path \'*/venv/*\' ';
    const v530 = v529 + '-not -path \'*/venvs/*\' ';
    const v531 = v530 + '-not -path \'*/.git/*\' ';
    const v532 = v531 + '-not -path \'*/.hg/*\' ';
    const v533 = v532 + '-not -path \'*/.tox/*\' ';
    const v534 = v533 + '-not -path \'*/__pycache__/*\' ';
    const v535 = v534 + '-not -path \'*/.egg-info*\' ';
    const v536 = v535 + '-not -path \'*/$bower_components/*\' ';
    const v537 = v536 + '-not -path \'*/node_modules/*\' ';
    patterns = v537 + '-not -path \'*/conftest_*.c.gcov\'';
} else {
    const v538 = '/a-d /b /s *coverage.* ' + '/s nosetests.xml ';
    const v539 = v538 + '/s jacoco*.xml ';
    const v540 = v539 + '/s clover.xml ';
    const v541 = v540 + '/s report.xml ';
    const v542 = v541 + '/s cobertura.xml ';
    const v543 = v542 + '/s luacov.report.out ';
    const v544 = v543 + '/s lcov.info ';
    const v545 = v544 + '/s *.lcov ';
    const v546 = v545 + '/s gcov.info ';
    const v547 = v546 + '/s *.gcov ';
    const v548 = v547 + '/s *.lst';
    const v549 = v548 + '| findstr /i /v \\.sh$ ';
    const v550 = v549 + '| findstr /i /v \\.data$ ';
    const v551 = v550 + '| findstr /i /v \\.py$ ';
    const v552 = v551 + '| findstr /i /v \\.class$ ';
    const v553 = v552 + '| findstr /i /v \\.xcconfig$ ';
    const v554 = v553 + '| findstr /i /v Coverage\\.profdata$ ';
    const v555 = v554 + '| findstr /i /v phpunit-code-coverage\\.xml$ ';
    const v556 = v555 + '| findstr /i /v coverage\\.serialized$ ';
    const v557 = v556 + '| findstr /i /v \\.pyc$ ';
    const v558 = v557 + '| findstr /i /v \\.cfg$ ';
    const v559 = v558 + '| findstr /i /v \\.egg$ ';
    const v560 = v559 + '| findstr /i /v \\.whl$ ';
    const v561 = v560 + '| findstr /i /v \\.html$ ';
    const v562 = v561 + '| findstr /i /v \\.js$ ';
    const v563 = v562 + '| findstr /i /v \\.cpp$ ';
    const v564 = v563 + '| findstr /i /v coverage\\.jade$ ';
    const v565 = v564 + '| findstr /i /v include\\.lst$ ';
    const v566 = v565 + '| findstr /i /v inputFiles\\.lst$ ';
    const v567 = v566 + '| findstr /i /v createdFiles\\.lst$ ';
    const v568 = v567 + '| findstr /i /v coverage\\.html$ ';
    const v569 = v568 + '| findstr /i /v scoverage\\.measurements\\..* ';
    const v570 = v569 + '| findstr /i /v test_.*_coverage\\.txt ';
    const v571 = v570 + '| findstr /i /v \\vendor\\ ';
    const v572 = v571 + '| findstr /i /v \\htmlcov\\ ';
    const v573 = v572 + '| findstr /i /v \\home\\cainus\\ ';
    const v574 = v573 + '| findstr /i /v \\js\\generated\\coverage\\ ';
    const v575 = v574 + '| findstr /i /v \\virtualenv\\ ';
    const v576 = v575 + '| findstr /i /v \\virtualenvs\\ ';
    const v577 = v576 + '| findstr /i /v \\\\.virtualenv\\ ';
    const v578 = v577 + '| findstr /i /v \\\\.virtualenvs\\ ';
    const v579 = v578 + '| findstr /i /v \\\\.env\\ ';
    const v580 = v579 + '| findstr /i /v \\\\.envs\\ ';
    const v581 = v580 + '| findstr /i /v \\env\\ ';
    const v582 = v581 + '| findstr /i /v \\envs\\ ';
    const v583 = v582 + '| findstr /i /v \\\\.venv\\ ';
    const v584 = v583 + '| findstr /i /v \\\\.venvs\\ ';
    const v585 = v584 + '| findstr /i /v \\venv\\ ';
    const v586 = v585 + '| findstr /i /v \\venvs\\ ';
    const v587 = v586 + '| findstr /i /v \\\\.git\\ ';
    const v588 = v587 + '| findstr /i /v \\\\.hg\\ ';
    const v589 = v588 + '| findstr /i /v \\\\.tox\\ ';
    const v590 = v589 + '| findstr /i /v \\__pycache__\\ ';
    const v591 = v590 + '| findstr /i /v \\\\.egg-info* ';
    const v592 = v591 + '| findstr /i /v \\\\$bower_components\\ ';
    const v593 = v592 + '| findstr /i /v \\node_modules\\ ';
    patterns = v593 + '| findstr /i /v \\conftest_.*\\.c\\.gcov ';
}
var sendToCodecovV2 = function (codecov_endpoint, query, upload_body, on_success, on_failure) {
    const v594 = codecov_endpoint + '/upload/v2';
    const v595 = urlgrey(v594);
    const v596 = v595.query(query);
    const v597 = v596.toString();
    const v598 = {};
    v598['Content-Type'] = 'text/plain';
    v598.Accept = 'text/plain';
    const v599 = {
        uri: v597,
        method: 'POST',
        body: upload_body,
        headers: v598
    };
    const v620 = function (err, response) {
        const v600 = response.statusCode;
        const v601 = v600 !== 200;
        const v602 = err || v601;
        if (v602) {
            const v603 = response.body;
            const v604 = err || v603;
            const v605 = '    ' + v604;
            const v606 = console.log(v605);
            v606;
            const v607 = response.statusCode;
            const v608 = response.body;
            const v609 = on_failure(v607, v608);
            const v610 = err.code;
            const v611 = err.message;
            const v612 = on_failure(v610, v611);
            let v613;
            if (response) {
                v613 = v609;
            } else {
                v613 = v612;
            }
            return v613;
        } else {
            const v614 = console.log('    Success!');
            v614;
            const v615 = response.body;
            const v616 = '    View report at: ' + v615;
            const v617 = console.log(v616);
            v617;
            const v618 = response.body;
            const v619 = on_success(v618);
            return v619;
        }
    };
    const v621 = request(v599, v620);
    v621;
};
var sendToCodecovV3 = function (codecov_endpoint, query, upload_body, on_success, on_failure) {
    const v622 = codecov_endpoint + '/upload/v4';
    const v623 = urlgrey(v622);
    const v624 = v623.query(query);
    const v625 = v624.toString();
    const v626 = {};
    v626['Content-Type'] = 'text/plain';
    v626.Accept = 'text/plain';
    const v627 = {
        uri: v625,
        method: 'POST',
        body: '',
        headers: v626
    };
    const v641 = function (err, response, result) {
        if (err) {
            const v628 = sendToCodecovV2(codecov_endpoint, query, upload_body, on_success, on_failure);
            v628;
        } else {
            const v629 = result.split('\n');
            var codecov_report_url = v629[0];
            const v630 = result.split('\n');
            const v631 = v630[1];
            const v632 = {};
            v632['Content-Type'] = 'text/plain';
            const v633 = {
                uri: v631,
                method: 'PUT',
                body: upload_body,
                headers: v632
            };
            const v639 = function (err) {
                if (err) {
                    const v634 = sendToCodecovV2(codecov_endpoint, query, upload_body, on_success, on_failure);
                    v634;
                } else {
                    const v635 = console.log('    Success!');
                    v635;
                    const v636 = '    View report at: ' + codecov_report_url;
                    const v637 = console.log(v636);
                    v637;
                    const v638 = on_success(codecov_report_url);
                    v638;
                }
            };
            const v640 = request(v633, v639);
            v640;
        }
    };
    const v642 = request(v627, v641);
    v642;
};
var upload = function (args, on_success, on_failure) {
    const v643 = args.options;
    const v644 = v643.url;
    const v645 = process.env;
    const v646 = v645.codecov_url;
    const v647 = v644 || v646;
    const v648 = process.env;
    const v649 = v648.CODECOV_URL;
    const v650 = v647 || v649;
    var codecov_endpoint = v650 || 'https://codecov.io';
    var query = {};
    var debug = [];
    const v651 = args.options;
    const v652 = v651.yml;
    const v653 = process.env;
    const v654 = v653.codecov_yml;
    const v655 = v652 || v654;
    const v656 = process.env;
    const v657 = v656.CODECOV_YML;
    const v658 = v655 || v657;
    var yamlFile = v658 || 'codecov.yml';
    const v659 = '' + '  _____          _  \n';
    const v660 = v659 + ' / ____|        | |  \n';
    const v661 = v660 + '| |     ___   __| | ___  ___ _____   __  \n';
    const v662 = v661 + '| |    / _ \\ / _` |/ _ \\/ __/ _ \\ \\ / /  \n';
    const v663 = v662 + '| |___| (_) | (_| |  __/ (_| (_) \\ V /  \n';
    const v664 = v663 + ' \\_____\\___/ \\__,_|\\___|\\___\\___/ \\_/  \n';
    const v665 = v664 + '                                ';
    const v666 = v665 + version;
    const v667 = console.log(v666);
    v667;
    const v668 = args.options;
    const v669 = v668.disable;
    const v670 = v669 || '';
    const v671 = v670.split(',');
    const v672 = v671.indexOf('detect');
    const v673 = -1;
    const v674 = v672 === v673;
    if (v674) {
        const v675 = console.log('==> Detecting CI Provider');
        v675;
        query = detectProvider();
    } else {
        const v676 = debug.push('disabled detect');
        v676;
    }
    const v677 = [
        yamlFile,
        '.codecov.yml'
    ];
    const v685 = function (result, file) {
        const v678 = process.cwd();
        const v679 = path.resolve(v678, file);
        const v680 = fs.existsSync(v679);
        const v681 = process.cwd();
        const v682 = path.resolve(v681, file);
        let v683;
        if (v680) {
            v683 = v682;
        } else {
            v683 = undefined;
        }
        const v684 = result || v683;
        return v684;
    };
    const v686 = v677.reduce(v685, undefined);
    query.yaml = v686;
    const v687 = args.options;
    const v688 = v687.build;
    if (v688) {
        const v689 = args.options;
        const v690 = v689.build;
        query.build = v690;
    }
    const v691 = args.options;
    const v692 = v691.commit;
    if (v692) {
        const v693 = args.options;
        const v694 = v693.commit;
        query.commit = v694;
    }
    const v695 = args.options;
    const v696 = v695.branch;
    if (v696) {
        const v697 = args.options;
        const v698 = v697.branch;
        query.branch = v698;
    }
    const v699 = args.options;
    const v700 = v699.slug;
    if (v700) {
        const v701 = args.options;
        const v702 = v701.slug;
        query.slug = v702;
    }
    const v703 = args.options;
    const v704 = v703.flags;
    const v705 = process.env;
    const v706 = v705.codecov_flags;
    const v707 = v704 || v706;
    const v708 = process.env;
    const v709 = v708.CODECOV_FLAGS;
    var flags = v707 || v709;
    if (flags) {
        query.flags = flags;
    }
    var yamlToken;
    try {
        const v710 = query.yaml;
        const v711 = fs.readFileSync(v710, 'utf8');
        var loadedYamlFile = jsYaml.safeLoad(v711);
        const v712 = loadedYamlFile.codecov;
        const v713 = loadedYamlFile && v712;
        const v714 = loadedYamlFile.codecov;
        const v715 = v714.token;
        yamlToken = v713 && v715;
    } catch (e) {
    }
    const v716 = args.options;
    const v717 = v716.token;
    const v718 = v717 || yamlToken;
    const v719 = process.env;
    const v720 = v719.codecov_token;
    const v721 = v718 || v720;
    const v722 = process.env;
    const v723 = v722.CODECOV_TOKEN;
    var token = v721 || v723;
    if (token) {
        query.token = token;
    }
    query.package = 'node-' + version;
    const v724 = console.log('==> Configuration: ');
    v724;
    const v725 = '    Endpoint: ' + codecov_endpoint;
    const v726 = console.log(v725);
    v726;
    const v727 = query.commit;
    const v728 = query.branch;
    const v729 = query.package;
    const v730 = {
        commit: v727,
        branch: v728,
        package: v729
    };
    const v731 = console.log(v730);
    v731;
    var upload = '';
    var env_found = false;
    const v732 = args.options;
    const v733 = v732.env;
    const v734 = process.env;
    const v735 = v734.CODECOV_ENV;
    const v736 = v733 || v735;
    const v737 = process.env;
    const v738 = v737.codecov_env;
    const v739 = v736 || v738;
    if (v739) {
        const v740 = args.options;
        const v741 = v740.env;
        const v742 = v741 + ',';
        const v743 = process.env;
        const v744 = v743.CODECOV_ENV;
        const v745 = v744 || '';
        const v746 = v742 + v745;
        const v747 = v746 + ',';
        const v748 = process.env;
        const v749 = v748.codecov_env;
        const v750 = v749 || '';
        const v751 = v747 + v750;
        var env = v751.split(',');
        const v752 = env.length;
        var i = v752 - 1;
        let v753 = i >= 0;
        while (v753) {
            const v755 = env[i];
            if (v755) {
                const v756 = env[i];
                const v757 = v756 + '=';
                const v758 = process.env;
                const v759 = env[i];
                const v760 = v758[v759];
                const v761 = v760 || '';
                const v762 = v761.toString();
                const v763 = v757 + v762;
                upload += v763 + '\n';
                env_found = true;
            }
            const v754 = i--;
            v753 = i >= 0;
        }
        if (env_found) {
            upload += '<<<<<< ENV\n';
        }
    }
    const v764 = args.options;
    const v765 = v764.root;
    const v766 = query.root;
    const v767 = v765 || v766;
    const v768 = v767 || '.';
    var root = path.resolve(v768);
    const v769 = console.log('==> Building file structure');
    v769;
    try {
        const v770 = { cwd: root };
        const v771 = execSync('git ls-files || hg locate', v770);
        const v772 = v771.toString();
        const v773 = v772.trim();
        upload += v773 + '\n<<<<<< network\n';
    } catch (err) {
        const v774 = [
            '.gitignore',
            '.hgignore'
        ];
        const v775 = {
            path: root,
            ignoreFiles: v774
        };
        const v776 = walk.sync(v775);
        const v777 = v776.join('\n');
        const v778 = v777.trim();
        upload += v778 + '\n<<<<<< network\n';
    }
    const v779 = args.options;
    const v780 = v779.disable;
    const v781 = v780 || '';
    const v782 = v781.split(',');
    const v783 = v782.indexOf('gcov');
    const v784 = -1;
    const v785 = v783 === v784;
    if (v785) {
        try {
            const v786 = console.log('==> Generating gcov reports (skip via --disable=gcov)');
            v786;
            const v787 = args.options;
            const v788 = v787['gcov-glob'];
            var gcg = v788 || '';
            if (gcg) {
                const v789 = !isWindows;
                if (v789) {
                    const v790 = gcg.split(' ');
                    const v793 = function (p) {
                        const v791 = '-not -path \'' + p;
                        const v792 = v791 + '\'';
                        return v792;
                    };
                    const v794 = v790.map(v793);
                    gcg = v794.join(' ');
                } else {
                    const v795 = gcg.split(' ');
                    const v797 = function (p) {
                        const v796 = '^| findstr /i /v ' + p;
                        return v796;
                    };
                    const v798 = v795.map(v797);
                    gcg = v798.join(' ');
                }
            }
            var gcov;
            const v799 = !isWindows;
            if (v799) {
                const v800 = args.options;
                const v801 = v800['gcov-root'];
                const v802 = sanitizeVar(v801);
                const v803 = v802 || root;
                const v804 = 'find ' + v803;
                const v805 = v804 + ' -type f -name \'*.gcno\' ';
                const v806 = v805 + gcg;
                const v807 = v806 + ' -exec ';
                const v808 = args.options;
                const v809 = v808['gcov-exec'];
                const v810 = sanitizeVar(v809);
                const v811 = v810 || 'gcov';
                const v812 = v807 + v811;
                const v813 = v812 + ' ';
                const v814 = args.options;
                const v815 = v814['gcov-args'];
                const v816 = sanitizeVar(v815);
                const v817 = v816 || '';
                const v818 = v813 + v817;
                gcov = v818 + ' {} +';
            } else {
                const v819 = 'for /f "delims=" %g in (\'dir /a-d /b /s *.gcno ' + gcg;
                const v820 = v819 + '\') do ';
                const v821 = args.options;
                const v822 = v821['gcov-exec'];
                const v823 = sanitizeVar(v822);
                const v824 = v823 || 'gcov';
                const v825 = v820 + v824;
                const v826 = v825 + ' ';
                const v827 = args.options;
                const v828 = v827['gcov-args'];
                const v829 = sanitizeVar(v828);
                const v830 = v829 || '';
                const v831 = v826 + v830;
                gcov = v831 + ' %g';
            }
            const v832 = debug.push(gcov);
            v832;
            const v833 = '    $ ' + gcov;
            const v834 = console.log(v833);
            v834;
            const v835 = execSync(gcov);
            v835;
        } catch (e) {
            const v836 = console.log('    Failed to run gcov command.');
            v836;
        }
    } else {
        const v837 = debug.push('disabled gcov');
        v837;
    }
    var bowerrc;
    const v838 = !isWindows;
    if (v838) {
        const v839 = { cwd: root };
        const v840 = execSync('test -f .bowerrc && cat .bowerrc || echo ""', v839);
        const v841 = v840.toString();
        bowerrc = v841.trim();
    } else {
        const v842 = { cwd: root };
        const v843 = execSync('if exist .bowerrc type .bowerrc', v842);
        const v844 = v843.toString();
        bowerrc = v844.trim();
    }
    if (bowerrc) {
        const v845 = JSON.parse(bowerrc);
        bowerrc = v845.directory;
        if (bowerrc) {
            const v846 = !isWindows;
            if (v846) {
                const v847 = bowerrc.toString();
                const v848 = v847.replace(/\/$/, '');
                const v849 = ' -not -path \'*/' + v848;
                more_patterns = v849 + '/*\'';
            } else {
                const v850 = bowerrc.toString();
                const v851 = v850.replace(/\/$/, '');
                const v852 = '| findstr /i /v \\' + v851;
                more_patterns = v852 + '\\';
            }
        }
    }
    var files = [];
    var file = null;
    const v853 = args.options;
    const v854 = v853.pipe;
    if (v854) {
        const v855 = args.options;
        const v856 = v855.pipe;
        const v857 = v856.join('');
        const v858 = '# path=piped\n' + v857;
        upload += v858 + '\n<<<<<< EOF\n';
        const v859 = console.log('==> Reading report from stdin');
        v859;
    } else {
        const v860 = args.options;
        const v861 = v860.file;
        if (v861) {
            const v862 = args.options;
            file = v862.file;
            const v863 = console.log('==> Targeting specific file');
            v863;
            try {
                const v864 = '# path=' + file;
                const v865 = v864 + '\n';
                const v866 = fs.readFileSync(file, 'utf8');
                const v867 = v866.toString();
                const v868 = v865 + v867;
                upload += v868 + '\n<<<<<< EOF\n';
                const v869 = '    + ' + file;
                const v870 = console.log(v869);
                v870;
                const v871 = files.push(file);
                v871;
            } catch (e) {
                const v872 = file.split('/');
                const v873 = v872.pop();
                const v874 = 'failed: ' + v873;
                const v875 = debug.push(v874);
                v875;
                const v876 = '    X Failed to read file at ' + file;
                const v877 = console.log(v876);
                v877;
            }
        } else {
            const v878 = args.options;
            const v879 = v878.disable;
            const v880 = v879 || '';
            const v881 = v880.split(',');
            const v882 = v881.indexOf('search');
            const v883 = -1;
            const v884 = v882 === v883;
            if (v884) {
                const v885 = console.log('==> Scanning for reports');
                v885;
                var _files;
                const v886 = !isWindows;
                if (v886) {
                    const v887 = 'find ' + root;
                    const v888 = v887 + ' ';
                    const v889 = v888 + patterns;
                    const v890 = v889 + more_patterns;
                    const v891 = execSync(v890);
                    const v892 = v891.toString();
                    const v893 = v892.trim();
                    _files = v893.split('\n');
                } else {
                    const v894 = 'dir ' + patterns;
                    const v895 = v894 + more_patterns;
                    const v896 = execSync(v895);
                    const v897 = v896.toString();
                    const v898 = v897.trim();
                    _files = v898.split('\r\n');
                }
                if (_files) {
                    const v899 = _files.length;
                    var i2 = v899 - 1;
                    let v900 = i2 >= 0;
                    while (v900) {
                        file = _files[i2];
                        try {
                            const v902 = '# path=' + file;
                            const v903 = v902 + '\n';
                            const v904 = fs.readFileSync(file, 'utf8');
                            const v905 = v904.toString();
                            const v906 = v903 + v905;
                            upload += v906 + '\n<<<<<< EOF\n';
                            const v907 = '    + ' + file;
                            const v908 = console.log(v907);
                            v908;
                            const v909 = files.push(file);
                            v909;
                        } catch (e) {
                            const v910 = file.split('/');
                            const v911 = v910.pop();
                            const v912 = 'failed: ' + v911;
                            const v913 = debug.push(v912);
                            v913;
                            const v914 = '    X Failed to read file at ' + file;
                            const v915 = console.log(v914);
                            v915;
                        }
                        const v901 = i2--;
                        v900 = i2 >= 0;
                    }
                }
            } else {
                const v916 = debug.push('disabled search');
                v916;
            }
        }
    }
    if (files) {
        const v917 = args.options;
        const v918 = v917.dump;
        if (v918) {
            const v919 = console.log('-------- DEBUG START --------');
            v919;
            const v920 = console.log(upload);
            v920;
            const v921 = console.log('-------- DEBUG END --------');
            v921;
        } else {
            const v922 = console.log('==> Uploading reports');
            v922;
            var _upload;
            const v923 = args.options;
            const v924 = v923.disable;
            const v925 = v924 || '';
            const v926 = v925.split(',');
            const v927 = v926.indexOf('s3');
            const v928 = -1;
            const v929 = v927 === v928;
            if (v929) {
                _upload = sendToCodecovV3;
            } else {
                _upload = sendToCodecovV2;
            }
            const v938 = function () {
                const v930 = args.options;
                const v931 = v930.clear;
                if (v931) {
                    const v932 = files.length;
                    var i = v932 - 1;
                    let v933 = i >= 0;
                    while (v933) {
                        try {
                            const v935 = files[i];
                            const v936 = fs.unlinkSync(v935);
                            v936;
                        } catch (e) {
                        }
                        const v934 = i--;
                        v933 = i >= 0;
                    }
                }
                if (on_success) {
                    const v937 = on_success.apply(this, arguments);
                    v937;
                }
            };
            const v939 = function () {
            };
            const v940 = on_failure || v939;
            const v941 = _upload(codecov_endpoint, query, upload, v938, v940);
            v941;
        }
    }
    const v942 = {};
    v942.body = upload;
    v942.files = files;
    v942.query = query;
    v942.debug = debug;
    v942.url = codecov_endpoint;
    return v942;
};
const sanitizeVar = function (arg) {
    const v943 = arg.replace(/&/g, '');
    return v943;
};
const v944 = {};
v944.sanitizeVar = sanitizeVar;
v944.upload = upload;
v944.version = version;
v944.sendToCodecovV2 = sendToCodecovV2;
v944.sendToCodecovV3 = sendToCodecovV3;
module.exports = v944;