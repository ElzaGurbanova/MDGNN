"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = createCommand;

const commander_1 = require("commander");
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs_1 = require("fs");
const path_1 = require("path");
const ora_1 = __importDefault(require("ora"));
const auth_1 = require("../utils/auth");
const output_1 = require("../utils/output");

const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);

/**
 * Validates and sanitizes URL scheme to prevent command injection
 */
function validateGranolaUrl(url) {
    const allowedPattern = /^granola:\/\/new-document\?creation_source=cli$/;
    return allowedPattern.test(url);
}

/**
 * Safely executes the open command with validated URL
 */
async function safeOpenUrl(url) {
    if (!validateGranolaUrl(url)) {
        throw new Error('Invalid URL scheme - potential security risk detected');
    }
    await execFileAsync('open', [url]); // no shell
}

function createCommand() {
    const cmd = new commander_1.Command('create')
        .description('Create a new note (opens Granola app)')
        .action(async () => {
        const spinner = (0, ora_1.default)('Checking authentication...').start();
        try {
            const authed = await (0, auth_1.isAuthenticated)();
            if (!authed) {
                spinner.fail('Not authenticated');
                await (0, auth_1.promptLogin)();
                process.exit(1);
            }
            spinner.text = 'Opening Granola app...';
            try {
                const granolaUrl = 'granola://new-document?creation_source=cli';
                await safeOpenUrl(granolaUrl);
                spinner.succeed('Opened new note in Granola app');
                (0, output_1.printSuccess)('New note created successfully in Granola.');
            }
            catch (openError) {
                spinner.warn('Could not open Granola app directly');
                const isContainer =
                    process.env.CONTAINER ||
                    process.env.DOCKER_CONTAINER ||
                    process.env.CODESPACES ||
                    process.env.GITPOD_WORKSPACE_ID ||
                    process.env.REMOTE_CONTAINERS ||
                    (await isRunningInContainer());
                if (isContainer) {
                    (0, output_1.printWarning)('Running in container environment - cannot open desktop applications.');
                    (0, output_1.printError)('Please create a new note manually using the Granola desktop app on your host machine.');
                    console.log('\nContainer detected. The CLI cannot open desktop applications from within containers.');
                    console.log('You can still use other CLI commands like "granola notes list" to view your notes.');
                }
                else {
                    (0, output_1.printWarning)('Failed to open Granola app automatically.');
                    (0, output_1.printError)('Please ensure Granola is installed and create a new note manually using the desktop app.');
                    console.log('\nTroubleshooting:');
                    console.log('1. Make sure Granola desktop app is installed');
                    console.log('2. Try opening Granola manually first');
                    console.log('3. Check if URL scheme handlers are properly configured');
                }
            }
        }
        catch (err) {
            spinner.fail('Failed to start note creation');
            (0, output_1.printError)((err === null || err === void 0 ? void 0 : err.message) || String(err));
            process.exit(1);
        }
    });
    return cmd;
}

/**
 * Check if we're running inside a container WITHOUT a shell
 */
async function isRunningInContainer() {
    try {
        const cgroupPath = "/proc/1/cgroup";
        if (!(0, fs_1.existsSync)(cgroupPath)) return false;
        const data = (0, fs_1.readFileSync)(cgroupPath, 'utf8');
        return data.includes('docker') || data.includes('containerd');
    } catch {
        return false;
    }
}

