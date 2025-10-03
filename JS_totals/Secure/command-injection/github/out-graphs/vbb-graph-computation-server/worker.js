'use strict';
const path = require('path');
const mkdirp = require('mkdirp');
const proc = require('child_process');
const fs = require('fs');
const v43 = require('./util');
const rootDir = v43.rootDir;
const v44 = process.env;
const v45 = v44.TIMEOUT;
const v46 = parseInt(v45);
const v47 = 100 * 1000;
const timeout = v46 || v47;
const v48 = Number.isNaN(timeout);
if (v48) {
    const v49 = console.error('TIMEOUT env var must be a number.');
    v49;
    const v50 = process.exit(1);
    v50;
}
const executable = path.join(__dirname, '../demo-worker.js');
const worker = (id, payload, cb) => {
    const cwd = path.join(rootDir, id);
    const nodes = path.join(cwd, 'nodes.ndjson');
    const edges = path.join(cwd, 'edges.ndjson');
    const stdoutPath = path.join(cwd, 'export');
    const stderrPath = path.join(cwd, 'log');
    const v83 = err => {
        if (err) {
            const v51 = cb(err);
            return v51;
        }
        const outStream = fs.createWriteStream(stdoutPath);
        const errStream = fs.createWriteStream(stderrPath);
        const v52 = [
            nodes,
            edges
        ];
        const v53 = process.env;
        const v54 = [
            'ignore',
            'pipe',
            'pipe'
        ];
        const v55 = {
            cwd,
            env: v53,
            stdio: v54,
            shell: false
        };
        const child = proc.spawn(executable, v52, v55);
        let killed = false;
        const v60 = () => {
            killed = true;
            const v56 = child.kill('SIGTERM');
            v56;
            const v58 = () => {
                const v57 = child.kill('SIGKILL');
                return v57;
            };
            const v59 = setTimeout(v58, 2000);
            v59;
        };
        const killer = setTimeout(v60, timeout);
        const v61 = child.stdout;
        const v62 = v61.pipe(outStream);
        v62;
        const v63 = child.stderr;
        const v64 = v63.pipe(errStream);
        v64;
        const v69 = e => {
            const v65 = clearTimeout(killer);
            v65;
            const v66 = outStream.end();
            v66;
            const v67 = errStream.end();
            v67;
            const v68 = cb(e);
            v68;
        };
        const v70 = child.on('error', v69);
        v70;
        const v81 = (code, signal) => {
            const v71 = clearTimeout(killer);
            v71;
            const v72 = outStream.end();
            v72;
            const v73 = errStream.end();
            v73;
            if (killed) {
                const v74 = new Error('Process timed out');
                const v75 = cb(v74);
                return v75;
            }
            const v76 = code !== 0;
            if (v76) {
                const v77 = 'Worker exited with code ' + code;
                const v78 = new Error(v77);
                const v79 = cb(v78);
                return v79;
            }
            const v80 = cb(null);
            v80;
        };
        const v82 = child.on('close', v81);
        v82;
    };
    const v84 = mkdirp(cwd, v83);
    v84;
};
module.exports = worker;