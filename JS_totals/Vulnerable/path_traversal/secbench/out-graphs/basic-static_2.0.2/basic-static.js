'use strict';
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const url = require('url');
const mime = require('mime');
const statFile = function (filePath, callback) {
    const v13 = function (err, stats) {
        const v1 = err.code;
        const v2 = v1 === 'ENOENT';
        const v3 = err.code;
        const v4 = v3 === 'ENOTDIR';
        const v5 = v2 || v4;
        const v6 = err && v5;
        if (v6) {
            const error = new Error('Resource does not exist');
            error.httpCode = 404;
            const v7 = callback(error);
            v7;
        } else {
            const v8 = stats.isFile();
            const v9 = !v8;
            if (v9) {
                const error = new Error('Resource is not a file');
                error.httpCode = 400;
                const v10 = callback(error);
                v10;
            } else {
                if (err) {
                    const error = new Error('Server error');
                    error.httpCode = 500;
                    const v11 = callback(error);
                    v11;
                } else {
                    const v12 = callback(null, stats);
                    v12;
                }
            }
        }
    };
    const v14 = fs.stat(filePath, v13);
    v14;
};
const checkCompress = function (basePath, callback) {
    const gPath = `${ basePath }.gz`;
    const v20 = function (err, stats) {
        const v15 = stats.isFile();
        const v16 = !v15;
        const v17 = err || v16;
        if (v17) {
            const v18 = callback(null, basePath);
            return v18;
        }
        const v19 = callback(null, gPath);
        v19;
    };
    const v21 = fs.stat(gPath, v20);
    v21;
};
const createServerEtag = function (inode, mTime) {
    const v22 = inode.toString();
    const v23 = mTime.getTime();
    const v24 = v23.toString();
    const str = v22 + v24;
    const v25 = crypto.createHash('md5');
    const v26 = v25.update(str);
    const v27 = v26.digest('hex');
    return v27;
};
const should304 = function (req, stats) {
    const v28 = req.headers;
    const clientEtag = v28['if-none-match'];
    const v29 = !clientEtag;
    if (v29) {
        return false;
    }
    const v30 = stats.ino;
    const v31 = stats.mtime;
    const serverEtag = createServerEtag(v30, v31);
    const v32 = serverEtag !== clientEtag;
    if (v32) {
        return false;
    }
    return true;
};
const serveFile = function (req, res, stats, filePath, cache) {
    const stream = fs.createReadStream(filePath);
    const v37 = function (err) {
        const error = new Error('Error reading file');
        const v33 = { 'Content-Type': 'application/json' };
        const v34 = res.writeHead(500, v33);
        v34;
        const v35 = JSON.stringify(error);
        const v36 = res.end(v35);
        v36;
    };
    const v38 = stream.on('error', v37);
    v38;
    const v39 = path.extname(filePath);
    const v40 = v39 === '.gz';
    if (v40) {
        const v41 = filePath.replace('.gz', '');
        const v42 = mime.getType(v41);
        const v43 = stats.ino;
        const v44 = stats.mtime;
        const v45 = createServerEtag(v43, v44);
        const v46 = stats.size;
        const v47 = {
            'Content-Type': v42,
            'ETag': v45,
            'Cache-Control': cache,
            'Content-Encoding': 'gzip',
            'Content-Length': v46
        };
        const v48 = res.writeHead(200, v47);
        v48;
    } else {
        const v49 = mime.getType(filePath);
        const v50 = stats.ino;
        const v51 = stats.mtime;
        const v52 = createServerEtag(v50, v51);
        const v53 = stats.size;
        const v54 = {
            'Content-Type': v49,
            'ETag': v52,
            'Cache-Control': cache,
            'Content-Length': v53
        };
        const v55 = res.writeHead(200, v54);
        v55;
    }
    const v56 = stream.pipe(res);
    v56;
};
const basicStatic = function (options) {
    const v96 = function serveStatic(req, res) {
        const v57 = !options;
        if (v57) {
            options = {};
        }
        let rootDir;
        const v58 = options.rootDir;
        const v59 = options.rootDir;
        const v60 = process.cwd();
        if (v58) {
            rootDir = v59;
        } else {
            rootDir = v60;
        }
        const v61 = req.url;
        const v62 = url.parse(v61);
        const v63 = v62.pathname;
        const basePath = path.join(rootDir, v63);
        let compress;
        const v64 = options.compress;
        const v65 = req.headers;
        const v66 = v65['accept-encoding'];
        const v67 = v64 && v66;
        if (v67) {
            compress = true;
        } else {
            compress = false;
        }
        if (compress) {
            const v81 = function (err, filePath) {
                const v79 = function (err, stats) {
                    if (err) {
                        const v68 = err.httpCode;
                        const v69 = { 'Content-Type': 'application/json' };
                        const v70 = res.writeHead(v68, v69);
                        v70;
                        const v71 = JSON.stringify(err);
                        const v72 = res.end(v71);
                        v72;
                    } else {
                        const v73 = should304(req, stats);
                        if (v73) {
                            const v74 = res.writeHead(304);
                            v74;
                            const v75 = res.end();
                            v75;
                        } else {
                            let cache;
                            const v76 = options.cache;
                            const v77 = options.cache;
                            if (v76) {
                                cache = v77;
                            } else {
                                cache = 'max-age=86400';
                            }
                            const v78 = serveFile(req, res, stats, filePath, cache);
                            v78;
                        }
                    }
                };
                const v80 = statFile(filePath, v79);
                v80;
            };
            const v82 = checkCompress(basePath, v81);
            v82;
        } else {
            const v94 = function (err, stats) {
                if (err) {
                    const v83 = err.httpCode;
                    const v84 = { 'Content-Type': 'application/json' };
                    const v85 = res.writeHead(v83, v84);
                    v85;
                    const v86 = JSON.stringify(err);
                    const v87 = res.end(v86);
                    v87;
                } else {
                    const v88 = should304(req, stats);
                    if (v88) {
                        const v89 = res.writeHead(304);
                        v89;
                        const v90 = res.end();
                        v90;
                    } else {
                        let cache;
                        const v91 = options.cache;
                        const v92 = options.cache;
                        if (v91) {
                            cache = v92;
                        } else {
                            cache = 'max-age=86400';
                        }
                        const v93 = serveFile(req, res, stats, basePath, cache);
                        v93;
                    }
                }
            };
            const v95 = statFile(basePath, v94);
            v95;
        }
    };
    return v96;
};
module.exports = basicStatic;