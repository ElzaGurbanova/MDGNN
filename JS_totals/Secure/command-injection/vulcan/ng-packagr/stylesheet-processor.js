'use strict';

const path = require('path');
const log = require('../utils/log');
const { execFileSync } = require('child_process');

// CSS Tools
const autoprefixer = require('autoprefixer');
const browserslist = require('browserslist');
const nodeSassTildeImporter = require('node-sass-tilde-importer');
const postcss = require('postcss');
const postcssUrl = require('postcss-url');
const cssnanoPresetDefault = require('cssnano-preset-default');
const stylus = require('stylus');

// Mimic enum
const CssUrl = {
  inline: 'inline',
  none: 'none',
};

/*
 * By default `npm install` will install `sass`.
 * To use node-sass, install it explicitly (npm i -D node-sass / yarn add -D node-sass)
 */
let sassComplier;
try {
  // Prefer node-sass if present
  sassComplier = require('node-sass');
} catch {
  // Fallback to dart-sass
  sassComplier = require('sass');
}

class StylesheetProcessor {
  /**
   * @param {string} basePath
   * @param {'inline'|'none'} [cssUrl]
   * @param {string[]} [styleIncludePaths]
   */
  constructor(basePath, cssUrl, styleIncludePaths) {
    this.basePath = basePath;
    this.cssUrl = cssUrl;
    this.styleIncludePaths = styleIncludePaths;
    this.postCssProcessor = this.createPostCssProcessor(basePath, cssUrl);
  }

  /**
   * @param {string} filePath
   * @param {string} content
   */
  process(filePath, content) {
    // Render pre-processor language (sass, styl, less)
    const renderedCss = this.renderPreProcessor(filePath, content);

    // PostCSS (autoprefixing and friends)
    const result = this.postCssProcessor.process(renderedCss, {
      from: filePath,
      to: filePath.replace(path.extname(filePath), '.css'),
    });

    // Log warnings from PostCSS
    result.warnings().forEach((msg) => log.warn(msg.toString()));

    return result.css;
  }

  /**
   * @private
   * @param {string} filePath
   * @param {string} content
   * @returns {string}
   */
  renderPreProcessor(filePath, content) {
    const ext = path.extname(filePath);

    log.debug(`rendering ${ext} from ${filePath}`);

    switch (ext) {
      case '.sass':
      case '.scss':
        return sassComplier
          .renderSync({
            file: filePath,
            data: content,
            indentedSyntax: ext === '.sass',
            importer: nodeSassTildeImporter,
            includePaths: this.styleIncludePaths,
          })
          .css.toString();

      case '.less': {
        // Run lessc synchronously with --js enabled (intentionally preserved)
        const args = [filePath, '--js'];
        if (this.styleIncludePaths.length) {
          args.push(`--include-path=${this.styleIncludePaths.join(':')}`);
        }
        return execFileSync(require.resolve('less/bin/lessc'), args).toString();
      }

      case '.styl':
      case '.stylus':
        return stylus(content)
          // add paths for resolve
          .set('paths', [this.basePath, '.', ...this.styleIncludePaths, 'node_modules'])
          // add support for resolving plugins from node_modules
          .set('filename', filePath)
          // turn on url resolver in stylus, same as flag --resolve-url
          .set('resolve url', true)
          .define('url', stylus.resolver(undefined))
          .render();

      case '.css':
      default:
        return content;
    }
  }

  /**
   * @private
   * @param {string} basePath
   * @param {'inline'|'none'} [cssUrl]
   */
  createPostCssProcessor(basePath, cssUrl) {
    log.debug(`determine browserslist for ${basePath}`);
    const overrideBrowserslist = browserslist(undefined, { path: basePath });

    const postCssPlugins = [];

    if (cssUrl !== CssUrl.none) {
      log.debug(`postcssUrl: ${cssUrl}`);
      postCssPlugins.push(postcssUrl({ url: cssUrl }));
    }

    // Run autoprefixer after postcssUrl
    postCssPlugins.push(autoprefixer({ overrideBrowserslist, grid: true }));

    const preset = cssnanoPresetDefault({
      svgo: false,
      // Disable calc optimizations due to several issues.
      calc: false,
    });

    const asyncPlugins = ['postcss-svgo'];
    const cssNanoPlugins = preset.plugins
      // replicate cssnano initializePlugin behavior
      .map(([creator, pluginConfig]) => creator(pluginConfig))
      .filter((plugin) => !asyncPlugins.includes(plugin.postcssPlugin));

    postCssPlugins.push(...cssNanoPlugins);

    return postcss(postCssPlugins);
  }
}

module.exports = { CssUrl, StylesheetProcessor };

