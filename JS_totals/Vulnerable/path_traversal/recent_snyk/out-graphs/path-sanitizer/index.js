import {
    normalize,
    join
} from 'node:path';
export const v39 = {
    regex: /%2e/g,
    replacement: '.'
};
export default const sanitize = function (pathstr, options = DEFAULT_OPTIONS) {
    const v43 = !options;
    if (v43) {
        options = DEFAULT_OPTIONS;
    }
    const v44 = typeof options;
    const v45 = v44 !== 'object';
    if (v45) {
        const v46 = new Error('options must be an object');
        throw v46;
    }
    const v47 = options.decode;
    const v48 = Array.isArray(v47);
    const v49 = !v48;
    if (v49) {
        const v50 = DEFAULT_OPTIONS.decode;
        options.decode = v50;
    }
    const v51 = options.parentDirectoryRegEx;
    const v52 = !v51;
    if (v52) {
        const v53 = DEFAULT_OPTIONS.parentDirectoryRegEx;
        options.parentDirectoryRegEx = v53;
    }
    const v54 = options.notAllowedRegEx;
    const v55 = !v54;
    if (v55) {
        const v56 = DEFAULT_OPTIONS.notAllowedRegEx;
        options.notAllowedRegEx = v56;
    }
    const v57 = typeof pathstr;
    const v58 = v57 !== 'string';
    if (v58) {
        pathstr = `${ pathstr }`;
    }
    let sanitizedPath = pathstr;
    const v59 = options.decode;
    const v62 = decode => {
        const v60 = decode.regex;
        const v61 = decode.replacement;
        sanitizedPath = sanitizedPath.replace(v60, v61);
    };
    const v63 = v59.forEach(v62);
    v63;
    const v64 = options.notAllowedRegEx;
    sanitizedPath = sanitizedPath.replace(v64, '');
    sanitizedPath = sanitizedPath.replace(/[\\]/g, '/');
    const v65 = options.parentDirectoryRegEx;
    sanitizedPath = sanitizedPath.replace(v65, '/');
    sanitizedPath = sanitizedPath.replace(/^\.\.[\/\\]/g, '/');
    sanitizedPath = sanitizedPath.replace(/[\/\\]\.\.$/g, '/');
    sanitizedPath = sanitizedPath.replace(/[\/\\]+/g, '/');
    sanitizedPath = normalize(sanitizedPath);
    const v66 = sanitizedPath.endsWith('/');
    const v67 = sanitizedPath.endsWith('\\');
    let v68 = v66 || v67;
    while (v68) {
        const v69 = -1;
        sanitizedPath = sanitizedPath.slice(0, v69);
        v68 = v66 || v67;
    }
    const v70 = sanitizedPath.startsWith('/');
    const v71 = sanitizedPath.startsWith('\\');
    let v72 = v70 || v71;
    while (v72) {
        sanitizedPath = sanitizedPath.slice(1);
        v72 = v70 || v71;
    }
    sanitizedPath = join('', sanitizedPath);
    const v73 = options.notAllowedRegEx;
    sanitizedPath = sanitizedPath.replace(v73, '');
    sanitizedPath = sanitizedPath.replace(/[\\]/g, '/');
    sanitizedPath = sanitizedPath.replace(/[\/\\]+/g, '/');
    const v74 = sanitizedPath.trim();
    const v75 = v74 === '.';
    if (v75) {
        sanitizedPath = '';
    } else {
        sanitizedPath = sanitizedPath;
    }
    const v76 = sanitizedPath.trim();
    return v76;
};