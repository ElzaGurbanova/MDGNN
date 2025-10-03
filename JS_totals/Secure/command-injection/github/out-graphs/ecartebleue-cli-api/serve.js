const v34 = console.log('Serving.');
v34;
const v35 = require('express');
var app = v35();
var bodyParser = require('body-parser');
const v36 = require('child_process');
var exec = v36.exec;
var fs = require('fs');
var shellescape = require('shell-escape');
const v37 = bodyParser.json();
const v38 = app.use(v37);
v38;
const v39 = { extended: true };
const v40 = bodyParser.urlencoded(v39);
const v41 = app.use(v40);
v41;
const v65 = function (req, res) {
    const v42 = req.body;
    var amount = v42.a;
    const v43 = req.body;
    const v44 = v43.p;
    const v45 = Buffer.from(v44, 'base64');
    var credentials = v45.toString();
    credentials = JSON.parse(credentials);
    const v46 = credentials[0];
    const v47 = credentials[1];
    var credentials = {};
    credentials.user = v46;
    credentials.password = v47;
    const v48 = credentials.user;
    const v49 = credentials.password;
    var args = [
        'casperjs',
        'generate.js',
        '--json',
        v48,
        v49,
        amount
    ];
    var cmd = shellescape(args);
    const v50 = console.log('Command: ', cmd);
    v50;
    const v63 = function (error, stdout) {
        if (error) {
            const v51 = console.error(error);
            v51;
            const v52 = res.status(500);
            const v53 = { error: 'An error occurred.' };
            const v54 = v52.json(v53);
            v54;
        } else {
            try {
                var generated = JSON.parse(stdout);
            } catch (e) {
                const v55 = console.error('Couldn\'t parse response.');
                v55;
                const v56 = res.status(500);
                const v57 = { error: 'Couldn\'t parse response.' };
                const v58 = v56.end(v57);
                v58;
            }
            let s;
            const v59 = generated.success;
            if (v59) {
                s = 200;
            } else {
                s = 500;
            }
            var r = generated.data;
            const v60 = console.log('Status: ', s);
            v60;
            const v61 = res.status(s);
            const v62 = v61.json(r);
            v62;
        }
    };
    const v64 = exec(cmd, v63);
    v64;
};
const v66 = app.post('/generate', v65);
v66;
var server = app.listen(3000);