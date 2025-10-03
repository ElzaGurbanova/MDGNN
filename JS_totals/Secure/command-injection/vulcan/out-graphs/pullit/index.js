const GitHubApi = require('github');
const Menu = require('terminal-menu');
const v77 = require('child_process');
const execFileSync = v77.execFileSync;
const parse = require('parse-github-repo-url');
const Pullit = function Pullit() {
    const v78 = this.init();
    v78;
    const v79 = {};
    this.github = new GitHubApi(v79);
};
const init = function init() {
    const v80 = [
        'config',
        '--get',
        'remote.origin.url'
    ];
    const v81 = { encoding: 'utf8' };
    const v82 = execFileSync('git', v80, v81);
    const url = v82.trim();
    const v83 = this.parsedGithubUrl(url);
    return v83;
};
Pullit.init = init;
const parsedGithubUrl = function parsedGithubUrl(url) {
    const parsedUrl = parse(url);
    const v84 = parsedUrl[0];
    const v85 = parsedUrl[1];
    this.owner = v84, this.repo = v85;
};
Pullit.parsedGithubUrl = parsedGithubUrl;
const fetch = function fetch(id) {
    const v86 = this.github;
    const v87 = v86.pullRequests;
    const v88 = this.owner;
    const v89 = this.repo;
    const v90 = {
        owner: v88,
        repo: v89,
        number: id
    };
    const v91 = v87.get(v90);
    const v98 = res => {
        const v92 = res.data;
        const v93 = v92.head;
        const branch = v93.ref;
        const v94 = [
            'fetch',
            'origin',
            `pull/${ id }/head:${ branch }`
        ];
        const v95 = execFileSync('git', v94);
        v95;
        const v96 = [
            'checkout',
            branch
        ];
        const v97 = execFileSync('git', v96);
        v97;
    };
    const v99 = v91.then(v98);
    const v101 = err => {
        const v100 = console.log('Error: Could not find the specified pull request.');
        v100;
    };
    const v102 = v99.catch(v101);
    return v102;
};
Pullit.fetch = fetch;
const fetchRequests = function fetchRequests() {
    const v103 = this.github;
    const v104 = v103.pullRequests;
    const v105 = this.owner;
    const v106 = this.repo;
    const v107 = {
        owner: v105,
        repo: v106
    };
    const v108 = v104.getAll(v107);
    return v108;
};
Pullit.fetchRequests = fetchRequests;
const display = function display() {
    const v109 = this.fetchRequests();
    const v148 = results => {
        const v110 = process.stdout;
        const v111 = v110.columns;
        const v112 = v111 - 4;
        const v113 = {
            width: v112,
            x: 0,
            y: 2
        };
        const menu = Menu(v113);
        const v114 = menu.reset();
        v114;
        const v115 = menu.write('Currently open pull requests:\n');
        v115;
        const v116 = menu.write('-------------------------\n');
        v116;
        const v117 = results.data;
        const v125 = element => {
            const v118 = element.number;
            const v119 = element.title;
            const v120 = element.head;
            const v121 = v120.user;
            const v122 = v121.login;
            const v123 = `${ v118 } - ${ v119 } - ${ v122 }`;
            const v124 = menu.add(v123);
            v124;
        };
        const v126 = v117.forEach(v125);
        v126;
        const v127 = `Exit`;
        const v128 = menu.add(v127);
        v128;
        const v133 = label => {
            const v129 = menu.close();
            v129;
            const v130 = label.split(' ');
            const v131 = v130[0];
            const v132 = this.fetch(v131);
            v132;
        };
        const v134 = menu.on('select', v133);
        v134;
        const v135 = process.stdin;
        const v136 = menu.createStream();
        const v137 = v135.pipe(v136);
        const v138 = process.stdout;
        const v139 = v137.pipe(v138);
        v139;
        const v140 = process.stdin;
        const v141 = v140.setRawMode(true);
        v141;
        const v146 = () => {
            const v142 = process.stdin;
            const v143 = v142.setRawMode(false);
            v143;
            const v144 = process.stdin;
            const v145 = v144.end();
            v145;
        };
        const v147 = menu.on('close', v146);
        v147;
    };
    const v149 = v109.then(v148);
    const v151 = err => {
        const v150 = console.log('Error: could not display pull requests. Please make sure this is a valid repository.');
        v150;
    };
    const v152 = v149.catch(v151);
    v152;
};
Pullit.display = display;
Pullit['is_class'] = true;
module.exports = Pullit;