/**
 * File-related utility functions
 */

/**
 * Sanitize file name
 */
function sanitizeFileName(fileName) {
  if (!fileName) return '';
  let name = String(fileName).trim();

  // Decode common encodings that can hide traversal
  name = name
    .replace(/%2e/gi, '.')   // .
    .replace(/%2f/gi, '/')   // /
    .replace(/%5c/gi, '\\'); // \

  // Drop any directory components (POSIX & Windows)
  name = name.split('/').pop();
  name = name.split('\\').pop();

  // Remove leading dots (avoid hidden/system files)
  name = name.replace(/^\.+/, '');

  // Remove control chars and illegal FS chars
  name = name
    .replace(/[\x00-\x1f\x80-\x9f]/g, '') // control chars
    .replace(/[\\/:*?"<>|]/g, '_');

  // Final guard against leftover traversal tokens
  name = name.replace(/\.\./g, '_');

  // Fallback if empty
  if (!name) name = 'file';

  return name;
}

/**
 * Get file extension from file name
 */
function getFileExtension(fileName) {
  if (!fileName) return '';
  const match = fileName.match(/\.([0-9a-z]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

/**
 * Get content type from file name
 */
function getContentTypeFromFileName(fileName) {
  const ext = getFileExtension(fileName);
  const contentTypes = {
    // Document types
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Image types
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'tiff': 'image/tiff',
    'bmp': 'image/bmp',

    // Video types
    'mp4': 'video/mp4',

    // Code types
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'cpp': 'text/x-c++src',
    'cs': 'text/x-csharp',
    'm': 'text/x-matlab',

    // Compressed files
    'zip': 'application/zip',
    'gz': 'application/gzip',
    'tar': 'application/x-tar',
    'rar': 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    'bz2': 'application/x-bzip2',
    'xz': 'application/x-xz',
    'tgz': 'application/gzip',
    'zipx': 'application/zip',

    // Binary/model files
    'pt': 'application/octet-stream',
    'pth': 'application/octet-stream',
    'onnx': 'application/octet-stream',
    'bin': 'application/octet-stream',
    'h5': 'application/octet-stream',
    'pb': 'application/octet-stream',
    'safetensors': 'application/octet-stream',
    'ckpt': 'application/octet-stream',
    'mat': 'application/octet-stream',
    'gguf': 'application/octet-stream',
  };

  return contentTypes[ext] || 'application/octet-stream';
}

// Export functions
export {
  sanitizeFileName,
  getFileExtension,
  getContentTypeFromFileName
};

