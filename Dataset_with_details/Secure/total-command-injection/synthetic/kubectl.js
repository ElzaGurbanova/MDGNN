// 6) Safe kubectl apply label to namespace with whitelists, using execSync
const { execSync } = require('child_process');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

function labelNamespace(ns, key, value, context) {
  if (!/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(ns)) throw new Error('Invalid namespace');
  const keyPattern = /^(?:[a-z0-9]([-a-z0-9]*[a-z0-9])?\.)*[a-z0-9]([-a-z0-9/]*[a-z0-9])?$/;
  if (!keyPattern.test(key)) throw new Error('Invalid label key');
  if (!/^[A-Za-z0-9._-]{1,63}$/.test(value)) throw new Error('Invalid label value');
  if (context && !/^[\w.-]+$/.test(context)) throw new Error('Invalid context');

  const ctxArg = context ? `--context ${shq(context)}` : '';
  const cmd = `kubectl ${ctxArg} label ns ${shq(ns)} ${shq(`${key}=${value}`)} --overwrite`;
  execSync(cmd, { stdio: 'inherit' });
}

// Example:
// labelNamespace('prod', 'team', 'payments', 'admin@prod-cluster');

