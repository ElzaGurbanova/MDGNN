var assert = require("assert");
var path = require("path");
var fs = require("fs");
var hasOwn = Object.hasOwnProperty;
var defaultHandler = require.extensions[".js"];
var convertSourceMap = require("convert-source-map");
var meteorBabel = require("./index.js");
var util = require("./util.js");

function realOrResolve(p) {
  try { return fs.realpathSync(p); } catch { return path.resolve(p); }
}

var config = {
  sourceMapRootPath: null,
  // store canonical (real) paths as keys
  allowedDirectories: Object.create(null),
  babelOptions: require("./options").getDefaults()
};

exports.setSourceMapRootPath = function (smrp) {
  config.sourceMapRootPath = smrp;
  return exports;
};

exports.allowDirectory = function (dir) {
  // canonicalize before storing
  var canon = realOrResolve(dir);
  config.allowedDirectories[canon] = true;
  return exports;
};

exports.setBabelOptions = function (options) {
  config.babelOptions = options;
  return exports;
};

require.extensions[".js"] = function(module, filename) {
  if (shouldNotTransform(filename)) {
    defaultHandler(module, filename);
  } else {
    module._compile(
      getBabelResult(filename).code,
      filename
    );
  }
};

exports.retrieveSourceMap = function(filename) {
  if (shouldNotTransform(filename)) {
    return null;
  }

  var result = getBabelResult(filename);
  var converted = result && convertSourceMap.fromSource(result.code);
  var map = converted && converted.toJSON();

  return map && {
    url: map.file,
    map: map
  } || null;
};

function shouldNotTransform(filename) {
  // Reject non-absolute names (e.g., core module identifiers)
  if (!path.isAbsolute(filename)) {
    return true;
  }

  // Canonicalize filename before testing containment
  var fileReal = realOrResolve(filename);

  var dirs = Object.keys(config.allowedDirectories);
  var allowed = dirs.some(function (dir) {
    var dirReal = dir; // already canonical in allowDirectory
    var relPath = path.relative(dirReal, fileReal);

    if (relPath.slice(0, 2) === ".." || path.isAbsolute(relPath)) {
      // Outside this allowed directory
      return false;
    }

    if (relPath.split(path.sep).indexOf("node_modules") >= 0) {
      // Ignore files within node_modules below an allowed dir
      return false;
    }

    return true;
  });

  return !allowed;
}

function getBabelResult(filename) {
  var source = fs.readFileSync(filename, "utf8");

  var babelOptions = {};
  for (var key in config.babelOptions) {
    if (hasOwn.call(config.babelOptions, key)) {
      babelOptions[key] = config.babelOptions[key];
    }
  }

  if (babelOptions.sourceMap) {
    var filenameForMap = filename;

    if (config.sourceMapRootPath) {
      var relativePath = path.relative(
        config.sourceMapRootPath,
        filename
      );

      if (relativePath.slice(0, 2) !== "..") {
        // Use a stable absolute-like path in the map
        filenameForMap = "/" + relativePath;
      }
    }

    babelOptions.filename = filenameForMap;
    babelOptions.sourceFileName = filenameForMap;
    babelOptions.sourceMapTarget = filenameForMap + ".map";
  }

  return meteorBabel.compile(source, babelOptions);
}

