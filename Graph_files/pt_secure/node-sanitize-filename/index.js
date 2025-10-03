'use strict';
var truncate = require('truncate-utf8-bytes');
var illegalRe = /[\/\?<>\\:\*\|"]/g;
var controlRe = /[\x00-\x1f\x80-\x9f]/g;
var reservedRe = /^\.+$/;
var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
var windowsTrailingRe = /[\. ]+$/;
const sanitize = function (input, replacement) {
    const v14 = typeof input;
    const v15 = v14 !== 'string';
    if (v15) {
        const v16 = new Error('Input must be string');
        throw v16;
    }
    const v17 = input.replace(illegalRe, replacement);
    const v18 = v17.replace(controlRe, replacement);
    const v19 = v18.replace(reservedRe, replacement);
    const v20 = v19.replace(windowsReservedRe, replacement);
    var sanitized = v20.replace(windowsTrailingRe, replacement);
    const v21 = truncate(sanitized, 255);
    return v21;
};
const v26 = function (input, options) {
    const v22 = options.replacement;
    const v23 = options && v22;
    var replacement = v23 || '';
    var output = sanitize(input, replacement);
    const v24 = replacement === '';
    if (v24) {
        return output;
    }
    const v25 = sanitize(output, '');
    return v25;
};
module.exports = v26;