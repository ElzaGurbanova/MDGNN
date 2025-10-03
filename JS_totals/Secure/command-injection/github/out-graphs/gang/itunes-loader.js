const plist = require('plist');
const shellescape = require('shell-escape');
const v44 = require('bluebird');
const promisify = v44.promisify;
const v45 = require('child_process');
const v46 = v45.exec;
const exec = promisify(v46);
const v47 = require('fs');
const v48 = v47.readFile;
const readFile = promisify(v48);
const v49 = require('debug');
const debug = v49('gang:itunes-loader');
const filename = 'iTunes Music Library.xml';
const find = function () {
    const v50 = [
        'mdfind',
        '-name',
        filename
    ];
    const cmd = shellescape(v50);
    const v51 = debug('finding itunes xml', cmd);
    v51;
    const v52 = exec(cmd);
    const v59 = function (stdout) {
        const source = stdout[0];
        const v53 = !source;
        const v54 = source.trim();
        const v55 = !v54;
        const v56 = v53 || v55;
        if (v56) {
            const v57 = new Error(`${ filename } not found`);
            throw v57;
        }
        const v58 = source.trim();
        return v58;
    };
    const v60 = v52.then(v59);
    return v60;
};
const parse = function (filename) {
    const v61 = `parsing ${ filename }`;
    const v62 = debug(v61);
    v62;
    const v63 = readFile(filename, 'utf8');
    const v82 = function (xml) {
        const library = plist.parse(xml);
        const tracks = [];
        var track;
        let id;
        const v64 = library.Tracks;
        for (id in v64) {
            const v65 = library.Tracks;
            track = v65[id];
            const v66 = track['Track Type'];
            const v67 = v66 === 'File';
            const v68 = track.Kind;
            const v69 = v68 === 'Internet audio stream';
            const v70 = v67 || v69;
            if (v70) {
                const v71 = track['Persistent ID'];
                const v72 = track.Name;
                const v73 = track['Album Artist'];
                const v74 = track.Artist;
                const v75 = v73 || v74;
                const v76 = v75 || '-= unknown artist =-';
                const v77 = track.Album;
                const v78 = track.Location;
                const v79 = {
                    id: v71,
                    name: v72,
                    artist: v76,
                    album: v77,
                    url: v78
                };
                const v80 = tracks.push(v79);
                v80;
            }
        }
        const v81 = debug('done');
        v81;
        return tracks;
    };
    const v83 = v63.then(v82);
    return v83;
};
const v86 = function () {
    const v84 = find();
    const v85 = v84.then(parse);
    return v85;
};
module.exports = v86;