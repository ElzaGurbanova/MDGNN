import os from 'os';
import childProcess from 'child_process';
import { Stream } from 'stream';
import taggedTemplateEscape from 'tagged-template-escape';
import shellEscapeArray from 'shell-escape';
import stream from './stream';
const v78 = str => {
    const v76 = [str];
    const v77 = shellEscapeArray(v76);
    return v77;
};
let shellEscape = taggedTemplateEscape(v78);
export const spawn = function (command, args, opts) {
    const v79 = {};
    opts = opts || v79;
    let child = childProcess.spawn(command, args, opts);
    const v85 = (resolve, reject) => {
        const v83 = (code, signal) => {
            const v80 = code || signal;
            if (v80) {
                let e = new Error(`Process exited with status code ${ code } and signal ${ signal }`);
                e.code = code;
                e.signal = signal;
                const v81 = reject(e);
                v81;
            } else {
                const v82 = resolve();
                v82;
            }
        };
        const v84 = child.on('exit', v83);
        v84;
    };
    let p = new Promise(v85);
    const v86 = p.then;
    const v87 = v86.bind(p);
    child.then = v87;
    const v88 = p.catch;
    const v89 = v88.bind(p);
    child.catch = v89;
    const v90 = child.stdin;
    const v91 = v90 instanceof Stream;
    if (v91) {
        const v92 = child.stdin;
        const v93 = stream(v92);
        child.stdin = v93;
    }
    const v94 = child.stdout;
    const v95 = v94 instanceof Stream;
    if (v95) {
        const v96 = child.stdout;
        const v97 = stream(v96);
        child.stdout = v97;
    }
    const v98 = child.stderr;
    const v99 = v98 instanceof Stream;
    if (v99) {
        const v100 = child.stderr;
        const v101 = stream(v100);
        child.stderr = v101;
    }
    const v105 = resolve => {
        const v103 = code => {
            const v102 = resolve(code);
            return v102;
        };
        const v104 = child.on('exit', v103);
        return v104;
    };
    child.code = new Promise(v105);
    const v109 = resolve => {
        const v107 = (code, signal) => {
            const v106 = resolve(signal);
            return v106;
        };
        const v108 = child.on('exit', v107);
        return v108;
    };
    child.signal = new Promise(v109);
    const v113 = resolve => {
        const v111 = () => {
            const v110 = resolve();
            return v110;
        };
        const v112 = child.on('close', v111);
        return v112;
    };
    child.close = new Promise(v113);
    return child;
};
let systemShell;
const v114 = os.platform();
const v115 = v114 === 'win32';
const v116 = [
    'cmd.exe',
    '/s',
    '/c'
];
const v117 = [
    'sh',
    '-c'
];
if (v115) {
    systemShell = v116;
} else {
    systemShell = v117;
}
const execWithOptions = function (options, strings, ...values) {
    const v118 = {};
    options = options || v118;
    const v132 = value => {
        const v119 = typeof value;
        const v120 = v119 === 'number';
        const v121 = typeof value;
        const v122 = v121 === 'object';
        const v123 = v120 || v122;
        const v124 = typeof value;
        const v125 = v124 === 'boolean';
        const v126 = v123 || v125;
        if (v126) {
            const v127 = value.toString();
            return v127;
        } else {
            const v128 = typeof value;
            const v129 = v128 === 'string';
            if (v129) {
                return value;
            } else {
                const v130 = typeof value;
                const v131 = new Error(`sh.exec can't interpolate ${ v130 } ${ value }`);
                throw v131;
            }
        }
    };
    values = values.map(v132);
    let command = shellEscape(strings, ...values);
    const v133 = systemShell[0];
    const v134 = systemShell.slice(1);
    const v135 = [command];
    const v136 = v134.concat(v135);
    const v137 = spawn(v133, v136, options);
    return v137;
};
export const exec = function (stringsOrOptions, ...values) {
    const v138 = typeof stringsOrOptions;
    const v139 = v138 === 'object';
    const v140 = Array.isArray(stringsOrOptions);
    const v141 = !v140;
    const v142 = v139 && v141;
    const v143 = typeof values;
    const v144 = v143 !== 'undefined';
    const v145 = v142 && v144;
    const v146 = Array.isArray(values);
    const v147 = v145 && v146;
    if (v147) {
        const v148 = execWithOptions.bind(null, stringsOrOptions);
        return v148;
    } else {
        const v149 = {};
        const v150 = execWithOptions(v149, stringsOrOptions, ...values);
        return v150;
    }
};