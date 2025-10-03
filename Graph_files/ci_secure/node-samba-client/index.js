'use strict';
const execa = require('execa');
const p = require('path');
const singleSlash = /\//g;
const missingFileRegex = /(NT_STATUS_OBJECT_NAME_NOT_FOUND|NT_STATUS_NO_SUCH_FILE)/im;
const getCleanedSmbClientArgs = args => {
    const v93 = arg => {
        const v91 = arg.replace(singleSlash, '\\');
        const v92 = `"${ v91 }"`;
        return v92;
    };
    const v94 = args.map(v93);
    const v95 = v94.join(' ');
    return v95;
};
const SambaClient = function SambaClient(options) {
    const v96 = options.address;
    this.address = v96;
    const v97 = options.username;
    this.username = v97 || 'guest';
    const v98 = options.password;
    this.password = v98;
    const v99 = options.domain;
    this.domain = v99;
    const v100 = options.port;
    this.port = v100;
    const v101 = options.maxProtocol;
    this.maxProtocol = v101;
    const v102 = options.maskCmd;
    const v103 = Boolean(v102);
    this.maskCmd = v103;
};
const getFile = async function getFile(path, destination, workingDir) {
    const v104 = [
        path,
        destination
    ];
    return await this.execute('get', v104, workingDir);
};
SambaClient.getFile = getFile;
const sendFile = async function sendFile(path, destination) {
    const workingDir = p.dirname(path);
    const v105 = p.basename(path);
    const v106 = [
        v105,
        destination
    ];
    return await this.execute('put', v106, workingDir);
};
SambaClient.sendFile = sendFile;
const deleteFile = async function deleteFile(fileName) {
    const v107 = [fileName];
    return await this.execute('del', v107, '');
};
SambaClient.deleteFile = deleteFile;
const listFiles = async function listFiles(fileNamePrefix, fileNameSuffix) {
    try {
        const cmdArgs = `${ fileNamePrefix }*${ fileNameSuffix }`;
        const allOutput = await this.execute('dir', cmdArgs, '');
        const fileList = [];
        let line;
        const v108 = allOutput.split('\n');
        for (line of v108) {
            const v109 = line.toString();
            line = v109.trim();
            const v110 = line.startsWith(fileNamePrefix);
            if (v110) {
                const v111 = line.indexOf(fileNameSuffix);
                const v112 = fileNameSuffix.length;
                const v113 = v111 + v112;
                const parsed = line.substring(0, v113);
                const v114 = fileList.push(parsed);
                v114;
            }
        }
        return fileList;
    } catch (e) {
        const v115 = e.message;
        const v116 = v115.match(missingFileRegex);
        if (v116) {
            const v117 = [];
            return v117;
        } else {
            throw e;
        }
    }
};
SambaClient.listFiles = listFiles;
const mkdir = async function mkdir(remotePath, cwd) {
    const v118 = [remotePath];
    const v119 = cwd || __dirname;
    return await this.execute('mkdir', v118, v119);
};
SambaClient.mkdir = mkdir;
const dir = async function dir(remotePath, cwd) {
    const v120 = [remotePath];
    const v121 = cwd || __dirname;
    return await this.execute('dir', v120, v121);
};
SambaClient.dir = dir;
const fileExists = async function fileExists(remotePath, cwd) {
    try {
        await this.dir(remotePath, cwd);
        return true;
    } catch (e) {
        const v122 = e.message;
        const v123 = v122.match(missingFileRegex);
        if (v123) {
            return false;
        } else {
            throw e;
        }
    }
};
SambaClient.fileExists = fileExists;
const cwd = async function cwd() {
    const cd = await this.execute('cd', '', '');
    const v124 = cd.match(/\s.{2}\s(.+?)/);
    const v125 = v124[1];
    return v125;
};
SambaClient.cwd = cwd;
const list = async function list(remotePath) {
    const remoteDirList = [];
    const remoteDirContents = await this.dir(remotePath);
    let content;
    const v126 = remoteDirContents.matchAll(/\s*(.+?)\s{6,}(.)\s+([0-9]+)\s{2}(.+)/g);
    for (content of v126) {
        const v127 = content[1];
        const v128 = content[2];
        const v129 = content[3];
        const v130 = parseInt(v129);
        const v131 = content[4];
        const v132 = v131 + 'Z';
        const v133 = new Date(v132);
        const v134 = {
            name: v127,
            type: v128,
            size: v130,
            modifyTime: v133
        };
        const v135 = remoteDirList.push(v134);
        v135;
    }
    return remoteDirList;
};
SambaClient.list = list;
const getSmbClientArgs = function getSmbClientArgs(smbCommand, smbCommandArgs) {
    const args = [];
    const v136 = this.username;
    if (v136) {
        const v137 = this.username;
        const v138 = args.push('-U', v137);
        v138;
    }
    const v139 = this.password;
    const v140 = !v139;
    if (v140) {
        const v141 = args.push('-N');
        v141;
    }
    let cleanedSmbArgs = smbCommandArgs;
    const v142 = Array.isArray(smbCommandArgs);
    if (v142) {
        cleanedSmbArgs = getCleanedSmbClientArgs(smbCommandArgs);
    }
    const v143 = `${ smbCommand } ${ cleanedSmbArgs }`;
    const v144 = this.address;
    const v145 = args.push('-c', v143, v144);
    v145;
    const v146 = this.password;
    if (v146) {
        const v147 = this.password;
        const v148 = args.push(v147);
        v148;
    }
    const v149 = this.domain;
    if (v149) {
        const v150 = args.push('-W');
        v150;
        const v151 = this.domain;
        const v152 = args.push(v151);
        v152;
    }
    const v153 = this.maxProtocol;
    if (v153) {
        const v154 = this.maxProtocol;
        const v155 = args.push('--max-protocol', v154);
        v155;
    }
    const v156 = this.port;
    if (v156) {
        const v157 = args.push('-p');
        v157;
        const v158 = this.port;
        const v159 = args.push(v158);
        v159;
    }
    return args;
};
SambaClient.getSmbClientArgs = getSmbClientArgs;
const execute = async function execute(smbCommand, smbCommandArgs, workingDir) {
    const args = this.getSmbClientArgs(smbCommand, smbCommandArgs);
    const v160 = workingDir || '';
    const options = {};
    options.all = true;
    options.cwd = v160;
    try {
        const v161 = await execa('smbclient', args, options);
        const all = v161.all;
        return all;
    } catch (error) {
        const v162 = this.maskCmd;
        if (v162) {
            const v163 = error.all;
            error.message = v163;
            const v164 = error.all;
            error.shortMessage = v164;
        }
        throw error;
    }
};
SambaClient.execute = execute;
const getAllShares = async function getAllShares() {
    try {
        const v166 = [
            '-U',
            'guest',
            '-N'
        ];
        const v167 = { all: true };
        const v165 = await execa('smbtree', v166, v167);
        const stdout = v165.stdout;
        const shares = [];
        let line;
        const v168 = stdout.split(/\r?\n/);
        for (line in v168) {
            const words = line.split(/\t/);
            const v169 = words.length;
            const v170 = v169 > 2;
            const v171 = words[2];
            const v172 = v171.match(/^\s*$/);
            const v173 = v172 !== null;
            const v174 = v170 && v173;
            if (v174) {
                const v175 = words[2];
                const v176 = v175.trim();
                const v177 = shares.append(v176);
                v177;
            }
        }
        return shares;
    } catch (error) {
        const v178 = this.maskCmd;
        if (v178) {
            const v179 = error.all;
            error.message = v179;
            const v180 = error.all;
            error.shortMessage = v180;
        }
        throw error;
    }
};
SambaClient.getAllShares = getAllShares;
SambaClient['is_class'] = true;
module.exports = SambaClient;