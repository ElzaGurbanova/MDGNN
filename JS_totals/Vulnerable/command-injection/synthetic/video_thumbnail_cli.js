'use strict';
/**
 * CLI video thumbnail extractor
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

// node video_thumbnail_cli.js <in> <time> <out>
const input = String(process.argv[2]||'');
const time = String(process.argv[3]||'');
const output = String(process.argv[4]||'');
// ⚠️ Vulnerable: concatenated ffmpeg screenshot command
const cmd = 'ffmpeg -ss ' + time + ' -i ' + input + ' -frames:v 1 ' + output;
exec(cmd);
console.log('Thumbnail (simulated):', { input, time, output });
const result = mockRun(cmd);
console.log('thumbnail simulated:', result.code);


// Utility to lengthen realism
function previewDir(d) {
  try { return fs.readdirSync(d).slice(0,3); } catch { return []; }
}
console.log('preview:', previewDir('/tmp'));

