import path from 'path';
import fastifyStatic from '@fastify/static';
import fs from 'fs/promises';
export const audioRoutes = async function (fastify, options = {}) {
    const v57 = options;
    const outputDir = v57.undefined;
    const addContentDisposition = v57.undefined;
    const v58 = process.cwd();
    const audioFilesPath = path.resolve(v58, outputDir);
    const v59 = console.log('Audio files directory:', audioFilesPath);
    v59;
    const v61 = async () => {
        const v60 = {};
        v60.status = 'Audio routes working';
        return v60;
    };
    const v62 = fastify.get('/test', v61);
    v62;
    const v86 = async (request, reply) => {
        const v63 = request.params;
        const filename = v63.filename;
        const v64 = filename.includes('..');
        const v65 = filename.includes('/');
        const v66 = v64 || v65;
        const v67 = filename.includes('\\');
        const v68 = v66 || v67;
        if (v68) {
            const v69 = reply.code(400);
            const v70 = { error: 'Invalid filename' };
            const v71 = v69.send(v70);
            return v71;
        }
        const filePath = path.join(audioFilesPath, filename);
        try {
            await fs.access(filePath);
            const v72 = reply.header('Content-Type', 'audio/wav');
            v72;
            if (addContentDisposition) {
                const v73 = `attachment; filename="${ filename }"`;
                const v74 = reply.header('Content-Disposition', v73);
                v74;
            }
            const fileContent = await fs.readFile(filePath);
            const v75 = reply.send(fileContent);
            return v75;
        } catch (error) {
            const v76 = console.error('Error serving file:', error);
            v76;
            const v77 = error.code;
            const v78 = v77 === 'ENOENT';
            let v79;
            if (v78) {
                v79 = 404;
            } else {
                v79 = 500;
            }
            const v80 = reply.code(v79);
            const v81 = error.code;
            const v82 = v81 === 'ENOENT';
            let v83;
            if (v82) {
                v83 = 'File not found';
            } else {
                v83 = 'Error serving file';
            }
            const v84 = { error: v83 };
            const v85 = v80.send(v84);
            return v85;
        }
    };
    const v87 = fastify.get('/:filename', v86);
    v87;
    const v91 = res => {
        const v88 = res.setHeader('Content-Type', 'audio/wav');
        v88;
        if (addContentDisposition) {
            const filePath = req.url;
            const fileName = path.basename(filePath);
            const v89 = `attachment; filename="${ fileName }"`;
            const v90 = res.setHeader('Content-Disposition', v89);
            v90;
        }
    };
    const v92 = {
        root: audioFilesPath,
        prefix: '/static',
        decorateReply: false,
        setHeaders: v91
    };
    await fastify.register(fastifyStatic, v92);
    const v111 = async (request, reply) => {
        const v93 = request.params;
        const filename = v93.filename;
        const v94 = filename.includes('..');
        const v95 = filename.includes('/');
        const v96 = v94 || v95;
        const v97 = filename.includes('\\');
        const v98 = v96 || v97;
        if (v98) {
            const v99 = reply.code(400);
            const v100 = { error: 'Invalid filename' };
            const v101 = v99.send(v100);
            return v101;
        }
        const filePath = path.join(audioFilesPath, filename);
        try {
            await fs.unlink(filePath);
            const v102 = {};
            v102.success = true;
            v102.message = `File ${ filename } deleted`;
            return v102;
        } catch (error) {
            const v103 = error.code;
            const v104 = v103 === 'ENOENT';
            if (v104) {
                const v105 = reply.code(404);
                const v106 = { error: 'File not found' };
                const v107 = v105.send(v106);
                return v107;
            }
            const v108 = reply.code(500);
            const v109 = { error: 'Failed to delete file' };
            const v110 = v108.send(v109);
            return v110;
        }
    };
    const v112 = fastify.delete('/:filename', v111);
    v112;
};