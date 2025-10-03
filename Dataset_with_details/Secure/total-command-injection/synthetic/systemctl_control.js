// 3) Safe systemctl control with allowlisted action + validated service name, via execSync
const { execSync } = require('child_process');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

function manageService(service, action) {
  const ALLOWED = new Set(['start', 'stop', 'restart', 'reload', 'status']);
  if (!ALLOWED.has(action)) throw new Error('Action not allowed');
  // Service unit basic validation
  if (!/^[a-zA-Z0-9._@-]+(?:\.service)?$/.test(service)) throw new Error('Bad service name');
  const unit = service.endsWith('.service') ? service : `${service}.service`;

  const cmd = `systemctl ${action} ${shq(unit)}`;
  return execSync(cmd, { stdio: 'inherit' });
}

// Example:
// manageService('nginx', 'restart');

