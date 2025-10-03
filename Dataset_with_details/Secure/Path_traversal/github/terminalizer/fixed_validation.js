/**
 * Input validation utilities
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

const path = require('path');
const fs = require('fs');

// Canonical sandbox/base directory for all filesystem paths.
// You can override via TERMINALIZER_BASE_DIR if desired.
const BASE_DIR = path.resolve(process.env.TERMINALIZER_BASE_DIR || process.cwd());

function isInside(base, target) {
  const rel = path.relative(base, target);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function safeResolve(base, userPath) {
  // Returns { ok: boolean, path?: string, error?: string }
  if (typeof userPath !== 'string' || userPath.length === 0) {
    return { ok: false, error: 'File path is required' };
  }
  if (/\0/.test(userPath)) {
    return { ok: false, error: 'Invalid file path: null byte detected' };
  }

  // Resolve against base; the leading '.' prevents absolute-path override
  const candidate = path.resolve(base, '.' + userPath);

  // Containment check (path-aware)
  if (!isInside(base, candidate)) {
    return { ok: false, error: 'Path outside of allowed directory' };
  }

  try {
    const realBase = fs.realpathSync(base);
    // If the target exists, ensure the *canonical* target still stays within base.
    // If it does not exist, validate the parent directory’s realpath instead.
    let realTarget;
    try {
      realTarget = fs.realpathSync(candidate);
      if (!isInside(realBase, realTarget)) {
        return { ok: false, error: 'Symlink escape detected' };
      }
      return { ok: true, path: realTarget };
    } catch {
      // Target doesn’t exist yet: check parent directory
      const parent = path.dirname(candidate);
      const realParent = fs.realpathSync(parent);
      if (!isInside(realBase, realParent)) {
        return { ok: false, error: 'Invalid parent directory' };
      }
      return { ok: true, path: candidate };
    }
  } catch (e) {
    return { ok: false, error: 'Invalid file path: ' + e.message };
  }
}

/**
 * Validate recording file name
 *
 * @param  {String}  filename
 * @return {Object}  {valid: boolean, error?: string}
 */
function validateRecordingFile(filename) {
  if (!filename) {
    return { valid: false, error: 'Recording file name is required' };
  }

  // Check for valid filename characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(filename)) {
    return { valid: false, error: 'Recording file name contains invalid characters' };
  }

  // Check length
  if (filename.length > 255) {
    return { valid: false, error: 'Recording file name is too long' };
  }

  return { valid: true };
}

/**
 * Validate and sanitize file path (sandboxed to BASE_DIR)
 *
 * @param  {String}  filePath
 * @return {Object}  {valid: boolean, path?: string, error?: string}
 */
function validateFilePath(filePath) {
  const res = safeResolve(BASE_DIR, filePath);
  if (!res.ok) {
    return { valid: false, error: res.error };
  }
  return { valid: true, path: res.path };
}

/**
 * Validate configuration object
 *
 * @param  {Object}  config
 * @return {Object}  {valid: boolean, errors?: Array}
 */
function validateConfig(config) {
  const errors = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Configuration must be an object'] };
  }

  // Validate cols and rows
  if (config.cols !== 'auto' && (isNaN(config.cols) || config.cols < 1)) {
    errors.push('cols must be "auto" or a positive number');
  }

  if (config.rows !== 'auto' && (isNaN(config.rows) || config.rows < 1)) {
    errors.push('rows must be "auto" or a positive number');
  }

  // Validate quality
  if (config.quality && (isNaN(config.quality) || config.quality < 1 || config.quality > 100)) {
    errors.push('quality must be a number between 1 and 100');
  }

  // Validate frameDelay
  if (config.frameDelay !== 'auto' && (isNaN(config.frameDelay) || config.frameDelay < 0)) {
    errors.push('frameDelay must be "auto" or a non-negative number');
  }

  // Validate maxIdleTime
  if (config.maxIdleTime !== 'auto' && (isNaN(config.maxIdleTime) || config.maxIdleTime < 0)) {
    errors.push('maxIdleTime must be "auto" or a non-negative number');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Sanitize command string to prevent injection
 *
 * @param  {String}  command
 * @return {Object}  {valid: boolean, command?: string, error?: string}
 */
function sanitizeCommand(command) {
  if (!command) {
    return { valid: true, command: null };
  }

  if (typeof command !== 'string') {
    return { valid: false, error: 'Command must be a string' };
  }

  // Basic command injection protection
  const dangerousPatterns = [
    /[;&|`$()]/,  // Shell metacharacters
    /\|\|/,       // OR operator
    /&&/,         // AND operator
    />/,          // Redirection
    /</           // Input redirection
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(command)) {
      return { valid: false, error: 'Command contains potentially dangerous characters' };
    }
  }

  return { valid: true, command: command.trim() };
}

/**
 * Validate file name for security
 *
 * @param  {String}  filename
 * @return {Boolean}
 */
function validateFileName(filename) {
  if (!filename || typeof filename !== 'string') {
    return false;
  }

  // Check for path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }

  // Check for dangerous characters
  const dangerousChars = /[<>:"/\\|?*\u0000-\u001f]/;
  if (dangerousChars.test(filename)) {
    return false;
  }

  // Check for Windows reserved names
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExt = filename.split('.')[0].toUpperCase();
  if (reservedNames.includes(nameWithoutExt)) {
    return false;
  }

  return true;
}

/**
 * Validate command for security
 *
 * @param  {String}  command
 * @return {Boolean}
 */
function validateCommand(command) {
  if (!command || typeof command !== 'string') {
    return false;
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /rm\s+-rf\s+\//,  // rm -rf /
    /\$\(/,           // Command substitution
    /`/,              // Backticks
    /\|\s*bash/,      // Pipe to bash
    /\|\s*sh/,        // Pipe to sh
    /&&|;|\|/,        // Command chaining
    />/,              // Redirection
    /</               // Input redirection
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(command)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate path for security (sandboxed to BASE_DIR)
 *
 * @param  {String}  filePath
 * @return {Boolean}
 */
function validatePath(filePath) {
  const res = safeResolve(BASE_DIR, filePath);
  return !!res.ok;
}

module.exports = {
  validateRecordingFile,
  validateFilePath,
  validateConfig,
  sanitizeCommand,
  validateFileName,
  validateCommand,
  validatePath
};

