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
const v114 = process.removeAllListeners('uncaughtException');
v114;
const v115 = process.stdin;
const v116 = v115.pause();
v116;
const v117 = process.argv;
const v118 = v117.slice(2);
var argv = parseArgs(v118);
globals = argv.globals;
const v119 = app.commandLine;
const v120 = v119.appendSwitch('disable-http-cache');
v120;
const v121 = argv.verbose;
const v122 = !v121;
if (v122) {
    const v123 = app.commandLine;
    const v124 = v123.appendSwitch('v', '-1');
    v124;
    const v125 = app.commandLine;
    const v126 = v125.appendSwitch('vmodule', 'console=0');
    v126;
}
const v127 = argv.version;
const v128 = argv.v;
const v129 = v127 || v128;
if (v129) {
    const v130 = require('./package.json');
    const v131 = v130.version;
    const v132 = console.log(v131);
    v132;
    const v133 = process.exit(0);
    v133;
}
const v134 = argv.config;
const v135 = argv.config;
const v136 = v135.v8;
const v137 = v134 && v136;
if (v137) {
    const v138 = [];
    const v139 = argv.config;
    const v140 = v139.v8;
    const v141 = v140.flags;
    const v142 = v138.concat(v141);
    var flags = v142.filter(Boolean);
    const v145 = function (flag) {
        const v143 = app.commandLine;
        const v144 = v143.appendSwitch('js-flags', flag);
        v144;
    };
    const v146 = flags.forEach(v145);
    v146;
}
var cwd = process.cwd();
const v147 = argv._;
var entryFile = v147[0];
if (entryFile) {
    const v148 = path.isAbsolute(entryFile);
    const v149 = path.resolve(cwd, entryFile);
    if (v148) {
        entryFile = entryFile;
    } else {
        entryFile = v149;
    }
    try {
        entryFile = require.resolve(entryFile);
        globals.entry = entryFile;
    } catch (err) {
        const v150 = err.stack;
        const v151 = err.stack;
        let v152;
        if (v150) {
            v152 = v151;
        } else {
            v152 = err;
        }
        const v153 = console.error(v152);
        v153;
        const v154 = process.exit(1);
        v154;
    }
}
var watcher = null;
var mainWindow = null;
const v156 = function () {
    const v155 = app.quit();
    v155;
};
const v157 = app.on('window-all-closed', v156);
v157;
const v160 = function () {
    if (watcher) {
        const v158 = watcher.close();
        v158;
    }
    if (exitWithCode1) {
        const v159 = process.exit(1);
        v159;
    }
};
const v161 = app.on('quit', v160);
v161;
const v225 = function () {
    var htmlFile = path.resolve(__dirname, 'lib', 'index.html');
    var customHtml = false;
    const v162 = argv.index;
    if (v162) {
        customHtml = true;
        const v163 = argv.index;
        const v164 = path.isAbsolute(v163);
        const v165 = argv.index;
        const v166 = argv.index;
        const v167 = path.resolve(cwd, v166);
        if (v164) {
            htmlFile = v165;
        } else {
            htmlFile = v167;
        }
    }
    const v168 = 'file://' + __dirname;
    var mainIndexURL = v168 + '/index.html';
    const v169 = electron.protocol;
    const v189 = function (request, callback) {
        var file = request.url;
        const v170 = file === mainIndexURL;
        if (v170) {
            file = htmlFile;
        } else {
            const v171 = file.indexOf('file://');
            const v172 = v171 === 0;
            if (v172) {
                var raw = file.substring(7);
                try {
                    raw = decodeURIComponent(raw);
                } catch (e) {
                }
                const v173 = process.platform;
                const v174 = v173 === 'win32';
                const v175 = /^\/[a-zA-Z]:/.test(raw);
                const v176 = v174 && v175;
                if (v176) {
                    raw = raw.slice(1);
                }
                var relFromApp = path.relative(__dirname, raw);
                var candidate = path.resolve(cwd, relFromApp);
                var relToCwd = path.relative(cwd, candidate);
                const v177 = relToCwd.startsWith('..');
                const v178 = path.isAbsolute(relToCwd);
                const v179 = v177 || v178;
                if (v179) {
                    const v180 = -6;
                    const v181 = callback(v180);
                    return v181;
                }
                file = candidate;
            }
        }
        const v187 = function (err, data) {
            if (err) {
                const v182 = -6;
                const v183 = callback(v182);
                return v183;
            }
            const v184 = mime.lookup(file);
            const v185 = {
                data: data,
                mimeType: v184
            };
            const v186 = callback(v185);
            v186;
        };
        const v188 = fs.readFile(file, v187);
        v188;
    };
    const v191 = function (err) {
        if (err) {
            const v190 = fatal(err);
            v190;
        }
    };
    const v192 = v169.interceptBufferProtocol('file', v189, v191);
    v192;
    const v194 = function () {
        const v193 = argv.quit;
        globals.quit = v193;
    };
    mainWindow = createMainWindow(entryFile, mainIndexURL, argv, v194);
    const v195 = function () {
        mainWindow = null;
    };
    const v196 = mainWindow.on('closed', v195);
    v196;
    const v197 = argv.watch;
    if (v197) {
        const v198 = [];
        const v199 = argv.watch;
        const v200 = v198.concat(v199);
        const v203 = function (f) {
            const v201 = typeof f;
            const v202 = v201 === 'string';
            return v202;
        };
        var globs = v200.filter(v203);
        const v204 = globs.length;
        const v205 = v204 === 0;
        if (v205) {
            globs = ['**/*.{js,json}'];
        }
        const v206 = globs.indexOf(htmlFile);
        const v207 = -1;
        const v208 = v206 === v207;
        const v209 = customHtml && v208;
        if (v209) {
            const v210 = globs.push(htmlFile);
            v210;
        }
        watcher = createWatch(globs, argv);
        const v212 = function (file) {
            if (mainWindow) {
                const v211 = mainWindow.reload();
                v211;
            }
        };
        const v213 = watcher.on('change', v212);
        v213;
    }
    const v216 = function (event, errObj) {
        var err = JSON.parse(errObj);
        const v214 = err.stack;
        const v215 = bail(v214);
        v215;
    };
    const v217 = ipc.on('error', v216);
    v217;
    const bail = function (err) {
        const v218 = err.stack;
        const v219 = err.stack;
        let v220;
        if (v218) {
            v220 = v219;
        } else {
            v220 = err;
        }
        const v221 = console.error(v220);
        v221;
        const v222 = globals.quit;
        if (v222) {
            exitWithCode1 = true;
            if (mainWindow) {
                const v223 = mainWindow.close();
                v223;
            }
        }
    };
    const fatal = function (err) {
        globals.quit = true;
        const v224 = bail(err);
        v224;
    };
};
const v226 = app.on('ready', v225);
v226;