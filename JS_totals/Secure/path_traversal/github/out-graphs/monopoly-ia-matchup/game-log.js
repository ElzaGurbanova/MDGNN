import fs from 'fs';
import path from 'path';
export default const handler = function (req, res) {
    const v36 = req.method;
    const v37 = v36 === 'GET';
    if (v37) {
        try {
            const v38 = req.query;
            const file = v38.file;
            let filename = file || 'game_logs.json';
            const v39 = filename === 'game_logs.json';
            if (v39) {
                const v40 = process.cwd();
                const testPath = path.join(v40, '..', 'services', 'logs', filename);
                const v41 = fs.existsSync(testPath);
                if (v41) {
                    try {
                        const testContent = fs.readFileSync(testPath, 'utf8');
                        const v42 = JSON.parse(testContent);
                        v42;
                    } catch (e) {
                        const v43 = console.log('game_logs.json is corrupted, using game_logs_partie_2_6h.json instead');
                        v43;
                        filename = 'game_logs_partie_2_6h.json';
                    }
                }
            }
            const v44 = filename.includes('..');
            const v45 = filename.includes('/');
            const v46 = v44 || v45;
            const v47 = filename.endsWith('.json');
            const v48 = !v47;
            const v49 = v46 || v48;
            if (v49) {
                const v50 = res.status(400);
                const v51 = { error: 'Invalid filename' };
                const v52 = v50.json(v51);
                return v52;
            }
            const v53 = process.cwd();
            const logsPath = path.join(v53, '..', 'services', 'logs', filename);
            const v54 = fs.existsSync(logsPath);
            const v55 = !v54;
            if (v55) {
                const v56 = res.status(404);
                const v57 = { error: 'File not found' };
                const v58 = v56.json(v57);
                return v58;
            }
            const fileContents = fs.readFileSync(logsPath, 'utf8');
            const data = JSON.parse(fileContents);
            const v59 = res.status(200);
            const v60 = v59.json(data);
            v60;
        } catch (error) {
            const v61 = console.error('Error reading game logs:', error);
            v61;
            const v62 = res.status(500);
            const v63 = { error: 'Failed to read game logs' };
            const v64 = v62.json(v63);
            v64;
        }
    } else {
        const v65 = ['GET'];
        const v66 = res.setHeader('Allow', v65);
        v66;
        const v67 = res.status(405);
        const v68 = req.method;
        const v69 = `Method ${ v68 } Not Allowed`;
        const v70 = v67.end(v69);
        v70;
    }
};