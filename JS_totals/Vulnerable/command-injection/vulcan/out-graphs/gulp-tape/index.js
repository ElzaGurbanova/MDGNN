const childProcess = require('child_process');
const dargs = require('dargs');
const PluginError = require('plugin-error');
const TapParser = require('tap-parser');
const through = require('through2');
const pluginName = 'gulp-tape';
const tapeBinaryFilepath = require.resolve('.bin/tape');
const gulpTape = function (options) {
    const v38 = {};
    options = options || v38;
    const files = [];
    const transform = function (file, encoding, callback) {
        const v39 = file.isNull();
        if (v39) {
            const v40 = callback(null, file);
            v40;
            return;
        }
        const v41 = file.isStream();
        if (v41) {
            const v42 = new PluginError(pluginName, 'Streaming is not supported');
            const v43 = callback(v42);
            v43;
            return;
        }
        const v44 = file.path;
        const v45 = files.push(v44);
        v45;
        const v46 = callback(null, file);
        v46;
    };
    const flush = function (callback) {
        const v47 = [tapeBinaryFilepath];
        const v48 = v47.concat(files);
        const v49 = [
            'bail',
            'nyc',
            'outputStream'
        ];
        const v50 = { excludes: v49 };
        const v51 = dargs(options, v50);
        const args = v48.concat(v51);
        const v52 = options.nyc;
        if (v52) {
            const nycBinaryFilePath = require.resolve('.bin/nyc');
            const v53 = args.unshift(nycBinaryFilePath);
            v53;
        }
        const v54 = args.join(' ');
        const v57 = function (error) {
            if (error) {
                const v55 = new PluginError(pluginName, error);
                const v56 = callback(v55);
                v56;
            }
        };
        const tapeProcess = childProcess.exec(v54, v57);
        const v58 = tapeProcess.stdout;
        const v59 = v58.on('end', callback);
        v59;
        const v60 = options.outputStream;
        const v61 = process.stdout;
        const outputStream = v60 || v61;
        const tapParser = new TapParser();
        const v62 = options.bail;
        if (v62) {
            const v67 = function (assert) {
                const v63 = assert.ok;
                const v64 = !v63;
                if (v64) {
                    const v65 = new PluginError(pluginName, 'Test failed');
                    const v66 = callback(v65);
                    v66;
                }
            };
            const v68 = tapParser.on('assert', v67);
            v68;
        }
        const v70 = function (line) {
            const v69 = outputStream.write(line);
            v69;
        };
        const v71 = tapParser.on('line', v70);
        v71;
        const v72 = tapeProcess.stdout;
        const v73 = v72.pipe(tapParser);
        v73;
    };
    const v74 = through.obj(transform, flush);
    return v74;
};
module.exports = gulpTape;