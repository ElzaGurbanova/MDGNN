'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');

function setupRoutelessMVC(app, options = {}) {
  const {
    viewsDir = path.join(process.cwd(), 'views'),
    controllersDir = path.join(process.cwd(), 'controllers'),
    viewEngine = 'html',
    viewExtensions = ['.html'],
    controllerExtensions = ['.js'],
    rootDefaultIndex = 'index',
    caseSensitive = false,
  } = options;

  // Canonicalize roots to avoid symlink confusion
  const viewsRoot = fs.realpathSync(viewsDir);
  const controllersRoot = fs.realpathSync(controllersDir);

  app.set('views', viewsRoot);
  app.set('view engine', viewEngine);

  // Preload controllers
  const controllers = {};
  const controllerFiles = fs.readdirSync(controllersRoot);

  controllerFiles.forEach((file) => {
    for (const ext of controllerExtensions) {
      if (file.endsWith(ext)) {
        const route = file.slice(0, -ext.length);
        const controllerPath = path.join(controllersRoot, file);
        controllers[route.toLowerCase()] = require(controllerPath);
        break;
      }
    }
  });

  app.get('*', (req, res, next) => {
    let page = req.path.replace(/^\/+/, '') || rootDefaultIndex;
    if (!caseSensitive) page = page.toLowerCase();

    // Sanitize input
    if (!/^[a-zA-Z0-9/_-]*$/.test(page)) return res.status(400).send('Bad Request');

    // Normalize and validate path
    const normalizedPage = path.posix.normalize(`/${page}`);
    if (normalizedPage.includes('..')) return res.status(400).send('Bad Request');

    const findExistingFile = (dir, baseName, extensions) => {
      const dirReal = fs.realpathSync(dir);
      for (const ext of extensions) {
        const candidate = path.join(dirReal, `${baseName}${ext}`);
        const resolved = path.resolve(candidate);
        let real;
        try {
          real = fs.realpathSync(resolved); // follow symlinks
        } catch {
          continue; // non-existent or broken link
        }
        const rel = path.relative(dirReal, real);
        if (!rel.startsWith('..') && !path.isAbsolute(rel) && fs.existsSync(real)) {
          return real;
        }
      }
      return null;
    };

    const templatePath = findExistingFile(viewsRoot, page, viewExtensions);

    if (!templatePath) {
      return res.status(404).render('404', { url: req.originalUrl });
    }

    const controller = controllers[page];

    const renderTemplate = (data = {}) => {
      if (viewEngine === 'html') {
        res.sendFile(templatePath);
      } else {
        const templateName = path
          .relative(viewsRoot, templatePath)
          .replace(/\\/g, '/')
          .replace(/\.[^/.]+$/, '');
        res.render(templateName, data, (err, html) => {
          if (err) return next(err);
          res.send(html);
        });
      }
    };

    if (controller) {
      try {
        const result = controller(req, res, next);
        if (result && typeof result.then === 'function') {
          result.then(renderTemplate).catch(next);
        } else {
          renderTemplate(result);
        }
      } catch (err) {
        next(err);
      }
    } else {
      renderTemplate();
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    const errorTemplatePath = path.join(viewsRoot, '500' + (viewExtensions[0] || '.html'));
    if (fs.existsSync(errorTemplatePath)) {
      res.status(500).render('500', { error: err });
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
}

module.exports = setupRoutelessMVC;

