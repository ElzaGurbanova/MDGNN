const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();
const v59 = require('../models');
const FlagsTbl = v59.FlagsTbl;
const ChallengesTbl = v59.ChallengesTbl;
const ProjectsTbl = v59.ProjectsTbl;
const validateFlag = require('../middleware/flagValidation');
const sha256sum = function (string) {
    const v60 = crypto.createHash('sha256');
    const v61 = v60.update(string);
    const v62 = v61.digest('hex');
    return v62;
};
const filePathExists = function (filepath) {
    const absPath = path.resolve(filepath);
    const v63 = fs.existsSync(absPath);
    return v63;
};
const v83 = (req, res) => {
    const v64 = req.params;
    const v65 = v64.fileName;
    const fileName = path.basename(v65);
    const reqFile = path.join(__dirname, '../files/', fileName);
    const v66 = path.join(__dirname, '../files/');
    const relative = path.relative(v66, reqFile);
    const v67 = relative.startsWith('..');
    const v68 = !v67;
    const v69 = relative && v68;
    const v70 = path.isAbsolute(relative);
    const v71 = !v70;
    const v72 = v69 && v71;
    if (v72) {
        const v73 = fs.existsSync(reqFile);
        if (v73) {
            const v74 = `attachment; filename=${ fileName }`;
            const v75 = res.setHeader('Content-Disposition', v74);
            v75;
            const v76 = res.sendFile(reqFile);
            v76;
        } else {
            const v77 = res.status(404);
            const v78 = { success: false };
            const v79 = v77.json(v78);
            v79;
        }
    } else {
        const v80 = res.status(400);
        const v81 = {
            success: false,
            message: 'Invalid file path'
        };
        const v82 = v80.json(v81);
        v82;
    }
};
const v84 = router.get('/download/:fileName', v83);
v84;
const v91 = async (req, res) => {
    try {
        const challs = await ChallengesTbl.find();
        const v85 = res.status(200);
        const v86 = v85.json(challs);
        v86;
    } catch (error) {
        const v87 = console.error(error);
        v87;
        const v88 = res.status(500);
        const v89 = { error: 'Database error' };
        const v90 = v88.json(v89);
        v90;
    }
};
const v92 = router.get('/challenges', v91);
v92;
const v100 = async (req, res) => {
    try {
        const v93 = {};
        const projects = await ProjectsTbl.find(v93);
        const v94 = res.status(200);
        const v95 = v94.json(projects);
        v95;
    } catch (error) {
        const v96 = console.error(error);
        v96;
        const v97 = res.status(500);
        const v98 = { error: 'Database error' };
        const v99 = v97.json(v98);
        v99;
    }
};
const v101 = router.get('/projects', v100);
v101;
const v115 = async (req, res) => {
    const v102 = req.flag;
    const flagSign = sha256sum(v102);
    try {
        const v103 = req.chal_id;
        const v104 = {
            ch_id: v103,
            flag_sign: flagSign
        };
        const flagExists = await FlagsTbl.findOne(v104);
        if (flagExists) {
            const v105 = req.chal_id;
            const v106 = {
                challenge_id: v105,
                success: true
            };
            const v107 = res.json(v106);
            return v107;
        }
        const v108 = req.chal_id;
        const v109 = {
            challenge_id: v108,
            success: false
        };
        const v110 = res.json(v109);
        return v110;
    } catch (err) {
        const v111 = console.error('Error:', err);
        v111;
        const v112 = res.status(500);
        const v113 = {
            error: 'Internal server error, check back later',
            success: false
        };
        const v114 = v112.json(v113);
        v114;
    }
};
const v116 = router.post('/submit-flag', validateFlag, v115);
v116;
module.exports = router;