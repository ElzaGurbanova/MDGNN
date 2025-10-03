import { spawn } from 'child_process';
import process from 'node:process';
export const pdflatex = async function (cwd, name, {bibtex = true, stdout = false}) {
    const args = [
        '-draftmode',
        '-shell-escape',
        '-interaction=nonstopmode',
        name
    ];
    const exec = function (cmd, args) {
        const v29 = function (resolve, reject) {
            const v17 = { cwd };
            const child = spawn(cmd, args, v17);
            const v18 = child.stdout;
            const v21 = data => {
                if (stdout) {
                    const v19 = process.stdout;
                    const v20 = v19.write(data);
                    v20;
                }
            };
            const v22 = v18.on('data', v21);
            v22;
            const v24 = code => {
                const v23 = resolve(code);
                return v23;
            };
            const v25 = child.on('exit', v24);
            v25;
            const v27 = err => {
                const v26 = reject(err);
                return v26;
            };
            const v28 = child.on('error', v27);
            v28;
        };
        const v30 = new Promise(v29);
        return v30;
    };
    if (bibtex) {
        await exec('pdflatex', args);
        const v31 = [name];
        await exec('bibtex', v31);
        await exec('pdflatex', args);
    }
    const v32 = args.slice(1);
    await exec('pdflatex', v32);
};