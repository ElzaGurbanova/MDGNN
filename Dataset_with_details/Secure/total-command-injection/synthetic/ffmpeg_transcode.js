// 4) Safe ffmpeg transcode inside project media dir; prevents traversal & inject, uses execSync
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function shq(s) { return `'${String(s).replace(/'/g, `'\\''`)}'`; }

function within(base, p) {
  const rp = path.resolve(p);
  const rb = path.resolve(base);
  return rp === rb || rp.startsWith(rb + path.sep);
}

function transcodeVideo(mediaRoot, inputRel, outputRel) {
  const inAbs = path.resolve(mediaRoot, inputRel);
  const outAbs = path.resolve(mediaRoot, outputRel);
  if (!within(mediaRoot, inAbs) || !within(mediaRoot, outAbs)) throw new Error('Path outside media root');
  if (!fs.existsSync(inAbs)) throw new Error('Input missing');

  const cmd = `ffmpeg -y -i ${shq(inAbs)} -c:v libx264 -preset veryfast -crf 23 -c:a aac ${shq(outAbs)}`;
  execSync(cmd, { stdio: 'inherit' });
}

// Example:
// transcodeVideo('/srv/app/media', 'uploads/in.mp4', 'processed/out.mp4');

