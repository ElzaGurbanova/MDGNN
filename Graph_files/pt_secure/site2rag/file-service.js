import fs from 'fs';
import path from 'path';
import logger from './logger_service.js';
export const FileService = function FileService(options = {}) {
    const v133 = options.outputDir;
    this.outputDir = v133 || './output';
    const v134 = options.flat;
    this.flat = v134 || false;
};