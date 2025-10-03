import { promises as fsp } from 'node:fs';
import {
    resolve,
    join,
    parse
} from 'pathe';
import {
    createError,
    cachedPromise
} from '../utils';
export const createFilesystemSource = options => {
    const v31 = options.dir;
    const rootDir = resolve(v31);
    const v55 = async id => {
        const v32 = join(rootDir, id);
        const fsPath = resolve(v32);
        const v33 = isValidPath(fsPath);
        const v34 = !v33;
        const v35 = rootDir + '/';
        const v36 = fsPath.startsWith(v35);
        const v37 = !v36;
        const v38 = v34 || v37;
        if (v38) {
            const v39 = createError('Forbidden path', 403, id);
            throw v39;
        }
        let stats;
        try {
            stats = await fsp.stat(fsPath);
        } catch (error_) {
            let error;
            const v40 = error_.code;
            const v41 = v40 === 'ENOENT';
            const v42 = createError('File not found', 404, fsPath);
            const v43 = error_.code;
            const v44 = 'File access error ' + v43;
            const v45 = createError(v44, 403, fsPath);
            if (v41) {
                error = v42;
            } else {
                error = v45;
            }
            throw error;
        }
        const v46 = stats.isFile();
        const v47 = !v46;
        if (v47) {
            const v48 = createError('Path should be a file', 400, fsPath);
            throw v48;
        }
        const v49 = stats.mtime;
        const v50 = options.maxAge;
        const v52 = () => {
            const v51 = fsp.readFile(fsPath);
            return v51;
        };
        const v53 = cachedPromise(v52);
        const v54 = {};
        v54.mtime = v49;
        v54.maxAge = v50;
        v54.getData = v53;
        return v54;
    };
    return v55;
};
const v56 = process.platform;
const isWindows = v56 === 'win32';
const isValidPath = function (fp) {
    if (isWindows) {
        const v57 = parse(fp);
        const v58 = v57.root;
        const v59 = v58.length;
        fp = fp.slice(v59);
    }
    const v60 = /["*:<>?|]/.test(fp);
    if (v60) {
        return false;
    }
    return true;
};