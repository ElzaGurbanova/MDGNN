/**
 * https://github.com/castwide/ruby-spawn
 */
const { platform } = require('os');
const child_process = require('child_process');
const crossSpawn = require('cross-spawn');
const shellEscape = require('shell-escape');
const path = require('path');

let kill = function (child, command) {
	let ps = child_process.spawn('ps', ['-o', 'pid,ppid,tty', '-C', command]);
	let out = '';
	ps.stdout.on('data', (buffer) => {
		out += buffer.toString();
	});
	ps.on('exit', () => {
		let lines = out.split("\n");
		lines.shift();
		lines.pop();
		let nums = lines.filter((l) => {
			return l.match(/1[\s]+\?$/);
		}).map((l) => {
			return l.trim().split(' ')[0]
		});
		if (lines.length > 0) {
			child_process.spawn('kill', ['-9'].concat(nums));
		}
	});
}

function rubySpawn(command, args, opts = {}, forceKill = false) {
	let cmd = [command].concat(args);
	if (platform().match(/darwin|linux/)) {
		let shell = process.env.SHELL || '/bin/bash';
		// Pin to absolute, known-good shells only (avoid PATH hijack)
		const base = path.basename(shell);
		if (base === 'bash') shell = '/bin/bash';
		else if (base === 'zsh') shell = '/bin/zsh';
		else {
			// Unknown shell — avoid running arbitrary binary from env, use direct spawn
			return crossSpawn(cmd.shift(), cmd, opts);
		}

		// Build single string safely; keep existing quoting behavior
		let shellCmd = shellEscape(cmd);
		let finalCmd = shellCmd;
		if (opts['cwd']) {
			finalCmd = `${shellEscape(['cd', opts['cwd']])} && ${shellCmd}`;
		}
		let shellArgs = ['-l', '-c', finalCmd];
		let child = child_process.spawn(shell, shellArgs, opts);
		if (forceKill) {
			child.on('exit', (code, signal) => {
				kill(child, ['ruby', command].concat(args).join(' '));
			});
		}
		return child;
	} else {
		return crossSpawn(cmd.shift(), cmd, opts);
	}
}

module.exports = {
    rubySpawn
}

