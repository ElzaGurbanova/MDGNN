const childProcess = require('child_process'),
      config = require('./config'),
      environment = require('./environment'),
      fs = require('fs-extra'),
      selfsigned = require('selfsigned');
// shell-escape no longer needed when passing argv directly
// const shellEscape = require('shell-escape');

module.exports = {
  artisanCommand: artisanCommand,
  composeCommand: composeCommand,
  mysqlCommand: mysqlCommand,
  regenerateHTTPSCertificate: regenerateHTTPSCertificate,
  shellCommand: shellCommand,
  wpCommand: wpCommand
};

/**
 * Runs a Laravel Artisan command in the specified container.
 *
 * @param {Array}  commandArgs  The command to run (argv array), e.g. ['migrate','--force'].
 * @param {String} container    Container name (defaults to PHP container).
 */
function artisanCommand(commandArgs, container = null) {
  const currentSiteName = environment.currentSiteName;

  if (!container) {
    container = config.default_php_container;
  }
  if (!currentSiteName) {
    console.error('This command must be run from within a site directory.');
    process.exit(1);
  }

  const workdir = `/var/www/html/sites/${currentSiteName}/htdocs`;

  const composeArgs = [
    'exec',
    '--user=www-data',
    '-w', workdir,       // no shell; set working directory
    container,
    'php',
    'artisan',
    ...commandArgs
  ];

  composeCommand(composeArgs);
}

/**
 * Runs a docker-compose command.
 *
 * @param {Array}   command       The command to run (argv array).
 * @param {Boolean} captureOutput Whether to capture and return the output, or pipe it to the console.
 *
 * @returns {Object|undefined} The command's result string (stdout/stderr trimmed) if captureOutput is true.
 */
function composeCommand(command, captureOutput = false) {
  return shellCommand(environment.runDirectory, 'docker-compose', command, captureOutput);
}

/**
 * Runs a MySQL command.
 *
 * @param {String}  sql            The SQL to run.
 * @param {Boolean} selectDatabase Whether to select the database of the current site before running the command.
 */
function mysqlCommand(sql, selectDatabase = false) {
  if (selectDatabase && environment.currentSiteName) {
    sql = 'USE "' + environment.currentSiteName + '"; ' + sql;
  }

  composeCommand([
    'exec',
    config.default_php_container,
    'mysql',
    '--host=mysql',
    '--user=root',
    '--password=root',
    '-e',
    sql
  ]);
}

/**
 * Regenerates the HTTPS certificate.
 *
 * @param {Array} hosts The hosts to include in the certificate.
 */
function regenerateHTTPSCertificate(hosts = []) {
  shellCommand(environment.appHomeDirectory, 'sudo', [
    'security',
    'delete-certificate',
    '-c', 'pilothouse.dev',
    '/Library/Keychains/System.keychain'
  ], true);

  hosts.unshift('localhost');

  const altNames = hosts.map((host) => ({ type: 2, value: host }));

  const attrs = [{ name: 'commonName', value: 'pilothouse.dev' }];

  const options = {
    algorithm: 'sha256',
    days: 3650,
    extensions: [
      { name: 'basicConstraints', cA: true },
      { name: 'subjectAltName', altNames: altNames }
    ],
    keySize: 2048
  };

  const pems = selfsigned.generate(attrs, options);

  fs.writeFileSync(environment.httpsCertificateCertPath, pems.cert);
  fs.writeFileSync(environment.httpsCertificateKeyPath, pems.private);

  shellCommand(environment.appHomeDirectory, 'sudo', [
    'security',
    'add-trusted-cert',
    '-d',
    '-r', 'trustRoot',
    '-k', '/Library/Keychains/System.keychain',
    environment.httpsCertificateCertPath
  ]);
}

/**
 * Runs a shell command via spawnSync (no shell unless the binary needs it).
 *
 * @param {String}  cwd           Working directory.
 * @param {String}  command       Program to run (e.g., 'docker-compose').
 * @param {Array}   args          Argv array.
 * @param {Boolean} captureOutput Whether to return output instead of inheriting stdio.
 *
 * @returns {String|undefined} Trimmed stdout/stderr if captureOutput, otherwise undefined.
 */
function shellCommand(cwd, command, args, captureOutput = false) {
  const result = childProcess.spawnSync(command, args, {
    cwd,
    stdio: captureOutput ? 'pipe' : 'inherit',
    shell: false
  });

  if (captureOutput) {
    const stderr = result.stderr ? result.stderr.toString() : '';
    const stdout = result.stdout ? result.stdout.toString() : '';
    return stdout.length ? stdout.trim() : stderr.trim();
  }
}

/**
 * Runs a WP-CLI command in the specified container.
 *
 * @param {Array}  commandArgs  The wp subcommand and args (argv array), e.g. ['plugin','list'].
 * @param {String} container    Container name (defaults to PHP container).
 */
function wpCommand(commandArgs, container = null) {
  const currentSiteName = environment.currentSiteName;

  if (!container) {
    container = config.default_php_container;
  }

  let composeArgs;

  if (currentSiteName) {
    const workdir = `/var/www/html/sites/${currentSiteName}/${environment.currentPathInSite}`;
    const wpPath = `/var/www/html/sites/${currentSiteName}/htdocs`;
    composeArgs = [
      'exec',
      '--user=www-data',
      '-w', workdir,     // set working directory instead of "cd &&"
      container,
      'wp',
      `--path=${wpPath}`,
      ...commandArgs
    ];
  } else if (commandArgs.length === 1 && commandArgs[0] === '--info') {
    composeArgs = [
      'exec',
      '--user=www-data',
      '-w', '/var/www/html/sites',
      container || config.default_php_container,
      'wp',
      '--info'
    ];
  } else {
    console.error('This command must be run from within a site directory.');
    process.exit(1);
  }

  composeCommand(composeArgs);
}

