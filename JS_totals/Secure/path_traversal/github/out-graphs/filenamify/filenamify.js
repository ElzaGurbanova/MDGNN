import filenameReservedRegex, { windowsReservedNameRegex } from 'filename-reserved-regex';
const MAX_FILENAME_LENGTH = 100;
const reRelativePath = /^\.+(\\|\/)|^\.+$/;
const reTrailingPeriods = /\.+$/;
export default const filenamify = function (string, options = {}) {
    const reControlChars = /[\u0000-\u001F\u0080-\u009F]/g;
    const reRepeatedReservedCharacters = /([<>:"/\\|?*\u0000-\u001F]){2,}/g;
    const v41 = typeof string;
    const v42 = v41 !== 'string';
    if (v42) {
        const v43 = new TypeError('Expected a string');
        throw v43;
    }
    let replacement;
    const v44 = options.replacement;
    const v45 = v44 === undefined;
    const v46 = options.replacement;
    if (v45) {
        replacement = '!';
    } else {
        replacement = v46;
    }
    const v47 = filenameReservedRegex();
    const v48 = v47.test(replacement);
    const v49 = reControlChars.test(replacement);
    const v50 = v48 && v49;
    if (v50) {
        const v51 = new Error('Replacement string cannot contain reserved filename characters');
        throw v51;
    }
    const v52 = replacement.length;
    const v53 = v52 > 0;
    if (v53) {
        string = string.replace(reRepeatedReservedCharacters, '$1');
    }
    string = string.normalize('NFD');
    string = string.replace(reRelativePath, replacement);
    const v54 = filenameReservedRegex();
    string = string.replace(v54, replacement);
    string = string.replace(reControlChars, replacement);
    string = string.replace(reTrailingPeriods, '');
    const v55 = replacement.length;
    const v56 = v55 > 0;
    if (v56) {
        const v57 = string[0];
        const startedWithDot = v57 === '.';
        const v58 = !startedWithDot;
        const v59 = string[0];
        const v60 = v59 === '.';
        const v61 = v58 && v60;
        if (v61) {
            string = replacement + string;
        }
        const v62 = string.length;
        const v63 = v62 - 1;
        const v64 = string[v63];
        const v65 = v64 === '.';
        if (v65) {
            string += replacement;
        }
    }
    const v66 = windowsReservedNameRegex();
    const v67 = v66.test(string);
    const v68 = string + replacement;
    if (v67) {
        string = v68;
    } else {
        string = string;
    }
    let allowedLength;
    const v69 = options.maxLength;
    const v70 = typeof v69;
    const v71 = v70 === 'number';
    const v72 = options.maxLength;
    if (v71) {
        allowedLength = v72;
    } else {
        allowedLength = MAX_FILENAME_LENGTH;
    }
    const v73 = string.length;
    const v74 = v73 > allowedLength;
    if (v74) {
        const extensionIndex = string.lastIndexOf('.');
        const v75 = -1;
        const v76 = extensionIndex === v75;
        if (v76) {
            string = string.slice(0, allowedLength);
        } else {
            const filename = string.slice(0, extensionIndex);
            const extension = string.slice(extensionIndex);
            const v77 = extension.length;
            const v78 = allowedLength - v77;
            const v79 = Math.max(1, v78);
            const v80 = filename.slice(0, v79);
            string = v80 + extension;
        }
    }
    return string;
};