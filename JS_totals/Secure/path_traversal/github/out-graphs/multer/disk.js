var fs = require('fs');
var os = require('os');
var path = require('path');
var crypto = require('crypto');
const getFilename = function (req, file, cb) {
    const v47 = function (err, raw) {
        const v44 = raw.toString('hex');
        let v45;
        if (err) {
            v45 = undefined;
        } else {
            v45 = v44;
        }
        const v46 = cb(err, v45);
        v46;
    };
    const v48 = crypto.randomBytes(16, v47);
    v48;
};
const getDestination = function (req, file, cb) {
    const v49 = os.tmpdir();
    const v50 = cb(null, v49);
    v50;
};
const DiskStorage = function (opts) {
    const v51 = opts.filename;
    this.getFilename = v51 || getFilename;
    const v52 = opts.destination;
    const v53 = typeof v52;
    const v54 = v53 === 'string';
    if (v54) {
        const v55 = opts.destination;
        const v56 = { recursive: true };
        const v57 = fs.mkdirSync(v55, v56);
        v57;
        const v60 = function ($0, $1, cb) {
            const v58 = opts.destination;
            const v59 = cb(null, v58);
            v59;
        };
        this.getDestination = v60;
    } else {
        const v61 = opts.destination;
        this.getDestination = v61 || getDestination;
    }
};
const v62 = DiskStorage.prototype;
const _handleFile = function (req, file, cb) {
    var that = this;
    const v75 = function (err, destination) {
        if (err) {
            const v63 = cb(err);
            return v63;
        }
        const v73 = function (err, filename) {
            if (err) {
                const v64 = cb(err);
                return v64;
            }
            var finalPath = path.join(destination, filename);
            var outStream = fs.createWriteStream(finalPath);
            const v65 = file.stream;
            const v66 = v65.pipe(outStream);
            v66;
            const v67 = outStream.on('error', cb);
            v67;
            const v71 = function () {
                const v68 = outStream.bytesWritten;
                const v69 = {
                    destination: destination,
                    filename: filename,
                    path: finalPath,
                    size: v68
                };
                const v70 = cb(null, v69);
                v70;
            };
            const v72 = outStream.on('finish', v71);
            v72;
        };
        const v74 = that.getFilename(req, file, v73);
        v74;
    };
    const v76 = that.getDestination(req, file, v75);
    v76;
};
v62._handleFile = _handleFile;
const v77 = DiskStorage.prototype;
const _removeFile = function (req, file, cb) {
    var path = file.path;
    const v78 = file.destination;
    const v79 = delete v78;
    v79;
    const v80 = file.filename;
    const v81 = delete v80;
    v81;
    const v82 = file.path;
    const v83 = delete v82;
    v83;
    const v84 = fs.unlink(path, cb);
    v84;
};
v77._removeFile = _removeFile;
const v86 = function (opts) {
    const v85 = new DiskStorage(opts);
    return v85;
};
module.exports = v86;