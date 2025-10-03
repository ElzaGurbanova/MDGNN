var http = require('http');
var url = require('url');
var fs = require('fs');
var config = {};
config.port = 8080;
config.minDelay = 200;
config.maxDelay = 500;
var defaults = [
    'index.html',
    'index.htm',
    'index.php'
];
var mimeTypes = {};
mimeTypes['.html'] = 'text/html';
mimeTypes['.htm'] = 'text/html';
mimeTypes['.js'] = 'application/javascript';
mimeTypes['.es'] = 'application/ecmascript';
mimeTypes['.pdf'] = 'application/pdf';
mimeTypes['.ico'] = 'image/x-icon';
mimeTypes['.gif'] = 'image/gif';
mimeTypes['.jpeg'] = 'image/jpeg';
mimeTypes['.jpg'] = 'image/jpeg';
mimeTypes['.png'] = 'image/png';
mimeTypes['.svg'] = 'image/svg+xml';
mimeTypes['.bmp'] = 'image/bmp';
mimeTypes['.css'] = 'text/css';
mimeTypes['.txt'] = 'text/plain';
mimeTypes['.md'] = 'text/plain';
var pjson = require('../package.json');
const v98 = require('argparse');
var ArgumentParser = v98.ArgumentParser;
const v99 = pjson.version;
const v100 = {
    version: v99,
    addHelp: true,
    description: 'Simulate HTTP Delays on your local machine'
};
var parser = new ArgumentParser(v100);
const v101 = [
    '-p',
    '--port'
];
const v102 = { help: 'Port number for running the server' };
const v103 = parser.addArgument(v101, v102);
v103;
const v104 = [
    '-m',
    '--min-delay'
];
const v105 = { help: 'Minimum delay in milliseconds' };
const v106 = parser.addArgument(v104, v105);
v106;
const v107 = [
    '-x',
    '--max-delay'
];
const v108 = { help: 'Maximum delay in milliseconds' };
const v109 = parser.addArgument(v107, v108);
v109;
var args = parser.parseArgs();
const v110 = args.port;
const v111 = v110 != null;
if (v111) {
    const v112 = args.port;
    const v113 = Number(v112);
    const v114 = config.port;
    config.port = v113 || v114;
}
const v115 = args.min_delay;
const v116 = v115 != null;
if (v116) {
    const v117 = args.min_delay;
    const v118 = Number(v117);
    config.minDelay = v118 || 0;
}
const v119 = args.max_delay;
const v120 = v119 != null;
if (v120) {
    const v121 = args.max_delay;
    const v122 = Number(v121);
    config.maxDelay = v122 || 0;
}
const v123 = config.minDelay;
const v124 = config.maxDelay;
const v125 = v123 > v124;
if (v125) {
    const v126 = console.log('Minimum delay cannot be greater than maximum delay.');
    v126;
    return;
}
const v166 = function (req, res) {
    const v127 = req.url;
    const v128 = url.parse(v127, true);
    var pathname = v128.pathname;
    const v129 = pathname.indexOf('/../');
    const v130 = -1;
    let v131 = v129 != v130;
    while (v131) {
        pathname = pathname.replace('/../', '');
        v131 = v129 != v130;
    }
    var abspath = '';
    const v132 = config.minDelay;
    const v133 = Math.random();
    const v134 = config.maxDelay;
    const v135 = config.minDelay;
    const v136 = v134 - v135;
    const v137 = v133 * v136;
    const v138 = Math.floor(v137);
    var delay = v132 + v138;
    const v139 = sleep(delay);
    const v164 = function (e) {
        const v140 = pathname == '/';
        if (v140) {
            var i = 0;
            const v141 = defaults.length;
            let v142 = i < v141;
            while (v142) {
                const v144 = process.cwd();
                const v145 = v144 + '/';
                const v146 = defaults[i];
                const v147 = v145 + v146;
                const v148 = fs.existsSync(v147);
                if (v148) {
                    const v149 = defaults[i];
                    pathname = '/' + v149;
                    break;
                }
                const v143 = i++;
                v142 = i < v141;
            }
            const v150 = pathname == '/';
            if (v150) {
                const v151 = return404(res, pathname);
                v151;
                return;
            }
        }
        const v152 = process.cwd();
        abspath = v152 + pathname;
        const v153 = req.method;
        const v154 = console.log('REQUEST: ', v153, pathname);
        v154;
        const v155 = fs.existsSync(abspath);
        if (v155) {
            const v161 = function (err, data) {
                const v156 = pathname.indexOf('.');
                var ext = pathname.slice(v156);
                var mtype = getMimeType(ext);
                const v157 = { 'Content-Type': mtype };
                const v158 = res.writeHead(200, v157);
                v158;
                const v159 = res.write(data);
                v159;
                const v160 = res.end();
                v160;
            };
            const v162 = fs.readFile(abspath, v161);
            v162;
        } else {
            const v163 = return404(res, pathname);
            v163;
            return;
        }
    };
    const v165 = v139.then(v164);
    v165;
};
const v167 = http.createServer(v166);
const v168 = config.port;
const v169 = v167.listen(v168);
v169;
const v170 = process.cwd();
const v171 = 'Serving Directory: ' + v170;
const v172 = v171 + '\nPort ';
const v173 = config.port;
const v174 = v172 + v173;
const v175 = v174 + '\nDelay: ';
const v176 = config.minDelay;
const v177 = v175 + v176;
const v178 = v177 + '-';
const v179 = config.maxDelay;
const v180 = v178 + v179;
var ss = v180 + 'ms';
const v181 = console.log(ss);
v181;
const return404 = function (res, pathname) {
    const v182 = console.log('File not found: ', pathname);
    v182;
    const v183 = res.writeHead(404);
    v183;
    const v184 = '<pre>Not Found: ' + pathname;
    const v185 = v184 + '</pre>';
    const v186 = res.write(v185);
    v186;
    const v187 = res.end();
    v187;
};
const sleep = function (mill) {
    const v191 = function (resolve) {
        const v189 = function () {
            const v188 = resolve();
            v188;
        };
        const v190 = setTimeout(v189, mill);
        v190;
    };
    const v192 = new Promise(v191);
    return v192;
};
const getMimeType = function (ext) {
    const v193 = mimeTypes.hasOwnProperty(ext);
    if (v193) {
        const v194 = mimeTypes[ext];
        return v194;
    } else {
        return 'application/octet-stream';
    }
};