const v20 = require('child_process');
var exec = v20.exec;
const v38 = function (app, cb) {
    const v21 = 'heroku config --app ' + app;
    const v36 = function (err, stdout) {
        if (err) {
            const v22 = cb(err);
            return v22;
        }
        var config = {};
        var lines = stdout.split('\n');
        const v23 = lines.shift();
        v23;
        const v33 = function (line) {
            const v24 = line.trim();
            const v25 = !v24;
            if (v25) {
                return;
            }
            var parts = line.split(': ');
            const v26 = parts[1];
            const v27 = !v26;
            if (v27) {
                const v28 = console.log('could not parse', line);
                v28;
            } else {
                const v31 = parts[1];
                const v32 = v31.trim();
                config[v30] = v32;
            }
        };
        const v34 = lines.forEach(v33);
        v34;
        const v35 = cb(null, config);
        v35;
    };
    const v37 = exec(v21, v36);
    v37;
};
module.exports = v38;