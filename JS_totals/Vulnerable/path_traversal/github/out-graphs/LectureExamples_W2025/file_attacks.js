const express = require('express');
const app = express();
const port = 9000;
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const v86 = require('child_process');
const execSync = v86.execSync;
const v87 = express.static('www');
const v88 = app.use(v87);
v88;
const v89 = 25 * 1024;
const v90 = v89 * 1024;
const v91 = {};
v91.fileSize = v90;
const v92 = {
    limits: v91,
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
    safeFileNames: true,
    preserveExtension: true
};
const v93 = fileUpload(v92);
const v94 = app.use(v93);
v94;
const v96 = (request, response) => {
    const v95 = response.send('Admins welcome!');
    v95;
};
const v97 = app.get('/admin', v96);
v97;
const v100 = (request, response) => {
    const v98 = request.query;
    const redirect_url = v98['dest'];
    const v99 = response.redirect(redirect_url);
    v99;
};
const v101 = app.get('/open_redirect', v100);
v101;
const v106 = (request, response) => {
    const v102 = request.query;
    const filename = v102['page'];
    const v103 = response.setHeader('Content-Type', 'text/html');
    v103;
    const v104 = __dirname + `/${ filename }`;
    const v105 = response.sendFile(v104);
    v105;
};
const v107 = app.get('/local_file_inclusion', v106);
v107;
const v126 = (request, response) => {
    const v108 = request.query;
    const filename = v108['page'];
    const v109 = __dirname + '/';
    const file_path = v109 + filename;
    const v110 = `filename: ${ filename }`;
    const v111 = console.log(v110);
    v111;
    const v112 = `file_path: ${ file_path }`;
    const v113 = console.log(v112);
    v113;
    const v124 = (error, resolved_path) => {
        if (error) {
            const v114 = console.error(error);
            v114;
            return;
        }
        const v115 = `resolved_path = ${ resolved_path }`;
        const v116 = console.log(v115);
        v116;
        const v117 = resolved_path.startsWith(__dirname);
        if (v117) {
            const v120 = (error, data) => {
                if (error) {
                    const v118 = console.error(error);
                    v118;
                    return;
                }
                const v119 = response.send(data);
                v119;
            };
            const v121 = fs.readFile(resolved_path, v120);
            v121;
        } else {
            const v122 = `Trying to access outside dir: ${ resolved_path }`;
            const v123 = console.log(v122);
            v123;
        }
    };
    const v125 = fs.realpath(file_path, v124);
    v125;
};
const v127 = app.get('/directory_traversal', v126);
v127;
const v165 = async (request, response) => {
    const v128 = request.files;
    const file = v128.uploaded_image;
    const v129 = path.join(__dirname, 'uploads');
    const v130 = file.name;
    const desired_file_path = path.join(v129, v130);
    const v131 = console.log('Checking file extension and MIME type.');
    v131;
    const v132 = file.name;
    const v133 = v132.endsWith('.jpg');
    const v134 = file.mimetype;
    const v135 = v134 === 'image/jpeg';
    const v136 = v133 && v135;
    if (v136) {
        const v137 = console.log('Checking file contents with file command.');
        v137;
        const v138 = file.tempFilePath;
        const v139 = `file ${ v138 }`;
        const stdout = execSync(v139);
        const v140 = stdout.includes('JPEG');
        if (v140) {
            const v163 = error => {
                if (error) {
                    const v141 = `Error while moving the file: ${ error }.`;
                    const v142 = response.send(v141);
                    v142;
                    const v143 = response.end();
                    v143;
                    return;
                }
                response.statusCode = 200;
                const v144 = response.setHeader('Content-Type', 'text/html');
                v144;
                const v145 = file.name;
                const v146 = `File name: ${ v145 }.`;
                const v147 = response.write(v146);
                v147;
                const v148 = file.size;
                const v149 = `File size: ${ v148 }.`;
                const v150 = response.write(v149);
                v150;
                const v151 = file.md5;
                const v152 = `File hash: ${ v151 }.`;
                const v153 = response.write(v152);
                v153;
                const v154 = file.mimetype;
                const v155 = `MIME type: ${ v154 }.`;
                const v156 = response.write(v155);
                v156;
                const v157 = file.tempFilePath;
                const v158 = `Temp path: ${ v157 }.`;
                const v159 = response.write(v158);
                v159;
                const v160 = `Dest path: ${ desired_file_path }.`;
                const v161 = response.write(v160);
                v161;
                const v162 = response.end();
                v162;
            };
            const v164 = file.mv(desired_file_path, v163);
            v164;
        }
    }
};
const v166 = app.post('/file_upload', v165);
v166;
const v169 = () => {
    const v167 = `Web server listening on ${ port }`;
    const v168 = console.log(v167);
    v168;
};
const v170 = app.listen(port, v169);
v170;