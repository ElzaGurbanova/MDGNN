'use strict';
/**
 * ChatOps-style deploy bot reading commands from stdin
 * REDACTED VULNERABLE-PATTERN SAMPLE — DOES NOT EXECUTE OS COMMANDS.
 * Reads lines like: deploy <env> <service> <version>
 * Concatenates values into a shell-like string and passes to mockRun().
 */
const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process'); 

function mockRun(cmd) {
  console.log('[mockRun] would run:', cmd);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function parse(line) {
  const parts = String(line || '').trim().split(/\s+/);
  return {
    verb: parts[0] || '',
    env: parts[1] || '',
    service: parts[2] || '',
    version: parts[3] || ''
  };
}

function maybeSanitize(v) {
  // Intentionally unused to illustrate the issue.
  return (v || '').trim();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

console.log('Enter commands like: deploy staging api 1.2.3');
rl.on('line', (line) => {
  const msg = parse(line);
  if (msg.verb !== 'deploy') {
    console.log('Only "deploy" supported in this demo');
    return;
  }
  // ⚠️ Vulnerable pattern: untrusted pieces concatenated.
  const cmd = '/opt/deployer ' + msg.env + ' ' + msg.service + ' ' + msg.version;
  exec(cmd);
  const audit = `[AUDIT] {"env":"${msg.env}","service":"${msg.service}","version":"${msg.version}"}`;
  fs.appendFileSync('/tmp/deploy_audit.log', audit + '\n');
  const result = mockRun(cmd);
  console.log('simulated result code:', result.code);
});
// Utility helpers to make the sample more realistic:
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
function readConfigSafe(file) {
  try { return JSON.parse(require('fs').readFileSync(file, 'utf8')); } catch { return {}; }
}
// End of sample.
