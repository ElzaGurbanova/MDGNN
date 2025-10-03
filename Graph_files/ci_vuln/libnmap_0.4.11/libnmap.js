'use strict';
const async = require('async');
const merge = require('deepmerge');
const caller = require('stack-trace');
const v80 = require('child_process');
const proc = v80.exec;
const v81 = require('events');
const emitter = v81.EventEmitter;
const network = require('./networking.js');
const reporting = require('./reporting.js');
const validation = require('./validation.js');
const tools = function tools() {
};
const merge = function merge(defaults, obj) {
    const v82 = merge(defaults, obj);
    return v82;
};
tools.merge = merge;
const chunk = function chunk(obj, offset) {
    let idx = 0;
    const alength = obj.length;
    const tarray = [];
    (idx = 0)
    let v83 = idx < alength;
    while (v83) {
        const v84 = idx + offset;
        const v85 = obj.slice(idx, v84);
        const v86 = v85.join(' ');
        const v87 = tarray.push(v86);
        v87;
        v83 = idx < alength;
    }
    return tarray;
};
tools.chunk = chunk;
const flatten = function flatten(arr, obj) {
    let value;
    const result = [];
    let i = 0;
    let length = arr.length;
    let v88 = i < length;
    while (v88) {
        value = arr[i];
        const v90 = Array.isArray(value);
        if (v90) {
            const v91 = this.flatten(value, obj);
            return v91;
        } else {
            const v92 = result.push(value);
            v92;
        }
        const v89 = i++;
        v88 = i < length;
    }
    return result;
};
tools.flatten = flatten;
const funcs = function funcs(opts) {
    const scope = this;
    const funcs = {};
    let cmd = false;
    const errors = [];
    const reports = [];
    const v93 = opts.range;
    const v94 = v93.length;
    const v95 = v94 <= 0;
    if (v95) {
        return 'Range of hosts could not be created';
    }
    const v96 = opts.range;
    const v97 = Object.keys(v96);
    const v117 = function blocks(block) {
        const v98 = opts.range;
        const range = v98[block];
        const block = function (callback) {
            cmd = scope.command(opts, range);
            const v99 = opts.verbose;
            if (v99) {
                const v100 = `Running: ${ cmd }`;
                const v101 = console.log(v100);
                v101;
            }
            const report = [];
            const v103 = (err, stdout, stderr) => {
                if (err) {
                    const v102 = reporting.reports(opts, err, callback);
                    return v102;
                }
            };
            const execute = proc(cmd, v103);
            const v104 = execute.stderr;
            const v105 = chunk => {
            };
            const v106 = v104.on('data', v105);
            v106;
            const v107 = execute.stdout;
            const v109 = chunk => {
                const v108 = report.push(chunk);
                v108;
            };
            const v110 = v107.on('data', v109);
            v110;
            const v111 = execute.stdout;
            const v115 = () => {
                const v112 = report.length;
                const v113 = v112 > 0;
                if (v113) {
                    const v114 = reporting.reports(opts, report, callback);
                    return v114;
                }
            };
            const v116 = v111.on('end', v115);
            v116;
        };
        funcs[range] = block;
    };
    const v118 = v97.forEach(v117);
    v118;
    return funcs;
};
tools.funcs = funcs;
const command = function command(opts, block) {
    const v119 = opts.flags;
    const flags = v119.join(' ');
    let proto;
    const v120 = opts.udp;
    if (v120) {
        proto = ' -sU';
    } else {
        proto = ' ';
    }
    const v121 = opts.timeout;
    const to = `--host-timeout=${ v121 }s `;
    let ipv6;
    const v122 = validation.patterns;
    const v123 = v122.IPv6;
    const v124 = validation.test(v123, block);
    if (v124) {
        ipv6 = ' -6 ';
    } else {
        ipv6 = ' ';
    }
    const v125 = opts.ports;
    const v126 = opts.nmap;
    const v127 = v126 + proto;
    const v128 = opts.ports;
    const v129 = opts.nmap;
    const v130 = v129 + proto;
    let v131;
    if (v125) {
        v131 = `${ v127 } ${ to }${ flags }${ ipv6 }-p${ v128 } ${ block }`;
    } else {
        v131 = `${ v130 } ${ to }${ flags }${ ipv6 }${ block }`;
    }
    return v131;
};
tools.command = command;
const worker = function worker(obj, fn) {
    const v132 = obj.funcs;
    const v133 = obj.threshold;
    const v134 = async.parallelLimit(v132, v133, fn);
    v134;
};
tools.worker = worker;
const init = function init(defaults, opts, cb) {
    let funcs = [];
    const ranges = [];
    const v135 = caller.get();
    const v136 = v135[1];
    const called = v136.getFunctionName();
    const v137 = opts.flags;
    const v138 = typeof v137;
    const v139 = /array/.test(v138);
    if (v139) {
        const v140 = opts.flags;
        defaults.flags = v140;
    }
    opts = this.merge(defaults, opts);
    const v141 = opts.flags;
    const v142 = v141.indexOf('-oX -');
    const v143 = -1;
    const v144 = v142 === v143;
    if (v144) {
        const v145 = opts.flags;
        const v146 = v145.push('-oX -');
        v146;
    }
    const v147 = /nmap.discover/.test(called);
    if (v147) {
        const v148 = network.adapters(opts);
        const v149 = !(opts.range = v148);
        if (v149) {
            const v150 = validation.messages;
            const v151 = v150.version;
            const v152 = cb(v151);
            return v152;
        }
        opts.ports = '';
        opts.flags = [
            '-n',
            '-oX -',
            '-sn',
            '-PR'
        ];
    }
    const v157 = (err, result) => {
        if (err) {
            const v153 = cb(err);
            return v153;
        }
        const v154 = network.calculate(opts);
        opts.range = v154;
        funcs = this.funcs(opts);
        const v155 = {
            opts,
            funcs
        };
        const v156 = cb(null, v155);
        return v156;
    };
    const v158 = validation.init(opts, v157);
    v158;
};
tools.init = init;
tools['is_class'] = true;
module.exports = new tools();