const v20 = require('child_process');
var exec = v20.exec;
var merge = require('merge');
var dargs = require('dargs');
var RSVP = require('rsvp');
var generateCommand = function (options) {
    var compassCommand = options.compassCommand;
    var excludes = ['compassCommand'];
    const v21 = { excludes: excludes };
    var args = dargs(options, v21);
    const v22 = [
        compassCommand,
        'compile'
    ];
    const v23 = v22.concat(args);
    var command = v23.join(' ');
    return command;
};
const Compass = function () {
    const v24 = {};
    v24.compassCommand = 'compass';
    this.defaultOptions = v24;
};
const v25 = Compass.prototype;
const v38 = function (options) {
    const v26 = this.defaultOptions;
    const v27 = {};
    const v28 = options || v27;
    var compassOptions = merge(v26, v28);
    var command = generateCommand(compassOptions);
    const v36 = function (resolve, reject) {
        const v34 = function (error, stdout, stderr) {
            if (error) {
                if (stdout) {
                    const v29 = console.log(stdout);
                    v29;
                }
                if (stderr) {
                    const v30 = console.log(stderr);
                    v30;
                }
                const v31 = reject(error);
                v31;
            } else {
                const v32 = compassOptions.cssDir;
                const v33 = resolve(v32);
                v33;
            }
        };
        const v35 = exec(command, v34);
        v35;
    };
    const v37 = new RSVP.Promise(v36);
    return v37;
};
v25.compile = v38;
module.exports = Compass;