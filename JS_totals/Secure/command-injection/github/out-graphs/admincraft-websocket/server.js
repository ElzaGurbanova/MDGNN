const fs = require('fs');
const https = require('https');
const http = require('http');
const WebSocket = require('ws');
const v147 = require('child_process');
const spawn = v147.spawn;
const execFile = v147.execFile;
const jwt = require('jsonwebtoken');
const path = require('path');
const v148 = process.env;
const SECRET_KEY = v148.SECRET_KEY;
const v149 = process.env;
const v150 = v149.USE_SSL;
const USE_SSL = v150 === 'true';
const PORT = 8080;
const CERT_PATH = './certs/server.crt';
const KEY_PATH = './certs/server.key';
const MAX_MESSAGES_PER_SECOND = 5;
const v151 = process.env;
const v152 = v151.MC_NAME;
const MC_NAME = v152 || 'minecraft';
const v153 = process.env;
const v154 = v153.DOCKER_BIN;
const DOCKER_BIN = v154 || 'docker';
const v155 = !SECRET_KEY;
if (v155) {
    const v156 = new Error('SECRET_KEY is not defined in docker-compose.yml');
    throw v156;
}
const DOCKER_NAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/;
const v157 = DOCKER_NAME_RE.test(MC_NAME);
const v158 = !v157;
if (v158) {
    const v159 = new Error('Invalid MC_NAME format');
    throw v159;
}
const CERT_ABS = path.join(__dirname, CERT_PATH);
const KEY_ABS = path.join(__dirname, KEY_PATH);
const handleRequest = function (req, res) {
    const v160 = req.method;
    const v161 = v160 === 'GET';
    const v162 = req.url;
    const v163 = v162 === '/getcert';
    const v164 = v161 && v163;
    if (v164) {
        const v165 = {
            'Content-Type': 'application/x-x509-ca-cert',
            'Content-Disposition': 'attachment; filename="server.crt"'
        };
        const v166 = res.writeHead(200, v165);
        v166;
        const v167 = fs.createReadStream(CERT_ABS);
        const v168 = v167.pipe(res);
        v168;
    } else {
        const v169 = res.writeHead(404);
        v169;
        const v170 = res.end('Not Found');
        v170;
    }
};
const authenticate = function (token) {
    try {
        const v171 = jwt.verify(token, SECRET_KEY);
        return v171;
    } catch (e) {
        const v172 = e.message;
        const v173 = console.error('Authentication error:', v172);
        v173;
        return null;
    }
};
const broadcastStdout = function (text) {
    const v174 = wss.clients;
    const v179 = client => {
        const v175 = client.readyState;
        const v176 = WebSocket.OPEN;
        const v177 = v175 === v176;
        if (v177) {
            const v178 = client.send(text);
            v178;
        }
    };
    const v180 = v174.forEach(v179);
    v180;
};
const runDocker = function (args, cb) {
    const v181 = { shell: false };
    const ps = spawn(DOCKER_BIN, args, v181);
    let stdout = '';
    let stderr = '';
    const v182 = ps.stdout;
    const v183 = d => {
        stdout += d.toString();
    };
    const v184 = v182.on('data', v183);
    v184;
    const v185 = ps.stderr;
    const v186 = d => {
        stderr += d.toString();
    };
    const v187 = v185.on('data', v186);
    v187;
    const v200 = code => {
        const v188 = code !== 0;
        if (v188) {
            const v189 = args.join(' ');
            const v190 = `docker ${ v189 } exited with code ${ code }`;
            const v191 = console.error(v190);
            v191;
            if (stderr) {
                const v192 = `Command error: ${ stderr }`;
                const v193 = console.error(v192);
                v193;
            }
        } else {
            if (stdout) {
                const v194 = `Command output: ${ stdout }`;
                const v195 = console.log(v194);
                v195;
                const v196 = broadcastStdout(stdout);
                v196;
            }
        }
        const v197 = typeof cb;
        const v198 = v197 === 'function';
        if (v198) {
            const v199 = cb(code, stdout, stderr);
            v199;
        }
    };
    const v201 = ps.on('close', v200);
    v201;
    const v208 = err => {
        const v202 = err.message;
        const v203 = console.error('Failed to start docker:', v202);
        v203;
        const v204 = typeof cb;
        const v205 = v204 === 'function';
        if (v205) {
            const v206 = err.message;
            const v207 = cb(1, '', v206);
            v207;
        }
    };
    const v209 = ps.on('error', v208);
    v209;
    return ps;
};
const restartServer = function () {
    const v210 = console.log('Restarting the Minecraft server...');
    v210;
    const v211 = [
        'restart',
        MC_NAME
    ];
    const v212 = runDocker(v211);
    v212;
};
const validateMessage = function (message) {
    const v213 = typeof message;
    const v214 = v213 !== 'string';
    const v215 = message.length;
    const v216 = v215 === 0;
    const v217 = v214 || v216;
    const v218 = message.length;
    const v219 = v218 > 500;
    const v220 = v217 || v219;
    if (v220) {
        return false;
    }
    const v221 = message.startsWith('-');
    if (v221) {
        return false;
    }
    const v222 = /^[a-zA-Z0-9_\- ]+$/.test(message);
    return v222;
};
let server;
let useSSL = USE_SSL;
if (useSSL) {
    try {
        const v223 = fs.constants;
        const v224 = v223.F_OK;
        const v225 = fs.accessSync(CERT_ABS, v224);
        v225;
        const v226 = fs.constants;
        const v227 = v226.F_OK;
        const v228 = fs.accessSync(KEY_ABS, v227);
        v228;
    } catch (err) {
        const v229 = console.warn('=================================================================');
        v229;
        const v230 = console.warn('WARNING: SSL certificates not found. Starting server without SSL.');
        v230;
        const v231 = console.warn('=================================================================');
        v231;
        useSSL = false;
    }
}
if (useSSL) {
    const v232 = fs.readFileSync(CERT_ABS);
    const v233 = fs.readFileSync(KEY_ABS);
    const v234 = {
        cert: v232,
        key: v233
    };
    server = https.createServer(v234, handleRequest);
} else {
    server = http.createServer();
}
const v235 = { server };
const wss = new WebSocket.Server(v235);
const v239 = () => {
    let v236;
    if (useSSL) {
        v236 = ' with SSL enabled';
    } else {
        v236 = ' with SSL disabled';
    }
    const v237 = `WebSocket server is listening on port ${ PORT }${ v236 }`;
    const v238 = console.log(v237);
    v238;
};
const v240 = server.listen(PORT, v239);
v240;
const v291 = (ws, request) => {
    const v241 = console.log('New client connected');
    v241;
    const v242 = request.url;
    let v243;
    if (useSSL) {
        v243 = 'wss';
    } else {
        v243 = 'ws';
    }
    const v244 = request.headers;
    const v245 = v244.host;
    const url = new URL(v242, `${ v243 }://${ v245 }`);
    const v246 = url.searchParams;
    const token = v246.get('token');
    const user = authenticate(token);
    const v247 = !user;
    if (v247) {
        const v248 = ws.close(4001, 'Authentication failed');
        v248;
        return;
    }
    const v249 = [
        'logs',
        '-f',
        MC_NAME
    ];
    const v250 = { shell: false };
    const logProcess = spawn(DOCKER_BIN, v249, v250);
    const v251 = logProcess.stdout;
    const v254 = data => {
        const v252 = data.toString();
        const v253 = ws.send(v252);
        v253;
    };
    const v255 = v251.on('data', v254);
    v255;
    const v256 = logProcess.stderr;
    const v258 = () => {
        const v257 = ws.send('Error occurred.');
        v257;
    };
    const v259 = v256.on('data', v258);
    v259;
    const v262 = code => {
        const v260 = `logProcess exited with code ${ code }`;
        const v261 = console.log(v260);
        v261;
    };
    const v263 = logProcess.on('close', v262);
    v263;
    let messageCount = 0;
    let startTime = Date.now();
    const v278 = message => {
        const msgString = message.toString();
        const currentTime = Date.now();
        const v264 = currentTime - startTime;
        const v265 = v264 > 1000;
        if (v265) {
            messageCount = 0;
            startTime = currentTime;
        }
        const v266 = messageCount >= MAX_MESSAGES_PER_SECOND;
        if (v266) {
            const v267 = ws.send('Rate limit exceeded. Please slow down.');
            v267;
            return;
        }
        const v268 = messageCount++;
        v268;
        const v269 = `Received message: ${ msgString }`;
        const v270 = console.log(v269);
        v270;
        const v271 = validateMessage(msgString);
        const v272 = !v271;
        if (v272) {
            const v273 = ws.send('Invalid input.');
            v273;
            return;
        }
        const v274 = msgString === 'admincraft restart-server';
        if (v274) {
            const v275 = restartServer();
            v275;
        } else {
            const v276 = [
                'exec',
                MC_NAME,
                'send-command',
                msgString
            ];
            const v277 = runDocker(v276);
            v277;
        }
    };
    const v279 = ws.on('message', v278);
    v279;
    const v282 = () => {
        const v280 = console.log('Client disconnected');
        v280;
        const v281 = logProcess.kill();
        v281;
    };
    const v283 = ws.on('close', v282);
    v283;
    const v286 = error => {
        const v284 = error.message;
        const v285 = console.error('WebSocket error:', v284);
        v285;
    };
    const v287 = ws.on('error', v286);
    v287;
    const v288 = user.userId;
    const v289 = `${ v288 } connected`;
    const v290 = ws.send(v289);
    v290;
};
const v292 = wss.on('connection', v291);
v292;