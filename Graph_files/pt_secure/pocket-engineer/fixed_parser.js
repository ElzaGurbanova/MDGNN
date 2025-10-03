const path = require('path');
const v74 = require('../../utils/logger');
const createLogger = v74.createLogger;
const logger = createLogger('CodeParser');
const parseCodeFromChat = chat => {
    const v75 = !chat;
    const v76 = typeof chat;
    const v77 = v76 !== 'string';
    const v78 = v75 || v77;
    if (v78) {
        const v79 = new Error('Invalid chat content provided to parser');
        throw v79;
    }
    const v80 = logger.debug('Starting to parse chat for code files');
    v80;
    const regex = /(\S+)\n\s*```\s*[^\n]*\n([\s\S]+?)```/g;
    const v81 = chat.matchAll(regex);
    const matches = [...v81];
    const files = [];
    let match;
    for (match of matches) {
        let filePath = match[1];
        const v82 = filePath.replace(/[\:<>"|?*]/g, '');
        const v83 = v82.replace(/^\[(.*)\]$/, '$1');
        const v84 = v83.replace(/^`(.*)`$/, '$1');
        filePath = v84.replace(/[\]\:]$/, '');
        const code = match[2];
        const v85 = [
            filePath,
            code
        ];
        const v86 = files.push(v85);
        v86;
        const v87 = code.length;
        const v88 = `Parsed file: ${ filePath } (${ v87 } bytes)`;
        const v89 = logger.debug(v88);
        v89;
    }
    const v90 = chat.split('```');
    const v91 = v90[0];
    const readme = v91.trim();
    if (readme) {
        const v92 = [
            'README.md',
            readme
        ];
        const v93 = files.push(v92);
        v93;
        const v94 = logger.debug('Added README.md');
        v94;
    }
    const v95 = files.length;
    const v96 = `Parsed ${ v95 } files from chat`;
    const v97 = logger.info(v96);
    v97;
    return files;
};
const validateFilePath = filePath => {
    const v98 = !filePath;
    const v99 = typeof filePath;
    const v100 = v99 !== 'string';
    const v101 = v98 || v100;
    if (v101) {
        const v102 = new Error('Invalid file path');
        throw v102;
    }
    const v103 = filePath.replace(/\0/g, '');
    let p = v103.trim();
    const v104 = !p;
    if (v104) {
        const v105 = new Error('Invalid file path');
        throw v105;
    }
    p = p.replace(/\\/g, '/');
    const v106 = p.startsWith('/');
    if (v106) {
        const v107 = new Error('Absolute paths are not allowed');
        throw v107;
    }
    const v108 = /^[A-Za-z]:\//.test(p);
    if (v108) {
        const v109 = new Error('Drive-letter paths are not allowed');
        throw v109;
    }
    const v110 = /^\/\/[^/]/.test(p);
    if (v110) {
        const v111 = new Error('UNC paths are not allowed');
        throw v111;
    }
    const v112 = path.posix;
    const norm = v112.normalize(p);
    const v113 = !norm;
    const v114 = norm === '.';
    const v115 = v113 || v114;
    const v116 = norm === './';
    const v117 = v115 || v116;
    if (v117) {
        const v118 = new Error('Invalid file path');
        throw v118;
    }
    const segs = norm.split('/');
    const v124 = seg => {
        const v119 = seg === '';
        const v120 = seg === '.';
        const v121 = v119 || v120;
        const v122 = seg === '..';
        const v123 = v121 || v122;
        return v123;
    };
    const v125 = segs.some(v124);
    if (v125) {
        const v126 = new Error('Path traversal detected in file path');
        throw v126;
    }
    const v127 = /[<>:"|?*\x00-\x1F]/.test(norm);
    if (v127) {
        const v128 = new Error('Invalid characters in file path');
        throw v128;
    }
    const v129 = norm.length;
    const v130 = v129 > 300;
    if (v130) {
        const v131 = new Error('Path too long');
        throw v131;
    }
    return norm;
};
const extractFilesFromChat = async (chat, workspace) => {
    try {
        await workspace.set('all_output.txt', chat);
        const files = parseCodeFromChat(chat);
        const v132 = files.length;
        const v133 = `Extracting ${ v132 } files to workspace`;
        const v134 = logger.info(v133);
        v134;
        const writtenFiles = [];
        let [filePath, content];
        for ([filePath, content] of files) {
            try {
                const validatedPath = validateFilePath(filePath);
                const v135 = `Writing file: ${ validatedPath }`;
                const v136 = logger.debug(v135);
                v136;
                await workspace.set(validatedPath, content);
                const v137 = writtenFiles.push(validatedPath);
                v137;
            } catch (error) {
                const v138 = `Failed to write file ${ filePath }:`;
                const v139 = logger.error(v138, error);
                v139;
            }
        }
        const v140 = writtenFiles.length;
        const v141 = `Successfully wrote ${ v140 } files to workspace`;
        const v142 = logger.info(v141);
        v142;
        return writtenFiles;
    } catch (error) {
        const v143 = logger.error('Failed to extract files from chat:', error);
        v143;
        const v144 = error.message;
        const v145 = new Error(`File extraction failed: ${ v144 }`);
        throw v145;
    }
};
const v146 = {};
v146.parseCodeFromChat = parseCodeFromChat;
v146.extractFilesFromChat = extractFilesFromChat;
v146.validateFilePath = validateFilePath;
module.exports = v146;