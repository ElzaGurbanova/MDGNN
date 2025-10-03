const express = require('express');
const router = express.Router();
const v48 = require('child_process');
const exec = v48.exec;
const v49 = require('util');
const promisify = v49.promisify;
const execPromise = promisify(exec);
const v51 = keypair => {
    const v50 = `solana config set --keypair ${ keypair }`;
    return v50;
};
const v53 = mintAddress => {
    const v52 = `spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata --decimals 9 ${ mintAddress }`;
    return v52;
};
const v55 = tokenAddress => {
    const v54 = `spl-token create-account ${ tokenAddress }`;
    return v54;
};
const v57 = (tokenAddress, amount) => {
    const v56 = `spl-token mint ${ tokenAddress } ${ amount }`;
    return v56;
};
const v59 = tokenAddress => {
    const v58 = `spl-token authorize ${ tokenAddress } mint --disable`;
    return v58;
};
const v61 = tokenAddress => {
    const v60 = `spl-token authorize ${ tokenAddress } freeze --disable`;
    return v60;
};
const SOLANA_COMMANDS = {};
SOLANA_COMMANDS.CREATE_ACCOUNT = 'solana-keygen grind --starts-with dad:1';
SOLANA_COMMANDS.SET_KEYPAIR = v51;
SOLANA_COMMANDS.SET_DEVNET = 'solana config set --url devnet';
SOLANA_COMMANDS.GET_CONFIG = 'solana config get';
SOLANA_COMMANDS.GET_BALANCE = 'solana balance';
SOLANA_COMMANDS.CREATE_MINT = 'solana-keygen grind --starts-with mnt:1';
SOLANA_COMMANDS.CREATE_TOKEN = v53;
SOLANA_COMMANDS.CREATE_TOKEN_ACCOUNT = v55;
SOLANA_COMMANDS.MINT_TOKENS = v57;
SOLANA_COMMANDS.DISABLE_MINT = v59;
SOLANA_COMMANDS.DISABLE_FREEZE = v61;
const validateCommand = command => {
    const v62 = !command;
    const v63 = typeof command;
    const v64 = v63 !== 'string';
    const v65 = v62 || v64;
    if (v65) {
        const v66 = new Error('Invalid command format');
        throw v66;
    }
    const v67 = command.includes('&&');
    const v68 = command.includes('||');
    const v69 = v67 || v68;
    const v70 = command.includes(';');
    const v71 = v69 || v70;
    if (v71) {
        const v72 = new Error('Invalid command characters detected');
        throw v72;
    }
    const allowedCommands = [
        'solana-keygen',
        'solana',
        'spl-token'
    ];
    const v74 = cmd => {
        const v73 = command.startsWith(cmd);
        return v73;
    };
    const isAllowed = allowedCommands.some(v74);
    const v75 = !isAllowed;
    if (v75) {
        const v76 = new Error('Only Solana CLI commands are allowed');
        throw v76;
    }
    return command;
};
const v88 = async (req, res) => {
    try {
        const v77 = req.body;
        const command = v77.command;
        const v78 = !command;
        if (v78) {
            const v79 = res.status(400);
            const v80 = { error: 'Command is required' };
            const v81 = v79.json(v80);
            return v81;
        }
        const v82 = {
            success: true,
            output: `Received command: ${ command }`,
            command
        };
        const v83 = res.json(v82);
        v83;
    } catch (error) {
        const v84 = console.error('Terminal execution error:', error);
        v84;
        const v85 = res.status(500);
        const v86 = { error: 'Failed to execute command' };
        const v87 = v85.json(v86);
        v87;
    }
};
const v89 = router.post('/execute', v88);
v89;
const v92 = (req, res) => {
    const v90 = { status: 'ready' };
    const v91 = res.json(v90);
    v91;
};
const v93 = router.get('/status', v92);
v93;
const v94 = {};
v94.router = router;
v94.SOLANA_COMMANDS = SOLANA_COMMANDS;
module.exports = v94;