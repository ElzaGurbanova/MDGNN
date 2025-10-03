var cp = require('child_process');
const whereis = function (name, cb) {
    const v53 = 'which ' + name;
    const v103 = function (error, stdout, stderr) {
        const v54 = stdout.split('\n');
        stdout = v54[0];
        const v55 = error || stderr;
        const v56 = stdout === '';
        const v57 = v55 || v56;
        const v58 = stdout.charAt(0);
        const v59 = v58 !== '/';
        const v60 = v57 || v59;
        if (v60) {
            const v61 = stdout.split('\n');
            stdout = v61[0];
            const v62 = 'whereis ' + name;
            const v100 = function (error, stdout, stderr) {
                const v63 = error || stderr;
                const v64 = stdout === '';
                const v65 = v63 || v64;
                const v66 = stdout.indexOf('/');
                const v67 = -1;
                const v68 = v66 === v67;
                const v69 = v65 || v68;
                if (v69) {
                    const v70 = 'where ' + name;
                    const v95 = function (error, stdout, stderr) {
                        const v71 = error || stderr;
                        const v72 = stdout === '';
                        const v73 = v71 || v72;
                        const v74 = stdout.indexOf('\\');
                        const v75 = -1;
                        const v76 = v74 === v75;
                        const v77 = v73 || v76;
                        if (v77) {
                            const v78 = 'for %i in (' + name;
                            const v79 = v78 + '.exe) do @echo. %~$PATH:i';
                            const v92 = function (error, stdout, stderr) {
                                const v80 = error || stderr;
                                const v81 = stdout === '';
                                const v82 = v80 || v81;
                                const v83 = stdout.indexOf('\\');
                                const v84 = -1;
                                const v85 = v83 === v84;
                                const v86 = v82 || v85;
                                if (v86) {
                                    const v87 = 'Could not find ' + name;
                                    const v88 = v87 + ' on your system';
                                    const v89 = new Error(v88);
                                    const v90 = cb(v89);
                                    return v90;
                                }
                                const v91 = cb(null, stdout);
                                return v91;
                            };
                            const v93 = cp.exec(v79, v92);
                            v93;
                        } else {
                            const v94 = cb(null, stdout);
                            return v94;
                        }
                    };
                    const v96 = cp.exec(v70, v95);
                    v96;
                } else {
                    const v97 = stdout.split(' ');
                    const v98 = v97[1];
                    const v99 = cb(null, v98);
                    return v99;
                }
            };
            const v101 = cp.exec(v62, v100);
            v101;
        } else {
            const v102 = cb(null, stdout);
            return v102;
        }
    };
    const v104 = cp.exec(v53, v103);
    v104;
};
module.exports = whereis;