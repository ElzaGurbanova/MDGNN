/**
 * Command Execution Module
 *
 * This module provides utilities for safely executing git commands by
 * avoiding the shell entirely. It uses execFileSync with an argument array,
 * which prevents command injection via shell metacharacters.
 */

import { execFileSync } from 'child_process';
import path from 'path';

/**
 * Split a base command like "git show" into ["git", "show"].
 * This expects a developer-supplied string (not user input).
 */
function splitBaseCommand(baseCommand) {
  if (Array.isArray(baseCommand)) return baseCommand.filter(Boolean);
  if (typeof baseCommand !== 'string') {
    throw new Error('baseCommand must be a string or string[]');
  }
  return baseCommand.trim().split(/\s+/).filter(Boolean);
}

/**
 * Ensure we're only invoking git (defense-in-depth).
 */
function assertGitCommand(cmd) {
  const base = path.basename(String(cmd)).toLowerCase();
  if (base !== 'git' && base !== 'git.exe') {
    throw new Error('Only the "git" binary is allowed in execGitSafe');
  }
}

/**
 * Safely execute git commands without a shell.
 *
 * @param {string|string[]} baseCommand - e.g., 'git show' or ['git','show']
 * @param {Array<string>} args - Arguments passed verbatim (no shell)
 * @param {Object} options - child_process options (e.g., { cwd })
 * @returns {string|Buffer} The command output
 *
 * @example
 * const out = execGitSafe('git show', ['HEAD~1', 'src/file.js'], { cwd: '/path/to/repo' });
 */
export function execGitSafe(baseCommand, args = [], options = {}) {
  const parts = splitBaseCommand(baseCommand);
  const cmd = parts.shift();
  if (!cmd) throw new Error('Invalid baseCommand');

  // Optional allowlist: only allow git
  assertGitCommand(cmd);

  // Convert all args to strings; execFileSync concatenates them as argv, not via a shell
  const finalArgs = parts.concat(args.map((a) => String(a)));

  // shell:false is implied for execFileSync; included here for clarity
  return execFileSync(cmd, finalArgs, { ...options, shell: false });
}

/* NOTE:
 * The previous escapeShellArg() approach is unnecessary (and risky on Windows)
 * now that we avoid the shell entirely via execFileSync.
 */

