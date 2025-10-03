var express = require('express');
var shellescape = require('shell-escape');
var config = require('config');
var exec = require('child_process').exec
var app = express();

app.get('/', function(req, res) {
  var phrase = 'Hello my name is Mia!'
  say(phrase);
  res.send(phrase);
});

app.get('/whostheman/:name', function(req, res) {
  var name = req.params.name
  var phrase = name + '! ' + name + '! He is the man! If he cannot do it, no one can!'
  say(phrase);
  res.send(phrase);
});

app.get('/whosthewoman/:name', function(req, res) {
  var name = req.params.name
  var phrase = name + '! ' + name + '! She is the woman! If she cannot do it, no one can!'
  say(phrase);
  res.send(phrase);
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

function say(phrase) {
  var args = config.get('Speak.cmd').split(' ').concat([' "' + phrase + '"']);
  console.log(args);
  exec(shellescape(args), log);
}
function log(error, stdout, stderr) { console.log(stdout);console.log(stderr) }
