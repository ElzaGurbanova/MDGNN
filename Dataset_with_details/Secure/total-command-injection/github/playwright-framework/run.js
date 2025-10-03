/**
 * Run command for the CLI
 *
 * This command runs tests with the specified options
 */
const { execFileSync } = require('child_process');
const path = require('path');
const logger = require('../../utils/common/logger');

/**
 * Run tests with the specified options
 * @param {Object} options - Command options
 */
module.exports = (options) => {
  try {
    logger.info('Running tests with options:', options);

    const args = ['playwright', 'test']; // npx argv

    // Specific test files (allow space-separated list)
    if (options.testFiles) {
      String(options.testFiles)
        .trim()
        .split(/\s+/)
        .forEach(f => { if (f) args.push(f); });
    }

    if (options.list) args.push('--list');

    if (options.tags) {
      args.push('--grep', String(options.tags));
    }

    if (options.project) {
      args.push('--project', String(options.project));
    }

    if (options.headed) args.push('--headed');
    if (options.debug) args.push('--debug');

    if (options.reporter) {
      args.push('--reporter', String(options.reporter));
    }

    if (options.workers) {
      args.push(`--workers=${String(options.workers)}`);
    }

    if (options.timeout) {
      args.push(`--timeout=${String(options.timeout)}`);
    }

    if (options.retries) {
      args.push(`--retries=${String(options.retries)}`);
    }

    if (options.output) {
      args.push('--output', String(options.output));
    }

    const env = { ...process.env };
    if (options.env) env.NODE_ENV = options.env;
    if (options.envVars) {
      Object.entries(options.envVars).forEach(([k, v]) => { env[k] = v; });
    }

    logger.info(`Executing: npx ${args.join(' ')}`);
    execFileSync('npx', args, { stdio: 'inherit', env, shell: false });

    logger.info('Tests completed successfully');
  } catch (error) {
    logger.error('Tests failed:', error.message || error);
    process.exit(1);
  }
};

