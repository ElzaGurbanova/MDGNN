const v12 = require('child_process');
const exec = v12.exec;
const COMMANDS = {};
COMMANDS.darwin = 'open';
COMMANDS.win32 = 'start ""';
COMMANDS.win64 = 'start ""';
const v13 = process.platform;
const v14 = COMMANDS[v13];
const command = v14 || 'xdg-open';
const xopen = function (filepath) {
    const v21 = function (resolve, reject) {
        const v15 = command + ' ';
        const v16 = v15 + filepath;
        const v19 = (error, stdout, stderr) => {
            if (error) {
                const v17 = reject(error);
                return v17;
            }
            const v18 = resolve(stdout);
            v18;
        };
        const v20 = exec(v16, v19);
        v20;
    };
    const v22 = new Promise(v21);
    return v22;
};
module.exports = xopen;