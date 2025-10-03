var cp = require('child_process');
var curl = function (url, options, callback) {
    const v63 = function () {
    };
    callback = callback || v63;
    const v64 = typeof options;
    const v65 = v64 == 'function';
    if (v65) {
        callback = options;
        options = null;
    }
    const v66 = !options;
    if (v66) {
        var opts = new optionsBuilder();
        const v67 = opts.follow_redirects();
        const v68 = v67.silent();
        const v69 = v68.max_redirs(5);
        options = v69.connect_timeout(5);
    }
    const v70 = 'curl "' + url;
    var curlString = v70 + '" ';
    curlString += options.stringify();
    try {
        const v72 = function (err, stdout, stderr) {
            const v71 = callback(err, stdout, stderr);
            v71;
        };
        const v73 = cp.exec(curlString, v72);
        v73;
    } catch (err) {
        const v74 = callback(err, null, null);
        v74;
    }
};
var optionsBuilder = function () {
    var _string = '';
    var _verboseOpt = '-v';
    var _redirectOpt = '-L';
    var _silentOpt = '-S';
    var _insecureOpt = '-k';
    var _postOpt = '--data';
    var _postUrlEncodeOpt = '--data-urlencode';
    var _maxRedirsOpt = '--max-redirs';
    var _timeoutOpt = '--connect-timeout';
    var _ntlmOpt = '-ntlm';
    var _ntlmProxyOpt = '--proxy-ntlm';
    var modifyOptionString = function (opt, add) {
        const v75 = add !== false;
        if (v75) {
            const v76 = addOption(opt);
            v76;
        } else {
            const v77 = removeOption(opt);
            v77;
        }
    };
    var addOption = function (opt) {
        _string += opt + ' ';
    };
    var removeOption = function (opt) {
        const v78 = new RegExp(opt, 'g');
        _string = _string.replace(v78, '');
    };
    var buildPostString = function (baseString, o) {
        var string = baseString + ' "';
        let key;
        for (key in o) {
            const v79 = key + '=';
            const v80 = o[key];
            const v81 = v79 + v80;
            string += v81 + '&';
        }
        const v82 = string.length;
        const v83 = v82 - 1;
        const v84 = string.substr(o, v83);
        const v85 = v84 === '&';
        if (v85) {
            const v86 = string.length;
            const v87 = v86 - 1;
            string = string.substr(0, v87);
        }
        string += '"';
        return string;
    };
    const v88 = function () {
        return _string;
    };
    this.stringify = v88;
    const v90 = function (o) {
        const v89 = modifyOptionString(_verboseOpt, o);
        v89;
        return this;
    };
    this.verbose = v90;
    const v92 = function (o) {
        const v91 = modifyOptionString(_redirectOpt, o);
        v91;
        return this;
    };
    this.follow_redirects = v92;
    const v94 = function (o) {
        const v93 = modifyOptionString(_silentOpt, o);
        v93;
        return this;
    };
    this.silent = v94;
    const v96 = function (o) {
        const v95 = modifyOptionString(_insecureOpt, o);
        v95;
        return this;
    };
    this.ignore_cert = v96;
    const v101 = function (maxRedirs, o) {
        const v97 = !maxRedirs;
        if (v97) {
            maxRedirs = 0;
        }
        const v98 = removeOption(_maxRedirsOpt);
        v98;
        const v99 = '--max-redirs ' + maxRedirs;
        _maxRedirsOpt = v99 + ' ';
        const v100 = modifyOptionString(_maxRedirsOpt, o);
        v100;
        return this;
    };
    this.max_redirs = v101;
    const v106 = function (timeout, o) {
        const v102 = !timeout;
        if (v102) {
            timeout = 0;
        }
        const v103 = removeOption(_timeoutOpt);
        v103;
        const v104 = '--connect-timeout ' + timeout;
        _timeoutOpt = v104 + ' ';
        const v105 = modifyOptionString(_timeoutOpt, o);
        v105;
        return this;
    };
    this.connect_timeout = v106;
    const v108 = function (o) {
        const v107 = modifyOptionString(_ntlmOpt, o);
        v107;
        return this;
    };
    this.ntlm = v108;
    const v110 = function (o) {
        const v109 = modifyOptionString(_ntlmProxyOpt, o);
        v109;
        return this;
    };
    this.ntlm_proxy = v110;
    const v115 = function (o) {
        const v111 = removeOption(_postOpt);
        v111;
        const v112 = typeof o;
        const v113 = v112 === 'object';
        if (v113) {
            _postOpt = buildPostString(_postOpt, o);
            const v114 = modifyOptionString(_postOpt, o);
            v114;
        }
        return this;
    };
    this.post_data = v115;
    const v120 = function (o) {
        const v116 = removeOption(_postUrlEncodeOpt);
        v116;
        const v117 = typeof o;
        const v118 = v117 === 'object';
        if (v118) {
            _postUrlEncodeOpt = buildPostString(_postUrlEncodeOpt, o);
            const v119 = modifyOptionString(_postUrlEncodeOpt, o);
            v119;
        }
        return this;
    };
    this.post_data_urlencode = v120;
    const v121 = function () {
        _string = '';
    };
    this.clear = v121;
    return this;
};
const v123 = function () {
    const v122 = new optionsBuilder();
    return v122;
};
var opts = v123();
module.exports = curl;
const v124 = module.exports;
v124.opts = opts;