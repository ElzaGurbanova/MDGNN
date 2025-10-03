const v162 = function (databasesLocation) {
    const express = require('express');
    const router = express.Router();
    const fs = require('fs');
    const path = require('path');
    const securePath = function (base, ...parts) {
        const fullPath = path.resolve(base, ...parts);
        const resolvedBase = path.resolve(base);
        const v82 = fullPath.startsWith(resolvedBase);
        const v83 = !v82;
        if (v83) {
            const v84 = new Error('Invalid path');
            throw v84;
        }
        return fullPath;
    };
    const v94 = function (req, res) {
        try {
            const v85 = req.params;
            const v86 = v85.type;
            const v87 = req.params;
            const v88 = v87.name;
            const v89 = v88 + '.json';
            const filePath = securePath(databasesLocation, v86, v89);
            const contents = fs.readFileSync(filePath);
            const v90 = res.status(200);
            const v91 = v90.send(contents);
            v91;
        } catch (error) {
            const v92 = res.status(404);
            const v93 = v92.send('Not found');
            v93;
        }
    };
    const v95 = router.get('/:type/:name', v94);
    v95;
    const v122 = function (req, res) {
        try {
            const v96 = req.params;
            const v97 = v96.type;
            const dir = securePath(databasesLocation, v97, 'old');
            const v98 = fs.existsSync(dir);
            const v99 = !v98;
            if (v99) {
                const v100 = { recursive: true };
                const v101 = fs.mkdirSync(dir, v100);
                v101;
            }
            const v102 = req.params;
            const v103 = v102.type;
            const v104 = req.params;
            const v105 = v104.name;
            const v106 = v105 + '.json';
            const filePath = securePath(databasesLocation, v103, v106);
            const v107 = req.params;
            const v108 = v107.type;
            const v109 = req.params;
            const v110 = v109.name;
            const v111 = v110 + '.json';
            const backupPath = securePath(databasesLocation, v108, 'old', v111);
            const v112 = fs.existsSync(filePath);
            if (v112) {
                const v113 = fs.copyFileSync(filePath, backupPath);
                v113;
                const v114 = req.body;
                const v115 = v114.blueprints;
                const json = JSON.stringify(v115, null, '\t');
                const v116 = fs.writeFileSync(filePath, json, 'utf8');
                v116;
                const v117 = res.send('OK');
                v117;
            } else {
                const v118 = res.status(404);
                const v119 = v118.send('Not found');
                v119;
            }
        } catch (error) {
            const v120 = res.status(422);
            const v121 = v120.send('Error');
            v121;
        }
    };
    const v123 = router.put('/save/:type/:name', v122);
    v123;
    const v141 = function (req, res) {
        try {
            const v124 = req.params;
            const v125 = v124.type;
            const v126 = req.params;
            const v127 = v126.name;
            const v128 = v127 + '.json';
            const defaultPath = securePath(databasesLocation, v125, 'default', v128);
            const v129 = req.params;
            const v130 = v129.type;
            const v131 = req.params;
            const v132 = v131.name;
            const v133 = v132 + '.json';
            const targetPath = securePath(databasesLocation, v130, v133);
            const v134 = fs.existsSync(defaultPath);
            if (v134) {
                const v135 = fs.copyFileSync(defaultPath, targetPath);
                v135;
                const v136 = res.send('OK');
                v136;
            } else {
                const v137 = res.status(404);
                const v138 = v137.send('Not found');
                v138;
            }
        } catch (error) {
            const v139 = res.status(422);
            const v140 = v139.send('Error');
            v140;
        }
    };
    const v142 = router.put('/reset/:type/:name', v141);
    v142;
    const v160 = function (req, res) {
        try {
            const v143 = req.params;
            const v144 = v143.type;
            const v145 = req.params;
            const v146 = v145.name;
            const v147 = v146 + '.json';
            const backupPath = securePath(databasesLocation, v144, 'old', v147);
            const v148 = req.params;
            const v149 = v148.type;
            const v150 = req.params;
            const v151 = v150.name;
            const v152 = v151 + '.json';
            const targetPath = securePath(databasesLocation, v149, v152);
            const v153 = fs.existsSync(backupPath);
            if (v153) {
                const v154 = fs.copyFileSync(backupPath, targetPath);
                v154;
                const v155 = res.send('OK');
                v155;
            } else {
                const v156 = res.status(404);
                const v157 = v156.send('Not found');
                v157;
            }
        } catch (error) {
            const v158 = res.status(422);
            const v159 = v158.send('Error');
            v159;
        }
    };
    const v161 = router.put('/restore/:type/:name', v160);
    v161;
    return router;
};
module.exports = v162;