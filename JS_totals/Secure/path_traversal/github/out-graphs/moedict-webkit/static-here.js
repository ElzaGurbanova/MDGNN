var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');
const v106 = require('events');
var EventEmitter = v106.EventEmitter;
const v107 = require('child_process');
var exec = v107.exec;
const v108 = require('child_process');
var spawn = v108.spawn;
var args = {};
const v109 = process.argv;
var argv = v109.slice(2);
var i = 0;
const v110 = argv.length;
let v111 = i < v110;
while (v111) {
    arg = argv[i];
    const v113 = arg.match(/^\d+$/);
    if (v113) {
        args.port = arg;
    } else {
        const v114 = arg === 'coffee';
        if (v114) {
            args.coffee = true;
        } else {
            const v115 = arg === 'fix';
            if (v115) {
                args.fix = true;
            } else {
                args.host = arg;
            }
        }
    }
    const v112 = i++;
    v111 = i < v110;
}
var mime;
try {
    mime = require('mime');
} catch (e) {
    const v122 = function () {
        var CONTENT_TYPES = {};
        CONTENT_TYPES['js'] = 'application/javascript; charset=utf-8';
        CONTENT_TYPES['css'] = 'text/css; charset=utf-8';
        CONTENT_TYPES['json'] = 'application/json; charset=utf-8';
        CONTENT_TYPES['html'] = 'text/html; charset=utf-8';
        CONTENT_TYPES['htm'] = 'text/html; charset=utf-8';
        CONTENT_TYPES['jpg'] = 'image/jpeg';
        CONTENT_TYPES['jpeg'] = 'image/jpeg';
        CONTENT_TYPES['png'] = 'image/png';
        CONTENT_TYPES['ico'] = 'image/x-icon';
        CONTENT_TYPES['gif'] = 'image/gif';
        CONTENT_TYPES['txt'] = 'text/plain; charset=utf-8';
        CONTENT_TYPES['svg'] = 'image/svg+xml';
        CONTENT_TYPES['ttf'] = 'application/x-font-ttf';
        CONTENT_TYPES['woff'] = 'application/font-woff';
        CONTENT_TYPES['apk'] = 'application/vnd.android.package-archive';
        const v120 = function (ext) {
            ext = ext.trim();
            const v116 = ext[0];
            const v117 = v116 === '.';
            if (v117) {
                ext = ext.slice(1);
            }
            const v118 = CONTENT_TYPES[ext];
            const v119 = v118 || 'application/octet-stream';
            return v119;
        };
        const v121 = {};
        v121.lookup = v120;
        return v121;
    };
    mime = v122();
}
const httpRespond = function (res, code, txt, headers) {
    const v123 = {};
    headers = headers || v123;
    txt = txt || '';
    headers['Content-Type'] = 'text/plain';
    const v124 = res.writeHead(code, headers);
    v124;
    const v125 = res.end(txt);
    v125;
};
var httpCb = function (req, res) {
    const v126 = req.url;
    const v127 = url.parse(v126);
    var uri = v127.pathname;
    var filename;
    try {
        const v128 = process.cwd();
        const v129 = path.join(v128, uri);
        filename = decodeURIComponent(v129);
    } catch (e) {
        const v130 = process.cwd();
        filename = path.join(v130, uri);
    }
    ;
    const v131 = decodeURIComponent(uri);
    const v132 = path.normalize(v131);
    const v133 = decodeURIComponent(uri);
    const v134 = v132 !== v133;
    if (v134) {
        res.statusCode = 403;
        const v135 = res.end();
        v135;
        return;
    }
    const v136 = path.exists;
    const v137 = fs.exists;
    const v138 = v136 || v137;
    const v161 = function (exists) {
        const v139 = !exists;
        const v140 = /manifest.appcache/.test(filename);
        const v141 = v139 || v140;
        if (v141) {
            const v142 = httpRespond(res, 404, 'Page Not Found!\n');
            v142;
            return;
        }
        const v143 = fs.statSync(filename);
        const v144 = v143.isDirectory();
        if (v144) {
            const v145 = -1;
            const v146 = filename.slice(v145);
            const v147 = v146 !== '/';
            if (v147) {
                const v148 = uri + '/';
                const v149 = { 'Location': v148 };
                const v150 = httpRespond(res, 302, 'Location is a folder, redirecting..', v149);
                v150;
                return;
            } else {
                filename = path.join(filename, 'index.html');
            }
        }
        const v159 = function (err, file) {
            if (err) {
                const v151 = err + '\n';
                const v152 = httpRespond(res, 500, v151);
                v152;
                return;
            }
            const v153 = path.extname(filename);
            var ext = v153.slice(1);
            const v154 = mime.lookup(ext);
            const v155 = { 'Content-Type': v154 };
            const v156 = res.writeHead(200, v155);
            v156;
            const v157 = res.write(file, 'binary');
            v157;
            const v158 = res.end();
            v158;
        };
        const v160 = fs.readFile(filename, 'binary', v159);
        v160;
    };
    const v162 = v138(filename, v161);
    v162;
};
const v163 = args.port;
args.port = v163 || 8888;
const v164 = args.host;
args.host = v164 || '0.0.0.0';
var startServer = function () {
    const v165 = http.createServer(httpCb);
    const v166 = args.port;
    const v167 = args.host;
    const v168 = v165.listen(v166, v167);
    v168;
    const v169 = process.cwd();
    const v170 = args.host;
    const v171 = args.port;
    const v172 = console.log('Serving files from %s at http://%s:%s/', v169, v170, v171);
    v172;
};
var coffee;
const v173 = args.coffee;
if (v173) {
    try {
        coffee = require('coffee-script');
    } catch (e) {
    }
    if (coffee) {
        const v181 = function (err, files) {
            if (err) {
                throw err;
            }
            const v174 = files.split(/\n/);
            const v179 = function (file) {
                const v175 = file.trim();
                const v176 = v175.length;
                const v177 = !v176;
                const v178 = !v177;
                return v178;
            };
            files = v174.filter(v179);
            const v180 = startWatching(files);
            v180;
        };
        const v182 = exec('find . -name \'*.coffee\'', v181);
        v182;
    }
}
var startWatching = function (files) {
    const v183 = files.length;
    const v184 = !v183;
    if (v184) {
        const v185 = startServer();
        v185;
        return;
    }
    var compileCoffee = function (filename) {
        const v186 = console.log('Compiling %s', filename);
        v186;
        var coffee_src = fs.readFileSync(filename, 'utf8');
        var js_src;
        try {
            js_src = coffee.compile(coffee_src);
        } catch (e) {
            const v187 = e.message;
            const v188 = console.log('Error compiling %s : %s', filename, v187);
            v188;
            return;
        }
        const v189 = filename.replace(/\.coffee$/, '.js');
        const v190 = fs.writeFileSync(v189, js_src);
        v190;
    };
    const v206 = function (filename) {
        const v191 = compileCoffee(filename);
        v191;
        const v192 = console.log('Watching %s', filename);
        v192;
        const v193 = args.fix;
        const v194 = -1;
        let v195;
        if (v193) {
            v195 = v194;
        } else {
            v195 = 0;
        }
        const v196 = { interval: v195 };
        const v203 = function (curr, old) {
            const v197 = curr.mtime;
            const v198 = +v197;
            const v199 = old.mtime;
            const v200 = +v199;
            const v201 = v198 != v200;
            if (v201) {
                const v202 = compileCoffee(filename);
                v202;
            }
        };
        const v204 = fs.watchFile(filename, v196, v203);
        v204;
        const v205 = startServer();
        v205;
    };
    const v207 = files.forEach(v206);
    v207;
};
const v208 = args.coffee;
const v209 = !v208;
if (v209) {
    const v210 = startServer();
    v210;
}