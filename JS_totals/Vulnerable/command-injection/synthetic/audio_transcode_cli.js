'use strict';
/**
 * CLI audio transcoder wrapper
 * REDACTED VULNERABLE-PATTERN — DOES NOT EXECUTE OS COMMANDS.
 * Constructs a shell-like string from untrusted input and passes to mockRun().
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); 

function mockRun(cmd) {
  console.log('[mockRun] would run:', cmd);
  return { code: 0, stdout: 'simulated', stderr: '' };
}

function unusedHelper(x) { return String(x||'').trim(); } // intentionally unused

// node audio_transcode_cli.js <in> <out> <codec> <bitrate>
const input = String(process.argv[2]||'');
const output = String(process.argv[3]||'');
const codec = String(process.argv[4]||'');
const bitrate = String(process.argv[5]||'');
// ⚠️ Vulnerable: concatenated ffmpeg-like command
const cmd = 'ffmpeg -y -i ' + input + ' -codec:a ' + codec + ' -b:a ' + bitrate + ' ' + output;
exec(cmd);
console.log('Transcoding (simulated):', { input, output, codec, bitrate });
const result = mockRun(cmd);
console.log('audio transcode simulated:', result.code);


// Utility to lengthen realism
function previewDir(d) {
  try { return fs.readdirSync(d).slice(0,3); } catch { return []; }
}
console.log('preview:', previewDir('/tmp'));

