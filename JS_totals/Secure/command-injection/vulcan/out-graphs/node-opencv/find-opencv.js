'use strict';
const v61 = require('child_process');
var exec = v61.exec;
var fs = require('fs');
var flags = {};
flags['--cflags'] = '--cflags';
flags['--libs'] = '--libs';
const v62 = process.argv;
const v63 = v62[2];
const v64 = flags[v63];
var flag = v64 || '--exists';
let opencv;
const v65 = process.env;
const v66 = v65.PKG_CONFIG_OPENCV3;
const v67 = v66 === '1';
if (v67) {
    opencv = 'opencv3';
} else {
    opencv = ' "opencv >= 2.3.1"';
}
const main = function () {
    const v68 = 'pkg-config ' + opencv;
    const v69 = v68 + ' ';
    const v70 = v69 + flag;
    const v80 = function (error, stdout, stderr) {
        if (error) {
            const v71 = process.platform;
            const v72 = v71 === 'win32';
            if (v72) {
                const v73 = fallback();
                v73;
            } else {
                const v74 = 'ERROR: failed to run: pkg-config' + opencv;
                const v75 = v74 + ' ';
                const v76 = v75 + flag;
                const v77 = v76 + ' - Is OpenCV installed?';
                const v78 = new Error(v77);
                throw v78;
            }
        } else {
            const v79 = console.log(stdout);
            v79;
        }
    };
    const v81 = exec(v70, v80);
    v81;
};
const fallback = function () {
    const v86 = function (error, stdout, stderr) {
        stdout = cleanupEchoOutput(stdout);
        if (error) {
            const v82 = new Error('ERROR: There was an error reading OPENCV_DIR');
            throw v82;
        } else {
            const v83 = stdout === '%OPENCV_DIR%';
            if (v83) {
                const v84 = new Error('ERROR: OPENCV_DIR doesn\'t seem to be defined');
                throw v84;
            } else {
                const v85 = printPaths(stdout);
                v85;
            }
        }
    };
    const v87 = exec('echo %OPENCV_DIR%', v86);
    v87;
};
const printPaths = function (opencvPath) {
    const v88 = flag === '--cflags';
    if (v88) {
        const v89 = '"' + opencvPath;
        const v90 = v89 + '\\..\\..\\include"';
        const v91 = console.log(v90);
        v91;
        const v92 = '"' + opencvPath;
        const v93 = v92 + '\\..\\..\\include\\opencv"';
        const v94 = console.log(v93);
        v94;
    } else {
        const v95 = flag === '--libs';
        if (v95) {
            var libPath = opencvPath + '\\lib\\';
            const v109 = function (err, files) {
                if (err) {
                    const v96 = 'ERROR: couldn\'t read the lib directory ' + err;
                    const v97 = new Error(v96);
                    throw v97;
                }
                var libs = '';
                var i = 0;
                const v98 = files.length;
                let v99 = i < v98;
                while (v99) {
                    const v101 = files[i];
                    const v102 = getExtension(v101);
                    const v103 = v102 === 'lib';
                    if (v103) {
                        const v104 = libs + ' "';
                        const v105 = v104 + libPath;
                        const v106 = files[i];
                        const v107 = v105 + v106;
                        libs = v107 + '" \r\n ';
                    }
                    const v100 = i++;
                    v99 = i < v98;
                }
                const v108 = console.log(libs);
                v108;
            };
            const v110 = fs.readdir(libPath, v109);
            v110;
        } else {
            const v111 = 'Error: unknown argument \'' + flag;
            const v112 = v111 + '\'';
            const v113 = new Error(v112);
            throw v113;
        }
    }
};
const cleanupEchoOutput = function (s) {
    const v114 = s.length;
    const v115 = v114 - 2;
    const v116 = s.slice(0, v115);
    return v116;
};
const getExtension = function (s) {
    const v117 = s.lastIndexOf('.');
    const v118 = v117 + 1;
    const v119 = s.substr(v118);
    return v119;
};
const v120 = main();
v120;