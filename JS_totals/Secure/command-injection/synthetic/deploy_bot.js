'use strict';
/**
 * ChatOps-style deploy bot reading commands from stdin — FIXED (safer design)
 * Validates tokens, allowlists environment, and avoids string-concatenated commands.
 * Uses safeRun(tool, args) which only logs.
 */
const readline = require('readline');
const path = require('path');
const fs = require('fs');

function safeRun(tool, args) {
  console.log('[safeRun]', tool, args);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function isEnv(e) { return ['dev', 'staging', 'prod'].includes(String(e)); }
function isService(s) { return /^[a-z0-9\-]{1,32}$/.test(String(s)); }
function isSemver(v) { return /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(String(v)); }

const rl = readline.createInterface({
  input: process.stdin, output: process.stdout, terminal: false
});

console.log('Enter: deploy <env> <service> <version>');
rl.on('line', (line) => {
  const [verb, env, service, version] = String(line || '').trim().split(/\s+/);
  if (verb !== 'deploy') return console.log('Only "deploy" supported');
  if (!isEnv(env)) return console.log('bad env');
  if (!isService(service)) return console.log('bad service');
  if (!isSemver(version)) return console.log('bad version');

  const tool = '/opt/deployer';
  const args = ['--env', env, '--service', service, '--version', version];
  const result = safeRun(tool, args);
  fs.appendFileSync('/tmp/deploy_audit_fixed.log', JSON.stringify({ env, service, version }) + '\n');
  console.log('simulated result:', result.code);
});
// Utility: canonical path normalization (example)
function normalizeSafe(p) {
  try { return require('path').normalize(String(p || '')); } catch { return ''; }
}
// End of fixed sample.
