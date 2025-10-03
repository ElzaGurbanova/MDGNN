module.exports = Extract;
const Parse = require('./parse');
const fs = require('fs-extra');
const path = require('path');
const stream = require('stream');
const duplexer2 = require('duplexer2');
const Extract = function (opts) {
    const v35 = opts.path;
    const v36 = path.normalize(v35);
    const v37 = path.resolve(v36);
    opts.path = v37;
    const parser = new Parse(opts);
    const v38 = { objectMode: true };
    const outStream = new stream.Writable(v38);
    const v57 = async function (entry, encoding, cb) {
        const v39 = opts.path;
        const v40 = entry.path;
        const v41 = v40.replace(/\\/g, '/');
        const extractPath = path.join(v39, v41);
        const v42 = opts.path;
        const v43 = extractPath.indexOf(v42);
        const v44 = v43 != 0;
        if (v44) {
            const v45 = cb();
            return v45;
        }
        const v46 = entry.type;
        const v47 = v46 == 'Directory';
        if (v47) {
            await fs.ensureDir(extractPath);
            const v48 = cb();
            return v48;
        }
        const v49 = path.dirname(extractPath);
        await fs.ensureDir(v49);
        let writer;
        const v50 = opts.getWriter;
        const v51 = { path: extractPath };
        const v52 = opts.getWriter(v51);
        const v53 = fs.createWriteStream(extractPath);
        if (v50) {
            writer = v52;
        } else {
            writer = v53;
        }
        const v54 = entry.pipe(writer);
        const v55 = v54.on('error', cb);
        const v56 = v55.on('close', cb);
        v56;
    };
    outStream._write = v57;
    const extract = duplexer2(parser, outStream);
    const v58 = function (crxHeader) {
        extract.crxHeader = crxHeader;
    };
    const v59 = parser.once('crx-header', v58);
    v59;
    const v60 = parser.pipe(outStream);
    const v62 = function () {
        const v61 = extract.emit('close');
        v61;
    };
    const v63 = v60.on('finish', v62);
    v63;
    const v68 = function () {
        const v66 = function (resolve, reject) {
            const v64 = extract.on('close', resolve);
            v64;
            const v65 = extract.on('error', reject);
            v65;
        };
        const v67 = new Promise(v66);
        return v67;
    };
    extract.promise = v68;
    return extract;
};