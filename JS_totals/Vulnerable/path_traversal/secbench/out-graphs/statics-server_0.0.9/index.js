const http = require('http');
const server = http.createServer();
const fs = require('fs');
const path = require('path');
const os = require('os');
const v41 = require('child_process');
const spawnSync = v41.spawnSync;
const v66 = function (req, res) {
    const v42 = req.url;
    const v43 = v42 === '/favicon.ico';
    if (v43) {
        const v44 = res.end();
        v44;
        return;
    }
    const v45 = req.url;
    const v46 = decodeURIComponent(v45);
    const v47 = '.' + v46;
    const staticPath = path.resolve(v47);
    const indexPath = path.resolve(staticPath, 'index.html');
    const v48 = fs.existsSync(indexPath);
    if (v48) {
        const v49 = fs.createReadStream(indexPath);
        const v50 = v49.pipe(res);
        v50;
    } else {
        const v51 = fs.lstatSync(staticPath);
        const v52 = v51.isDirectory();
        if (v52) {
            var files = fs.readdirSync(staticPath);
            var lis = '';
            const v58 = (v, i) => {
                const v53 = path.resolve(staticPath, v);
                const v54 = fs.lstatSync(v53);
                const v55 = v54.isDirectory();
                if (v55) {
                    const v56 = req.url;
                    lis += `<li><a href="${ v56 }${ v }/">${ v }/</a></li>`;
                } else {
                    const v57 = req.url;
                    lis += `<li><a href="${ v57 }${ v }">${ v }</a></li>`;
                }
            };
            const v59 = files.forEach(v58);
            v59;
            const v60 = `<html><head><style>
body{margin: 0;padding: 0;font-family: Consolas,sans-serif;}
p{line-height: 50px;background: #2a333c;color: #fff;padding-left: 80px;font-size: 22px;}
ul{margin-top: 30px;margin-left: 100px;min-height: 500px;}
li{line-height: 30px;font-size: 18px;list-style: none;}
a{color: #373737; }
p.copy{line-height: 30px;font-size: 14px;text-align: center;background: #fff;color: #373737;}</style></head><body><p>statics-server</p><ul>${ lis }</ul><p class="copy">copy right @ 2017 song</p></body></html>`;
            const v61 = res.end(v60);
            v61;
        } else {
            const v62 = fs.existsSync(staticPath);
            if (v62) {
                const v63 = fs.createReadStream(staticPath);
                const v64 = v63.pipe(res);
                v64;
            } else {
                const v65 = res.end('404文件未找到');
                v65;
            }
        }
    }
};
const v67 = server.on('request', v66);
v67;
const v76 = () => {
    const v68 = console.log('服务器已经启动');
    v68;
    const v69 = console.log('访问localhost:8080');
    v69;
    const v70 = os.platform();
    const v71 = v70 === 'win32';
    if (v71) {
        const v72 = ['http://localhost:8080'];
        const v73 = spawnSync('explorer', v72);
        v73;
    } else {
        const v74 = ['http://localhost:8080'];
        const v75 = spawnSync('open', v74);
        v75;
    }
};
const v77 = server.listen(8080, v76);
v77;
const v79 = () => {
    const v78 = console.log('文件不存在');
    v78;
};
const v80 = process.on('uncaughtException', v79);
v80;