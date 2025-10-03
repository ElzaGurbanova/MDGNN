'use strict';
const async = require('async');
const merge = require('deepmerge');
const caller = require('stack-trace');
const v78 = require('child_process');
const proc = v78.spawn;
const v79 = require('events');
const emitter = v79.EventEmitter;
const network = require('./networking.js');
const reporting = require('./reporting.js');
const validation = require('./validation.js');
const tools = function tools() {
};
const merge = function merge(defaults, obj) {
    const v80 = merge(defaults, obj);
    return v80;
};
tools.merge = merge;
const chunk = function chunk(obj, offset) {
    let idx = 0;
    const alength = obj.length;
    const tarray = [];
    (idx = 0)
    let v81 = idx < alength;
    while (v81) {
        const v82 = idx + offset;
        const v83 = obj.slice(idx, v82);
        const v84 = v83.join(' ');
        const v85 = tarray.push(v84);
        v85;
        v81 = idx < alength;
    }
    return tarray;
};
tools.chunk = chunk;
const flatten = function flatten(arr, obj) {
    let value;
    const result = [];
    let i = 0;
    let length = arr.length;
    let v86 = i < length;
    while (v86) {
        value = arr[i];
        const v88 = Array.isArray(value);
        if (v88) {
            const v89 = this.flatten(value, obj);
            return v89;
        } else {
            const v90 = result.push(value);
            v90;
        }
        const v87 = i++;
        v86 = i < length;
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
    const v91 = opts.range;
    const v92 = v91.length;
    const v93 = v92 <= 0;
    if (v93) {
        return 'Range of hosts could not be created';
    }
    const v94 = opts.range;
    const v95 = Object.keys(v94);
    const v113 = function blocks(block) {
        const v96 = opts.range;
        const range = v96[block];
        const block = function (callback) {
            const report = [];
            cmd = scope.command(opts, range);
            const obj = cmd.split(' ');
            cmd = obj[0];
            const args = obj.slice(1);
            const v97 = opts.verbose;
            if (v97) {
                const v98 = `Running: ${ cmd }`;
                const v99 = console.log(v98);
                v99;
            }
            const execute = proc(cmd, args);
            const v100 = execute.stderr;
            const v101 = chunk => {
            };
            const v102 = v100.on('data', v101);
            v102;
            const v103 = execute.stdout;
            const v105 = chunk => {
                const v104 = report.push(chunk);
                v104;
            };
            const v106 = v103.on('data', v105);
            v106;
            const v107 = execute.stdout;
            const v111 = () => {
                const v108 = report.length;
                const v109 = v108 > 0;
                if (v109) {
                    const v110 = reporting.reports(opts, report, callback);
                    return v110;
                }
            };
            const v112 = v107.on('end', v111);
            v112;
        };
        funcs[range] = block;
    };
    const v114 = v95.forEach(v113);
    v114;
    return funcs;
};
tools.funcs = funcs;
const command = function command(opts, block) {
    const v115 = opts.flags;
    const flags = v115.join(' ');
    let proto;
    const v116 = opts.udp;
    if (v116) {
        proto = ' -sU';
    } else {
        proto = ' ';
    }
    const v117 = opts.timeout;
    const to = `--host-timeout=${ v117 }s `;
    let ipv6;
    const v118 = validation.patterns;
    const v119 = v118.IPv6;
    const v120 = validation.test(v119, block);
    if (v120) {
        ipv6 = ' -6 ';
    } else {
        ipv6 = ' ';
    }
    const v121 = opts.ports;
    const v122 = opts.nmap;
    const v123 = v122 + proto;
    const v124 = opts.ports;
    const v125 = opts.nmap;
    const v126 = v125 + proto;
    let v127;
    if (v121) {
        v127 = `${ v123 } ${ to }${ flags }${ ipv6 }-p${ v124 } ${ block }`;
    } else {
        v127 = `${ v126 } ${ to }${ flags }${ ipv6 }${ block }`;
    }
    return v127;
};
tools.command = command;
const worker = function worker(obj, fn) {
    const v128 = obj.funcs;
    const v129 = obj.threshold;
    const v130 = async.parallelLimit(v128, v129, fn);
    v130;
};
tools.worker = worker;
const init = function init(defaults, opts, cb) {
    let funcs = [];
    const ranges = [];
    const v131 = caller.get();
    const v132 = v131[1];
    const called = v132.getFunctionName();
    const v133 = opts.flags;
    const v134 = typeof v133;
    const v135 = /array/.test(v134);
    if (v135) {
        const v136 = opts.flags;
        defaults.flags = v136;
    }
    opts = this.merge(defaults, opts);
    const v137 = opts.flags;
    const v138 = v137.indexOf('-oX -');
    const v139 = -1;
    const v140 = v138 === v139;
    if (v140) {
        const v141 = opts.flags;
        const v142 = v141.push('-oX -');
        v142;
    }
    const v143 = /nmap.discover/.test(called);
    if (v143) {
        const v144 = network.adapters(opts);
        const v145 = !(opts.range = v144);
        if (v145) {
            const v146 = validation.messages;
            const v147 = v146.version;
            const v148 = cb(v147);
            return v148;
        }
        opts.ports = '';
        opts.flags = [
            '-n',
            '-oX -',
            '-sn',
            '-PR'
        ];
    }
    const v153 = (err, result) => {
        if (err) {
            const v149 = cb(err);
            return v149;
        }
        const v150 = network.calculate(opts);
        opts.range = v150;
        funcs = this.funcs(opts);
        const v151 = {
            opts,
            funcs
        };
        const v152 = cb(null, v151);
        return v152;
    };
    const v154 = validation.init(opts, v153);
    v154;
};
tools.init = init;
tools['is_class'] = true;
module.exports = new tools();