const fs = require('fs');
const v115 = require('child_process');
const execFileSync = v115.execFileSync;
const shellescape = require('shell-escape');
const blink = (blinksLeft, exit) => {
    const v116 = blinksLeft >= 0;
    if (v116) {
        const v117 = [
            '-invert',
            '-alter'
        ];
        const v118 = { stdio: 'ignore' };
        const v119 = execFileSync('xcalib', v117, v118);
        v119;
        const v120 = wait(0.125);
        v120;
        const v121 = blinksLeft - 1;
        const v122 = blink(v121, exit);
        v122;
    } else {
        const v123 = wait(0.125);
        v123;
        try {
            const v124 = ['-o'];
            const v125 = { stdio: 'ignore' };
            const v126 = execFileSync('redshift', v124, v125);
            v126;
        } catch (_) {
        }
        if (exit) {
            const v127 = process.exit();
            v127;
        }
    }
};
const wait = s => {
    const start = Date.now();
    const v128 = Date.now();
    const v129 = v128 - start;
    const v130 = s * 1000;
    let v131 = v129 < v130;
    while (v131) {
        v131 = v129 < v130;
    }
};
const isSafeWindowId = function (id) {
    const v132 = typeof id;
    const v133 = v132 === 'string';
    const v134 = /^[0-9A-Fa-fx]+$/.test(id);
    const v135 = v133 && v134;
    return v135;
};
const getWinInfo = windowId => {
    let wininfo = {};
    const v136 = isSafeWindowId(windowId);
    const v137 = !v136;
    if (v137) {
        const v138 = new Error('Invalid window id');
        throw v138;
    }
    const v139 = [
        '-ia',
        windowId
    ];
    const v140 = execFileSync('wmctrl', v139);
    v140;
    const v141 = wait(0.125);
    v141;
    const v142 = [
        '-root',
        '_NET_ACTIVE_WINDOW'
    ];
    const v143 = { encoding: 'utf8' };
    const activeOut = execFileSync('xprop', v142, v143);
    const idMatch = activeOut.match(/(#\s*)?(0x[0-9a-fA-F]+|\d+)/);
    let activeId;
    const v144 = idMatch[2];
    const v145 = idMatch[1];
    const v146 = v144 || v145;
    if (idMatch) {
        activeId = v146;
    } else {
        activeId = null;
    }
    let wmClass = '';
    const v147 = isSafeWindowId(activeId);
    const v148 = activeId && v147;
    if (v148) {
        const v149 = [
            '-id',
            activeId,
            'WM_CLASS'
        ];
        const v150 = { encoding: 'utf8' };
        const wmOut = execFileSync('xprop', v149, v150);
        const v151 = wmOut.split('"');
        const parts = v151.filter(Boolean);
        const v152 = parts.length;
        const v153 = v152 >= 4;
        if (v153) {
            const v154 = parts[1];
            const v155 = parts[3];
            wmClass = `${ v154 }.${ v155 }`;
        }
    }
    const v156 = ['getactivewindow'];
    const v157 = { encoding: 'utf8' };
    const v158 = execFileSync('xdotool', v156, v157);
    const xdotoolId = v158.trim();
    const v159 = [
        '-id',
        xdotoolId
    ];
    const v160 = { encoding: 'utf8' };
    const xwininfoOut = execFileSync('xwininfo', v159, v160);
    const lines = xwininfoOut.split('\n');
    const map = {};
    let raw;
    for (raw of lines) {
        const line = raw.trim();
        const v161 = !line;
        if (v161) {
            continue;
        }
        const idx = line.indexOf(':');
        const v162 = -1;
        const v163 = idx !== v162;
        if (v163) {
            const v164 = line.slice(0, idx);
            const key = v164.trim();
            const v165 = idx + 1;
            const v166 = line.slice(v165);
            const val = v166.trim();
            map[key] = val;
        }
    }
    const v167 = [
        '_NET_FRAME_EXTENTS',
        '-id',
        windowId
    ];
    const v168 = { encoding: 'utf8' };
    const extRaw = execFileSync('xprop', v167, v168);
    const v169 = extRaw.split('=');
    const v170 = v169.pop();
    const v171 = v170 || '';
    const v172 = v171.replace(/\s/g, '');
    const nums = v172.split(',');
    const v173 = nums[0];
    const v174 = isNaN(v173);
    const v175 = nums[0];
    let v176;
    if (v174) {
        v176 = '0';
    } else {
        v176 = v175;
    }
    const v177 = parseInt(v176, 10);
    const v178 = v177 || 0;
    const v179 = nums[1];
    const v180 = isNaN(v179);
    const v181 = nums[1];
    let v182;
    if (v180) {
        v182 = '0';
    } else {
        v182 = v181;
    }
    const v183 = parseInt(v182, 10);
    const v184 = v183 || 0;
    const v185 = nums[2];
    const v186 = isNaN(v185);
    const v187 = nums[2];
    let v188;
    if (v186) {
        v188 = '0';
    } else {
        v188 = v187;
    }
    const v189 = parseInt(v188, 10);
    const v190 = v189 || 0;
    const v191 = nums[3];
    const v192 = isNaN(v191);
    const v193 = nums[3];
    let v194;
    if (v192) {
        v194 = '0';
    } else {
        v194 = v193;
    }
    const v195 = parseInt(v194, 10);
    const v196 = v195 || 0;
    const extents = {};
    extents.lb = v178;
    extents.rb = v184;
    extents.tb = v190;
    extents.bb = v196;
    const v197 = map['Absolute upper-left X'];
    const v198 = parseInt(v197, 10);
    const v199 = extents.lb;
    const v200 = v198 - v199;
    const x = v200 + '';
    const v201 = map['Absolute upper-left Y'];
    const v202 = parseInt(v201, 10);
    const v203 = extents.tb;
    const v204 = v202 - v203;
    const y = v204 + '';
    const v205 = map['Width'];
    const v206 = parseInt(v205, 10);
    const v207 = extents.lb;
    const v208 = v206 + v207;
    const v209 = extents.rb;
    const v210 = v208 + v209;
    const w = v210 + '';
    const v211 = map['Height'];
    const v212 = parseInt(v211, 10);
    const v213 = extents.bb;
    const v214 = v212 + v213;
    const h = v214 + '';
    const v215 = {};
    v215.x = x;
    v215.y = y;
    v215.w = w;
    v215.h = h;
    wininfo.geo = v215;
    wininfo.wmClass = wmClass;
    wininfo = {};
    wininfo = {};
    return wininfo;
};
const getScreens = () => {
    const v216 = [
        '-d',
        ':0',
        '-q'
    ];
    const v217 = { encoding: 'utf8' };
    const xr = execFileSync('xrandr', v216, v217);
    const v218 = xr.split('\n');
    const v220 = l => {
        const v219 = / connected\b/.test(l);
        return v219;
    };
    const v221 = v218.filter(v220);
    const count = v221.length;
    const v222 = String(count);
    return v222;
};
const readJsonFile = file => {
    let data = {};
    try {
        const v223 = fs.readFileSync(file);
        const v224 = v223.toString();
        data = JSON.parse(v224);
        const v225 = data === '';
        const v226 = !data;
        const v227 = v225 || v226;
        if (v227) {
            data = {};
        }
    } catch (e) {
    }
    return data;
};
const v228 = {};
v228.blink = blink;
v228.wait = wait;
v228.getWinInfo = getWinInfo;
v228.getScreens = getScreens;
v228.readJsonFile = readJsonFile;
v228.shellescape = shellescape;
module.exports = v228;