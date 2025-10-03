const HTTP = require('http');
const FileSystem = require('fs');
const v66 = require('./response.js');
const ConfigureFilePath = v66.ConfigureFilePath;
const ConfigureHead = v66.ConfigureHead;
const Server = function Server(Options = {}) {
    const v67 = Options.folder;
    const v68 = process.cwd();
    const v69 = Options.folder;
    const v70 = v68 + v69;
    const v71 = process.cwd();
    let v72;
    if (v67) {
        v72 = v70;
    } else {
        v72 = v71;
    }
    const v73 = Options.index;
    const v74 = v73 || 'index.html';
    const v75 = Options.port;
    const v76 = v75 || 8000;
    const v77 = {};
    v77.RootFolder = v72;
    v77.IndexFile = v74;
    v77.Port = v76;
    this.Options = v77;
    const v117 = (Request, Response) => {
        const ReceivedRequest = Date.now();
        const v78 = this.Options;
        const v79 = Request.url;
        const FilePath = ConfigureFilePath(v78, v79);
        const v80 = new Date();
        const v81 = v80.toLocaleString();
        const v82 = Request.url;
        const v83 = `[${ v81 }] | [...] ${ v82 }`;
        const v84 = console.log(v83);
        v84;
        const v115 = function (SomeError, Data) {
            const v85 = !SomeError;
            if (v85) {
                const v86 = ConfigureHead(FilePath);
                const v87 = Response.writeHead(200, v86);
                v87;
                const v88 = Response.end(Data, 'utf-8');
                v88;
                const v89 = new Date();
                const v90 = v89.toLocaleString();
                const v91 = Request.url;
                const v92 = Date.now();
                const v93 = v92 - ReceivedRequest;
                const v94 = `[${ v90 }] | [200] ${ v91 } | [${ v93 }ms]`;
                const v95 = console.log(v94);
                v95;
            } else {
                const v96 = SomeError.code;
                const v97 = v96 === 'ENOENT';
                if (v97) {
                    const v98 = Response.writeHead(404);
                    v98;
                    const v99 = Response.end();
                    v99;
                    const v100 = new Date();
                    const v101 = v100.toLocaleString();
                    const v102 = Request.url;
                    const v103 = `[${ v101 }] | [404] ${ v102 }`;
                    const v104 = console.log(v103);
                    v104;
                } else {
                    const v105 = Response.writeHead(500);
                    v105;
                    const v106 = Response.end();
                    v106;
                    const v107 = new Date();
                    const v108 = v107.toLocaleString();
                    const v109 = Request.url;
                    const v110 = `[${ v108 }] | ${ v109 }`;
                    const v111 = console.log(v110);
                    v111;
                    const v112 = SomeError.code;
                    const v113 = `Internal Server Error: ${ v112 }`;
                    const v114 = console.log(v113);
                    v114;
                }
            }
        };
        const v116 = FileSystem.readFile(FilePath, v115);
        v116;
    };
    const v118 = HTTP.createServer(v117);
    this.Server = v118;
};
const Start = function Start() {
    const v119 = this.Server;
    const v120 = this.Options;
    const v121 = v120.Port;
    const v122 = v119.listen(v121);
    v122;
    const v123 = this.Options;
    const v124 = v123.RootFolder;
    const v125 = this.Options;
    const v126 = v125.Port;
    const v127 = `Serving files of ${ v124 } at port ${ v126 }`;
    const v128 = console.log(v127);
    v128;
};
Server.Start = Start;
const Stop = function Stop() {
    const v129 = console.log('Server stoped');
    v129;
    const v130 = process.exit();
    v130;
};
Server.Stop = Stop;
Server['is_class'] = true;
module.exports = Server;