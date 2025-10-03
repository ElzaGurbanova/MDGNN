'use strict';
/** Kubectl helper CLI — FIXED (no shell; validation/allowlists) */
// node kubectl_cli_fixed.js <verb> <resource> <name>
function isVerb(v){ return ['get','describe','logs'].includes(String(v)); }
function isRes(r){ return ['pods','deployments','services'].includes(String(r)); }
const verb = String(process.argv[2]||''); const res = String(process.argv[3]||''); const name = String(process.argv[4]||'');
if (!isVerb(verb) || !isRes(res) || !/^[a-z0-9-]{1,40}$/.test(name)) throw new Error('bad args');

// No shell: simulated response
console.log(JSON.stringify({ verb, res, name, out: 'simulated' }, null, 2));

