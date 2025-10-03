var net = require('net');
const v128 = require('child_process');
var exec = v128.exec;
var chr = String.fromCharCode;
var base64Encode = function (string) {
    const v129 = new Buffer(string);
    const v130 = v129.toString('base64');
    return v130;
};
var Remote = function (config) {
    const v131 = config.ip;
    const v132 = !v131;
    if (v132) {
        const v133 = new Error('TV IP address is required');
        throw v133;
    }
    const v134 = config.host;
    const v135 = {
        ip: '127.0.0.1',
        mac: '00:00:00:00',
        name: 'NodeJS Samsung Remote'
    };
    config.host = v134 || v135;
    const v136 = config.appString;
    config.appString = v136 || 'iphone..iapp.samsung';
    const v137 = config.tvAppString;
    config.tvAppString = v137 || 'iphone.UN60D6000.iapp.samsung';
    const v138 = config.port;
    config.port = v138 || 55000;
    const v139 = config.timeout;
    config.timeout = v139 || 5000;
    var _socketChunkOne = function () {
        const v140 = config.host;
        const v141 = v140.ip;
        var ipEncoded = base64Encode(v141);
        const v142 = config.host;
        const v143 = v142.mac;
        var macEncoded = base64Encode(v143);
        const v144 = chr(100);
        const v145 = chr(0);
        const v146 = v144 + v145;
        const v147 = ipEncoded.length;
        const v148 = chr(v147);
        const v149 = v146 + v148;
        const v150 = chr(0);
        const v151 = v149 + v150;
        const v152 = v151 + ipEncoded;
        const v153 = macEncoded.length;
        const v154 = chr(v153);
        const v155 = v152 + v154;
        const v156 = chr(0);
        const v157 = v155 + v156;
        const v158 = v157 + macEncoded;
        const v159 = config.host;
        const v160 = v159.name;
        const v161 = base64Encode(v160);
        const v162 = v161.length;
        const v163 = chr(v162);
        const v164 = v158 + v163;
        const v165 = chr(0);
        const v166 = v164 + v165;
        const v167 = config.host;
        const v168 = v167.name;
        const v169 = base64Encode(v168);
        var message = v166 + v169;
        const v170 = chr(0);
        const v171 = config.appString;
        const v172 = v171.length;
        const v173 = chr(v172);
        const v174 = v170 + v173;
        const v175 = chr(0);
        const v176 = v174 + v175;
        const v177 = config.appString;
        const v178 = v176 + v177;
        const v179 = message.length;
        const v180 = chr(v179);
        const v181 = v178 + v180;
        const v182 = chr(0);
        const v183 = v181 + v182;
        const v184 = v183 + message;
        return v184;
    };
    var _socketChunkTwo = function (command) {
        const v185 = chr(0);
        const v186 = chr(0);
        const v187 = v185 + v186;
        const v188 = chr(0);
        const v189 = v187 + v188;
        const v190 = base64Encode(command);
        const v191 = v190.length;
        const v192 = chr(v191);
        const v193 = v189 + v192;
        const v194 = chr(0);
        const v195 = v193 + v194;
        const v196 = base64Encode(command);
        var message = v195 + v196;
        const v197 = chr(0);
        const v198 = config.tvAppString;
        const v199 = v198.length;
        const v200 = chr(v199);
        const v201 = v197 + v200;
        const v202 = chr(0);
        const v203 = v201 + v202;
        const v204 = config.tvAppString;
        const v205 = v203 + v204;
        const v206 = message.length;
        const v207 = chr(v206);
        const v208 = v205 + v207;
        const v209 = chr(0);
        const v210 = v208 + v209;
        const v211 = v210 + message;
        return v211;
    };
    const v247 = function (command, done) {
        const v212 = !command;
        if (v212) {
            const v213 = new Error('Missing command');
            throw v213;
        }
        const v214 = config.port;
        const v215 = config.ip;
        var socket = net.connect(v214, v215);
        const v216 = config.timeout;
        const v217 = socket.setTimeout(v216);
        v217;
        const v225 = function () {
            const v218 = _socketChunkOne();
            const v219 = socket.write(v218);
            v219;
            const v220 = _socketChunkTwo(command);
            const v221 = socket.write(v220);
            v221;
            const v222 = socket.end();
            v222;
            const v223 = socket.destroy();
            v223;
            const v224 = done(false);
            v224;
        };
        const v226 = socket.on('connect', v225);
        v226;
        const v233 = function () {
            const v227 = config.ip;
            const v228 = 'Samsung Remote Client: disconnected from ' + v227;
            const v229 = v228 + ':';
            const v230 = config.port;
            const v231 = v229 + v230;
            const v232 = console.log(v231);
            v232;
        };
        const v234 = socket.on('close', v233);
        v234;
        const v242 = function (error) {
            var errorMsg;
            const v235 = error.code;
            const v236 = v235 === 'EHOSTUNREACH';
            const v237 = error.code;
            const v238 = v237 === 'ECONNREFUSED';
            const v239 = v236 || v238;
            if (v239) {
                errorMsg = 'Samsung Remote Client: Device is off or unreachable';
            } else {
                const v240 = error.code;
                errorMsg = 'Samsung Remote Client: ' + v240;
            }
            const v241 = done(errorMsg);
            v241;
        };
        const v243 = socket.on('error', v242);
        v243;
        const v245 = function () {
            const v244 = done('Timeout');
            v244;
        };
        const v246 = socket.on('timeout', v245);
        v246;
    };
    this.send = v247;
    const v254 = function (done) {
        const v248 = config.ip;
        const v249 = 'ping -c 1 ' + v248;
        const v252 = function (error, stdout, stderr) {
            if (error) {
                const v250 = done(1);
                v250;
            } else {
                const v251 = done(0);
                v251;
            }
        };
        const v253 = exec(v249, v252);
        return v253;
    };
    this.isAlive = v254;
    this.config = config;
};
module.exports = Remote;