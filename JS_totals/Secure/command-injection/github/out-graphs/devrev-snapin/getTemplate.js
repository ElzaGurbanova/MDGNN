const v82 = require('./install-deps/installDevRev');
const checkDevRevCLI = v82.checkDevRevCLI;
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const checkRename = require('./utils');
const v83 = process.argv;
const rename = v83[5];
const v84 = process.argv;
const templateName = v84[3];
const v85 = {};
v85.url = 'https://github.com/nimit2801/devrev-snapin-templates/releases/download/template-release/starters.zip';
v85.name = '1-starter';
const v86 = {};
v86.url = 'https://github.com/nimit2801/devrev-snapin-templates/releases/download/template-release/internal-action.zip';
v86.name = '6-timer-ticket-creator';
const v87 = {};
v87.url = 'https://github.com/nimit2801/devrev-snapin-templates/releases/download/template-release/external-actions.zip';
v87.name = '9-external-action';
const v88 = {};
v88.url = 'https://github.com/nimit2801/devrev-snapin-templates/releases/download/template-release/external-webhook.zip';
v88.name = '8-external-github-webhook';
const mapTemplates = {};
mapTemplates.default = v85;
mapTemplates.internal_action = v86;
mapTemplates.external_actions = v87;
mapTemplates.external_webhooks = v88;
const getDevRevSnapInTemplate = async function () {
    const devrevCLICheck = checkDevRevCLI();
    const v89 = !devrevCLICheck;
    if (v89) {
        const v90 = console.error('please run npx devrev-snapin:setup');
        v90;
        return;
    }
    const v91 = process.argv;
    const v92 = v91[2];
    const v93 = v92 === '--template';
    if (v93) {
        const v94 = !templateName;
        if (v94) {
            const v95 = console.error('No template selected');
            v95;
        }
        switch (templateName) {
        case 'default':
            const v96 = mapTemplates.default;
            const v97 = v96.url;
            const v98 = process.cwd();
            await downloadAndExtractZip(v97, v98);
            if (checkRename) {
                const v99 = mapTemplates.default;
                const v100 = v99.name;
                const v101 = renameDefault(v100, rename);
                v101;
            }
            break;
        case 'internal-action':
            const v102 = mapTemplates.internal_action;
            const v103 = v102.url;
            const v104 = process.cwd();
            await downloadAndExtractZip(v103, v104);
            if (checkRename) {
                const v105 = mapTemplates.internal_action;
                const v106 = v105.name;
                const v107 = renameDefault(v106, rename);
                v107;
            }
            break;
        case 'external-action':
            const v108 = mapTemplates.external_actions;
            const v109 = v108.url;
            const v110 = process.cwd();
            await downloadAndExtractZip(v109, v110);
            if (checkRename) {
                const v111 = mapTemplates.external_actions;
                const v112 = v111.name;
                const v113 = renameDefault(v112, rename);
                v113;
            }
            break;
        case 'external-trigger':
            const v114 = mapTemplates.external_webhooks;
            const v115 = v114.url;
            const v116 = process.cwd();
            await downloadAndExtractZip(v115, v116);
            if (checkRename) {
                const v117 = mapTemplates.external_webhooks;
                const v118 = v117.name;
                const v119 = renameDefault(v118, rename);
                v119;
            }
            break;
        default:
            const v120 = console.log('Invalid template name');
            v120;
        }
        const v121 = console.log('exists');
        v121;
    }
};
const renameDefault = function (defaultName, newName) {
    const v122 = !defaultName;
    const v123 = !newName;
    const v124 = v122 || v123;
    if (v124) {
        const v125 = console.error('Both defaultName and rename parameters are required.');
        v125;
        return;
    }
    const v126 = fs.existsSync(defaultName);
    const v127 = !v126;
    if (v127) {
        const v128 = `Source directory "${ defaultName }" does not exist.`;
        const v129 = console.error(v128);
        v129;
        return;
    }
    try {
        const v130 = fs.renameSync(defaultName, newName);
        v130;
        const v131 = `Successfully renamed template to: ${ newName }`;
        const v132 = console.log(v131);
        v132;
    } catch (error) {
        const v133 = error.message;
        const v134 = `Error renaming template: ${ v133 }`;
        const v135 = console.error(v134);
        v135;
    }
};
const downloadAndExtractZip = async function (url, outputPath) {
    const v160 = (resolve, reject) => {
        const v136 = {
            method: 'get',
            url,
            responseType: 'stream'
        };
        const v137 = axios(v136);
        const v152 = response => {
            const v138 = response.data;
            const v139 = { path: outputPath };
            const v140 = unzipper.Extract(v139);
            const v141 = v138.pipe(v140);
            const v144 = () => {
                const v142 = console.log('Download and extraction complete.');
                v142;
                const v143 = resolve();
                v143;
            };
            const v145 = v141.on('close', v144);
            const v150 = err => {
                const v146 = err.message;
                const v147 = `Error during extraction: ${ v146 }`;
                const v148 = console.error(v147);
                v148;
                const v149 = reject(err);
                v149;
            };
            const v151 = v145.on('error', v150);
            v151;
        };
        const v153 = v137.then(v152);
        const v158 = err => {
            const v154 = err.message;
            const v155 = `Error during download: ${ v154 }`;
            const v156 = console.error(v155);
            v156;
            const v157 = reject(err);
            v157;
        };
        const v159 = v153.catch(v158);
        v159;
    };
    const v161 = new Promise(v160);
    return v161;
};
const v162 = getDevRevSnapInTemplate();
v162;