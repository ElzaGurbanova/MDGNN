const isValidFilePath = function (filePath) {
    const v7 = filePath.includes('..');
    if (v7) {
        return false;
    }
    const specialChars = /[<>:"|?*]/;
    const v8 = specialChars.test(filePath);
    if (v8) {
        return false;
    }
    return true;
};
const isValidFileType = function (filePath, allowedExtensions) {
    const lastDotIndex = filePath.lastIndexOf('.');
    const v9 = -1;
    const v10 = lastDotIndex === v9;
    if (v10) {
        return false;
    }
    const fileExtension = filePath.slice(lastDotIndex);
    const v11 = allowedExtensions.includes(fileExtension);
    return v11;
};
const v12 = {};
v12.isValidFilePath = isValidFilePath;
v12.isValidFileType = isValidFileType;
module.exports = v12;