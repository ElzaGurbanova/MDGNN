var http = require('http');
const v71 = function (req, res) {
    var fs = require('fs');
    const v38 = req.url;
    const v39 = console.log(v38);
    v39;
    const v40 = req.url;
    file = v40.slice(1);
    const v69 = function (err, data) {
        const v41 = file === '';
        const v42 = err || v41;
        if (v42) {
            file = file || './';
            const v63 = function (err, data) {
                if (err) {
                    const v43 = res.writeHead(404);
                    v43;
                    const v44 = res.write('file not found.');
                    v44;
                    const v45 = res.end();
                    v45;
                } else {
                    var html = '';
                    html += '<ul>';
                    const v46 = data.length;
                    var i = v46 - 1;
                    let v47 = i >= 0;
                    while (v47) {
                        const v49 = req.url;
                        const v50 = v49 === '/';
                        const v51 = req.url;
                        let v52;
                        if (v50) {
                            v52 = '';
                        } else {
                            v52 = v51;
                        }
                        const v53 = '<li><a href="' + v52;
                        const v54 = v53 + '/';
                        const v55 = data[i];
                        const v56 = v54 + v55;
                        const v57 = v56 + '">';
                        const v58 = data[i];
                        const v59 = v57 + v58;
                        html += v59 + '</a></li>';
                        const v48 = i--;
                        v47 = i >= 0;
                    }
                    ;
                    html += '</ul>';
                    const v60 = { 'Content-Type': 'text/html' };
                    const v61 = res.writeHead(200, v60);
                    v61;
                    const v62 = res.end(html);
                    v62;
                }
            };
            const v64 = fs.readdir(file, v63);
            v64;
        } else {
            const v65 = res.writeHead(200);
            v65;
            const v66 = data.toString();
            const v67 = res.write(v66);
            v67;
            const v68 = res.end();
            v68;
        }
    };
    const v70 = fs.readFile(file, 'utf-8', v69);
    v70;
};
const v72 = http.createServer(v71);
const v73 = v72.listen(3000);
v73;
const v74 = console.log('http server is listening at port 3000');
v74;