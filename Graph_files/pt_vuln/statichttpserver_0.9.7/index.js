const fs = require('fs');
const v58 = (request, response) => {
    const v56 = resolve => {
        let options = request.options;
        const v30 = options.headers;
        if (v30) {
            const v31 = options.headers;
            const v32 = Object.keys(v31);
            const v36 = key => {
                const v33 = options.headers;
                const v34 = v33[key];
                const v35 = response.setHeader(key, v34);
                v35;
            };
            const v37 = v32.forEach(v36);
            v37;
        }
        const v38 = options.mimeType;
        if (v38) {
            const v39 = options.mimeType;
            const v40 = response.setHeader('content-type', v39);
            v40;
        }
        const v41 = request.method;
        const v42 = v41 == 'HEAD';
        if (v42) {
            const v43 = response.end();
            return v43;
        }
        const v44 = options.html;
        const v45 = options.text;
        const v46 = v44 || v45;
        if (v46) {
            const v47 = options.html;
            const v48 = options.text;
            const v49 = v47 || v48;
            const v50 = response.write(v49);
            v50;
            const v51 = response.end();
            v51;
        } else {
            const v52 = options.filePath;
            const v53 = fs.createReadStream(v52);
            const v54 = v53.pipe(response);
            v54;
        }
        const v55 = resolve();
        v55;
    };
    const v57 = new Promise(v56);
    return v57;
};
module.exports = v58;