const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const v78 = require('child_process');
const spawn = v78.spawn;
const exec = v78.exec;
const v79 = process.cwd();
const cwd = path.resolve(v79);
const shellescape = require('shell-escape');
const v80 = {};
v80.createEnvFile = createEnvFile;
v80.walkSync = walkSync;
v80.checkForExistingFolder = checkForExistingFolder;
v80.executeCommand = executeCommand;
module.exports = v80;
const executeCommand = function (command, cmdOptions) {
    const v101 = (resolve, reject) => {
        let cmd = command[0];
        let args;
        const v81 = command.length;
        const v82 = v81 > 1;
        const v83 = command.slice(1);
        const v84 = [];
        if (v82) {
            args = v83;
        } else {
            args = v84;
        }
        let execCmd = spawn(cmd, args, cmdOptions);
        const v85 = execCmd.stdout;
        const v88 = data => {
            const v86 = `  ${ data }`;
            const v87 = console.log(v86);
            v87;
        };
        const v89 = v85.on('data', v88);
        v89;
        const v90 = execCmd.stderr;
        const v93 = data => {
            const v91 = `  ! ${ data }`;
            const v92 = console.log(v91);
            v92;
        };
        const v94 = v90.on('data', v93);
        v94;
        const v99 = code => {
            const v95 = code !== 0;
            if (v95) {
                const v96 = new Error(`  ! Error in command execution.`);
                const v97 = reject(v96);
                return v97;
            }
            const v98 = resolve();
            return v98;
        };
        const v100 = execCmd.on('exit', v99);
        v100;
    };
    const v102 = new Promise(v101);
    return v102;
};
const createEnvFile = function (ui, projectName, answers) {
    const v103 = `./${ projectName }/.env`;
    const pathToEnvFile = path.join(cwd, v103);
    const v104 = Object.keys(answers);
    const v107 = answerKey => {
        const v105 = answers[answerKey];
        const v106 = `${ answerKey }=${ v105 }\n`;
        return v106;
    };
    const v108 = v104.map(v107);
    const v110 = (previous, current) => {
        const v109 = previous.concat(current);
        return v109;
    };
    let contents = v108.reduce(v110, '');
    const v111 = { encoding: 'utf8' };
    const v112 = fs.writeFileSync(pathToEnvFile, contents, v111);
    v112;
    const v113 = ui.log;
    const v114 = `. Wrote ${ pathToEnvFile } successfully`;
    const v115 = v113.write(v114);
    v115;
};
const walkSync = function (dir, filelist) {
    let files = fs.readdirSync(dir);
    const v116 = [];
    filelist = filelist || v116;
    const v124 = file => {
        const v117 = path.join(dir, file);
        const v118 = fs.statSync(v117);
        const v119 = v118.isDirectory();
        if (v119) {
            const v120 = path.join(dir, file);
            filelist = walkSync(v120, filelist);
        } else {
            const v121 = path.join(dir, file);
            const v122 = {
                path: v121,
                name: file
            };
            const v123 = filelist.push(v122);
            v123;
        }
    };
    const v125 = files.forEach(v124);
    v125;
    return filelist;
};
const checkForExistingFolder = async function (ui, projectName) {
    const v153 = (resolve, reject) => {
        const v126 = `./${ projectName }`;
        let directory = path.join(cwd, v126);
        let directoryExists = fs.existsSync(directory);
        if (directoryExists) {
            const v131 = val => {
                const v127 = val.replace(/\W+/g, ' ');
                const v128 = v127.trimRight();
                const v129 = v128.replace(/ /g, '-');
                const v130 = v129.toLowerCase();
                return v130;
            };
            const v132 = {
                type: 'input',
                name: 'projectName',
                message: `${ directory } already exists. Please specify a new name. If you keep the current name, it will be deleted.`,
                default: `${ projectName }`,
                filter: v131
            };
            const v133 = [v132];
            const v134 = inquirer.prompt(v133);
            const v150 = directoryAnswers => {
                const v135 = directoryAnswers.projectName;
                const v136 = v135 === projectName;
                if (v136) {
                    const v137 = fs.remove(directory);
                    const v142 = () => {
                        const v138 = ui.log;
                        const v139 = `! Deleted ${ directory }`;
                        const v140 = v138.write(v139);
                        v140;
                        const v141 = resolve(projectName);
                        return v141;
                    };
                    const v143 = v137.then(v142);
                    const v146 = err => {
                        const v144 = new Error(`We've had problems removing the ${ directory }. Do you have enough permissions to delete it? Make sure that the directory isn't open in any program/terminal.`);
                        const v145 = reject(v144);
                        return v145;
                    };
                    const v147 = v143.catch(v146);
                    v147;
                } else {
                    const v148 = directoryAnswers.projectName;
                    const v149 = resolve(v148);
                    return v149;
                }
            };
            const v151 = v134.then(v150);
            v151;
        } else {
            const v152 = resolve(projectName);
            return v152;
        }
    };
    const v154 = new Promise(v153);
    return v154;
};