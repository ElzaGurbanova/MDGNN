export const validateString = function (value, name, maxLength = 1000) {
    const v29 = typeof value;
    const v30 = v29 !== 'string';
    if (v30) {
        const v31 = new Error(`${ name } must be a string`);
        throw v31;
    }
    const v32 = value.length;
    const v33 = v32 > maxLength;
    if (v33) {
        const v34 = new Error(`${ name } exceeds maximum length of ${ maxLength }`);
        throw v34;
    }
    const v35 = value.trim();
    return v35;
};
export const validateObject = function (value, name) {
    const v36 = !value;
    const v37 = typeof value;
    const v38 = v37 !== 'object';
    const v39 = v36 || v38;
    const v40 = Array.isArray(value);
    const v41 = v39 || v40;
    if (v41) {
        const v42 = new Error(`${ name } must be a valid object`);
        throw v42;
    }
    return value;
};
export const validatePath = function (filePath) {
    const v43 = !filePath;
    const v44 = typeof filePath;
    const v45 = v44 !== 'string';
    const v46 = v43 || v45;
    if (v46) {
        const v47 = new Error('File path must be a string');
        throw v47;
    }
    const v48 = filePath.includes('..');
    const v49 = filePath.includes('~');
    const v50 = v48 || v49;
    if (v50) {
        const v51 = new Error('Invalid file path');
        throw v51;
    }
    return filePath;
};
export const sanitizeInput = function (input) {
    const v52 = typeof input;
    const v53 = v52 !== 'string';
    if (v53) {
        return input;
    }
    const v54 = input.replace(/[<>]/g, '');
    const v55 = v54.replace(/javascript:/gi, '');
    const v56 = v55.replace(/on\w+=/gi, '');
    return v56;
};