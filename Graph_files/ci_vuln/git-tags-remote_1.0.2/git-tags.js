const semver = require('semver');
const v53 = require('child_process');
const exec = v53.exec;
const lsRemoteTags = repo => {
    const v62 = (resolve, reject) => {
        const v54 = `git ls-remote --tags ${ repo }`;
        const v60 = (error, stdout, stderr) => {
            if (stderr) {
                const v55 = new Error(stderr);
                const v56 = reject(v55);
                v56;
            }
            const v57 = stdout.toString();
            const v58 = v57.trim();
            const v59 = resolve(v58);
            v59;
        };
        const v61 = exec(v54, v60);
        v61;
    };
    const v63 = new Promise(v62);
    return v63;
};
const parseTags = tags => {
    const tagMap = new Map();
    const v64 = tags.split('\n');
    const v71 = str => {
        const ref = str.split(/\t/);
        const v65 = ref[1];
        const v66 = v65.split('/');
        const v67 = v66[2];
        const v68 = v67.replace(/\^\{\}$/, '');
        const v69 = ref[0];
        const v70 = tagMap.set(v68, v69);
        v70;
    };
    const v72 = v64.forEach(v71);
    v72;
    const v73 = tagMap.entries();
    const v74 = [...v73];
    const v77 = arr => {
        const v75 = arr[0];
        const v76 = semver.valid(v75);
        return v76;
    };
    const v78 = v74.filter(v77);
    const v82 = (a, b) => {
        const v79 = a[0];
        const v80 = b[0];
        const v81 = semver.compare(v79, v80);
        return v81;
    };
    const v83 = v78.sort(v82);
    const v84 = v83.reverse();
    const v85 = new Map(v84);
    return v85;
};
const get = repo => {
    const v92 = (resolve, reject) => {
        const v86 = lsRemoteTags(repo);
        const v89 = tags => {
            const v87 = parseTags(tags);
            const v88 = resolve(v87);
            return v88;
        };
        const v90 = v86.then(v89);
        const v91 = v90.catch(reject);
        v91;
    };
    const v93 = new Promise(v92);
    return v93;
};
const latest = repo => {
    const v102 = (resolve, reject) => {
        const v94 = get(repo);
        const v99 = tags => {
            const v95 = tags.entries();
            const v96 = v95.next();
            const v97 = v96.value;
            const v98 = resolve(v97);
            return v98;
        };
        const v100 = v94.then(v99);
        const v101 = v100.catch(reject);
        v101;
    };
    const v103 = new Promise(v102);
    return v103;
};
const v104 = {};
v104.get = get;
v104.latest = latest;
module.exports = v104;