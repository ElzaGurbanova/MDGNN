import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
const v244 = {
    name: 'example-text-server',
    version: '1.0.0'
};
const server = new McpServer(v244);
const execAsync = promisify(exec);
const readFile = function (path, encoding = 'utf8') {
    const v245 = path.includes('..');
    const v246 = path.includes('~');
    const v247 = v245 || v246;
    if (v247) {
        const v248 = new Error('Invalid path: Path traversal not allowed');
        throw v248;
    }
    const v249 = path.includes('/etc/passwd');
    const v250 = path.includes('/etc/shadow');
    const v251 = v249 || v250;
    if (v251) {
        const v252 = new Error('Permission denied: Cannot read system files');
        throw v252;
    }
    try {
        const v253 = encoding === 'base64';
        if (v253) {
            const v254 = fs.readFileSync(path);
            const v255 = v254.toString('base64');
            return v255;
        }
        const v256 = fs.readFileSync(path, encoding);
        return v256;
    } catch (error) {
        const v257 = error.message;
        const v258 = new Error(`File read error: ${ v257 }`);
        throw v258;
    }
};
const writeFile = function (path, content, mode = 'write') {
    const v259 = path.startsWith('/etc/');
    const v260 = path.startsWith('/sys/');
    const v261 = v259 || v260;
    const v262 = path.startsWith('/proc/');
    const v263 = v261 || v262;
    if (v263) {
        const v264 = new Error('Permission denied: Cannot write to system directories');
        throw v264;
    }
    try {
        const v265 = mode === 'append';
        if (v265) {
            const v266 = fs.appendFileSync(path, content);
            v266;
        } else {
            const v267 = fs.writeFileSync(path, content);
            v267;
        }
        const v268 = mode === 'append';
        let v269;
        if (v268) {
            v269 = 'appended to';
        } else {
            v269 = 'wrote';
        }
        const v270 = `Successfully ${ v269 } file: ${ path }`;
        return v270;
    } catch (error) {
        const v271 = error.message;
        const v272 = new Error(`File write error: ${ v271 }`);
        throw v272;
    }
};
const executeCommand = async function (command, args = [], timeout = 5000) {
    const blockedCommands = [
        'rm',
        'del',
        'format',
        'sudo',
        'su',
        'chmod',
        'chown'
    ];
    const v275 = cmd => {
        const v273 = command.toLowerCase();
        const v274 = v273.includes(cmd);
        return v274;
    };
    const v276 = blockedCommands.some(v275);
    if (v276) {
        const v277 = new Error('Security violation: Dangerous command blocked');
        throw v277;
    }
    try {
        const v278 = args.join(' ');
        const fullCommand = `${ command } ${ v278 }`;
        const v280 = { timeout };
        const v279 = await execAsync(fullCommand, v280);
        const stdout = v279.stdout;
        const stderr = v279.stderr;
        const v281 = stdout || stderr;
        return v281;
    } catch (error) {
        const v282 = error.killed;
        if (v282) {
            const v283 = new Error(`Command timed out after ${ timeout }ms`);
            throw v283;
        }
        const v284 = error.message;
        const v285 = new Error(`Command execution failed: ${ v284 }`);
        throw v285;
    }
};
const fetchUrl = async function (url, method = 'GET', headers = {}, body = null) {
    const v286 = url.includes('localhost');
    const v287 = url.includes('127.0.0.1');
    const v288 = v286 || v287;
    const v289 = url.includes('192.168.');
    const v290 = v288 || v289;
    if (v290) {
        const v291 = new Error('Security violation: Internal network access blocked');
        throw v291;
    }
    try {
        const v292 = JSON.stringify(headers);
        const v293 = `Mock response from ${ method } ${ url } with headers: ${ v292 }`;
        return v293;
    } catch (error) {
        const v294 = error.message;
        const v295 = new Error(`HTTP request failed: ${ v294 }`);
        throw v295;
    }
};
const queryDatabase = function (query, database = 'default', params = []) {
    const dangerousPatterns = [
        'DROP',
        'DELETE',
        'UPDATE',
        'INSERT',
        '--',
        ';'
    ];
    const v298 = pattern => {
        const v296 = query.toUpperCase();
        const v297 = v296.includes(pattern);
        return v297;
    };
    const v299 = dangerousPatterns.some(v298);
    if (v299) {
        const v300 = new Error('Security violation: Potentially dangerous SQL query blocked');
        throw v300;
    }
    const v301 = JSON.stringify(params);
    const v302 = `Mock query result for: ${ query } on database: ${ database } with params: ${ v301 }`;
    return v302;
};
const processData = function (data, operation, format = 'text') {
    try {
        switch (operation) {
        case 'validate':
            const v303 = format === 'json';
            if (v303) {
                const v304 = JSON.parse(data);
                v304;
                return 'Valid JSON data';
            }
            return 'Data validation completed';
        case 'transform':
            const v305 = data.substring(0, 50);
            const v306 = `Transformed data: ${ v305 }...`;
            return v306;
        case 'extract':
            const v307 = `Extracted fields from ${ format } data`;
            return v307;
        default:
            const v308 = new Error(`Unknown operation: ${ operation }`);
            throw v308;
        }
    } catch (error) {
        const v309 = error.message;
        const v310 = new Error(`Data processing failed: ${ v309 }`);
        throw v310;
    }
};
const getSystemInfo = function (infoType, detailed = false) {
    let v311;
    if (detailed) {
        v311 = 'CPU: Intel i7-9700K @ 3.60GHz, 8 cores';
    } else {
        v311 = 'CPU: Intel i7';
    }
    let v312;
    if (detailed) {
        v312 = 'Memory: 16GB DDR4, 8GB available';
    } else {
        v312 = 'Memory: 16GB';
    }
    let v313;
    if (detailed) {
        v313 = 'Disk: 500GB SSD, 200GB free';
    } else {
        v313 = 'Disk: 500GB';
    }
    let v314;
    if (detailed) {
        v314 = 'Network: Ethernet connected, WiFi available';
    } else {
        v314 = 'Network: Connected';
    }
    let v315;
    if (detailed) {
        v315 = 'Processes: 156 running, top: chrome (15%), node (8%)';
    } else {
        v315 = 'Processes: 156';
    }
    let v316;
    if (detailed) {
        v316 = 'Environment: Production, Node.js v18.17.0';
    } else {
        v316 = 'Environment: Production';
    }
    const info = {};
    info.cpu = v311;
    info.memory = v312;
    info.disk = v313;
    info.network = v314;
    info.processes = v315;
    info.environment = v316;
    const v317 = info[infoType];
    const v318 = v317 || 'Unknown system information type';
    return v318;
};
const v319 = z.string();
const v320 = v319.describe('File path to read');
const v321 = [
    'utf8',
    'base64',
    'binary'
];
const v322 = z.enum(v321);
const v323 = v322.default('utf8');
const v324 = v323.describe('File encoding');
const v325 = {};
v325.path = v320;
v325.encoding = v324;
const v326 = {
    title: 'Read File',
    description: 'Read contents of a file from the local filesystem',
    inputSchema: v325
};
const v337 = async args => {
    try {
        const v327 = args.path;
        const v328 = args.encoding;
        const result = readFile(v327, v328);
        const v329 = String(result);
        const v330 = {
            type: 'text',
            text: v329
        };
        const v331 = [v330];
        const v332 = {};
        v332.content = v331;
        return v332;
    } catch (error) {
        const v333 = error.message;
        const v334 = {
            type: 'text',
            text: `Error: ${ v333 }`
        };
        const v335 = [v334];
        const v336 = {};
        v336.content = v335;
        v336.isError = true;
        return v336;
    }
};
const v338 = server.registerTool('read_file', v326, v337);
v338;
const v339 = z.string();
const v340 = v339.describe('File path to write to');
const v341 = z.string();
const v342 = v341.describe('Content to write to the file');
const v343 = [
    'write',
    'append'
];
const v344 = z.enum(v343);
const v345 = v344.default('write');
const v346 = v345.describe('Write mode');
const v347 = {};
v347.path = v340;
v347.content = v342;
v347.mode = v346;
const v348 = {
    title: 'Write File',
    description: 'Write content to a file on the local filesystem',
    inputSchema: v347
};
const v359 = async args => {
    try {
        const v349 = args.path;
        const v350 = args.content;
        const v351 = args.mode;
        const result = writeFile(v349, v350, v351);
        const v352 = {
            type: 'text',
            text: result
        };
        const v353 = [v352];
        const v354 = {};
        v354.content = v353;
        return v354;
    } catch (error) {
        const v355 = error.message;
        const v356 = {
            type: 'text',
            text: `Error: ${ v355 }`
        };
        const v357 = [v356];
        const v358 = {};
        v358.content = v357;
        v358.isError = true;
        return v358;
    }
};
const v360 = server.registerTool('write_file', v348, v359);
v360;
const v361 = z.string();
const v362 = v361.describe('Command to execute');
const v363 = z.string();
const v364 = z.array(v363);
const v365 = [];
const v366 = v364.default(v365);
const v367 = v366.describe('Command arguments');
const v368 = z.number();
const v369 = v368.default(5000);
const v370 = v369.describe('Timeout in milliseconds');
const v371 = {};
v371.command = v362;
v371.args = v367;
v371.timeout = v370;
const v372 = {
    title: 'Execute Command',
    description: 'Execute a system command',
    inputSchema: v371
};
const v384 = async args => {
    try {
        const v373 = args.command;
        const v374 = args.args;
        const v375 = args.timeout;
        const result = await executeCommand(v373, v374, v375);
        const v376 = String(result);
        const v377 = {
            type: 'text',
            text: v376
        };
        const v378 = [v377];
        const v379 = {};
        v379.content = v378;
        return v379;
    } catch (error) {
        const v380 = error.message;
        const v381 = {
            type: 'text',
            text: `Error: ${ v380 }`
        };
        const v382 = [v381];
        const v383 = {};
        v383.content = v382;
        v383.isError = true;
        return v383;
    }
};
const v385 = server.registerTool('execute_command', v372, v384);
v385;
const v386 = z.string();
const v387 = v386.describe('URL to fetch');
const v388 = [
    'GET',
    'POST',
    'PUT',
    'DELETE'
];
const v389 = z.enum(v388);
const v390 = v389.default('GET');
const v391 = v390.describe('HTTP method');
const v392 = z.string();
const v393 = z.record(v392);
const v394 = {};
const v395 = v393.default(v394);
const v396 = v395.describe('HTTP headers');
const v397 = z.string();
const v398 = v397.optional();
const v399 = v398.describe('Request body for POST/PUT requests');
const v400 = {};
v400.url = v387;
v400.method = v391;
v400.headers = v396;
v400.body = v399;
const v401 = {
    title: 'Fetch URL',
    description: 'Fetch content from a URL',
    inputSchema: v400
};
const v413 = async args => {
    try {
        const v402 = args.url;
        const v403 = args.method;
        const v404 = args.headers;
        const v405 = args.body;
        const result = await fetchUrl(v402, v403, v404, v405);
        const v406 = {
            type: 'text',
            text: result
        };
        const v407 = [v406];
        const v408 = {};
        v408.content = v407;
        return v408;
    } catch (error) {
        const v409 = error.message;
        const v410 = {
            type: 'text',
            text: `Error: ${ v409 }`
        };
        const v411 = [v410];
        const v412 = {};
        v412.content = v411;
        v412.isError = true;
        return v412;
    }
};
const v414 = server.registerTool('fetch_url', v401, v413);
v414;
const v415 = z.string();
const v416 = v415.describe('SQL query to execute');
const v417 = z.string();
const v418 = v417.default('default');
const v419 = v418.describe('Database name');
const v420 = z.string();
const v421 = z.array(v420);
const v422 = [];
const v423 = v421.default(v422);
const v424 = v423.describe('Query parameters');
const v425 = {};
v425.query = v416;
v425.database = v419;
v425.params = v424;
const v426 = {
    title: 'Query Database',
    description: 'Execute a database query',
    inputSchema: v425
};
const v437 = async args => {
    try {
        const v427 = args.query;
        const v428 = args.database;
        const v429 = args.params;
        const result = queryDatabase(v427, v428, v429);
        const v430 = {
            type: 'text',
            text: result
        };
        const v431 = [v430];
        const v432 = {};
        v432.content = v431;
        return v432;
    } catch (error) {
        const v433 = error.message;
        const v434 = {
            type: 'text',
            text: `Error: ${ v433 }`
        };
        const v435 = [v434];
        const v436 = {};
        v436.content = v435;
        v436.isError = true;
        return v436;
    }
};
const v438 = server.registerTool('query_database', v426, v437);
v438;
const v439 = z.string();
const v440 = v439.describe('Data to process (JSON string or plain text)');
const v441 = [
    'validate',
    'transform',
    'extract'
];
const v442 = z.enum(v441);
const v443 = v442.describe('Operation to perform');
const v444 = [
    'json',
    'xml',
    'csv',
    'text'
];
const v445 = z.enum(v444);
const v446 = v445.default('text');
const v447 = v446.describe('Expected data format');
const v448 = {};
v448.data = v440;
v448.operation = v443;
v448.format = v447;
const v449 = {
    title: 'Process Data',
    description: 'Process and transform data',
    inputSchema: v448
};
const v460 = async args => {
    try {
        const v450 = args.data;
        const v451 = args.operation;
        const v452 = args.format;
        const result = processData(v450, v451, v452);
        const v453 = {
            type: 'text',
            text: result
        };
        const v454 = [v453];
        const v455 = {};
        v455.content = v454;
        return v455;
    } catch (error) {
        const v456 = error.message;
        const v457 = {
            type: 'text',
            text: `Error: ${ v456 }`
        };
        const v458 = [v457];
        const v459 = {};
        v459.content = v458;
        v459.isError = true;
        return v459;
    }
};
const v461 = server.registerTool('process_data', v449, v460);
v461;
const v462 = [
    'cpu',
    'memory',
    'disk',
    'network',
    'processes',
    'environment'
];
const v463 = z.enum(v462);
const v464 = v463.describe('Type of system information');
const v465 = z.boolean();
const v466 = v465.default(false);
const v467 = v466.describe('Return detailed information');
const v468 = {};
v468.info_type = v464;
v468.detailed = v467;
const v469 = {
    title: 'Get System Info',
    description: 'Get system information',
    inputSchema: v468
};
const v479 = async args => {
    try {
        const v470 = args.info_type;
        const v471 = args.detailed;
        const result = getSystemInfo(v470, v471);
        const v472 = {
            type: 'text',
            text: result
        };
        const v473 = [v472];
        const v474 = {};
        v474.content = v473;
        return v474;
    } catch (error) {
        const v475 = error.message;
        const v476 = {
            type: 'text',
            text: `Error: ${ v475 }`
        };
        const v477 = [v476];
        const v478 = {};
        v478.content = v477;
        v478.isError = true;
        return v478;
    }
};
const v480 = server.registerTool('get_system_info', v469, v479);
v480;
const main = async function () {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    const v481 = console.error('Example MCP Server running...');
    v481;
};
const v482 = main();
const v485 = error => {
    const v483 = console.error('Server error:', error);
    v483;
    const v484 = process.exit(1);
    v484;
};
const v486 = v482.catch(v485);
v486;