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
    const v107 = config.port;
    const v108 = [
        v107,
        61001,
        62002,
        62003,
        62004,
        62005
    ];
    const v109 = { port: v108 };
    const port = await getPort(v109);
    const v110 = [
        24678,
        24679,
        24680,
        24681,
        24682,
        24683,
        24684,
        24685
    ];
    const v111 = { port: v110 };
    const hmrPort = await getPort(v111);
    const v112 = `Port set to: ${ port }`;
    const v113 = debug(v112);
    v113;
    try {
        const v114 = config.mode;
        const v115 = v114 || 'development';
        const v116 = config.port;
        const v117 = {};
        v117.port = hmrPort;
        const v118 = {};
        v118.port = v116;
        v118.hmr = v117;
        v118.middlewareMode = true;
        const v119 = {
            mode: v115,
            server: v118
        };
        const viteConfig = await getBaseViteConfig(config, configFolder, v119);
        const vite = await createServer(viteConfig);
        const v120 = vite;
        const moduleGraph = v120.moduleGraph;
        const ws = v120.ws;
        const v122 = async (_, res) => {
            const v121 = res.sendStatus(200);
            return v121;
        };
        const v123 = app.head('*', v122);
        v123;
        const v131 = async (_, res) => {
            const v124 = config.stories;
            const v125 = Array.isArray(v124);
            const v126 = config.stories;
            const v127 = config.stories;
            const v128 = [v127];
            let v129;
            if (v125) {
                v129 = v126;
            } else {
                v129 = v128;
            }
            const entryData = await getEntryData(await globby(v129));
            const jsonContent = getMetaJsonObject(entryData);
            const v130 = res.json(jsonContent);
            v130;
        };
        const v132 = app.get('/meta.json', v131);
        v132;
        const v133 = viteConfig;
        const base = v133.base;
        const v134 = base !== '/';
        const v135 = base && v134;
        const v136 = base !== './';
        const v137 = v135 && v136;
        if (v137) {
            const v139 = (_, res) => {
                const v138 = res.redirect(base);
                return v138;
            };
            const v140 = app.get('/', v139);
            v140;
            const v142 = (_, res) => {
                const v141 = res.redirect(base);
                return v141;
            };
            const v143 = app.get('/index.html', v142);
            v143;
        }
        const v144 = vite.middlewares;
        const v145 = app.use(v144);
        v145;
        const v146 = vite.config;
        const v147 = v146.server;
        const v148 = v147.https;
        let v149;
        if (v148) {
            v149 = 'https';
        } else {
            v149 = 'http';
        }
        const v150 = vite.config;
        const v151 = v150.server;
        const v152 = v151.host;
        const v153 = v152 || 'localhost';
        const v154 = vite.config;
        const v155 = v154.base;
        const v156 = v155 || '';
        const serverUrl = `${ v149 }://${ v153 }:${ port }${ v156 }`;
        const v157 = vite.config;
        const v158 = v157.server;
        const v159 = v158.host;
        const v160 = v159 === true;
        const v161 = vite.config;
        const v162 = v161.server;
        const v163 = v162.host;
        const v164 = typeof v163;
        const v165 = v164 === 'string';
        const v166 = vite.config;
        const v167 = v166.server;
        const v168 = v167.host;
        let v169;
        if (v165) {
            v169 = v168;
        } else {
            v169 = 'localhost';
        }
        let v170;
        if (v160) {
            v170 = '0.0.0.0';
        } else {
            v170 = v169;
        }
        const v186 = async () => {
            const v171 = `🥄 Ladle.dev served at ${ serverUrl }`;
            const v172 = {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'yellow',
                titleAlignment: 'center',
                textAlignment: 'center'
            };
            const v173 = boxen(v171, v172);
            const v174 = console.log(v173);
            v174;
            const v175 = vite.config;
            const v176 = v175.server;
            const v177 = v176.open;
            const v178 = v177 !== 'none';
            const v179 = vite.config;
            const v180 = v179.server;
            const v181 = v180.open;
            const v182 = v181 !== false;
            const v183 = v178 && v182;
            if (v183) {
                const v184 = vite.config;
                const v185 = v184.server;
                const browser = v185.open;
                await openBrowser(serverUrl, browser);
            }
        };
        const v187 = app.listen(port, v170, v186);
        v187;
        const v188 = config.stories;
        const v189 = {
            persistent: true,
            ignoreInitial: true
        };
        const watcher = chokidar.watch(v188, v189);
        let checkSum = '';
        const getChecksum = async () => {
            try {
                const v190 = config.stories;
                const v191 = Array.isArray(v190);
                const v192 = config.stories;
                const v193 = config.stories;
                const v194 = [v193];
                let v195;
                if (v191) {
                    v195 = v192;
                } else {
                    v195 = v194;
                }
                const entryData = await getEntryData(await globby(v195));
                const jsonContent = getMetaJsonObject(entryData);
                const v196 = jsonContent.stories;
                const v197 = Object.keys(v196);
                const v202 = storyId => {
                    const v198 = jsonContent.stories;
                    const v199 = v198[storyId];
                    v199.locStart = 0;
                    const v200 = jsonContent.stories;
                    const v201 = v200[storyId];
                    v201.locEnd = 0;
                };
                const v203 = v197.forEach(v202);
                v203;
                const v204 = JSON.stringify(jsonContent);
                return v204;
            } catch (e) {
                return checkSum;
            }
        };
        checkSum = await getChecksum();
        const invalidate = async () => {
            const newChecksum = await getChecksum();
            const v205 = checkSum === newChecksum;
            if (v205) {
                return;
            }
            checkSum = newChecksum;
            const module = moduleGraph.getModuleById('\0virtual:generated-list');
            if (module) {
                const v206 = moduleGraph.invalidateModule(module);
                v206;
                if (ws) {
                    const v207 = {
                        type: 'full-reload',
                        path: '*'
                    };
                    const v208 = ws.send(v207);
                    v208;
                }
            }
        };
        const v209 = watcher.on('add', invalidate);
        const v210 = v209.on('change', invalidate);
        const v211 = v210.on('unlink', invalidate);
        v211;
    } catch (e) {
        const v212 = console.log(e);
        v212;
    }
};
export default bundler;