var fs = require('fs');
var statusHandlers = require('./statusHandlers');
var handleRange = function (res, file, stat) {
    var total = stat.size;
    const v28 = range.replace(/bytes=/, '');
    var parts = v28.split('-');
    var partialstart = parts[0];
    var partialend = parts[1];
    var start = parseInt(partialstart, 10);
    let end;
    const v29 = parseInt(partialend, 10);
    const v30 = total - 1;
    if (partialend) {
        end = v29;
    } else {
        end = v30;
    }
    const v31 = end - start;
    var chunksize = v31 + 1;
    const v32 = {
        start: start,
        end: end
    };
    var fstream = fs.createReadStream(file, v32);
    const v33 = 'bytes ' + start;
    const v34 = v33 + '-';
    const v35 = v34 + end;
    const v36 = v35 + '/';
    const v37 = v36 + total;
    const v38 = contentType || 'application/octet-stream';
    const v39 = {
        'Content-Range': v37,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': v38
    };
    const v40 = res.writeHead(206, v39);
    v40;
    const v41 = fstream.pipe(res);
    return v41;
};
var handleHead = function (req, res) {
    const v42 = req.statusCode;
    res.statusCode = v42 || 200;
    const v43 = res.end();
    return v43;
};
var streamResponse = function (res, file, stat, next) {
    var stream = fs.createReadStream(file);
    const v44 = stat.size;
    const v45 = res.setHeader('content-length', v44);
    v45;
    const v46 = stream.pipe(res);
    v46;
    const v49 = function (err) {
        const v47 = { error: err };
        const v48 = statusHandlers['500'](res, next, v47);
        v48;
    };
    const v50 = stream.on('error', v49);
    v50;
    const v52 = function () {
        res.statusCode = 200;
        const v51 = res.end();
        v51;
    };
    const v53 = stream.on('end', v52);
    v53;
};
const v54 = {};
v54.handleHead = handleHead;
v54.handleRange = handleRange;
v54.handleGet = streamResponse;
v54.handlePut = streamResponse;
v54.handlePost = streamResponse;
v54.handleDelete = streamResponse;
module.exports = v54;