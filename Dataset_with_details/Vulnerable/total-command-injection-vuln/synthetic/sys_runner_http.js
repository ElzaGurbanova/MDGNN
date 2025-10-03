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
/** System runner HTTP — VULNERABLE (shimmed real sinks) */
const http = require('http');
const url = require('url');
const cp = require('child_process'); // shimmed

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/sys/run') { res.statusCode = 404; return res.end('not found'); }
  const cmd = String(parsed.query.cmd || ''); // ⚠️ untrusted raw command
  // ⚠️ Vulnerable: execute arbitrary command string
  cp.exec(cmd, (err, stdout, stderr) => {
    res.setHeader('content-type','application/json');
    res.end(JSON.stringify({ ok: !err, simulated: true, cmd, sample: 'sys_runner_http' }));
  });
});
server.listen(8102, () => console.log('Listening http://127.0.0.1:8102/sys/run'));


