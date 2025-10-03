const v103 = require('child_process');
var exec = v103.exec;
var fs = require('fs');
var path = require('path');
const v104 = require('events');
var EventEmitter = v104.EventEmitter;
var temp = require('temp');
var tasks = require('./tasks');
var Q = require('q');
var extensions = {};
extensions.gif = 'GIF';
extensions.jpg = 'JPEG';
extensions.jpeg = 'JPEG';
extensions.png = 'PNG';
const v116 = function (settings) {
    var self = this;
    this.queue = [];
    const v105 = {};
    const v106 = {};
    v106.start = 0;
    v106.end = 0;
    const v107 = {};
    v107.start = null;
    v107.end = null;
    const v108 = {};
    v108.fileCount = 0;
    v108.scanned = v105;
    v108.size = v106;
    v108.time = v107;
    this.report = v108;
    this.settings = settings;
    const v109 = this.settings;
    const v110 = v109.inputs;
    const v114 = function (input) {
        var files = self.scan(input, 0);
        const v112 = function (file) {
            const v111 = self.add(file);
            v111;
        };
        const v113 = files.forEach(v112);
        v113;
    };
    const v115 = v110.forEach(v114);
    v115;
};
module.exports = v116;
var Job = module.exports;
Job.prototype = new EventEmitter();
const v117 = Job.prototype;
const v128 = function (filename) {
    var self = this;
    const v118 = path.extname(filename);
    const v119 = v118.substr(1);
    const v120 = extensions[v119];
    var task = tasks[v120];
    if (task) {
        const v121 = this.queue;
        const v123 = function () {
            const v122 = self.compress(filename, task);
            return v122;
        };
        const v124 = v121.push(v123);
        v124;
        const v125 = this.report;
        const v126 = v125.fileCount;
        const v127 = ++v126;
        return v127;
    } else {
        return false;
    }
};
v117.add = v128;
const v129 = Job.prototype;
const v162 = function (filename, task) {
    var deferred = Q.defer();
    var self = this;
    const v159 = function (err, info) {
        var scratchSpace = info.path;
        const v130 = 'cp "' + filename;
        const v131 = v130 + '" ';
        const v132 = v131 + scratchSpace;
        const v157 = function (error, stdout, stderr) {
            const v133 = self.settings;
            const v134 = {
                original: filename,
                filename: scratchSpace,
                settings: v133,
                deferred: deferred,
                job: self
            };
            const v135 = task.call(this, v134);
            const v155 = function (newStats) {
                var oldStats = fs.statSync(filename);
                const v136 = self.report;
                const v137 = v136.size;
                const v138 = oldStats.size;
                v137.start += v138;
                const v139 = self.report;
                const v140 = v139.size;
                const v141 = newStats.size;
                v140.end += v141;
                const v142 = oldStats.size;
                const v143 = newStats.size;
                const v144 = {
                    filename: filename,
                    oldSize: v142,
                    newSize: v143
                };
                const v145 = self.emit('compression', v144);
                v145;
                const v146 = self.settings;
                const v147 = v146.dryRun;
                const v148 = !v147;
                const v149 = newStats.size;
                const v150 = oldStats.size;
                const v151 = v149 < v150;
                const v152 = v148 && v151;
                if (v152) {
                    const v153 = fs.renameSync(scratchSpace, filename);
                    v153;
                } else {
                    const v154 = fs.unlinkSync(scratchSpace);
                    v154;
                }
            };
            const v156 = v135.then(v155);
            v156;
        };
        const v158 = exec(v132, v157);
        v158;
    };
    const v160 = temp.open('PULVERIZR', v159);
    v160;
    const v161 = deferred.promise;
    return v161;
};
v129.compress = v162;
const v163 = Job.prototype;
const v179 = function () {
    var self = this;
    var result = Q.resolve();
    const v164 = {};
    const v165 = this.emit('start', v164);
    v165;
    const v168 = new Date();
    const v169 = Date.parse(v168);
    v167.start = v169;
    const v170 = this.queue;
    const v171 = function (f) {
        result = result.then(f);
    };
    const v172 = v170.forEach(v171);
    v172;
    const v177 = function () {
        var r = self.report;
        const v174 = new Date();
        const v175 = Date.parse(v174);
        v173.end = v175;
        const v176 = self.emit('finish', r);
        v176;
    };
    const v178 = result.then(v177);
    v178;
};
v163.run = v179;
const v180 = Job.prototype;
const v204 = function (filename, depth) {
    var self = this;
    var files = [];
    const v202 = function walk(filename, depth) {
        var stats = fs.statSync(filename);
        const v181 = stats.isFile();
        if (v181) {
            const v182 = files.push(filename);
            v182;
        } else {
            const v183 = self.settings;
            const v184 = v183.recursive;
            const v185 = depth === 0;
            const v186 = v184 || v185;
            const v187 = self.report;
            const v188 = v187.scanned;
            const v189 = v188[filename];
            const v190 = !v189;
            const v191 = v186 && v190;
            const v192 = stats.isDirectory();
            const v193 = v191 && v192;
            if (v193) {
                const v194 = depth++;
                v194;
                const v195 = fs.readdirSync(filename);
                const v200 = function (_filename) {
                    const v196 = filename.replace(/(\/)$/g, '');
                    const v197 = v196 + '/';
                    const v198 = v197 + _filename;
                    const v199 = walk.call(this, v198, depth);
                    v199;
                };
                const v201 = v195.forEach(v200);
                v201;
            }
        }
    };
    const v203 = v202(filename, 0);
    v203;
    return files;
};
v180.scan = v204;