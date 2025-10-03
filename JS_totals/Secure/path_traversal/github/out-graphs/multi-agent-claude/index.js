const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chalk = require('chalk');
const v502 = require('inquirer');
const inquirer = v502.default;
const Ajv = require('ajv');
const v503 = require('glob');
const glob = v503.glob;
const LOPManager = function LOPManager() {
    const v504 = process.cwd();
    const v505 = path.join(v504, '.claude/prompts/lop');
    this.projectLopPath = v505;
    const v506 = path.join(__dirname, '../../templates/prompts/lop');
    this.templateLopPath = v506;
    const v507 = this.projectLopPath;
    const v508 = path.join(v507, 'schema/lop-base-schema.json');
    this.schemaPath = v508;
    const v509 = process.cwd();
    const v510 = path.join(v509, '.claude/prompts/hop/implementation-master.md');
    this.hopPath = v510;
    this.fileTimeout = 5000;
};
const withTimeout = async function withTimeout(promise, operation = 'file operation') {
    const v517 = (_, reject) => {
        const v514 = () => {
            const v511 = this.fileTimeout;
            const v512 = new Error(`Timeout: ${ operation } took longer than ${ v511 }ms`);
            const v513 = reject(v512);
            return v513;
        };
        const v515 = this.fileTimeout;
        const v516 = setTimeout(v514, v515);
        return v516;
    };
    const timeoutPromise = new Promise(v517);
    try {
        const v518 = [
            promise,
            timeoutPromise
        ];
        return await Promise.race(v518);
    } catch (error) {
        const v519 = error.message;
        const v520 = v519.includes('Timeout');
        if (v520) {
            const v521 = this.fileTimeout;
            const v522 = `⚠️  ${ operation } timed out after ${ v521 }ms`;
            const v523 = chalk.red(v522);
            const v524 = console.error(v523);
            v524;
        }
        throw error;
    }
};
LOPManager.withTimeout = withTimeout;
const safeReadFile = async function safeReadFile(filepath, encoding = 'utf8') {
    const v529 = (resolve, reject) => {
        const v527 = (err, data) => {
            if (err) {
                const v525 = reject(err);
                v525;
            } else {
                const v526 = resolve(data);
                v526;
            }
        };
        const v528 = fs.readFile(filepath, encoding, v527);
        v528;
    };
    const v530 = new Promise(v529);
    const v531 = path.basename(filepath);
    const v532 = `Reading file ${ v531 }`;
    return await this.withTimeout(v530, v532);
};
LOPManager.safeReadFile = safeReadFile;
const safeWriteFile = async function safeWriteFile(filepath, content, encoding = 'utf8') {
    const v537 = (resolve, reject) => {
        const v535 = err => {
            if (err) {
                const v533 = reject(err);
                v533;
            } else {
                const v534 = resolve();
                v534;
            }
        };
        const v536 = fs.writeFile(filepath, content, encoding, v535);
        v536;
    };
    const v538 = new Promise(v537);
    const v539 = path.basename(filepath);
    const v540 = `Writing file ${ v539 }`;
    return await this.withTimeout(v538, v540);
};
LOPManager.safeWriteFile = safeWriteFile;
const safeExecute = async function safeExecute(operation, context = 'operation') {
    try {
        return await operation();
    } catch (error) {
        const v541 = error.message;
        const v542 = `✗ ${ context } failed: ${ v541 }`;
        const v543 = chalk.red(v542);
        const v544 = console.error(v543);
        v544;
        const v545 = error.code;
        const v546 = v545 === 'ENOENT';
        if (v546) {
            const v547 = chalk.yellow('  File or directory not found');
            const v548 = console.error(v547);
            v548;
        } else {
            const v549 = error.code;
            const v550 = v549 === 'EACCES';
            if (v550) {
                const v551 = chalk.yellow('  Permission denied');
                const v552 = console.error(v551);
                v552;
            } else {
                const v553 = error.code;
                const v554 = v553 === 'EISDIR';
                if (v554) {
                    const v555 = chalk.yellow('  Expected file but found directory');
                    const v556 = console.error(v555);
                    v556;
                } else {
                    const v557 = error.message;
                    const v558 = v557.includes('Timeout');
                    if (v558) {
                        const v559 = chalk.yellow('  Operation timed out - try again or check file locks');
                        const v560 = console.error(v559);
                        v560;
                    } else {
                        const v561 = error.name;
                        const v562 = v561 === 'YAMLException';
                        if (v562) {
                            const v563 = chalk.yellow('  Invalid YAML syntax in file');
                            const v564 = console.error(v563);
                            v564;
                        }
                    }
                }
            }
        }
        const v565 = error.message;
        const contextualError = new Error(`${ context }: ${ v565 }`);
        contextualError.originalError = error;
        contextualError.context = context;
        throw contextualError;
    }
};
LOPManager.safeExecute = safeExecute;
const validate = async function validate(filePath) {
    const v621 = async () => {
        const v566 = chalk.cyan('\uD83D\uDD0D Validating LOP file...');
        const v567 = console.log(v566);
        v567;
        const absolutePath = path.resolve(filePath);
        const v568 = fs.existsSync(absolutePath);
        const v569 = !v568;
        if (v569) {
            const v570 = `✗ File not found: ${ absolutePath }`;
            const v571 = chalk.red(v570);
            const v572 = console.error(v571);
            v572;
            return false;
        }
        const content = await this.safeReadFile(absolutePath, 'utf8');
        const lopData = yaml.load(content);
        let schemaPath;
        const v573 = this.schemaPath;
        const v574 = fs.existsSync(v573);
        const v575 = this.schemaPath;
        const v576 = this.templateLopPath;
        const v577 = path.join(v576, 'schema/lop-base-schema.json');
        if (v574) {
            schemaPath = v575;
        } else {
            schemaPath = v577;
        }
        const v578 = fs.existsSync(schemaPath);
        const v579 = !v578;
        if (v579) {
            const v580 = chalk.red('\u2717 Schema file not found');
            const v581 = console.error(v580);
            v581;
            return false;
        }
        const schema = JSON.parse(await this.safeReadFile(schemaPath, 'utf8'));
        const v582 = { allErrors: true };
        const ajv = new Ajv(v582);
        const validate = ajv.compile(schema);
        const valid = validate(lopData);
        if (valid) {
            const v583 = chalk.green('\u2705 LOP validation successful!');
            const v584 = console.log(v583);
            v584;
            const v585 = lopData.metadata;
            const v586 = v585.name;
            const v587 = `  Name: ${ v586 }`;
            const v588 = chalk.gray(v587);
            const v589 = console.log(v588);
            v589;
            const v590 = lopData.metadata;
            const v591 = v590.type;
            const v592 = `  Type: ${ v591 }`;
            const v593 = chalk.gray(v592);
            const v594 = console.log(v593);
            v594;
            const v595 = lopData.metadata;
            const v596 = v595.priority;
            const v597 = `  Priority: ${ v596 }`;
            const v598 = chalk.gray(v597);
            const v599 = console.log(v598);
            v599;
            const v600 = lopData.phases;
            const v601 = v600.length;
            const v602 = `  Phases: ${ v601 }`;
            const v603 = chalk.gray(v602);
            const v604 = console.log(v603);
            v604;
            const v605 = lopData.agents;
            const v606 = v605.length;
            const v607 = `  Agents: ${ v606 }`;
            const v608 = chalk.gray(v607);
            const v609 = console.log(v608);
            v609;
            return true;
        } else {
            const v610 = chalk.red('\u2717 Validation failed:');
            const v611 = console.error(v610);
            v611;
            const v612 = validate.errors;
            const v619 = err => {
                const v613 = err.instancePath;
                const v614 = v613 || '/';
                const v615 = err.message;
                const v616 = `  - ${ v614 }: ${ v615 }`;
                const v617 = chalk.red(v616);
                const v618 = console.error(v617);
                v618;
            };
            const v620 = v612.forEach(v619);
            v620;
            return false;
        }
    };
    return await this.safeExecute(v621, 'LOP validation');
};
LOPManager.validate = validate;
const create = async function create() {
    try {
        const v622 = chalk.cyan('\uD83C\uDFA8 Interactive LOP Creation\n');
        const v623 = console.log(v622);
        v623;
        const v627 = input => {
            const v624 = input.length;
            const v625 = v624 > 3;
            const v626 = v625 || 'Name must be at least 3 characters';
            return v626;
        };
        const v628 = {
            type: 'input',
            name: 'name',
            message: 'LOP name:',
            validate: v627
        };
        const v632 = input => {
            const v629 = input.length;
            const v630 = v629 > 10;
            const v631 = v630 || 'Description must be at least 10 characters';
            return v631;
        };
        const v633 = {
            type: 'input',
            name: 'description',
            message: 'Description:',
            validate: v632
        };
        const v634 = [
            'testing',
            'feature',
            'refactor',
            'infrastructure',
            'documentation',
            'integration'
        ];
        const v635 = {
            type: 'list',
            name: 'type',
            message: 'Implementation type:',
            choices: v634
        };
        const v636 = [
            'HIGH',
            'MEDIUM',
            'LOW'
        ];
        const v637 = {
            type: 'list',
            name: 'priority',
            message: 'Priority:',
            choices: v636
        };
        const v638 = {
            type: 'input',
            name: 'planLocation',
            message: 'Implementation plan location:',
            default: '.ai/memory/implementation-plans/new-plan.md'
        };
        const v640 = answers => {
            const v639 = answers.type;
            return v639;
        };
        const v643 = input => {
            const v641 = /^[a-z_]+$/.test(input);
            const v642 = v641 || 'Must be lowercase with underscores';
            return v642;
        };
        const v644 = {
            type: 'input',
            name: 'sessionType',
            message: 'Session type identifier:',
            default: v640,
            validate: v643
        };
        const v645 = [
            v628,
            v633,
            v635,
            v637,
            v638,
            v644
        ];
        const answers = await inquirer.prompt(v645);
        const availableAgents = await this.getAvailableAgents();
        const v655 = agent => {
            const v647 = agent.name;
            const v648 = agent.description;
            const v649 = v648 || 'No description';
            const v650 = agent.name;
            const v651 = [
                'meta-development-orchestrator',
                'documentation-sync-guardian'
            ];
            const v652 = agent.name;
            const v653 = v651.includes(v652);
            const v654 = {};
            v654.name = `${ v647 } - ${ v649 }`;
            v654.value = v650;
            v654.checked = v653;
            return v654;
        };
        const v656 = availableAgents.map(v655);
        const v657 = {
            type: 'checkbox',
            name: 'selectedAgents',
            message: 'Select agents to use:',
            choices: v656
        };
        const v658 = [v657];
        const v646 = await inquirer.prompt(v658);
        const selectedAgents = v646.selectedAgents;
        const v659 = answers.name;
        const v660 = answers.description;
        const v661 = answers.type;
        const v662 = answers.priority;
        const v663 = answers.type;
        const v664 = [v663];
        const v665 = {};
        v665.name = v659;
        v665.description = v660;
        v665.type = v661;
        v665.priority = v662;
        v665.version = '1.0.0';
        v665.tags = v664;
        const v666 = answers.planLocation;
        const v667 = answers.sessionType;
        const v668 = {};
        v668.plan_location = v666;
        v668.session_type = v667;
        const v670 = name => {
            const v669 = {};
            v669.name = name;
            v669.role = `Role for ${ name }`;
            v669.deploy_for = 'Update with specific tasks';
            return v669;
        };
        const v671 = selectedAgents.map(v670);
        const v672 = [];
        const v673 = [
            'Task 1',
            'Task 2'
        ];
        const v674 = selectedAgents[0];
        const v675 = [v674];
        const v676 = {
            name: 'Setup',
            description: 'Initial setup phase',
            tasks: v673,
            agents: v675
        };
        const v677 = [
            'Task 1',
            'Task 2'
        ];
        const v678 = selectedAgents.slice(0, 2);
        const v679 = {
            name: 'Implementation',
            description: 'Main implementation phase',
            tasks: v677,
            agents: v678
        };
        const v680 = [
            'Task 1',
            'Task 2'
        ];
        const v681 = [];
        const v682 = {
            name: 'Testing',
            description: 'Testing and validation',
            tasks: v680,
            agents: v681
        };
        const v683 = [
            v676,
            v679,
            v682
        ];
        const v684 = [
            'All code implemented',
            'Tests passing',
            'Documentation updated'
        ];
        const v685 = {};
        v685.criteria = v684;
        const v686 = answers.type;
        const v687 = [
            `Document patterns in .ai/memory/patterns/${ v686 }/`,
            'Create ADR for architectural decisions',
            'Update project.md with conventions'
        ];
        const v688 = [];
        const lop = {};
        lop.metadata = v665;
        lop.variables = v668;
        lop.agents = v671;
        lop.mcp_servers = v672;
        lop.phases = v683;
        lop.verification = v685;
        lop.memory_patterns = v687;
        lop.anti_patterns = v688;
        const v689 = answers.sessionType;
        const filename = `${ v689 }.yaml`;
        const v690 = this.projectLopPath;
        const filepath = path.join(v690, filename);
        const v691 = this.projectLopPath;
        const v692 = fs.existsSync(v691);
        const v693 = !v692;
        if (v693) {
            const v694 = this.projectLopPath;
            const v695 = { recursive: true };
            const v696 = fs.mkdirSync(v694, v695);
            v696;
        }
        const v697 = { lineWidth: 120 };
        const v698 = yaml.dump(lop, v697);
        const v699 = fs.writeFileSync(filepath, v698);
        v699;
        const v700 = `\n✅ LOP created successfully at: ${ filepath }`;
        const v701 = chalk.green(v700);
        const v702 = console.log(v701);
        v702;
        const v703 = chalk.yellow('\n\u26A0️  Remember to update:');
        const v704 = console.log(v703);
        v704;
        const v705 = console.log('  - Agent roles and deployment tasks');
        v705;
        const v706 = console.log('  - Phase tasks with specific actions');
        v706;
        const v707 = console.log('  - Verification criteria');
        v707;
        const v708 = console.log('  - MCP servers if needed');
        v708;
        return filepath;
    } catch (error) {
        const v709 = error.message;
        const v710 = `✗ Error creating LOP: ${ v709 }`;
        const v711 = chalk.red(v710);
        const v712 = console.error(v711);
        v712;
        return null;
    }
};
LOPManager.create = create;
const list = async function list() {
    try {
        const v713 = chalk.cyan('\uD83D\uDCCB Available LOPs\n');
        const v714 = console.log(v713);
        v714;
        const v715 = this.projectLopPath;
        const v716 = path.join(v715, '*.yaml');
        const v717 = this.projectLopPath;
        const v718 = path.join(v717, '*.yml');
        const v719 = this.templateLopPath;
        const v720 = path.join(v719, '*.yaml');
        const v721 = this.templateLopPath;
        const v722 = path.join(v721, '*.yml');
        const patterns = [
            v716,
            v718,
            v720,
            v722
        ];
        const files = [];
        let pattern;
        for (pattern of patterns) {
            const matches = await glob(pattern);
            const v723 = files.push(...matches);
            v723;
        }
        const v724 = files.length;
        const v725 = v724 === 0;
        if (v725) {
            const v726 = chalk.yellow('No LOP files found');
            const v727 = console.log(v726);
            v727;
            const v728 = chalk.gray('Create one with: mac lop create');
            const v729 = console.log(v728);
            v729;
            return;
        }
        const lops = [];
        let file;
        for (file of files) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const lop = yaml.load(content);
                let source;
                const v730 = this.projectLopPath;
                const v731 = file.includes(v730);
                if (v731) {
                    source = 'project';
                } else {
                    source = 'template';
                }
                const v732 = lop.metadata;
                const v733 = v732.name;
                const v734 = lop.metadata;
                const v735 = v734.type;
                const v736 = lop.metadata;
                const v737 = v736.priority;
                const v738 = lop.metadata;
                const v739 = v738.description;
                const v740 = {
                    name: v733,
                    type: v735,
                    priority: v737,
                    description: v739,
                    path: file,
                    source
                };
                const v741 = lops.push(v740);
                v741;
            } catch (err) {
                const v742 = path.basename(file);
                const v743 = `⚠️  Could not load: ${ v742 }`;
                const v744 = chalk.yellow(v743);
                const v745 = console.warn(v744);
                v745;
            }
        }
        const v746 = chalk.bold('Project LOPs:');
        const v747 = console.log(v746);
        v747;
        const v750 = l => {
            const v748 = l.source;
            const v749 = v748 === 'project';
            return v749;
        };
        const v751 = lops.filter(v750);
        const v771 = lop => {
            const v752 = chalk.green('\u25CF');
            const v753 = lop.name;
            const v754 = chalk.bold(v753);
            const v755 = `  ${ v752 } ${ v754 }`;
            const v756 = console.log(v755);
            v756;
            const v757 = lop.type;
            const v758 = lop.priority;
            const v759 = `    Type: ${ v757 } | Priority: ${ v758 }`;
            const v760 = console.log(v759);
            v760;
            const v761 = lop.description;
            const v762 = chalk.gray(v761);
            const v763 = `    ${ v762 }`;
            const v764 = console.log(v763);
            v764;
            const v765 = process.cwd();
            const v766 = lop.path;
            const v767 = path.relative(v765, v766);
            const v768 = chalk.gray(v767);
            const v769 = `    ${ v768 }\n`;
            const v770 = console.log(v769);
            v770;
        };
        const v772 = v751.forEach(v771);
        v772;
        const v773 = chalk.bold('\nTemplate LOPs:');
        const v774 = console.log(v773);
        v774;
        const v777 = l => {
            const v775 = l.source;
            const v776 = v775 === 'template';
            return v776;
        };
        const v778 = lops.filter(v777);
        const v797 = lop => {
            const v779 = chalk.blue('\u25CF');
            const v780 = lop.name;
            const v781 = chalk.bold(v780);
            const v782 = `  ${ v779 } ${ v781 }`;
            const v783 = console.log(v782);
            v783;
            const v784 = lop.type;
            const v785 = lop.priority;
            const v786 = `    Type: ${ v784 } | Priority: ${ v785 }`;
            const v787 = console.log(v786);
            v787;
            const v788 = lop.description;
            const v789 = chalk.gray(v788);
            const v790 = `    ${ v789 }`;
            const v791 = console.log(v790);
            v791;
            const v792 = lop.path;
            const v793 = path.basename(v792);
            const v794 = chalk.gray(v793);
            const v795 = `    ${ v794 }\n`;
            const v796 = console.log(v795);
            v796;
        };
        const v798 = v778.forEach(v797);
        v798;
    } catch (error) {
        const v799 = error.message;
        const v800 = `✗ Error listing LOPs: ${ v799 }`;
        const v801 = chalk.red(v800);
        const v802 = console.error(v801);
        v802;
    }
};
LOPManager.list = list;
const execute = async function execute(filePath) {
    try {
        const v803 = chalk.cyan('\uD83D\uDE80 Executing LOP...\n');
        const v804 = console.log(v803);
        v804;
        const isValid = await this.validate(filePath);
        const v805 = !isValid;
        if (v805) {
            const v806 = chalk.red('\u2717 Cannot execute invalid LOP');
            const v807 = console.error(v806);
            v807;
            return;
        }
        const absolutePath = path.resolve(filePath);
        const content = fs.readFileSync(absolutePath, 'utf8');
        const lop = yaml.load(content);
        const prompt = await this.processLOP(lop);
        const v808 = chalk.green('\n\u2705 Generated Implementation Prompt:\n');
        const v809 = console.log(v808);
        v809;
        const v810 = '\u2500'.repeat(80);
        const v811 = chalk.gray(v810);
        const v812 = console.log(v811);
        v812;
        const v813 = console.log(prompt);
        v813;
        const v814 = '\u2500'.repeat(80);
        const v815 = chalk.gray(v814);
        const v816 = console.log(v815);
        v816;
        const v818 = {
            type: 'confirm',
            name: 'save',
            message: 'Save this prompt to a file?',
            default: true
        };
        const v819 = [v818];
        const v817 = await inquirer.prompt(v819);
        const save = v817.save;
        if (save) {
            const v820 = new Date();
            const v821 = v820.toISOString();
            const timestamp = v821.replace(/[:.]/g, '-');
            const v822 = process.cwd();
            const v823 = `.claude/prompts/generated/`;
            const v824 = lop.variables;
            const v825 = v824.session_type;
            const v826 = `${ v825 }-${ timestamp }.md`;
            const outputPath = path.join(v822, v823, v826);
            const outputDir = path.dirname(outputPath);
            const v827 = fs.existsSync(outputDir);
            const v828 = !v827;
            if (v828) {
                const v829 = { recursive: true };
                const v830 = fs.mkdirSync(outputDir, v829);
                v830;
            }
            const v831 = fs.writeFileSync(outputPath, prompt);
            v831;
            const v832 = `\n✅ Prompt saved to: ${ outputPath }`;
            const v833 = chalk.green(v832);
            const v834 = console.log(v833);
            v834;
            const v835 = chalk.cyan('\n\uD83D\uDCCB Copy this prompt to Claude to begin implementation');
            const v836 = console.log(v835);
            v836;
        }
    } catch (error) {
        const v837 = error.message;
        const v838 = `✗ Error executing LOP: ${ v837 }`;
        const v839 = chalk.red(v838);
        const v840 = console.error(v839);
        v840;
    }
};
LOPManager.execute = execute;
const processLOP = async function processLOP(lop) {
    let hopTemplatePath;
    const v841 = this.hopPath;
    const v842 = fs.existsSync(v841);
    const v843 = this.hopPath;
    const v844 = path.join(__dirname, '../../templates/prompts/hop/implementation-master.md');
    if (v842) {
        hopTemplatePath = v843;
    } else {
        hopTemplatePath = v844;
    }
    let template = fs.readFileSync(hopTemplatePath, 'utf8');
    template = this.interpolateVariables(template, lop);
    return template;
};
LOPManager.processLOP = processLOP;
const escapeTemplate = function escapeTemplate(str) {
    const v845 = !str;
    if (v845) {
        return '';
    }
    const escapeMap = {};
    escapeMap['<'] = '&lt;';
    escapeMap['>'] = '&gt;';
    escapeMap['&'] = '&amp;';
    escapeMap['"'] = '&quot;';
    escapeMap['\''] = '&#x27;';
    escapeMap['/'] = '&#x2F;';
    escapeMap['`'] = '&#x60;';
    escapeMap['='] = '&#x3D;';
    escapeMap['$'] = '&#36;';
    escapeMap['{'] = '&#123;';
    escapeMap['}'] = '&#125;';
    const v846 = String(str);
    const v849 = char => {
        const v847 = escapeMap[char];
        const v848 = v847 || char;
        return v848;
    };
    const v850 = v846.replace(/[<>&"'`=$/{}]/g, v849);
    return v850;
};
LOPManager.escapeTemplate = escapeTemplate;
const validatePath = function validatePath(filePath, allowedBasePath) {
    const v851 = !filePath;
    const v852 = typeof filePath;
    const v853 = v852 !== 'string';
    const v854 = v851 || v853;
    if (v854) {
        const v855 = new Error('Invalid file path provided');
        throw v855;
    }
    const normalizedPath = path.normalize(filePath);
    const v856 = process.cwd();
    const resolvedPath = path.resolve(v856, normalizedPath);
    const v857 = process.cwd();
    const resolvedBasePath = path.resolve(v857, allowedBasePath);
    const v858 = path.sep;
    const v859 = resolvedBasePath + v858;
    const v860 = resolvedPath.startsWith(v859);
    const v861 = !v860;
    const v862 = resolvedPath !== resolvedBasePath;
    const v863 = v861 && v862;
    if (v863) {
        const v864 = new Error(`Path traversal detected: ${ filePath } is outside allowed directory ${ allowedBasePath }`);
        throw v864;
    }
    const v865 = normalizedPath.includes('..');
    const v866 = normalizedPath.includes('~');
    const v867 = v865 || v866;
    if (v867) {
        const v868 = new Error(`Potentially unsafe path pattern: ${ filePath }`);
        throw v868;
    }
    const filename = path.basename(normalizedPath);
    const v869 = /^[a-zA-Z0-9._-]+$/.test(filename);
    const v870 = !v869;
    if (v870) {
        const v871 = new Error(`Invalid filename characters: ${ filename }`);
        throw v871;
    }
    return normalizedPath;
};
LOPManager.validatePath = validatePath;
const interpolateVariables = function interpolateVariables(template, lop) {
    const v872 = lop.variables;
    const v873 = lop.variables;
    const v874 = v873.plan_location;
    const v875 = v872 && v874;
    if (v875) {
        try {
            const v876 = lop.variables;
            const v877 = v876.plan_location;
            const v878 = this.validatePath(v877, '.ai/memory/implementation-plans');
            v878;
        } catch (error) {
            const v879 = error.message;
            const v880 = new Error(`Invalid plan_location path: ${ v879 }`);
            throw v880;
        }
    }
    const v881 = lop.metadata;
    const v882 = v881.name;
    const v883 = this.escapeTemplate(v882);
    template = template.replace(/\$\{lop\.metadata\.name\}/g, v883);
    const v884 = lop.metadata;
    const v885 = v884.priority;
    const v886 = this.escapeTemplate(v885);
    template = template.replace(/\$\{lop\.metadata\.priority\}/g, v886);
    const v887 = lop.metadata;
    const v888 = v887.type;
    const v889 = this.escapeTemplate(v888);
    template = template.replace(/\$\{lop\.metadata\.type\}/g, v889);
    const v890 = lop.metadata;
    const v891 = v890.description;
    const v892 = this.escapeTemplate(v891);
    template = template.replace(/\$\{lop\.metadata\.description\}/g, v892);
    const v893 = lop.variables;
    const v894 = v893.plan_location;
    const v895 = this.escapeTemplate(v894);
    template = template.replace(/\$\{lop\.variables\.plan_location\}/g, v895);
    const v896 = lop.variables;
    const v897 = v896.session_type;
    const v898 = this.escapeTemplate(v897);
    template = template.replace(/\$\{lop\.variables\.session_type\}/g, v898);
    let agentsSection = '';
    const v899 = lop.agents;
    const v907 = agent => {
        const v900 = agent.name;
        const v901 = this.escapeTemplate(v900);
        agentsSection += `### ${ v901 }\n`;
        const v902 = agent.role;
        const v903 = this.escapeTemplate(v902);
        agentsSection += `- **Role**: ${ v903 }\n`;
        const v904 = agent.deploy_for;
        const v905 = v904 || 'See phases below';
        const v906 = this.escapeTemplate(v905);
        agentsSection += `- **Deploy for**: ${ v906 }\n\n`;
    };
    const v908 = v899.forEach(v907);
    v908;
    template = template.replace(/\$\{#foreach lop\.agents as agent\}[\s\S]*?\$\{\/foreach\}/g, agentsSection);
    const v909 = lop.mcp_servers;
    const v910 = lop.mcp_servers;
    const v911 = v910.length;
    const v912 = v911 > 0;
    const v913 = v909 && v912;
    if (v913) {
        let mcpSection = '## Required MCP Servers\n\n';
        const v914 = lop.mcp_servers;
        const v916 = server => {
            const v915 = this.escapeTemplate(server);
            mcpSection += `- ${ v915 }\n`;
        };
        const v917 = v914.forEach(v916);
        v917;
        template = template.replace(/\$\{#if lop\.mcp_servers\}[\s\S]*?\$\{\/if\}/g, mcpSection);
    } else {
        template = template.replace(/\$\{#if lop\.mcp_servers\}[\s\S]*?\$\{\/if\}/g, '');
    }
    let phasesSection = '';
    const v918 = lop.phases;
    const v944 = (phase, index) => {
        const v919 = index + 1;
        const v920 = phase.name;
        const v921 = this.escapeTemplate(v920);
        phasesSection += `### Phase ${ v919 }: ${ v921 }\n\n`;
        const v922 = phase.description;
        const v923 = this.escapeTemplate(v922);
        phasesSection += `**Description**: ${ v923 }\n\n`;
        phasesSection += `**Tasks**:\n`;
        const v924 = phase.tasks;
        const v926 = task => {
            const v925 = this.escapeTemplate(task);
            phasesSection += `- ${ v925 }\n`;
        };
        const v927 = v924.forEach(v926);
        v927;
        const v928 = phase.agents;
        const v929 = phase.agents;
        const v930 = v929.length;
        const v931 = v930 > 0;
        const v932 = v928 && v931;
        if (v932) {
            phasesSection += `\n**Deploy Agents**:\n`;
            const v933 = phase.agents;
            const v942 = agent => {
                let agentTask;
                const v934 = phase.agent_tasks;
                const v935 = phase.agent_tasks;
                const v936 = v935[agent];
                const v937 = v934 && v936;
                const v938 = phase.agent_tasks;
                const v939 = v938[agent];
                if (v937) {
                    agentTask = v939;
                } else {
                    agentTask = 'assist with this phase';
                }
                const v940 = this.escapeTemplate(agent);
                const v941 = this.escapeTemplate(agentTask);
                phasesSection += `- Use ${ v940 } to ${ v941 }\n`;
            };
            const v943 = v933.forEach(v942);
            v943;
        }
        phasesSection += '\n**Session Update Required**: Update context session after completing this phase with:\n';
        phasesSection += '- Completed tasks\n';
        phasesSection += '- Files modified\n';
        phasesSection += '- Discoveries made\n';
        phasesSection += '- Any blockers encountered\n\n';
    };
    const v945 = v918.forEach(v944);
    v945;
    template = template.replace(/\$\{#foreach lop\.phases as phase index\}[\s\S]*?\$\{\/foreach\}/g, phasesSection);
    let criteriaSection = '';
    const v946 = lop.verification;
    const v947 = v946.criteria;
    const v949 = criterion => {
        const v948 = this.escapeTemplate(criterion);
        criteriaSection += `□ ${ v948 }\n`;
    };
    const v950 = v947.forEach(v949);
    v950;
    template = template.replace(/\$\{#foreach lop\.verification\.criteria as criterion\}[\s\S]*?\$\{\/foreach\}/g, criteriaSection);
    let memorySection = '';
    const v951 = lop.memory_patterns;
    const v953 = pattern => {
        const v952 = this.escapeTemplate(pattern);
        memorySection += `- ${ v952 }\n`;
    };
    const v954 = v951.forEach(v953);
    v954;
    template = template.replace(/\$\{#foreach lop\.memory_patterns as pattern\}[\s\S]*?\$\{\/foreach\}/g, memorySection);
    const v955 = lop.testing;
    if (v955) {
        let testingSection = '### Required Tests\n';
        const v956 = lop.testing;
        const v957 = v956.required_tests;
        if (v957) {
            const v958 = lop.testing;
            const v959 = v958.required_tests;
            const v961 = test => {
                const v960 = this.escapeTemplate(test);
                testingSection += `- ${ v960 }\n`;
            };
            const v962 = v959.forEach(v961);
            v962;
        }
        testingSection += '\n### Test Commands\n';
        const v963 = lop.testing;
        const v964 = v963.test_commands;
        if (v964) {
            const v965 = lop.testing;
            const v966 = v965.test_commands;
            const v968 = command => {
                const v967 = this.escapeTemplate(command);
                testingSection += `- \`${ v967 }\`\n`;
            };
            const v969 = v966.forEach(v968);
            v969;
        }
        testingSection += '\n### Success Criteria\n';
        const v970 = lop.testing;
        const v971 = v970.success_criteria;
        if (v971) {
            const v972 = lop.testing;
            const v973 = v972.success_criteria;
            const v975 = criterion => {
                const v974 = this.escapeTemplate(criterion);
                testingSection += `- ${ v974 }\n`;
            };
            const v976 = v973.forEach(v975);
            v976;
        }
        template = template.replace(/\$\{#if lop\.testing\}[\s\S]*?\$\{\/if\}/g, testingSection);
    } else {
        template = template.replace(/\$\{#if lop\.testing\}[\s\S]*?\$\{\/if\}/g, '');
    }
    const v977 = lop.anti_patterns;
    const v978 = lop.anti_patterns;
    const v979 = v978.length;
    const v980 = v979 > 0;
    const v981 = v977 && v980;
    if (v981) {
        let antiPatternsSection = '';
        const v982 = lop.anti_patterns;
        const v984 = pattern => {
            const v983 = this.escapeTemplate(pattern);
            antiPatternsSection += `- ❌ ${ v983 }\n`;
        };
        const v985 = v982.forEach(v984);
        v985;
        template = template.replace(/\$\{#foreach lop\.anti_patterns as pattern\}[\s\S]*?\$\{\/foreach\}/g, antiPatternsSection);
    } else {
        template = template.replace(/\$\{#foreach lop\.anti_patterns as pattern\}[\s\S]*?\$\{\/foreach\}/g, '- \u274C None specified\n');
    }
    return template;
};
LOPManager.interpolateVariables = interpolateVariables;
const getAvailableAgents = async function getAvailableAgents() {
    const v986 = process.cwd();
    const agentsPath = path.join(v986, 'Examples/agents');
    const agents = [];
    const v987 = fs.existsSync(agentsPath);
    if (v987) {
        const v988 = fs.readdirSync(agentsPath);
        const v990 = f => {
            const v989 = f.endsWith('.md');
            return v989;
        };
        const files = v988.filter(v990);
        let file;
        for (file of files) {
            const name = path.basename(file, '.md');
            const v991 = path.join(agentsPath, file);
            const content = fs.readFileSync(v991, 'utf8');
            const match = content.match(/description:\s*(.+)/);
            let description;
            const v992 = match[1];
            if (match) {
                description = v992;
            } else {
                description = null;
            }
            const v993 = {
                name,
                description
            };
            const v994 = agents.push(v993);
            v994;
        }
    }
    const v995 = agents.length;
    const v996 = v995 === 0;
    if (v996) {
        const v997 = {
            name: 'meta-development-orchestrator',
            description: 'Overall coordination'
        };
        const v998 = {
            name: 'cli-test-engineer',
            description: 'CLI testing'
        };
        const v999 = {
            name: 'playwright-test-engineer',
            description: 'E2E testing'
        };
        const v1000 = {
            name: 'documentation-sync-guardian',
            description: 'Documentation updates'
        };
        const v1001 = {
            name: 'implementation-verifier',
            description: 'Verify implementations'
        };
        const v1002 = agents.push(v997, v998, v999, v1000, v1001);
        v1002;
    }
    return agents;
};
LOPManager.getAvailableAgents = getAvailableAgents;
LOPManager['is_class'] = true;
module.exports = new LOPManager();