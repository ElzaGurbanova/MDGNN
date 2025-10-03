#!/usr/bin/env node

import { readFileSync, writeFileSync, lstatSync, realpathSync } from 'fs';
import { execSync } from 'child_process';
import { glob } from 'glob';
import path from 'path';

console.log('🔧 Converting relative imports to alias imports (advanced)...');

const srcRoot = path.resolve('src');
const srcReal = realpathSync(srcRoot);

const tsFiles = glob.sync('src/**/*.ts');
let totalFiles = 0;
let totalReplacements = 0;

function isSafeSrcFile(filePath) {
  // Reject symlinks and any file whose canonical path escapes src/
  try {
    if (lstatSync(filePath).isSymbolicLink()) return false;
    const real = realpathSync(filePath);
    const rel = path.relative(srcReal, real);
    return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
  } catch {
    return false;
  }
}

function resolveImportPath(currentFile, importPath) {
  // Resolve against the current file's REAL directory
  const currentDir = path.dirname(currentFile);
  let currentRealDir;
  try {
    currentRealDir = realpathSync(currentDir);
  } catch {
    return null;
  }

  const fullPath = path.resolve(currentRealDir, importPath);
  // Check the computed path stays under REAL src/
  const rel = path.relative(srcReal, fullPath);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    return null; // outside src/ — do not convert
  }

  // Convert to alias with POSIX separators
  return `~/${rel.replace(/\\/g, '/')}`;
}

tsFiles.forEach(file => {
  // Symlink/escape guard for the file itself
  if (!isSafeSrcFile(file)) return;

  let content = readFileSync(file, 'utf8');
  let hasChanges = false;
  let fileReplacements = 0;

  // Pattern for all relative imports (both ./ and ../)
  const relativePattern = /from (['"])(\.\.?\/[^'"]+)\1/g;
  content = content.replace(relativePattern, (match, quote, importPath) => {
    // Only convert ../ imports (parent directory)
    if (!importPath.startsWith('../')) {
      return match;
    }
    const aliasPath = resolveImportPath(file, importPath);
    if (aliasPath) {
      hasChanges = true;
      fileReplacements++;
      return `from ${quote}${aliasPath}${quote}`;
    }
    return match;
  });

  // Dynamic imports
  const dynamicPattern = /import\((['"])(\.\.?\/[^'"]+)\1\)/g;
  content = content.replace(dynamicPattern, (match, quote, importPath) => {
    if (!importPath.startsWith('../')) {
      return match;
    }
    const aliasPath = resolveImportPath(file, importPath);
    if (aliasPath) {
      hasChanges = true;
      fileReplacements++;
      return `import(${quote}${aliasPath}${quote})`;
    }
    return match;
  });

  if (hasChanges) {
    writeFileSync(file, content);
    console.log(`✅ ${file}: ${fileReplacements} imports converted`);
    totalFiles++;
    totalReplacements += fileReplacements;
  }
});

console.log(`\n🎉 Completed!`);
console.log(`📁 Files modified: ${totalFiles}`);
console.log(`🔄 Total imports converted: ${totalReplacements}`);

// Run Biome to format
if (totalFiles > 0) {
  console.log('\n🎨 Running Biome format and organize imports...');
  try {
    execSync('npx biome check --write src/', { stdio: 'inherit' });
    console.log('✅ Biome completed');
  } catch (error) {
    console.log('⚠️  Biome failed, but imports were converted');
  }
}

if (totalReplacements === 0) {
  console.log('💡 No ../ imports found to convert. All imports are already using aliases or same-directory imports.');
}

