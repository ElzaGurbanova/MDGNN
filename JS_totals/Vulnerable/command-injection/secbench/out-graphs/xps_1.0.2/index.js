'use strict';
var Task = require('data.task');
const v17 = require('child_process');
var exec = v17.exec;
const v18 = require('core.lambda');
var compose = v18.compose;
const v19 = require('core.arity');
var unary = v19.unary;
var escapeArg = JSON.stringify;
exports.shell = shell;
const shell = function (cmd, args) {
    const v20 = cmd + ' ';
    const v21 = compose(escapeArg);
    const v22 = v21(String);
    const v23 = unary(v22);
    const v24 = args.map(v23);
    const v25 = v24.join(' ');
    var command = v20 + v25;
    const v31 = function (reject, resolve) {
        const v29 = function (error, stdout, stderr) {
            if (error) {
                const v26 = reject(error);
                v26;
            } else {
                const v27 = {
                    output: stdout,
                    error: stderr
                };
                const v28 = resolve(v27);
                v28;
            }
        };
        const v30 = exec(command, v29);
        v30;
    };
    const v32 = new Task(v31);
    return v32;
};