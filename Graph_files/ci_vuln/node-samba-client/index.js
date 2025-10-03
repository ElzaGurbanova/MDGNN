'use strict';
const execa = require('execa');
const util = require('util');
const p = require('path');
const singleSlash = /\//g;
const missingFileRegex = /(NT_STATUS_OBJECT_NAME_NOT_FOUND|NT_STATUS_NO_SUCH_FILE)/im;
const SambaClient = function SambaClient(options) {
    const v93 = options.address;
    this.address = v93;
    const v94 = options.username;
    this.username = v94;
    const v95 = options.password;
    this.password = v95;
    const v96 = options.domain;
    this.domain = v96;
    const v97 = options.port;
    this.port = v97;
    const v98 = options.maxProtocol;
    this.maxProtocol = v98;
    const v99 = options.maskCmd;
    const v100 = Boolean(v99);
    this.maskCmd = v100;
};
const getFile = async function getFile(path, destination, workingDir) {
    const fileName = path.replace(singleSlash, '\\');
    const cmdArgs = util.format('%s %s', fileName, destination);
    return await this.execute('get', cmdArgs, workingDir);
};
SambaClient.getFile = getFile;
const sendFile = async function sendFile(path, destination) {
    const workingDir = p.dirname(path);
    const v101 = p.basename(path);
    const fileName = v101.replace(singleSlash, '\\');
    const v102 = destination.replace(singleSlash, '\\');
    const cmdArgs = util.format('%s %s', fileName, v102);
    return await this.execute('put', cmdArgs, workingDir);
};
SambaClient.sendFile = sendFile;
const deleteFile = async function deleteFile(fileName) {
    return await this.execute('del', fileName, '');
};
SambaClient.deleteFile = deleteFile;
const listFiles = async function listFiles(fileNamePrefix, fileNameSuffix) {
    try {
        const cmdArgs = util.format('%s*%s', fileNamePrefix, fileNameSuffix);
        const allOutput = await this.execute('dir', cmdArgs, '');
        const fileList = [];
        const lines = allOutput.split('\n');
        let i = 0;
        const v103 = lines.length;
        let v104 = i < v103;
        while (v104) {
            const v106 = lines[i];
            const v107 = v106.toString();
            const line = v107.trim();
            const v108 = line.startsWith(fileNamePrefix);
            if (v108) {
                const v109 = line.indexOf(fileNameSuffix);
                const v110 = fileNameSuffix.length;
                const v111 = v109 + v110;
                const parsed = line.substring(0, v111);
                const v112 = fileList.push(parsed);
                v112;
            }
            const v105 = i++;
            v104 = i < v103;
        }
        return fileList;
    } catch (e) {
        const v113 = e.message;
        const v114 = v113.match(missingFileRegex);
        if (v114) {
            const v115 = [];
            return v115;
        } else {
            throw e;
        }
    }
};
SambaClient.listFiles = listFiles;
const mkdir = async function mkdir(remotePath, cwd) {
    const v116 = remotePath.replace(singleSlash, '\\');
    const v117 = '"' + v116;
    const v118 = v117 + '"';
    const v119 = cwd !== null;
    const v120 = cwd !== undefined;
    const v121 = v119 && v120;
    let v122;
    if (v121) {
        v122 = cwd;
    } else {
        v122 = __dirname;
    }
    return await this.execute('mkdir', v118, v122);
};
SambaClient.mkdir = mkdir;
const dir = async function dir(remotePath, cwd) {
    const v123 = remotePath.replace(singleSlash, '\\');
    const v124 = cwd !== null;
    const v125 = cwd !== undefined;
    const v126 = v124 && v125;
    let v127;
    if (v126) {
        v127 = cwd;
    } else {
        v127 = __dirname;
    }
    return await this.execute('dir', v123, v127);
};
SambaClient.dir = dir;
const fileExists = async function fileExists(remotePath, cwd) {
    try {
        await this.dir(remotePath, cwd);
        return true;
    } catch (e) {
        const v128 = e.message;
        const v129 = v128.match(missingFileRegex);
        if (v129) {
            return false;
        } else {
            throw e;
        }
    }
};
SambaClient.fileExists = fileExists;
const cwd = async function cwd() {
    const cd = await this.execute('cd', '', '');
    const v130 = cd.match(/\s.{2}\s(.+?)/);
    const v131 = v130[1];
    return v131;
};
SambaClient.cwd = cwd;
const list = async function list(remotePath) {
    const remoteDirList = [];
    const remoteDirContents = await this.dir(remotePath);
    let content;
    const v132 = remoteDirContents.matchAll(/\s*(.+?)\s{6,}(.)\s+([0-9]+)\s{2}(.+)/g);
    for (content of v132) {
        const v133 = content[1];
        const v134 = content[2];
        const v135 = content[3];
        const v136 = parseInt(v135);
        const v137 = content[4];
        const v138 = v137 + 'Z';
        const v139 = new Date(v138);
        const v140 = {
            name: v133,
            type: v134,
            size: v136,
            modifyTime: v139
        };
        const v141 = remoteDirList.push(v140);
        v141;
    }
    return remoteDirList;
};
SambaClient.list = list;
const getSmbClientArgs = function getSmbClientArgs(fullCmd) {
    const args = [];
    const v142 = this.username;
    if (v142) {
        const v143 = this.username;
        const v144 = args.push('-U', v143);
        v144;
    }
    const v145 = this.password;
    const v146 = !v145;
    if (v146) {
        const v147 = args.push('-N');
        v147;
    }
    const v148 = this.address;
    const v149 = args.push('-c', fullCmd, v148);
    v149;
    const v150 = this.password;
    if (v150) {
        const v151 = this.password;
        const v152 = args.push(v151);
        v152;
    }
    const v153 = this.domain;
    if (v153) {
        const v154 = args.push('-W');
        v154;
        const v155 = this.domain;
        const v156 = args.push(v155);
        v156;
    }
    const v157 = this.maxProtocol;
    if (v157) {
        const v158 = this.maxProtocol;
        const v159 = args.push('--max-protocol', v158);
        v159;
    }
    const v160 = this.port;
    if (v160) {
        const v161 = args.push('-p');
        v161;
        const v162 = this.port;
        const v163 = args.push(v162);
        v163;
    }
    return args;
};
SambaClient.getSmbClientArgs = getSmbClientArgs;
const execute = async function execute(smbCommand, smbCommandArgs, workingDir) {
    const fullSmbCommand = util.format('%s %s', smbCommand, smbCommandArgs);
    const args = this.getSmbClientArgs(fullSmbCommand);
    const v164 = workingDir || '';
    const options = {};
    options.all = true;
    options.cwd = v164;
    try {
        const v165 = await execa('smbclient', args, options);
        const all = v165.all;
        return all;
    } catch (error) {
        const v166 = this.maskCmd;
        if (v166) {
            const v167 = error.all;
            error.message = v167;
            const v168 = error.all;
            error.shortMessage = v168;
        }
        throw error;
    }
};
SambaClient.execute = execute;
const getAllShares = async function getAllShares() {
    try {
        const v170 = [
            '-U',
            'guest',
            '-N'
        ];
        const v171 = { all: true };
        const v169 = await execa('smbtree', v170, v171);
        const stdout = v169.stdout;
        const shares = [];
        let line;
        const v172 = stdout.split(/\r?\n/);
        for (line in v172) {
            const words = line.split(/\t/);
            const v173 = words.length;
            const v174 = v173 > 2;
            const v175 = words[2];
            const v176 = v175.match(/^\s*$/);
            const v177 = v176 !== null;
            const v178 = v174 && v177;
            if (v178) {
                const v179 = words[2];
                const v180 = v179.trim();
                const v181 = shares.append(v180);
                v181;
            }
        }
        return shares;
    } catch (error) {
        const v182 = this.maskCmd;
        if (v182) {
            const v183 = error.all;
            error.message = v183;
            const v184 = error.all;
            error.shortMessage = v184;
        }
        throw error;
    }
};
SambaClient.getAllShares = getAllShares;
SambaClient['is_class'] = true;
module.exports = SambaClient;