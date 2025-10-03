'use strict';

/*!
 * V4Fire Client Core
 * https://github.com/V4Fire/Client
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Client/blob/master/LICENSE
 */

const $C = require('collection.js');

const fs = require('fs');
const path = require('upath');

const isPathInside = require('is-path-inside');
const { pathEqual } = require('path-equal');

const {
  resolve: { rootDependencies, depMap },
  config: { dependencies, super: superLink }
} = require('@pzlr/build-core');

const extensions = $C(include('build/webpack/resolve').extensions)
  .to([])
  .reduce((list, ext) => {
    list.push(ext);
    list.push(`/index${ext}`);
    return list;
  });

const importRgxp = new RegExp(
  `(['"])(${RegExp.escape(superLink)})(/.*?|(?=\\1))\\1`,
  'g'
);
const hasImport = importRgxp.removeFlags('g');

/**
 * Monic replacer to enable the `@super` import alias within TS/JS files.
 * This alias always refers to the previous layer that has the specified file.
 *
 * @param {string} str
 * @param {string} filePath
 * @returns {string}
 *
 * @example
 * ```js
 * import '@super/foo';
 * ```
 */
module.exports = function superImportReplacer(str, filePath) {
  if (!dependencies.length || !hasImport.test(str)) {
    return str;
  }

  let start = 0;

  for (let i = 0; i < rootDependencies.length; i++) {
    if (
      isPathInside(
        fs.realpathSync(filePath),
        fs.realpathSync(rootDependencies[i])
      )
    ) {
      start = i + 1;
      break;
    }
  }

  const isTS = path.extname(filePath) === '.ts';

  return str.replace(importRgxp, (orig, $1, root, src = '') => {
    // ---- make `src` safe & strictly relative before any joins ----
    // Normalize to collapse dot segments
    const norm = path.normalize(src);
    // Drop any leading slashes/backslashes so joins can't reset to FS root
    const srcRel = norm.replace(/^[/\\]+/, '');
    // Reject empty, absolute, or upward-traversal paths
    if (!srcRel || srcRel.startsWith('..') || path.isAbsolute(norm)) {
      return orig;
    }

    let resource;

    loop: for (let i = start; i < rootDependencies.length; i++) {
      const dep = dependencies[i];
      const l = path.join(rootDependencies[i], srcRel);

      if (path.extname(l)) {
        if (!pathEqual(l, filePath) && fs.existsSync(l)) {
          resource = dep;
          break;
        }
      } else {
        for (let i = 0; i < extensions.length; i++) {
          const ml = l + extensions[i];

          if (!pathEqual(ml, filePath) && fs.existsSync(ml)) {
            resource = dep;
            break loop;
          }
        }
      }
    }

    if (resource) {
      if (isTS) {
        // Ensure a safe, relative join for TS paths
        return `'${path.join(resource, srcRel)}'`;
      }

      // For JS, include the dependency's sourceDir, still using the safe relative segment
      return `'${path.join(
        resource,
        depMap[resource].config.sourceDir,
        srcRel
      )}'`;
    }

    return orig;
  });
};

Object.assign(module.exports, {
  hasImport,
  importRgxp
});

