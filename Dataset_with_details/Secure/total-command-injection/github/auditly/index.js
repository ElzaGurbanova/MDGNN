#!/usr/bin/env node

const { spawn } = require("child_process");
const { parseAuditData } = require("./parser");
const { buildHtml } = require("./htmlbuilder");
const path = require("path");

// Validate registry URL
const isValidRegistryUrl = (registryUrl) => {
  try {
    const parsed = new URL(registryUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Redact credentials in logs if a URL like https://user:pass@host is provided
function redactUrlForLog(u) {
  try {
    const p = new URL(u);
    p.username = "";
    p.password = "";
    return p.toString();
  } catch {
    return u;
  }
}

// Ensure outputDirPath stays inside the current working directory
function resolveSafeOutputDir(outputDirPath) {
  const base = path.resolve(process.cwd());
  const requestedBase = path.resolve(base, outputDirPath || ".");
  const rel = path.relative(base, requestedBase);
  const isInside = rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
  if (!isInside) {
    throw new Error(
      `Invalid output directory: must reside within the working directory (${base}).`
    );
  }
  return path.join(requestedBase, "auditly-output");
}

module.exports.runAuditly = (options) => {
  // Input validation
  if (!options || typeof options !== "object") {
    throw new Error("Invalid options provided");
  }

  const registryUrl = options.registryUrl;
  if (!registryUrl || !isValidRegistryUrl(registryUrl)) {
    throw new Error("Invalid registry URL provided");
  }

  // Constrain output dir to cwd (prevents path traversal / workspace escape)
  const outputDir = resolveSafeOutputDir(options.outputDirPath);

  console.log(`Running Auditly against registry: ${redactUrlForLog(registryUrl)}`);

  // Use the validated URL directly; args array + shell:false prevents injection
  const parsedRegistryUrl = new URL(registryUrl).toString();

  const runAudit = spawn(
    "npm",
    ["audit", "--json", `--registry=${parsedRegistryUrl}`],
    { shell: false }
  );

  let auditData = "";
  let stderr = "";

  runAudit.stdout.on("data", (chunk) => {
    const data = chunk.toString();
    auditData += data;
    console.log("npm audit stdout:", data);
  });

  runAudit.stderr.on("data", (data) => {
    const error = data.toString();
    stderr += error;
    console.error("npm audit stderr:", error);
  });

  return new Promise((resolve, reject) => {
    runAudit.on("exit", (exitCode) => {
      // npm audit returns 1 when vulnerabilities are found (not an error for us)
      if (exitCode !== 0 && exitCode !== 1) {
        console.error("npm audit failed with the following error:");
        console.error("stdout:", auditData);
        console.error("stderr:", stderr);
        reject(new Error(`npm audit failed with exit code ${exitCode}`));
        return;
      }

      try {
        if (!auditData) {
          throw new Error("No audit data received");
        }
        const parsedData = JSON.parse(auditData);
        const auditOutput = parseAuditData(parsedData);

        // Ensure destination exists (htmlbuilder may also create it; harmless if already exists)
        try {
          require("fs").mkdirSync(outputDir, { recursive: true });
        } catch {}

        buildHtml(auditOutput, outputDir);
        console.log(`Report is located at: ${outputDir}`);
        resolve(outputDir);
      } catch (error) {
        reject(new Error(`Failed to process audit data: ${error.message}`));
      }
    });

    runAudit.on("error", (error) => {
      reject(new Error(`Failed to run npm audit: ${error.message}`));
    });
  });
};

