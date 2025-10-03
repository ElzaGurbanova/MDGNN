var util = require('util');
var fs = require('fs');
const v680 = require('./git_file_operations');
var GitFileOperations = v680.GitFileOperations;
const v681 = require('child_process');
var exec = v681.exec;
const v682 = require('./file_index');
var FileIndex = v682.FileIndex;
const v683 = require('./repository');
var Repository = v683.Repository;
const v684 = require('../diff/diff');
var Difference = v684.Difference;
const v698 = function (git_directory) {
    var _git_diretory = git_directory;
    var _git_file_index;
    const v685 = {};
    var _repository = new Repository(_git_diretory, v685);
    const v686 = function () {
        return _git_diretory;
    };
    const v687 = function (value) {
        _git_diretory = value;
    };
    const v688 = {
        get: v686,
        set: v687,
        enumerable: true
    };
    const v689 = Object.defineProperty(this, 'git_directory', v688);
    v689;
    const v690 = function () {
        return _git_file_index;
    };
    const v691 = function (value) {
        _git_file_index = value;
    };
    const v692 = {
        get: v690,
        set: v691,
        enumerable: true
    };
    const v693 = Object.defineProperty(this, 'git_file_index', v692);
    v693;
    const v694 = function () {
        return _repository;
    };
    const v695 = function (value) {
        _repository = value;
    };
    const v696 = {
        get: v694,
        set: v695,
        enumerable: true
    };
    const v697 = Object.defineProperty(this, 'repository', v696);
    v697;
};
exports.Git = v698;
var Git = exports.Git;
const v699 = process.platform;
const v700 = v699.toLowerCase();
const v701 = v700.match(/mswin(?!ce)|mingw|bccwin|win32/);
if (v701) {
    Git.git_binary = 'git';
} else {
    Git.git_binary = '/usr/bin/env git';
}
var chomp = function chomp(raw_text) {
    const v702 = raw_text.replace(/(\n|\r)+$/, '');
    let v703;
    if (raw_text) {
        v703 = v702;
    } else {
        v703 = '';
    }
    return v703;
};
var read_file = function (path, callback) {
    const v706 = function (err, stat) {
        if (err) {
            const v704 = callback(err, null);
            return v704;
        }
        const v705 = fs.readFile(path, 'ascii', callback);
        v705;
    };
    const v707 = fs.stat(path, v706);
    v707;
};
const v708 = Git.prototype;
const v760 = function (options, prefix, callback) {
    var refs = [];
    var already = {};
    var self = this;
    const v709 = this.git_directory;
    const v710 = v709 + '/';
    const v711 = v710 + prefix;
    var stream = GitFileOperations.glob_streaming(v711);
    const v726 = function (result) {
        const v712 = result.stat;
        const v713 = v712.isFile();
        if (v713) {
            try {
                const v714 = result.path;
                const v715 = fs.readFileSync(v714, 'ascii');
                var id = chomp(v715);
                const v716 = result.path;
                const v717 = self.git_directory;
                const v718 = v717 + '/';
                const v719 = v718 + prefix;
                const v720 = v719 + '/';
                var name = v716.replace(v720, '');
                const v721 = already[name];
                const v722 = !v721;
                if (v722) {
                    const v723 = name + ' ';
                    const v724 = v723 + id;
                    const v725 = refs.push(v724);
                    v725;
                    already[name] = true;
                }
            } catch (err) {
            }
        }
    };
    const v727 = stream.addListener('data', v726);
    v727;
    const v758 = function (err, result) {
        const v728 = self.git_directory;
        const v729 = v728 + '/packed-refs';
        const v756 = function (err, stat) {
            const v730 = stat.isFile();
            const v731 = !v730;
            const v732 = err || v731;
            if (v732) {
                const v733 = refs.join('\n');
                const v734 = callback(null, v733);
                return v734;
            }
            const v735 = self.git_directory;
            const v736 = v735 + '/packed-refs';
            const v754 = function (err, data) {
                var parts = data.split(/\n/);
                var i = 0;
                const v737 = parts.length;
                let v738 = i < v737;
                while (v738) {
                    const v740 = parts[i];
                    var match = v740.match(/^(\w{40}) (.*?)$/);
                    if (match) {
                        const v741 = match[2];
                        const v742 = '^' + prefix;
                        const v743 = v741.match(v742);
                        if (v743) {
                            const v744 = match[1];
                            var id = chomp(v744);
                            const v745 = match[2];
                            const v746 = prefix + '/';
                            var name = v745.replace(v746, '');
                            const v747 = already[name];
                            const v748 = !v747;
                            if (v748) {
                                const v749 = name + ' ';
                                const v750 = v749 + id;
                                const v751 = refs.push(v750);
                                v751;
                                already[name] = true;
                            }
                        }
                    }
                    const v739 = i++;
                    v738 = i < v737;
                }
                const v752 = refs.join('\n');
                const v753 = callback(null, v752);
                v753;
            };
            const v755 = read_file(v736, v754);
            v755;
        };
        const v757 = fs.stat(v729, v756);
        v757;
    };
    const v759 = stream.addListener('end', v758);
    v759;
};
v708.refs = v760;
const v761 = Git.prototype;
const v764 = function (file, callback) {
    const v762 = this.git_directory;
    const v763 = GitFileOperations.fs_read(v762, file, callback);
    v763;
};
v761.fs_read = v764;
const v765 = Git.prototype;
const v819 = function (options) {
    var args = [];
    var keys = Object.keys(options);
    const v766 = Object.keys(options);
    const v817 = function (key) {
        const v767 = key.length;
        const v768 = v767 == 1;
        if (v768) {
            const v769 = options[key];
            const v770 = v769 == true;
            const v771 = options[key];
            const v772 = v771.constructor;
            const v773 = v772 == Boolean;
            const v774 = v770 && v773;
            if (v774) {
                const v775 = '-' + key;
                const v776 = args.push(v775);
                v776;
            } else {
                const v777 = options[key];
                const v778 = v777 == false;
                const v779 = options[key];
                const v780 = v779.constructor;
                const v781 = v780 == Boolean;
                const v782 = v778 && v781;
                if (v782) {
                } else {
                    const v783 = '-' + key;
                    const v784 = v783 + ' "';
                    const v785 = options[key];
                    const v786 = v785.toString();
                    const v787 = v786.replace('"', '\\"');
                    const v788 = v784 + v787;
                    const v789 = v788 + '"';
                    const v790 = args.push(v789);
                    v790;
                }
            }
        } else {
            const v791 = options[key];
            const v792 = v791 == true;
            const v793 = options[key];
            const v794 = v793.constructor;
            const v795 = v794 == Boolean;
            const v796 = v792 && v795;
            if (v796) {
                const v797 = key.toString();
                const v798 = v797.replace(/_/, '-');
                const v799 = '--' + v798;
                const v800 = args.push(v799);
                v800;
            } else {
                const v801 = options[key];
                const v802 = v801 == false;
                const v803 = options[key];
                const v804 = v803.constructor;
                const v805 = v804 == Boolean;
                const v806 = v802 && v805;
                if (v806) {
                } else {
                    const v807 = key.toString();
                    const v808 = v807.replace(/_/, '-');
                    const v809 = '--' + v808;
                    const v810 = v809 + '="';
                    const v811 = options[key];
                    const v812 = v811.toString();
                    const v813 = v812.replace('"', '\\"');
                    const v814 = v810 + v813;
                    const v815 = v814 + '"';
                    const v816 = args.push(v815);
                    v816;
                }
            }
        }
    };
    const v818 = v766.forEach(v817);
    v818;
    return args;
};
v765.transform_options = v819;
const v820 = Git.prototype;
const v831 = function () {
    const v821 = Array.prototype;
    const v822 = v821.slice;
    var args = v822.call(arguments, 0);
    var callback = args.pop();
    let function_name;
    const v823 = args.length;
    const v824 = args.shift();
    if (v823) {
        function_name = v824;
    } else {
        function_name = null;
    }
    let options;
    const v825 = args.length;
    const v826 = args.shift();
    const v827 = {};
    if (v825) {
        options = v826;
    } else {
        options = v827;
    }
    var arguments = args;
    const v829 = function (err, result) {
        const v828 = callback(err, result);
        v828;
    };
    const v830 = this.call_git('', function_name, '', options, arguments, v829);
    v830;
};
v820.git = v831;
var shell_escape = function (str) {
    const v832 = str.toString();
    const v833 = v832.replace('"', '\\"');
    const v834 = v833.replace(/\;/g, '\\;');
    return v834;
};
const v835 = Git.prototype;
const v873 = function (prefix, command, postfix, options, args, callback) {
    let timeout;
    const v836 = options['timeout'];
    const v837 = 1000 * 60;
    if (v836) {
        timeout = timeout;
    } else {
        timeout = v837;
    }
    var call_string = '';
    const v838 = options['timeout'];
    if (v838) {
        const v839 = options['timeout'];
        const v840 = delete v839;
        v840;
    }
    var option_arguments = this.transform_options(options);
    const v841 = process.platform;
    const v842 = v841.toLowerCase();
    const v843 = v842.match(/mswin(?!ce)|mingw|bccwin/);
    if (v843) {
    } else {
        const v852 = function (arg) {
            const v844 = arg == '--';
            const v845 = arg.substr(0, 1);
            const v846 = v845 == '|';
            const v847 = v844 || v846;
            const v848 = shell_escape(arg);
            const v849 = '"' + v848;
            const v850 = v849 + '"';
            let v851;
            if (v847) {
                v851 = arg;
            } else {
                v851 = v850;
            }
            return v851;
        };
        const v853 = args.map(v852);
        const v858 = function (arg) {
            const v854 = arg == null;
            const v855 = arg == '';
            const v856 = v854 || v855;
            let v857;
            if (v856) {
                v857 = false;
            } else {
                v857 = true;
            }
            return v857;
        };
        var ext_args = v853.filter(v858);
        var final_arguments = option_arguments.concat(ext_args);
        const v859 = Git.git_binary;
        const v860 = prefix + v859;
        const v861 = v860 + ' --git-dir="';
        const v862 = this.git_directory;
        const v863 = v861 + v862;
        const v864 = v863 + '" ';
        const v865 = command.toString();
        const v866 = v865.replace(/_/, '-');
        const v867 = v864 + v866;
        const v868 = v867 + ' ';
        const v869 = final_arguments.join(' ');
        const v870 = v868 + v869;
        call_string = v870 + postfix;
    }
    const v871 = {
        encoding: 'utf8',
        timeout: timeout,
        killSignal: 'SIGKILL'
    };
    const v872 = execute_git_call(call_string, v871, callback);
    v872;
};
v835.call_git = v873;
var execute_git_call = function (call_string, options, callback) {
    options.maxBuffer = 1024 * 1024;
    const v883 = function (error, stdout, stderr) {
        const v874 = error != null;
        if (v874) {
            var result = error.toString();
            const v875 = result != null;
            const v876 = result.trim();
            let v877;
            if (v875) {
                v877 = v876;
            } else {
                v877 = result;
            }
            const v878 = callback(v877, null);
            v878;
        } else {
            var result = stdout.toString();
            const v879 = result != null;
            const v880 = result.trim();
            let v881;
            if (v879) {
                v881 = v880;
            } else {
                v881 = result;
            }
            const v882 = callback(null, v881);
            v882;
        }
    };
    const v884 = exec(call_string, options, v883);
    v884;
};
var file_index = function (git, callback) {
    const v885 = git.git_file_index;
    const v886 = !v885;
    if (v886) {
        const v887 = git.git_directory;
        const v889 = function (err, _file_index) {
            git.git_file_index = _file_index;
            const v888 = callback(null, _file_index);
            v888;
        };
        const v890 = new FileIndex(v887, v889);
        v890;
    } else {
        const v891 = git.git_file_index;
        const v892 = callback(null, v891);
        v892;
    }
};
const v893 = Git.prototype;
const v952 = function (options, reference, callback) {
    var self = this;
    const v894 = Array.prototype;
    const v895 = v894.slice;
    var args = v895.call(arguments, 0);
    var callback = args.pop();
    const v896 = args.length;
    const v897 = args.shift();
    const v898 = {};
    if (v896) {
        options = v897;
    } else {
        options = v898;
    }
    const v899 = args.length;
    const v900 = args.shift();
    if (v899) {
        reference = v900;
    } else {
        reference = 'master';
    }
    const v901 = options['skip'];
    const v902 = v901 != null;
    const v903 = options['skip'];
    const v904 = parseInt(v903);
    const v905 = v904 == 0;
    const v906 = v902 && v905;
    if (v906) {
        const v907 = options['skip'];
        const v908 = delete v907;
        v908;
    }
    var allowed_options = {};
    allowed_options['max_count'] = 1;
    allowed_options['since'] = 1;
    allowed_options['until'] = 1;
    allowed_options['pretty'] = 1;
    const v909 = Object.keys(options);
    const v912 = function (key) {
        const v910 = allowed_options[key];
        let v911;
        if (v910) {
            v911 = false;
        } else {
            v911 = true;
        }
        return v911;
    };
    var establish_keys = v909.filter(v912);
    const v913 = establish_keys.length;
    const v914 = v913 > 0;
    if (v914) {
        const v915 = [reference];
        const v917 = function (err, result) {
            const v916 = callback(err, result);
            v916;
        };
        const v918 = self.call_git('', 'rev_list', '', options, v915, v917);
        v918;
    } else {
        const v919 = Object.keys(options);
        const v920 = v919.length;
        const v921 = v920 == 0;
        if (v921) {
            const v936 = function (err, _file_index) {
                if (err) {
                    const v922 = callback(err, _file_index);
                    return v922;
                }
                const v923 = {};
                const v934 = function (err, ref) {
                    if (err) {
                        const v924 = callback(err, ref);
                        return v924;
                    }
                    const v932 = function (err, commits) {
                        if (err) {
                            const v925 = [reference];
                            const v927 = function (err, result) {
                                const v926 = callback(err, result);
                                v926;
                            };
                            const v928 = self.call_git('', 'rev_list', '', options, v925, v927);
                            v928;
                        } else {
                            const v929 = commits.join('\n');
                            const v930 = v929 + '\n';
                            const v931 = callback(null, v930);
                            v931;
                        }
                    };
                    const v933 = _file_index.commits_from(ref, v932);
                    v933;
                };
                const v935 = self.rev_parse(v923, reference, 0, v934);
                v935;
            };
            const v937 = file_index(self, v936);
            v937;
        } else {
            const v938 = {};
            const v950 = function (err, ref) {
                if (err) {
                    const v939 = callback(err, ref);
                    return v939;
                }
                const v940 = Array.isArray(ref);
                if (v940) {
                    const v941 = [reference];
                    const v943 = function (err, result) {
                        const v942 = callback(err, result);
                        v942;
                    };
                    const v944 = self.call_git('', 'rev_list', '', options, v941, v943);
                    v944;
                } else {
                    try {
                        const v945 = self.repository;
                        const v947 = function (err, result) {
                            const v946 = callback(err, result);
                            v946;
                        };
                        const v948 = v945.rev_list(ref, options, v947);
                        v948;
                    } catch (err) {
                        const v949 = callback(err, null);
                        v949;
                    }
                }
            };
            const v951 = self.rev_parse(v938, reference, 0, v950);
            v951;
        }
    }
};
v893.rev_list = v952;
var chomp = function chomp(raw_text) {
    const v953 = raw_text.replace(/(\n|\r)+$/, '');
    return v953;
};
const v954 = Git.prototype;
const v1019 = function (options, string, level, callback) {
    const v955 = string != null;
    const v956 = string.constructor;
    const v957 = v956 != String;
    const v958 = v955 && v957;
    if (v958) {
        const v959 = callback('only supports single sha reference');
        return v959;
    }
    var self = this;
    const v960 = Array.prototype;
    const v961 = v960.slice;
    var args = v961.call(arguments, 2);
    var callback = args.pop();
    const v962 = args.length;
    const v963 = args.shift();
    if (v962) {
        level = v963;
    } else {
        level = 0;
    }
    const v964 = string.match(/\.\./);
    if (v964) {
        var parts = string.split('..');
        var sha1 = parts[0];
        var sha2 = parts[1];
        const v965 = {};
        const v966 = level + 1;
        const v967 = this.rev_parse(v965, sha1, v966, callback);
        const v968 = {};
        const v969 = level + 1;
        const v970 = this.rev_parse(v968, sha2, v969, callback);
        var value = [
            v967,
            v970
        ];
        const v971 = level == 0;
        if (v971) {
            const v972 = callback(null, value);
            return v972;
        }
    }
    const v973 = string.match(/^[0-9a-f]{40}$/);
    if (v973) {
        var value = chomp(string);
        const v974 = level == 0;
        if (v974) {
            const v975 = callback(null, value);
            return v975;
        } else {
            return value;
        }
    }
    const v976 = this.git_directory;
    const v977 = v976 + '/refs/heads/';
    var head = v977 + string;
    try {
        const v978 = level == 0;
        if (v978) {
            const v979 = fs.readFileSync(head, 'utf8');
            const v980 = chomp(v979);
            const v981 = callback(null, v980);
            return v981;
        } else {
            const v982 = fs.readFileSync(head, 'utf8');
            const v983 = chomp(v982);
            return v983;
        }
    } catch (err) {
    }
    const v984 = this.git_directory;
    const v985 = v984 + '/refs/remotes/';
    var head = v985 + string;
    try {
        const v986 = level == 0;
        if (v986) {
            const v987 = fs.readFileSync(head, 'utf8');
            const v988 = chomp(v987);
            const v989 = callback(null, v988);
            return v989;
        } else {
            const v990 = fs.readFileSync(head, 'utf8');
            const v991 = chomp(v990);
            return v991;
        }
    } catch (err) {
    }
    const v992 = this.git_directory;
    const v993 = v992 + '/refs/tags/';
    var head = v993 + string;
    try {
        const v994 = level == 0;
        if (v994) {
            const v995 = fs.readFileSync(head, 'utf8');
            const v996 = chomp(v995);
            const v997 = callback(null, v996);
            return v997;
        } else {
            const v998 = fs.readFileSync(head, 'utf8');
            const v999 = chomp(v998);
            return v999;
        }
    } catch (err) {
    }
    const v1000 = this.git_directory;
    var packref = v1000 + '/packed-refs';
    try {
        var parts = data.split(/\n/);
        var i = 0;
        const v1001 = parts.length;
        let v1002 = i < v1001;
        while (v1002) {
            const v1004 = parts[i];
            var match_parts = v1004.match(/^(\w{40}) refs\/.+?\/(.*?)$/);
            if (match_parts) {
                ref = match_parts[1];
                const v1005 = string + '$';
                const v1006 = new RegExp(v1005);
                const v1007 = match_parts[3];
                const v1008 = v1006.test(v1007);
                if (v1008) {
                    const v1009 = level == 0;
                    if (v1009) {
                        const v1010 = chomp(ref);
                        const v1011 = callback(null, v1010);
                        return v1011;
                    } else {
                        const v1012 = chomp(ref);
                        return v1012;
                    }
                }
            }
            const v1003 = i++;
            v1002 = i < v1001;
        }
    } catch (err) {
    }
    const v1013 = [string];
    const v1017 = function (err, result) {
        const v1014 = chomp(result);
        let v1015;
        if (result) {
            v1015 = v1014;
        } else {
            v1015 = result;
        }
        const v1016 = callback(null, v1015);
        v1016;
    };
    const v1018 = self.call_git('', 'rev-parse', '', options, v1013, v1017);
    v1018;
};
v954.rev_parse = v1019;
const v1020 = Git.prototype;
const v1041 = function (treeish, paths, options, callback) {
    var self = this;
    const v1021 = Array.prototype;
    const v1022 = v1021.slice;
    var args = v1022.call(arguments, 1);
    var callback = args.pop();
    const v1023 = args.length;
    const v1024 = args.shift();
    const v1025 = [];
    if (v1023) {
        paths = v1024;
    } else {
        paths = v1025;
    }
    const v1026 = [];
    if (paths) {
        paths = paths;
    } else {
        paths = v1026;
    }
    const v1027 = args.length;
    const v1028 = args.shift();
    const v1029 = {};
    if (v1027) {
        options = v1028;
    } else {
        options = v1029;
    }
    try {
        const v1030 = {};
        const v1038 = function (err, sha) {
            if (err) {
                const v1031 = callback(err, sha);
                return v1031;
            }
            const v1032 = self.repository;
            const v1033 = flatten(paths);
            const v1034 = options['r'];
            var tree = v1032.ls_tree(sha, v1033, v1034);
            const v1035 = tree == '';
            if (v1035) {
                const v1036 = callback('no such sha found', null);
                return v1036;
            }
            const v1037 = callback(null, tree);
            v1037;
        };
        const v1039 = this.rev_parse(v1030, treeish, v1038);
        v1039;
    } catch (err) {
        const v1040 = callback(err, null);
        v1040;
    }
};
v1020.ls_tree = v1041;
const v1042 = Git.prototype;
const v1051 = function (type, ref, callback) {
    const v1043 = type == 't';
    if (v1043) {
        const v1044 = this.file_type(ref, callback);
        v1044;
    } else {
        const v1045 = type == 's';
        if (v1045) {
            const v1046 = this.file_size(ref, callback);
            v1046;
        } else {
            const v1047 = type == 'p';
            if (v1047) {
                const v1048 = this.repository;
                const v1049 = v1048.cat_file(ref);
                const v1050 = callback(null, v1049);
                v1050;
            }
        }
    }
};
v1042.cat_file = v1051;
const v1052 = Git.prototype;
const v1056 = function (ref, callback) {
    const v1053 = this.repository;
    const v1054 = v1053.cat_file_size(ref);
    const v1055 = callback(null, v1054);
    v1055;
};
v1052.file_size = v1056;
const v1057 = Git.prototype;
const v1061 = function (dir, callback) {
    const v1058 = this.git_directory;
    const v1059 = v1058 + '/';
    var path = v1059 + dir;
    const v1060 = GitFileOperations.fs_mkdir(path, callback);
    v1060;
};
v1057.fs_mkdir = v1061;
const v1062 = Git.prototype;
const v1073 = function (options, callback) {
    var self = this;
    const v1063 = Array.prototype;
    var arguments = v1063.slice(arguments);
    const v1064 = Object.keys(options);
    const v1065 = v1064.length;
    const v1066 = v1065 == 0;
    if (v1066) {
        const v1067 = this.git_directory;
        const v1068 = Repository.init(v1067, callback);
        v1068;
    } else {
        const v1071 = function (err, result) {
            if (err) {
                const v1069 = callback(err, result);
                return v1069;
            }
            const v1070 = callback(null, self);
            v1070;
        };
        const v1072 = this.call_git('', 'init', '', options, arguments, v1071);
        v1072;
    }
};
v1062.init = v1073;
const v1074 = Git.prototype;
const v1075 = function (options, original_path, target_path, callback) {
};
v1074.clone = v1075;
var flatten = function (array) {
    const v1077 = function (a, b) {
        const v1076 = a.concat(b);
        return v1076;
    };
    const v1078 = [];
    const v1079 = array.reduce(v1077, v1078);
    return v1079;
};
const v1080 = Git.prototype;
const v1154 = function (commit1, commit2, options, callback) {
    try {
        var self = this;
        const v1081 = Array.prototype;
        const v1082 = v1081.slice;
        var args = v1082.call(arguments, 2);
        var callback = args.pop();
        const v1083 = args.length;
        const v1084 = args.shift();
        const v1085 = {};
        if (v1083) {
            options = v1084;
        } else {
            options = v1085;
        }
        var patch = '';
        var commit_obj1 = null;
        var tree1 = null;
        var tree2 = null;
        const v1086 = self.repository;
        var commit_obj1 = v1086.get_object_by_sha1(commit1);
        var tree1 = commit_obj1.tree;
        if (commit2) {
            const v1087 = self.repository;
            const v1088 = v1087.get_object_by_sha1(commit2);
            tree2 = v1088.tree;
        } else {
            const v1089 = self.repository;
            const v1090 = commit_obj1.parent;
            const v1091 = v1090[0];
            const v1092 = v1089.get_object_by_sha1(v1091);
            tree2 = v1092.tree;
        }
        const v1093 = self.repository;
        const v1094 = v1093.quick_diff(tree1, tree2);
        var qdiff = v1094.sort();
        const v1150 = function (diff_arr) {
            var path = diff_arr[0];
            var status = diff_arr[1];
            var treeSHA1 = diff_arr[2];
            var treeSHA2 = diff_arr[3];
            var format = 'unified';
            var lines = 3;
            var output = '';
            var file_length_difference = 0;
            let fileA;
            const v1095 = self.repository;
            const v1096 = v1095.cat_file(treeSHA1);
            if (treeSHA1) {
                fileA = v1096;
            } else {
                fileA = '';
            }
            let fileB;
            const v1097 = self.repository;
            const v1098 = v1097.cat_file(treeSHA2);
            if (treeSHA2) {
                fileB = v1098;
            } else {
                fileB = '';
            }
            var sha1 = treeSHA1 || '0000000000000000000000000000000000000000';
            var sha2 = treeSHA2 || '0000000000000000000000000000000000000000';
            const v1099 = fileA.trim();
            const v1100 = v1099.split(/\n/);
            const v1102 = function (e) {
                const v1101 = chomp(e);
                return v1101;
            };
            var data_old = v1100.map(v1102);
            const v1103 = fileB.trim();
            const v1104 = v1103.split(/\n/);
            const v1106 = function (e) {
                const v1105 = chomp(e);
                return v1105;
            };
            var data_new = v1104.map(v1106);
            const v1107 = data_old.length;
            const v1108 = v1107 == 1;
            const v1109 = data_old[0];
            const v1110 = v1109 == '';
            const v1111 = v1108 && v1110;
            if (v1111) {
                data_old = [];
            }
            const v1112 = data_new.length;
            const v1113 = v1112 == 1;
            const v1114 = data_new[0];
            const v1115 = v1114 == '';
            const v1116 = v1113 && v1115;
            if (v1116) {
                data_new = [];
            }
            const v1117 = Difference.LCS;
            var diffs = v1117.diff(data_old, data_new);
            const v1118 = diffs.length;
            const v1119 = v1118 > 0;
            if (v1119) {
                const v1120 = path.replace(/\.\//g, '');
                var a_path = 'a/' + v1120;
                const v1121 = path.replace(/\.\//g, '');
                var b_path = 'b/' + v1121;
                const v1122 = 'diff --git ' + a_path;
                const v1123 = v1122 + ' ';
                var header = v1123 + b_path;
                const v1124 = options['full_index'];
                if (v1124) {
                    const v1125 = header + '\n';
                    const v1126 = v1125 + 'index ';
                    const v1127 = v1126 + sha1;
                    const v1128 = v1127 + '..';
                    header = v1128 + sha2;
                    if (treeSHA2) {
                        header = header + '\' 100644';
                    }
                } else {
                    const v1129 = header + '\n';
                    const v1130 = v1129 + 'index ';
                    const v1131 = sha1.substr(0, 7);
                    const v1132 = v1130 + v1131;
                    const v1133 = v1132 + '..';
                    const v1134 = sha2.substr(0, 7);
                    header = v1133 + v1134;
                    if (treeSHA2) {
                        header = header + ' 100644';
                    }
                }
                const v1135 = header + '\n--- ';
                let v1136;
                if (treeSHA1) {
                    v1136 = a_path;
                } else {
                    v1136 = '/dev/null';
                }
                header = v1135 + v1136;
                const v1137 = header + '\n+++ ';
                let v1138;
                if (treeSHA2) {
                    v1138 = b_path;
                } else {
                    v1138 = '/dev/null';
                }
                header = v1137 + v1138;
                header = header + '\n';
                var old_hunk = null;
                var hunk = null;
                const v1145 = function (piece) {
                    try {
                        const v1139 = Difference.LCS;
                        hunk = new v1139.Hunk(data_old, data_new, piece, lines, file_length_difference);
                        file_length_difference = hunk.file_length_difference;
                        if (old_hunk) {
                            const v1140 = lines > 0;
                            const v1141 = hunk.overlaps(old_hunk);
                            const v1142 = v1140 && v1141;
                            if (v1142) {
                                const v1143 = hunk.unshift(old_hunk);
                                v1143;
                            } else {
                                const v1144 = old_hunk.diff(format);
                                output = output + v1144;
                            }
                        }
                    } catch (err) {
                    }
                    old_hunk = hunk;
                    output = output + '\n';
                };
                const v1146 = diffs.forEach(v1145);
                v1146;
                const v1147 = old_hunk.diff(format);
                output = output + v1147;
                output = output + '\n';
                const v1148 = patch + header;
                const v1149 = output.trimLeft();
                patch = v1148 + v1149;
            }
        };
        const v1151 = qdiff.forEach(v1150);
        v1151;
        const v1152 = callback(null, patch);
        v1152;
    } catch (err) {
        const v1153 = callback('tree was bad or lcs is not working', null);
        v1153;
    }
};
v1080.diff = v1154;
const v1155 = Git.prototype;
const v1158 = function (path, callback) {
    const v1156 = this.git_directory;
    const v1157 = GitFileOperations.fs_exist(v1156, path, callback);
    v1157;
};
v1155.fs_exist = v1158;
const v1159 = Git.prototype;
const v1162 = function (file, content, callback) {
    const v1160 = this.git_directory;
    const v1161 = GitFileOperations.fs_write(v1160, file, content, callback);
    v1161;
};
v1159.fs_write = v1162;
const v1163 = Git.prototype;
const v1167 = function (commit, path, options, callback) {
    args = [
        '--raw',
        '--no-abbrev',
        '--numstat'
    ];
    if (path) {
        const v1164 = args.push('--');
        v1164;
        const v1165 = args.push(path);
        v1165;
    }
    options.color = 'never';
    const v1166 = this.call_git('', 'log', '', options, args, callback);
    v1166;
};
v1163.log = v1167;
const v1168 = Git.prototype;
const v1180 = function (object_ids, callback) {
    var existing_object_ids = [];
    var i = 0;
    const v1169 = object_ids.length;
    let v1170 = i < v1169;
    while (v1170) {
        const v1172 = this.repository;
        const v1173 = object_ids[i];
        const v1177 = function (err, result) {
            if (err) {
                const v1174 = callback(err, result);
                return v1174;
            }
            if (result) {
                const v1175 = object_ids[i];
                const v1176 = existing_object_ids.push(v1175);
                v1176;
            }
        };
        const v1178 = v1172.object_exists(v1173, v1177);
        v1178;
        const v1171 = i++;
        v1170 = i < v1169;
    }
    const v1179 = callback(null, existing_object_ids);
    v1179;
};
v1168.select_existing_objects = v1180;
const v1181 = Git.prototype;
const v1186 = function (options, reference, callback) {
    const v1182 = [reference];
    const v1184 = function (err, result) {
        const v1183 = callback(err, result);
        v1183;
    };
    const v1185 = this.call_git('', 'format_patch', '', options, v1182, v1184);
    v1185;
};
v1181.format_patch = v1186;
const v1187 = Git.prototype;
const v1196 = function () {
    const v1188 = Array.prototype;
    const v1189 = v1188.slice;
    var args = v1189.call(arguments, 0);
    var callback = args.pop();
    let options;
    const v1190 = args.length;
    const v1191 = args.shift();
    const v1192 = {};
    if (v1190) {
        options = v1191;
    } else {
        options = v1192;
    }
    var arguments = args;
    const v1194 = function (err, result) {
        const v1193 = callback(err, result);
        v1193;
    };
    const v1195 = this.call_git('', 'blame', '', options, arguments, v1194);
    v1195;
};
v1187.blame = v1196;
var clean_paths = function (commits) {
    var new_commits = {};
    const v1197 = Object.keys(commits);
    const v1205 = function (file) {
        var sha = commits[file];
        const v1198 = file.length;
        const v1199 = v1198 - 1;
        const v1200 = file.substr(v1199, 1);
        const v1201 = v1200 == '/';
        const v1202 = file.length;
        const v1203 = v1202 - 1;
        const v1204 = file.substr(0, v1203);
        if (v1201) {
            file = v1204;
        } else {
            file = file;
        }
        new_commits[file] = sha;
    };
    const v1206 = v1197.forEach(v1205);
    v1206;
    return new_commits;
};
const v1207 = Git.prototype;
const v1238 = function (commit, path, callback) {
    var self = this;
    const v1208 = Array.prototype;
    const v1209 = v1208.slice;
    var args = v1209.call(arguments, 1);
    var callback = args.pop();
    const v1210 = args.length;
    const v1211 = args.shift();
    if (v1210) {
        path = v1211;
    } else {
        path = null;
    }
    const v1212 = path != null;
    const v1213 = path != '';
    const v1214 = v1212 && v1213;
    const v1215 = [path];
    const v1216 = v1215.join('/');
    const v1217 = v1216.toString();
    const v1218 = v1217 + '/';
    if (v1214) {
        path = v1218;
    } else {
        path = path;
    }
    const v1219 = !path;
    const v1220 = path.constructor;
    const v1221 = v1220 != String;
    const v1222 = v1219 || v1221;
    if (v1222) {
        path = '';
    } else {
        path = path;
    }
    const v1236 = function (err, file_index_instance) {
        if (err) {
            const v1223 = callback(err, file_index_instance);
            return v1223;
        }
        const v1224 = {};
        const v1234 = function (err, rev_parse_output) {
            if (err) {
                const v1225 = callback(err, rev_parse_output);
                return v1225;
            }
            const v1232 = function (err, looking_for) {
                if (err) {
                    const v1226 = callback(err, looking_for);
                    return v1226;
                }
                const v1230 = function (err, commits) {
                    if (err) {
                        const v1227 = callback(err, commits);
                        return v1227;
                    }
                    const v1228 = clean_paths(commits);
                    const v1229 = callback(null, v1228);
                    v1229;
                };
                const v1231 = file_index_instance.last_commits(rev_parse_output, looking_for, v1230);
                v1231;
            };
            const v1233 = self.looking_for(commit, path, v1232);
            v1233;
        };
        const v1235 = self.rev_parse(v1224, commit, 0, v1234);
        v1235;
    };
    const v1237 = file_index(this, v1236);
    v1237;
};
v1207.blame_tree = v1238;
const v1239 = Git.prototype;
const v1271 = function (commit, path, callback) {
    var self = this;
    const v1240 = Array.prototype;
    const v1241 = v1240.slice;
    var args = v1241.call(arguments, 1);
    var callback = args.pop();
    const v1242 = args.length;
    const v1243 = args.shift();
    if (v1242) {
        path = v1243;
    } else {
        path = null;
    }
    var file = null;
    const v1244 = {};
    const v1269 = function (err, rev_parse_output) {
        if (err) {
            const v1245 = callback(err, rev_parse_output);
            return v1245;
        }
        const v1246 = self.repository;
        const v1267 = function (err, tree_sha) {
            if (err) {
                const v1247 = callback(err, tree_sha);
                return v1247;
            }
            var looking_for = [];
            const v1248 = self.repository;
            var object = v1248.get_object_by_sha1(tree_sha);
            const v1249 = object.entries;
            const v1264 = function (entry) {
                const v1250 = path == '';
                const v1251 = path == '.';
                const v1252 = v1250 || v1251;
                const v1253 = path == './';
                const v1254 = v1252 || v1253;
                const v1255 = !v1254;
                const v1256 = path && v1255;
                const v1257 = path + '/';
                const v1258 = entry.name;
                const v1259 = v1257 + v1258;
                const v1260 = entry.name;
                if (v1256) {
                    file = v1259;
                } else {
                    file = v1260;
                }
                file = file.replace('//', '/');
                const v1261 = entry.type;
                const v1262 = v1261 == 'directory';
                if (v1262) {
                    file = file + '/';
                }
                const v1263 = looking_for.push(file);
                v1263;
            };
            const v1265 = v1249.forEach(v1264);
            v1265;
            const v1266 = callback(null, looking_for);
            return v1266;
        };
        const v1268 = v1246.get_subtree(rev_parse_output, path, v1267);
        v1268;
    };
    const v1270 = self.rev_parse(v1244, commit, 0, v1269);
    v1270;
};
v1239.looking_for = v1271;
const v1272 = Git.prototype;
const v1281 = function () {
    const v1273 = Array.prototype;
    const v1274 = v1273.slice;
    var args = v1274.call(arguments, 0);
    var callback = args.pop();
    let options;
    const v1275 = args.length;
    const v1276 = args.shift();
    const v1277 = {};
    if (v1275) {
        options = v1276;
    } else {
        options = v1277;
    }
    var arguments = args;
    const v1279 = function (err, result) {
        const v1278 = callback(err, result);
        v1278;
    };
    const v1280 = this.call_git('', 'commit', '', options, arguments, v1279);
    v1280;
};
v1272.commit = v1281;
const v1282 = Git.prototype;
const v1291 = function () {
    const v1283 = Array.prototype;
    const v1284 = v1283.slice;
    var args = v1284.call(arguments, 0);
    var callback = args.pop();
    let options;
    const v1285 = args.length;
    const v1286 = args.shift();
    const v1287 = {};
    if (v1285) {
        options = v1286;
    } else {
        options = v1287;
    }
    var arguments = args;
    const v1289 = function (err, result) {
        const v1288 = callback(err, result);
        v1288;
    };
    const v1290 = this.call_git('', 'config', '', options, arguments, v1289);
    v1290;
};
v1282.config = v1291;
const v1292 = Git.prototype;
const v1301 = function () {
    const v1293 = Array.prototype;
    const v1294 = v1293.slice;
    var args = v1294.call(arguments, 0);
    var callback = args.pop();
    let options;
    const v1295 = args.length;
    const v1296 = args.shift();
    const v1297 = {};
    if (v1295) {
        options = v1296;
    } else {
        options = v1297;
    }
    var arguments = args;
    const v1299 = function (err, result) {
        const v1298 = callback(err, result);
        v1298;
    };
    const v1300 = this.call_git('', 'add', '', options, arguments, v1299);
    v1300;
};
v1292.add = v1301;
const v1302 = Git.prototype;
const v1311 = function () {
    const v1303 = Array.prototype;
    const v1304 = v1303.slice;
    var args = v1304.call(arguments, 0);
    var callback = args.pop();
    let options;
    const v1305 = args.length;
    const v1306 = args.shift();
    const v1307 = {};
    if (v1305) {
        options = v1306;
    } else {
        options = v1307;
    }
    var arguments = args;
    const v1309 = function (err, result) {
        const v1308 = callback(err, result);
        v1308;
    };
    const v1310 = this.call_git('', 'rm', '', options, arguments, v1309);
    v1310;
};
v1302.remove = v1311;
const v1312 = Git.prototype;
const v1321 = function () {
    const v1313 = Array.prototype;
    const v1314 = v1313.slice;
    var args = v1314.call(arguments, 0);
    var callback = args.pop();
    let options;
    const v1315 = args.length;
    const v1316 = args.shift();
    const v1317 = {};
    if (v1315) {
        options = v1316;
    } else {
        options = v1317;
    }
    var arguments = args;
    const v1319 = function (err, result) {
        const v1318 = callback(err, result);
        v1318;
    };
    const v1320 = this.call_git('', 'ls-files', '', options, arguments, v1319);
    v1320;
};
v1312.ls_files = v1321;
const v1322 = Git.prototype;
const v1331 = function () {
    const v1323 = Array.prototype;
    const v1324 = v1323.slice;
    var args = v1324.call(arguments, 0);
    var callback = args.pop();
    let options;
    const v1325 = args.length;
    const v1326 = args.shift();
    const v1327 = {};
    if (v1325) {
        options = v1326;
    } else {
        options = v1327;
    }
    var arguments = args;
    const v1329 = function (err, result) {
        const v1328 = callback(err, result);
        v1328;
    };
    const v1330 = this.call_git('', 'diff-files', '', options, arguments, v1329);
    v1330;
};
v1322.diff_files = v1331;
const v1332 = Git.prototype;
const v1341 = function () {
    const v1333 = Array.prototype;
    const v1334 = v1333.slice;
    var args = v1334.call(arguments, 0);
    var callback = args.pop();
    let options;
    const v1335 = args.length;
    const v1336 = args.shift();
    const v1337 = {};
    if (v1335) {
        options = v1336;
    } else {
        options = v1337;
    }
    var arguments = args;
    const v1339 = function (err, result) {
        const v1338 = callback(err, result);
        v1338;
    };
    const v1340 = this.call_git('', 'diff-index', '', options, arguments, v1339);
    v1340;
};
v1332.diff_index = v1341;
const v1342 = Git.prototype;
const v1346 = function (ref, callback) {
    const v1343 = this.repository;
    const v1344 = v1343.cat_file_type(ref);
    const v1345 = callback(null, v1344);
    return v1345;
};
v1342.file_type = v1346;
const v1347 = Git.prototype;
const v1350 = function (content, type, callback) {
    const v1348 = this.repository;
    const v1349 = v1348.put_raw_object(content, type, callback);
    return v1349;
};
v1347.put_raw_object = v1350;
const v1351 = Git.prototype;
const v1358 = function (id) {
    const v1352 = this.git_directory;
    var repository = new Repository(v1352);
    var object = repository.get_object_by_sha1(id);
    const v1353 = object.type;
    const v1354 = v1353 == 'commit';
    if (v1354) {
        return id;
    } else {
        const v1355 = object.type;
        const v1356 = v1355 == 'tag';
        if (v1356) {
            const v1357 = object.object;
            return v1357;
        } else {
            return '';
        }
    }
};
v1351.commit_from_sha = v1358;