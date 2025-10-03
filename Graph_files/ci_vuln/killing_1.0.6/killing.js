'use strict';
const v39 = require('os');
var EOL = v39.EOL;
var retry = require('./retry');
const v40 = require('child_process');
var exec = v40.exec;
const filter = function (list) {
    var a = [];
    const v44 = function (i) {
        const v41 = !i;
        const v42 = !v41;
        if (v42) {
            const v43 = a.push(i);
            v43;
        }
    };
    const v45 = list.forEach(v44);
    v45;
    return a;
};
const v76 = function (name, callback) {
    var res = [];
    const v71 = function () {
        const v69 = function (resolve, reject) {
            const v46 = 'ps -ef | grep ' + name;
            const v67 = function (error, stdout) {
                if (error) {
                    const v47 = reject(error);
                    v47;
                }
                ;
                var items = stdout.split(EOL);
                var list = [];
                const v57 = function (i) {
                    var content = i.split(' ');
                    content = filter(content);
                    content = content.reverse();
                    const v48 = content[0];
                    const v49 = !v48;
                    const v50 = !v49;
                    if (v50) {
                        const v51 = new RegExp('grep|kill');
                        const v52 = content[1];
                        const v53 = v51.test(v52);
                        const v54 = !v53;
                        if (v54) {
                            content = content.reverse();
                            const v55 = content[1];
                            const v56 = list.push(v55);
                            v56;
                        }
                    }
                };
                const v58 = items.forEach(v57);
                v58;
                const v59 = list.length;
                const v60 = !v59;
                if (v60) {
                    const v61 = resolve(res);
                    v61;
                }
                res = res.concat(list);
                const v62 = list.join(' ');
                const v63 = 'sudo kill -SIGKILL ' + v62;
                const v65 = function (error) {
                    const v64 = reject();
                    v64;
                };
                const v66 = exec(v63, v65);
                v66;
            };
            const v68 = exec(v46, v67);
            v68;
        };
        const v70 = new Promise(v69);
        return v70;
    };
    const v72 = retry(v71, 1000, 100);
    const v74 = function (list) {
        const v73 = callback(list);
        v73;
    };
    const v75 = v72.then(v74);
    v75;
};
module.exports = v76;