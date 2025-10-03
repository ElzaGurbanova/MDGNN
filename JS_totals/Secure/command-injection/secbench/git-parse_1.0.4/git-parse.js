"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("util.promisify"));

var _child_process = _interopRequireDefault(require("child_process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const execFile = (0, _util.default)(_child_process.default.execFile);
/**
 * Returns a git diff given a path to the repo, a commit,
 * an optional second commit, and an optional file.
 *
 * Returns the diff as a string.
 */

const gitDiff = (pathToRepo, commit1, commit2 = "", file = "") => {
  const args = ["diff", commit1];
  if (commit2) args.push(commit2);
  args.push("--");
  if (file) args.push(file);
  return execFile("git", args, {
    cwd: pathToRepo,
    encoding: "utf8",
    maxBuffer: 1024 * 1000
  }).then(output => output.stdout);
};

var _default = gitDiff;
exports.default = _default;
