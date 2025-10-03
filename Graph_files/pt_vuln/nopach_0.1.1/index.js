var http = require('http');
var https = require('https');
var url = require('url');
var path = require('path');
var fs = require('fs');
var open = require('open');
var portfinder = require('portfinder');
const v112 = require('optimist');
const v113 = v112.usage('Usage: nopach --https [bool] --dir [string] --port [num] --priv [string] --root [bool] ');
const v114 = v113.default('root', 0);
const v115 = v114.alias('r', 'root');
const v116 = v115.describe('root', 'allows a routing system to always reload root on 404s of directories');
const v117 = v116.default('port', 0);
const v118 = v117.alias('p', 'port');
const v119 = v118.describe('port', 'specify port to use, if no port specified use first open port from 8000+');
const v120 = v119.default('priv', 'privatekey.pem');
const v121 = v120.describe('priv', 'Private key if HTTPS specified');
const v122 = v121.default('pub', 'certificate.pem');
const v123 = v122.describe('pub', 'Public key if HTTPS specified');
const v124 = v123.default('https', false);
const v125 = v124.describe('https', 'Turn on https with --https 1');
const v126 = v125.default('dir', '');
const v127 = v126.describe('dir', 'Specify a directory to monitor, defaults to current');
const v128 = v127.alias('d', 'dir');
var argv = v128.argv;
var dirs_in = [];
var files_in = [];
var projectDir = argv.dir;
var backbone_routing = argv.root;
var options = {};
var openURL = '';
var mimeTypes = {};
mimeTypes['html'] = 'text/html';
mimeTypes['jpeg'] = 'image/jpeg';
mimeTypes['swf'] = 'application/x-shockwave-flash';
mimeTypes['jpg'] = 'image/jpeg';
mimeTypes['png'] = 'image/png';
mimeTypes['js'] = 'text/javascript';
mimeTypes['css'] = 'text/css';
mimeTypes['json'] = 'application/json';
const v157 = function (err, port) {
    const v129 = argv.h;
    if (v129) {
        const v130 = process.exit(1);
        v130;
    }
    const v131 = argv.port;
    const v132 = v131 != 0;
    if (v132) {
        port = argv.port;
    }
    const v133 = argv.https;
    if (v133) {
        try {
            const v134 = argv.priv;
            const v135 = fs.readFileSync(v134);
            const v136 = v135.toString();
            options.key = v136;
            const v137 = argv.pub;
            const v138 = fs.readFileSync(v137);
            const v139 = v138.toString();
            options.cert = v139;
        } catch (e) {
            const v140 = console.log('Public/Private key non existant');
            v140;
            const v141 = process.exit(1);
            v141;
        }
        const v142 = https.createServer(options, server);
        const v143 = v142.listen(port);
        v143;
        const v144 = 'HTTPS Server created on port: ' + port;
        const v145 = v144 + ' based in ';
        const v146 = v145 + projectDir;
        const v147 = console.log(v146);
        v147;
        openURL = 'https://localhost';
    } else {
        const v148 = http.createServer(server);
        const v149 = v148.listen(port);
        v149;
        const v150 = 'HTTP Server created on port: ' + port;
        const v151 = v150 + ' based in ';
        const v152 = v151 + projectDir;
        const v153 = console.log(v152);
        v153;
        openURL = 'http://localhost';
    }
    openURL += ':' + port;
    const v154 = 'Opening webpage ' + openURL;
    const v155 = console.log(v154);
    v155;
    const v156 = open(openURL);
    v156;
};
const v158 = portfinder.getPort(v157);
v158;
const server = function (req, res) {
    const v159 = req.url;
    const v160 = url.parse(v159);
    var uri = v160.pathname;
    const v161 = serveFile(uri, res);
    v161;
};
const printDirectory = function (uri, res) {
    const v162 = process.cwd();
    var filename = path.join(v162, projectDir, uri);
    const v163 = filename + '/';
    const v193 = function (err, files) {
        if (err) {
            throw err;
        }
        dirs_in = [];
        files_in = [];
        const v164 = mimeTypes['html'];
        const v165 = { 'Content-Type': v164 };
        const v166 = res.writeHead(200, v165);
        v166;
        const v167 = '<HTML><HEAD><title>Directory Listing</title></HEAD><BODY><h1>Directory Listing for ' + filename;
        const v168 = v167 + '</h1>';
        const v169 = res.write(v168);
        v169;
        const v170 = res.write('<ul>');
        v170;
        var x = 0;
        const v171 = files.length;
        let v172 = x < v171;
        while (v172) {
            const v174 = files[x];
            const v175 = '<li><a href=\'' + v174;
            const v176 = v175 + '\'>';
            const v177 = files[x];
            const v178 = v176 + v177;
            const v179 = v178 + '</a>';
            const v180 = res.write(v179);
            v180;
            const v181 = filename + '/';
            const v182 = files[x];
            const v183 = v181 + v182;
            const v184 = path.join(v183);
            const v185 = fs.statSync(v184);
            const v186 = v185.isDirectory();
            if (v186) {
                const v187 = res.write(' is a <b style=\'color:blue\'>dir</b>');
                v187;
            } else {
                const v188 = res.write(' is a <b style=\'color:green\'>file</b>');
                v188;
            }
            const v189 = res.write('</li>');
            v189;
            const v173 = x++;
            v172 = x < v171;
        }
        const v190 = res.write('</ul>');
        v190;
        const v191 = res.write('</BODY></HTML>');
        v191;
        const v192 = res.end();
        v192;
    };
    const v194 = fs.readdir(v163, v193);
    v194;
};
const serveFile = function (uri, res) {
    var stats;
    const v195 = process.cwd();
    var filename = path.join(v195, projectDir, uri);
    const v196 = process.cwd();
    var root = path.join(v196, projectDir, '/index.html');
    try {
        stats = fs.lstatSync(filename);
    } catch (e) {
        if (backbone_routing) {
            const v197 = console.log('Serving up the root');
            v197;
            const v198 = { 'Content-Type': 'text/html' };
            const v199 = res.writeHead(200, v198);
            v199;
            var fileStream = fs.createReadStream(root);
            const v200 = fileStream.pipe(res);
            v200;
        } else {
            const v201 = { 'Content-Type': 'text/plain' };
            const v202 = res.writeHead(404, v201);
            v202;
            const v203 = res.write('404 Directory Not Found\n');
            v203;
            const v204 = res.end();
            v204;
        }
        return;
    }
    const v205 = stats.isFile();
    if (v205) {
        const v206 = path.extname(filename);
        const v207 = v206.split('.');
        const v208 = v207[1];
        var mimeType = mimeTypes[v208];
        const v209 = { 'Content-Type': mimeType };
        const v210 = res.writeHead(200, v209);
        v210;
        var fileStream = fs.createReadStream(filename);
        const v211 = fileStream.pipe(res);
        v211;
    } else {
        const v212 = stats.isDirectory();
        if (v212) {
            const v213 = path.join(filename, 'index.html');
            const v217 = function (exists) {
                if (exists) {
                    const v214 = path.join(uri, 'index.html');
                    const v215 = serveFile(v214, res);
                    v215;
                } else {
                    const v216 = printDirectory(uri, res);
                    v216;
                }
            };
            const v218 = fs.exists(v213, v217);
            v218;
        } else {
            const v219 = { 'Content-Type': 'text/plain' };
            const v220 = res.writeHead(500, v219);
            v220;
            const v221 = res.write('500 Internal server error\n');
            v221;
            const v222 = res.end();
            v222;
        }
    }
};