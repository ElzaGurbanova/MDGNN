const fs = require('fs');
const v36 = require('argparse');
const ArgumentParser = v36.ArgumentParser;
const v37 = require('util');
const parseArgs = v37.parseArgs;
const path = require('path');
const sourceMap = require('source-map');
const v38 = {
    add_help: true,
    description: 'Deobfuscate JavaScript code using a source map'
};
const parser = new ArgumentParser(v38);
const v39 = {
    help: 'Path to JavaScript file to recover',
    nargs: 1
};
const v40 = parser.add_argument('src-js', v39);
v40;
const v41 = {
    help: 'Path to source-map to recover from',
    nargs: 1
};
const v42 = parser.add_argument('src-map', v41);
v42;
const v43 = {
    help: 'Path to directory where sources will be dumped',
    nargs: 1
};
const v44 = parser.add_argument('out-dir', v43);
v44;
const args = parser.parse_args();
const v45 = args['src-js'];
const v46 = v45[0];
const code = fs.readFileSync(v46, 'utf8');
const v47 = args['src-map'];
const v48 = v47[0];
const mapData = fs.readFileSync(v48, 'utf8');
const map = new sourceMap.SourceMapConsumer(mapData);
const v49 = args['out-dir'];
const outDir = v49[0];
const v50 = fs.existsSync(outDir);
const v51 = !v50;
if (v51) {
    const v52 = fs.mkdirSync(outDir, 493);
    v52;
}
const sanitizeSourceName = function (url) {
    url = url.replace(/[^a-zA-Z0-9\-_.:\/]/g, '_');
    let v53 = url.includes('..');
    while (v53) {
        const v54 = `[WARNING] Sanitizing potential path-traversal file path: ${ url }`;
        const v55 = console.warn(v54);
        v55;
        url = url.replace('..', '.');
        v53 = url.includes('..');
    }
    const schemes = ['webpack:'];
    let scheme;
    for (scheme of schemes) {
        const v56 = url.startsWith(scheme);
        if (v56) {
            const v57 = scheme.length;
            url = url.slice(v57);
        }
    }
    return url;
};
var i = 0;
const v58 = map.sources;
const v59 = v58.length;
let v60 = i < v59;
while (v60) {
    const v62 = map.sources;
    const sUrl = v62[i];
    const v63 = console.log('[INFO] Writing', sUrl);
    v63;
    const v64 = outDir + '/';
    const v65 = sanitizeSourceName(sUrl);
    const dest = v64 + v65;
    const destDir = path.dirname(dest);
    const v66 = fs.existsSync(destDir);
    const v67 = !v66;
    if (v67) {
        const v68 = { recursive: true };
        const v69 = fs.mkdirSync(destDir, v68);
        v69;
    }
    const contents = map.sourceContentFor(sUrl);
    const v70 = fs.writeFileSync(dest, contents, 'utf8', 420);
    v70;
    const v61 = i++;
    v60 = i < v59;
}