const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
const fs = require('fs');
const path = require('path');

const filePathArg = process.argv[2];
if (!filePathArg) {
  console.error('Please specify a file path.');
  process.exit(1);
}

// ---- Hardened path handling ----
const BASE_DIR = fs.realpathSync(process.cwd()); // choose your trusted base
let candidate = path.resolve(BASE_DIR, filePathArg); // allow relative or absolute input, but anchor to BASE

let filePath;
try {
  // realpath defeats symlinks that would escape BASE
  filePath = fs.realpathSync(candidate);
} catch (error) {
  console.error(`Error resolving file "${filePathArg}":`, error.message);
  process.exit(1);
}

// Containment check
const rel = path.relative(BASE_DIR, filePath);
if (rel.startsWith('..') || path.isAbsolute(rel)) {
  console.error('Invalid file path: outside allowed base directory.');
  process.exit(1);
}

// Optional: restrict to DOT sources
const inExt = path.extname(filePath).toLowerCase();
if (!['.dot', '.gv'].includes(inExt)) {
  console.error('Invalid file type: only .dot or .gv are allowed.');
  process.exit(1);
}

let dotString;
try {
  dotString = fs.readFileSync(filePath, 'utf8');
} catch (error) {
  console.error(`Error reading file "${filePath}":`, error.message);
  process.exit(1);
}

const viz = new Viz({ Module, render });

const outputFileName = path.join(
  path.dirname(filePath),
  path.basename(filePath, path.extname(filePath)) + '.svg'
);

// Ensure output stays within BASE as well (belt-and-braces)
const outRel = path.relative(BASE_DIR, outputFileName);
if (outRel.startsWith('..') || path.isAbsolute(outRel)) {
  console.error('Refusing to write outside base directory.');
  process.exit(1);
}

viz.renderString(dotString, { engine: 'dot', format: 'svg' })
  .then(svg => {
    try {
      // exclusive create to avoid overwriting/symlink issues
      fs.writeFileSync(outputFileName, svg, { flag: 'wx' });
    } catch (error) {
      if (error.code === 'EEXIST') {
        console.error(`Output file already exists: "${outputFileName}"`);
      } else {
        console.error(`Error writing file "${outputFileName}":`, error.message);
      }
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error rendering DOT string:', error.message || error);
    process.exit(1);
  });

