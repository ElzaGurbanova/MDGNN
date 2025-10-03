// backend/shellCommands.js
const { execFile } = require('child_process');
const util = require('util');
const execFilePromise = util.promisify(execFile);
const { isIP } = require('net');

const DOCKER_BIN = process.env.DOCKER_BIN || 'docker';

/**
 * Executes a command safely without a shell (argv array)
 */
async function executeCommand(command, options = {}) {
  try {
    let cmd, args;
    if (Array.isArray(command)) {
      [cmd, ...args] = command.map(String);
    } else {
      throw new Error('executeCommand expects an argv array like ["cmd", "arg1", ...]');
    }

    const { stdout, stderr } = await execFilePromise(cmd, args, {
      timeout: options.timeout || 30000,
      maxBuffer: 1024 * 1024,
      windowsHide: true
    });

    return { success: true, stdout, stderr };
  } catch (error) {
    console.error(`Command execution error: ${error.message}`);
    return {
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

/**
 * CrowdSec specific commands
 */
const crowdsecCommands = {
  listDecisions: async () => {
    return executeCommand([DOCKER_BIN, 'exec', 'crowdsec', 'cscli', 'decisions', 'list', '-o', 'human']);
  },

  unbanIp: async (ip) => {
    if (!isIP(String(ip))) {
      return { success: false, error: 'Invalid IP address' };
    }
    return executeCommand([DOCKER_BIN, 'exec', 'crowdsec', 'cscli', 'decisions', 'delete', '--ip', String(ip)]);
  },

  whitelistIpInCrowdsec: async (ip) => {
    if (!isIP(String(ip))) {
      return { success: false, error: 'Invalid IP address' };
    }
    return executeCommand([DOCKER_BIN, 'exec', 'crowdsec', 'cscli', 'decisions', 'add', '--ip', String(ip), '--type', 'whitelist', '--duration', '8760h']);
  },

  checkCrowdsecHealth: async () => {
    return executeCommand([DOCKER_BIN, 'ps', '--filter', 'name=crowdsec', '--format', '{{.Status}}']);
  }
};

/**
 * Traefik specific commands
 */
const traefikCommands = {
  checkTraefikHealth: async () => {
    return executeCommand([DOCKER_BIN, 'ps', '--filter', 'name=traefik', '--format', '{{.Status}}']);
  },

  restartTraefik: async () => {
    return executeCommand([DOCKER_BIN, 'restart', 'traefik']);
  }
};

/**
 * Stack health commands
 */
const stackCommands = {
  checkStackHealth: async () => {
    const containers = ['pangolin', 'gerbil', 'traefik', 'crowdsec'];
    const results = {};

    for (const container of containers) {
      results[container] = await executeCommand([DOCKER_BIN, 'ps', '--filter', `name=${container}`, '--format', '{{.Status}}']);
    }
    return results;
  }
};

module.exports = {
  executeCommand,
  crowdsecCommands,
  traefikCommands,
  stackCommands
};

