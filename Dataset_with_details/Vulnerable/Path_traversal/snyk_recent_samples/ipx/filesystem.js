import { promises as fsp } from "node:fs";
import { resolve, join, parse } from "pathe";
import { createError, cachedPromise } from "../utils";

export const createFilesystemSource = (options) => {
  const rootDir = resolve(options.dir);

  return async (id) => {
    const fsPath = resolve(join(rootDir, id));
    if (!isValidPath(fsPath) || !fsPath.startsWith(rootDir)) {
      throw createError("Forbidden path", 403, id);
    }

    let stats;
    try {
      stats = await fsp.stat(fsPath);
    } catch (error_) {
      const error =
        error_.code === "ENOENT"
          ? createError("File not found", 404, fsPath)
          : createError("File access error " + error_.code, 403, fsPath);
      throw error;
    }
    if (!stats.isFile()) {
      throw createError("Path should be a file", 400, fsPath);
    }

    return {
      mtime: stats.mtime,
      maxAge: options.maxAge,
      getData: cachedPromise(() => fsp.readFile(fsPath)),
    };
  };
};

const isWindows = process.platform === "win32";

function isValidPath(fp) {
  // Invalid windows path chars
  // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file?redirectedfrom=MSDN#Naming_Conventions
  if (isWindows) {
    // Remove C:/ as next we are validating :
    fp = fp.slice(parse(fp).root.length);
  }
  if (/["*:<>?|]/.test(fp)) {
    return false;
  }
  return true;
}

