const { execFile } = require('child_process');
const vscode = require('vscode');

class GitService {
  constructor() {
    this.workspaceRoot = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : null;

    this.repositoryInitialized = false;
    this.initializeRepository();
  }

  async initializeRepository() {
    try {
      this.workspaceRoot = await this.findGitRepository();
      this.repositoryInitialized = true;
    } catch (error) {
      console.error('Failed to find Git repository:', error.message);
    }
  }

  // Simple argv splitter (current code never supported quoted spaces anyway)
  _splitArgs(str) {
    return String(str).trim().split(/\s+/).filter(Boolean);
  }

  _validateNoDanger(s) {
    if (/[;&|`$]/.test(s)) throw new Error('Invalid characters in argument');
  }

  _validateBranchName(name) {
    if (typeof name !== 'string' || !name.trim()) throw new Error('Invalid branch name');
    if (name.startsWith('-')) throw new Error('Branch name must not start with "-"');
    if (/[;&|`$]/.test(name)) throw new Error('Invalid characters in branch name');
  }

  /**
   * Execute a git command safely (no shell).
   * @param {string} command
   * @param {string} [cwd]
   */
  async executeGitCommand(command, cwd) {
    if (!command || typeof command !== 'string') throw new Error('Invalid git command');

    // basic guard against shell metas in the whole string
    this._validateNoDanger(command);

    const args = this._splitArgs(command);
    const workingDir = cwd || this.workspaceRoot;
    if (!workingDir) throw new Error('No workspace folder found');

    return new Promise((resolve, reject) => {
      execFile('git', args, { cwd: workingDir, windowsHide: true, timeout: 10000 }, (error, stdout, stderr) => {
        if (error) return reject(new Error(stderr?.trim() || error.message));
        resolve((stdout || '').trim());
      });
    });
  }

  async findGitRepository() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('No workspace folders found');
    }

    for (const folder of workspaceFolders) {
      try {
        const folderPath = folder.uri.fsPath;
        await this.executeGitCommand('rev-parse --git-dir', folderPath);
        return folderPath;
      } catch (_) { /* not a repo */ }
    }
    throw new Error('No Git repository found in workspace folders');
  }

  async getBranches() {
    try {
      const output = await this.executeGitCommand('branch -a');
      const branches = { local: [], remote: [] };

      output.split('\n').forEach(line => {
        const branch = line.replace(/^\*?\s*/, '').trim();
        if (!branch) return;

        if (branch.startsWith('remotes/')) {
          const remoteBranch = branch.replace(/^remotes\//, '');
          if (!remoteBranch.endsWith('/HEAD')) branches.remote.push(remoteBranch);
        } else {
          branches.local.push(branch);
        }
      });

      return branches;
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to get branches: ${error.message}`);
      return { local: [], remote: [] };
    }
  }

  async getCurrentBranch() {
    try {
      return await this.executeGitCommand('rev-parse --abbrev-ref HEAD');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to get current branch: ${error.message}`);
      return '';
    }
  }

  async checkoutBranch(branchName) {
    try {
      if (!branchName || typeof branchName !== 'string') throw new Error('Invalid branch name');
      this._validateBranchName(branchName);

      let cmd = null;

      if (branchName.includes('/') && !branchName.startsWith('remotes/')) {
        const [remote, ...branchParts] = branchName.split('/');
        const branch = branchParts.join('/');

        this._validateBranchName(branch);

        try {
          const localBranches = await this.executeGitCommand('branch');
          const branchExists = localBranches.split('\n').map(b => b.replace(/^\*?\s*/, '').trim()).includes(branch);
          cmd = branchExists ? `checkout ${branch}` : `checkout -b ${branch} ${branchName}`;
        } catch (_) {
          cmd = `checkout -b ${branch} ${branchName}`;
        }
      } else {
        cmd = `checkout ${branchName}`;
      }

      await this.executeGitCommand(cmd);
    } catch (error) {
      throw new Error(`Failed to checkout branch: ${error.message}`);
    }
  }

  async createBranch(branchName) {
    try {
      this._validateBranchName(branchName);
      await this.executeGitCommand(`checkout -b ${branchName}`);
    } catch (error) {
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }

  async deleteBranch(branchName, force = false) {
    try {
      this._validateBranchName(branchName);
      const flag = force ? '-D' : '-d';
      await this.executeGitCommand(`branch ${flag} ${branchName}`);
    } catch (error) {
      throw new Error(`Failed to delete branch: ${error.message}`);
    }
  }

  async fetchBranches() {
    try {
      await this.executeGitCommand('fetch --prune');
    } catch (error) {
      throw new Error(`Failed to fetch branches: ${error.message}`);
    }
  }
}

module.exports = GitService;

