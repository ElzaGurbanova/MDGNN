'use strict';
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');
const v132 = require('./command.js');
const execCommand = v132.execCommand;
const v133 = require('./github.js');
const addComment = v133.addComment;
const deleteComment = v133.deleteComment;
const v134 = require('./opa.js');
const getPlanChanges = v134.getPlanChanges;
const sanitizeInput = function (input, options = {}) {
    const v135 = options;
    const allowEmpty = v135.undefined;
    const allowedChars = v135.undefined;
    const v136 = !input;
    if (v136) {
        let v137;
        if (allowEmpty) {
            v137 = '';
        } else {
            v137 = null;
        }
        return v137;
    }
    const v138 = String(input);
    const v139 = v138.replace(allowedChars, '');
    return v139;
};
const parseInputInt = function (str, def) {
    const parsed = parseInt(str, 10);
    const v140 = isNaN(parsed);
    if (v140) {
        return def;
    }
    return parsed;
};
const resolveSafeDir = function (inputDir) {
    const v141 = process.env;
    const v142 = v141.GITHUB_WORKSPACE;
    const v143 = process.cwd();
    const workspace = v142 || v143;
    const base = path.resolve(workspace);
    const v144 = inputDir || '.';
    const requested = path.resolve(base, v144);
    const rel = path.relative(base, requested);
    const v145 = rel === '';
    const v146 = rel.startsWith('..');
    const v147 = !v146;
    const v148 = path.isAbsolute(rel);
    const v149 = !v148;
    const v150 = v147 && v149;
    const isInside = v145 || v150;
    const v151 = !isInside;
    if (v151) {
        const v152 = new Error(`Invalid directory: must reside within workspace (${ base }).`);
        throw v152;
    }
    return requested;
};
const action = async () => {
    const isAllowFailure = core.getBooleanInput('allow-failure');
    const isComment = core.getBooleanInput('comment');
    const isCommentDelete = core.getBooleanInput('comment-delete');
    const isTerragrunt = core.getBooleanInput('terragrunt');
    const isOpenTofu = core.getBooleanInput('open-tofu');
    const skipFormat = core.getBooleanInput('skip-fmt');
    const skipPlan = core.getBooleanInput('skip-plan');
    const skipConftest = core.getBooleanInput('skip-conftest');
    const initRunAll = core.getBooleanInput('init-run-all');
    const commentTitle = core.getInput('comment-title');
    const directoryInput = core.getInput('directory');
    const terraformInit = core.getMultilineInput('terraform-init');
    const terraformPlan = core.getMultilineInput('terraform-plan');
    const v153 = core.getInput('conftest-checks');
    const conftestChecks = sanitizeInput(v153);
    const token = core.getInput('github-token');
    let octokit;
    const v154 = token !== 'false';
    const v155 = github.getOctokit(token);
    if (v154) {
        octokit = v155;
    } else {
        octokit = undefined;
    }
    const planCharLimit = core.getInput('plan-character-limit');
    const conftestCharLimit = core.getInput('conftest-character-limit');
    let binary = 'terraform';
    if (isTerragrunt) {
        binary = 'terragrunt';
    } else {
        if (isOpenTofu) {
            binary = 'tofu';
        }
    }
    const summarizeBinary = 'tf-summarize';
    let terraformInitOption;
    const v157 = item => {
        const v156 = sanitizeInput(item);
        return v156;
    };
    const v158 = terraformInit.map(v157);
    const v159 = v158.join(' ');
    if (terraformInit) {
        terraformInitOption = v159;
    } else {
        terraformInitOption = '';
    }
    let terraformPlanOption;
    const v161 = item => {
        const v160 = sanitizeInput(item);
        return v160;
    };
    const v162 = terraformPlan.map(v161);
    const v163 = v162.join(' ');
    if (terraformPlan) {
        terraformPlanOption = v163;
    } else {
        terraformPlanOption = '';
    }
    let safeDirectory;
    try {
        safeDirectory = resolveSafeDir(directoryInput);
    } catch (e) {
        const v164 = e.message;
        const v165 = core.setFailed(v164);
        v165;
        return;
    }
    const v166 = isTerragrunt && initRunAll;
    let v167;
    if (v166) {
        v167 = ' run-all';
    } else {
        v167 = '';
    }
    const v168 = `${ binary }${ v167 } init -no-color ${ terraformInitOption }`.trim();
    const v169 = {
        key: 'init',
        exec: v168
    };
    const v170 = {
        key: 'validate',
        exec: `${ binary } validate -no-color`
    };
    const v171 = {
        key: 'fmt',
        exec: `${ binary } fmt --check`
    };
    const v172 = `${ binary } plan -no-color -input=false -out=plan.tfplan ${ terraformPlanOption }`.trim();
    const v173 = {
        key: 'plan',
        exec: v172
    };
    const v174 = {
        key: 'show',
        exec: `${ binary } show -no-color -json plan.tfplan`,
        depends: 'plan',
        output: false
    };
    const v175 = {
        key: 'show-json-out',
        exec: `${ binary } show -no-color -json plan.tfplan > plan.json`,
        depends: 'plan',
        output: false
    };
    const v176 = {
        key: 'summary',
        exec: `cat plan.json | ${ summarizeBinary } -md`,
        depends: 'show-json-out'
    };
    const v177 = {
        key: 'conftest',
        depends: 'show-json-out',
        exec: `conftest test plan.json --no-color --update ${ conftestChecks }`,
        output: true
    };
    const commands = [
        v169,
        v170,
        v171,
        v173,
        v174,
        v175,
        v176,
        v177
    ];
    let results = {};
    let isError = false;
    const v178 = !isTerragrunt;
    const v179 = v178 && initRunAll;
    if (v179) {
        const v180 = core.error('init-run-all is only valid when using terragrunt, skipping this option');
        v180;
    }
    const v181 = fs.existsSync(safeDirectory);
    const v182 = !v181;
    if (v182) {
        const v183 = `Directory ${ safeDirectory } does not exist`;
        const v184 = core.setFailed(v183);
        v184;
        return;
    }
    const v185 = octokit === undefined;
    const v186 = isComment || isCommentDelete;
    const v187 = v185 && v186;
    if (v187) {
        const v188 = core.setFailed('You must pass a GitHub token to comment on PRs');
        v188;
        return;
    }
    let command;
    for (command of commands) {
        if (skipPlan) {
            const v189 = command.key;
            switch (v189) {
            case 'plan':
            case 'summary':
            case 'show':
            case 'show-json-out':
            case 'conftest':
                const v190 = command.key;
                const v191 = {};
                v191.isSuccess = true;
                v191.output = '';
                results[v190] = v191;
                continue;
            }
        }
        const v192 = command.key;
        const v193 = v192 === 'fmt';
        const v194 = skipFormat && v193;
        if (v194) {
            const v195 = command.key;
            const v196 = {};
            v196.isSuccess = true;
            v196.output = '';
            results[v195] = v196;
            continue;
        }
        const v197 = command.key;
        const v198 = v197 === 'conftest';
        const v199 = skipConftest && v198;
        if (v199) {
            const v200 = command.key;
            const v201 = {};
            v201.isSuccess = true;
            v201.output = '';
            results[v200] = v201;
            continue;
        }
        const v202 = command.depends;
        const v203 = !v202;
        const v204 = command.depends;
        const v205 = results[v204];
        const v206 = v205.isSuccess;
        const v207 = v203 || v206;
        if (v207) {
            const v209 = execCommand(command, safeDirectory);
            results[v208] = v209;
        } else {
            const v210 = command.key;
            const v211 = {};
            v211.isSuccess = false;
            v211.output = '';
            results[v210] = v211;
        }
        const v212 = command[key];
        const v213 = v212.isSuccess;
        const v214 = results[v213];
        const v215 = !v214;
        isError = isError || v215;
    }
    const v216 = Object.values(results);
    const v220 = r => {
        const v217 = r.isSuccess;
        const v218 = v217 === false;
        const v219 = r && v218;
        return v219;
    };
    isError = v216.some(v220);
    let k;
    const v221 = Object.keys(results);
    for (k of v221) {
        const v222 = results[k];
        const v223 = results[k];
        const v224 = v223.output;
        const v225 = typeof v224;
        const v226 = v225 === 'string';
        const v227 = v222 && v226;
        const v228 = results[k];
        const v229 = v228.output;
        const v230 = v229.indexOf('::debug::exitcode:');
        const v231 = -1;
        const v232 = v230 > v231;
        const v233 = v227 && v232;
        if (v233) {
            const v234 = core.setFailed('Error: `hashicorp/setup-terraform` must have `terraform_wrapper: false`');
            v234;
            return;
        }
    }
    if (isCommentDelete) {
        const v235 = github.context;
        await deleteComment(octokit, v235, commentTitle);
    }
    let changes = {};
    const v236 = results.show;
    const v237 = results.show;
    const v238 = v237.isSuccess;
    const v239 = v236 && v238;
    const v240 = !skipPlan;
    const v241 = v239 && v240;
    if (v241) {
        const v242 = results.show;
        const v243 = v242.output;
        const planJson = JSON.parse(v243);
        changes = await getPlanChanges(planJson);
    }
    const v244 = changes.isChanges;
    const v245 = v244 || isError;
    const v246 = v245 || skipPlan;
    const v247 = isComment && v246;
    if (v247) {
        const planLimit = parseInputInt(planCharLimit, 30000);
        const conftestLimit = parseInputInt(conftestCharLimit, 2000);
        const v248 = github.context;
        await addComment(octokit, v248, commentTitle, results, changes, planLimit, conftestLimit, skipFormat, skipPlan, skipConftest);
    }
    const v249 = !isAllowFailure;
    const v250 = isError && v249;
    if (v250) {
        const v255 = c => {
            const v251 = c.key;
            const v252 = results[v251];
            const v253 = v252.isSuccess;
            const v254 = !v253;
            return v254;
        };
        const v256 = commands.filter(v255);
        const v258 = c => {
            const v257 = c.exec;
            return v257;
        };
        let failedCommands = v256.map(v258);
        const v259 = failedCommands.join('\n');
        const v260 = `The following commands failed:\n${ v259 }`;
        const v261 = core.setFailed(v260);
        v261;
    }
};
const v262 = {};
v262.action = action;
v262.sanitizeInput = sanitizeInput;
module.exports = v262;