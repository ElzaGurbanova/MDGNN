import dotenv from 'dotenv';
import { execFile } from 'child_process';
import arg from 'arg';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

dotenv.config();

if (!process.env.npm_lifecycle_event) {
  // Make sure this script isn't used elsewhere since it previously used a shell
  console.error(
    'This script should only be run from a package.json script.',
  );
  process.exit(1);
}

const argSpec = {
  '--location': String,
  '--file': String,
};

const args = arg(argSpec);

// get the env and file values
const inputLocation = args['--location'] || 'local'; // 'local' or 'remote'
const inputFile = args['--file'];

const DATABASE_NAME = process.env.DATABASE_NAME;
if (!DATABASE_NAME) {
  console.error('Missing DATABASE_NAME environment variable.');
  process.exit(1);
}

// Allow only sane DB names to avoid odd argv/option behavior
const DB_NAME_RE = /^[A-Za-z0-9_.-]+$/;
if (!DB_NAME_RE.test(DATABASE_NAME)) {
  console.error('Invalid DATABASE_NAME format.');
  process.exit(1);
}

if (inputLocation !== 'local' && inputLocation !== 'remote') {
  console.error('Invalid location. Use "local" or "remote".');
  process.exit(1);
}

if (!inputFile || typeof inputFile !== 'string') {
  console.error('You must pass --file <path-to-sql-file>.');
  process.exit(1);
}

const resolvedFile = path.resolve(process.cwd(), inputFile);
if (!fs.existsSync(resolvedFile)) {
  console.error(`File not found: ${resolvedFile}`);
  process.exit(1);
}
if (path.basename(resolvedFile).startsWith('-')) {
  console.error('File name must not start with "-".');
  process.exit(1);
}

// Optionally allow pinning wrangler binary
const WRANGLER_BIN = process.env.WRANGLER_BIN || 'wrangler';

if (inputLocation === 'remote') {
  // Create a readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Ask for confirmation
  rl.question(
    '⚠️ WARNING: Are you sure you want to run this command on the remote database? This will affect the production database.\nType "yes" to continue:\n',
    (answer) => {
      if (answer === 'yes') {
        runCommand({ location: inputLocation, file: resolvedFile });
      } else {
        console.log('Command not confirmed. Exiting.');
        process.exit(0);
      }

      rl.close();
    },
  );
} else if (inputLocation === 'local') {
  runCommand({ location: inputLocation, file: resolvedFile });
}

function runCommand(params) {
  // Build argv list (no shell)
  const argv = ['d1', 'execute', DATABASE_NAME];
  if (params.location !== 'remote') argv.push('--local');
  argv.push('--file', params.file);

  execFile(WRANGLER_BIN, argv, { shell: false, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      // Wrangler sometimes emits non-fatal messages on stderr; keep behavior consistent
      console.log(`stderr: ${stderr}`);
      // do not return early; stdout may still contain results
    }

    // Remove the non-JSON content at the beginning of the string
    const jsonStart = stdout.indexOf('[');
    const jsonEnd = stdout.lastIndexOf(']') + 1; // Include the closing bracket
    if (jsonStart === -1 || jsonEnd <= 0) {
      console.log(stdout); // fallback: just print raw stdout
      return;
    }
    const jsonString = stdout.slice(jsonStart, jsonEnd);

    try {
      // Parse the JSON string into an array
      const data = JSON.parse(jsonString);
      console.table((data[0] && data[0].results) || []);
    } catch (e) {
      console.log('Failed to parse JSON output:\n', stdout);
    }
  });
}

