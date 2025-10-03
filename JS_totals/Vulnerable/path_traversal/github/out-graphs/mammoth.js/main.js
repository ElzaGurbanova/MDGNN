var fs = require('fs');
var path = require('path');
var mammoth = require('./');
var promises = require('./promises');
var images = require('./images');
const main = function (argv) {
    var docxPath = argv['docx-path'];
    var outputPath = argv['output-path'];
    var outputDir = argv.output_dir;
    var outputFormat = argv.output_format;
    var styleMapPath = argv.style_map;
    const v39 = readStyleMap(styleMapPath);
    const v71 = function (styleMap) {
        var options = {};
        options.styleMap = styleMap;
        options.outputFormat = outputFormat;
        if (outputDir) {
            var basename = path.basename(docxPath, '.docx');
            const v40 = basename + '.html';
            outputPath = path.join(outputDir, v40);
            var imageIndex = 0;
            const v53 = function (element) {
                const v41 = imageIndex++;
                v41;
                const v42 = element.contentType;
                const v43 = v42.split('/');
                var extension = v43[1];
                const v44 = imageIndex + '.';
                var filename = v44 + extension;
                const v45 = element.read();
                const v48 = function (imageBuffer) {
                    var imagePath = path.join(outputDir, filename);
                    const v46 = fs.writeFile;
                    const v47 = promises.nfcall(v46, imagePath, imageBuffer);
                    return v47;
                };
                const v49 = v45.then(v48);
                const v51 = function () {
                    const v50 = {};
                    v50.src = filename;
                    return v50;
                };
                const v52 = v49.then(v51);
                return v52;
            };
            const v54 = images.imgElement(v53);
            options.convertImage = v54;
        }
        const v55 = { path: docxPath };
        const v56 = mammoth.convert(v55, options);
        const v69 = function (result) {
            const v57 = result.messages;
            const v63 = function (message) {
                const v58 = process.stderr;
                const v59 = message.message;
                const v60 = v58.write(v59);
                v60;
                const v61 = process.stderr;
                const v62 = v61.write('\n');
                v62;
            };
            const v64 = v57.forEach(v63);
            v64;
            let outputStream;
            const v65 = fs.createWriteStream(outputPath);
            const v66 = process.stdout;
            if (outputPath) {
                outputStream = v65;
            } else {
                outputStream = v66;
            }
            const v67 = result.value;
            const v68 = outputStream.write(v67);
            v68;
        };
        const v70 = v56.then(v69);
        return v70;
    };
    const v72 = v39.then(v71);
    const v73 = v72.done();
    v73;
};
const readStyleMap = function (styleMapPath) {
    if (styleMapPath) {
        const v74 = fs.readFile;
        const v75 = promises.nfcall(v74, styleMapPath, 'utf8');
        return v75;
    } else {
        const v76 = promises.resolve(null);
        return v76;
    }
};
module.exports = main;