const fs = require('fs');
const Path = require('path');
const v70 = this.router;
const v137 = (req, res) => {
    const v71 = this.db;
    const v72 = v71.libraryItems;
    const v77 = ab => {
        const v73 = ab.id;
        const v74 = req.params;
        const v75 = v74.id;
        const v76 = v73 === v75;
        return v76;
    };
    const item = v72.find(v77);
    const v78 = !item;
    if (v78) {
        const v79 = res.status(404);
        const v80 = req.params;
        const v81 = v80.id;
        const v82 = 'Item not found with id ' + v81;
        const v83 = v79.send(v82);
        return v83;
    }
    const v84 = req.user;
    const v85 = v84.checkCanAccessLibraryItem(item);
    const v86 = !v85;
    if (v86) {
        const v87 = req.params;
        const v88 = v87['0'];
        const v89 = `[StaticRouter] User attempted to access library item file without access ${ v88 }`;
        const v90 = req.user;
        const v91 = Logger.error(v89, v90);
        v91;
        const v92 = res.sendStatus(403);
        return v92;
    }
    const v93 = req.params;
    const v94 = v93['0'];
    const v95 = v94 || '';
    const v96 = String(v95);
    const remainingRaw = v96.replace(/\\/g, '/');
    try {
        const v97 = item.path;
        const base = Path.resolve(v97);
        let target;
        const v98 = item.isFile;
        if (v98) {
            const v99 = remainingRaw !== '';
            const v100 = remainingRaw !== '/';
            const v101 = v99 && v100;
            if (v101) {
                const v102 = res.sendStatus(404);
                return v102;
            }
            target = base;
        } else {
            const v103 = remainingRaw.startsWith('/');
            const v104 = '/' + remainingRaw;
            let v105;
            if (v103) {
                v105 = remainingRaw;
            } else {
                v105 = v104;
            }
            const v106 = '.' + v105;
            target = Path.resolve(base, v106);
        }
        const rel = Path.relative(base, target);
        const v107 = rel.startsWith('..');
        const v108 = Path.isAbsolute(rel);
        const v109 = v107 || v108;
        if (v109) {
            const v110 = `[StaticRouter] Traversal attempt: ${ remainingRaw }`;
            const v111 = Logger.error(v110);
            v111;
            const v112 = res.sendStatus(403);
            return v112;
        }
        const v113 = fs.realpathSync;
        const realBase = v113.native(base);
        const v114 = fs.realpathSync;
        const realTarget = v114.native(target);
        const relReal = Path.relative(realBase, realTarget);
        const v115 = relReal.startsWith('..');
        const v116 = Path.isAbsolute(relReal);
        const v117 = v115 || v116;
        if (v117) {
            const v118 = `[StaticRouter] Symlink escape: ${ remainingRaw }`;
            const v119 = Logger.error(v118);
            v119;
            const v120 = res.sendStatus(403);
            return v120;
        }
        let opts = {};
        const v121 = Path.extname(realTarget);
        const audioMimeType = getAudioMimeTypeFromExtname(v121);
        if (audioMimeType) {
            const v122 = {};
            v122['Content-Type'] = audioMimeType;
            opts.headers = v122;
            opts = {};
            opts = {};
        }
        const v123 = global.XAccel;
        if (v123) {
            const v124 = `Use X-Accel to serve static file ${ realTarget }`;
            const v125 = Logger.debug(v124);
            v125;
            const v126 = res.status(204);
            const v127 = global.XAccel;
            const v128 = v127 + realTarget;
            const v129 = { 'X-Accel-Redirect': v128 };
            const v130 = v126.header(v129);
            const v131 = v130.send();
            return v131;
        }
        const v132 = res.sendFile(realTarget, opts);
        v132;
    } catch (e) {
        const v133 = e.message;
        const v134 = `[StaticRouter] Error serving file: ${ v133 }`;
        const v135 = Logger.error(v134);
        v135;
        const v136 = res.sendStatus(404);
        return v136;
    }
};
const v138 = v70.get('/item/:id/*', v137);
v138;