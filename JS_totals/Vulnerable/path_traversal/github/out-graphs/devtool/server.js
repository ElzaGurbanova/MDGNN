var path = require('path');
var fs = require('fs');
var createWatch = require('./lib/file-watch');
var createMainWindow = require('./lib/main-window');
var parseArgs = require('./lib/parse-args');
var mime = require('mime');
var electron = require('electron');
var app = electron.app;
var ipc = electron.ipcMain;
var globals;
var exitWithCode1 = false;
const v106 = process.removeAllListeners('uncaughtException');
v106;
const v107 = process.stdin;
const v108 = v107.pause();
v108;
const v109 = process.argv;
const v110 = v109.slice(2);
var argv = parseArgs(v110);
globals = argv.globals;
const v111 = app.commandLine;
const v112 = v111.appendSwitch('disable-http-cache');
v112;
const v113 = argv.verbose;
const v114 = !v113;
if (v114) {
    const v115 = app.commandLine;
    const v116 = v115.appendSwitch('v', '-1');
    v116;
    const v117 = app.commandLine;
    const v118 = v117.appendSwitch('vmodule', 'console=0');
    v118;
}
const v119 = argv.version;
const v120 = argv.v;
const v121 = v119 || v120;
if (v121) {
    const v122 = require('./package.json');
    const v123 = v122.version;
    const v124 = console.log(v123);
    v124;
    const v125 = process.exit(0);
    v125;
}
const v126 = argv.config;
const v127 = argv.config;
const v128 = v127.v8;
const v129 = v126 && v128;
if (v129) {
    const v130 = [];
    const v131 = argv.config;
    const v132 = v131.v8;
    const v133 = v132.flags;
    const v134 = v130.concat(v133);
    var flags = v134.filter(Boolean);
    const v137 = function (flag) {
        const v135 = app.commandLine;
        const v136 = v135.appendSwitch('js-flags', flag);
        v136;
    };
    const v138 = flags.forEach(v137);
    v138;
}
var cwd = process.cwd();
const v139 = argv._;
var entryFile = v139[0];
if (entryFile) {
    const v140 = path.isAbsolute(entryFile);
    const v141 = path.resolve(cwd, entryFile);
    if (v140) {
        entryFile = entryFile;
    } else {
        entryFile = v141;
    }
    try {
        entryFile = require.resolve(entryFile);
        globals.entry = entryFile;
    } catch (err) {
        const v142 = err.stack;
        const v143 = err.stack;
        let v144;
        if (v142) {
            v144 = v143;
        } else {
            v144 = err;
        }
        const v145 = console.error(v144);
        v145;
        const v146 = process.exit(1);
        v146;
    }
}
var watcher = null;
var mainWindow = null;
const v148 = function () {
    const v147 = app.quit();
    v147;
};
const v149 = app.on('window-all-closed', v148);
v149;
const v152 = function () {
    if (watcher) {
        const v150 = watcher.close();
        v150;
    }
    if (exitWithCode1) {
        const v151 = process.exit(1);
        v151;
    }
};
const v153 = app.on('quit', v152);
v153;
const v209 = function () {
    var htmlFile = path.resolve(__dirname, 'lib', 'index.html');
    var customHtml = false;
    const v154 = argv.index;
    if (v154) {
        customHtml = true;
        const v155 = argv.index;
        const v156 = path.isAbsolute(v155);
        const v157 = argv.index;
        const v158 = argv.index;
        const v159 = path.resolve(cwd, v158);
        if (v156) {
            htmlFile = v157;
        } else {
            htmlFile = v159;
        }
    }
    const v160 = 'file://' + __dirname;
    var mainIndexURL = v160 + '/index.html';
    const v161 = electron.protocol;
    const v173 = function (request, callback) {
        var file = request.url;
        const v162 = file === mainIndexURL;
        if (v162) {
            file = htmlFile;
        } else {
            const v163 = file.indexOf('file://');
            const v164 = v163 === 0;
            if (v164) {
                file = file.substring(7);
                const v165 = path.relative(__dirname, file);
                file = path.resolve(cwd, v165);
            }
        }
        const v171 = function (err, data) {
            if (err) {
                const v166 = -6;
                const v167 = callback(v166);
                return v167;
            }
            const v168 = mime.lookup(file);
            const v169 = {
                data: data,
                mimeType: v168
            };
            const v170 = callback(v169);
            v170;
        };
        const v172 = fs.readFile(file, v171);
        v172;
    };
    const v175 = function (err) {
        if (err) {
            const v174 = fatal(err);
            v174;
        }
    };
    const v176 = v161.interceptBufferProtocol('file', v173, v175);
    v176;
    const v178 = function () {
        const v177 = argv.quit;
        globals.quit = v177;
    };
    mainWindow = createMainWindow(entryFile, mainIndexURL, argv, v178);
    const v179 = function () {
        mainWindow = null;
    };
    const v180 = mainWindow.on('closed', v179);
    v180;
    const v181 = argv.watch;
    if (v181) {
        const v182 = [];
        const v183 = argv.watch;
        const v184 = v182.concat(v183);
        const v187 = function (f) {
            const v185 = typeof f;
            const v186 = v185 === 'string';
            return v186;
        };
        var globs = v184.filter(v187);
        const v188 = globs.length;
        const v189 = v188 === 0;
        if (v189) {
            globs = ['**/*.{js,json}'];
        }
        const v190 = globs.indexOf(htmlFile);
        const v191 = -1;
        const v192 = v190 === v191;
        const v193 = customHtml && v192;
        if (v193) {
            const v194 = globs.push(htmlFile);
            v194;
        }
        watcher = createWatch(globs, argv);
        const v196 = function (file) {
            if (mainWindow) {
                const v195 = mainWindow.reload();
                v195;
            }
        };
        const v197 = watcher.on('change', v196);
        v197;
    }
    const v200 = function (event, errObj) {
        var err = JSON.parse(errObj);
        const v198 = err.stack;
        const v199 = bail(v198);
        v199;
    };
    const v201 = ipc.on('error', v200);
    v201;
    const bail = function (err) {
        const v202 = err.stack;
        const v203 = err.stack;
        let v204;
        if (v202) {
            v204 = v203;
        } else {
            v204 = err;
        }
        const v205 = console.error(v204);
        v205;
        const v206 = globals.quit;
        if (v206) {
            exitWithCode1 = true;
            if (mainWindow) {
                const v207 = mainWindow.close();
                v207;
            }
        }
    };
    const fatal = function (err) {
        globals.quit = true;
        const v208 = bail(err);
        v208;
    };
};
const v210 = app.on('ready', v209);
v210;