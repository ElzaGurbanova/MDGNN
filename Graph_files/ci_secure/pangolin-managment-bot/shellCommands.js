const v52 = require('child_process');
const execFile = v52.execFile;
const util = require('util');
const execFilePromise = util.promisify(execFile);
const v53 = require('net');
const isIP = v53.isIP;
const v54 = process.env;
const v55 = v54.DOCKER_BIN;
const DOCKER_BIN = v55 || 'docker';
const executeCommand = async function (command, options = {}) {
    try {
        let cmd;
        let args;
        const v56 = Array.isArray(command);
        if (v56) {
            const v57 = command.map(String);
            [cmd, ...args] = v57;
        } else {
            const v58 = new Error('executeCommand expects an argv array like ["cmd", "arg1", ...]');
            throw v58;
        }
        const v60 = options.timeout;
        const v61 = v60 || 30000;
        const v62 = 1024 * 1024;
        const v63 = {
            timeout: v61,
            maxBuffer: v62,
            windowsHide: true
        };
        const v59 = await execFilePromise(cmd, args, v63);
        const stdout = v59.stdout;
        const stderr = v59.stderr;
        const v64 = {};
        v64.success = true;
        v64.stdout = stdout;
        v64.stderr = stderr;
        return v64;
    } catch (error) {
        const v65 = error.message;
        const v66 = `Command execution error: ${ v65 }`;
        const v67 = console.error(v66);
        v67;
        const v68 = error.message;
        const v69 = error.stdout;
        const v70 = error.stderr;
        const v71 = {};
        v71.success = false;
        v71.error = v68;
        v71.stdout = v69;
        v71.stderr = v70;
        return v71;
    }
};
const v74 = async () => {
    const v72 = [
        DOCKER_BIN,
        'exec',
        'crowdsec',
        'cscli',
        'decisions',
        'list',
        '-o',
        'human'
    ];
    const v73 = executeCommand(v72);
    return v73;
};
const v82 = async ip => {
    const v75 = String(ip);
    const v76 = isIP(v75);
    const v77 = !v76;
    if (v77) {
        const v78 = {};
        v78.success = false;
        v78.error = 'Invalid IP address';
        return v78;
    }
    const v79 = String(ip);
    const v80 = [
        DOCKER_BIN,
        'exec',
        'crowdsec',
        'cscli',
        'decisions',
        'delete',
        '--ip',
        v79
    ];
    const v81 = executeCommand(v80);
    return v81;
};
const v90 = async ip => {
    const v83 = String(ip);
    const v84 = isIP(v83);
    const v85 = !v84;
    if (v85) {
        const v86 = {};
        v86.success = false;
        v86.error = 'Invalid IP address';
        return v86;
    }
    const v87 = String(ip);
    const v88 = [
        DOCKER_BIN,
        'exec',
        'crowdsec',
        'cscli',
        'decisions',
        'add',
        '--ip',
        v87,
        '--type',
        'whitelist',
        '--duration',
        '8760h'
    ];
    const v89 = executeCommand(v88);
    return v89;
};
const v93 = async () => {
    const v91 = [
        DOCKER_BIN,
        'ps',
        '--filter',
        'name=crowdsec',
        '--format',
        '{{.Status}}'
    ];
    const v92 = executeCommand(v91);
    return v92;
};
const crowdsecCommands = {};
crowdsecCommands.listDecisions = v74;
crowdsecCommands.unbanIp = v82;
crowdsecCommands.whitelistIpInCrowdsec = v90;
crowdsecCommands.checkCrowdsecHealth = v93;
const v96 = async () => {
    const v94 = [
        DOCKER_BIN,
        'ps',
        '--filter',
        'name=traefik',
        '--format',
        '{{.Status}}'
    ];
    const v95 = executeCommand(v94);
    return v95;
};
const v99 = async () => {
    const v97 = [
        DOCKER_BIN,
        'restart',
        'traefik'
    ];
    const v98 = executeCommand(v97);
    return v98;
};
const traefikCommands = {};
traefikCommands.checkTraefikHealth = v96;
traefikCommands.restartTraefik = v99;
const v101 = async () => {
    const containers = [
        'pangolin',
        'gerbil',
        'traefik',
        'crowdsec'
    ];
    const results = {};
    let container;
    for (container of containers) {
        const v100 = [
            DOCKER_BIN,
            'ps',
            '--filter',
            `name=${ container }`,
            '--format',
            '{{.Status}}'
        ];
        results[container] = await executeCommand(v100);
    }
    return results;
};
const stackCommands = {};
stackCommands.checkStackHealth = v101;
const v102 = {};
v102.executeCommand = executeCommand;
v102.crowdsecCommands = crowdsecCommands;
v102.traefikCommands = traefikCommands;
v102.stackCommands = stackCommands;
module.exports = v102;