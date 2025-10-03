let fs = require('fs');
var parseUrl = require('parseurl');
let serveStatic = require('serve-static');
let mime = require('mime-types');
const v85 = require('./util/options');
let sanitizeOptions = v85.sanitizeOptions;
const v86 = require('./util/encoding-selection');
let findEncoding = v86.findEncoding;
module.exports = expressStaticGzipMiddleware;
const expressStaticGzipMiddleware = function (root, options) {
    let opts = sanitizeOptions(options);
    const v87 = opts.serveStatic;
    const v88 = v87 || null;
    let serveStaticMiddleware = serveStatic(root, v88);
    let compressions = [];
    let files = {};
    const v89 = registerCompressionsFromOptions();
    v89;
    const v90 = parseRootDirForCompressedFiles();
    v90;
    return expressStaticGzip;
    const expressStaticGzip = function (req, res, next) {
        const v91 = changeUrlFromDirectoryToIndexFile(req);
        v91;
        const v92 = req.headers;
        let clientsAcceptedEncodings = v92['accept-encoding'];
        let path = '';
        try {
            const v93 = req.path;
            path = decodeURIComponent(v93);
        } catch (e) {
            const v94 = res.status(400);
            const v95 = e.message;
            const v96 = v94.send(v95);
            v96;
            return;
        }
        let fileWithMatchingPath = files[path];
        if (fileWithMatchingPath) {
            const v97 = res.setHeader('Vary', 'Accept-Encoding');
            v97;
            const v98 = fileWithMatchingPath.compressions;
            const v99 = opts.orderPreference;
            let compression = findEncoding(clientsAcceptedEncodings, v98, v99);
            if (compression) {
                const v100 = convertToCompressedRequest(req, res, compression);
                v100;
            }
        }
        const v101 = serveStaticMiddleware(req, res, next);
        v101;
    };
    const registerCompressionsFromOptions = function () {
        const v102 = opts.customCompressions;
        const v103 = opts.customCompressions;
        const v104 = v103.length;
        const v105 = v104 > 0;
        const v106 = v102 && v105;
        if (v106) {
            let customCompression;
            const v107 = opts.customCompressions;
            for (customCompression of v107) {
                const v108 = customCompression.encodingName;
                const v109 = customCompression.fileExtension;
                const v110 = registerCompression(v108, v109);
                v110;
            }
        }
        const v111 = opts.enableBrotli;
        if (v111) {
            const v112 = registerCompression('br', 'br');
            v112;
        }
        const v113 = registerCompression('gzip', 'gz');
        v113;
    };
    const convertToCompressedRequest = function (req, res, compression) {
        const v114 = req.path;
        let type = mime.lookup(v114);
        const v115 = mime.charsets;
        let charset = v115.lookup(type);
        const v116 = req.url;
        const v117 = v116.split('?');
        const v118 = v117.splice(1);
        let search = v118.join('?');
        const v119 = search !== '';
        if (v119) {
            search = '?' + search;
        }
        const v120 = req.path;
        const v121 = compression.fileExtension;
        const v122 = v120 + v121;
        req.url = v122 + search;
        const v123 = compression.encodingName;
        const v124 = res.setHeader('Content-Encoding', v123);
        v124;
        const v125 = '; charset=' + charset;
        let v126;
        if (charset) {
            v126 = v125;
        } else {
            v126 = '';
        }
        const v127 = type + v126;
        const v128 = res.setHeader('Content-Type', v127);
        v128;
    };
    const changeUrlFromDirectoryToIndexFile = function (req) {
        const v129 = req.url;
        const parts = v129.split('?');
        const v130 = opts.index;
        const v131 = parts[0];
        const v132 = v131.endsWith('/');
        const v133 = v130 && v132;
        const v134 = parseUrl.original(req);
        const v135 = v134.pathname;
        const v136 = v135.endsWith('/');
        const v137 = v133 && v136;
        if (v137) {
            const v138 = opts.index;
            parts[0] += v138;
            const v139 = parts.length;
            const v140 = v139 > 1;
            const v141 = parts.join('?');
            const v142 = parts[0];
            let v143;
            if (v140) {
                v143 = v141;
            } else {
                v143 = v142;
            }
            req.url = v143;
        }
    };
    const parseRootDirForCompressedFiles = function () {
        const v144 = compressions.length;
        const v145 = v144 > 0;
        if (v145) {
            const v146 = findCompressedFilesInDirectory(root);
            v146;
        }
    };
    const findCompressedFilesInDirectory = function (directoryPath) {
        const v147 = fs.existsSync(directoryPath);
        const v148 = !v147;
        if (v148) {
            return;
        }
        let filesInDirectory = fs.readdirSync(directoryPath);
        let file;
        for (file of filesInDirectory) {
            const v149 = directoryPath + '/';
            let filePath = v149 + file;
            let stats = fs.statSync(filePath);
            const v150 = stats.isDirectory();
            if (v150) {
                const v151 = findCompressedFilesInDirectory(filePath);
                v151;
            } else {
                const v152 = addMatchingCompressionsToFile(file, filePath);
                v152;
            }
        }
    };
    const addMatchingCompressionsToFile = function (fileName, fullFilePath) {
        let compression;
        for (compression of compressions) {
            const v153 = compression.fileExtension;
            const v154 = fileName.endsWith(v153);
            if (v154) {
                const v155 = addCompressionToFile(fullFilePath, compression);
                v155;
                return;
            }
        }
    };
    const addCompressionToFile = function (filePath, compression) {
        const v156 = filePath.replace(root, '');
        const v157 = compression.fileExtension;
        let srcFilePath = v156.replace(v157, '');
        let existingFile = files[srcFilePath];
        const v158 = !existingFile;
        if (v158) {
            const v159 = [compression];
            const v160 = {};
            v160.compressions = v159;
            files[srcFilePath] = v160;
        } else {
            const v161 = existingFile.compressions;
            const v162 = v161.push(compression);
            v162;
        }
    };
    const registerCompression = function (encodingName, fileExtension) {
        const v163 = findCompressionByName(encodingName);
        const v164 = !v163;
        if (v164) {
            const v165 = new Compression(encodingName, fileExtension);
            const v166 = compressions.push(v165);
            v166;
        }
    };
    const Compression = function (encodingName, fileExtension) {
        this.encodingName = encodingName;
        this.fileExtension = '.' + fileExtension;
    };
    const findCompressionByName = function (encodingName) {
        let compression;
        for (compression of compressions) {
            const v167 = compression.encodingName;
            const v168 = v167 === encodingName;
            if (v168) {
                return compression;
            }
        }
        return null;
    };
};