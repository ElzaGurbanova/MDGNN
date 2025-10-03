var Repo = require('../repo.js');
var API = require('../api.js');
var config = require('../config.js');
var fs = require('fs');
var package = require('../package.js');
var conf = config.loadConfig();
const v126 = function (options, cb) {
    var widgetName = options.widgetName;
    var env = options.env;
    var comment = options.comment;
    var branch = options.branch;
    const v71 = !conf;
    if (v71) {
        const v72 = console.log('you must first login');
        v72;
        return;
    }
    var user = conf.user;
    const v73 = !user;
    if (v73) {
        const v74 = console.log('you must first login');
        v74;
        return;
    }
    const v75 = !widgetName;
    if (v75) {
        const v76 = console.log('you must specify the widget');
        v76;
        return;
    }
    const v77 = !env;
    if (v77) {
        const v78 = console.log('you must specify the env {alpha|beta|product}');
        v78;
        return;
    }
    const v79 = !comment;
    if (v79) {
        const v80 = console.log('you must enter the comment');
        v80;
        return;
    }
    const v81 = !branch;
    if (v81) {
        const v82 = console.log('you must specify a branch');
        v82;
        return;
    }
    const v83 = deleteTempDirectory();
    v83;
    var tempDirectory = createTempDirectory();
    var cp = require('child_process');
    const v84 = 'create temp directory: ' + tempDirectory;
    const v85 = console.log(v84);
    v85;
    var api = API.getAPI(env);
    const v87 = function (extInfo) {
        const v86 = cloneAndSync(extInfo);
        v86;
    };
    const v88 = api.loadWidgetExtInfo(user, widgetName, v87);
    v88;
    const cloneAndSync = function (extInfo) {
        const v89 = extInfo.gitURL;
        const v90 = 'git clone ' + v89;
        const v91 = v90 + ' -b ';
        const v92 = v91 + branch;
        const v93 = v92 + ' ';
        var command = v93 + tempDirectory;
        const v94 = console.log(command);
        v94;
        const v95 = {};
        const v124 = function (err, stdout, stderr) {
            const v96 = console.log(stdout);
            v96;
            const v97 = console.log(stderr);
            v97;
            var projectDir = tempDirectory;
            const v98 = conf.baseDir;
            if (v98) {
            }
            var repo = new Repo(tempDirectory);
            const v104 = function done() {
                const v99 = env == 'product';
                if (v99) {
                } else {
                    const v100 = deleteTempDirectory();
                    v100;
                    const v101 = console.log('delete temp directory success');
                    v101;
                    const v102 = cb('done');
                    const v103 = cb && v102;
                    v103;
                }
            };
            const v105 = commitWidget(widgetName, v104);
            v105;
            const commitWidget = function (widgetName, cb) {
                const v122 = function (widget) {
                    const v106 = !widget;
                    if (v106) {
                        const v107 = 'widget not found: ' + widgetName;
                        const v108 = console.log(v107);
                        v108;
                        return;
                    }
                    const v109 = 'updoading widget: ' + widgetName;
                    const v110 = v109 + '...';
                    const v111 = console.log(v110);
                    v111;
                    const v120 = function (code) {
                        const v112 = code == 200;
                        if (v112) {
                            const v113 = 'updoad ' + widgetName;
                            const v114 = v113 + ' success';
                            const v115 = console.log(v114);
                            v115;
                        } else {
                            const v116 = 'updoad ' + widgetName;
                            const v117 = v116 + ' failed';
                            const v118 = console.log(v117);
                            v118;
                        }
                        const v119 = cb('done');
                        v119;
                    };
                    const v121 = api.commit(user, widget, comment, v120);
                    v121;
                };
                const v123 = repo.loadWidget(widgetName, v122);
                v123;
            };
        };
        const v125 = cp.exec(command, v95, v124);
        v125;
    };
};
exports.sync = v126;
const createTempDirectory = function () {
    const v127 = config.getWizardHome();
    var path = v127 + '/temp';
    const v128 = fs.mkdirSync(path);
    v128;
    return path;
};
const deleteTempDirectory = function () {
    const v129 = config.getWizardHome();
    var path = v129 + '/temp';
    const v130 = deleteFolderRecursive(path);
    v130;
};
var deleteFolderRecursive = function (path) {
    const v131 = fs.existsSync(path);
    if (v131) {
        const v132 = fs.readdirSync(path);
        const v138 = function (file, index) {
            const v133 = path + '/';
            var curPath = v133 + file;
            const v134 = fs.statSync(curPath);
            const v135 = v134.isDirectory();
            if (v135) {
                const v136 = deleteFolderRecursive(curPath);
                v136;
            } else {
                const v137 = fs.unlinkSync(curPath);
                v137;
            }
        };
        const v139 = v132.forEach(v138);
        v139;
        const v140 = fs.rmdirSync(path);
        v140;
    }
};