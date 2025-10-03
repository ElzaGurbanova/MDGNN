var url = require('url');
var fs = require('fs');

function url2parse(url_str) {
	var urlObj = url.parse(url_str);
	var path = urlObj.path;
	return path;
}

module.exports = function (parent_path) {
	return function (req, res, next) {
		var path = url2parse(req.url);
		function callback(err, data) {
			if (err) {
				res.status = 404;
			} else {
				res.write(data);
			}
			res.end();
		}
		fs.readFile(parent_path + path, callback);
	}
}
