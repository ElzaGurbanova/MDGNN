//@ts-check
/**
 * Copyright (c) 2020 Google Inc
 * (license text omitted for brevity)
 */

import { JSDOM } from 'jsdom';
import { promisify } from 'util';
import imageSize from 'image-size';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { mkdirpSync } from 'fs-extra';

const sizeOf = promisify(imageSize);
const execPromise = promisify(exec);

function isThumbnail(filename) {
  return (
    filename.match(/-thumb.jpg$/i) ||
    filename.match(/-still[0-9]*.jpg$/i) ||
    filename.match(/-submovie[0-9]*.jpg$/i)
  );
}

const heroWidths = [1280, 640];
const thumbWidths = [900, 450];

const extension = {
  jpeg: 'jpg',
  avif: 'avif'
};

function sizedName(filename, width, format) {
  const ext = extension[format];
  if (!ext) {
    throw new Error(`Unknown format ${format}`);
  }
  return filename.replace(/\.\w+$/, _ => '-' + width + 'w' + '.' + ext);
}

async function srcset(filename, format) {
  const widths = isThumbnail(filename) ? thumbWidths : heroWidths;
  const names = await Promise.all(widths.map(w => resize(filename, w, format)));
  if (format === 'jpeg' && filename.match(/-thumb.jpg$/i)) {
    // Generate 1200px optimized jpegs for social media
    await resize(filename, 1200, format);
  }
  return names.map((n, i) => `${n} ${widths[i]}w`).join(', ');
}

async function resize(filename, width, format) {
  const out = sizedName(filename, width, format);
  if (fs.existsSync('.cache' + out)) {
    return out;
  }
  // NOTE: this preserves existing behavior; not changing CLI invocation here
  await execPromise(`node ./compressImage.js ${filename} ${width} ${format}`);
  return out;
}

/* ---------- Hardened path-anchoring helpers ---------- */

// Ensure roots exist/canonicalize them
(() => {
  mkdirpSync('.cache');
})();
const SRC_ROOT = fs.realpathSync(path.resolve('src'));
const CACHE_ROOT = fs.realpathSync(path.resolve('.cache'));

/**
 * Convert an <img src> into a safe site-relative web path ("/...") under SRC_ROOT.
 * Returns `null` if the src is invalid/outside the allowed tree.
 */
function toSafeWebPath(src, outputPath) {
  if (!src) return null;

  // Absolute URLs are handled by caller (skipped)
  if (/^https?:\/\//i.test(src)) return null;

  // Helper to validate segments
  const hasBadSeg = segs => segs.some(s => s === '' || s === '.' || s === '..');

  if (src.startsWith('/')) {
    // Site-root relative path -> ensure no dot segments
    const posixNorm = src.replace(/\\/g, '/'); // guard against backslashes
    const norm = path.posix.normalize(posixNorm); // collapses dot segments
    const rel = norm.replace(/^\/+/, ''); // "a/b/c"
    const segs = rel.split('/');
    if (!rel || hasBadSeg(segs)) return null;
    // Build a candidate under SRC_ROOT and ensure containment
    const candidate = path.resolve(SRC_ROOT, rel);
    const relCheck = path.relative(SRC_ROOT, candidate);
    if (relCheck.startsWith('..') || path.isAbsolute(relCheck)) return null;
    return '/' + rel;
  } else {
    // Relative to the template file
    const baseDir = path.dirname(outputPath);
    const abs = path.resolve(baseDir, src);
    // Enforce containment under SRC_ROOT (symlink-safe by checking the parent dir)
    let parentReal;
    try {
      parentReal = fs.realpathSync(path.dirname(abs));
    } catch {
      return null;
    }
    const relParent = path.relative(SRC_ROOT, parentReal);
    if (relParent.startsWith('..') || path.isAbsolute(relParent)) return null;

    let rel = path.relative(SRC_ROOT, abs); // path relative to SRC_ROOT
    rel = rel.replace(/\\/g, '/'); // web-friendly
    const segs = rel.split('/');
    if (!rel || hasBadSeg(segs)) return null;
    return '/' + rel;
  }
}

async function processImage(img, outputPath) {
  let src = img.getAttribute('src');
  if (!src || /^https?:\/\//i.test(src)) {
    return;
  }

  // Convert to a safe, site-relative path under SRC_ROOT
  const webPath = toSafeWebPath(src, outputPath);
  if (!webPath) {
    console.warn('Skipping unsafe image src:', src);
    return;
  }

  // Filesystem locations derived from the vetted web path
  const srcFilename = path.join(SRC_ROOT, webPath.slice(1)); // actual source file on disk
  const cachedFilename = path.join(CACHE_ROOT, webPath.slice(1));
  const cachedFilenameDirectory = path.dirname(cachedFilename);
  if (!fs.existsSync(cachedFilenameDirectory)) {
    mkdirpSync(cachedFilenameDirectory);
  }

  // If not yet cached and it's an SVG, copy it into cache
  if (!fs.existsSync(cachedFilename)) {
    if (webPath.toLowerCase().endsWith('svg')) {
      try {
        fs.copyFileSync(srcFilename, cachedFilename);
      } catch (e) {
        console.warn('Failed to cache SVG:', e.message, webPath);
      }
    }
  }

  // Read dimensions from the source; if this fails, skip the image
  let dimensions;
  try {
    dimensions = await sizeOf(srcFilename);
  } catch (e) {
    console.warn(e.message, webPath);
    return;
  }

  if (!img.getAttribute('width')) {
    img.setAttribute('width', String(dimensions.width));
    img.setAttribute('height', String(dimensions.height));
  }
  if (dimensions.type === 'svg') {
    return;
  }

  if (img.tagName === 'IMG') {
    img.setAttribute('decoding', 'async');
    img.setAttribute('loading', 'lazy');
    const doc = img.ownerDocument;
    const picture = doc.createElement('picture');
    const avif = doc.createElement('source');
    const jpeg = doc.createElement('source');
    await setSrcset(avif, webPath, 'avif');
    avif.setAttribute('type', 'image/avif');
    await setSrcset(jpeg, webPath, 'jpeg');
    jpeg.setAttribute('type', 'image/jpeg');
    picture.appendChild(avif);
    picture.appendChild(jpeg);
    img.setAttribute('src', jpeg.getAttribute('srcset').split(' ')[0]);
    img.parentElement.replaceChild(picture, img);
    picture.appendChild(img);
  } else if (!img.getAttribute('srcset')) {
    await setSrcset(img, webPath, 'jpeg');
  }
}

async function setSrcset(img, src, format) {
  img.setAttribute('srcset', await srcset(src, format));
  img.setAttribute(
    'sizes',
    isThumbnail(src)
      ? thumbWidths.map(width => `(max-width: ${width}px) ${width}px`).join(', ') + ', 100vw'
      : heroWidths.map(width => `(max-width: ${width}px) ${width}px`).join(', ') + ', 100vw'
  );
}

export default async function processImagesAndWriteFile(templateFilename, templateString) {
  let content = templateString;
  const dom = new JSDOM(content);
  const images = [...dom.window.document.querySelectorAll('img')];

  if (images.length > 0) {
    for (const i of images) {
      await processImage(i, templateFilename);
    }
    content = dom.serialize();
  }
  fs.writeFileSync(templateFilename, content, { encoding: 'utf8' });
}

