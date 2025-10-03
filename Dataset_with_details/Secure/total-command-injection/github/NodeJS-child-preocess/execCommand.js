import { execFile } from "child_process";

/**
 * Executes commands safely using child_process.execFile (argv arrays, no shell).
 * Avoids command injection when arguments may come from untrusted input.
 */

// Basic execution example (list files)
execFile("ls", ["-l"], { windowsHide: true }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Command error: ${stderr}`);
    return;
  }
  console.log(`Command output:\n${stdout}`);
});

// Advanced example with options
const options = {
  timeout: 5000,
  maxBuffer: 1024 * 1024,
  encoding: "utf8",
  cwd: process.cwd(),
  windowsHide: true,
};

// Find JS files (no shell)
execFile(
  "find",
  [".", "-type", "f", "-name", "*.js"],
  options,
  (error, stdout, stderr) => {
    if (error) {
      if (error.code === "ETIMEDOUT") {
        console.error("Command timed out");
      } else {
        console.error(`Error: ${error.message}`);
      }
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    const files = stdout.trim() ? stdout.trim().split("\n") : [];
    console.log(`Found ${files.length} JavaScript files`);
  }
);

// Real-world: safe arg passing (no manual escaping needed)
const fileName = "example.txt";
execFile("ls", ["-l", fileName], { windowsHide: true }, (error, stdout) => {
  if (error) {
    console.error(`File not found: ${fileName}`);
    return;
  }
  console.log(`File info:\n${stdout}`);
});

// Promisified version for async/await
function execFileAsync(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { windowsHide: true, ...opts }, (error, stdout, stderr) => {
      if (error) {
        error.stderr = stderr;
        return reject(error);
      }
      resolve({ stdout, stderr });
    });
  });
}

async function listDirectory() {
  try {
    const { stdout } = await execFileAsync("ls", ["-l"]);
    console.log(`Directory contents:\n${stdout}`);
  } catch (error) {
    console.error(`Failed to list directory: ${error.stderr || error.message}`);
  }
}

listDirectory();

