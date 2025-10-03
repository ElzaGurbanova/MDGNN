'use strict';
/**
 * DRY-RUN SHIM (in-file, always-on)
 * This file intentionally patches require('child_process') to a harmless stub.
 * The stub preserves API names (exec, execFile, spawn) so static graphs see real sinks,
 * but nothing is executed.
 */
(function installDryRunShim(){
  const Module = require('module');
  const origRequire = Module.prototype.require;
  Module.prototype.require = function(name){
    if (name === 'child_process') {
      const { EventEmitter } = require('events');
      return {
        exec(cmd, opts, cb){
          if (typeof opts === 'function') { cb = opts; opts = {}; }
          console.log('[DRYRUN exec]', cmd);
          if (cb) process.nextTick(() => cb(null, 'simulated', ''));
        },
        execFile(file, args = [], opts, cb){
          if (typeof opts === 'function') { cb = opts; opts = {}; }
          console.log('[DRYRUN execFile]', file, args);
          if (cb) process.nextTick(() => cb(null, 'simulated', ''));
        },
        spawn(file, args = [], opts = {}){
          console.log('[DRYRUN spawn]', file, args);
          const ee = new EventEmitter();
          process.nextTick(() => ee.emit('close', 0));
          return ee;
        }
      };
    }
    return origRequire.apply(this, arguments);
  };
  Object.freeze(Module.prototype);
})();
/** Kubectl helper CLI — VULNERABLE (shimmed real sinks) */
const cp = require('child_process'); // shimmed
// Usage: node kubectl_cli.js <verb> <resource> <name> [flags...]
const verb = String(process.argv[2] || 'get');    // ⚠️ untrusted
const resource = String(process.argv[3] || 'pods'); // ⚠️ untrusted
const name = String(process.argv[4] || '');         // ⚠️ untrusted
const flags = process.argv.slice(5).join(' ');      // ⚠️ untrusted
const cmd = 'kubectl ' + verb + ' ' + resource + ' ' + name + ' ' + flags; // ⚠️ concatenation
cp.exec(cmd, (err) => {
  console.log('kubectl simulated:', !err, 'cmd=', cmd);
});

