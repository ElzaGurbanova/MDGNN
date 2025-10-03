'use strict';
const v109 = require('./util');
const log = v109.log;
const err = v109.err;
const guessNpmLocation = v109.guessNpmLocation;
const patchHook = v109.patchHook;
const path = require('path');
const fs = require('graceful-fs');
const os = require('os');
const cp = require('child_process');
const npmLocation = guessNpmLocation();
const hooks = [
    'postinstall',
    'preinstall',
    'install'
];
const actionFolder = path.join(npmLocation, 'lib/install/action');
const v114 = h => {
    const v110 = h + '.js';
    const v111 = path.join(actionFolder, v110);
    const v112 = {
        path: v111,
        name: h
    };
    const v113 = [v112];
    return v113;
};
const v115 = hooks.map(v114);
const v117 = a => {
    const v116 = a[0];
    return v116;
};
const actions = v115.map(v117);
const v118 = console.log('Installing npm patches for npm-adblock...');
v118;
const v119 = log('npm %o', npmLocation);
v119;
const v120 = log('actions %o', actionFolder);
v120;
let tryAgainWithSudo = false;
let tryAgainWithUAC = false;
const v151 = ({name, path}) => {
    try {
        const v121 = log(path);
        v121;
        const v122 = fs.readFileSync(path);
        const contents = String(v122);
        const patchedContents = patchHook(contents, name);
        const v123 = contents !== patchedContents;
        if (v123) {
            const v124 = fs.writeFileSync(path, patchedContents);
            v124;
        }
    } catch (_err) {
        const v125 = _err.code;
        const v126 = v125 === 'EACCES';
        if (v126) {
            const v127 = process.env;
            const v128 = v127.ADBLOCK_SUDO;
            const v129 = !v128;
            const v130 = process.platform;
            const v131 = v130 === 'linux';
            const v132 = v129 && v131;
            if (v132) {
                tryAgainWithSudo = true;
            } else {
                const v133 = err('\n *** Failed patching %s *** \n *** You NEED to run this script as an administrator or otherwise make the file accessible for patching! *** \n', path);
                v133;
            }
            return;
        } else {
            const v134 = _err.code;
            const v135 = v134 === 'EPERM';
            if (v135) {
                const v136 = process.env;
                const v137 = v136.ADBLOCK_SUDO;
                const v138 = !v137;
                const v139 = process.platform;
                const v140 = v139 === 'linux';
                const v141 = v138 && v140;
                if (v141) {
                    tryAgainWithSudo = true;
                } else {
                    const v142 = process.env;
                    const v143 = v142.ADBLOCK_UAC;
                    const v144 = !v143;
                    const v145 = process.platform;
                    const v146 = v145 === 'win32';
                    const v147 = v144 && v146;
                    if (v147) {
                        tryAgainWithUAC = true;
                    } else {
                        const v148 = err('\n *** Failed patching %s *** \n *** You NEED to run this script as an administrator or otherwise make the file accessible for patching! *** \n', path);
                        v148;
                    }
                }
                return;
            }
        }
        const v149 = _err.stack;
        const v150 = err('\n *** Failed patching %s *** \n%s', path, v149);
        v150;
    }
};
const v152 = actions.forEach(v151);
v152;
const escape = require('shell-escape');
if (tryAgainWithSudo) {
    const v153 = console.log('Couldn\'t install. Trying again with sudo/su...');
    v153;
    const userInfo = user => {
        const v154 = console.log('(If promted for a password, it is the one of the user %o)', user);
        v154;
        const v155 = console.log('(If you have never set a password for that user, simply press enter - it may fail, though)');
        v155;
    };
    const trySudo = () => {
        const v156 = os.userInfo();
        const v157 = v156.username;
        const v158 = userInfo(v157);
        v158;
        const v159 = process.argv;
        const v160 = { ADBLOCK_SUDO: '1' };
        const v161 = process.env;
        const v162 = Object.assign(v160, v161);
        const v163 = {
            env: v162,
            stdio: 'inherit'
        };
        const v164 = cp.spawn('sudo', v159, v163);
        return v164;
    };
    const trySu = () => {
        const v165 = userInfo('root');
        v165;
        const v166 = process.argv;
        const v167 = escape(v166);
        const v168 = [
            'sh',
            '-c',
            v167
        ];
        const v169 = escape(v168);
        const v170 = [
            'root',
            '-s',
            '/bin/sh',
            '-c',
            v169
        ];
        const v171 = { ADBLOCK_SUDO: '1' };
        const v172 = process.env;
        const v173 = Object.assign(v171, v172);
        const v174 = {
            env: v173,
            stdio: 'inherit'
        };
        const v175 = cp.spawn('su', v170, v174);
        return v175;
    };
    let t;
    const v176 = os.userInfo();
    const v177 = v176.username;
    const v178 = v177 === 'nobody';
    if (v178) {
        t = [
            trySu,
            trySudo
        ];
    } else {
        t = [
            trySudo,
            trySu
        ];
    }
    const tryMethod = function () {
        let method = t.shift();
        const v179 = !method;
        if (v179) {
            const v180 = err('\n *** Failed getting root privileges *** \n *** You NEED to run this script as an administrator or otherwise make the file accessible for patching! *** \n');
            v180;
        } else {
            const v181 = method();
            const v186 = (code, sig) => {
                const v182 = code || sig;
                if (v182) {
                    const v183 = code || sig;
                    const v184 = console.log('Failed with %o! Trying different method...', v183);
                    v184;
                    const v185 = tryMethod();
                    v185;
                }
            };
            const v187 = v181.once('close', v186);
            v187;
        }
    };
    const v188 = tryMethod();
    v188;
} else {
    if (tryAgainWithUAC) {
        const v189 = console.log('Couldn\'t install. Trying again with UAC...');
        v189;
        const v190 = os.tmpdir();
        const v191 = Math.random();
        const v192 = String(v191);
        const v193 = v192 + '.cmd';
        const tmpPath = path.join(v190, v193);
        const v194 = os.tmpdir();
        const v195 = Math.random();
        const v196 = String(v195);
        const v197 = v196 + '.txt';
        const tmpOutPath = path.join(v194, v197);
        const v198 = path.dirname(npmLocation);
        const v199 = JSON.stringify(v198);
        const v200 = process.argv;
        const v201 = JSON.stringify;
        const v202 = v200.map(v201);
        const v203 = v202.join(' ');
        const v204 = JSON.stringify(tmpOutPath);
        const SCRIPT = `@if (1==1) @if(1==0) @ELSE
@echo off&SETLOCAL ENABLEEXTENSIONS
>nul 2>&1 "%SYSTEMROOT%\\system32\\cacls.exe" "%SYSTEMROOT%\\system32\\config\\system"||(
    cscript //E:JScript //nologo "%~f0"
    @goto :EOF
)
echo.Installing npm-adblock...
setx ADBLOCK_UAC "1"
setx npm_guess ${ v199 } /M
${ v203 } >${ v204 }
REM https://stackoverflow.com/a/5969764/3990041
@goto :EOF
@end @ELSE
ShA=new ActiveXObject("Shell.Application")
ShA.ShellExecute("cmd.exe","/c \\""+WScript.ScriptFullName+"\\"","","runas",5);
@end
`;
        const v205 = fs.writeFileSync(tmpPath, SCRIPT);
        v205;
        const out = cp.execSync(tmpPath);
        const v206 = String(out);
        const v207 = console.log(v206);
        v207;
        const v213 = () => {
            const v208 = fs.unlinkSync(tmpPath);
            v208;
            const v209 = fs.readFileSync(tmpOutPath);
            const v210 = String(v209);
            const v211 = console.log(v210);
            v211;
            const v212 = fs.unlinkSync(tmpOutPath);
            v212;
        };
        const v214 = 5 * 1000;
        const v215 = setTimeout(v213, v214);
        v215;
    } else {
        const v216 = console.log('Installed successfully!');
        v216;
    }
}