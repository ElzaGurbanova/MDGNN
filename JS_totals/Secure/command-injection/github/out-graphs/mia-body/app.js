var express = require('express');
var shellescape = require('shell-escape');
var config = require('config');
const v34 = require('child_process');
var exec = v34.exec;
var app = express();
const v37 = function (req, res) {
    var phrase = 'Hello my name is Mia!';
    const v35 = say(phrase);
    v35;
    const v36 = res.send(phrase);
    v36;
};
const v38 = app.get('/', v37);
v38;
const v44 = function (req, res) {
    const v39 = req.params;
    var name = v39.name;
    const v40 = name + '! ';
    const v41 = v40 + name;
    var phrase = v41 + '! He is the man! If he cannot do it, no one can!';
    const v42 = say(phrase);
    v42;
    const v43 = res.send(phrase);
    v43;
};
const v45 = app.get('/whostheman/:name', v44);
v45;
const v51 = function (req, res) {
    const v46 = req.params;
    var name = v46.name;
    const v47 = name + '! ';
    const v48 = v47 + name;
    var phrase = v48 + '! She is the woman! If she cannot do it, no one can!';
    const v49 = say(phrase);
    v49;
    const v50 = res.send(phrase);
    v50;
};
const v52 = app.get('/whosthewoman/:name', v51);
v52;
const v56 = function () {
    const v53 = server.address();
    var host = v53.address;
    const v54 = server.address();
    var port = v54.port;
    const v55 = console.log('Example app listening at http://%s:%s', host, port);
    v55;
};
var server = app.listen(3000, v56);
const say = function (phrase) {
    const v57 = config.get('Speak.cmd');
    const v58 = v57.split(' ');
    const v59 = ' "' + phrase;
    const v60 = v59 + '"';
    const v61 = [v60];
    var args = v58.concat(v61);
    const v62 = console.log(args);
    v62;
    const v63 = shellescape(args);
    const v64 = exec(v63, log);
    v64;
};
const log = function (error, stdout, stderr) {
    const v65 = console.log(stdout);
    v65;
    const v66 = console.log(stderr);
    v66;
};