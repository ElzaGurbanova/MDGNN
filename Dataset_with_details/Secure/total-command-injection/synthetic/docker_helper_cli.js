'use strict';
/**
 * CLI docker helper wrapper — FIXED (safer design)
 * Avoids shell concatenation; uses validation and in-process logic; no OS commands executed.
 */
// node docker_helper_cli_fixed.js <image> [--port 8080] [--name NAME]
function isImage(n){ return /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)?(?::[\w.-]+)?$/.test(String(n)); }
const idxPort = process.argv.indexOf('--port'); const idxName = process.argv.indexOf('--name');
const image = String(process.argv[2]||''); if(!isImage(image)) throw new Error('bad image');
const port = idxPort> -1 ? Number(process.argv[idxPort+1]) : null;
const name = idxName> -1 ? String(process.argv[idxName+1]||'') : null;
if (port !== null && (!Number.isInteger(port) || port<1 || port>65535)) throw new Error('bad port');
if (name && !/^[a-z0-9_.-]{1,30}$/.test(name)) throw new Error('bad name');

// Simulate container launch: create a manifest
const manifest = { image, port, name, ts: Date.now() };
require('fs').writeFileSync('/tmp/docker_sim.json', JSON.stringify(manifest, null, 2));
console.log('Docker run simulated:', manifest);


// Extra utility
function normalizeSafe(p){ try{return require('path').normalize(String(p||''));}catch{return '';} }

