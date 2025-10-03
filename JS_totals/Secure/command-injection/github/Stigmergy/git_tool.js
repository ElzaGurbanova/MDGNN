import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// Split a simple command string into argv (for internal use only)
function splitArgs(str) {
  if (!str) return [];
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(str))) out.push(m[1] || m[2] || m[3]);
  return out;
}

/**
 * Executes a command without a shell and returns the output.
 * @param {string} cmd - binary name
 * @param {string[]} argv - arguments array
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
async function runFile(cmd, argv) {
  const { stdout, stderr } = await execFileAsync(cmd, argv, { shell: false, maxBuffer: 1024 * 1024 });
  return { stdout, stderr };
}

/**
 * Executes a legacy string command safely by splitting to argv (internal).
 * Prefer runFile in new code.
 */
async function runCommand(command) {
  const [cmd, ...argv] = splitArgs(String(command));
  if (!cmd) throw new Error("Empty command");
  return runFile(cmd, argv);
}

/**
 * @module git_tool
 * @description A tool for interacting with Git repositories.
 */

/**
 * Stages all changes and commits them with a given message.
 * @param {object} args
 * @param {string} args.message - The commit message.
 * @returns {Promise<string>}
 */
export async function commit({ message }) {
  if (!message || message.trim() === "") {
    throw new Error("A non-empty commit message is required.");
  }

  // Stage all changes
  await runFile("git", ["add", "."]);

  // Commit with the provided message, no shell
  const { stdout } = await runFile("git", ["commit", "-m", message]);

  return `Successfully committed changes: ${stdout.trim()}`;
}

/**
 * Pushes changes to a remote repository.
 * @param {object} args
 * @param {string} args.remote - e.g., 'origin'
 * @param {string} args.branch - e.g., 'main'
 * @returns {Promise<string>}
 */
export async function push({ remote = "origin", branch = "main" }) {
  if (!remote || !branch) {
    throw new Error("Both 'remote' and 'branch' are required for push.");
  }
  const validPattern = /^[a-zA-Z0-9_.\-\/]+$/;
  if (!validPattern.test(remote) || !validPattern.test(branch)) {
    throw new Error("Invalid remote or branch name contains unsafe characters.");
  }

  const { stdout, stderr } = await runFile("git", ["push", remote, branch]);

  if (stderr && !stderr.includes("Everything up-to-date")) {
    return `Push completed with warnings: ${stderr}`;
  }

  return `Successfully pushed to ${remote}/${branch}.`;
}

