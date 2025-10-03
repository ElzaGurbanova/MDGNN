import {
    normalize,
    join
} from 'node:path';
export const v51 = {
    regex: /%2e/g,
    replacement: '.'
};
export default const sanitize = function (pathstr, options = DEFAULT_OPTIONS) {
    const v55 = !options;
    if (v55) {
        options = DEFAULT_OPTIONS;
    }
    const v56 = typeof options;
    const v57 = v56 !== 'object';
    if (v57) {
        const v58 = new Error('options must be an object');
        throw v58;
    }
    const v59 = options.decode;
    const v60 = Array.isArray(v59);
    const v61 = !v60;
    if (v61) {
        const v62 = DEFAULT_OPTIONS.decode;
        options.decode = v62;
    }
    const v63 = options.parentDirectoryRegEx;
    const v64 = !v63;
    if (v64) {
        const v65 = DEFAULT_OPTIONS.parentDirectoryRegEx;
        options.parentDirectoryRegEx = v65;
    }
    const v66 = options.notAllowedRegEx;
    const v67 = !v66;
    if (v67) {
        const v68 = DEFAULT_OPTIONS.notAllowedRegEx;
        options.notAllowedRegEx = v68;
    }
    const v69 = typeof pathstr;
    const v70 = v69 !== 'string';
    if (v70) {
        pathstr = `${ pathstr }`;
    }
    let sanitizedPath = pathstr;
    const v71 = options.decode;
    const v74 = decode => {
        const v72 = decode.regex;
        const v73 = decode.replacement;
        sanitizedPath = sanitizedPath.replace(v72, v73);
    };
    const v75 = v71.forEach(v74);
    v75;
    const v76 = options.notAllowedRegEx;
    sanitizedPath = sanitizedPath.replace(v76, '');
    sanitizedPath = sanitizedPath.replace(/[\\]/g, '/');
    const v77 = options.parentDirectoryRegEx;
    sanitizedPath = sanitizedPath.replace(v77, '/');
    sanitizedPath = sanitizedPath.replace(/^\.\.[\/\\]/g, '/');
    sanitizedPath = sanitizedPath.replace(/[\/\\]\.\.$/g, '/');
    sanitizedPath = sanitizedPath.replace(/[\/\\]+/g, '/');
    sanitizedPath = normalize(sanitizedPath);
    const v78 = sanitizedPath.endsWith('/');
    const v79 = sanitizedPath.endsWith('\\');
    let v80 = v78 || v79;
    while (v80) {
        const v81 = -1;
        sanitizedPath = sanitizedPath.slice(0, v81);
        v80 = v78 || v79;
    }
    const v82 = sanitizedPath.startsWith('/');
    const v83 = sanitizedPath.startsWith('\\');
    let v84 = v82 || v83;
    while (v84) {
        sanitizedPath = sanitizedPath.slice(1);
        v84 = v82 || v83;
    }
    sanitizedPath = join('', sanitizedPath);
    const v85 = options.notAllowedRegEx;
    sanitizedPath = sanitizedPath.replace(v85, '');
    sanitizedPath = sanitizedPath.replace(/[\\]/g, '/');
    sanitizedPath = sanitizedPath.replace(/[\/\\]+/g, '/');
    const v86 = options.parentDirectoryRegEx;
    sanitizedPath = sanitizedPath.replace(v86, '/');
    const v87 = sanitizedPath.startsWith('/');
    const v88 = sanitizedPath.startsWith('./');
    const v89 = v87 || v88;
    const v90 = sanitizedPath.endsWith('/..');
    const v91 = v89 || v90;
    const v92 = sanitizedPath.endsWith('/../');
    const v93 = v91 || v92;
    const v94 = sanitizedPath.startsWith('../');
    const v95 = v93 || v94;
    const v96 = sanitizedPath.startsWith('/../');
    let v97 = v95 || v96;
    while (v97) {
        sanitizedPath = sanitizedPath.replace(/^\.\//g, '');
        sanitizedPath = sanitizedPath.replace(/^\//g, '');
        sanitizedPath = sanitizedPath.replace(/^[\/\\]\.\.[\/\\]/g, '/');
        sanitizedPath = sanitizedPath.replace(/^\.\.[\/\\]/g, '/');
        sanitizedPath = sanitizedPath.replace(/[\/\\]\.\.$/g, '/');
        sanitizedPath = sanitizedPath.replace(/[\/\\]\.\.\/$/g, '/');
        v97 = v95 || v96;
    }
    const v98 = sanitizedPath.trim();
    const v99 = v98 === '.';
    if (v99) {
        sanitizedPath = '';
    } else {
        sanitizedPath = sanitizedPath;
    }
    const v100 = sanitizedPath.trim();
    return v100;
};