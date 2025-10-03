const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

module.exports = {
  name: "$gitClone",
  type: "function",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    const [args = ""] = data.inside.splits;

    const repo = String(args || "").trim();

    // Require a single repository URL/SSH spec (no spaces)
    if (!repo || /\s/.test(repo)) {
      data.result = "Repository URL is required (no spaces).";
      return { code: d.util.setCode(data) };
    }

    // Basic allowlist for common git repo formats
    const looksLikeRepo =
      /^https?:\/\/[^ ]+\.git$/.test(repo) || // http(s)://... .git
      /^git:\/\/[^ ]+\.git$/.test(repo) ||    // git://... .git
      /^ssh:\/\/[^ ]+\.git$/.test(repo) ||    // ssh://... .git
      /^[\w.-]+@[\w.-]+:[\w./-]+\.git$/.test(repo); // git@host:org/repo.git

    if (!looksLikeRepo) {
      data.result = "Invalid repository URL/SSH spec.";
      return { code: d.util.setCode(data) };
    }

    try {
      // Execute without a shell
      const { stdout, stderr } = await execFileAsync("git", ["clone", repo], {
        shell: false,
        maxBuffer: 1024 * 1024
      });

      if (stderr && !/Cloning into/i.test(stderr)) {
        console.warn("Git clone warning:", stderr);
      }

      // Derive repo name from URL/SSH spec
      const m = repo.match(/([^/]+)\.git$/);
      const repoName = m ? m[1] : repo;

      data.result = `Successfully cloned repository: ${repoName}`;
    } catch (error) {
      console.error("Git clone error:", error.stderr || error.message);
      data.result = `Clone failed: ${error.stderr || error.message}`;
    }

    return { code: d.util.setCode(data) };
  }
};

