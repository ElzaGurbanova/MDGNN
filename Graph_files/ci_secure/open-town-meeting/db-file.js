import dotenv from 'dotenv';
import { execFile } from 'child_process';
import arg from 'arg';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
const v83 = dotenv.config();
v83;
const v84 = process.env;
const v85 = v84.npm_lifecycle_event;
const v86 = !v85;
if (v86) {
    const v87 = console.error('This script should only be run from a package.json script.');
    v87;
    const v88 = process.exit(1);
    v88;
}
const argSpec = {};
argSpec['--location'] = String;
argSpec['--file'] = String;
const args = arg(argSpec);
const v89 = args['--location'];
const inputLocation = v89 || 'local';
const inputFile = args['--file'];
const v90 = process.env;
const DATABASE_NAME = v90.DATABASE_NAME;
const v91 = !DATABASE_NAME;
if (v91) {
    const v92 = console.error('Missing DATABASE_NAME environment variable.');
    v92;
    const v93 = process.exit(1);
    v93;
}
const DB_NAME_RE = /^[A-Za-z0-9_.-]+$/;
const v94 = DB_NAME_RE.test(DATABASE_NAME);
const v95 = !v94;
if (v95) {
    const v96 = console.error('Invalid DATABASE_NAME format.');
    v96;
    const v97 = process.exit(1);
    v97;
}
const v98 = inputLocation !== 'local';
const v99 = inputLocation !== 'remote';
const v100 = v98 && v99;
if (v100) {
    const v101 = console.error('Invalid location. Use "local" or "remote".');
    v101;
    const v102 = process.exit(1);
    v102;
}
const v103 = !inputFile;
const v104 = typeof inputFile;
const v105 = v104 !== 'string';
const v106 = v103 || v105;
if (v106) {
    const v107 = console.error('You must pass --file <path-to-sql-file>.');
    v107;
    const v108 = process.exit(1);
    v108;
}
const v109 = process.cwd();
const resolvedFile = path.resolve(v109, inputFile);
const v110 = fs.existsSync(resolvedFile);
const v111 = !v110;
if (v111) {
    const v112 = `File not found: ${ resolvedFile }`;
    const v113 = console.error(v112);
    v113;
    const v114 = process.exit(1);
    v114;
}
const v115 = path.basename(resolvedFile);
const v116 = v115.startsWith('-');
if (v116) {
    const v117 = console.error('File name must not start with "-".');
    v117;
    const v118 = process.exit(1);
    v118;
}
const v119 = process.env;
const v120 = v119.WRANGLER_BIN;
const WRANGLER_BIN = v120 || 'wrangler';
const v121 = inputLocation === 'remote';
if (v121) {
    const v122 = process.stdin;
    const v123 = process.stdout;
    const v124 = {
        input: v122,
        output: v123
    };
    const rl = readline.createInterface(v124);
    const v131 = answer => {
        const v125 = answer === 'yes';
        if (v125) {
            const v126 = {
                location: inputLocation,
                file: resolvedFile
            };
            const v127 = runCommand(v126);
            v127;
        } else {
            const v128 = console.log('Command not confirmed. Exiting.');
            v128;
            const v129 = process.exit(0);
            v129;
        }
        const v130 = rl.close();
        v130;
    };
    const v132 = rl.question('\u26A0️ WARNING: Are you sure you want to run this command on the remote database? This will affect the production database.\nType "yes" to continue:\n', v131);
    v132;
} else {
    const v133 = inputLocation === 'local';
    if (v133) {
        const v134 = {
            location: inputLocation,
            file: resolvedFile
        };
        const v135 = runCommand(v134);
        v135;
    }
}
const runCommand = function (params) {
    const argv = [
        'd1',
        'execute',
        DATABASE_NAME
    ];
    const v136 = params.location;
    const v137 = v136 !== 'remote';
    if (v137) {
        const v138 = argv.push('--local');
        v138;
    }
    const v139 = params.file;
    const v140 = argv.push('--file', v139);
    v140;
    const v141 = 10 * 1024;
    const v142 = v141 * 1024;
    const v143 = {
        shell: false,
        maxBuffer: v142
    };
    const v163 = (error, stdout, stderr) => {
        if (error) {
            const v144 = error.message;
            const v145 = `error: ${ v144 }`;
            const v146 = console.log(v145);
            v146;
            return;
        }
        if (stderr) {
            const v147 = `stderr: ${ stderr }`;
            const v148 = console.log(v147);
            v148;
        }
        const jsonStart = stdout.indexOf('[');
        const v149 = stdout.lastIndexOf(']');
        const jsonEnd = v149 + 1;
        const v150 = -1;
        const v151 = jsonStart === v150;
        const v152 = jsonEnd <= 0;
        const v153 = v151 || v152;
        if (v153) {
            const v154 = console.log(stdout);
            v154;
            return;
        }
        const jsonString = stdout.slice(jsonStart, jsonEnd);
        try {
            const data = JSON.parse(jsonString);
            const v155 = data[0];
            const v156 = data[0];
            const v157 = v156.results;
            const v158 = v155 && v157;
            const v159 = [];
            const v160 = v158 || v159;
            const v161 = console.table(v160);
            v161;
        } catch (e) {
            const v162 = console.log('Failed to parse JSON output:\n', stdout);
            v162;
        }
    };
    const v164 = execFile(WRANGLER_BIN, argv, v143, v163);
    v164;
};