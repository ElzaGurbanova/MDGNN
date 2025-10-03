const HTTP = require('http');
const FileSystem = require('fs');
const v75 = require('./response.js');
const ConfigureFilePath = v75.ConfigureFilePath;
const ConfigureHead = v75.ConfigureHead;
const Server = function Server(Options = {}) {
    const v76 = Options.folder;
    const v77 = process.cwd();
    const v78 = Options.folder;
    const v79 = v77 + v78;
    const v80 = process.cwd();
    let v81;
    if (v76) {
        v81 = v79;
    } else {
        v81 = v80;
    }
    const v82 = Options.index;
    const v83 = v82 || 'index.html';
    const v84 = Options.port;
    const v85 = v84 || 8000;
    const v86 = {};
    v86.RootFolder = v81;
    v86.IndexFile = v83;
    v86.Port = v85;
    this.Options = v86;
    const v135 = (Request, Response) => {
        const ReceivedRequest = Date.now();
        const v87 = this.Options;
        const v88 = Request.url;
        const FilePath = ConfigureFilePath(v87, v88);
        const v89 = new Date();
        const v90 = v89.toLocaleString();
        const v91 = Request.url;
        const v92 = `[${ v90 }] | [...] ${ v91 }`;
        const v93 = console.log(v92);
        v93;
        const v94 = !FilePath;
        if (v94) {
            const v95 = Response.writeHead(403);
            v95;
            const v96 = Response.end();
            v96;
            const v97 = new Date();
            const v98 = v97.toLocaleString();
            const v99 = Date.now();
            const v100 = v99 - ReceivedRequest;
            const v101 = `[${ v98 }] | [403] | [${ v100 }ms]`;
            const v102 = console.log(v101);
            v102;
            return;
        }
        const v133 = function (SomeError, Data) {
            const v103 = !SomeError;
            if (v103) {
                const v104 = ConfigureHead(FilePath);
                const v105 = Response.writeHead(200, v104);
                v105;
                const v106 = Response.end(Data, 'utf-8');
                v106;
                const v107 = new Date();
                const v108 = v107.toLocaleString();
                const v109 = Request.url;
                const v110 = Date.now();
                const v111 = v110 - ReceivedRequest;
                const v112 = `[${ v108 }] | [200] ${ v109 } | [${ v111 }ms]`;
                const v113 = console.log(v112);
                v113;
            } else {
                const v114 = SomeError.code;
                const v115 = v114 === 'ENOENT';
                if (v115) {
                    const v116 = Response.writeHead(404);
                    v116;
                    const v117 = Response.end();
                    v117;
                    const v118 = new Date();
                    const v119 = v118.toLocaleString();
                    const v120 = Request.url;
                    const v121 = `[${ v119 }] | [404] ${ v120 }`;
                    const v122 = console.log(v121);
                    v122;
                } else {
                    const v123 = Response.writeHead(500);
                    v123;
                    const v124 = Response.end();
                    v124;
                    const v125 = new Date();
                    const v126 = v125.toLocaleString();
                    const v127 = Request.url;
                    const v128 = `[${ v126 }] | ${ v127 }`;
                    const v129 = console.log(v128);
                    v129;
                    const v130 = SomeError.code;
                    const v131 = `Internal Server Error: ${ v130 }`;
                    const v132 = console.log(v131);
                    v132;
                }
            }
        };
        const v134 = FileSystem.readFile(FilePath, v133);
        v134;
    };
    const v136 = HTTP.createServer(v135);
    this.Server = v136;
};
const Start = function Start() {
    const v137 = this.Server;
    const v138 = this.Options;
    const v139 = v138.Port;
    const v140 = v137.listen(v139);
    v140;
    const v141 = this.Options;
    const v142 = v141.RootFolder;
    const v143 = this.Options;
    const v144 = v143.Port;
    const v145 = `Serving files of ${ v142 } at port ${ v144 }`;
    const v146 = console.log(v145);
    v146;
};
Server.Start = Start;
const Stop = function Stop() {
    const v147 = console.log('Server stoped');
    v147;
    const v148 = process.exit();
    v148;
};
Server.Stop = Stop;
Server['is_class'] = true;
module.exports = Server;