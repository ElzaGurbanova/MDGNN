const childProcess = require('child_process');
const config = require('./config');
const environment = require('./environment');
const fs = require('fs-extra');
const selfsigned = require('selfsigned');
const v61 = {};
v61.artisanCommand = artisanCommand;
v61.composeCommand = composeCommand;
v61.mysqlCommand = mysqlCommand;
v61.regenerateHTTPSCertificate = regenerateHTTPSCertificate;
v61.shellCommand = shellCommand;
v61.wpCommand = wpCommand;
module.exports = v61;
const artisanCommand = function (commandArgs, container = null) {
    const currentSiteName = environment.currentSiteName;
    const v62 = !container;
    if (v62) {
        container = config.default_php_container;
    }
    const v63 = !currentSiteName;
    if (v63) {
        const v64 = console.error('This command must be run from within a site directory.');
        v64;
        const v65 = process.exit(1);
        v65;
    }
    const workdir = `/var/www/html/sites/${ currentSiteName }/htdocs`;
    const composeArgs = [
        'exec',
        '--user=www-data',
        '-w',
        workdir,
        container,
        'php',
        'artisan',
        ...commandArgs
    ];
    const v66 = composeCommand(composeArgs);
    v66;
};
const composeCommand = function (command, captureOutput = false) {
    const v67 = environment.runDirectory;
    const v68 = shellCommand(v67, 'docker-compose', command, captureOutput);
    return v68;
};
const mysqlCommand = function (sql, selectDatabase = false) {
    const v69 = environment.currentSiteName;
    const v70 = selectDatabase && v69;
    if (v70) {
        const v71 = environment.currentSiteName;
        const v72 = 'USE "' + v71;
        const v73 = v72 + '"; ';
        sql = v73 + sql;
    }
    const v74 = config.default_php_container;
    const v75 = [
        'exec',
        v74,
        'mysql',
        '--host=mysql',
        '--user=root',
        '--password=root',
        '-e',
        sql
    ];
    const v76 = composeCommand(v75);
    v76;
};
const regenerateHTTPSCertificate = function (hosts = []) {
    const v77 = environment.appHomeDirectory;
    const v78 = [
        'security',
        'delete-certificate',
        '-c',
        'pilothouse.dev',
        '/Library/Keychains/System.keychain'
    ];
    const v79 = shellCommand(v77, 'sudo', v78, true);
    v79;
    const v80 = hosts.unshift('localhost');
    v80;
    const v82 = host => {
        const v81 = {};
        v81.type = 2;
        v81.value = host;
        return v81;
    };
    const altNames = hosts.map(v82);
    const v83 = {
        name: 'commonName',
        value: 'pilothouse.dev'
    };
    const attrs = [v83];
    const v84 = {
        name: 'basicConstraints',
        cA: true
    };
    const v85 = {
        name: 'subjectAltName',
        altNames: altNames
    };
    const v86 = [
        v84,
        v85
    ];
    const options = {};
    options.algorithm = 'sha256';
    options.days = 3650;
    options.extensions = v86;
    options.keySize = 2048;
    const pems = selfsigned.generate(attrs, options);
    const v87 = environment.httpsCertificateCertPath;
    const v88 = pems.cert;
    const v89 = fs.writeFileSync(v87, v88);
    v89;
    const v90 = environment.httpsCertificateKeyPath;
    const v91 = pems.private;
    const v92 = fs.writeFileSync(v90, v91);
    v92;
    const v93 = environment.appHomeDirectory;
    const v94 = environment.httpsCertificateCertPath;
    const v95 = [
        'security',
        'add-trusted-cert',
        '-d',
        '-r',
        'trustRoot',
        '-k',
        '/Library/Keychains/System.keychain',
        v94
    ];
    const v96 = shellCommand(v93, 'sudo', v95);
    v96;
};
const shellCommand = function (cwd, command, args, captureOutput = false) {
    let v97;
    if (captureOutput) {
        v97 = 'pipe';
    } else {
        v97 = 'inherit';
    }
    const v98 = {
        cwd,
        stdio: v97,
        shell: false
    };
    const result = childProcess.spawnSync(command, args, v98);
    if (captureOutput) {
        let stderr;
        const v99 = result.stderr;
        const v100 = result.stderr;
        const v101 = v100.toString();
        if (v99) {
            stderr = v101;
        } else {
            stderr = '';
        }
        let stdout;
        const v102 = result.stdout;
        const v103 = result.stdout;
        const v104 = v103.toString();
        if (v102) {
            stdout = v104;
        } else {
            stdout = '';
        }
        const v105 = stdout.length;
        const v106 = stdout.trim();
        const v107 = stderr.trim();
        let v108;
        if (v105) {
            v108 = v106;
        } else {
            v108 = v107;
        }
        return v108;
    }
};
const wpCommand = function (commandArgs, container = null) {
    const currentSiteName = environment.currentSiteName;
    const v109 = !container;
    if (v109) {
        container = config.default_php_container;
    }
    let composeArgs;
    if (currentSiteName) {
        const v110 = environment.currentPathInSite;
        const workdir = `/var/www/html/sites/${ currentSiteName }/${ v110 }`;
        const wpPath = `/var/www/html/sites/${ currentSiteName }/htdocs`;
        composeArgs = [
            'exec',
            '--user=www-data',
            '-w',
            workdir,
            container,
            'wp',
            `--path=${ wpPath }`,
            ...commandArgs
        ];
    } else {
        const v111 = commandArgs.length;
        const v112 = v111 === 1;
        const v113 = commandArgs[0];
        const v114 = v113 === '--info';
        const v115 = v112 && v114;
        if (v115) {
            const v116 = config.default_php_container;
            const v117 = container || v116;
            composeArgs = [
                'exec',
                '--user=www-data',
                '-w',
                '/var/www/html/sites',
                v117,
                'wp',
                '--info'
            ];
        } else {
            const v118 = console.error('This command must be run from within a site directory.');
            v118;
            const v119 = process.exit(1);
            v119;
        }
    }
    const v120 = composeCommand(composeArgs);
    v120;
};