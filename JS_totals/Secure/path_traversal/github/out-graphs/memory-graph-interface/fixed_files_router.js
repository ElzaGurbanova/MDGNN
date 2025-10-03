const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const v90 = process.env;
const v91 = v90.MEMGRAPH_ROOT;
const v92 = path.join(__dirname, '..');
const v93 = v91 || v92;
const BASE_DIR = path.resolve(v93);
const safeInsideBase = function (candidate) {
    const baseReal = fs.realpathSync(BASE_DIR);
    let candReal;
    const v94 = fs.existsSync(candidate);
    const v95 = fs.realpathSync(candidate);
    if (v94) {
        candReal = v95;
    } else {
        candReal = candidate;
    }
    const rel = path.relative(baseReal, candReal);
    const v96 = rel.startsWith('..');
    const v97 = !v96;
    const v98 = rel && v97;
    const v99 = path.isAbsolute(rel);
    const v100 = !v99;
    const v101 = v98 && v100;
    return v101;
};
const v177 = (req, res) => {
    const v102 = console.log('==== [API] GET /api/browse request received ====');
    v102;
    const v103 = req.query;
    const v104 = v103.path;
    const v105 = v104 || '/';
    const requestedPath = String(v105);
    const v106 = req.query;
    const v107 = v106.filter;
    const v108 = v107 || '';
    const filter = String(v108);
    const v109 = `[API] Browsing directory: ${ requestedPath }, filter: ${ filter }`;
    const v110 = console.log(v109);
    v110;
    const v111 = requestedPath.replace(/\\/g, '/');
    const v112 = '.' + v111;
    const targetDir = path.resolve(BASE_DIR, v112);
    const v113 = safeInsideBase(targetDir);
    const v114 = !v113;
    if (v114) {
        const v115 = console.error('[API] Error: Path outside allowed base');
        v115;
        const v116 = res.status(400);
        const v117 = {
            error: 'Invalid path',
            details: 'Path is outside the allowed base directory'
        };
        const v118 = v116.json(v117);
        return v118;
    }
    const v119 = { withFileTypes: true };
    const v175 = (err, entries) => {
        if (err) {
            const v120 = err.message;
            const v121 = console.error('[API] Error reading directory:', v120);
            v121;
            const v122 = res.status(500);
            const v123 = err.message;
            const v124 = {
                error: 'Cannot read directory',
                details: v123
            };
            const v125 = v122.json(v124);
            return v125;
        }
        const files = [];
        const directories = [];
        const baseReal = fs.realpathSync(BASE_DIR);
        const hereReal = fs.realpathSync(targetDir);
        const v126 = hereReal !== baseReal;
        if (v126) {
            const parent = path.dirname(hereReal);
            const v127 = safeInsideBase(parent);
            if (v127) {
                const v128 = {
                    name: '..',
                    path: parent,
                    type: 'directory',
                    isParent: true
                };
                const v129 = directories.push(v128);
                v129;
            }
        }
        const v154 = entry => {
            try {
                const v130 = entry.name;
                const entryPath = path.join(targetDir, v130);
                const v131 = entry.name;
                const v132 = v131.startsWith('.');
                if (v132) {
                    return;
                }
                const v133 = safeInsideBase(entryPath);
                const v134 = !v133;
                if (v134) {
                    return;
                }
                const v135 = entry.isDirectory();
                if (v135) {
                    const v136 = entry.name;
                    const v137 = {
                        name: v136,
                        path: entryPath,
                        type: 'directory'
                    };
                    const v138 = directories.push(v137);
                    v138;
                } else {
                    const v139 = entry.isFile();
                    if (v139) {
                        const v140 = entry.name;
                        const v141 = v140.endsWith(filter);
                        const v142 = !v141;
                        const v143 = filter && v142;
                        if (v143) {
                            return;
                        }
                        const stat = fs.statSync(entryPath);
                        const v144 = entry.name;
                        const v145 = stat.size;
                        const v146 = entry.name;
                        const v147 = path.extname(v146);
                        const v148 = {
                            name: v144,
                            path: entryPath,
                            type: 'file',
                            size: v145,
                            extension: v147
                        };
                        const v149 = files.push(v148);
                        v149;
                    }
                }
            } catch (error) {
                const v150 = entry.name;
                const v151 = `[API] Error processing entry ${ v150 }:`;
                const v152 = error.message;
                const v153 = console.warn(v151, v152);
                v153;
            }
        };
        const v155 = entries.forEach(v154);
        v155;
        const v162 = (a, b) => {
            const v156 = a.isParent;
            if (v156) {
                const v157 = -1;
                return v157;
            }
            const v158 = b.isParent;
            if (v158) {
                return 1;
            }
            const v159 = a.name;
            const v160 = b.name;
            const v161 = v159.localeCompare(v160);
            return v161;
        };
        const v163 = directories.sort(v162);
        v163;
        const v167 = (a, b) => {
            const v164 = a.name;
            const v165 = b.name;
            const v166 = v164.localeCompare(v165);
            return v166;
        };
        const v168 = files.sort(v167);
        v168;
        const v169 = hereReal === baseReal;
        const v170 = hereReal !== baseReal;
        const v171 = path.dirname(hereReal);
        let v172;
        if (v170) {
            v172 = v171;
        } else {
            v172 = null;
        }
        const v173 = {
            current_path: hereReal,
            is_root: v169,
            parent_path: v172,
            directories,
            files,
            filter
        };
        const v174 = res.json(v173);
        v174;
    };
    const v176 = fs.readdir(targetDir, v119, v175);
    v176;
};
const v178 = router.get('/browse', v177);
v178;
module.exports = router;