import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Documentation directory
const DOCS_DIR = path.resolve(__dirname, '../../docs-site/docs');
// English documentation directory
const EN_DOCS_DIR = path.resolve(
  __dirname,
  '../../docs-site/i18n/en/docusaurus-plugin-content-docs/current'
);
// Temporary directory for extracted code
const TEMP_DIR = path.resolve(__dirname, '../temp');

// Ensure temporary directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Extract TypeScript code snippets from documentation
function extractCodeFromDocs(docPath) {
  const content = fs.readFileSync(docPath, 'utf8');
  const codeBlocks = [];

  // Match content between ```typescript and ```
  const regex = /```typescript\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    codeBlocks.push(match[1]);
  }

  return codeBlocks;
}

// Convert code snippets to executable test files
function createTestFile(code, index, docName) {
  const fileName = `${docName}_example_${index}.ts`;
  const filePath = path.join(TEMP_DIR, fileName);

  // Add necessary imports
  const testCode = `
// Example #${index} extracted from ${docName} documentation
import { Context, injectable, inject } from 'contexify';

${code}

// If the code contains async functions, try to execute them
(async () => {
  try {
    // Look for main or run functions defined in the code and execute them
    if (typeof main === 'function') {
      await main();
    } else if (typeof run === 'function') {
      await run();
    }
    console.log('Example executed successfully');
  } catch (error) {
    console.error('Example execution failed:', error);
    process.exit(1);
  }
})();
`;

  fs.writeFileSync(filePath, testCode);
  return filePath;
}

// Run test file
function runTestFile(filePath) {
  try {
    // Use spawnSync instead of execSync to prevent command injection
    const result = spawnSync('npx', ['ts-node-esm', filePath], {
      stdio: 'inherit',
      shell: process.platform === 'win32', // Shell might be needed on Windows
    });
    return result.status === 0;
  } catch (error) {
    console.error(`Test file ${filePath} execution failed`);
    return false;
  }
}

// Main function
function main() {
  // Get all markdown files from both Chinese and English docs
  const docFiles = [];

  function findMarkdownFiles(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findMarkdownFiles(filePath);
      } else if (file.endsWith('.md')) {
        docFiles.push(filePath);
      }
    }
  }

  // Find markdown files in both Chinese and English docs
  findMarkdownFiles(DOCS_DIR);
  findMarkdownFiles(EN_DOCS_DIR);

  // Process each documentation file
  let allTestsPassed = true;

  for (const docFile of docFiles) {
    const docName = path.basename(docFile, '.md');
    console.log(`Processing document: ${docName}`);

    const codeBlocks = extractCodeFromDocs(docFile);
    console.log(`Found ${codeBlocks.length} code blocks`);

    for (let i = 0; i < codeBlocks.length; i++) {
      const testFilePath = createTestFile(codeBlocks[i], i, docName);
      console.log(
        `Testing file ${i + 1}/${codeBlocks.length}: ${testFilePath}`
      );

      const testPassed = runTestFile(testFilePath);
      allTestsPassed = allTestsPassed && testPassed;
    }
  }

  // Clean up temporary directory
  // fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  if (!allTestsPassed) {
    console.error('Some documentation code tests failed');
    process.exit(1);
  }

  console.log('All documentation code tests passed');
}

main();
