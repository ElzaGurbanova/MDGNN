import shellEscape from '@tehshrike/shell-escape-tag';
import { promisify } from 'node:util';
import cp from 'node:child_process';
const v4 = cp.exec;
const exec = promisify(v4);
export default const sh = async function (...args) {
    const command = shellEscape(...args);
    const v5 = { encoding: `utf8` };
    const stdio = await exec(command, v5);
    const v6 = stdio.stdout;
    return v6;
};