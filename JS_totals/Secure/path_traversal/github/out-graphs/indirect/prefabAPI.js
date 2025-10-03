const v25 = require('electron');
const ipcMain = v25.ipcMain;
const path = require('path');
const fs = require('fs/promises');
const initPrefabAPI = function (ipcMainInstance, rootDirectory) {
    const v40 = async (event, prefabPath) => {
        try {
            const v26 = path.normalize(prefabPath);
            const normalizedPath = v26.replace(/\\/g, '/');
            const v27 = normalizedPath.includes('..');
            const v28 = path.isAbsolute(normalizedPath);
            const v29 = v27 || v28;
            if (v29) {
                const v30 = `PrefabAPI: Access denied for invalid path format: '${ prefabPath }'.`;
                const v31 = console.error(v30);
                v31;
                return null;
            }
            const absoluteFilePath = path.join(rootDirectory, normalizedPath);
            const v32 = absoluteFilePath.startsWith(rootDirectory);
            const v33 = !v32;
            if (v33) {
                const v34 = `PrefabAPI: Access denied for path '${ prefabPath }'.`;
                const v35 = console.error(v34);
                v35;
                return null;
            }
            const fileContent = await fs.readFile(absoluteFilePath, 'utf-8');
            const v36 = JSON.parse(fileContent);
            return v36;
        } catch (error) {
            const v37 = `PrefabAPI: Error loading prefab '${ prefabPath }':`;
            const v38 = error.message;
            const v39 = console.error(v37, v38);
            v39;
            return null;
        }
    };
    const v41 = ipcMainInstance.handle('get-prefab-data', v40);
    v41;
    const v46 = async () => {
        try {
            const absoluteFilePath = path.join(rootDirectory, 'modules/Data', 'prefabs.manifest.json');
            const fileContent = await fs.readFile(absoluteFilePath, 'utf-8');
            const v42 = JSON.parse(fileContent);
            return v42;
        } catch (error) {
            const v43 = `PrefabAPI: Error loading prefab manifest:`;
            const v44 = error.message;
            const v45 = console.error(v43, v44);
            v45;
            return null;
        }
    };
    const v47 = ipcMainInstance.handle('get-prefab-manifest', v46);
    v47;
};
const v48 = {};
v48.initPrefabAPI = initPrefabAPI;
module.exports = v48;