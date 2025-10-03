const v27 = require('child_process');
const execFile = v27.execFile;
const v28 = ['page'];
const v49 = function (bot, msg) {
    const v29 = msg.args;
    const v30 = v29.page;
    const v31 = v30 || '';
    const v32 = String(v31);
    const page = v32.trim();
    const v33 = !page;
    const v34 = page.startsWith('-');
    const v35 = v33 || v34;
    if (v35) {
        const v36 = msg.to;
        const v37 = bot.say(v36, 'Invalid man page');
        v37;
        return;
    }
    const v38 = [
        '-f',
        page
    ];
    const c = execFile('man', v38);
    let out = '';
    const v39 = c.stdout;
    const v40 = function (data) {
        out += data.toString();
    };
    const v41 = v39.on('data', v40);
    v41;
    const v42 = c.stderr;
    const v43 = function (data) {
        out += data.toString();
    };
    const v44 = v42.on('data', v43);
    v44;
    const v47 = function () {
        const v45 = msg.to;
        const v46 = bot.say(v45, out);
        v46;
    };
    const v48 = c.on('close', v47);
    v48;
};
const v50 = {};
v50.help = 'look up a man page';
v50.usage = v28;
v50.command = v49;
const v51 = {};
v51.man = v50;
const v52 = {};
v52.commands = v51;
module.exports = v52;