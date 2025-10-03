const Viz = require('viz.js');
const v56 = require('viz.js/full.render.js');
const Module = v56.Module;
const render = v56.render;
const fs = require('fs');
const path = require('path');
const v57 = process.argv;
const filePathArg = v57[2];
const v58 = !filePathArg;
if (v58) {
    const v59 = console.error('Please specify a file path.');
    v59;
    const v60 = process.exit(1);
    v60;
}
const v61 = process.cwd();
const BASE_DIR = fs.realpathSync(v61);
let candidate = path.resolve(BASE_DIR, filePathArg);
let filePath;
try {
    filePath = fs.realpathSync(candidate);
} catch (error) {
    const v62 = `Error resolving file "${ filePathArg }":`;
    const v63 = error.message;
    const v64 = console.error(v62, v63);
    v64;
    const v65 = process.exit(1);
    v65;
}
const rel = path.relative(BASE_DIR, filePath);
const v66 = rel.startsWith('..');
const v67 = path.isAbsolute(rel);
const v68 = v66 || v67;
if (v68) {
    const v69 = console.error('Invalid file path: outside allowed base directory.');
    v69;
    const v70 = process.exit(1);
    v70;
}
const v71 = path.extname(filePath);
const inExt = v71.toLowerCase();
const v72 = [
    '.dot',
    '.gv'
];
const v73 = v72.includes(inExt);
const v74 = !v73;
if (v74) {
    const v75 = console.error('Invalid file type: only .dot or .gv are allowed.');
    v75;
    const v76 = process.exit(1);
    v76;
}
let dotString;
try {
    dotString = fs.readFileSync(filePath, 'utf8');
} catch (error) {
    const v77 = `Error reading file "${ filePath }":`;
    const v78 = error.message;
    const v79 = console.error(v77, v78);
    v79;
    const v80 = process.exit(1);
    v80;
}
const v81 = {
    Module,
    render
};
const viz = new Viz(v81);
const v82 = path.dirname(filePath);
const v83 = path.extname(filePath);
const v84 = path.basename(filePath, v83);
const v85 = v84 + '.svg';
const outputFileName = path.join(v82, v85);
const outRel = path.relative(BASE_DIR, outputFileName);
const v86 = outRel.startsWith('..');
const v87 = path.isAbsolute(outRel);
const v88 = v86 || v87;
if (v88) {
    const v89 = console.error('Refusing to write outside base directory.');
    v89;
    const v90 = process.exit(1);
    v90;
}
const v91 = {
    engine: 'dot',
    format: 'svg'
};
const v92 = viz.renderString(dotString, v91);
const v103 = svg => {
    try {
        const v93 = { flag: 'wx' };
        const v94 = fs.writeFileSync(outputFileName, svg, v93);
        v94;
    } catch (error) {
        const v95 = error.code;
        const v96 = v95 === 'EEXIST';
        if (v96) {
            const v97 = `Output file already exists: "${ outputFileName }"`;
            const v98 = console.error(v97);
            v98;
        } else {
            const v99 = `Error writing file "${ outputFileName }":`;
            const v100 = error.message;
            const v101 = console.error(v99, v100);
            v101;
        }
        const v102 = process.exit(1);
        v102;
    }
};
const v104 = v92.then(v103);
const v109 = error => {
    const v105 = error.message;
    const v106 = v105 || error;
    const v107 = console.error('Error rendering DOT string:', v106);
    v107;
    const v108 = process.exit(1);
    v108;
};
const v110 = v104.catch(v109);
v110;