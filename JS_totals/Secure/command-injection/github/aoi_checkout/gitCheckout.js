const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

module.exports = {
  name: "$gitCheckout",
  type: "function",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    const [args = ""] = data.inside.splits;

    const ref = String(args || "").trim();

    // Ensure we're in a git repo
    try {
      await execFileAsync("git", ["rev-parse", "--is-inside-work-tree"], { shell: false });
    } catch {
      data.result = "Not a git repository. Run 'git init' first.";
      return { code: d.util.setCode(data) };
    }

    if (!ref) {
      data.result = "No ref provided. Usage: $gitCheckout[branch-or-ref]";
      return { code: d.util.setCode(data) };
    }

    // Basic allowlist for branch/ref names
    const validRef = /^[A-Za-z0-9._/\-]+$/.test(ref);
    if (!validRef) {
      data.result = "Invalid ref name.";
      return { code: d.util.setCode(data) };
    }

    try {
      // Execute without a shell
      const { stdout, stderr } = await execFileAsync("git", ["checkout", ref], {
        shell: false,
        maxBuffer: 1024 * 1024
      });

      if (stderr && !/Switched to|Already on|Your branch is up to date/i.test(stderr)) {
        console.warn("Git checkout warning:", stderr);
      }

      data.result = `Switched to: ${ref}`;
    } catch (error) {
      console.error("Git checkout error:", error.stderr || error.message);
      data.result = `Checkout failed: ${error.stderr || error.message}`;
    }

    return { code: d.util.setCode(data) };
  }
};

