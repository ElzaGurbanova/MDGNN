const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const app = express();
const port = 3088;
const tempDir = path.join(__dirname, 'temp');
const v113 = fs.existsSync(tempDir);
const v114 = !v113;
if (v114) {
    const v115 = { recursive: true };
    const v116 = fs.mkdirSync(tempDir, v115);
    v116;
}
const v117 = path.resolve('saves');
const SAVES_ROOT = fs.realpathSync(v117);
const isInside = function (base, target) {
    const rel = path.relative(base, target);
    const v118 = rel.startsWith('..');
    const v119 = !v118;
    const v120 = rel && v119;
    const v121 = path.isAbsolute(rel);
    const v122 = !v121;
    const v123 = v120 && v122;
    return v123;
};
const antiDirectoryTraversalAttack = function (userInput) {
    const invalidPathPattern = /(\.\.(\/|\\|$))/;
    const v124 = userInput || '';
    const raw = String(v124);
    const v125 = raw.includes('\0');
    const v126 = invalidPathPattern.test(raw);
    const v127 = v125 || v126;
    if (v127) {
        const v128 = new Error('不正なパスが検出されました\u3002');
        throw v128;
    }
    const joinedPath = path.join(SAVES_ROOT, raw);
    let realPath;
    try {
        realPath = fs.realpathSync(joinedPath);
    } catch (err) {
        const v129 = new Error('不正なパスが検出されました\u3002');
        throw v129;
    }
    const v130 = isInside(SAVES_ROOT, realPath);
    const v131 = !v130;
    if (v131) {
        const v132 = new Error('不正なパスが検出されました\u3002');
        throw v132;
    }
    return realPath;
};
const addFileIfSafe = function (archive, baseDir, absPath, nameInZip) {
    try {
        const real = fs.realpathSync(absPath);
        const v133 = isInside(baseDir, real);
        const v134 = fs.existsSync(real);
        const v135 = v133 && v134;
        const v136 = fs.statSync(real);
        const v137 = v136.isFile();
        const v138 = v135 && v137;
        if (v138) {
            const v139 = { name: nameInZip };
            const v140 = archive.file(real, v139);
            v140;
            return true;
        }
    } catch (_) {
    }
    return false;
};
const v151 = (req, res) => {
    const v141 = req.params;
    const userid = v141.userid;
    const tweetID = v141.tweetID;
    const filename = v141.filename;
    let filePath = path.join(userid, tweetID, filename);
    try {
        filePath = antiDirectoryTraversalAttack(filePath);
    } catch (e) {
        const v142 = res.status(418);
        const v143 = v142.send('File not found');
        return v143;
    }
    const v144 = fs.constants;
    const v145 = v144.F_OK;
    const v149 = err => {
        if (err) {
            const v146 = res.status(418);
            const v147 = v146.send('File not found');
            v147;
        } else {
            const v148 = res.sendFile(filePath);
            v148;
        }
    };
    const v150 = fs.access(filePath, v145, v149);
    v150;
};
const v152 = app.get('/data/:userid/:tweetID/:filename', v151);
v152;
const v183 = (req, res) => {
    const v153 = req.params;
    const userid = v153.userid;
    const tweetID = v153.tweetID;
    let dirPath = path.join(userid, tweetID);
    try {
        dirPath = antiDirectoryTraversalAttack(dirPath);
    } catch (e) {
        const v154 = res.status(418);
        const v155 = v154.send('File not found');
        return v155;
    }
    const v181 = (err, files) => {
        if (err) {
            const v156 = res.status(500);
            const v157 = v156.send('Internal Server Error');
            v157;
            return;
        }
        const v158 = !files;
        const v159 = files.length;
        const v160 = v159 === 0;
        const v161 = v158 || v160;
        if (v161) {
            const v162 = res.status(418);
            const v163 = v162.send('No files to download');
            v163;
            return;
        }
        const zipName = `${ userid }_${ tweetID }_files.zip`;
        const v164 = {};
        v164.level = 9;
        const v165 = { zlib: v164 };
        const archive = archiver('zip', v165);
        const v168 = () => {
            const v166 = res.status(500);
            const v167 = v166.send('Error creating zip file');
            v167;
        };
        const v169 = archive.on('error', v168);
        v169;
        const v170 = res.attachment(zipName);
        v170;
        const v171 = archive.pipe(res);
        v171;
        const v178 = file => {
            const abs = path.join(dirPath, file);
            try {
                const st = fs.lstatSync(abs);
                const v172 = st.isDirectory();
                if (v172) {
                    const files2 = fs.readdirSync(abs);
                    const v175 = file2 => {
                        const abs2 = path.join(abs, file2);
                        const v173 = `${ file }/${ file2 }`;
                        const v174 = addFileIfSafe(archive, dirPath, abs2, v173);
                        v174;
                    };
                    const v176 = files2.forEach(v175);
                    v176;
                } else {
                    const v177 = addFileIfSafe(archive, dirPath, abs, file);
                    v177;
                }
            } catch (_) {
            }
        };
        const v179 = files.forEach(v178);
        v179;
        const v180 = archive.finalize();
        v180;
    };
    const v182 = fs.readdir(dirPath, v181);
    v182;
};
const v184 = app.get('/download/:userid/:tweetID', v183);
v184;
const v215 = (req, res) => {
    const v185 = req.params;
    const userid = v185.userid;
    let dirPath;
    try {
        dirPath = antiDirectoryTraversalAttack(userid);
    } catch (e) {
        const v186 = res.status(418);
        const v187 = v186.send('File not found');
        return v187;
    }
    const v213 = (err, files) => {
        if (err) {
            const v188 = res.status(500);
            const v189 = v188.send('Internal Server Error');
            v189;
            return;
        }
        const v190 = !files;
        const v191 = files.length;
        const v192 = v191 === 0;
        const v193 = v190 || v192;
        if (v193) {
            const v194 = res.status(418);
            const v195 = v194.send('No files to download');
            v195;
            return;
        }
        const zipName = `${ userid }_files.zip`;
        const v196 = {};
        v196.level = 9;
        const v197 = { zlib: v196 };
        const archive = archiver('zip', v197);
        const v200 = () => {
            const v198 = res.status(500);
            const v199 = v198.send('Error creating zip file');
            v199;
            return;
        };
        const v201 = archive.on('error', v200);
        v201;
        const v202 = res.attachment(zipName);
        v202;
        const v203 = archive.pipe(res);
        v203;
        const v210 = file => {
            const abs = path.join(dirPath, file);
            try {
                const st = fs.lstatSync(abs);
                const v204 = st.isDirectory();
                if (v204) {
                    const files2 = fs.readdirSync(abs);
                    const v207 = file2 => {
                        const abs2 = path.join(abs, file2);
                        const v205 = `${ file }/${ file2 }`;
                        const v206 = addFileIfSafe(archive, dirPath, abs2, v205);
                        v206;
                    };
                    const v208 = files2.forEach(v207);
                    v208;
                } else {
                    const v209 = addFileIfSafe(archive, dirPath, abs, file);
                    v209;
                }
            } catch (_) {
            }
        };
        const v211 = files.forEach(v210);
        v211;
        const v212 = archive.finalize();
        v212;
    };
    const v214 = fs.readdir(dirPath, v213);
    v214;
};
const v216 = app.get('/download/:userid', v215);
v216;
const v219 = (req, res) => {
    const v217 = res.status(404);
    const v218 = v217.send('Not Found');
    v218;
};
const v220 = app.use(v219);
v220;
const v223 = () => {
    const v221 = `Server is running on http://localhost:${ port }`;
    const v222 = console.log(v221);
    v222;
};
const v224 = app.listen(port, v223);
v224;