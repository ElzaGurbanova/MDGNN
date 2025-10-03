import { createServer } from 'vite';
import express from 'express';
import getPort from 'get-port';
import { globby } from 'globby';
import boxen from 'boxen';
import chokidar from 'chokidar';
import openBrowser from './open-browser.js';
import debug from './debug.js';
import getBaseViteConfig from './vite-base.js';
import { getMetaJsonObject } from './vite-plugin/generate/get-meta-json.js';
import { getEntryData } from './vite-plugin/parse/get-entry-data.js';
const bundler = async (config, configFolder) => {
    const app = express();
    const v94 = config.port;
    const v95 = [
        v94,
        61001,
        62002,
        62003,
        62004,
        62005
    ];
    const v96 = { port: v95 };
    const port = await getPort(v96);
    const v97 = [
        24678,
        24679,
        24680,
        24681,
        24682,
        24683,
        24684,
        24685
    ];
    const v98 = { port: v97 };
    const hmrPort = await getPort(v98);
    const v99 = `Port set to: ${ port }`;
    const v100 = debug(v99);
    v100;
    try {
        const v101 = config.mode;
        const v102 = v101 || 'development';
        const v103 = config.port;
        const v104 = {};
        v104.port = hmrPort;
        const v105 = {};
        v105.strict = false;
        const v106 = {};
        v106.port = v103;
        v106.hmr = v104;
        v106.fs = v105;
        v106.middlewareMode = true;
        const v107 = {
            mode: v102,
            server: v106
        };
        const viteConfig = await getBaseViteConfig(config, configFolder, v107);
        const vite = await createServer(viteConfig);
        const v108 = vite;
        const moduleGraph = v108.moduleGraph;
        const ws = v108.ws;
        const v110 = async (_, res) => {
            const v109 = res.sendStatus(200);
            return v109;
        };
        const v111 = app.head('*', v110);
        v111;
        const v119 = async (_, res) => {
            const v112 = config.stories;
            const v113 = Array.isArray(v112);
            const v114 = config.stories;
            const v115 = config.stories;
            const v116 = [v115];
            let v117;
            if (v113) {
                v117 = v114;
            } else {
                v117 = v116;
            }
            const entryData = await getEntryData(await globby(v117));
            const jsonContent = getMetaJsonObject(entryData);
            const v118 = res.json(jsonContent);
            v118;
        };
        const v120 = app.get('/meta.json', v119);
        v120;
        const v121 = viteConfig;
        const base = v121.base;
        const v122 = base !== '/';
        const v123 = base && v122;
        const v124 = base !== './';
        const v125 = v123 && v124;
        if (v125) {
            const v127 = (_, res) => {
                const v126 = res.redirect(base);
                return v126;
            };
            const v128 = app.get('/', v127);
            v128;
            const v130 = (_, res) => {
                const v129 = res.redirect(base);
                return v129;
            };
            const v131 = app.get('/index.html', v130);
            v131;
        }
        const v132 = vite.middlewares;
        const v133 = app.use(v132);
        v133;
        const v134 = vite.config;
        const v135 = v134.server;
        const v136 = v135.https;
        let v137;
        if (v136) {
            v137 = 'https';
        } else {
            v137 = 'http';
        }
        const v138 = vite.config;
        const v139 = v138.server;
        const v140 = v139.host;
        const v141 = v140 || 'localhost';
        const v142 = vite.config;
        const v143 = v142.base;
        const v144 = v143 || '';
        const serverUrl = `${ v137 }://${ v141 }:${ port }${ v144 }`;
        const v160 = async () => {
            const v145 = `🥄 Ladle.dev served at ${ serverUrl }`;
            const v146 = {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'yellow',
                titleAlignment: 'center',
                textAlignment: 'center'
            };
            const v147 = boxen(v145, v146);
            const v148 = console.log(v147);
            v148;
            const v149 = vite.config;
            const v150 = v149.server;
            const v151 = v150.open;
            const v152 = v151 !== 'none';
            const v153 = vite.config;
            const v154 = v153.server;
            const v155 = v154.open;
            const v156 = v155 !== false;
            const v157 = v152 && v156;
            if (v157) {
                const v158 = vite.config;
                const v159 = v158.server;
                const browser = v159.open;
                await openBrowser(serverUrl, browser);
            }
        };
        const v161 = app.listen(port, v160);
        v161;
        const v162 = config.stories;
        const v163 = {
            persistent: true,
            ignoreInitial: true
        };
        const watcher = chokidar.watch(v162, v163);
        let checkSum = '';
        const getChecksum = async () => {
            try {
                const v164 = config.stories;
                const v165 = Array.isArray(v164);
                const v166 = config.stories;
                const v167 = config.stories;
                const v168 = [v167];
                let v169;
                if (v165) {
                    v169 = v166;
                } else {
                    v169 = v168;
                }
                const entryData = await getEntryData(await globby(v169));
                const jsonContent = getMetaJsonObject(entryData);
                const v170 = jsonContent.stories;
                const v171 = Object.keys(v170);
                const v176 = storyId => {
                    const v172 = jsonContent.stories;
                    const v173 = v172[storyId];
                    v173.locStart = 0;
                    const v174 = jsonContent.stories;
                    const v175 = v174[storyId];
                    v175.locEnd = 0;
                };
                const v177 = v171.forEach(v176);
                v177;
                const v178 = JSON.stringify(jsonContent);
                return v178;
            } catch (e) {
                return checkSum;
            }
        };
        checkSum = await getChecksum();
        const invalidate = async () => {
            const newChecksum = await getChecksum();
            const v179 = checkSum === newChecksum;
            if (v179) {
                return;
            }
            checkSum = newChecksum;
            const module = moduleGraph.getModuleById('\0virtual:generated-list');
            if (module) {
                const v180 = moduleGraph.invalidateModule(module);
                v180;
                if (ws) {
                    const v181 = {
                        type: 'full-reload',
                        path: '*'
                    };
                    const v182 = ws.send(v181);
                    v182;
                }
            }
        };
        const v183 = watcher.on('add', invalidate);
        const v184 = v183.on('change', invalidate);
        const v185 = v184.on('unlink', invalidate);
        v185;
    } catch (e) {
        const v186 = console.log(e);
        v186;
    }
};
export default bundler;