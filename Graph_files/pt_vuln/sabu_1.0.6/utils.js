'use strict';
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const isBinaryFile = require('isbinaryfile');
const sizeToString = require('./size-to-string');
const permsToString = require('./perms-to-string');
const v49 = require('font-awesome-filetypes');
const getIconForExtension = v49.getIconForExtension;
const getCleanUrl = url => {
    const v50 = url.split('');
    const v51 = v50.pop();
    const v52 = v51 !== '/';
    const v53 = url.length;
    const v54 = v53 - 1;
    const v55 = url.substring(0, v54);
    let v56;
    if (v52) {
        v56 = url;
    } else {
        v56 = v55;
    }
    return v56;
};
const getCleanPath = url => {
    let filePath = url;
    const v57 = filePath.substring(0, 1);
    let v58 = v57 === '/';
    while (v58) {
        filePath = filePath.substring(1);
        v58 = v57 === '/';
    }
    return filePath;
};
const isBinary = (filePath, data) => {
    const v69 = (resolve, reject) => {
        const v67 = (err, stat) => {
            if (err) {
                const v59 = reject(err);
                return v59;
            }
            const v60 = stat.size;
            const v65 = (err, result) => {
                const v61 = reject(err);
                const v62 = !result;
                const v63 = resolve(v62);
                let v64;
                if (err) {
                    v64 = v61;
                } else {
                    v64 = v63;
                }
                return v64;
            };
            const v66 = isBinaryFile(data, v60, v65);
            v66;
        };
        const v68 = fs.lstat(filePath, v67);
        v68;
    };
    const v70 = new Promise(v69);
    return v70;
};
const sendFile = (res, filePath) => {
    const v82 = (err, stats) => {
        if (err) {
            const v71 = console.error(err);
            v71;
            const v72 = { error: 'File not found' };
            const v73 = res.send(404, v72);
            return v73;
        }
        const v74 = mime.lookup(filePath);
        const v75 = res.header('Content-Type', v74);
        v75;
        const v76 = fs.createReadStream(filePath);
        const v77 = v76.pipe(res);
        v77;
        const v80 = err => {
            if (err) {
                const v78 = { error: err };
                const v79 = res.send(500, v78);
                return v79;
            }
        };
        const v81 = res.once('result', v80);
        v81;
    };
    const v83 = fs.stat(filePath, v82);
    v83;
};
const directoryListing = dir => {
    try {
        const v84 = fs.readdirSync(dir, 'utf8');
        const v89 = x => {
            let ext = path.extname(x);
            const v85 = ext.startsWith('.');
            const v86 = ext && v85;
            if (v86) {
                ext = ext.substring(1);
            }
            const v87 = path.resolve(dir, x);
            const stat = fs.statSync(v87);
            const icon = getIconForExtension(ext);
            const size = sizeToString(stat, true, false);
            const perms = permsToString(stat);
            const v88 = `
                     <tr>
                        <td>${ icon }</td>
                        <td>${ perms }</td>
                        <td>${ size }</td>
                        <td><a href="${ x }">${ x }</a></td>
                    `;
            return v88;
        };
        const v90 = v84.map(v89);
        const v91 = v90.join('\n');
        return v91;
    } catch (e) {
        return '';
    }
};
const v92 = module.exports;
v92.getCleanUrl = getCleanUrl;
const v93 = module.exports;
v93.getCleanPath = getCleanPath;
const v94 = module.exports;
v94.isBinary = isBinary;
const v95 = module.exports;
v95.sendFile = sendFile;
const v96 = module.exports;
v96.directoryListing = directoryListing;