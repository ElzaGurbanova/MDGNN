import { spawn } from 'child_process';
import path from 'path';
export default const handler = async function (req, res) {
    const v52 = req.method;
    const v53 = v52 !== 'POST';
    if (v53) {
        const v54 = res.status(405);
        const v55 = { error: 'Method not allowed' };
        const v56 = v54.json(v55);
        return v56;
    }
    try {
        const v57 = req.body;
        const script = v57.script;
        const v58 = [];
        const args = v57.undefined;
        const v59 = !script;
        if (v59) {
            const v60 = res.status(400);
            const v61 = { error: 'Script name is required' };
            const v62 = v60.json(v61);
            return v62;
        }
        const v63 = /^[a-zA-Z0-9_-]+\.js$/.test(script);
        const v64 = !v63;
        if (v64) {
            const v65 = res.status(400);
            const v66 = { error: 'Invalid script name' };
            const v67 = v65.json(v66);
            return v67;
        }
        let arg;
        for (arg of args) {
            const v68 = typeof arg;
            const v69 = v68 !== 'string';
            const v70 = /[;&|`$]/.test(arg);
            const v71 = v69 || v70;
            if (v71) {
                const v72 = res.status(400);
                const v73 = { error: 'Invalid argument' };
                const v74 = v72.json(v73);
                return v74;
            }
        }
        const v75 = process.cwd();
        const scriptPath = path.join(v75, 'scripts', script);
        const result = await runScript(scriptPath, args);
        const v76 = res.status(200);
        const v77 = {
            success: true,
            message: 'Script executed successfully',
            output: result
        };
        const v78 = v76.json(v77);
        return v78;
    } catch (error) {
        const v79 = console.error('Error in run-script API:', error);
        v79;
        const v80 = res.status(500);
        const v81 = error.message;
        const v82 = {
            success: false,
            message: 'Server error',
            error: v81
        };
        const v83 = v80.json(v82);
        return v83;
    }
};
const runScript = function (scriptPath, args) {
    const v101 = (resolve, reject) => {
        const v84 = [
            scriptPath,
            ...args
        ];
        const process = spawn('node', v84);
        let stdout = '';
        let stderr = '';
        const v85 = process.stdout;
        const v86 = data => {
            stdout += data.toString();
        };
        const v87 = v85.on('data', v86);
        v87;
        const v88 = process.stderr;
        const v89 = data => {
            stderr += data.toString();
        };
        const v90 = v88.on('data', v89);
        v90;
        const v96 = code => {
            const v91 = code === 0;
            if (v91) {
                const v92 = {
                    stdout,
                    stderr,
                    code
                };
                const v93 = resolve(v92);
                v93;
            } else {
                const v94 = new Error(`Script exited with code ${ code }: ${ stderr }`);
                const v95 = reject(v94);
                v95;
            }
        };
        const v97 = process.on('close', v96);
        v97;
        const v99 = error => {
            const v98 = reject(error);
            v98;
        };
        const v100 = process.on('error', v99);
        v100;
    };
    const v102 = new Promise(v101);
    return v102;
};