var fs = require('fs');
const v72 = require('minimist');
const v73 = process.argv;
const v74 = v73.slice(2);
var argv = v72(v74);
var mime = require('mime');
var path = require('path');
var pem = require('pem');
var https = require('https');
var http = require('http');
var server;
const NO_PATH_FILE_ERROR_MESSAGE = 'Error: index.html could not be found in the specified path ';
const NO_ROOT_FILE_ERROR_MESSAGE = 'Error: Could not find index.html within the working directory.';
const v75 = returnDistFile(true);
v75;
const v76 = argv.ssl;
const v77 = argv.https;
const v78 = v76 || v77;
if (v78) {
    const v79 = {
        days: 1,
        selfSigned: true
    };
    const v83 = function (err, keys) {
        const v80 = keys.serviceKey;
        const v81 = keys.certificate;
        var options = {};
        options.key = v80;
        options.cert = v81;
        options.rejectUnauthorized = false;
        server = https.createServer(options, requestListener);
        const v82 = start();
        v82;
    };
    const v84 = pem.createCertificate(v79, v83);
    v84;
} else {
    server = http.createServer(requestListener);
    const v85 = start();
    v85;
}
const start = function () {
    const v86 = getPort();
    const v90 = function () {
        const v87 = getPort();
        const v88 = 'Listening on ' + v87;
        const v89 = console.log(v88);
        return v89;
    };
    const v91 = server.listen(v86, v90);
    v91;
};
const requestListener = function (req, res) {
    const v92 = argv.cors;
    if (v92) {
        const v93 = res.setHeader('Access-Control-Allow-Origin', '*');
        v93;
        const v94 = res.setHeader('Access-Control-Request-Method', '*');
        v94;
        const v95 = res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        v95;
        const v96 = res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
        v96;
        const v97 = req.method;
        const v98 = v97 === 'OPTIONS';
        if (v98) {
            const v99 = res.writeHead(200);
            v99;
            const v100 = res.end();
            v100;
            return;
        }
    }
    const v101 = req.url;
    const v102 = v101.split('?');
    var url = v102[0];
    const v103 = url.slice(1);
    const v104 = resolveUrl(v103);
    var possibleFilename = v104 || 'dummy';
    const v117 = function (err, stats) {
        var fileBuffer;
        const v105 = !err;
        const v106 = stats.isFile();
        const v107 = v105 && v106;
        if (v107) {
            fileBuffer = fs.readFileSync(possibleFilename);
            let ct = mime.lookup(possibleFilename);
            const v108 = `Sending ${ possibleFilename } with Content-Type ${ ct }`;
            const v109 = log(v108);
            v109;
            const v110 = { 'Content-Type': ct };
            const v111 = res.writeHead(200, v110);
            v111;
        } else {
            const v112 = log('Route %s, replacing with index.html', possibleFilename);
            v112;
            fileBuffer = returnDistFile();
            const v113 = { 'Content-Type': 'text/html' };
            const v114 = res.writeHead(200, v113);
            v114;
        }
        const v115 = res.write(fileBuffer);
        v115;
        const v116 = res.end();
        v116;
    };
    const v118 = fs.stat(possibleFilename, v117);
    v118;
};
const getPort = function () {
    const v119 = argv.p;
    if (v119) {
        const v120 = argv.p;
        var portNum = parseInt(v120);
        const v121 = isNaN(portNum);
        const v122 = !v121;
        if (v122) {
            return portNum;
        } else {
            const v123 = new Exception('Provided port number is not a number!');
            throw v123;
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
                const v124 = log('Path specified: %s', argvPath);
                v124;
            }
            distPath = path.join(argvPath, 'index.html');
            if (displayFileMessages) {
                const v125 = log('Using %s', distPath);
                v125;
            }
            const v126 = fs.readFileSync(distPath);
            return v126;
        } catch (e) {
            const v127 = NO_PATH_FILE_ERROR_MESSAGE + '%s';
            const v128 = console.warn(v127, argvPath);
            v128;
            const v129 = process.exit(1);
            v129;
        }
    } else {
        if (displayFileMessages) {
            const v130 = log('Info: Path not specified using the working directory.');
            v130;
        }
        distPath = 'index.html';
        try {
            const v131 = fs.readFileSync(distPath);
            return v131;
        } catch (e) {
            const v132 = console.warn(NO_ROOT_FILE_ERROR_MESSAGE);
            v132;
            const v133 = process.exit(1);
            v133;
        }
    }
};
const resolveUrl = function (filename) {
    const v134 = filename.includes('..');
    if (v134) {
        return null;
    }
    const v135 = argv.path;
    const v136 = filename && v135;
    if (v136) {
        const v137 = argv.path;
        const v138 = path.join(v137, filename);
        return v138;
    } else {
        return filename;
    }
};
const log = function () {
    const v139 = argv.silent;
    const v140 = !v139;
    if (v140) {
        const v141 = console.log;
        const v142 = v141.apply(console, arguments);
        v142;
    }
};