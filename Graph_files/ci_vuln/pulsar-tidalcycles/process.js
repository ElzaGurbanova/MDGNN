'use babel';
const EventEmitter = require('events');
const child_process = require('child_process');
const path = require('path');
export default const Process = function Process(process) {
    const v58 = super();
    v58;
    this.stdOut = [];
    this.stdErr = [];
    this.process = process;
    const v59 = this.process;
    const v60 = v59.stderr;
    const v71 = data => {
        const v61 = this.stdErr;
        const v62 = data.toString('utf8');
        const v63 = v61.push(v62);
        v63;
        const v69 = () => {
            const v64 = this.stdErr;
            const v65 = v64.length;
            if (v65) {
                const v66 = this.stdErr;
                let err = v66.join('');
                const v67 = this.stdErr;
                v67.length = 0;
                const v68 = this.emit('stderr', err);
                v68;
            }
        };
        const v70 = setTimeout(v69, 50);
        v70;
    };
    const v72 = v60.on('data', v71);
    v72;
    const v73 = this.process;
    const v74 = v73.stdout;
    const v85 = data => {
        const v75 = this.stdOut;
        const v76 = data.toString('utf8');
        const v77 = v75.push(v76);
        v77;
        const v83 = () => {
            const v78 = this.stdOut;
            const v79 = v78.length;
            if (v79) {
                const v80 = this.stdOut;
                let out = v80.join('');
                const v81 = this.stdOut;
                v81.length = 0;
                const v82 = this.emit('stdout', out);
                v82;
            }
        };
        const v84 = setTimeout(v83, 50);
        v84;
    };
    const v86 = v74.on('data', v85);
    v86;
};