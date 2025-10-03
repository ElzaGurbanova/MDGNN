'use strict';
const express = require('express');
const v50 = require('glob');
const glob = v50.glob;
const fs = require('fs');
const path = require('path');
const app = express();
const ROOT = path.resolve(__dirname, 'bundle');
const v51 = { extended: true };
const v52 = express.urlencoded(v51);
const v53 = app.use(v52);
v53;
const v54 = express.json();
const v55 = app.use(v54);
v55;
const v58 = (_req, res) => {
    const v56 = { ok: true };
    const v57 = res.json(v56);
    return v57;
};
const v59 = app.get('/health', v58);
v59;
const v89 = async (req, res) => {
    const v60 = req.query;
    const v61 = v60.pattern;
    const v62 = v61 || '**/*.txt';
    const pattern = String(v62);
    const basePattern = path.join(ROOT, pattern);
    const v63 = basePattern.startsWith(ROOT);
    const v64 = !v63;
    if (v64) {
        const v65 = res.status(400);
        const v66 = { error: 'bad pattern' };
        const v67 = v65.json(v66);
        return v67;
    }
    try {
        const v68 = { nodir: true };
        const matches = await glob(basePattern, v68);
        const v69 = matches.length;
        const v70 = v69 === 0;
        if (v70) {
            const v71 = res.status(404);
            const v72 = { error: 'no matches' };
            const v73 = v71.json(v72);
            return v73;
        }
        const v74 = res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        v74;
        const v75 = matches.length;
        const v76 = `# Downloading ${ v75 } file(s)\n\n`;
        const v77 = res.write(v76);
        v77;
        let f;
        for (f of matches) {
            const v78 = path.relative(ROOT, f);
            const v79 = `--- ${ v78 } ---\n`;
            const v80 = res.write(v79);
            v80;
            const v81 = fs.readFileSync(f, 'utf8');
            const v82 = res.write(v81);
            v82;
            const v83 = res.write('\n\n');
            v83;
        }
        const v84 = res.end();
        v84;
    } catch (e) {
        const v85 = console.error(e);
        v85;
        const v86 = res.status(500);
        const v87 = { error: 'glob failed' };
        const v88 = v86.json(v87);
        v88;
    }
};
const v90 = app.get('/download-matches', v89);
v90;
const v94 = (_req, res) => {
    const v91 = res.type('html');
    const v92 = `
  <h2>Glob Download (VULNERABLE)</h2>
  <form method="get" action="/download-matches">
    <label>Pattern in bundle/: <input name="pattern" value="**/*.txt"/></label>
    <button>Fetch</button>
  </form>
  <p>Try <code>../../**/*.js</code> or patterns with <code>..</code> to escape.</p>
`;
    const v93 = v91.send(v92);
    return v93;
};
const v95 = app.get('/', v94);
v95;
const v97 = () => {
    const v96 = console.log('Glob download (VULN) on :5025');
    return v96;
};
const v98 = app.listen(5025, v97);
v98;