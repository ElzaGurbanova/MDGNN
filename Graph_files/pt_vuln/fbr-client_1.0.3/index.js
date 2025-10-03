var port = 9001;
const v120 = port == 9001;
const v121 = process.argv;
const v128 = function (val, index, array) {
    const v122 = val.toString();
    const v123 = v122.indexOf('port=');
    const v124 = -1;
    const v125 = v123 != v124;
    if (v125) {
        const v126 = val.toString();
        const v127 = v126.split('=');
        val = v127[1];
        val = parseInt(val);
        port = val;
    }
};
const v129 = v121.forEach(v128);
const v130 = v120 && v129;
v130;
var fs = require('fs');
var path = require('path');
var autoRebootServerOnFailure = true;
var server = require('http');
var url = require('url');
const serverHandler = function (request, response) {
    try {
        const v131 = request.url;
        const v132 = url.parse(v131);
        var uri = v132.pathname;
        const v133 = process.cwd();
        var filename = path.join(v133, uri);
        var stats;
        try {
            stats = fs.lstatSync(filename);
        } catch (e) {
            const v134 = { 'Content-Type': 'text/plain' };
            const v135 = response.writeHead(404, v134);
            v135;
            const v136 = path.join('/', uri);
            const v137 = '404 Not Found: ' + v136;
            const v138 = v137 + '\n';
            const v139 = response.write(v138);
            v139;
            const v140 = response.end();
            v140;
            return;
        }
        var contentType;
        const v141 = fs.statSync(filename);
        const v142 = v141.isDirectory();
        if (v142) {
            contentType['Content-Type'] = 'text/html';
            contentType = {};
            contentType = {};
            filename += '/index.html';
        }
        const v153 = function (err, file) {
            if (err) {
                const v143 = { 'Content-Type': 'text/plain' };
                const v144 = response.writeHead(500, v143);
                v144;
                const v145 = path.join('/', uri);
                const v146 = '404 Not Found: ' + v145;
                const v147 = v146 + '\n';
                const v148 = response.write(v147);
                v148;
                const v149 = response.end();
                v149;
                return;
            }
            const v150 = response.writeHead(200, contentType);
            v150;
            const v151 = response.write(file, 'binary');
            v151;
            const v152 = response.end();
            v152;
        };
        const v154 = fs.readFile(filename, 'binary', v153);
        v154;
    } catch (e) {
        const v155 = { 'Content-Type': 'text/plain' };
        const v156 = response.writeHead(404, v155);
        v156;
        const v157 = e.stack;
        const v158 = '<h1>Unexpected error:</h1><br><br>' + v157;
        const v159 = e.message;
        const v160 = v158 || v159;
        const v161 = JSON.stringify(e);
        const v162 = v160 || v161;
        const v163 = response.write(v162);
        v163;
        const v164 = response.end();
        v164;
    }
};
var app = server.createServer(serverHandler);
const cmd_exec = function (cmd, args, cb_stdout, cb_end) {
    const v165 = require('child_process');
    var spawn = v165.spawn;
    var child = spawn(cmd, args);
    var me = this;
    me.exit = 0;
    me.stdout = '';
    const v166 = child.stdout;
    const v168 = function (data) {
        const v167 = cb_stdout(me, data);
        v167;
    };
    const v169 = v166.on('data', v168);
    v169;
    const v170 = child.stdout;
    const v172 = function () {
        const v171 = cb_end(me);
        v171;
    };
    const v173 = v170.on('end', v172);
    v173;
};
const log_console = function () {
    const v174 = foo.stdout;
    const v175 = console.log(v174);
    v175;
    try {
        const v176 = foo.stdout;
        const v177 = v176.split('\nnode    ');
        const v178 = v177[1];
        const v179 = v178.split(' ');
        var pidToBeKilled = v179[0];
        const v180 = console.log('------------------------------');
        v180;
        const v181 = console.log('Please execute below command:');
        v181;
        const v182 = 'kill ' + pidToBeKilled;
        const v183 = console.log('\x1B[31m%s\x1B[0m ', v182);
        v183;
        const v184 = console.log('Then try to run "server.js" again.');
        v184;
        const v185 = console.log('------------------------------');
        v185;
    } catch (e) {
    }
};
const runServer = function () {
    const v207 = function (e) {
        const v186 = e.code;
        const v187 = v186 == 'EADDRINUSE';
        if (v187) {
            const v188 = e.address;
            const v189 = v188 === '0.0.0.0';
            if (v189) {
                e.address = 'localhost';
            }
            const v190 = e.address;
            const v191 = 'http://' + v190;
            const v192 = v191 + ':';
            const v193 = e.port;
            const v194 = v192 + v193;
            var socketURL = v194 + '/';
            const v195 = console.log('------------------------------');
            v195;
            const v196 = e.port;
            const v197 = 'Unable to listen on port: ' + v196;
            const v198 = console.log('\x1B[31m%s\x1B[0m ', v197);
            v198;
            const v199 = socketURL + ' is already in use. Please kill below processes using "kill PID".';
            const v200 = console.log('\x1B[31m%s\x1B[0m ', v199);
            v200;
            const v201 = console.log('------------------------------');
            v201;
            const v202 = [
                '-n',
                '-i4TCP:9001'
            ];
            const v204 = function (me, data) {
                const v203 = data.toString();
                me.stdout += v203;
            };
            const v205 = function (me) {
                me.exit = 1;
            };
            foo = new cmd_exec('lsof', v202, v204, v205);
            const v206 = setTimeout(log_console, 250);
            v206;
        }
    };
    const v208 = app.on('error', v207);
    v208;
    const v209 = process.env;
    const v210 = v209.IP;
    const v211 = v210 || '0.0.0.0';
    const v223 = function (error) {
        var addr = app.address();
        const v212 = addr.address;
        const v213 = v212 === '0.0.0.0';
        if (v213) {
            addr.address = 'localhost';
        }
        const v214 = addr.address;
        const v215 = 'http://' + v214;
        const v216 = v215 + ':';
        const v217 = addr.port;
        const v218 = v216 + v217;
        var domainURL = v218 + '/';
        const v219 = console.log('------------------------------');
        v219;
        const v220 = console.log('socket.io is listening at:');
        v220;
        const v221 = '\t' + domainURL;
        const v222 = console.log('\x1B[31m%s\x1B[0m ', v221);
        v222;
    };
    app = app.listen(port, v211, v223);
    const v224 = require('socket.io');
    var io = v224(app);
    const v229 = function (socket) {
        const v227 = function (buffer) {
            const v225 = socket.broadcast;
            const v226 = v225.emit('buffer-stream', buffer);
            v226;
        };
        const v228 = socket.on('buffer-stream', v227);
        v228;
    };
    const v230 = io.on('connection', v229);
    v230;
};
if (autoRebootServerOnFailure) {
    var cluster = require('cluster');
    const v231 = cluster.isMaster;
    if (v231) {
        const v232 = cluster.fork();
        v232;
        const v234 = function (worker, code, signal) {
            const v233 = cluster.fork();
            v233;
        };
        const v235 = cluster.on('exit', v234);
        v235;
    }
    const v236 = cluster.isWorker;
    if (v236) {
        const v237 = runServer();
        v237;
    }
} else {
    const v238 = runServer();
    v238;
}