const exec = require('./exec');
const v82 = module.exports;
const v150 = async port => {
    const portNumber = parseInt(port, 10);
    const v83 = Number.isNaN(portNumber);
    if (v83) {
        const v84 = console.error('Must provide number for port.');
        v84;
        return;
    }
    try {
        const v85 = `lsof -i :${ portNumber }`;
        const v86 = (await exec(v85)).output;
        const result = v86.split('\n');
        const v87 = result.shift();
        const v88 = v87.split(' ');
        const v95 = item => {
            const v89 = item.trim();
            const v90 = !v89;
            const v91 = !v90;
            const v92 = item.trim();
            const v93 = v92 !== '';
            const v94 = v91 && v93;
            return v94;
        };
        const v96 = v88.filter(v95);
        const v98 = item => {
            const v97 = item.toLowerCase();
            return v97;
        };
        const headers = v96.map(v98);
        const v105 = item => {
            const v99 = item.trim();
            const v100 = !v99;
            const v101 = !v100;
            const v102 = item.trim();
            const v103 = v102 !== '';
            const v104 = v101 && v103;
            return v104;
        };
        const v106 = result.filter(v105);
        const v146 = (accumulator, currentValue) => {
            const v107 = currentValue.split(' ');
            const v114 = item => {
                const v108 = item.trim();
                const v109 = !v108;
                const v110 = !v109;
                const v111 = item.trim();
                const v112 = v111 !== '';
                const v113 = v110 && v112;
                return v113;
            };
            const v115 = v107.filter(v114);
            const v142 = (accumulator, currentValue, index) => {
                const v116 = headers.length;
                const v117 = v116 - 1;
                const v118 = index > v117;
                if (v118) {
                    const v119 = headers.length;
                    const v120 = v119 - 1;
                    const v121 = headers[v120];
                    const v122 = headers.length;
                    const v123 = v122 - 1;
                    const v124 = headers[v123];
                    const v125 = accumulator[v124];
                    const v126 = v125.trim();
                    const v127 = !v126;
                    const v128 = !v127;
                    const v129 = headers.length;
                    const v130 = v129 - 1;
                    const v131 = headers[v130];
                    const v132 = accumulator[v131];
                    const v133 = v132.trim();
                    const v134 = v133 !== '';
                    const v135 = v128 && v134;
                    const v136 = headers.length;
                    const v137 = v136 - 1;
                    const v138 = headers[v137];
                    const v139 = accumulator[v138];
                    let v140;
                    if (v135) {
                        v140 = `${ v139 } ${ currentValue }`;
                    } else {
                        v140 = currentValue;
                    }
                    accumulator[v121] = v140;
                } else {
                    const v141 = headers[index];
                    accumulator[v141] = currentValue;
                }
                return accumulator;
            };
            const v143 = {};
            const v144 = v115.reduce(v142, v143);
            const v145 = accumulator.push(v144);
            v145;
            return accumulator;
        };
        const v147 = [];
        const v148 = v106.reduce(v146, v147);
        return v148;
    } catch (e) {
        const v149 = console.error(e);
        v149;
    }
};
v82.listProcessesOnPort = v150;
const listProcessesOnPort = v82.listProcessesOnPort;
const v151 = module.exports;
const v155 = async pid => {
    const pidNumber = parseInt(pid, 10);
    const v152 = Number.isNaN(pidNumber);
    if (v152) {
        const v153 = console.error('Must provide number for process identifier.');
        v153;
        return false;
    }
    try {
        const v154 = `kill ${ pidNumber }`;
        await exec(v154);
        return true;
    } catch (e) {
        return false;
    }
};
v151.killProcess = v155;
const killProcess = v151.killProcess;
const v156 = module.exports;
const v162 = async port => {
    try {
        const processesOnPort = await listProcessesOnPort(port);
        const v160 = theProcess => {
            const v157 = theProcess.pid;
            const success = killProcess(v157);
            const v158 = theProcess.pid;
            const v159 = {};
            v159.pid = v158;
            v159.success = success;
            return v159;
        };
        const killProcessResult = processesOnPort.map(v160);
        return killProcessResult;
    } catch (e) {
        const v161 = console.log(e);
        v161;
    }
};
v156.killAllProcessesOnPort = v162;
const killAllProcessesOnPort = v156.killAllProcessesOnPort;