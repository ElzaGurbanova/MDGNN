const sanitizeFileName = function (fileName) {
    const v15 = !fileName;
    if (v15) {
        return '';
    }
    const v16 = String(fileName);
    let name = v16.trim();
    const v17 = name.replace(/%2e/gi, '.');
    const v18 = v17.replace(/%2f/gi, '/');
    name = v18.replace(/%5c/gi, '\\');
    const v19 = name.split('/');
    name = v19.pop();
    const v20 = name.split('\\');
    name = v20.pop();
    name = name.replace(/^\.+/, '');
    const v21 = name.replace(/[\x00-\x1f\x80-\x9f]/g, '');
    name = v21.replace(/[\\/:*?"<>|]/g, '_');
    name = name.replace(/\.\./g, '_');
    const v22 = !name;
    if (v22) {
        name = 'file';
    }
    return name;
};
const getFileExtension = function (fileName) {
    const v23 = !fileName;
    if (v23) {
        return '';
    }
    const match = fileName.match(/\.([0-9a-z]+)$/i);
    const v24 = match[1];
    const v25 = v24.toLowerCase();
    let v26;
    if (match) {
        v26 = v25;
    } else {
        v26 = '';
    }
    return v26;
};
const getContentTypeFromFileName = function (fileName) {
    const ext = getFileExtension(fileName);
    const contentTypes = {};
    contentTypes['pdf'] = 'application/pdf';
    contentTypes['txt'] = 'text/plain';
    contentTypes['csv'] = 'text/csv';
    contentTypes['doc'] = 'application/msword';
    contentTypes['docx'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    contentTypes['xls'] = 'application/vnd.ms-excel';
    contentTypes['xlsx'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    contentTypes['ppt'] = 'application/vnd.ms-powerpoint';
    contentTypes['pptx'] = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    contentTypes['jpg'] = 'image/jpeg';
    contentTypes['jpeg'] = 'image/jpeg';
    contentTypes['png'] = 'image/png';
    contentTypes['gif'] = 'image/gif';
    contentTypes['webp'] = 'image/webp';
    contentTypes['svg'] = 'image/svg+xml';
    contentTypes['tiff'] = 'image/tiff';
    contentTypes['bmp'] = 'image/bmp';
    contentTypes['mp4'] = 'video/mp4';
    contentTypes['html'] = 'text/html';
    contentTypes['css'] = 'text/css';
    contentTypes['js'] = 'application/javascript';
    contentTypes['json'] = 'application/json';
    contentTypes['xml'] = 'application/xml';
    contentTypes['cpp'] = 'text/x-c++src';
    contentTypes['cs'] = 'text/x-csharp';
    contentTypes['m'] = 'text/x-matlab';
    contentTypes['zip'] = 'application/zip';
    contentTypes['gz'] = 'application/gzip';
    contentTypes['tar'] = 'application/x-tar';
    contentTypes['rar'] = 'application/vnd.rar';
    contentTypes['7z'] = 'application/x-7z-compressed';
    contentTypes['bz2'] = 'application/x-bzip2';
    contentTypes['xz'] = 'application/x-xz';
    contentTypes['tgz'] = 'application/gzip';
    contentTypes['zipx'] = 'application/zip';
    contentTypes['pt'] = 'application/octet-stream';
    contentTypes['pth'] = 'application/octet-stream';
    contentTypes['onnx'] = 'application/octet-stream';
    contentTypes['bin'] = 'application/octet-stream';
    contentTypes['h5'] = 'application/octet-stream';
    contentTypes['pb'] = 'application/octet-stream';
    contentTypes['safetensors'] = 'application/octet-stream';
    contentTypes['ckpt'] = 'application/octet-stream';
    contentTypes['mat'] = 'application/octet-stream';
    contentTypes['gguf'] = 'application/octet-stream';
    const v27 = contentTypes[ext];
    const v28 = v27 || 'application/octet-stream';
    return v28;
};
export {
    sanitizeFileName,
    getFileExtension,
    getContentTypeFromFileName
};