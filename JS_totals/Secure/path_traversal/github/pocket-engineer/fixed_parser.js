const path   = require('path');
const { createLogger } = require('../../utils/logger');

const logger = createLogger('CodeParser');

/**
 * Extract file information from AI chat response
 * @param {string} chat - The chat content with code blocks
 * @returns {Array<Array<string>>} - Array of [filename, content] pairs
 */
const parseCodeFromChat = (chat) => {
  if (!chat || typeof chat !== 'string') {
    throw new Error('Invalid chat content provided to parser');
  }
  
  logger.debug('Starting to parse chat for code files');
  
  // Match filename followed by code block
  const regex = /(\S+)\n\s*```\s*[^\n]*\n([\s\S]+?)```/g;
  const matches = [...chat.matchAll(regex)];
  
  const files = [];
  
  for (const match of matches) {
    let filePath = match[1];

    // Clean up filename
    filePath = filePath
      .replace(/[\:<>"|?*]/g, "") // Remove invalid file characters
      .replace(/^\[(.*)\]$/, "$1") // Remove brackets
      .replace(/^`(.*)`$/, "$1")   // Remove backticks
      .replace(/[\]\:]$/, "");     // Remove trailing brackets/colons
    
    const code = match[2];
    files.push([filePath, code]);
    
    logger.debug(`Parsed file: ${filePath} (${code.length} bytes)`);
  }
  
  // Add README from the first part of the chat
  const readme = chat.split("```")[0].trim();
  if (readme) {
    files.push(["README.md", readme]);
    logger.debug('Added README.md');
  }
  
  logger.info(`Parsed ${files.length} files from chat`);
  
  return files;
};

/**
 * Validates a file path to ensure it's safe (strictly relative, no traversal)
 * @param {string} filePath - The file path to validate
 * @returns {string} - The sanitized, normalized relative file path (POSIX-style)
 * @throws {Error} If the file path is invalid or unsafe
 */
const validateFilePath = (filePath) => {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }

  // Remove NULs and trim
  let p = filePath.replace(/\0/g, '').trim();
  if (!p) {
    throw new Error('Invalid file path');
  }

  // Normalize separators to forward slash for consistent validation
  p = p.replace(/\\/g, '/');

  // Disallow absolute paths and drive/UNC patterns
  if (p.startsWith('/')) {
    throw new Error('Absolute paths are not allowed');
  }
  if (/^[A-Za-z]:\//.test(p)) {
    throw new Error('Drive-letter paths are not allowed');
  }
  if (/^\/\/[^/]/.test(p)) {
    throw new Error('UNC paths are not allowed');
  }

  // Normalize dot-segments
  const norm = path.posix.normalize(p); // collapses ./ and ../ etc.

  // After normalization, reject empty, root, or traversal segments
  if (!norm || norm === '.' || norm === './') {
    throw new Error('Invalid file path');
  }
  const segs = norm.split('/');
  if (segs.some(seg => seg === '' || seg === '.' || seg === '..')) {
    throw new Error('Path traversal detected in file path');
  }

  // Basic invalid characters (control chars and Windows-reserved symbols)
  if (/[<>:"|?*\x00-\x1F]/.test(norm)) {
    throw new Error('Invalid characters in file path');
  }

  // Optional: overall length guard
  if (norm.length > 300) {
    throw new Error('Path too long');
  }

  // Return POSIX-style relative path; callers can use as-is in their storage layer
  return norm;
};

/**
 * Write parsed files to the workspace
 * @param {string} chat - The chat content with code blocks
 * @param {Object} workspace - The workspace storage manager
 * @returns {Promise<Array<string>>} - Array of written filenames
 */
const extractFilesFromChat = async (chat, workspace) => {
  try {
    // Store the full AI output for reference
    await workspace.set("all_output.txt", chat);
    
    // Parse files from the chat
    const files = parseCodeFromChat(chat);
    logger.info(`Extracting ${files.length} files to workspace`);
    
    const writtenFiles = [];
    
    // Write each file to the workspace
    for (const [filePath, content] of files) {
      try {
        const validatedPath = validateFilePath(filePath);
        
        logger.debug(`Writing file: ${validatedPath}`);
        await workspace.set(validatedPath, content);
        writtenFiles.push(validatedPath);
      } catch (error) {
        logger.error(`Failed to write file ${filePath}:`, error);
        // Continue with other files even if one fails
      }
    }
    
    logger.info(`Successfully wrote ${writtenFiles.length} files to workspace`);
    return writtenFiles;
  } catch (error) {
    logger.error('Failed to extract files from chat:', error);
    throw new Error(`File extraction failed: ${error.message}`);
  }
};

module.exports = {
  parseCodeFromChat,
  extractFilesFromChat,
  validateFilePath
};

