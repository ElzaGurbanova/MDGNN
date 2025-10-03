var fs = require('fs');
var _ = require('lodash');
const v100 = function (options) {
    var FileInfo = function (file) {
        const v51 = file.name;
        this.name = v51;
        const v52 = file.name;
        this.originalName = v52;
        const v53 = file.size;
        this.size = v53;
        const v54 = file.type;
        this.type = v54;
        this.deleteType = 'DELETE';
    };
    const v55 = FileInfo.prototype;
    const v72 = function () {
        const v56 = options.minFileSize;
        const v57 = options.minFileSize;
        const v58 = this.size;
        const v59 = v57 > v58;
        const v60 = v56 && v59;
        if (v60) {
            this.error = 'File is too small';
        } else {
            const v61 = options.maxFileSize;
            const v62 = options.maxFileSize;
            const v63 = this.size;
            const v64 = v62 < v63;
            const v65 = v61 && v64;
            if (v65) {
                this.error = 'File is too big';
            } else {
                const v66 = options.acceptFileTypes;
                const v67 = this.name;
                const v68 = v66.test(v67);
                const v69 = !v68;
                if (v69) {
                    this.error = 'Filetype not allowed';
                }
            }
        }
        const v70 = this.error;
        const v71 = !v70;
        return v71;
    };
    v55.validate = v72;
    const v73 = FileInfo.prototype;
    const v93 = function () {
        const v74 = require('path');
        const v75 = this.name;
        const v76 = v74.basename(v75);
        const v77 = v76.replace(/^\.+/, '');
        this.name = v77;
        const v78 = options.baseDir();
        const v79 = v78 + '/';
        const v80 = this.name;
        const v81 = v79 + v80;
        let v82 = fs.existsSync(v81);
        while (v82) {
            const v83 = this.name;
            const v91 = function (s, index, ext) {
                const v84 = parseInt(index, 10);
                const v85 = v84 || 0;
                const v86 = v85 + 1;
                const v87 = ' (' + v86;
                const v88 = v87 + ')';
                const v89 = ext || '';
                const v90 = v88 + v89;
                return v90;
            };
            const v92 = v83.replace(/(?:(?: \(([\d]+)\))?(\.[^.]+))?$/, v91);
            this.name = v92;
            v82 = fs.existsSync(v81);
        }
    };
    v73.safeName = v93;
    const v94 = FileInfo.prototype;
    const v99 = function (type, baseUrl) {
        let key;
        const v95 = type + 'Url';
        if (type) {
            key = v95;
        } else {
            key = 'url';
        }
        const v96 = baseUrl + '/';
        const v97 = this.name;
        const v98 = encodeURIComponent(v97);
        this[key] = v96 + v98;
    };
    v94.setUrl = v99;
    return FileInfo;
};
module.exports = v100;