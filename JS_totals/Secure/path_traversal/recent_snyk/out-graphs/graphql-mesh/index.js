import {
    fs,
    path
} from '@graphql-mesh/cross-helpers';
import {
    DefaultLogger,
    pathExists,
    withCookies
} from '@graphql-mesh/utils';
import {
    createRouter,
    Response
} from '@whatwg-node/router';
import { graphqlHandler } from './graphqlHandler.js';
export const createMeshHTTPHandler = function ({baseDir, getBuiltMesh, rawServeConfig = {}, playgroundTitle}) {
    let readyFlag = false;
    let logger = new DefaultLogger('Mesh HTTP');
    let mesh$;
    const v54 = rawServeConfig;
    const cors = v54.corsConfig;
    const staticFiles = v54.staticFiles;
    const playground = v54.playgroundEnabled;
    const endpoint = v54.undefined;
    const router = createRouter();
    const v59 = () => {
        const v55 = !mesh$;
        if (v55) {
            const v56 = getBuiltMesh();
            const v58 = mesh => {
                readyFlag = true;
                const v57 = mesh.logger;
                logger = v57.child('HTTP');
                return mesh;
            };
            mesh$ = v56.then(v58);
        }
    };
    const v60 = router.all('*', v59);
    v60;
    const v63 = () => {
        const v61 = { status: 200 };
        const v62 = new Response(null, v61);
        return v62;
    };
    const v64 = router.all('/healthcheck', v63);
    v64;
    const v68 = () => {
        let v65;
        if (readyFlag) {
            v65 = 204;
        } else {
            v65 = 503;
        }
        const v66 = { status: v65 };
        const v67 = new Response(null, v66);
        return v67;
    };
    const v69 = router.all('/readiness', v68);
    v69;
    const v87 = async request => {
        if (readyFlag) {
            const v70 = await mesh$;
            const pubsub = v70.pubsub;
            let eventName;
            const v71 = pubsub.getEventNames();
            for (eventName of v71) {
                const v73 = request.url;
                const v72 = new URL(v73);
                const pathname = v72.pathname;
                const v74 = request.method;
                const v75 = v74.toLowerCase();
                const v76 = eventName === `webhook:${ v75 }:${ pathname }`;
                if (v76) {
                    const body = await request.text();
                    const v77 = `Received webhook request for ${ pathname }`;
                    const v78 = logger.debug(v77, body);
                    v78;
                    const v79 = request.headers;
                    const v80 = v79.get('content-type');
                    const v81 = v80 === 'application/json';
                    const v82 = JSON.parse(body);
                    let v83;
                    if (v81) {
                        v83 = v82;
                    } else {
                        v83 = body;
                    }
                    const v84 = pubsub.publish(eventName, v83);
                    v84;
                    const v85 = {
                        status: 204,
                        statusText: 'OK'
                    };
                    const v86 = new Response(null, v85);
                    return v86;
                }
            }
        }
        return undefined;
    };
    const v88 = router.post('*', v87);
    v88;
    if (staticFiles) {
        const v95 = async request => {
            let v89 = request.params;
            let relativePath = v89.relativePath;
            const v90 = !relativePath;
            if (v90) {
                relativePath = 'index.html';
            }
            const absoluteStaticFilesPath = path.join(baseDir, staticFiles);
            const absolutePath = path.join(absoluteStaticFilesPath, relativePath);
            const v91 = absolutePath.startsWith(absoluteStaticFilesPath);
            const v92 = v91 && await pathExists(absolutePath);
            if (v92) {
                const readStream = fs.createReadStream(absolutePath);
                const v93 = { status: 200 };
                const v94 = new Response(readStream, v93);
                return v94;
            }
            return undefined;
        };
        const v96 = router.get('/:relativePath+', v95);
        v96;
    } else {
        const v97 = graphqlPath !== '/';
        if (v97) {
            const v101 = () => {
                const v98 = {};
                v98.Location = graphqlPath;
                const v99 = {
                    status: 302,
                    headers: v98
                };
                const v100 = new Response(null, v99);
                return v100;
            };
            const v102 = router.get('/', v101);
            v102;
        }
    }
    const v103 = router.all('*', withCookies);
    v103;
    const v104 = () => {
        return mesh$;
    };
    const v105 = graphqlHandler(v104, playgroundTitle, playgroundEnabled, graphqlPath, corsConfig);
    const v106 = router.all('*', v105);
    v106;
    return router;
};