import { join, resolve } from 'path';
import { existsSync, realpathSync } from 'fs';
import logger from '../services/logger.js';

export default class DistManager {
  constructor(app) {
    this.app = app;
    this.libraries = {
      chartist: 'node_modules/chartist/dist',
    };
  }

  addLibrary(libraryName, libraryPath) {
    if (!existsSync(libraryPath)) {
      logger.error(`Library path does not exist: ${libraryPath}`);
      return;
    }
    this.libraries[libraryName] = libraryPath;
    console.log(`✅ Added library: ${libraryName} from ${libraryPath}`);
  }

  start() {
    Object.entries(this.libraries).forEach(([libraryName, libraryPath]) => {
      // Canonicalize library root under cwd
      const abs = resolve(process.cwd(), libraryPath);
      if (!existsSync(abs)) {
        logger.error(`Library path does not exist: ${abs}`);
        return;
      }
      const libraryRoot = realpathSync(abs);

      this.app.use(`/dist/${libraryName}`, (req, res) => {
        try {
          // Make path relative: strip leading slashes/backslashes
          const decoded = decodeURIComponent(req.path || '/');
          const relPath = decoded.replace(/\\/g, '/').replace(/^\/+/, '');

          // Basic sanity: forbid NULs and dot segments
          if (!relPath || relPath.includes('\0') || relPath.includes('..')) {
            return res.status(404).send('File not found');
          }

          logger.debug(`Serving ${libraryName} file: ${libraryRoot}/${relPath}`);

          // Serve safely from the fixed root; Express blocks traversal with {root}
          res.sendFile(relPath, { root: libraryRoot, dotfiles: 'deny' }, (err) => {
            if (err) {
              logger.error(`Error serving ${libraryName} file`, err);
              if (!res.headersSent) res.status(404).send('File not found');
            }
          });
        } catch (e) {
          logger.error(`Error handling ${libraryName} request`, e);
          if (!res.headersSent) res.status(500).send('Server error');
        }
      });
    });

    logger.success('Distribution manager started');
  }
}

