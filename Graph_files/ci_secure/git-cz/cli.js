const v49 = require('child_process');
const spawn = v49.spawn;
const execSync = v49.execSync;
const fs = require('fs');
const v50 = require('path');
const join = v50.join;
const shellescape = require('any-shell-escape');
const signale = require('signale');
const parseArgs = require('./parseArgs');
const createState = require('./createState');
const runInteractiveQuestions = require('./runInteractiveQuestions');
const runNonInteractiveMode = require('./runNonInteractiveMode');
const formatCommitMessage = require('./formatCommitMessage');
const getGitDir = require('./util/getGitDir');
const executeCommand = (command, env = process.env) => {
    const v51 = [];
    const v52 = [
        0,
        1,
        2
    ];
    const v53 = {
        env,
        shell: true,
        stdio: v52
    };
    const proc = spawn(command, v51, v53);
    const v55 = code => {
        const v54 = process.exit(code);
        v54;
    };
    const v56 = proc.on('close', v55);
    v56;
};
const main = async () => {
    try {
        const v57 = parseArgs();
        const cliAnswers = v57.cliAnswers;
        const cliOptions = v57.cliOptions;
        const passThroughParams = v57.passThroughParams;
        let state = null;
        const v58 = cliOptions.disableEmoji;
        if (v58) {
            const v59 = cliOptions.disableEmoji;
            const v60 = { disableEmoji: v59 };
            state = createState(v60);
        } else {
            state = createState();
        }
        const v61 = cliOptions.dryRun;
        if (v61) {
            const v62 = console.log('Running in dry mode.');
            v62;
        } else {
            const v63 = passThroughParams['allow-empty'];
            const v64 = !v63;
            const v65 = passThroughParams.a;
            const v66 = !v65;
            const v67 = v64 && v66;
            const v68 = passThroughParams.amend;
            const v69 = !v68;
            const v70 = v67 && v69;
            if (v70) {
                try {
                    const v71 = execSync('git diff HEAD --staged --quiet --exit-code');
                    v71;
                    const v72 = signale.error('No files staged!');
                    v72;
                    const v73 = process.exit(0);
                    v73;
                } catch (error) {
                }
            }
        }
        const v74 = cliOptions.nonInteractive;
        if (v74) {
            await runNonInteractiveMode(state, cliAnswers);
        } else {
            await runInteractiveQuestions(state, cliAnswers);
        }
        const message = formatCommitMessage(state);
        const appendedArgs = [];
        let key;
        for (key in passThroughParams) {
            const value = passThroughParams[key];
            const v75 = key.length;
            const v76 = v75 === 1;
            if (v76) {
                const v77 = '-' + key;
                const v78 = appendedArgs.push(v77);
                v78;
            } else {
                const v79 = '--' + key;
                const v80 = appendedArgs.push(v79);
                v80;
            }
            const v81 = value !== true;
            if (v81) {
                const v82 = appendedArgs.push(value);
                v82;
            }
        }
        const v83 = getGitDir();
        const commitMsgFile = join(v83, 'COMMIT_EDITMSG');
        const v84 = [
            'git',
            'commit',
            '--file',
            commitMsgFile,
            ...appendedArgs
        ];
        const command = shellescape(v84);
        const v85 = cliOptions.dryRun;
        if (v85) {
            const v86 = console.log('Will execute command:');
            v86;
            const v87 = command.replace(commitMsgFile, '.git/COMMIT_EDITMSG');
            const v88 = console.log(v87);
            v88;
            const v89 = console.log('Message:');
            v89;
            const v90 = console.log(message);
            v90;
        } else {
            const v91 = fs.writeFileSync(commitMsgFile, message);
            v91;
            const v92 = cliOptions.hook;
            if (v92) {
                const v93 = process.exit(0);
                v93;
            }
            const v94 = executeCommand(command);
            v94;
        }
    } catch (error) {
        const v95 = signale.fatal(error);
        v95;
    }
};
const v96 = main();
v96;