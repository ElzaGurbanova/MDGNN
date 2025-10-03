const fs = require('fs');
const child_process = require('child_process');
const Path = require('path');

const readFileAsync = fs.readFile;
const writeFileAsync = fs.writeFile;

var tmp = require('tmp');

function createTmpDir() {
  return new Promise(function (resolve, reject) {
    tmp.dir(function (err, p) {
      err ? reject(err) : resolve(p);
    });
  });
}

function writeFile(path, data) {
  return new Promise(function (resolve, reject) {
    writeFileAsync(path, data, function (err) {
      err ? reject(err) : resolve();
    });
  });
}

function readFile(path) {
  return new Promise(function (resolve, reject) {
    readFileAsync(path, function (err, data) {
      err ? reject(err) : resolve(data);
    });
  });
}

const isErrorLine = (line) => line.length > 0 && line.charAt(0) === '!';

function filterErrorLines(log) {
  return log
    .split('\n')
    .filter(isErrorLine)
    .map((line) => line.substring(2))
    .join('');
}

async function readErrorLog(dirname) {
  const log = await readFile(Path.join(dirname, 'texput.log'));
  return filterErrorLines(log.toString()) || 'LaTeX Error';
}

// Promise wrapper around execFile (no shell)
function execFileP(file, args, options = {}) {
  return new Promise(function (resolve, reject) {
    const child = child_process.execFile(file, args, options, function (err, stdout, stderr) {
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  });
}

function todviArgs() {
  return [
    // 'latex',
    // '-shell-escape', // intentionally disabled
    '-halt-on-error',
    // '-interaction=nonstopmode',
    'texput.tex',
  ];
}

function tosvgArgs() {
  return [
    // 'dvisvgm',
    '--exact',
    '--no-fonts',
    'texput.dvi',
    '-o',
    'texput.svg',
  ];
}

async function compile(tempPath, options = {}) {
  try {
    await execFileP('latex', todviArgs(), {
      ...options,
      cwd: tempPath,
      env: process.env,
      timeout: 1000,
      shell: false,
    });

    await execFileP('dvisvgm', tosvgArgs(), {
      ...options,
      cwd: tempPath,
      env: process.env,
      timeout: 1000,
      shell: false,
    });

    const data = await readFile(Path.join(tempPath, 'texput.svg'));

    // Clean up without shell
    try {
      fs.rmSync(tempPath, { recursive: true, force: true });
    } catch (e) {
      // ignore cleanup errors
    }

    return data;
  } catch (e) {
    throw await readErrorLog(tempPath);
  }
}

async function latex(source, options = {}) {
  const tmpPath = await createTmpDir();
  // console.log(`tempPath = ${tmpPath}`);
  await writeFile(Path.join(tmpPath, 'texput.tex'), source);
  return compile(tmpPath, options);
}

async function formula(eq) {
  const filecontent = `
\\documentclass{standalone}
\\begin{document}
${eq}
\\end{document}
`;
  return await latex(filecontent);
}

exports.readFile = readFile;
exports.formula = formula;

