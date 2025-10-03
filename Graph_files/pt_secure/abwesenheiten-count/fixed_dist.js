import {
    join,
    resolve
} from 'path';
import {
    existsSync,
    realpathSync
} from 'fs';
import logger from '../services/logger.js';
export default const DistManager = function DistManager(app) {
    this.app = app;
    const v50 = {};
    v50.chartist = 'node_modules/chartist/dist';
    this.libraries = v50;
};