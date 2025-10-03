import {
    S3Client,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const v32 = process.env;
const v33 = v32.R2_ENDPOINT_URL;
const v34 = process.env;
const v35 = v34.R2_ACCESS_KEY_ID;
const v36 = process.env;
const v37 = v36.R2_SECRET_ACCESS_KEY;
const v38 = {};
v38.accessKeyId = v35;
v38.secretAccessKey = v37;
const v39 = {
    region: 'auto',
    endpoint: v33,
    credentials: v38
};
const s3Client = new S3Client(v39);
export default const handler = async function (req, res) {
    const v40 = req.method;
    const v41 = v40 !== 'GET';
    if (v41) {
        const v42 = res.status(405);
        const v43 = { error: 'Method not allowed' };
        const v44 = v42.json(v43);
        return v44;
    }
    try {
        const v45 = req.query;
        const filename = v45.filename;
        const v46 = !filename;
        const v47 = filename.includes('..');
        const v48 = v46 || v47;
        const v49 = filename.includes('/');
        const v50 = v48 || v49;
        if (v50) {
            const v51 = res.status(400);
            const v52 = { error: 'Invalid filename' };
            const v53 = v51.json(v52);
            return v53;
        }
        const r2Key = filename;
        const v54 = process.env;
        const v55 = v54.R2_BUCKET_NAME;
        const v56 = {
            Bucket: v55,
            Key: r2Key
        };
        const command = new GetObjectCommand(v56);
        const v57 = { expiresIn: 3600 };
        const signedUrl = await getSignedUrl(s3Client, command, v57);
        const v58 = res.redirect(signedUrl);
        v58;
    } catch (error) {
        const v59 = console.error('Error serving video:', error);
        v59;
        const v60 = res.status(500);
        const v61 = { error: 'Failed to serve video' };
        const v62 = v60.json(v61);
        v62;
    }
};