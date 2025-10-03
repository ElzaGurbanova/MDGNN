var child_process = require('child_process');
var utils = require('../utils');
const v102 = function (worker, app, logger, config) {
    const v57 = function (req, res, next) {
        const v52 = new Date();
        const v53 = Date.now();
        const v54 = utils.today();
        const v55 = {
            time: v52,
            timestamp: v53,
            date: v54
        };
        const v56 = res.json(v55);
        v56;
    };
    const v58 = app.all('/api/time', v57);
    v58;
    const v65 = function (req, res, next) {
        const v59 = req.body;
        var name = v59.name;
        const v60 = !name;
        if (v60) {
            const v61 = next('Miss parameter "name".');
            v61;
        } else {
            const v62 = worker.reload(name);
            v62;
            const v63 = { name: name };
            const v64 = res.json(v63);
            v64;
        }
    };
    const v66 = app.post('/api/reload', v65);
    v66;
    const v76 = function (req, res, next) {
        const v67 = req.body;
        var event = v67.event;
        const v68 = req.body;
        var args = v68.args;
        const v69 = !event;
        if (v69) {
            const v70 = next('Miss parameter "event".');
            v70;
        } else {
            var _args = [event];
            const v71 = Array.isArray(args);
            if (v71) {
                _args = _args.concat(args);
            }
            const v72 = worker.emit;
            const v73 = v72.apply(worker, _args);
            v73;
            const v74 = {
                event: event,
                args: args
            };
            const v75 = res.json(v74);
            v75;
        }
    };
    const v77 = app.post('/api/emit', v76);
    v77;
    const v90 = function (req, res, next) {
        const v78 = req.body;
        var cmd = v78.cmd;
        const v79 = req.body;
        var path = v79.path;
        const v80 = !cmd;
        if (v80) {
            const v81 = next('Miss parameter "cmd".');
            v81;
        } else {
            const v82 = { cwd: path };
            const v88 = function (err, stdout, stderr) {
                if (err) {
                    const v83 = next(err);
                    v83;
                } else {
                    const v84 = stdout.toString();
                    const v85 = stderr.toString();
                    const v86 = {
                        cmd: cmd,
                        path: path,
                        stdout: v84,
                        stderr: v85
                    };
                    const v87 = res.json(v86);
                    v87;
                }
            };
            const v89 = child_process.exec(cmd, v82, v88);
            v89;
        }
    };
    const v91 = app.post('/api/exec', v90);
    v91;
    const v92 = function (req, res, next) {
    };
    const v93 = app.get('/api/log/tail', v92);
    v93;
    const v100 = function (req, res, next) {
        const v94 = req.body;
        var level = v94.level;
        const v95 = !level;
        if (v95) {
            const v96 = next('miss parameter "level".');
            v96;
        } else {
            level = level.toLowerCase();
            const v97 = utils.changeLogger('setLevel', level);
            v97;
            const v98 = {
                method: 'setLevel',
                level: level
            };
            const v99 = res.json(v98);
            v99;
        }
    };
    const v101 = app.post('/api/log/set/level', v100);
    v101;
};
module.exports = v102;