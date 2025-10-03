'use strict';
const v56 = require('child_process');
var exec = v56.exec;
var fs = require('fs');
const v57 = process.argv;
const v58 = v57[2];
var flag = v58 || '--exists';
let opencv;
const v59 = process.env;
const v60 = v59.PKG_CONFIG_OPENCV3;
const v61 = v60 === '1';
if (v61) {
    opencv = 'opencv3';
} else {
    opencv = '"opencv >= 2.3.1"';
}
const main = function () {
    const v62 = 'pkg-config ' + opencv;
    const v63 = v62 + ' ';
    const v64 = v63 + flag;
    const v70 = function (error, stdout, stderr) {
        if (error) {
            const v65 = process.platform;
            const v66 = v65 === 'win32';
            if (v66) {
                const v67 = fallback();
                v67;
            } else {
                const v68 = new Error('ERROR: failed to run: pkg-config', opencv, flag);
                throw v68;
            }
        } else {
            const v69 = console.log(stdout);
            v69;
        }
    };
    const v71 = exec(v64, v70);
    v71;
};
const fallback = function () {
    const v76 = function (error, stdout, stderr) {
        stdout = cleanupEchoOutput(stdout);
        if (error) {
            const v72 = new Error('ERROR: There was an error reading OPENCV_DIR');
            throw v72;
        } else {
            const v73 = stdout === '%OPENCV_DIR%';
            if (v73) {
                const v74 = new Error('ERROR: OPENCV_DIR doesn\'t seem to be defined');
                throw v74;
            } else {
                const v75 = printPaths(stdout);
                v75;
            }
        }
    };
    const v77 = exec('echo %OPENCV_DIR%', v76);
    v77;
};
const printPaths = function (opencvPath) {
    const v78 = flag === '--cflags';
    if (v78) {
        const v79 = '"' + opencvPath;
        const v80 = v79 + '\\..\\..\\include"';
        const v81 = console.log(v80);
        v81;
        const v82 = '"' + opencvPath;
        const v83 = v82 + '\\..\\..\\include\\opencv"';
        const v84 = console.log(v83);
        v84;
    } else {
        const v85 = flag === '--libs';
        if (v85) {
            var libPath = opencvPath + '\\lib\\';
            const v99 = function (err, files) {
                if (err) {
                    const v86 = 'ERROR: couldn\'t read the lib directory ' + err;
                    const v87 = new Error(v86);
                    throw v87;
                }
                var libs = '';
                var i = 0;
                const v88 = files.length;
                let v89 = i < v88;
                while (v89) {
                    const v91 = files[i];
                    const v92 = getExtension(v91);
                    const v93 = v92 === 'lib';
                    if (v93) {
                        const v94 = libs + ' "';
                        const v95 = v94 + libPath;
                        const v96 = files[i];
                        const v97 = v95 + v96;
                        libs = v97 + '" \r\n ';
                    }
                    const v90 = i++;
                    v89 = i < v88;
                }
                const v98 = console.log(libs);
                v98;
            };
            const v100 = fs.readdir(libPath, v99);
            v100;
        } else {
            const v101 = 'Error: unknown argument \'' + flag;
            const v102 = v101 + '\'';
            const v103 = new Error(v102);
            throw v103;
        }
    }
};
const cleanupEchoOutput = function (s) {
    const v104 = s.length;
    const v105 = v104 - 2;
    const v106 = s.slice(0, v105);
    return v106;
};
const getExtension = function (s) {
    const v107 = s.lastIndexOf('.');
    const v108 = v107 + 1;
    const v109 = s.substr(v108);
    return v109;
};
const v110 = main();
v110;