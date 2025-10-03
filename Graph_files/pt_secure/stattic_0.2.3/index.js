let fs = require('fs');
let path = require('path');
let http = require('http');
let url = require('url');
let mime = require('mime');
let utily = require('utily');
const v107 = process.cwd();
let options = {};
options.folder = v107;
options.port = 5000;
options.cors = false;
options.index = 'index.html';
const v108 = path.resolve(__dirname, './assets/error.html');
options.error = v108;
const v109 = module.exports;
const v123 = function (key, value) {
    const v110 = options[key];
    const v111 = typeof v110;
    const v112 = v111 === 'undefined';
    if (v112) {
        const v113 = 'Unknown key \'' + key;
        const v114 = v113 + '\'';
        const v115 = new Error(v114);
        throw v115;
    }
    const v116 = options[key];
    const v117 = typeof v116;
    const v118 = typeof value;
    const v119 = v117 !== v118;
    if (v119) {
        const v120 = 'Invalid key type \'' + key;
        const v121 = v120 + '\'';
        const v122 = new Error(v121);
        throw v122;
    }
    options[key] = value;
};
v109.set = v123;
const v124 = module.exports;
const v126 = function (key) {
    const v125 = options[key];
    return v125;
};
v124.get = v126;
const v127 = module.exports;
const v200 = function (port, cb) {
    const v128 = typeof port;
    const v129 = v128 === 'function';
    if (v129) {
        cb = port;
    } else {
        cb = cb;
    }
    const v130 = typeof port;
    const v131 = v130 === 'number';
    const v132 = parseInt(port);
    const v133 = options.port;
    if (v131) {
        port = v132;
    } else {
        port = v133;
    }
    const v134 = process.cwd();
    const v135 = options.folder;
    const v136 = path.resolve(v134, v135);
    options.folder = v136;
    const v137 = process.cwd();
    const v138 = options.error;
    const v139 = path.resolve(v137, v138);
    options.error = v139;
    const v183 = function (req, res) {
        let timeStart = Date.now();
        const v140 = options.cors;
        const v141 = v140 === true;
        if (v141) {
            const v142 = res.setHeader('Access-Control-Allow-Origin', '*');
            v142;
            const v143 = res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            v143;
            const v144 = res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            v144;
        }
        const v145 = req.url;
        const v146 = url.parse(v145);
        let pathname = v146.pathname;
        pathname = path.normalize(pathname);
        const v147 = options.folder;
        let localPath = path.join(v147, pathname);
        const v148 = path.extname(localPath);
        const v149 = v148 === '';
        if (v149) {
            const v150 = options.index;
            const v151 = path.basename(v150);
            const v152 = './' + v151;
            localPath = path.join(localPath, v152);
        }
        const v163 = function () {
            const v153 = res.statusCode;
            const v154 = '' + v153;
            const v155 = v154 + '  ';
            const v156 = v155 + pathname;
            const v157 = v156 + '  ';
            const v158 = Date.now();
            const v159 = v158 - timeStart;
            const v160 = v157 + v159;
            const v161 = v160 + ' ms';
            const v162 = console.log(v161);
            v162;
        };
        const v164 = res.on('finish', v163);
        v164;
        const v165 = utily.fs;
        const v181 = function (error, exists) {
            if (error) {
                const v166 = errorPage(res, 500, 'Error processing your request.');
                return v166;
            }
            const v167 = exists === false;
            if (v167) {
                const v168 = errorPage(res, 404, 'File not found.');
                return v168;
            }
            const v169 = mime.getType(localPath);
            const v170 = { 'Content-Type': v169 };
            const v171 = res.writeHead(200, v170);
            v171;
            let reader = fs.createReadStream(localPath);
            const v173 = function (data) {
                const v172 = res.write(data);
                v172;
            };
            const v174 = reader.on('data', v173);
            v174;
            const v176 = function () {
                const v175 = res.end('');
                v175;
            };
            const v177 = reader.on('end', v176);
            v177;
            const v179 = function (error) {
                const v178 = errorPage(res, 500, 'Something went wrong...');
                return v178;
            };
            const v180 = reader.on('error', v179);
            v180;
        };
        const v182 = v165.isFile(localPath, v181);
        return v182;
    };
    let server = http.createServer(v183);
    const v198 = function () {
        const v184 = typeof cb;
        const v185 = v184 === 'function';
        if (v185) {
            const v186 = cb.call(null);
            v186;
        } else {
            const v187 = console.log('');
            v187;
            const v188 = 'Static server listening on: ' + 'http://localhost:';
            const v189 = options.port;
            const v190 = v188 + v189;
            const v191 = v190 + '';
            const v192 = console.log(v191);
            v192;
            const v193 = options.folder;
            const v194 = 'Reading files from: ' + v193;
            const v195 = v194 + '';
            const v196 = console.log(v195);
            v196;
            const v197 = console.log('');
            v197;
        }
    };
    const v199 = server.listen(port, v198);
    v199;
};
v127.listen = v200;
let errorPage = function (res, errorCode, errorMessage) {
    const v201 = { 'Content-Type': 'text/html' };
    const v202 = res.writeHead(errorCode, v201);
    v202;
    const v203 = options.error;
    const v211 = function (error, data) {
        if (error) {
            const v204 = '<' + 'h1>Error</h1><p>';
            const v205 = v204 + errorMessage;
            const v206 = v205 + '</p>';
            const v207 = res.end(v206);
            return v207;
        }
        const v208 = utily.string;
        const v209 = {
            code: errorCode,
            message: errorMessage
        };
        data = v208.format(data, v209);
        const v210 = res.end(data);
        return v210;
    };
    const v212 = fs.readFile(v203, 'utf8', v211);
    return v212;
};