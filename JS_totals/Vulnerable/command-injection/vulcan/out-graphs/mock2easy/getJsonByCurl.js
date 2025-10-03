var child_process = require('child_process');
var obj2StrParams = function (obj) {
    var param = [];
    let prop;
    for (prop in obj) {
        const v31 = prop + '=';
        const v32 = obj[prop];
        const v33 = encodeURIComponent(v32);
        const v34 = v31 + v33;
        const v35 = param.push(v34);
        v35;
    }
    const v36 = param.join('&');
    return v36;
};
const v60 = function (mock2easy, callback, domain, url, query, cookie) {
    try {
        const v37 = obj2StrParams(query);
        const v38 = '--data "' + v37;
        const v39 = v38 + '" ';
        let v40;
        if (cookie) {
            v40 = '-H \'Cookie: ';
        } else {
            v40 = '';
        }
        let v41;
        if (cookie) {
            v41 = '; \'';
        } else {
            v41 = '';
        }
        var sh = [
            'curl',
            ' ',
            domain,
            url,
            ' ',
            v39,
            v40,
            cookie,
            v41
        ];
        sh = sh.join('');
        const v42 = mock2easy.log();
        v42;
        const v43 = global.language;
        const v44 = v43['SERVER-CURL-LOG'];
        const v45 = '+---------------------' + v44;
        const v46 = v45 + '--------------------------';
        const v47 = v46.yellow;
        const v48 = mock2easy.log(v47);
        v48;
        const v49 = '| '.yellow;
        const v50 = sh.green;
        const v51 = v49 + v50;
        const v52 = mock2easy.log(v51);
        v52;
        const v53 = '+-------------------------------------------------------'.yellow;
        const v54 = mock2easy.log(v53);
        v54;
        const v57 = function (error, stdout, stderr) {
            if (error) {
                const v55 = callback(error);
                return v55;
            }
            const v56 = callback(null, stdout);
            v56;
        };
        const v58 = child_process.exec(sh, v57);
        v58;
    } catch (error) {
        const v59 = callback(error);
        v59;
    }
};
module.exports = v60;