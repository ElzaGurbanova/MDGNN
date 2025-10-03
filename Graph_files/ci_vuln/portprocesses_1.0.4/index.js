const exec = require('./exec');
const v78 = module.exports;
const v144 = async port => {
    try {
        const v79 = `lsof -i :${ port }`;
        const v80 = (await exec(v79)).output;
        const result = v80.split('\n');
        const v81 = result.shift();
        const v82 = v81.split(' ');
        const v89 = item => {
            const v83 = item.trim();
            const v84 = !v83;
            const v85 = !v84;
            const v86 = item.trim();
            const v87 = v86 !== '';
            const v88 = v85 && v87;
            return v88;
        };
        const v90 = v82.filter(v89);
        const v92 = item => {
            const v91 = item.toLowerCase();
            return v91;
        };
        const headers = v90.map(v92);
        const v99 = item => {
            const v93 = item.trim();
            const v94 = !v93;
            const v95 = !v94;
            const v96 = item.trim();
            const v97 = v96 !== '';
            const v98 = v95 && v97;
            return v98;
        };
        const v100 = result.filter(v99);
        const v140 = (accumulator, currentValue) => {
            const v101 = currentValue.split(' ');
            const v108 = item => {
                const v102 = item.trim();
                const v103 = !v102;
                const v104 = !v103;
                const v105 = item.trim();
                const v106 = v105 !== '';
                const v107 = v104 && v106;
                return v107;
            };
            const v109 = v101.filter(v108);
            const v136 = (accumulator, currentValue, index) => {
                const v110 = headers.length;
                const v111 = v110 - 1;
                const v112 = index > v111;
                if (v112) {
                    const v113 = headers.length;
                    const v114 = v113 - 1;
                    const v115 = headers[v114];
                    const v116 = headers.length;
                    const v117 = v116 - 1;
                    const v118 = headers[v117];
                    const v119 = accumulator[v118];
                    const v120 = v119.trim();
                    const v121 = !v120;
                    const v122 = !v121;
                    const v123 = headers.length;
                    const v124 = v123 - 1;
                    const v125 = headers[v124];
                    const v126 = accumulator[v125];
                    const v127 = v126.trim();
                    const v128 = v127 !== '';
                    const v129 = v122 && v128;
                    const v130 = headers.length;
                    const v131 = v130 - 1;
                    const v132 = headers[v131];
                    const v133 = accumulator[v132];
                    let v134;
                    if (v129) {
                        v134 = `${ v133 } ${ currentValue }`;
                    } else {
                        v134 = currentValue;
                    }
                    accumulator[v115] = v134;
                } else {
                    const v135 = headers[index];
                    accumulator[v135] = currentValue;
                }
                return accumulator;
            };
            const v137 = {};
            const v138 = v109.reduce(v136, v137);
            const v139 = accumulator.push(v138);
            v139;
            return accumulator;
        };
        const v141 = [];
        const v142 = v100.reduce(v140, v141);
        return v142;
    } catch (e) {
        const v143 = console.error(e);
        v143;
    }
};
v78.listProcessesOnPort = v144;
const listProcessesOnPort = v78.listProcessesOnPort;
const v145 = module.exports;
const v147 = async pid => {
    try {
        const v146 = `kill ${ pid }`;
        await exec(v146);
        return true;
    } catch (e) {
        return false;
    }
};
v145.killProcess = v147;
const killProcess = v145.killProcess;
const v148 = module.exports;
const v154 = async port => {
    try {
        const processesOnPort = await listProcessesOnPort(port);
        const v152 = theProcess => {
            const v149 = theProcess.pid;
            const success = killProcess(v149);
            const v150 = theProcess.pid;
            const v151 = {};
            v151.pid = v150;
            v151.success = success;
            return v151;
        };
        const killProcessResult = processesOnPort.map(v152);
        return killProcessResult;
    } catch (e) {
        const v153 = console.log(e);
        v153;
    }
};
v148.killAllProcessesOnPort = v154;
const killAllProcessesOnPort = v148.killAllProcessesOnPort;