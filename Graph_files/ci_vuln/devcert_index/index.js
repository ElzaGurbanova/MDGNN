'use strict';
const v81 = { value: true };
const v82 = Object.defineProperty(exports, '__esModule', v81);
v82;
const tslib_1 = require('tslib');
const fs_1 = require('fs');
const v83 = require('debug');
const debug_1 = tslib_1.__importDefault(v83);
const command_exists_1 = require('command-exists');
const v84 = require('rimraf');
const rimraf_1 = tslib_1.__importDefault(v84);
const constants_1 = require('./constants');
const v85 = require('./platforms');
const platforms_1 = tslib_1.__importDefault(v85);
const v86 = require('./certificate-authority');
const certificate_authority_1 = tslib_1.__importStar(v86);
const v87 = certificate_authority_1.uninstall;
exports.uninstall = v87;
const v88 = require('./certificates');
const certificates_1 = tslib_1.__importDefault(v88);
const v89 = require('./user-interface');
const user_interface_1 = tslib_1.__importDefault(v89);
const debug = debug_1.default('devcert');
const certificateFor = function (domain, options = {}) {
    const v90 = void 0;
    const v91 = void 0;
    const v151 = function* () {
        const v92 = constants_1.VALID_DOMAIN;
        const v93 = v92.test(domain);
        const v94 = !v93;
        if (v94) {
            const v95 = new Error(`"${ domain }" is not a valid domain name.`);
            throw v95;
        }
        const v96 = options.skipCertutilInstall;
        const v97 = Boolean(v96);
        const v98 = options.skipHostsFile;
        const v99 = Boolean(v98);
        const v100 = `Certificate requested for ${ domain }. Skipping certutil install: ${ v97 }. Skipping hosts file: ${ v99 }`;
        const v101 = debug(v100);
        v101;
        const v102 = options.ui;
        if (v102) {
            const v103 = user_interface_1.default;
            const v104 = options.ui;
            const v105 = Object.assign(v103, v104);
            v105;
        }
        const v106 = constants_1.isMac;
        const v107 = !v106;
        const v108 = constants_1.isLinux;
        const v109 = !v108;
        const v110 = v107 && v109;
        const v111 = constants_1.isWindows;
        const v112 = !v111;
        const v113 = v110 && v112;
        if (v113) {
            const v114 = process.platform;
            const v115 = new Error(`Platform not supported: "${ v114 }"`);
            throw v115;
        }
        const v116 = command_exists_1.sync('openssl');
        const v117 = !v116;
        if (v117) {
            const v118 = new Error('OpenSSL not found: OpenSSL is required to generate SSL certificates - make sure it is installed and available in your PATH');
            throw v118;
        }
        const v119 = `private-key.key`;
        let domainKeyPath = constants_1.pathForDomain(domain, v119);
        const v120 = `certificate.crt`;
        let domainCertPath = constants_1.pathForDomain(domain, v120);
        const v121 = constants_1.rootCAKeyPath;
        const v122 = fs_1.existsSync(v121);
        const v123 = !v122;
        if (v123) {
            const v124 = debug('Root CA is not installed yet, so it must be our first run. Installing root CA ...');
            v124;
            const v125 = certificate_authority_1.default(options);
            yield v125;
        } else {
            const v126 = options.getCaBuffer;
            const v127 = options.getCaPath;
            const v128 = v126 || v127;
            if (v128) {
                const v129 = debug('Root CA is not readable, but it probably is because an earlier version of devcert locked it. Trying to fix...');
                v129;
                const v130 = certificate_authority_1.ensureCACertReadable(options);
                yield v130;
            }
        }
        const v131 = `certificate.crt`;
        const v132 = constants_1.pathForDomain(domain, v131);
        const v133 = fs_1.existsSync(v132);
        const v134 = !v133;
        if (v134) {
            const v135 = `Can't find certificate file for ${ domain }, so it must be the first request for ${ domain }. Generating and caching ...`;
            const v136 = debug(v135);
            v136;
            const v137 = certificates_1.default(domain);
            yield v137;
        }
        const v138 = options.skipHostsFile;
        const v139 = !v138;
        if (v139) {
            const v140 = platforms_1.default;
            const v141 = v140.addDomainToHostFileIfMissing(domain);
            yield v141;
        }
        const v142 = `Returning domain certificate`;
        const v143 = debug(v142);
        v143;
        const v144 = fs_1.readFileSync(domainKeyPath);
        const v145 = fs_1.readFileSync(domainCertPath);
        const ret = {};
        ret.key = v144;
        ret.cert = v145;
        const v146 = options.getCaBuffer;
        if (v146) {
            const v147 = constants_1.rootCACertPath;
            const v148 = fs_1.readFileSync(v147);
            ret.ca = v148;
        }
        const v149 = options.getCaPath;
        if (v149) {
            const v150 = constants_1.rootCACertPath;
            ret.caPath = v150;
        }
        return ret;
    };
    const v152 = tslib_1.__awaiter(this, v90, v91, v151);
    return v152;
};
exports.certificateFor = certificateFor;
const hasCertificateFor = function (domain) {
    const v153 = `certificate.crt`;
    const v154 = constants_1.pathForDomain(domain, v153);
    const v155 = fs_1.existsSync(v154);
    return v155;
};
exports.hasCertificateFor = hasCertificateFor;
const configuredDomains = function () {
    const v156 = constants_1.domainsDir;
    const v157 = fs_1.readdirSync(v156);
    return v157;
};
exports.configuredDomains = configuredDomains;
const removeDomain = function (domain) {
    const v158 = rimraf_1.default;
    const v159 = constants_1.pathForDomain(domain);
    const v160 = v158.sync(v159);
    return v160;
};
exports.removeDomain = removeDomain;