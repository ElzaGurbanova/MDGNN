const files = require('./files');
const { execFile } = require('child_process');
const tempDir = require('temp-dir');
const { name: packageName } = require('../../../package.json');
const { v4: uuidv4 } = require('uuid');
const { writeFile, mkdir } = require('fs');
const { promisify } = require('util');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);
const rimrafAsync = promisify(rimraf);

const NPX_BIN = process.env.NPX_BIN || 'npx';

// Helper: execFile as promise
function execFileAsync(cmd, args, opts={}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, opts, (err, stdout, stderr) => {
      if (err) {
        const msg = (stderr && stderr.toString()) || err.message;
        reject(new Error(msg));
      } else {
        resolve({ stdout: stdout ? stdout.toString() : '', stderr: stderr ? stderr.toString() : '' });
      }
    });
  });
}

// files with weird names need to be grouped into sf/v2/v3 manually
const fileGroupAssociations = {
  'orders.v2.oas2': 'v2',
};

async function main() {
  const sourceDir = process.argv[2] || 'https://raw.githubusercontent.com/Space48/api-specs/space48-fixes/reference';
  const tempOutputDir = await makeTempDir();
  const outputDir = `${__dirname}/generated`;

  try {
    await generateTypeScript(sourceDir, tempOutputDir, files);
    await replaceDir(tempOutputDir, outputDir);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function makeTempDir() {
  const tempOutputDir = `${tempDir}/${packageName.split('/').slice(-1)[0]}-${uuidv4()}`;
  await mkdirAsync(tempOutputDir, { recursive: true });
  return tempOutputDir;
}

async function generateTypeScript(sourceDir, outputDir, yamlFiles) {
  const modules = yamlFiles.map(yamlFilename => {
    const jsIdentifier = value => value.replace(/-/g, '_');
    const filenameParts = yamlFilename.split('.').slice(0, -1);
    const exportName = jsIdentifier(filenameParts[0]);
    const moduleName = jsIdentifier(filenameParts.join('.'));
    return {
      moduleName,
      groupName:
        fileGroupAssociations[moduleName] || (filenameParts.length === 2 ? jsIdentifier(filenameParts.slice(-1)[0]) : null),
      yamlFilename,
      tsFilename: `${moduleName}.ts`,
      exportName,
    };
  });

  // Prefer local binary when available
  const localOAT = path.join(__dirname, '../../../', 'node_modules', '.bin',
    process.platform === 'win32' ? 'openapi-typescript.cmd' : 'openapi-typescript');
  const hasLocalOAT = fs.existsSync(localOAT);

  await Promise.all(modules.map(async ({ yamlFilename, tsFilename }) => {
    const sourcePath = `${sourceDir}/${yamlFilename}`;
    const outputPath = `${outputDir}/${tsFilename}`;

    // Ensure output dir exists
    await mkdirAsync(path.dirname(outputPath), { recursive: true });

    let stdout;
    if (hasLocalOAT) {
      ({ stdout } = await execFileAsync(localOAT, [sourcePath, '--immutable-types']));
    } else {
      ({ stdout } = await execFileAsync(NPX_BIN, ['--no-install', 'openapi-typescript', sourcePath, '--immutable-types']));
    }
    await writeFileAsync(outputPath, stdout);
  }));

  const exportGroups = [...new Set(modules.map(mod => mod.groupName))];

  await Promise.all(exportGroups.map(async groupName => {
    const fileContent = `
      import type { InferOperationIndex } from "../operation-inference";

      ${
        modules
          .filter(module => module.groupName === groupName)
          .map(({ moduleName, exportName }) => `import type * as ${exportName} from "./${moduleName}"`)
          .join("\n")
      }

      export type Operation =
        ${
          modules
            .filter(module => module.groupName === groupName)
            .map(({ exportName }) => `& InferOperationIndex<${exportName}.paths>`)
            .join("\n")
        }
      ;
    `;
    await writeFileAsync(`${outputDir}/${groupName || 'misc'}.ts`, fileContent);
  }));
}

async function replaceDir(source, destination) {
  await rimrafAsync(destination);
  // Use mv without a shell; assumes POSIX environment (same as original approach)
  await execFileAsync('mv', [source, destination]);
}

main();

