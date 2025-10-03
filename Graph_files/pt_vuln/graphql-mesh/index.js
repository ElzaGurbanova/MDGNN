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
    const v52 = rawServeConfig;
    const cors = v52.corsConfig;
    const staticFiles = v52.staticFiles;
    const playground = v52.playgroundEnabled;
    const endpoint = v52.undefined;
    const router = createRouter();
    const v57 = () => {
        const v53 = !mesh$;
        if (v53) {
            const v54 = getBuiltMesh();
            const v56 = mesh => {
                readyFlag = true;
                const v55 = mesh.logger;
                logger = v55.child('HTTP');
                return mesh;
            };
            mesh$ = v54.then(v56);
        }
    };
    const v58 = router.all('*', v57);
    v58;
    const v61 = () => {
        const v59 = { status: 200 };
        const v60 = new Response(null, v59);
        return v60;
    };
    const v62 = router.all('/healthcheck', v61);
    v62;
    const v66 = () => {
        let v63;
        if (readyFlag) {
            v63 = 204;
        } else {
            v63 = 503;
        }
        const v64 = { status: v63 };
        const v65 = new Response(null, v64);
        return v65;
    };
    const v67 = router.all('/readiness', v66);
    v67;
    const v85 = async request => {
        if (readyFlag) {
            const v68 = await mesh$;
            const pubsub = v68.pubsub;
            let eventName;
            const v69 = pubsub.getEventNames();
            for (eventName of v69) {
                const v71 = request.url;
                const v70 = new URL(v71);
                const pathname = v70.pathname;
                const v72 = request.method;
                const v73 = v72.toLowerCase();
                const v74 = eventName === `webhook:${ v73 }:${ pathname }`;
                if (v74) {
                    const body = await request.text();
                    const v75 = `Received webhook request for ${ pathname }`;
                    const v76 = logger.debug(v75, body);
                    v76;
                    const v77 = request.headers;
                    const v78 = v77.get('content-type');
                    const v79 = v78 === 'application/json';
                    const v80 = JSON.parse(body);
                    let v81;
                    if (v79) {
                        v81 = v80;
                    } else {
                        v81 = body;
                    }
                    const v82 = pubsub.publish(eventName, v81);
                    v82;
                    const v83 = {
                        status: 204,
                        statusText: 'OK'
                    };
                    const v84 = new Response(null, v83);
                    return v84;
                }
            }
        }
        return undefined;
    };
    const v86 = router.post('*', v85);
    v86;
    if (staticFiles) {
        const v91 = async request => {
            let v87 = request.params;
            let relativePath = v87.relativePath;
            const v88 = !relativePath;
            if (v88) {
                relativePath = 'index.html';
            }
            const absolutePath = path.join(baseDir, staticFiles, relativePath);
            if (await pathExists(absolutePath)) {
                const readStream = fs.createReadStream(absolutePath);
                const v89 = { status: 200 };
                const v90 = new Response(readStream, v89);
                return v90;
            }
            return undefined;
        };
        const v92 = router.get('/:relativePath+', v91);
        v92;
    } else {
        const v93 = graphqlPath !== '/';
        if (v93) {
            const v97 = () => {
                const v94 = {};
                v94.Location = graphqlPath;
                const v95 = {
                    status: 302,
                    headers: v94
                };
                const v96 = new Response(null, v95);
                return v96;
            };
            const v98 = router.get('/', v97);
            v98;
        }
    }
    const v99 = router.all('*', withCookies);
    v99;
    const v100 = () => {
        return mesh$;
    };
    const v101 = graphqlHandler(v100, playgroundTitle, playgroundEnabled, graphqlPath, corsConfig);
    const v102 = router.all('*', v101);
    v102;
    return router;
};