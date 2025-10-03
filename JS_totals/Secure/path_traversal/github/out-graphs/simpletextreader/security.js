import path from 'path';
import { config } from '../config/config.js';
export const sanitizeFilePath = function (filename, allowedExtensions = config.FILE.SUPPORTED_FILE_EXT, basePath = config.PATH.LIBRARY) {
    const v85 = !filename;
    if (v85) {
        return null;
    }
    const v86 = typeof filename;
    const v87 = v86 !== 'string';
    if (v87) {
        return null;
    }
    const v88 = filename.length;
    const v89 = v88 > 255;
    if (v89) {
        return null;
    }
    const dangerousChars = /[<>:"/\\|?*\x00-\x1F]/g;
    const v90 = dangerousChars.test(filename);
    if (v90) {
        const v91 = console.log('[Security] Dangerous characters in filename:', filename);
        v91;
        return null;
    }
    const normalizedPath = path.normalize(filename);
    const safeFilename = path.basename(normalizedPath);
    const v92 = path.extname(safeFilename);
    const v93 = allowedExtensions.includes(v92);
    const v94 = !v93;
    if (v94) {
        const v95 = console.log('[Security] Invalid file extension:', filename);
        v95;
        return null;
    }
    const libraryDir = path.resolve(basePath);
    const fullPath = path.resolve(libraryDir, safeFilename);
    const v96 = fullPath.startsWith(libraryDir);
    const v97 = !v96;
    if (v97) {
        const v98 = {
            requested: filename,
            resolved: fullPath,
            allowedDir: libraryDir
        };
        const v99 = console.log('[Security] Directory traversal attempt:', v98);
        v99;
        return null;
    }
    return safeFilename;
};
const enforceHttps = (req, res, next) => {
    const v100 = req.headers;
    const v101 = v100['x-forwarded-proto'];
    const isProxied = v101 === 'https';
    const v102 = config.SECURITY;
    const v103 = v102.HTTPS;
    const v104 = v103.ENABLED;
    const v105 = !v104;
    const v106 = v105 || isProxied;
    if (v106) {
        const v107 = next();
        return v107;
    }
    const v108 = config.SECURITY;
    const v109 = v108.HTTPS;
    const v110 = v109.ENABLED;
    const v111 = console.log('config.SECURITY.HTTPS.ENABLED', v110);
    v111;
    const v112 = console.log('isProxied', isProxied);
    v112;
    const v113 = process.env;
    const v114 = v113.NODE_ENV;
    const v115 = console.log('process.env.NODE_ENV', v114);
    v115;
    const v116 = process.env;
    const v117 = v116.NODE_ENV;
    const v118 = v117 === 'production';
    const v119 = !isProxied;
    const v120 = v118 && v119;
    if (v120) {
        const v121 = req.headers;
        const v122 = v121.host;
        const v123 = req.url;
        const httpsUrl = `https://${ v122 }${ v123 }`;
        const v124 = `[Security] Redirecting to HTTPS: ${ httpsUrl }`;
        const v125 = console.log(v124);
        v125;
        const v126 = res.redirect(301, httpsUrl);
        return v126;
    }
    const v127 = next();
    v127;
};
const securityHeaders = (req, res, next) => {
    const v128 = config.SECURITY;
    const HEADERS = v128.HEADERS;
    const v129 = HEADERS.HSTS;
    const v130 = v129.enabled;
    const v131 = process.env;
    const v132 = v131.NODE_ENV;
    const v133 = v132 === 'production';
    const v134 = v130 && v133;
    if (v134) {
        const v135 = HEADERS.HSTS;
        const v136 = v135.maxAge;
        const v137 = HEADERS.HSTS;
        const v138 = v137.includeSubDomains;
        let v139;
        if (v138) {
            v139 = 'includeSubDomains';
        } else {
            v139 = '';
        }
        const v140 = HEADERS.HSTS;
        const v141 = v140.preload;
        let v142;
        if (v141) {
            v142 = 'preload';
        } else {
            v142 = '';
        }
        const v143 = [
            `max-age=${ v136 }`,
            v139,
            v142
        ];
        const v144 = v143.filter(Boolean);
        const hstsValue = v144.join('; ');
        const v145 = res.setHeader('Strict-Transport-Security', hstsValue);
        v145;
    }
    const v146 = HEADERS.CSP;
    const v147 = v146.enabled;
    if (v147) {
        const v148 = HEADERS.CSP;
        const v149 = v148.directives;
        const v150 = Object.entries(v149);
        const v156 = ([key, value]) => {
            const v153 = m => {
                const v151 = m.toLowerCase();
                const v152 = `-${ v151 }`;
                return v152;
            };
            const directive = key.replace(/[A-Z]/g, v153);
            const v154 = value.join(' ');
            const v155 = `${ directive } ${ v154 }`;
            return v155;
        };
        const v157 = v150.map(v156);
        const cspValue = v157.join('; ');
        const v158 = res.setHeader('Content-Security-Policy', cspValue);
        v158;
    }
    const v159 = HEADERS;
    const GENERAL = v159.GENERAL;
    const v160 = GENERAL.frameOptions;
    const v161 = res.setHeader('X-Frame-Options', v160);
    v161;
    const v162 = GENERAL.xssProtection;
    const v163 = res.setHeader('X-XSS-Protection', v162);
    v163;
    const v164 = GENERAL.noSniff;
    const v165 = res.setHeader('X-Content-Type-Options', v164);
    v165;
    const v166 = GENERAL.referrerPolicy;
    const v167 = res.setHeader('Referrer-Policy', v166);
    v167;
    const v168 = next();
    v168;
};
export const security = [
    enforceHttps,
    securityHeaders
];