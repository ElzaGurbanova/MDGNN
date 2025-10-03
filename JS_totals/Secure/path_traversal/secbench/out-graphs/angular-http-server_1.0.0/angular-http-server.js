var fs = require('fs');
const v73 = require('minimist');
const v74 = process.argv;
const v75 = v74.slice(2);
var argv = v73(v75);
var mime = require('mime');
var path = require('path');
var pem = require('pem');
var https = require('https');
var http = require('http');
var server;
const NO_PATH_FILE_ERROR_MESSAGE = 'Error: index.html could not be found in the specified path ';
const NO_ROOT_FILE_ERROR_MESSAGE = 'Error: Could not find index.html within the working directory.';
const v76 = returnDistFile(true);
v76;
const v77 = argv.ssl;
const v78 = argv.https;
const v79 = v77 || v78;
if (v79) {
    const v80 = {
        days: 1,
        selfSigned: true
    };
    const v84 = function (err, keys) {
        const v81 = keys.serviceKey;
        const v82 = keys.certificate;
        var options = {};
        options.key = v81;
        options.cert = v82;
        options.rejectUnauthorized = false;
        server = https.createServer(options, requestListener);
        const v83 = start();
        v83;
    };
    const v85 = pem.createCertificate(v80, v84);
    v85;
} else {
    server = http.createServer(requestListener);
    const v86 = start();
    v86;
}
const start = function () {
    const v87 = getPort();
    const v91 = function () {
        const v88 = getPort();
        const v89 = 'Listening on ' + v88;
        const v90 = console.log(v89);
        return v90;
    };
    const v92 = server.listen(v87, v91);
    v92;
};
const requestListener = function (req, res) {
    const v93 = argv.cors;
    if (v93) {
        const v94 = res.setHeader('Access-Control-Allow-Origin', '*');
        v94;
        const v95 = res.setHeader('Access-Control-Request-Method', '*');
        v95;
        const v96 = res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        v96;
        const v97 = res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
        v97;
        const v98 = req.method;
        const v99 = v98 === 'OPTIONS';
        if (v99) {
            const v100 = res.writeHead(200);
            v100;
            const v101 = res.end();
            v101;
            return;
        }
    }
    const v102 = req.url;
    const v103 = v102.split('?');
    var url = v103[0];
    const v104 = url.slice(1);
    const v105 = resolveUrl(v104);
    var possibleFilename = v105 || 'dummy';
    const v106 = path.normalize(possibleFilename);
    var safeFileName = v106.replace(/^(\.\.[\/\\])+/, '');
    var safeFullFilename = path.join(__dirname, safeFileName);
    const v119 = function (err, stats) {
        var fileBuffer;
        const v107 = !err;
        const v108 = stats.isFile();
        const v109 = v107 && v108;
        if (v109) {
            fileBuffer = fs.readFileSync(safeFullFilename);
            let ct = mime.lookup(safeFullFilename);
            const v110 = `Sending ${ safeFullFilename } with Content-Type ${ ct }`;
            const v111 = log(v110);
            v111;
            const v112 = { 'Content-Type': ct };
            const v113 = res.writeHead(200, v112);
            v113;
        } else {
            const v114 = log('Route %s, replacing with index.html', safeFullFilename);
            v114;
            fileBuffer = returnDistFile();
            const v115 = { 'Content-Type': 'text/html' };
            const v116 = res.writeHead(200, v115);
            v116;
        }
        const v117 = res.write(fileBuffer);
        v117;
        const v118 = res.end();
        v118;
    };
    const v120 = fs.stat(safeFullFilename, v119);
    v120;
};
const getPort = function () {
    const v121 = argv.p;
    if (v121) {
        const v122 = argv.p;
        var portNum = parseInt(v122);
        const v123 = isNaN(portNum);
        const v124 = !v123;
        if (v124) {
            return portNum;
        } else {
            const v125 = new Exception('Provided port number is not a number!');
            throw v125;
        }
    } else {
        return 8080;
    }
};
const returnDistFile = function (displayFileMessages = false) {
    var distPath;
    var argvPath = argv.path;
    if (argvPath) {
        try {
            if (displayFileMessages) {
                const v126 = log('Path specified: %s', argvPath);
                v126;
            }
            distPath = path.join(argvPath, 'index.html');
            if (displayFileMessages) {
                const v127 = log('Using %s', distPath);
                v127;
            }
            const v128 = fs.readFileSync(distPath);
            return v128;
        } catch (e) {
            const v129 = NO_PATH_FILE_ERROR_MESSAGE + '%s';
            const v130 = console.warn(v129, argvPath);
            v130;
            const v131 = process.exit(1);
            v131;
        }
    } else {
        if (displayFileMessages) {
            const v132 = log('Info: Path not specified using the working directory.');
            v132;
        }
        distPath = 'index.html';
        try {
            const v133 = fs.readFileSync(distPath);
            return v133;
        } catch (e) {
            const v134 = console.warn(NO_ROOT_FILE_ERROR_MESSAGE);
            v134;
            const v135 = process.exit(1);
            v135;
        }
    }
};
const resolveUrl = function (filename) {
    const v136 = filename.includes('..');
    if (v136) {
        return null;
    }
    const v137 = argv.path;
    const v138 = filename && v137;
    if (v138) {
        const v139 = argv.path;
        const v140 = path.join(v139, filename);
        return v140;
    } else {
        return filename;
    }
};
const log = function () {
    const v141 = argv.silent;
    const v142 = !v141;
    if (v142) {
        const v143 = console.log;
        const v144 = v143.apply(console, arguments);
        v144;
    }
};