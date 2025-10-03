const v99 = require('child_process');
const execFile = v99.execFile;
const v195 = async function (message, args, extra) {
    const api = extra.api;
    const v100 = message.member;
    const v101 = v100.roles;
    const v102 = v101.cache;
    const v105 = role => {
        const v103 = role.name;
        const v104 = v103 === 'MCadmin';
        return v104;
    };
    const v106 = v102.some(v105);
    const v107 = !v106;
    if (v107) {
        const v108 = this.logger;
        const v109 = message.author;
        const v110 = v109.tag;
        const v111 = message.author;
        const v112 = v111.id;
        const v113 = `User ${ v110 } (ID: ${ v112 }) attempted to use servermanager without MCadmin role.`;
        const v114 = v108.warn(v113);
        v114;
        const v115 = { content: 'You do not have permission to use this command.' };
        const v116 = message.reply(v115);
        return v116;
    }
    const serverShortName = args[1];
    const action = args[2];
    const v117 = !serverShortName;
    const v118 = !action;
    const v119 = v117 || v118;
    if (v119) {
        const v120 = this.syntax;
        const v121 = { content: `Invalid syntax. Usage: \`${ v120 }\`` };
        const v122 = message.reply(v121);
        return v122;
    }
    const validActions = [
        'start',
        'stop',
        'restart'
    ];
    const v123 = validActions.includes(action);
    const v124 = !v123;
    if (v124) {
        const v125 = validActions.join(', ');
        const v126 = { content: `Invalid action: "${ action }". Must be one of: ${ v125 }.` };
        const v127 = message.reply(v126);
        return v127;
    }
    let serverDetails;
    try {
        const v128 = { short_name: serverShortName };
        const respServer = await api.get('minecraft_server', v128);
        const v129 = respServer.minecraft_servers;
        const v130 = respServer.minecraft_servers;
        const v131 = v130[0];
        serverDetails = v129 && v131;
        const v132 = !serverDetails;
        if (v132) {
            const v133 = this.logger;
            const v134 = `Servermanager: Server with short_name "${ serverShortName }" not found in API.`;
            const v135 = v133.info(v134);
            v135;
            const v136 = { content: `No server found with short name "${ serverShortName }". Use \`,listmc\` to find a valid server.` };
            const v137 = message.reply(v136);
            return v137;
        }
    } catch (error) {
        const v138 = this.logger;
        const v139 = error.message;
        const v140 = v139 || error;
        const v141 = `Servermanager: Error fetching server data for "${ serverShortName }": ${ v140 }`;
        const v142 = v138.error(v141);
        v142;
        const v143 = { content: 'Error retrieving server information. Please try again.' };
        const v144 = message.reply(v143);
        return v144;
    }
    const safeShortNamePattern = /^[a-zA-Z0-9_-]+$/;
    const v145 = serverDetails.short_name;
    const v146 = safeShortNamePattern.test(v145);
    const v147 = !v146;
    if (v147) {
        const v148 = this.logger;
        const v149 = serverDetails.short_name;
        const v150 = `Servermanager: Invalid characters in server short_name from database: "${ v149 }". Aborting.`;
        const v151 = v148.error(v150);
        v151;
        const v152 = serverDetails.short_name;
        const v153 = { content: `The server short name ("${ v152 }") contains invalid characters and cannot be used.` };
        const v154 = message.reply(v153);
        return v154;
    }
    const v155 = serverDetails.short_name;
    const serviceName = `${ v155 }.service`;
    const argv = [
        'systemctl',
        action,
        serviceName
    ];
    const v156 = this.logger;
    const v157 = message.author;
    const v158 = v157.tag;
    const v159 = argv.join(' ');
    const v160 = `Servermanager: User ${ v158 } attempting to execute: sudo ${ v159 }`;
    const v161 = v156.info(v160);
    v161;
    const v162 = message.channel;
    const v163 = serverDetails.display_name;
    const v164 = { content: `Attempting to ${ action } server "${ v163 }" (service: ${ serviceName })...` };
    const v165 = v162.send(v164);
    v165;
    const v166 = { windowsHide: true };
    const v193 = (error, stdout, stderr) => {
        if (error) {
            const v167 = this.logger;
            const v168 = argv.join(' ');
            const v169 = error.message;
            const v170 = `Servermanager: Error executing command "sudo ${ v168 }": ${ v169 }`;
            const v171 = v167.error(v170);
            v171;
            if (stderr) {
                const v172 = this.logger;
                const v173 = `Servermanager: stderr: ${ stderr }`;
                const v174 = v172.error(v173);
                v174;
            }
            const v175 = message.channel;
            const v176 = serverDetails.display_name;
            const v177 = error.message;
            const v178 = { content: `Failed to ${ action } server "${ v176 }". Error: ${ v177 }. Check bot logs for details.` };
            const v179 = v175.send(v178);
            return v179;
        }
        const v180 = serverDetails.display_name;
        let outputMessage = `Server "${ v180 }" ${ action } command processed.\n`;
        if (stdout) {
            const v181 = this.logger;
            const v182 = `Servermanager: stdout: ${ stdout }`;
            const v183 = v181.info(v182);
            v183;
            outputMessage += `Output:\n\`\`\`\n${ stdout }\n\`\`\`\n`;
        }
        if (stderr) {
            const v184 = this.logger;
            const v185 = `Servermanager: stderr (might be informational): ${ stderr }`;
            const v186 = v184.warn(v185);
            v186;
            outputMessage += `Info/Warnings:\n\`\`\`\n${ stderr }\n\`\`\`\n`;
        }
        const v187 = !stdout;
        const v188 = !stderr;
        const v189 = v187 && v188;
        if (v189) {
            outputMessage += 'No specific output from the command.';
        }
        const v190 = message.channel;
        const v191 = { content: outputMessage };
        const v192 = v190.send(v191);
        v192;
    };
    const v194 = execFile('sudo', argv, v166, v193);
    v194;
};
const v196 = {};
v196.name = 'servermanager';
v196.description = 'Manages Minecraft server instances (start, stop, restart). Assumes services are named [server_short_name].service.';
v196.syntax = 'servermanager [server_short_name] [start|stop|restart]';
v196.num_args = 2;
v196.args_to_lower = true;
v196.needs_api = true;
v196.has_state = false;
v196.execute = v195;
module.exports = v196;