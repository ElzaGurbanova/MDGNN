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
    const v30 = options.dir;
    const rootDir = resolve(v30);
    const v53 = async id => {
        const v31 = join(rootDir, id);
        const fsPath = resolve(v31);
        const v32 = isValidPath(fsPath);
        const v33 = !v32;
        const v34 = fsPath.startsWith(rootDir);
        const v35 = !v34;
        const v36 = v33 || v35;
        if (v36) {
            const v37 = createError('Forbidden path', 403, id);
            throw v37;
        }
        let stats;
        try {
            stats = await fsp.stat(fsPath);
        } catch (error_) {
            let error;
            const v38 = error_.code;
            const v39 = v38 === 'ENOENT';
            const v40 = createError('File not found', 404, fsPath);
            const v41 = error_.code;
            const v42 = 'File access error ' + v41;
            const v43 = createError(v42, 403, fsPath);
            if (v39) {
                error = v40;
            } else {
                error = v43;
            }
            throw error;
        }
        const v44 = stats.isFile();
        const v45 = !v44;
        if (v45) {
            const v46 = createError('Path should be a file', 400, fsPath);
            throw v46;
        }
        const v47 = stats.mtime;
        const v48 = options.maxAge;
        const v50 = () => {
            const v49 = fsp.readFile(fsPath);
            return v49;
        };
        const v51 = cachedPromise(v50);
        const v52 = {};
        v52.mtime = v47;
        v52.maxAge = v48;
        v52.getData = v51;
        return v52;
    };
    return v53;
};
const v54 = process.platform;
const isWindows = v54 === 'win32';
const isValidPath = function (fp) {
    if (isWindows) {
        const v55 = parse(fp);
        const v56 = v55.root;
        const v57 = v56.length;
        fp = fp.slice(v57);
    }
    const v58 = /["*:<>?|]/.test(fp);
    if (v58) {
        return false;
    }
    return true;
};