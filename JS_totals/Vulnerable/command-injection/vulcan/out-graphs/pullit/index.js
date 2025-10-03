const GitHubApi = require('github');
const Menu = require('terminal-menu');
const v75 = require('child_process');
const execSync = v75.execSync;
const parse = require('parse-github-repo-url');
const Pullit = function Pullit() {
    const v76 = this.init();
    v76;
    const v77 = {};
    this.github = new GitHubApi(v77);
};
const init = function init() {
    const v78 = `git config --get remote.origin.url`;
    const v79 = { encoding: 'utf8' };
    const v80 = execSync(v78, v79);
    const url = v80.trim();
    const v81 = this.parsedGithubUrl(url);
    return v81;
};
Pullit.init = init;
const parsedGithubUrl = function parsedGithubUrl(url) {
    const parsedUrl = parse(url);
    const v82 = parsedUrl[0];
    const v83 = parsedUrl[1];
    this.owner = v82, this.repo = v83;
};
Pullit.parsedGithubUrl = parsedGithubUrl;
const fetch = function fetch(id) {
    const v84 = this.github;
    const v85 = v84.pullRequests;
    const v86 = this.owner;
    const v87 = this.repo;
    const v88 = {
        owner: v86,
        repo: v87,
        number: id
    };
    const v89 = v85.get(v88);
    const v94 = res => {
        const v90 = res.data;
        const v91 = v90.head;
        const branch = v91.ref;
        const v92 = `git fetch origin pull/${ id }/head:${ branch } && git checkout ${ branch }`;
        const v93 = execSync(v92);
        v93;
    };
    const v95 = v89.then(v94);
    const v97 = err => {
        const v96 = console.log('Error: Could not find the specified pull request.');
        v96;
    };
    const v98 = v95.catch(v97);
    return v98;
};
Pullit.fetch = fetch;
const fetchRequests = function fetchRequests() {
    const v99 = this.github;
    const v100 = v99.pullRequests;
    const v101 = this.owner;
    const v102 = this.repo;
    const v103 = {
        owner: v101,
        repo: v102
    };
    const v104 = v100.getAll(v103);
    return v104;
};
Pullit.fetchRequests = fetchRequests;
const display = function display() {
    const v105 = this.fetchRequests();
    const v144 = results => {
        const v106 = process.stdout;
        const v107 = v106.columns;
        const v108 = v107 - 4;
        const v109 = {
            width: v108,
            x: 0,
            y: 2
        };
        const menu = Menu(v109);
        const v110 = menu.reset();
        v110;
        const v111 = menu.write('Currently open pull requests:\n');
        v111;
        const v112 = menu.write('-------------------------\n');
        v112;
        const v113 = results.data;
        const v121 = element => {
            const v114 = element.number;
            const v115 = element.title;
            const v116 = element.head;
            const v117 = v116.user;
            const v118 = v117.login;
            const v119 = `${ v114 } - ${ v115 } - ${ v118 }`;
            const v120 = menu.add(v119);
            v120;
        };
        const v122 = v113.forEach(v121);
        v122;
        const v123 = `Exit`;
        const v124 = menu.add(v123);
        v124;
        const v129 = label => {
            const v125 = menu.close();
            v125;
            const v126 = label.split(' ');
            const v127 = v126[0];
            const v128 = this.fetch(v127);
            v128;
        };
        const v130 = menu.on('select', v129);
        v130;
        const v131 = process.stdin;
        const v132 = menu.createStream();
        const v133 = v131.pipe(v132);
        const v134 = process.stdout;
        const v135 = v133.pipe(v134);
        v135;
        const v136 = process.stdin;
        const v137 = v136.setRawMode(true);
        v137;
        const v142 = () => {
            const v138 = process.stdin;
            const v139 = v138.setRawMode(false);
            v139;
            const v140 = process.stdin;
            const v141 = v140.end();
            v141;
        };
        const v143 = menu.on('close', v142);
        v143;
    };
    const v145 = v105.then(v144);
    const v147 = err => {
        const v146 = console.log('Error: could not display pull requests. Please make sure this is a valid repository.');
        v146;
    };
    const v148 = v145.catch(v147);
    v148;
};
Pullit.display = display;
Pullit['is_class'] = true;
module.exports = Pullit;