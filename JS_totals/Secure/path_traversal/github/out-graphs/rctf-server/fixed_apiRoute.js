const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();
const v70 = require('../models');
const FlagsTbl = v70.FlagsTbl;
const ChallengesTbl = v70.ChallengesTbl;
const ProjectsTbl = v70.ProjectsTbl;
const validateFlag = require('../middleware/flagValidation');
const sha256sum = function (string) {
    const v71 = crypto.createHash('sha256');
    const v72 = v71.update(string);
    const v73 = v72.digest('hex');
    return v73;
};
const filePathExists = function (filepath) {
    const absPath = path.resolve(filepath);
    const v74 = fs.existsSync(absPath);
    return v74;
};
const v75 = path.join(__dirname, '../files');
const FILES_ROOT = fs.realpathSync(v75);
const v105 = (req, res) => {
    try {
        const v76 = req.params;
        const v77 = v76.fileName;
        const v78 = v77 || '';
        const raw = String(v78);
        const v79 = path.basename(raw);
        const fileName = v79.replace(/^\.+/, '');
        const v80 = !fileName;
        if (v80) {
            const v81 = res.status(400);
            const v82 = {
                success: false,
                message: 'Invalid file name'
            };
            const v83 = v81.json(v82);
            return v83;
        }
        const candidate = path.join(FILES_ROOT, fileName);
        const v84 = fs.existsSync(candidate);
        const v85 = !v84;
        if (v85) {
            const v86 = res.status(404);
            const v87 = { success: false };
            const v88 = v86.json(v87);
            return v88;
        }
        const real = fs.realpathSync(candidate);
        const rel = path.relative(FILES_ROOT, real);
        const v89 = rel.startsWith('..');
        const v90 = path.isAbsolute(rel);
        const v91 = v89 || v90;
        if (v91) {
            const v92 = res.status(400);
            const v93 = {
                success: false,
                message: 'Invalid file path'
            };
            const v94 = v92.json(v93);
            return v94;
        }
        const stat = fs.statSync(real);
        const v95 = stat.isFile();
        const v96 = !v95;
        if (v96) {
            const v97 = res.status(404);
            const v98 = { success: false };
            const v99 = v97.json(v98);
            return v99;
        }
        const v100 = res.download(real, fileName);
        return v100;
    } catch (e) {
        const v101 = console.error('Download error:', e);
        v101;
        const v102 = res.status(500);
        const v103 = { success: false };
        const v104 = v102.json(v103);
        return v104;
    }
};
const v106 = router.get('/download/:fileName', v105);
v106;
const v113 = async (req, res) => {
    try {
        const challs = await ChallengesTbl.find();
        const v107 = res.status(200);
        const v108 = v107.json(challs);
        v108;
    } catch (error) {
        const v109 = console.error(error);
        v109;
        const v110 = res.status(500);
        const v111 = { error: 'Database error' };
        const v112 = v110.json(v111);
        v112;
    }
};
const v114 = router.get('/challenges', v113);
v114;
const v122 = async (req, res) => {
    try {
        const v115 = {};
        const projects = await ProjectsTbl.find(v115);
        const v116 = res.status(200);
        const v117 = v116.json(projects);
        v117;
    } catch (error) {
        const v118 = console.error(error);
        v118;
        const v119 = res.status(500);
        const v120 = { error: 'Database error' };
        const v121 = v119.json(v120);
        v121;
    }
};
const v123 = router.get('/projects', v122);
v123;
const v137 = async (req, res) => {
    const v124 = req.flag;
    const flagSign = sha256sum(v124);
    try {
        const v125 = req.chal_id;
        const v126 = {
            ch_id: v125,
            flag_sign: flagSign
        };
        const flagExists = await FlagsTbl.findOne(v126);
        if (flagExists) {
            const v127 = req.chal_id;
            const v128 = {
                challenge_id: v127,
                success: true
            };
            const v129 = res.json(v128);
            return v129;
        }
        const v130 = req.chal_id;
        const v131 = {
            challenge_id: v130,
            success: false
        };
        const v132 = res.json(v131);
        return v132;
    } catch (err) {
        const v133 = console.error('Error:', err);
        v133;
        const v134 = res.status(500);
        const v135 = {
            error: 'Internal server error, check back later',
            success: false
        };
        const v136 = v134.json(v135);
        v136;
    }
};
const v138 = router.post('/submit-flag', validateFlag, v137);
v138;
module.exports = router;