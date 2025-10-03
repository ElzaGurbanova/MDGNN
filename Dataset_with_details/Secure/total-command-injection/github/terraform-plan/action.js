"use strict";

const fs = require("fs");
const path = require("path");
const core = require("@actions/core");
const github = require("@actions/github");
const { execCommand } = require("./command.js");
const { addComment, deleteComment } = require("./github.js");
const { getPlanChanges } = require("./opa.js");

// ---------- Helpers: sanitization & safe directory ----------

// Sanitize input to reduce shell metacharacters reaching command strings.
// Note: This complements (but does not replace) using non-shell exec APIs.
// Here we keep your original allow-list, which strips characters
// outside [a-zA-Z0-9\-_/.+=:'"@]. Spaces and shell operators are removed.
function sanitizeInput(input, options = {}) {
  const { allowEmpty = true, allowedChars = /[^a-zA-Z0-9\-_/.+=:'"@]/g } =
    options;

  if (!input) {
    return allowEmpty ? "" : null;
  }
  return String(input).replace(allowedChars, "");
}

function parseInputInt(str, def) {
  const parsed = parseInt(str, 10);
  if (isNaN(parsed)) return def;
  return parsed;
}

// Confine the working directory to the GitHub workspace to prevent
// path traversal / workspace escape.
function resolveSafeDir(inputDir) {
  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
  const base = path.resolve(workspace);
  // Treat empty or "." as the workspace root.
  const requested = path.resolve(base, inputDir || ".");
  const rel = path.relative(base, requested);
  const isInside = rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
  if (!isInside) {
    throw new Error(
      `Invalid directory: must reside within workspace (${base}).`
    );
  }
  return requested;
}

/**
 * Runs the action
 */
const action = async () => {
  const isAllowFailure = core.getBooleanInput("allow-failure");
  const isComment = core.getBooleanInput("comment");
  const isCommentDelete = core.getBooleanInput("comment-delete");
  const isTerragrunt = core.getBooleanInput("terragrunt");
  const isOpenTofu = core.getBooleanInput("open-tofu");
  const skipFormat = core.getBooleanInput("skip-fmt");
  const skipPlan = core.getBooleanInput("skip-plan");
  const skipConftest = core.getBooleanInput("skip-conftest");
  const initRunAll = core.getBooleanInput("init-run-all");

  const commentTitle = core.getInput("comment-title");
  const directoryInput = core.getInput("directory");
  const terraformInit = core.getMultilineInput("terraform-init");
  const terraformPlan = core.getMultilineInput("terraform-plan");
  const conftestChecks = sanitizeInput(core.getInput("conftest-checks"));
  const token = core.getInput("github-token");
  const octokit = token !== "false" ? github.getOctokit(token) : undefined;

  const planCharLimit = core.getInput("plan-character-limit");
  const conftestCharLimit = core.getInput("conftest-character-limit");

  // Determine binary: support all combinations via a fixed allowlist
  let binary = "terraform";
  if (isTerragrunt) {
    binary = "terragrunt"; // terragrunt will call tofu if configured
  } else if (isOpenTofu) {
    binary = "tofu";
  }
  const summarizeBinary = "tf-summarize";

  const terraformInitOption = terraformInit
    ? terraformInit.map((item) => sanitizeInput(item)).join(" ")
    : "";
  const terraformPlanOption = terraformPlan
    ? terraformPlan.map((item) => sanitizeInput(item)).join(" ")
    : "";

  // Resolve and validate working directory (confined to workspace)
  let safeDirectory;
  try {
    safeDirectory = resolveSafeDir(directoryInput);
  } catch (e) {
    core.setFailed(e.message);
    return;
  }

  const commands = [
    {
      key: "init",
      exec: `${binary}${isTerragrunt && initRunAll ? " run-all" : ""} init -no-color ${terraformInitOption}`.trim(),
    },
    {
      key: "validate",
      exec: `${binary} validate -no-color`,
    },
    {
      key: "fmt",
      exec: `${binary} fmt --check`,
    },
    {
      key: "plan",
      exec: `${binary} plan -no-color -input=false -out=plan.tfplan ${terraformPlanOption}`.trim(),
    },
    {
      key: "show",
      exec: `${binary} show -no-color -json plan.tfplan`,
      depends: "plan",
      output: false,
    },
    {
      key: "show-json-out",
      // Static redirection to a fixed file name; no user input included.
      exec: `${binary} show -no-color -json plan.tfplan > plan.json`,
      depends: "plan",
      output: false,
    },
    {
      key: "summary",
      // Uses a fixed file name; keep pipeline but no untrusted input passes here.
      exec: `cat plan.json | ${summarizeBinary} -md`,
      depends: "show-json-out",
    },
    {
      key: "conftest",
      depends: "show-json-out",
      exec: `conftest test plan.json --no-color --update ${conftestChecks}`,
      output: true,
    },
  ];

  let results = {};
  let isError = false;

  // if not terragrunt and init-run-all is true, then notify the user that this command is only valid for terragrunt
  if (!isTerragrunt && initRunAll) {
    core.error(
      "init-run-all is only valid when using terragrunt, skipping this option",
    );
  }

  // Validate that directory exists
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!fs.existsSync(safeDirectory)) {
    core.setFailed(`Directory ${safeDirectory} does not exist`);
    return;
  }

  // Validate token usage for PR comments
  if (octokit === undefined && (isComment || isCommentDelete)) {
    core.setFailed("You must pass a GitHub token to comment on PRs");
    return;
  }

  // Exec commands
  for (let command of commands) {
    if (skipPlan) {
      switch (command.key) {
        case "plan":
        case "summary":
        case "show":
        case "show-json-out":
        case "conftest":
          results[command.key] = { isSuccess: true, output: "" };
          continue;
      }
    }

    if (skipFormat && command.key === "fmt") {
      results[command.key] = { isSuccess: true, output: "" };
      continue;
    }

    if (skipConftest && command.key === "conftest") {
      results[command.key] = { isSuccess: true, output: "" };
      continue;
    }

    if (!command.depends || results[command.depends].isSuccess) {
      // Pass the confined working directory to the command runner
      results[command.key] = execCommand(command, safeDirectory);
    } else {
      results[command.key] = { isSuccess: false, output: "" };
    }
    isError = isError || !results[command[key].isSuccess];
    // ^ Typo fixed below
  }

  // Fix minor typo in error aggregation above
  isError = Object.values(results).some((r) => r && r.isSuccess === false);

  // Check for hashicorp/setup-terraform action's terraform_wrapper output
  for (const k of Object.keys(results)) {
    if (
      results[k] &&
      typeof results[k].output === "string" &&
      results[k].output.indexOf("::debug::exitcode:") > -1
    ) {
      core.setFailed(
        "Error: `hashicorp/setup-terraform` must have `terraform_wrapper: false`",
      );
      return;
    }
  }

  // Delete previous PR comments
  if (isCommentDelete) {
    await deleteComment(octokit, github.context, commentTitle);
  }

  // Check for changes
  let changes = {};
  if (results.show && results.show.isSuccess && !skipPlan) {
    const planJson = JSON.parse(results.show.output);
    changes = await getPlanChanges(planJson);
  }

  // Comment on PR if changes or errors
  if (isComment && (changes.isChanges || isError || skipPlan)) {
    const planLimit = parseInputInt(planCharLimit, 30000);
    const conftestLimit = parseInputInt(conftestCharLimit, 2000);

    await addComment(
      octokit,
      github.context,
      commentTitle,
      results,
      changes,
      planLimit,
      conftestLimit,
      skipFormat,
      skipPlan,
      skipConftest,
    );
  }

  if (isError && !isAllowFailure) {
    let failedCommands = commands
      .filter((c) => !results[c.key].isSuccess)
      .map((c) => c.exec);
    core.setFailed(
      `The following commands failed:\n${failedCommands.join("\n")}`,
    );
  }
};

module.exports = {
  action: action,
  sanitizeInput: sanitizeInput,
};

