var shell = require('shelljs');
var utils = require('./utils');
const v104 = shell.config;
v104.silent = true;
const pdfinfo = function (filename, options) {
    const v105 = {};
    this.options = options || v105;
    const v106 = this.options;
    const v107 = '"' + filename;
    const v108 = v107 + '"';
    v106.additional = [v108];
    const v109 = pdfinfo.prototype;
    const v125 = function (optionArray) {
        const v110 = optionArray.length;
        const v111 = typeof v110;
        const v112 = v111 !== undefined;
        if (v112) {
            var self = this;
            const v123 = function (el) {
                const v113 = el.indexOf(' ');
                const v114 = v113 > 0;
                if (v114) {
                    var values = el.split(' ');
                    const v115 = self.options;
                    const v116 = v115.additional;
                    const v117 = values[0];
                    const v118 = values[1];
                    const v119 = v116.push(v117, v118);
                    v119;
                } else {
                    const v120 = self.options;
                    const v121 = v120.additional;
                    const v122 = v121.push(el);
                    v122;
                }
            };
            const v124 = optionArray.forEach(v123);
            v124;
        }
        return this;
    };
    v109.add_options = v125;
    const v126 = pdfinfo.prototype;
    const v141 = function () {
        var self = this;
        const v127 = self.options;
        const v128 = v127.additional;
        const v129 = v128.join(' ');
        const v130 = 'pdfinfo ' + v129;
        var child = shell.exec(v130);
        const v131 = child.code;
        const v132 = v131 === 0;
        if (v132) {
            const v133 = child.stdout;
            const v134 = utils.parse(v133);
            return v134;
        } else {
            const v135 = shell.which('pdfinfo');
            const v136 = !v135;
            if (v136) {
                const v137 = new Error('Sorry, this script requires pdfinfo.');
                throw v137;
            }
            const v138 = child.stdout;
            const v139 = 'pdfinfo error: ' + v138;
            const v140 = new Error(v139);
            throw v140;
        }
    };
    v126.getInfoSync = v141;
    const v142 = pdfinfo.prototype;
    const v145 = function () {
        const v143 = console.warn('\x1B[31m`getSync` is now obsolete please use `getInfoSync` instead. Eventually `getSync` will be soon removed.\x1B[0m');
        v143;
        const v144 = this.getInfoSync();
        return v144;
    };
    v142.getSync = v145;
    const v146 = pdfinfo.prototype;
    const v167 = function (cb) {
        var self = this;
        const v147 = self.options;
        const v148 = v147.additional;
        const v149 = v148.join(' ');
        const v150 = 'pdfinfo ' + v149;
        const v166 = function (code, data) {
            const v151 = code === 0;
            if (v151) {
                data = utils.parse(data);
                const v152 = typeof cb;
                const v153 = v152 === 'function';
                const v154 = cb && v153;
                if (v154) {
                    const v155 = self.options;
                    const v156 = v155.additional;
                    const v157 = cb(null, data, v156);
                    v157;
                }
            } else {
                var err;
                const v158 = shell.which('pdfinfo');
                const v159 = !v158;
                if (v159) {
                    err = new Error('pdfinfo (poppler-utils) is missing. Hint: sudo apt-get install poppler-utils');
                } else {
                    err = new Error(data);
                }
                const v160 = typeof cb;
                const v161 = v160 === 'function';
                const v162 = cb && v161;
                if (v162) {
                    const v163 = self.options;
                    const v164 = v163.addtional;
                    const v165 = cb(err, null, v164);
                    v165;
                }
            }
        };
        var child = shell.exec(v150, v166);
    };
    v146.getInfo = v167;
    const v168 = pdfinfo.prototype;
    const v198 = function () {
        const v169 = console.warn('\x1B[31m`get` is now obsolete please use `getInfo` instead. Eventually `get` will be soon removed.\x1B[0m');
        v169;
        var self = this;
        const v170 = self.options;
        const v171 = v170.additional;
        const v172 = v171.join(' ');
        const v173 = 'pdfinfo ' + v172;
        const v197 = function (code, data) {
            const v174 = code === 0;
            if (v174) {
                const v175 = self.options;
                const v176 = v175.success;
                const v177 = self.options;
                const v178 = v177.success;
                const v179 = typeof v178;
                const v180 = v179 === 'function';
                const v181 = v176 && v180;
                if (v181) {
                    const v182 = self.options;
                    const v183 = utils.parse(data);
                    const v184 = v182.success(v183);
                    v184;
                }
            } else {
                const v185 = shell.which('pdfinfo');
                const v186 = !v185;
                if (v186) {
                    const v187 = echo('Sorry, this script requires pdfinfo.');
                    v187;
                }
                const v188 = self.options;
                const v189 = v188.error;
                const v190 = self.options;
                const v191 = v190.error;
                const v192 = typeof v191;
                const v193 = v192 === 'function';
                const v194 = v189 && v193;
                if (v194) {
                    const v195 = self.options;
                    const v196 = v195.error(data);
                    v196;
                }
            }
        };
        var child = shell.exec(v173, v197);
    };
    v168.get = v198;
    const v199 = pdfinfo.prototype;
    const v201 = function (callback) {
        const v200 = this.options;
        v200.error = callback;
        return this;
    };
    v199.error = v201;
    const v202 = pdfinfo.prototype;
    const v204 = function (callback) {
        const v203 = this.options;
        v203.success = callback;
        return this;
    };
    v202.success = v204;
};
const v206 = function (filename, args) {
    const v205 = new pdfinfo(filename, args);
    return v205;
};
module.exports = v206;
exports = module.exports;