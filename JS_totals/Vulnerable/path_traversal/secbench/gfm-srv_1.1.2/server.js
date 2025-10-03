var fs, gfmSrv, mdExts, path, pkg, render, srv, url, _;

fs = require('fs');

url = require('url');

path = require('path');

srv = require('node-srv');

_ = require('underscore');

render = require('./renderer');

pkg = require('../package.json');

mdExts = ['.md', '.markdown'];

gfmSrv = srv.extend({
  name: pkg.name,
  version: pkg.version,
  constructor: function(options) {
    if (options && options.template) {
      this.loadTemplate(options.template);
    }
    return srv.apply(this, arguments);
  },
  addRequest: function(req, res) {
    var reqObj;
    reqObj = {
      request: req,
      response: res,
      uid: _.random(0, 10000000),
      startTime: new Date(),
      uri: url.parse(req.url).pathname.replace(/^\//, '').replace(/\/$/, '/' + this.options.index),
      body: ''
    };
    if (reqObj.uri.length === 0) {
      reqObj.uri = this.options.index;
    }
    if (_.compact(reqObj.uri.split('/'))[0] === 'static') {
      reqObj.filename = path.resolve(process.cwd(), this.options["static"] || '', reqObj.uri);
    } else {
      reqObj.filename = path.resolve(process.cwd(), this.options.root || '', reqObj.uri);
    }
    this.stack.push(reqObj);
    return this.ev.emit('request');
  },
  loadTemplate: function(templatePath) {
    return this._tmpl = fs.readFileSync(templatePath).toString();
  }
});

gfmSrv.extendHandlers({
  extnames: mdExts,
  method: function(reqObj, callback) {
    var err, fileName, filePath;
    err = null;
    filePath = reqObj.filename;
    fileName = path.basename(filePath, path.extname(filePath));
    reqObj.mime = {
      "Content-Type": "text/html"
    };
    reqObj.status = 200;
    return fs.readFile(filePath, {
      encoding: 'utf-8'
    }, (function(_this) {
      return function(err, file) {
        var e, html, readyFile, template;
        if (err) {
          _this.response500(err, callback);
          _this.errorLog(reqObj, 'Error 500: ' + JSON.stringify(err));
          return false;
        }
        try {
          readyFile = render(file);
          template = _.template(_this._tmpl);
          html = template({
            title: fileName.slice(0, 1).toUpperCase() + fileName.slice(1).replace('_', ' '),
            content: readyFile.html,
            navigation: readyFile.navigation
          });
          reqObj.body = html;
        } catch (_error) {
          e = _error;
          err = e;
          console.error(e);
        }
        return callback(err, reqObj);
      };
    })(this));
  }
});

module.exports = gfmSrv;
