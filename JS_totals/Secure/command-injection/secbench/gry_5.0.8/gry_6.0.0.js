"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs"),
    abs = require("abs"),
    ExecLimiter = require("exec-limiter"),
    ul = require("ul");

// Create a global exec limiter
var el = new ExecLimiter();

var Gry = function () {
    /**
     * Gry
     * Creates a new `Gry` instance.
     *
     * @name Gry
     * @function
     * @param {Object} options An object containing the following fields:
     *
     *  - `path` (String): The path to the git repository.
     *  - `limit` (Number): The limit of commands to run same time.
     *
     * @return {Gry} The `Gry` instance.
     */
    function Gry(options) {
        _classCallCheck(this, Gry);

        if (typeof options === "string") {
            options = {
                path: options
            };
        }

        options = ul.merge(options, {
            limit: 30
        });

        options.path = abs(options.path);

        this.options = options;
        this.cwd = options.path;
    }

    /**
     * exec
     * Executes a git command in the repository directory.
     *
     * @name exec
     * @function
     * @param {String} command The git command that should be executed in the repository directory.
     * @param {Array} args An array of options passed to the spawned process. This is optional (if not provided, `exec` will be used instead).
     * @param {Function} callback The callback function.
     * @return {Gry} The `Gry` instance.
     */


    _createClass(Gry, [{
        key: "exec",
        value: function exec(command, args, callback) {
            var eargs = [];

            if (typeof args === "function") {
                callback = args;
                args = null;
            }

            eargs.push({ cwd: this.cwd });

            // Add the callback function
            eargs.push(function (err, stdout) {
                if (err) {
                    return callback(err);
                }
                callback(null, stdout.trimRight());
            });

            el.add("git", command, eargs[0], eargs[1]);
            return this;
        }

        /**
         * init
         * Inits the git repository.
         *
         * @name init
         * @function
         * @param {Function} callback The callback function.
         * @return {Gry} The `Gry` instance.
         */

    }, {
        key: "init",
        value: function init(callback) {
            return this.exec(["init"], callback);
        }

        /**
         * create
         * Creates a git repository.
         *
         * @name create
         * @function
         * @param {String} path The path of the repository.
         * @param {Function} callback The callback function
         * @return {Gry} The `Gry` instance.
         */

    }, {
        key: "create",
        value: function create(callback) {
            var _this = this;

            fs.mkdir(this.cwd, function (err) {
                if (err) {
                    return callback(err);
                }
                _this.init(callback);
            });
            return this;
        }

        /**
         * commit
         * Creates a commit, providing the `message`.
         *
         * @name commit
         * @function
         * @param {String} message The commit message
         * @param {String} options Additional options passed to the commit command.
         * @param {Function} callback The callback function.
         * @return {Gry} The `Gry` instance.
         */

    }, {
        key: "commit",
        value: function commit(message, options, callback) {
            message = message.replace(/\"/g, "\\");
            if (typeof options === "function") {
                callback = options;
                options = "";
            }
            return this.exec(["commit", "-m", message].concat(_toConsumableArray(options.split(" ").filter(function (a) {
                return a;
            }))), callback);
        }

        /**
         * pull
         * Runs `git pull`.
         *
         * @name pull
         * @function
         * @param {String} options Additional options passed to the `pull` command.
         * @param {Function} callback The callback function.
         * @return {Gry} The `Gry` instance.
         */

    }, {
        key: "pull",
        value: function pull(options, callback) {
            if (typeof options === "function") {
                callback = options;
                options = "";
            }
            return this.exec(["pull"].concat(_toConsumableArray(options.split(" "))), callback);
        }

        /**
         * add
         * Runs `git add`.
         *
         * @name add
         * @function
         * @param {String} options Additional options passed to the `add` command.
         * @param {Function} callback The callback function.
         * @return {Gry} The `Gry` instance.
         */

    }, {
        key: "add",
        value: function add(options, callback) {
            if (typeof options === "function") {
                callback = options;
                options = ".";
            }
            return this.exec(["add"].concat(_toConsumableArray(options.split(" "))), callback);
        }

        /**
         * branch
         * Runs `git branch`.
         *
         * @name branch
         * @function
         * @param {String} options Additional options passed to the `branch` command.
         * @param {Function} callback The callback function.
         * @return {Gry} The `Gry` instance.
         */

    }, {
        key: "branch",
        value: function branch(options, callback) {
            if (typeof options === "function") {
                callback = options;
                options = "";
            }
            return this.exec(["branch"].concat(_toConsumableArray(options.split(" "))), callback);
        }

        /**
         * checkout
         * Runs `git checkout`.
         *
         * @name checkout
         * @function
         * @param {String} options Additional options passed to the `checkout` command.
         * @param {Function} callback The callback function.
         * @return {Gry} The `Gry` instance.
         */

    }, {
        key: "checkout",
        value: function checkout(options, callback) {
            if (typeof options === "function") {
                callback = options;
                options = "";
            }
            return this.exec(["checkout"].concat(_toConsumableArray(options.split(" "))), callback);
        }

        /**
         * clone
         * Runs `git clone`.
         *
         * @name clone
         * @function
         * @param {String} gitUrl The git url of the repository that should be cloned.
         * @param {String} options Additional options passed to the `checkout` command.
         * @param {Function} callback The callback function.
         * @return {Gry} The `Gry` instance.
         */

    }, {
        key: "clone",
        value: function clone(gitUrl, options, callback) {
            if (typeof options === "function") {
                callback = options;
                options = "";
            }
            return this.exec(["clone", gitUrl].concat(_toConsumableArray(options.split(" "))), callback);
        }
    }]);

    return Gry;
}();

Gry.limiter = el;

module.exports = Gry;
